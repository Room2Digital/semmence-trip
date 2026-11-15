// flight-live — live status for the trip's flights, from AeroDataBox (RapidAPI free Basic plan).
// Returns cached status; only re-asks AeroDataBox when a flight is near:
//   >2 days out: never; 2 days–6h out: every 6h; last 6h/in air: every 30 min; >4h after landing: never.
// CALL_CAP keeps it inside the free plan's hard 400-unit limit (2 units per call), so it can never cost anything.
// Cache lives in a private Storage bucket, so no database tables are needed.
// ?debug=1 lists the flights it is watching. ?force=QR330|2026-11-19 fetches one flight now (uses 1 call).

const SB = Deno.env.get("SUPABASE_URL")!;
const SR = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const KEY = Deno.env.get("AERODATABOX_KEY") || "";
const BUCKET = "flight-live";
const OBJ = "status.json";
const CALL_CAP = 180;

const H = { apikey: SR, Authorization: `Bearer ${SR}` };
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
};

type Live = {
  status?: string;
  depSched?: string; depBest?: string; depActual?: boolean;
  arrSched?: string; arrBest?: string; arrActual?: boolean;
  depTerminal?: string; depGate?: string; checkIn?: string;
  arrTerminal?: string; arrGate?: string; belt?: string;
  aircraft?: string; fetched: number; error?: string;
};
type Cache = { month: string; calls: number; flights: Record<string, Live> };

const month = () => new Date().toISOString().slice(0, 7);

async function readCache(): Promise<Cache> {
  const r = await fetch(`${SB}/storage/v1/object/${BUCKET}/${OBJ}`, { headers: H });
  if (r.ok) {
    try {
      const c = await r.json();
      if (c.month !== month()) { c.month = month(); c.calls = 0; }
      return c;
    } catch (_) { /* fall through */ }
  } else {
    await fetch(`${SB}/storage/v1/bucket`, {
      method: "POST",
      headers: { ...H, "Content-Type": "application/json" },
      body: JSON.stringify({ id: BUCKET, name: BUCKET, public: false }),
    });
  }
  return { month: month(), calls: 0, flights: {} };
}

async function writeCache(c: Cache) {
  await fetch(`${SB}/storage/v1/object/${BUCKET}/${OBJ}`, {
    method: "POST",
    headers: { ...H, "Content-Type": "application/json", "x-upsert": "true" },
    body: JSON.stringify(c),
  });
}

const normNo = (s: string) => {
  const t = String(s || "").toUpperCase().replace(/\s+/g, "");
  const m = t.match(/^([A-Z0-9]{2})0*(\d+[A-Z]?)$/);
  return m ? m[1] + m[2] : t;
};
const keyOf = (f: any) => `${normNo(f.no)}|${String(f.dep || "").slice(0, 10)}`;
const ms = (s?: string) =>
  s ? new Date(s.length <= 16 ? s.replace(" ", "T") + "Z" : s.replace(" ", "T")).getTime() : NaN;

function due(f: any, l: Live | undefined, now: number): boolean {
  const dep = ms(l?.depBest || l?.depSched) || ms(f.dep);
  const arr = ms(l?.arrBest || l?.arrSched) || ms(f.arr) || dep + 12 * 3600e3;
  if (!isFinite(dep)) return false;
  if (now < dep - 48 * 3600e3) return false;
  if (now > arr + 4 * 3600e3) return false;
  if (l?.status && /arrived|landed|canceled|cancelled/i.test(l.status) && now > arr) return false;
  const age = l ? now - l.fetched : Infinity;
  const gap = now < dep - 6 * 3600e3 ? 6 * 3600e3 : 30 * 60e3;
  return age >= gap;
}

const tstr = (t: any) => t?.local || t?.utc || undefined;

async function fetchOne(f: any): Promise<Live> {
  const no = normNo(f.no);
  const date = String(f.dep).slice(0, 10);
  const url = `https://aerodatabox.p.rapidapi.com/flights/number/${encodeURIComponent(no)}/${date}?withAircraftImage=false&withLocation=false&dateLocalRole=Departure`;
  const r = await fetch(url, {
    headers: { "x-rapidapi-key": KEY, "x-rapidapi-host": "aerodatabox.p.rapidapi.com" },
  });
  if (r.status === 204) return { fetched: Date.now(), error: "No data yet" };
  if (!r.ok) return { fetched: Date.now(), error: `HTTP ${r.status}` };
  const body = await r.json();
  const x = (Array.isArray(body) ? body : [body])[0];
  if (!x) return { fetched: Date.now(), error: "No data yet" };
  const d = x.departure || {}, a = x.arrival || {};
  const dBest = d.runwayTime || d.revisedTime || d.predictedTime;
  const aBest = a.runwayTime || a.revisedTime || a.predictedTime;
  return {
    status: x.status,
    depSched: tstr(d.scheduledTime), depBest: tstr(dBest), depActual: !!d.runwayTime,
    arrSched: tstr(a.scheduledTime), arrBest: tstr(aBest), arrActual: !!a.runwayTime,
    depTerminal: d.terminal, depGate: d.gate, checkIn: d.checkInDesk,
    arrTerminal: a.terminal, arrGate: a.gate, belt: a.baggageBelt,
    aircraft: x.aircraft?.model,
    fetched: Date.now(),
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  const json = (b: unknown, s = 200) =>
    new Response(JSON.stringify(b), { status: s, headers: { ...CORS, "Content-Type": "application/json" } });
  try {
    const url = new URL(req.url);
    const force = url.searchParams.get("force");
    const tr = await fetch(`${SB}/rest/v1/trip_app?id=eq.1&select=data`, { headers: H });
    const flights: any[] = ((await tr.json())?.[0]?.data?.flights || []).filter(
      (f: any) => f && f.no && f.dep && !f.tbc,
    );
    const cache = await readCache();
    const now = Date.now();
    const done = new Set<string>();
    let changed = false;
    if (KEY) {
      for (const f of flights) {
        const k = keyOf(f);
        if (done.has(k)) continue; // same flight booked for two travellers
        if (cache.calls >= CALL_CAP) break;
        if (!(force === k || due(f, cache.flights[k], now))) continue;
        done.add(k);
        cache.calls++;
        changed = true;
        try {
          const l = await fetchOne(f);
          cache.flights[k] = l.error && cache.flights[k]?.status ? { ...cache.flights[k], fetched: l.fetched } : l;
        } catch (e) {
          cache.flights[k] = { ...(cache.flights[k] || {}), fetched: now, error: String(e) };
        }
      }
    }
    if (changed) await writeCache(cache);
    const out: any = { flights: cache.flights, calls: cache.calls, cap: CALL_CAP, configured: !!KEY, source: "AeroDataBox" };
    if (url.searchParams.get("debug") === "1") {
      out.trip = flights.map((f) => ({ key: keyOf(f), dep: f.dep, arr: f.arr, who: f.who }));
    }
    return json(out);
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});

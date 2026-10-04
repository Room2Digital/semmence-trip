const SB_URL = "https://xsgvdwoekpluynhsdlxm.supabase.co",
  SB_KEY = "sb_publishable_5LTV2buBZgF3Fg0UVfOjvw_YiRD3oqc",
  store = {
    get(e, t) {
      try {
        const n = localStorage.getItem(e);
        return null === n ? t : JSON.parse(n);
      } catch (e) {
        return t;
      }
    },
    set(e, t) {
      try {
        localStorage.setItem(e, JSON.stringify(t));
      } catch (e) {}
    },
  };
let T = null,
  WHO = store.get("who", "ALL"),
  TAB = "home",
  STALE = !1;
const D = (e) => {
    const [t, n, s] = e.slice(0, 10).split("-").map(Number);
    return new Date(t, n - 1, s);
  },
  DT = (e) => {
    const [t, n] = e.split("T"),
      [s, a, i] = t.split("-").map(Number),
      [o, l] = (n || "00:00").split(":").map(Number);
    return new Date(s, a - 1, i, o, l);
  },
  iso = (e) =>
    e.getFullYear() +
    "-" +
    String(e.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(e.getDate()).padStart(2, "0"),
  today = () => {
    const e = new Date();
    return new Date(e.getFullYear(), e.getMonth(), e.getDate());
  },
  nDays = (e, t) => Math.round((t - e) / 864e5),
  DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  MONL = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  fmt = (e) => {
    const t = D(e);
    return DOW[t.getDay()] + " " + t.getDate() + " " + MON[t.getMonth()];
  },
  fmtS = (e) => {
    const t = D(e);
    return t.getDate() + " " + MON[t.getMonth()];
  },
  fmtL = (e) => {
    const t = D(e);
    return DOW[t.getDay()] + " " + t.getDate() + " " + MON[t.getMonth()] + " " + t.getFullYear();
  },
  tm = (e) => (e && e.includes("T") ? e.split("T")[1] : e || ""),
  esc = (e) =>
    String(null == e ? "" : e).replace(
      /[&<>"]/g,
      (e) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[e],
    ),
  mine = (e) => "ALL" === WHO || "RP" === e.who || e.who === WHO,
  whoChip = (e) =>
    "ALL" !== WHO
      ? ""
      : `<span class="mchip who-${e}">${"RP" === e ? "Everyone" : "R" === e ? "Robbie" : "Mum &amp; Dad"}</span>`,
  city = (e) => T.cities[e] || { name: e, code: e },
  money = (e, t) =>
    null == e
      ? ""
      : ("GBP" === t
          ? "£"
          : "USD" === t
            ? "$"
            : "THB" === t
              ? "฿"
              : "AUD" === t
                ? "A$"
                : "QAR" === t
                  ? "QAR "
                  : t + " ") +
        e.toLocaleString("en-GB", {
          minimumFractionDigits: e % 1 ? 2 : 0,
          maximumFractionDigits: 2,
        }),
  mapURL = (e, t) =>
    e
      ? `https://maps.google.com/?q=${e}(${encodeURIComponent(t)})`
      : `https://maps.google.com/?q=${encodeURIComponent(t)}`,
  mapLink = (e, t) =>
    `<a class="maplink" href="${mapURL(e, t)}" target="_blank" rel="noopener">◎ Open in Maps</a>`,
  inAU = (e) => {
    const t = llOf(e);
    return !!t && t[0] < -9 && t[0] > -45 && t[1] > 112 && t[1] < 155;
  },
  wazeURL = (e) => {
    const t = llOf(e);
    return `https://waze.com/ul?ll=${t[0]},${t[1]}&navigate=yes`;
  },
  wazeLink = (e) =>
    inAU(e)
      ? `<a class="maplink waze" href="${wazeURL(e)}" target="_blank" rel="noopener">▲ Open in Waze</a>`
      : "";
function events() {
  const e = [];
  return (
    T.flights
      .filter(mine)
      .forEach((t) =>
        e.push({
          d: t.dep.slice(0, 10),
          t: tm(t.dep),
          who: t.who,
          kind: "flight",
          title: `${t.no} · ${city(t.from).code} → ${city(t.to).code}`,
          sub: t.tbc
            ? "Not booked"
            : `${t.airline} · lands ${tm(t.arr)}${t.arr.slice(0, 10) !== t.dep.slice(0, 10) ? " +1" : ""}`,
          at: DT(t.dep),
          endT: t.arr.slice(0, 10) === t.dep.slice(0, 10) ? tm(t.arr) : "23:59",
        }),
      ),
    T.transfers
      .filter(mine)
      .forEach((t) =>
        e.push({
          d: t.date,
          t: t.time || "",
          who: t.who,
          kind: "transfer",
          title: `${t.kind} · ${t.label || city(t.from).name + " → " + city(t.to).name}`,
          sub: t.tbc ? "Not booked" : t.included ? "Included" : "",
          at: DT(t.date + "T" + (t.time || "12:00")),
        }),
      ),
    T.stays.filter(mine).forEach((t) => {
      (e.push({
        d: t.in.slice(0, 10),
        t: "00:00" === tm(t.in) ? "" : tm(t.in),
        who: t.who,
        kind: "in",
        title: "Check in · " + t.name,
        sub: city(t.city).name,
        at: DT(t.in),
      }),
        e.push({
          d: t.out.slice(0, 10),
          t: "00:00" === tm(t.out) ? "" : tm(t.out),
          who: t.who,
          kind: "out",
          title: "Check out · " + t.name,
          sub: city(t.city).name,
          at: DT(t.out),
        }));
    }),
    T.activities
      .filter(mine)
      .forEach((t) =>
        e.push({
          d: t.date,
          t: t.start || "",
          who: t.who,
          kind: "act",
          title: t.name,
          sub: [t.type, t.loc].filter(Boolean).join(" · "),
          at: DT(t.date + "T" + (t.start || "09:00")),
          endT: t.end,
        }),
      ),
    e.sort((e, t) => e.at - t.at)
  );
}
const onDay = (e) => events().filter((t) => t.d === e),
  stayOn = (e) =>
    T.stays.filter(mine).find((t) => t.in.slice(0, 10) <= e && e < t.out.slice(0, 10)),
  gapOn = (e) => T.gaps.filter(mine).find((t) => t.from <= e && e < t.to);
function whereOn(e) {
  const t = stayOn(e);
  if (t) return city(t.city);
  const n = gapOn(e);
  if (n) return city(n.city);
  return T.flights.filter(mine).find((t) => t.dep.slice(0, 10) === e)
    ? { name: "In transit", code: "—", tz: null }
    : null;
}
function nextFlight() {
  if (!T || !T.flights) return null;
  const e = Date.now();
  return (
    T.flights
      .filter(mine)
      .filter((t) => t.dep && new Date(t.dep).getTime() > e)
      .slice()
      .sort((e, t) => e.dep.localeCompare(t.dep))[0] || null
  );
}
function flightCD() {
  return '<div class="card cdw">\n    <div class="cd-top"><span class="cd-dot"></span><span class="kicker">Next flight</span></div>\n    <div class="cd-route" id="cdRoute">&mdash;</div>\n    <div class="cdgrid">\n      <div class="cdu"><b id="cd-d">--</b><i>days</i></div>\n      <div class="cdu"><b id="cd-h">--</b><i>hrs</i></div>\n      <div class="cdu"><b id="cd-m">--</b><i>min</i></div>\n      <div class="cdu"><b id="cd-s">--</b><i>sec</i></div>\n    </div>\n    <div class="cd-when" id="cdWhen"></div>\n  </div>';
}
const NAVI = {
  flights:
    '<path d="M21 15.5 3 10V6.6l2 .7 1.6 2.3 5.1 1.6L9.2 3h2.6l5.4 7.9 3.4 1c.9.3 1.4.9 1.4 1.8v1.8z"/><path d="M3 19.5h18"/>',
  stays: '<path d="M3 21V9l9-6 9 6v12"/><path d="M9 21v-6h6v6"/>',
  plans:
    '<path d="M8 3v4M16 3v4"/><rect x="3" y="6" width="18" height="15" rx="2"/><path d="M3 11h18"/><path d="M8.5 15.5 11 18l4.5-4.5"/>',
  ideas:
    '<path d="M9 18h6"/><path d="M10 21h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.3 1.1 2.2h5c.1-.9.5-1.7 1.1-2.2A6 6 0 0 0 12 3z"/>',
  map: '<path d="m9 4-6 2.5v13L9 17l6 3 6-2.5v-13L15 7z"/><path d="M9 4v13"/><path d="M15 7v13"/>',
};
function navBtn(e, t, n, s, a, i, o) {
  return `<button class="navb${o ? " wide" : ""}" onclick="${o || `go('${a}'${i ? ",'" + i + "'" : ""})`}"\n    style="background:linear-gradient(160deg,rgba(${t},.16),rgba(${t},.04) 58%,var(--surface));border-color:rgba(${t},.24)">\n    <span class="nb-ic" style="background:rgba(${t},.20)">\n      <svg viewBox="0 0 24 24" style="stroke:rgb(${t})">${NAVI[e]}</svg></span>\n    <svg class="nb-arw" viewBox="0 0 24 24"><path d="m9 5 7 7-7 7"/></svg>\n    <span class="nb-txt"><b>${n}</b><i>${s}</i></span></button>`;
}
function navGrid() {
  const e = T.flights.filter(mine),
    t = e.filter((e) => e.tbc).length,
    n = T.stays.filter(mine),
    s = T.gaps.filter(mine).reduce((e, t) => e + (t.nights || 0), 0),
    a = T.activities.filter(mine).length,
    i = (T.legs || [])
      .filter((e) => "ALL" === WHO || "RP" === e.who || e.who === WHO)
      .map((e) => e.id),
    o = "function" == typeof sugAll ? sugAll().filter((e) => i.includes(e.leg)) : [],
    l = o.filter((e) => PICKS[e.id]).length,
    c = (e) => `<em class="nb-warn">${e}</em>`;
  return `<div class="navgrid">\n    ${navBtn("flights", "57,135,229", "Flights", `${e.length - t} booked${t ? " · " + c(t + " to book") : ""}`, "travel", "sec-flights")}\n    ${navBtn("stays", "25,158,112", "Accommodation", `${n.length} stay${1 === n.length ? "" : "s"}${s ? " · " + c(s + " night" + (1 === s ? "" : "s") + " open") : ""}`, "stays")}\n    ${navBtn("plans", "144,133,233", ideasOn() ? "Plans &amp; ideas" : "Plans", `${a} planned${ideasOn() ? ` · ${o.length} ideas` : ""}${l ? ` · ${l} chosen` : ""}`, "cal")}\n  </div>`;
}
function go(e, t) {
  ("cal" === e && ((PLEG = null), (PDAY = null)),
    (TAB = e),
    render(),
    t &&
      requestAnimationFrame(() => {
        const e = document.getElementById(t);
        if (!e) return;
        const n = (document.querySelector("header") || { offsetHeight: 0 }).offsetHeight;
        window.scrollTo({
          top: Math.max(0, e.getBoundingClientRect().top + window.scrollY - n - 10),
          behavior: "smooth",
        });
      }));
}
function flightSoon(e) {
  const t = nextFlight();
  return !!t && new Date(t.dep).getTime() - Date.now() <= 864e5 * e;
}
function vHome() {
  const e = today(),
    t = D(T.start),
    n = D(T.end);
  if (e > n) return vPost();
  if (e < t)
    return (
      `<section class="sec">${flightCD()}${navGrid()}</section>` + vPre(nDays(e, t)) + infoBtn()
    );
  const s = iso(e),
    a = iso(new Date(e.getTime() + 864e5));
  return (
    `<section class="sec">\n    ${flightSoon(3) ? flightCD() : ""}\n    ${dayHero(s, "Today")}\n    ${a <= iso(n) ? dayHero(a, "Tomorrow") : ""}\n    ${navGrid()}\n  </section>` +
    vToday(e) +
    infoBtn()
  );
}
const infoBtn = () =>
  '<section class="sec"><button class="infob" onclick="setTab(\'info\')">\n  <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>\n  <span><b>Trip info</b><i>Visas, money, to-do list, what to pack</i></span>\n  <svg class="nb-arw" style="position:static;opacity:.5" viewBox="0 0 24 24"><path d="m9 5 7 7-7 7"/></svg>\n</button></section>';
function vPre(e) {
  const t = T.deadlines.filter(mine).sort((e, t) => e.date.localeCompare(t.date))[0];
  return `\n  ${t ? `<section class="sec"><div class="note err"><b>${esc(t.title)}</b> — ${fmt(t.date)} at ${esc(t.time)}.<br>${esc(t.detail)}</div></section>` : ""}`;
}
const entryTitle = (e) =>
  "flight" === e.k
    ? (e.o.no || "Flight") + " · " + city(e.o.to).name
    : "transfer" === e.k
      ? (e.o.kind || "Transfer") + " → " + city(e.o.to).name
      : "act" === e.k
        ? e.o.name || "Plan"
        : ("in" === e.k ? "Check in · " : "Check out · ") + (e.o.name || "");
function dayHero(e, t) {
  const n = whereOn(e),
    s = stayOn(e),
    a = gapOn(e),
    i = dayEntries(e),
    o = i.find((e) => e.t),
    l = i
      .slice(0, 5)
      .map(
        (e) =>
          `<div class="dh-row">\n      <span class="dh-t">${e.t ? esc(e.t) : "—"}</span>\n      <span class="dh-l">${esc(entryTitle(e))}</span></div>`,
      )
      .join(""),
    c = i.length > 5 ? `<div class="dh-more">+${i.length - 5} more</div>` : "",
    r = i.some((e) => llOf(e.o.geo) || cityLL(e.o.city) || cityLL(e.o.from)) || !!s;
  return `<div class="card dayh${"Tomorrow" === t ? " tmr" : ""}">\n    <div class="dh-head">\n      <div>\n        <div class="kicker">${t} · ${fmtL(e)}</div>\n        <div class="dh-where">${esc(n ? n.name : "—")}</div>\n        ${s ? `<div class="dh-stay">${esc(s.name)}</div>` : ""}\n        ${a ? '<div style="margin-top:6px"><span class="mchip bad">no accommodation booked</span></div>' : ""}\n      </div>\n      \n    </div>\n    ${i.length ? `<div class="dh-list">${l}${c}</div>` : '<div class="dh-empty">Nothing booked — the day is yours.</div>'}\n    ${o ? `<div class="dh-first">First thing at <b>${esc(o.t)}</b> — ${esc(entryTitle(o))}</div>` : ""}\n    ${r ? '<div class="dh-map">◎ Map the day</div>' : ""}\n  </div>`;
}
function vToday(e) {
  const t = iso(e),
    n = onDay(t),
    s = whereOn(t);
  return `\n  ${s && null != s.tz ? '<section class="sec"><div class="card">\n    <div class="row"><span class="dim">Local time</span><span class="clock" id="clkL"></span></div>\n    <div class="row" style="margin-top:3px"><span class="dim">UK</span>\n      <span class="clock" id="clkH" style="font-size:14px;color:var(--ink-2)"></span></div></div></section>' : ""}\n  <section class="sec"><div class="sg-head"><h2>Today in full</h2></div>\n    ${n.length ? n.map(evCard).join("") : '<div class="note">Nothing scheduled — a free day.</div>'}</section>`;
}
const evCard = (e) =>
  `<div class="card" style="padding:12px 15px">\n  <div class="row"><h3 style="font-size:15px">${esc(e.title)}</h3>${e.t ? `<span class="dim">${esc(e.t)}</span>` : ""}</div>\n  <div class="dim" style="margin-top:2px">${esc(e.sub || "")} ${whoChip(e.who)}</div></div>`;
function vPost() {
  return '<section class="sec"><div class="card"><div class="kicker">Trip complete</div>\n  <div style="font-size:28px;font-weight:800;margin-top:4px">Home</div>\n  <div class="meta" style="margin-top:6px">19 Nov 2026 – 24 Jan 2027 · 67 days</div></div></section>';
}
let JOPEN = {};
function journeys() {
  if (!T) return [];
  const e = [
      ...T.flights
        .filter(mine)
        .map((e) => ({
          at: DT(e.dep),
          d: e.dep.slice(0, 10),
          t: tm(e.dep),
          k: "flight",
          o: e,
          from: e.from,
          to: e.to,
          end: DT(e.arr),
        })),
      ...T.transfers
        .filter(mine)
        .map((e) => ({
          at: DT(e.date + "T" + (e.time || "12:00")),
          d: e.date,
          t: e.time || "",
          k: "transfer",
          o: e,
          from: e.from,
          to: e.to,
          end: DT(e.date + "T" + (e.time || "12:00")),
        })),
    ].sort((e, t) => e.at - t.at),
    t = [];
  e.forEach((e) => {
    const n = t[t.length - 1],
      s = n && n.legs[n.legs.length - 1];
    s && e.at - s.end <= 936e5 ? n.legs.push(e) : t.push({ legs: [e] });
  });
  const n = T.stays
    .filter(mine)
    .slice()
    .sort((e, t) => e.in.localeCompare(t.in));
  return (
    t.forEach((e) => {
      const t = e.legs[0],
        s = e.legs[e.legs.length - 1];
      ((e.from = t.from),
        (e.to = s.to),
        (e.date = t.d),
        (e.at = t.at),
        (e.endAt = s.end),
        (e.leave = n.filter((e) => e.out.slice(0, 10) <= t.d).pop() || null),
        (e.arrive = n.find((e) => e.in.slice(0, 10) >= s.d) || null),
        (e.hours = Math.round((s.end - t.at) / 36e5)),
        (e.tbc = e.legs.some((e) => e.o.tbc)));
    }),
    t
  );
}
const legTitle = (e) =>
  "flight" === e.k
    ? `${e.o.no || "Flight"} · ${city(e.from).name} → ${city(e.to).name}`
    : `${e.o.kind || "Transfer"} · ${e.o.label || city(e.from).name + " → " + city(e.to).name}`;
function jNext(e) {
  const t = Date.now();
  if (e.endAt < t) return { done: !0, txt: "Completed" };
  const n = e.legs.find((e) => e.at > t);
  if (!n) return { txt: "In progress" };
  return {
    txt: (e.at <= t ? "Next: " : "Leaves ") + (n.t || "—") + " · " + legTitle(n),
    when: n.at,
  };
}
function toggleJ(e) {
  ((JOPEN[e] = !JOPEN[e]), renderHere());
}
function vJourneys() {
  const e = journeys();
  return e.length
    ? e
        .map((e, t) => {
          const n = jNext(e),
            s = !!JOPEN[t];
          return `<div class="jrn${n.done ? " done" : ""}">\n      <button class="jrn-head" onclick="toggleJ(${t})">\n        <div class="jrn-main">\n          <div class="jrn-route">${esc(city(e.from).name)} <span>→</span> ${esc(city(e.to).name)}</div>\n          <div class="jrn-when">${fmtL(e.date)} · ${e.hours}h door to door${e.tbc ? ' · <b class="jrn-tbc">something still to book</b>' : ""}</div>\n          <div class="jrn-next">${n.txt}</div>\n        </div>\n        <svg class="jrn-caret${s ? " open" : ""}" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>\n      </button>\n      ${s ? `<div class="jrn-body">\n        ${e.leave ? jRow("", `Check out · ${esc(e.leave.name)}`, "00:00" === tm(e.leave.out) ? "" : tm(e.leave.out), "out") : ""}\n        ${e.legs.map((e) => jRow(e.t, esc(legTitle(e)), "flight" === e.k ? `lands ${tm(e.o.arr)}` : e.o.tbc ? "not booked" : e.o.included ? "included" : "", e.k)).join("")}\n        ${e.arrive ? jRow("00:00" === tm(e.arrive.in) ? "" : tm(e.arrive.in), `Check in · ${esc(e.arrive.name)}`, esc(city(e.arrive.city).name), "in") : ""}\n      </div>` : ""}\n    </div>`;
        })
        .join("")
    : '<div class="note">No travel for this traveller.</div>';
}
const JICO = { flight: "✈", transfer: "⇢", in: "▣", out: "▢" },
  jRow = (e, t, n, s) =>
    `<div class="jrn-row">\n  <span class="jrn-t">${esc(e || "")}</span>\n  <span class="jrn-ic">${JICO[s] || "·"}</span>\n  <span class="jrn-x"><b>${t}</b>${n ? `<i>${n}</i>` : ""}</span></div>`;
function proj(e, t) {
  const { x0: n, x1: s, y0: a, y1: i, lon0: o, lon1: l, lat0: c, lat1: r } = t;
  return [n + ((e.lon - o) / (l - o)) * (s - n), a + ((c - e.lat) / (c - r)) * (i - a)];
}
function arc(e, t, n) {
  const s = t[0] - e[0],
    a = t[1] - e[1],
    i = (e[0] + t[0]) / 2,
    o = (e[1] + t[1]) / 2,
    l = Math.hypot(s, a),
    c = Math.min(0.16 * l, 46) * (n || 1);
  return `M${e[0]},${e[1]} Q${i + (a / l) * c},${o - (s / l) * c} ${t[0]},${t[1]}`;
}
const ALIAS = { lgw: "london", lhr: "london" },
  AK = (e) => ALIAS[e] || e;
function mapSVG(e, t, n, s, a, i, o) {
  i = i || {};
  const l = {};
  t.forEach((t) => {
    T.cities[t] && (l[t] = proj(T.cities[t], e));
  });
  const c = T.land && T.land[o] ? `<path class="land" d="${T.land[o]}"/>` : "";
  let r = "";
  for (let t = 30 * Math.ceil(e.lon0 / 30); t <= e.lon1; t += 30) {
    r += `<path class="grat" d="M${proj({ lon: t, lat: 0 }, e)[0]},0 V${a}"/>`;
  }
  for (let t = 20 * Math.ceil(e.lat1 / 20); t <= e.lat0; t += 20) {
    r += `<path class="grat" d="M0,${proj({ lon: 0, lat: t }, e)[1]} H${s}"/>`;
  }
  const d = {},
    p = n
      .filter((e) => l[AK(e.from)] && l[AK(e.to)] && AK(e.from) !== AK(e.to))
      .map((e) => {
        const t = l[AK(e.from)],
          n = l[AK(e.to)],
          s = AK(e.from) + ">" + AK(e.to) + "|" + e.mode,
          a = 1 + 0.55 * ((d[s] = (d[s] || 0) + 1) - 1);
        return `<path class="route ${"flight" === e.mode ? `flight ${e.who}` : e.mode}${e.tbc ? " tbc" : ""}" d="${"flight" === e.mode ? arc(t, n, a) : `M${t[0]},${t[1]} L${n[0]},${n[1]}`}"/>`;
      })
      .join(""),
    m = Object.entries(l)
      .map(([e, t]) => {
        const n = T.cities[e],
          a = i[e] || {},
          o = null != a.flip ? a.flip : t[0] > 0.72 * s,
          l = a.mid ? 'text-anchor="middle"' : o ? 'text-anchor="end"' : "",
          c = a.mid ? 0 : o ? -8 : 8;
        return `<g class="city" transform="translate(${t[0].toFixed(1)},${t[1].toFixed(1)})"><circle class="core" r="4"/>\n      <text x="${c}" y="${4 + (a.dy || 0)}" ${l}>${esc("—" === n.code ? n.name : n.code)}</text></g>`;
      })
      .join("");
  return `<svg viewBox="0 0 ${s} ${a}" role="img" aria-label="Route map">${c}${r}${p}${m}</svg>`;
}
function legsFor() {
  const e = [];
  return (
    T.flights
      .filter(mine)
      .forEach((t) => e.push({ mode: "flight", who: t.who, from: t.from, to: t.to, tbc: !!t.tbc })),
    T.transfers
      .filter(mine)
      .forEach((t) => e.push({ mode: t.mode, who: t.who, from: t.from, to: t.to, tbc: !!t.tbc })),
    e
  );
}
function vTravel() {
  const e = legsFor(),
    t = T.flights
      .filter(mine)
      .slice()
      .sort((e, t) => e.dep.localeCompare(t.dep)),
    n = T.transfers
      .filter(mine)
      .slice()
      .sort((e, t) => e.date.localeCompare(t.date));
  return `\n  <section class="sec"><div class="sg-head"><h2>Everything that moves</h2><span class="n">${t.length} flights · ${n.length} transfers</span></div>\n    <div class="map-card">${mapSVG({ x0: 26, x1: 874, y0: 20, y1: 300, lon0: -14, lon1: 124, lat0: 58, lat1: -40 }, ["london", "doha", "perth", "phuket", "bangkok"], e, 900, 320, { bangkok: { dy: -9, flip: !1 }, phuket: { dy: 11, flip: !0 }, london: { flip: !1 } }, "world")}\n      <div class="legend">\n        <span class="li">Long-haul</span>\n        <span class="li"><svg viewBox="0 0 24 9"><path class="route flight" d="M1,4.5H23"/></svg>Robbie</span>\n        <span class="li"><svg viewBox="0 0 24 9"><path class="route flight P" d="M1,4.5H23"/></svg>Mum &amp; Dad</span>\n        <span class="li"><svg viewBox="0 0 24 9"><path class="route flight tbc" d="M1,4.5H23"/></svg>To book</span>\n        <span class="li"><svg viewBox="0 0 24 9"><path class="route sea" d="M1,4.5H23"/></svg>Sea</span>\n        <span class="li"><svg viewBox="0 0 24 9"><path class="route road" d="M1,4.5H23"/></svg>Road</span>\n      </div></div>\n    <div class="map-card">${mapSVG({ x0: 40, x1: 560, y0: 20, y1: 340, lon0: 97.4, lon1: 101.6, lat0: 14.6, lat1: 7.2 }, ["phuket", "bangkok", "kohsamui", "donsak", "khaosok", "krabi"], e, 600, 360, { krabi: { dy: 13, flip: !1 }, khaosok: { dy: 15, mid: !0 }, donsak: { dy: -11, mid: !0 } }, "thai")}<div class="legend"><span class="li">Within Thailand, 7–24 January · Koh Samui, Krabi, Khao Sok</span></div></div>\n  </section>\n  <section class="sec" id="sec-flights"><div class="sg-head"><h2>Journeys</h2>\n      <span class="n">door to door</span></div>${vJourneys()}</section>\n  <section class="sec"><div class="label">Every flight</div><div class="deck">${t.map(passCard).join("")}</div></section>\n  <section class="sec"><div class="label">Ground &amp; sea</div>${n.map(trCard).join("")}</section>`;
}
const AC = (e) =>
    (e.no || "")
      .replace(/[^A-Za-z0-9]/g, "")
      .slice(0, 2)
      .toUpperCase(),
  logoFor = (e) => `https://www.gstatic.com/flights/airline_logos/70px/${AC(e)}.png`,
  BAGI = {
    checked:
      '<rect x="4" y="7" width="16" height="14" rx="2"/><path d="M9 7V4h6v3"/><path d="M8 21v1M16 21v1"/>',
    cabin:
      '<rect x="6" y="8" width="12" height="12" rx="2"/><path d="M10 8V5h4v3"/><path d="M6 13h12"/><path d="M9 20v1M15 20v1"/>',
    personal:
      '<path d="M8 8V6.5a4 4 0 0 1 8 0V8"/><rect x="5" y="8" width="14" height="13" rx="3"/><path d="M9 13h6"/>',
  },
  bagChip = (e, t, n) =>
    `<span class="bag${n ? " none" : ""}"><svg viewBox="0 0 24 24">${BAGI[e]}</svg>${esc(t)}</span>`;
function bagChips(e) {
  const t = e.bag;
  return t
    ? `<div class="bags">${t.checked ? bagChip("checked", t.checked, /none|add-on/i.test(t.checked)) : ""}\n    ${t.cabin ? bagChip("cabin", t.cabin) : ""}${t.personal ? bagChip("personal", t.personal) : ""}</div>`
    : "";
}
const passCard = (e) =>
    `<div class="pass tap ${e.who}${e.tbc ? " tbc" : ""}" onclick="tapOpen(event,'flight',${e._i})">\n  <div class="p-perf"></div><div class="p-perf r"></div>\n  <div class="p-date"><span>${fmtL(e.dep.slice(0, 10))}</span>\n    <span class="d2">${e.tbc ? "Not booked" : tm(e.dep) + " → " + tm(e.arr) + (e.arr.slice(0, 10) !== e.dep.slice(0, 10) ? " +1" : "")}</span></div>\n  ${e.cabinimg ? `<div class="c-hero nc"><img class="bl" src="${esc(e.cabinimg)}" alt="" loading="lazy" onerror="this.remove()"><img class="fg" src="${esc(e.cabinimg)}" alt="" loading="lazy" onerror="this.closest('.c-hero').remove()"><span class="scrim"></span><span class="cap">${esc(e.cabinname || e.cabin || "")}</span></div>` : '<div style="height:12px"></div>'}\n  <div class="p-top"><span style="display:flex;align-items:center;gap:7px"><img class="alogo" src="${logoFor(e)}" alt="" loading="lazy" onerror="this.remove()">${esc(e.airline)}</span><span>${esc(e.no)}</span></div>\n  <div class="p-route">\n    <div><div class="p-code">${esc(city(e.from).code)}</div><div class="p-city">${esc(city(e.from).name)}</div></div>\n    <div class="p-mid"><div class="p-line"><span class="l"></span>✈<span class="l"></span></div><div class="dur">${esc(e.dur || "TBC")}</div></div>\n    <div style="text-align:right"><div class="p-code">${esc(city(e.to).code)}</div><div class="p-city">${esc(city(e.to).name)}</div></div>\n  </div>\n  <div class="p-meta">\n    ${e.cabin ? `<span class="mchip ${"Business" === e.cabin ? "cabin-biz" : ""}">${esc(e.cabin)}</span>` : ""}\n    ${e.seat ? `<span class="mchip">${esc(e.seat)}</span>` : ""}\n    ${e.ref ? `<span class="mchip">${esc(e.ref)}</span>` : '<span class="mchip tbd">No ref</span>'}\n    ${whoChip(e.who)}\n  </div>\n  ${bagChips(e)}\n  ${e.plane ? `<div class="note-txt">${esc(e.plane)}</div>` : ""}\n</div>`,
  trCard = (e) =>
    `<div class="card tap" style="padding:13px 16px${e.tbc ? ";border-style:dashed" : ""}" onclick="tapOpen(event,'transfer',${e._i})">\n  ${e.img ? `<div class="a-hero nc"><img class="bl" src="${esc(e.img)}" alt="" loading="lazy" onerror="this.remove()"><img class="fg" src="${esc(e.img)}" alt="" loading="lazy" onerror="this.closest('.a-hero').remove()"><span class="scrim"></span><span class="cap">${esc(e.kind)}</span></div>` : ""}\n  <div class="row"><h3 style="font-size:15px">${esc(e.kind)} · ${esc(e.label || city(e.from).name + " → " + city(e.to).name)}</h3>\n    <span class="dim">${fmt(e.date)}${e.time ? " · " + esc(e.time) : ""}</span></div>\n  <div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap">\n    ${e.tbc ? '<span class="mchip tbd">Not booked</span>' : e.included ? '<span class="mchip good">Included</span>' : '<span class="mchip good">Booked</span>'}\n    ${null != e.amount ? `<span class="mchip">${money(e.amount, e.ccy)}</span>` : ""}\n    ${e.provider ? `<span class="mchip">${esc(e.provider)}</span>` : ""}${whoChip(e.who)}</div>\n  ${e.note ? `<div class="note-txt">${esc(e.note)}</div>` : ""}\n  ${e.geo ? mapLink(e.geo, e.label || e.kind) + wazeLink(e.geo) : ""}</div>`;
function vStays() {
  const e = T.stays
      .filter(mine)
      .slice()
      .sort((e, t) => e.in.localeCompare(t.in)),
    t = T.gaps.filter(mine),
    n = { building: "🏢", house: "🏡", hotel: "🏨", resort: "🏝️" };
  return `<section class="sec"><div class="sg-head"><h2>Stays</h2><span class="n">${e.length} booked</span></div>\n  <div class="stays">${e.map((e) => `<div class="stay-card tapc" onclick="openStay(${e._i})">\n    ${hero(e, n[e.icon] || "🏨")}\n    <div class="row" style="align-items:flex-start"><h3 style="margin-top:0;flex:1">${esc(e.name)}</h3>\n      <svg class="nb-arw" style="position:static;opacity:.5;margin-top:3px" viewBox="0 0 24 24"><path d="m9 5 7 7-7 7"/></svg></div>\n    <div class="s-dates">${fmt(e.in)} → ${fmt(e.out)} · ${e.nights} nights</div>\n    <div class="s-inout">\n      <span><i>Check in</i>${"00:00" === tm(e.in) ? "—" : tm(e.in)}</span>\n      <span><i>Check out</i>${"00:00" === tm(e.out) ? "—" : tm(e.out)}</span>\n    </div>\n    <div style="margin-top:9px">${whoChip(e.who)}</div>\n  </div>`).join("")}\n  ${t.map((e) => `<div class="stay-card gap"><div class="s-ico">⚠️</div>\n    <div class="s-city">${esc(city(e.city).name)}</div><h3>Nothing booked</h3>\n    <div class="s-dates">${fmt(e.from)} → ${fmt(e.to)}</div>\n    <div class="s-row"><span class="s-price" style="color:var(--orange)">${e.nights} nights</span><span class="s-nights">${esc(e.label || "")}</span></div>\n    <div style="margin-top:9px">${whoChip(e.who)}</div></div>`).join("")}\n  </div></section>`;
}
function openStay(e) {
  ((STAYI = e), (TAB = "stay"), render());
}
async function loadSCon() {
  SCON = store.get("scon", {});
  try {
    const e = await fetch(`${SB_URL}/rest/v1/stay_contact?select=sid,phone,email`, {
      headers: HDRS,
      cache: "no-store",
    });
    if (e.ok) {
      const t = await e.json();
      ((SCON = {}),
        (t || []).forEach((e) => (SCON[e.sid] = { phone: e.phone || "", email: e.email || "" })),
        store.set("scon", SCON));
    }
  } catch (e) {}
}
function editStay() {
  const e = T.stays[STAYI];
  if (!e) return;
  const t = SCON[stayKey(e)] || {};
  ((SEDIT = { phone: t.phone || e.phone || "", email: t.email || e.email || "" }), paintSEdit());
}
function closeSEdit() {
  ((SEDIT = null), paintSEdit());
}
async function saveSEdit() {
  const e = T.stays[STAYI];
  if (!e) return;
  const t = stayKey(e),
    n = (document.getElementById("seP") || {}).value || "",
    s = (document.getElementById("seE") || {}).value || "";
  ((SCON[t] = { phone: n.trim(), email: s.trim() }),
    store.set("scon", SCON),
    (SEDIT = null),
    paintSEdit(),
    render());
  try {
    await fetch(`${SB_URL}/rest/v1/stay_contact`, {
      method: "POST",
      headers: Object.assign(
        { "Content-Type": "application/json", Prefer: "resolution=merge-duplicates" },
        HDRS,
      ),
      body: JSON.stringify({ sid: t, phone: SCON[t].phone, email: SCON[t].email }),
    });
  } catch (e) {}
}
function paintSEdit() {
  const e = document.getElementById("sehost");
  if (!e) return;
  if (!SEDIT) return ((e.innerHTML = ""), void syncLock());
  const t = T.stays[STAYI] || {};
  ((e.innerHTML = `<div class="modal open" id="sedit" onclick="if(event.target===this)closeSEdit()">\n    <div class="mbox" role="dialog" aria-modal="true">\n      <button class="mx" onclick="closeSEdit()" aria-label="Close">&times;</button>\n      <div class="kicker">Edit contact</div>\n      <div class="se-name">${esc(t.name || "")}</div>\n      <label class="se-l">Phone</label>\n      <input class="se-i" id="seP" type="tel" inputmode="tel" value="${esc(SEDIT.phone)}" placeholder="+66 …">\n      <label class="se-l">Email</label>\n      <input class="se-i" id="seE" type="email" inputmode="email" autocapitalize="off"\n        value="${esc(SEDIT.email)}" placeholder="reservations@…">\n      <div class="se-btns">\n        <button class="mapbtn" onclick="closeSEdit()">Cancel</button>\n        <button class="mapbtn go" onclick="saveSEdit()">Save</button></div>\n      <div class="se-note">Saved for everyone, not just this phone.</div>\n    </div></div>`),
    syncLock(),
    setTimeout(() => {
      const e = document.getElementById("seP");
      e && e.focus();
    }, 60));
}
const stayKey = (e) => `${e.name}|${e.in.slice(0, 10)}`;
function vStay() {
  const e = T.stays[STAYI];
  if (!e) return '<div class="center">Stay not found.</div>';
  const t = SCON[stayKey(e)] || {},
    n = t.phone || e.phone || "",
    s = t.email || e.email || "",
    a = T.transfers
      .filter(mine)
      .filter(
        (t) =>
          Math.abs(D(t.date) - D(e.in.slice(0, 10))) <= 1728e5 ||
          Math.abs(D(t.date) - D(e.out.slice(0, 10))) <= 1728e5,
      );
  return `<section class="sec">\n    <div class="card">${hero(e, { building: "🏢", house: "🏡", hotel: "🏨", resort: "🏝️" }[e.icon] || "🏨")}\n      <h3 style="margin-top:2px;font-size:20px">${esc(e.name)}</h3>\n      <div class="s-dates">${fmtL(e.in.slice(0, 10))} → ${fmtL(e.out.slice(0, 10))} · ${e.nights} nights</div>\n      <div class="s-inout"><span><i>Check in</i>${"00:00" === tm(e.in) ? "—" : tm(e.in)}</span>\n        <span><i>Check out</i>${"00:00" === tm(e.out) ? "—" : tm(e.out)}</span></div>\n      <div style="margin-top:10px;display:flex;gap:6px;flex-wrap:wrap">\n        ${!0 === e.paid ? '<span class="mchip good">paid</span>' : !1 === e.paid ? '<span class="mchip bad">unpaid</span>' : ""}\n        ${e.room ? `<span class="mchip">${esc(e.room)}</span>` : ""}${e.board ? `<span class="mchip">${esc(e.board)}</span>` : ""}${whoChip(e.who)}</div>\n    </div>\n    <div class="card"><div class="label" style="margin:0 0 8px">Contact</div>\n      ${e.addr ? kv("Address", esc(e.addr)) : ""}\n      ${kv("Phone", n ? `<a href="tel:${esc(n.replace(/[^0-9+]/g, ""))}">${esc(n)}</a>` : '<span class="dim">not known</span>')}\n      ${kv("Email", s ? `<a href="mailto:${esc(s)}">${esc(s)}</a>` : '<span class="dim">not known</span>')}\n      ${e.url ? kv("Website", `<a href="${esc(e.url)}" target="_blank" rel="noopener">Open</a>`) : ""}\n      <div style="margin-top:11px;display:flex;gap:7px;flex-wrap:wrap">\n        <button class="mapbtn" onclick="editStay()">Edit phone &amp; email</button>\n        ${e.geo ? `<a class="mapbtn" href="${mapURL(e.geo, e.addr || e.name)}" target="_blank" rel="noopener">◎ Maps</a>` : ""}\n        ${e.geo && inAU(e.geo) ? `<a class="mapbtn" href="${wazeURL(e.geo)}" target="_blank" rel="noopener">▲ Waze</a>` : ""}\n      </div>\n    </div>\n    <div class="card"><div class="label" style="margin:0 0 8px">The booking</div>\n      ${e.ref ? kv("Reference", esc(e.ref)) : ""}${e.pin ? kv("PIN", esc(e.pin)) : ""}\n      ${e.via ? kv("Booked via", esc(e.via)) : ""}\n      ${null != e.amount ? kv("Price", money(e.amount, e.ccy) + (e.paid ? " · paid" : "")) : ""}\n      ${e.board ? kv("Board", esc(e.board)) : ""}\n      ${e.cancel ? kv("Cancellation", esc(e.cancel)) : ""}\n      ${e.guest ? kv("Guest", esc(e.guest)) : ""}</div>\n    ${a.length ? `<div class="card"><div class="label" style="margin:0 0 8px">Transfers around this stay</div>\n      ${a.map((e) => kv(fmt(e.date) + (e.time ? " · " + e.time : ""), esc((e.kind || "Transfer") + " · " + (e.label || city(e.from).name + " → " + city(e.to).name)) + (e.tbc ? ' <span class="mchip bad">not booked</span>' : ""))).join("")}</div>` : ""}\n    ${e.plans && e.plans.length ? `<div class="card"><div class="label" style="margin:0 0 8px">Resort plans</div>\n      ${e.plans.map((p) => `<figure class="splan"><img src="${esc(p.src)}" alt="${esc(p.cap)}" loading="lazy" onerror="this.closest('figure').remove()"><figcaption>${esc(p.cap)}</figcaption></figure>`).join("")}</div>` : ""}\n    ${e.meals ? `<div class="card"><div class="label" style="margin:0 0 8px">Meal times</div>\n      ${kv("Breakfast", esc(e.meals.breakfast || "—"))}${kv("Lunch", esc(e.meals.lunch || "—"))}${kv("Dinner", esc(e.meals.dinner || "—"))}\n      ${e.meals.style ? kv("Style", esc(e.meals.style)) : ""}\n      ${e.meals.note ? `<div class="note-txt" style="margin-top:9px">${esc(e.meals.note)}</div>` : ""}</div>` : ""}\n    ${e.note ? `<div class="card"><div class="label" style="margin:0 0 8px">Notes</div>\n      <div class="note-txt">${esc(e.note)}</div></div>` : ""}\n  </section>`;
}
const HUES = {
  perth: "linear-gradient(135deg,#1d3a5c,#0f1f33)",
  scarborough: "linear-gradient(135deg,#245a63,#10262b)",
  margaretriver: "linear-gradient(135deg,#3d4a22,#1b2110)",
  bangkok: "linear-gradient(135deg,#5c2f1d,#2a1610)",
  kohsamui: "linear-gradient(135deg,#125447,#08221d)",
  khaosok: "linear-gradient(135deg,#1c4a33,#0c1f16)",
  krabi: "linear-gradient(135deg,#4a3a12,#211a08)",
  phuket: "linear-gradient(135deg,#144a52,#081f23)",
};
function hero(e, t) {
  return `<div class="s-hero" style="background:${HUES[e.city] || "linear-gradient(135deg,#2a2a27,#15150f)"}">\n    ${e.img ? `<img src="${esc(e.img)}" alt="" loading="lazy" onerror="this.remove()">` : ""}\n    <span class="scrim"></span>\n    <span class="cap">${esc(city(e.city).name)}</span></div>`;
}
const kv = (e, t) =>
  `<div class="row" style="margin-top:5px"><span class="dim" style="flex:0 0 96px">${e}</span><span class="meta" style="flex:1;text-align:right">${t}</span></div>`;
let CAL = null,
  SEL = null;
const KIND_ICON = { flight: "✈", transfer: "⛴", in: "🛏", out: "🎒", act: "★" };
function calInit() {
  const e = today(),
    t = D(T.start),
    n = D(T.end),
    s = e >= t && e <= n ? e : t;
  (CAL || (CAL = new Date(s.getFullYear(), s.getMonth(), 1)), SEL || (SEL = iso(s)));
}
function shiftMonth(e) {
  ((CAL = new Date(CAL.getFullYear(), CAL.getMonth() + e, 1)), CALOPEN ? paintCal() : render());
}
function shiftDay(e) {
  const t = D(SEL);
  t.setDate(t.getDate() + e);
  const n = D(T.start),
    s = D(T.end);
  t < n || t > s || ((SEL = iso(t)), render());
}
function pickDay(e) {
  ((SEL = e), render());
}
function whoStrips(e) {
  const t = [];
  return (
    ["R", "P"].forEach((n) => {
      (T.stays.some(
        (t) => (t.who === n || "RP" === t.who) && t.in.slice(0, 10) <= e && e < t.out.slice(0, 10),
      ) ||
        T.gaps.some((t) => t.who === n && t.from <= e && e < t.to) ||
        T.flights.some((t) => (t.who === n || "RP" === t.who) && t.dep.slice(0, 10) === e)) &&
        t.push("R" === n ? "var(--blue)" : "var(--magenta)");
    }),
    t
  );
}
function dayItems(e) {
  return events().filter((t) => t.d === e);
}
function dayEntries(e) {
  const t = [];
  return (
    T.flights.forEach((n) => {
      mine(n) &&
        n.dep.slice(0, 10) === e &&
        t.push({ t: tm(n.dep), endT: tm(n.arr), k: "flight", o: n });
    }),
    T.transfers.forEach((n) => {
      mine(n) && n.date === e && t.push({ t: n.time || "", k: "transfer", o: n });
    }),
    T.activities.forEach((n) => {
      mine(n) && n.date === e && t.push({ t: n.start || "", endT: n.end, k: "act", o: n });
    }),
    T.stays.forEach((n) => {
      (mine(n) &&
        n.in.slice(0, 10) === e &&
        t.push({ t: "00:00" === tm(n.in) ? "" : tm(n.in), k: "in", o: n }),
        mine(n) &&
          n.out.slice(0, 10) === e &&
          t.push({ t: "00:00" === tm(n.out) ? "" : tm(n.out), k: "out", o: n }));
    }),
    t.sort((e, t) => (e.t || "99:99").localeCompare(t.t || "99:99"))
  );
}
const stayCard = (e, t) =>
    `<div class="card tap" style="padding:13px 16px" onclick="tapOpen(event,'stay',${e._i})">\n  <div class="row"><h3 style="font-size:15px">${"in" === t ? "Check in" : "Check out"} · ${esc(e.name)}</h3>\n    <span class="dim">${"00:00" === tm("in" === t ? e.in : e.out) ? "—" : tm("in" === t ? e.in : e.out)}</span></div>\n  <div class="dim" style="margin-top:2px">${esc(city(e.city).name)}</div>\n  <div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap">\n    ${e.room ? `<span class="mchip">${esc(e.room)}</span>` : ""}${e.ref ? `<span class="mchip">${esc(e.ref)}</span>` : ""}${whoChip(e.who)}</div></div>`,
  dayCard = (e) =>
    "flight" === e.k
      ? passCard(e.o)
      : "transfer" === e.k
        ? trCard(e.o)
        : "act" === e.k
          ? planCard(e.o, !0)
          : stayCard(e.o, e.k);
function dayPanel(e) {
  const t = whereOn(e),
    n = stayOn(e),
    s = gapOn(e),
    a = ((n && n.city) || (s && s.city), dayEntries(e)),
    i = a.filter((e) => e.t),
    o = a.filter((e) => !e.t),
    l = (e) => {
      const [t, n] = e.split(":").map(Number);
      return 60 * t + n;
    },
    c = (e) => {
      const t = Math.floor(e / 60),
        n = e % 60;
      return (t ? t + "h" : "") + (n ? (t ? " " : "") + n + "m" : "");
    },
    r = (e) => e.endT || e.t,
    d = `<div class="card" style="margin-bottom:11px">\n    <div class="row"><h3>${esc(t ? t.name : "Nothing recorded")}</h3>\n      ${s ? '<span class="mchip bad">no bed booked</span>' : ""}</div>\n    ${n ? `<div class="dim" style="margin-top:2px">${esc(n.name)}</div>` : ""}\n    ${a.length ? "" : '<div class="hr"></div><div class="dim">Nothing scheduled — the whole day is free.</div>'}\n  </div>`;
  let p = "";
  return (
    i.forEach((e, t) => {
      (0 === t &&
        l(e.t) >= 600 &&
        (p += `<div class="tl-free" style="padding-left:0">Morning free until ${esc(e.t)} · ${c(l(e.t) - 480)}</div>`),
        (p += dayCard(e)));
      const n = i[t + 1];
      if (n) {
        const t = l(n.t) - l(r(e));
        t >= 90 && (p += `<div class="tl-free" style="padding-left:0">${c(t)} free</div>`);
      } else
        l(r(e)) < 1080 &&
          (p += `<div class="tl-free" style="padding-left:0">Evening free from ${esc(r(e))}</div>`);
    }),
    (p += o.map(dayCard).join("")),
    d + p
  );
}
const planCard = (e, t) =>
  `<div class="card tap" style="padding:13px 16px" onclick="tapOpen(event,'act',${e._i})">\n      ${e.img && PIMG ? `<div class="a-hero"><img src="${esc(e.img)}" alt="" loading="lazy" onerror="this.remove()"><span class="scrim"></span><span class="cap">${esc(city(e.city).name)}</span></div>` : ""}\n      <div class="row"><h3 style="font-size:15px">${esc(e.name)}</h3>\n        <span class="dim">${t ? esc(e.start || "") + (e.end ? "–" + esc(e.end) : "") : fmt(e.date) + (e.start ? " · " + esc(e.start) : "")}</span></div>\n      <div class="dim" style="margin-top:2px">${esc(e.loc || "")}</div>\n      <div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap">\n        ${e.status ? `<span class="mchip ${"Idea" === e.status ? "idea" : "good"}">${esc(e.status)}</span>` : ""}<span class="mchip">${esc(e.type)}</span>\n        ${null != e.amount ? `<span class="mchip">${money(e.amount, e.ccy)}</span>` : ""}${whoChip(e.who)}\n        ${e.brief ? '<span class="mchip">tap for details</span>' : ""}</div>\n      ${e.note ? `<div class="note-txt">${esc(e.note)}</div>` : ""}</div>`;
function ticket(e) {
  if (!e) return "";
  const t = e.qrd
    ? `<div class="tk-qr"><svg viewBox="-2 -2 ${(e.qrn || 21) + 4} ${(e.qrn || 21) + 4}" role="img" aria-label="Ticket QR code">\n      <rect x="-2" y="-2" width="${(e.qrn || 21) + 4}" height="${(e.qrn || 21) + 4}" fill="#fff"/>\n      <path d="${e.qrd}" fill="#000"/></svg></div>`
    : "";
  return `<details class="tk" open><summary>Ticket${e.vendor ? " · " + esc(e.vendor) : ""}</summary>\n    <div class="tk-body">${t}\n      <div class="tk-ref">${esc(e.ref || "")}</div>\n      <div class="tk-meta">${[e.name, e.qty, e.order ? "Order " + e.order : ""].filter(Boolean).map(esc).join(" · ")}</div>\n    </div></details>`;
}
let SHEET = null;
const BRL = {
  start: "Where to start",
  getting: "Getting there",
  timing: "Timing",
  bring: "What to bring",
  cost: "Cost",
};
function briefHTML(e) {
  if (!e) return "";
  let t = ["start", "getting", "timing", "bring", "cost"]
    .filter((t) => e[t])
    .map((t) => `<div class="br"><h4>${BRL[t]}</h4><p>${esc(e[t])}</p></div>`)
    .join("");
  return (
    e.heads &&
      e.heads.length &&
      (t += `<div class="br warn"><h4>Heads up</h4><ul>${e.heads.map((e) => `<li>${esc(e)}</li>`).join("")}</ul></div>`),
    t
  );
}
const shHero = (e, t, n, s) =>
  `<div class="sh-hero" style="background:${t || "linear-gradient(135deg,#2a2a27,#15150f)"}">\n  ${e ? `<img src="${esc(e)}" alt="" onerror="this.remove()">` : ""}<span class="scrim"></span>\n  <span class="t"><h3>${n}</h3><div class="w">${s}</div></span></div>`;
function tapOpen(e, t, n) {
  e.target.closest("a,summary,details") || openSheet(t, n);
}
function openSheet(e, t) {
  ((SHEET = { k: e, i: t }), paintSheet());
}
function closeSheet() {
  ((SHEET = null), paintSheet());
}
function syncLock() {
  const e = document.getElementById("fx"),
    t = !!(MAPV || SHEET || SEDIT || CALOPEN || (e && e.classList.contains("open")));
  document.body.style.overflow = t ? "hidden" : "";
}
function paintSheet() {
  let e = document.getElementById("sheet");
  if (
    (e || ((e = document.createElement("div")), (e.id = "sheet"), document.body.appendChild(e)),
    !SHEET)
  )
    return ((e.className = "sheet"), (e.innerHTML = ""), void syncLock());
  ((e.className = "sheet open"),
    (e.innerHTML = `<div class="sh-back" onclick="closeSheet()"></div><div class="sh-panel">\n    <div class="sh-grab"><i></i><button class="sh-x" onclick="closeSheet()" aria-label="Close">&times;</button></div>\n    ${sheetBody()}</div>`),
    syncLock(),
    (e.querySelector(".sh-panel").scrollTop = 0));
}
function sheetBody() {
  const e = SHEET.k,
    t = SHEET.i;
  if ("plan" === e) return planSheet();
  if ("idea" === e) return ideaSheet(t);
  if ("flight" === e) {
    const e = T.flights[t];
    if (!e) return "";
    const n = e.bag || {};
    return (
      shHero(
        e.cabinimg,
        HUES[e.to],
        `${esc(city(e.from).code)} → ${esc(city(e.to).code)}`,
        `${esc(e.airline)} ${esc(e.no)} · ${fmtL(e.dep.slice(0, 10))}`,
      ) +
      `<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:4px">\n        ${e.cabin ? `<span class="mchip ${"Business" === e.cabin ? "cabin-biz" : ""}">${esc(e.cabin)}</span>` : ""}\n        ${e.ref ? `<span class="mchip">${esc(e.ref)}</span>` : '<span class="mchip tbd">No ref</span>'}${whoChip(e.who)}</div>` +
      kv("Departs", `${tm(e.dep)} · ${esc(city(e.from).name)}`) +
      kv(
        "Arrives",
        `${tm(e.arr)}${e.arr.slice(0, 10) !== e.dep.slice(0, 10) ? " next day" : ""} · ${esc(city(e.to).name)}`,
      ) +
      kv("Duration", esc(e.dur || "—")) +
      (e.plane ? kv("Aircraft", esc(e.plane)) : "") +
      (e.seat ? kv("Seat", esc(e.seat)) : "") +
      (null != e.amount ? kv("Fare", money(e.amount, e.ccy) + (e.paid ? " · paid" : "")) : "") +
      (n.checked || n.cabin || n.personal
        ? `<div class="br"><h4>Baggage</h4>\n        ${n.checked ? `<p><b>Checked</b> — ${esc(n.checked)}</p>` : ""}\n        ${n.bought ? `<p class="bagbought">✓ ${esc(n.bought)}</p>` : ""}\n        ${n.cabin ? `<p style="margin-top:5px"><b>Cabin</b> — ${esc(n.cabin)}</p>` : ""}\n        ${n.personal ? `<p style="margin-top:5px"><b>Personal item</b> — ${esc(n.personal)}</p>` : ""}\n        ${n.note ? `<p style="margin-top:6px;color:var(--muted);font-size:12.5px">${esc(n.note)}</p>` : ""}</div>`
        : "") +
      (e.note || e.cabinnote
        ? `<div class="br"><h4>Notes</h4>${e.note ? `<p>${esc(e.note)}</p>` : ""}\n        ${e.cabinnote ? `<p style="margin-top:5px;color:var(--muted);font-size:12.5px">${esc(e.cabinnote)}</p>` : ""}</div>`
        : "")
    );
  }
  if ("transfer" === e) {
    const e = T.transfers[t];
    return e
      ? shHero(
          e.img,
          HUES[e.to],
          esc(e.kind),
          esc(e.label || city(e.from).name + " → " + city(e.to).name) + " · " + fmtL(e.date),
        ) +
          `<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:4px">\n        ${e.tbc ? '<span class="mchip tbd">Not booked</span>' : e.included ? '<span class="mchip good">Included</span>' : '<span class="mchip good">Booked</span>'}\n        ${e.ref ? `<span class="mchip">${esc(e.ref)}</span>` : ""}${whoChip(e.who)}</div>` +
          (e.time ? kv("Time", esc(e.time)) : "") +
          (e.provider ? kv("Provider", esc(e.provider)) : "") +
          (e.incl
            ? kv("Price", esc(e.incl))
            : null != e.amount
            ? kv("Price", money(e.amount, e.ccy) + (e.paid ? " · paid" : ""))
            : "") +
          (e.phone
            ? kv("Phone", `<a href="tel:${esc(e.phone.replace(/\s/g, ""))}">${esc(e.phone)}</a>`)
            : "") +
          (e.note ? `<div class="br"><h4>What to know</h4><p>${esc(e.note)}</p></div>` : "") +
          (e.geo
            ? `<div class="br">${mapLink(e.geo, e.label || e.kind)}${wazeLink(e.geo)}</div>`
            : "")
      : "";
  }
  if ("act" === e) {
    const e = T.activities[t];
    return e
      ? shHero(
          e.img,
          HUES[e.city],
          esc(e.name),
          `${fmtL(e.date)}${e.start ? " · " + esc(e.start) : ""}${e.end ? "–" + esc(e.end) : ""}`,
        ) +
          `<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:4px">\n        ${e.status ? `<span class="mchip ${"Idea" === e.status ? "idea" : "good"}">${esc(e.status)}</span>` : ""}<span class="mchip">${esc(e.type)}</span>\n        ${e.incl ? '<span class="mchip good">Included</span>' : null != e.amount ? `<span class="mchip">${money(e.amount, e.ccy)}${e.paid ? " paid" : ""}</span>` : ""}${whoChip(e.who)}</div>` +
          (e.loc ? kv("Where", esc(e.loc)) : "") +
          ticket(e.ticket) +
          (e.note ? `<div class="br"><h4>The plan</h4><p>${esc(e.note)}</p></div>` : "") +
          briefHTML(e.brief) +
          (e.phone || e.url || e.email || e.line
            ? `<div class="br"><h4>Contact</h4>\n        ${e.phone ? `<p><a href="tel:${esc(e.phone.replace(/\s/g, ""))}">${esc(e.phone)}</a></p>` : ""}\n        ${e.email ? `<p style="margin-top:5px"><a href="mailto:${esc(e.email)}">${esc(e.email)}</a></p>` : ""}\n        ${e.line ? `<p style="margin-top:5px">Line <a href="https://line.me/R/ti/p/${esc(e.line)}" target="_blank" rel="noopener">${esc(e.line)}</a></p>` : ""}\n        ${e.url ? `<p style="margin-top:5px"><a href="${esc(e.url)}" target="_blank" rel="noopener">Open website</a></p>` : ""}</div>`
            : "") +
          `<div class="br"><button class="ibtn" onclick="editAct(${t})">Edit this plan</button></div>` +
          (e.geo
            ? `<div class="br">${mapLink(e.geo, e.loc || e.name)}${wazeLink(e.geo)}</div>`
            : "")
      : "";
  }
  const n = T.stays[t];
  return n
    ? shHero(
        n.img,
        HUES[n.city],
        esc(n.name),
        `${fmt(n.in)} → ${fmt(n.out)} · ${n.nights} nights`,
      ) +
        `<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:4px">\n      ${!0 === n.paid ? '<span class="mchip good">paid</span>' : !1 === n.paid ? '<span class="mchip bad">unpaid</span>' : ""}\n      ${n.room ? `<span class="mchip">${esc(n.room)}</span>` : ""}${n.board ? `<span class="mchip">${esc(n.board)}</span>` : ""}${whoChip(n.who)}</div>` +
        kv("Check in", "00:00" === tm(n.in) ? "—" : tm(n.in)) +
        kv("Check out", "00:00" === tm(n.out) ? "—" : tm(n.out)) +
        (null != n.amount ? kv("Price", money(n.amount, n.ccy)) : "") +
        (n.ref ? kv("Reference", esc(n.ref)) : "") +
        (n.pin ? kv("PIN", esc(n.pin)) : "") +
        (n.phone
          ? kv("Phone", `<a href="tel:${esc(n.phone.replace(/\s/g, ""))}">${esc(n.phone)}</a>`)
          : "") +
        (n.cancel ? kv("Cancel", esc(n.cancel)) : "") +
        (n.note ? `<div class="br"><h4>Notes</h4><p>${esc(n.note)}</p></div>` : "") +
        (n.geo ? `<div class="br">${mapLink(n.geo, n.addr || n.name)}${wazeLink(n.geo)}</div>` : "")
    : "";
}
document.addEventListener("keydown", (e) => {
  "Escape" === e.key && (SHEET ? closeSheet() : CALOPEN && closeCal());
});
let LEG = null,
  ICAT = "do",
  ISUB = "all",
  PICKS = {},
  PEDIT = {},
  BASEACTS = null,
  FORM = null,
  PLEG = null,
  PSIDE = "plans",
  PVIEW = store.get("pview", "legs"),
  PDAY = null,
  CALOPEN = !1,
  PIMG = !1 !== store.get("pimg", !0);
function toggleImgs() {
  ((PIMG = !PIMG), store.set("pimg", PIMG), (KEEPY = window.scrollY), render());
}
const imgBtn = () =>
    `<button class="imgtog" onclick="event.stopPropagation();toggleImgs()">\n  <svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="10" r="1.5"/><path d="m21 15-5-5L5 19"/>\n  ${PIMG ? "" : '<path d="m3 3 18 18"/>'}</svg>${PIMG ? "Hide photos" : "Show photos"}</button>`,
  DIMG = {
    perth: "https://images.unsplash.com/photo-1773843149623-4cce19b002e4?w=1200&q=75",
    margaretriver: "https://images.unsplash.com/photo-1728479148526-ebee499fd154?w=1200&q=75",
    phuket: "https://images.unsplash.com/photo-1737515908817-2b7668aea1a1?w=1200&q=75",
    bangkok: "https://images.unsplash.com/photo-1704872656367-aab145fdee7f?w=1200&q=75",
    kohsamui: "https://images.unsplash.com/photo-1755259042777-72e876a7d386?w=1200&q=75",
    khaosok: "https://images.unsplash.com/photo-1675348081090-f2ec9f02eca7?w=1200&q=75",
    krabi: "https://images.unsplash.com/photo-1736753399626-578b167b85b7?w=1200&q=75",
  };
let STAYI = null,
  SCON = {},
  SEDIT = null,
  KEEPY = null,
  KEEPA = null;
const renderHere = () => {
    ((KEEPY = window.scrollY), render());
  },
  HSTRIP = [".areabar", ".seg", ".subseg", ".scroller", ".mvf-row"];
let KEEPX = null;
function grabX() {
  ((KEEPX = {}),
    HSTRIP.forEach((e) => {
      const t = document.querySelector(e);
      t && t.scrollWidth > t.clientWidth && (KEEPX[e] = t.scrollLeft);
    }));
}
function restoreX() {
  const e = KEEPX || {};
  ((KEEPX = null),
    HSTRIP.forEach((t) => {
      const n = document.querySelector(t);
      if (!n) return;
      null != e[t] && (n.scrollLeft = e[t]);
      const s = n.querySelector(".on");
      if (!s) return;
      const a = n.getBoundingClientRect(),
        i = s.getBoundingClientRect();
      i.left < a.left + 10
        ? (n.scrollLeft += i.left - a.left - 10)
        : i.right > a.right - 10 && (n.scrollLeft += i.right - a.right + 10);
    }));
}
const renderAt = (e) => {
  const t = document.querySelector(e);
  (t
    ? (KEEPA = { sel: e, top: t.getBoundingClientRect().top })
    : ((KEEPA = null), (KEEPY = window.scrollY)),
    render());
};
let AREA = "all";
const CATL = {
    do: "Activities",
    eat: "Restaurants",
    bar: "Bars",
    beach: "Beaches & pools",
    mkt: "Markets",
    sport: "Sport",
  },
  CATT = {
    do: "Activity",
    eat: "Food",
    bar: "Drinks",
    beach: "Beach",
    mkt: "Market",
    sport: "Sport",
  },
  CATO = ["do", "eat", "bar", "beach", "mkt", "sport"],
  ZO = ["city", "scarborough", "cottesloe", "freo", "swan", "rottnest"],
  ZL = {
    city: "Perth city",
    scarborough: "Scarborough",
    cottesloe: "Cottesloe",
    freo: "Freo",
    swan: "Swan Valley",
    rottnest: "Rottnest",
  },
  inZ = (e, t) => e.zone === t || (e.zones || []).indexOf(t) >= 0,
  SUBL = { michelin: "Michelin", street: "Street food", other: "Everything else" },
  SUBO = ["michelin", "street", "other"];
function setLeg(e) {
  ((LEG = e), (ISUB = "all"), (AREA = "all"), render());
}
function setArea(e) {
  ((AREA = e), (ISUB = "all"), renderAt(".areabar"));
}
function setICat(e) {
  ((ICAT = e), (ISUB = "all"), renderAt(".seg"));
}
function setISub(e) {
  ((ISUB = e), renderAt(".subseg"));
}
const legOf = (e) => (T.legs || []).find((t) => t.id === e) || {},
  sugAll = () => T.suggest || [],
  sugIdx = (e) => sugAll().findIndex((t) => t.id === e),
  score = (e) => {
    const t = /^\s*([\d.]+)/.exec(e.rating || "");
    return t ? parseFloat(t[1]) : null;
  },
  revs = (e) => {
    const t = /\(([^)]+)\)/.exec(e.rating || "");
    return t ? t[1] : "";
  },
  PSTAT = ["Idea", "Planned", "Booked"];
function mergePicks() {
  BASEACTS || (BASEACTS = T.activities.slice());
  const e = [];
  (BASEACTS.forEach((t) => {
    const n = "base:" + (t.pid || t.name),
      s = PEDIT[n];
    e.push(Object.assign({}, t, s ? s.data : null, { pid: t.pid, ekey: n }));
  }),
    Object.values(PICKS).forEach((t) => {
      const n = sugAll().find((e) => e.id === t.sid);
      if (!n || !t.date) return;
      const s = Object.assign({}, n.brief || {});
      (!s.cost && n.price && (s.cost = n.price),
        (s.heads = (s.heads || []).concat(n.book ? ["Booking: " + n.book] : [])),
        e.push({
          date: t.date,
          start: t.time || "",
          end: t.end || "",
          who: t.who || "R",
          city: legOf(n.leg).city || n.leg,
          name: n.name,
          type: CATT[n.cat],
          status: t.status || (t.booked ? "Booked" : "Planned"),
          loc: n.area,
          geo: n.geo,
          phone: n.phone,
          url: n.url,
          img: n.img,
          note: t.note || n.blurb,
          sid: n.id,
          brief: s,
          ekey: "pick:" + n.id,
        }));
    }),
    Object.keys(PEDIT).forEach((t) => {
      "own:" === t.slice(0, 4) && e.push(Object.assign({}, PEDIT[t].data, { ekey: t }));
    }),
    (T.activities = e.filter((e) => e && e.date)));
}
async function loadEdits() {
  let e = null;
  try {
    const t = await fetch(`${SB_URL}/rest/v1/plan_edit?select=key,data`, {
      headers: HDRS,
      cache: "no-store",
    });
    t.ok && ((e = await t.json()), store.set("pedit", e));
  } catch (e) {}
  (e || (e = store.get("pedit", [])),
    (PEDIT = {}),
    (e || []).forEach((e) => (PEDIT[e.key] = { key: e.key, data: e.data })));
}
async function putEdit(e, t) {
  ((PEDIT[e] = { key: e, data: t }), store.set("pedit", Object.values(PEDIT)));
  try {
    await fetch(`${SB_URL}/rest/v1/plan_edit`, {
      method: "POST",
      headers: {
        apikey: SB_KEY,
        Authorization: "Bearer " + SB_KEY,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify({ key: e, data: t }),
    });
  } catch (e) {}
}
async function dropEdit(e) {
  (delete PEDIT[e], store.set("pedit", Object.values(PEDIT)));
  try {
    await fetch(`${SB_URL}/rest/v1/plan_edit?key=eq.${encodeURIComponent(e)}`, {
      method: "DELETE",
      headers: { apikey: SB_KEY, Authorization: "Bearer " + SB_KEY },
    });
  } catch (e) {}
}
let DONE = (function () {
  let d = store.get("todoDone", null);
  if (d) return d;
  d = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && 0 === k.indexOf("done:")) {
        try {
          JSON.parse(localStorage.getItem(k)) && (d[k.slice(5)] = !0);
        } catch (e) {}
      }
    }
  } catch (e) {}
  store.set("todoDone", d);
  return d;
})();
const isDone = (k) => !!DONE[k];
async function pushTodo(k, v) {
  try {
    await fetch(`${SB_URL}/rest/v1/todo_state`, {
      method: "POST",
      headers: {
        apikey: SB_KEY,
        Authorization: "Bearer " + SB_KEY,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify({ key: k, done: !!v }),
    });
  } catch (e) {}
}
async function loadTodos() {
  let rows = null;
  try {
    const x = await fetch(`${SB_URL}/rest/v1/todo_state?select=*`, {
      headers: HDRS,
      cache: "no-store",
    });
    x.ok && (rows = await x.json());
  } catch (e) {}
  if (rows) {
    const srv = {};
    rows.forEach((o) => (srv[o.key] = !!o.done));
    Object.keys(DONE).forEach((k) => {
      DONE[k] && !(k in srv) && ((srv[k] = !0), pushTodo(k, !0));
    });
    ((DONE = srv), store.set("todoDone", DONE));
  }
}
async function loadPicks() {
  let e = null;
  try {
    const t = await fetch(`${SB_URL}/rest/v1/picks?select=*`, {
      headers: { apikey: SB_KEY, Authorization: "Bearer " + SB_KEY },
      cache: "no-store",
    });
    t.ok && ((e = await t.json()), store.set("picks", e));
  } catch (e) {}
  (e || (e = store.get("picks", [])),
    (PICKS = {}),
    (e || []).forEach((e) => (PICKS[e.sid] = e)),
    mergePicks());
}
function openPlan(e) {
  const t = sugAll().find((t) => t.id === e) || {},
    n = PICKS[e],
    s = legOf(t.leg);
  ((SHEET = { k: "plan" }),
    (FORM = {
      kind: "pick",
      sid: e,
      ekey: "pick:" + e,
      name: t.name || "",
      city: s.city || t.leg,
      date: (n && n.date) || t.date || s.from || "",
      time: (n && n.time) || "",
      end: (n && n.end) || "",
      who: (n && n.who) || s.who || "R",
      status: (n && n.status) || (n && n.booked ? "Booked" : "Planned"),
      note: (n && n.note) || "",
      img: t.img || "",
      loc: t.area || "",
      geo: t.geo || "",
      type: CATT[t.cat] || "Activity",
    }),
    paintSheet());
}
function editAct(e) {
  const t = T.activities[e];
  if (t) {
    if (t.sid && PICKS[t.sid]) return openPlan(t.sid);
    ((SHEET = { k: "plan" }),
      (FORM = {
        kind: t.ekey && "own:" === t.ekey.slice(0, 4) ? "own" : "base",
        ekey: t.ekey,
        sid: null,
        name: t.name || "",
        city: t.city || "",
        date: t.date || "",
        time: t.start || "",
        end: t.end || "",
        who: t.who || "R",
        status: t.status || "Planned",
        note: t.note || "",
        img: t.img || "",
        loc: t.loc || "",
        geo: t.geo || "",
        type: t.type || "Activity",
      }),
      paintSheet());
  }
}
function newPlan(e, t) {
  const n = dests().find((t) => t.city === e);
  ((SHEET = { k: "plan" }),
    (FORM = {
      kind: "own",
      ekey: "own:" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      sid: null,
      name: "",
      city: e || "",
      date: t || (n ? n.from : iso(today())),
      time: "",
      end: "",
      who: (n && n.main.who) || "R",
      status: "Planned",
      note: "",
      img: "",
      loc: "",
      geo: "",
      type: "Activity",
      fresh: !0,
    }),
    paintSheet());
}
const PTYPES = [
  "Activity",
  "Breakfast",
  "Lunch",
  "Dinner",
  "Drinks",
  "Beach",
  "Sightseeing",
  "Sport",
  "Travel",
  "Other",
];
function pickImg(e) {
  const t = e.files && e.files[0];
  if (!t) return;
  if (!/^image\//.test(t.type)) return ((FORM.imgerr = "That is not an image."), void paintSheet());
  ((FORM.imgbusy = !0), (FORM.imgerr = ""), paintSheet());
  const n = new FileReader();
  ((n.onload = () => {
    const e = new Image();
    ((e.onload = async () => {
      const t = Math.min(1, 1600 / Math.max(e.width, e.height)),
        n = document.createElement("canvas");
      ((n.width = Math.round(e.width * t)),
        (n.height = Math.round(e.height * t)),
        n.getContext("2d").drawImage(e, 0, 0, n.width, n.height),
        n.toBlob(
          async (e) => {
            if (!e)
              return (
                (FORM.imgbusy = !1),
                (FORM.imgerr = "Could not read that image."),
                void paintSheet()
              );
            const t =
              "plan-img/" + FORM.ekey.replace(/[^a-z0-9]+/gi, "-") + "-" + Date.now() + ".jpg";
            try {
              const n = await fetch(`${SB_URL}/storage/v1/object/app/${t}`, {
                method: "POST",
                headers: {
                  apikey: SB_KEY,
                  Authorization: "Bearer " + SB_KEY,
                  "Content-Type": "image/jpeg",
                  "x-upsert": "true",
                },
                body: e,
              });
              if (!n.ok) throw new Error("upload " + n.status);
              ((FORM.img = `${SB_URL}/storage/v1/object/public/app/${t}`),
                (FORM.imgbusy = !1),
                (FORM.imgerr = ""));
            } catch (e) {
              ((FORM.imgbusy = !1),
                (FORM.imgerr = "Upload failed — you can paste an image address instead."));
            }
            paintSheet();
          },
          "image/jpeg",
          0.82,
        ));
    }),
      (e.onerror = () => {
        ((FORM.imgbusy = !1), (FORM.imgerr = "Could not read that image."), paintSheet());
      }),
      (e.src = n.result));
  }),
    (n.onerror = () => {
      ((FORM.imgbusy = !1), (FORM.imgerr = "Could not read that file."), paintSheet());
    }),
    n.readAsDataURL(t));
}
function fset(e, t) {
  ((FORM[e] = t), (FORM.err = ""), paintSheet());
}
async function savePick() {
  if ("pick" !== FORM.kind) return saveOwn();
  if (!FORM.date) return ((FORM.err = "Pick a date first."), void paintSheet());
  const e = document.querySelector(".sh-panel");
  e && e.classList.add("saving");
  const t = {
    sid: FORM.sid,
    date: FORM.date,
    time: FORM.time,
    end: FORM.end,
    who: FORM.who,
    status: FORM.status,
    booked: "Booked" === FORM.status,
    note: FORM.note,
  };
  try {
    await fetch(`${SB_URL}/rest/v1/picks`, {
      method: "POST",
      headers: {
        apikey: SB_KEY,
        Authorization: "Bearer " + SB_KEY,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify(t),
    });
  } catch (e) {}
  ((PICKS[t.sid] = t),
    store.set("picks", Object.values(PICKS)),
    mergePicks(),
    closeSheet(),
    render());
}
async function saveOwn() {
  if (!FORM.name.trim()) return ((FORM.err = "Give it a name."), void paintSheet());
  if (!FORM.date) return ((FORM.err = "Pick a date first."), void paintSheet());
  const e = document.querySelector(".sh-panel");
  e && e.classList.add("saving");
  const t = {
    name: FORM.name.trim(),
    date: FORM.date,
    start: FORM.time,
    end: FORM.end,
    who: FORM.who,
    status: FORM.status,
    type: FORM.type,
    loc: FORM.loc,
    geo: FORM.geo,
    img: FORM.img,
    note: FORM.note,
    city: FORM.city,
  };
  (await putEdit(FORM.ekey, t), mergePicks(), closeSheet(), render());
}
async function delPick() {
  if ("pick" === FORM.kind) {
    const e = FORM.sid;
    try {
      await fetch(`${SB_URL}/rest/v1/picks?sid=eq.${encodeURIComponent(e)}`, {
        method: "DELETE",
        headers: { apikey: SB_KEY, Authorization: "Bearer " + SB_KEY },
      });
    } catch (e) {}
    (delete PICKS[e], store.set("picks", Object.values(PICKS)));
  } else await dropEdit(FORM.ekey);
  (mergePicks(), closeSheet(), render());
}
function availHTML(e, t) {
  if (!e) return '<p class="av-none">Pick a date and the rest of that day shows up here.</p>';
  const n = dayEntries(e).filter((e) => !("act" === e.k && e.o.sid === t));
  return n.length
    ? `<ul class="av">${n
        .map((e) => {
          const t = e.o,
            n =
              "flight" === e.k
                ? `${city(t.from).code} → ${city(t.to).code}`
                : "transfer" === e.k
                  ? t.kind || "Transfer"
                  : "in" === e.k
                    ? "Check in · " + t.name
                    : "out" === e.k
                      ? "Check out · " + t.name
                      : t.name;
          return `<li><span class="t">${esc(e.t || "—")}</span><span>${esc(n)}</span></li>`;
        })
        .join("")}</ul>`
    : `<p class="av-free">Nothing else on ${fmt(e)}. The day is yours.</p>`;
}
function planSheet() {
  const e = FORM,
    t = "pick" !== e.kind,
    n = (e.sid && sugAll().find((t) => t.id === e.sid)) || {},
    s = e.sid ? legOf(n.leg) : dests().find((t) => t.city === e.city) || { main: {} },
    a = e.sid ? s.from || "" : s.from || T.start,
    i = e.sid ? s.to || "" : s.to || T.end,
    o = (t, n) =>
      `<button class="${e.who === t ? "on" : ""}" onclick="fset('who','${t}')">${n}</button>`,
    l = (t) =>
      `<button class="${e.status === t ? "on" : ""}" onclick="fset('status','${t}')">${t}</button>`;
  return (
    (t
      ? e.img
        ? shHero(e.img, HUES[e.city], esc(e.name || "New plan"), esc(s.name || ""))
        : `<div class="sh-hero noimg"><span class="t"><h3>${esc(e.name || "New plan")}</h3>\n               <div class="w">${esc(s.name || "")}</div></span></div>`
      : shHero(n.img, HUES[s.city], esc(n.name), esc(s.name || ""))) +
    (t
      ? `<div class="fld"><label>What is it</label>\n       <input type="text" value="${esc(e.name)}" placeholder="Dinner at the little place by the pier"\n         oninput="FORM.name=this.value" onchange="fset('name',this.value)"></div>`
      : "") +
    `<div class="fld2">\n       <div class="fld"><label>Date</label><input type="date" value="${esc(e.date)}"\n         min="${esc(a)}" max="${esc(i)}" onchange="fset('date',this.value)"></div>\n       <div class="fld"><label>Start</label><input type="time" value="${esc(e.time)}" onchange="fset('time',this.value)"></div>\n       <div class="fld"><label>Ends</label><input type="time" value="${esc(e.end)}" onchange="fset('end',this.value)"></div>\n     </div>\n     <div class="fld"><label>Status</label><div class="pick3">${l("Idea")}${l("Planned")}${l("Booked")}</div>\n       <p class="fhint">${"Idea" === e.status ? "Still a maybe — it shows in the day but not as something you have committed to." : "Planned" === e.status ? "You intend to do it, but nothing is booked." : "Locked in. Put the reference in the note below."}</p></div>\n     <div class="br av-box"><h4>What else is on${e.date ? " " + fmt(e.date) : ""}</h4>\n       ${availHTML(e.date, e.sid)}\n       ${n.dur ? `<p class="av-dur">This takes about ${esc(n.dur)}.</p>` : ""}</div>\n     <div class="fld"><label>Who is going</label><div class="pick3">${o("R", "Robbie")}${o("P", "Mum &amp; Dad")}${o("RP", "Everyone")}</div></div>` +
    (t
      ? `<div class="fld"><label>Type</label>\n       <select onchange="fset('type',this.value)">${PTYPES.map((t) => `<option${t === e.type ? " selected" : ""}>${t}</option>`).join("")}</select></div>\n     <div class="fld"><label>Where</label><input type="text" value="${esc(e.loc)}" placeholder="Bophut, near the pier"\n       oninput="FORM.loc=this.value" onchange="fset('loc',this.value)"></div>\n     <div class="fld"><label>Coordinates <i>optional — this is what puts it on the map</i></label>\n       <input type="text" value="${esc(e.geo)}" placeholder="9.5601,100.0631"\n         oninput="FORM.geo=this.value" onchange="fset('geo',this.value)"></div>\n     <div class="fld"><label>Picture <i>optional</i></label>\n       <div class="imgrow">\n         <label class="imgup">${e.imgbusy ? "Uploading…" : "Choose a photo"}\n           <input type="file" accept="image/*" onchange="pickImg(this)"${e.imgbusy ? " disabled" : ""}></label>\n         ${e.img ? "<button class=\"imgclr\" onclick=\"fset('img','')\">Remove</button>" : ""}\n       </div>\n       <input type="text" value="${esc(e.img)}" placeholder="…or paste an image address"\n         oninput="FORM.img=this.value" onchange="fset('img',this.value)">\n       ${e.imgerr ? `<p class="fhint bad">${esc(e.imgerr)}</p>` : ""}</div>`
      : "") +
    `<div class="fld"><label>${"Booked" === e.status ? "Booking reference and notes" : "Note"}</label>\n       <textarea oninput="FORM.note=this.value" onchange="fset('note',this.value)" placeholder="${"Booked" === e.status ? "Booking ref, table time, who to ask for…" : "Anything you want to remember"}">${esc(e.note)}</textarea></div>` +
    (n.book
      ? `<div class="br"><h4>How to book</h4><p>${esc(n.book)}</p>\n       ${n.phone ? `<p style="margin-top:6px"><a href="tel:${esc((n.phone || "").replace(/\s/g, ""))}">${esc(n.phone)}</a></p>` : ""}\n       ${n.url ? `<p style="margin-top:6px"><a href="${esc(n.url)}" target="_blank" rel="noopener">Open website</a></p>` : ""}</div>`
      : "") +
    (e.err ? `<p class="fhint bad" style="margin-top:10px">${esc(e.err)}</p>` : "") +
    `<div class="shbtns">${("pick" === e.kind ? PICKS[e.sid] : !e.fresh && PEDIT[e.ekey]) ? `<button class="rm" onclick="delPick()">${"base" === e.kind ? "Undo my changes" : "Remove"}</button>` : ""}\n       <button class="go" onclick="savePick()">${e.fresh ? "Add to plans" : "Save"}</button></div>`
  );
}
function ideaSheet(e) {
  const t = sugAll()[e];
  if (!t) return "";
  const n = legOf(t.leg),
    s = PICKS[t.id],
    a = score(t);
  return (
    shHero(t.img, HUES[n.city], esc(t.name), esc(t.area || n.name || "")) +
    `<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:4px">\n      ${a ? `<span class="mchip star">★ ${a.toFixed(1)}</span>` : ""}\n      ${t.cuisine ? `<span class="mchip">${esc(t.cuisine)}</span>` : ""}\n      ${t.sub && "bar" === t.cat ? `<span class="mchip">${esc(t.sub)}</span>` : ""}\n      ${"michelin" === t.sub ? '<span class="mchip star">Michelin</span>' : ""}\n      ${"street" === t.sub ? '<span class="mchip">Street food</span>' : ""}\n      ${t.dur ? `<span class="mchip">${esc(t.dur)}</span>` : ""}\n      ${s ? `<span class="mchip ${s.booked ? "good" : "tbd"}">${s.booked ? "Booked" : "Planned"} ${fmt(s.date)}</span>` : ""}</div>\n     ${t.date ? kv("Date", fmtL(t.date)) : ""}\n     ${t.price ? kv("Price", esc(t.price)) : ""}\n     ${t.dist ? kv("Getting there", esc(t.dist)) : ""}\n     ${t.rating ? kv("Rating", esc(t.rating)) : ""}\n     ${t.onsale ? kv("Tickets", esc(t.onsale)) : ""}\n     <div class="br"><h4>What it is</h4><p>${esc(t.blurb)}</p>\n       ${t.why ? `<p style="margin-top:7px;color:var(--ink-2)">${esc(t.why)}</p>` : ""}</div>\n     ${briefHTML(t.brief)}\n     ${t.book ? `<div class="br"><h4>How to book</h4><p>${esc(t.book)}</p></div>` : ""}\n     ${t.imgnote ? `<p class="imgnote">Photo: ${esc(t.imgnote)}</p>` : ""}\n     <div class="iacts" style="margin-top:12px">\n       ${t.url ? `<a class="ilink" href="${esc(t.url)}" target="_blank" rel="noopener">Website</a>` : ""}\n       ${t.phone ? `<a class="ilink" href="tel:${esc(t.phone.replace(/\s/g, ""))}">Call</a>` : ""}\n       ${t.geo ? `<a class="ilink" href="${mapURL(t.geo, t.name)}" target="_blank" rel="noopener">Map</a>` : ""}</div>\n     <div class="shbtns"><button class="go" onclick="openPlan('${t.id}')">${s ? "Edit your plan" : "Add to plans"}</button></div>`
  );
}
const ideaCard = (e) => {
    const t = PICKS[e.id],
      n = sugIdx(e.id),
      s = score(e);
    return `<div class="card idea tap" onclick="tapOpen(event,'idea',${n})">\n    <div class="i-hero">${e.img ? `<img src="${esc(e.img)}" alt="" loading="lazy" onerror="this.closest('.i-hero').classList.add('noimg')">` : ""}\n      <span class="scrim"></span>\n      ${e.date || t ? `<span class="i-tags">${e.date ? `<span class="i-when">${fmt(e.date)}</span>` : ""}${t ? ((a = t.status || (t.booked ? "Booked" : "Planned")), `<span class="i-flag${"Idea" === a ? "" : " good"}">${a}</span>`) : ""}</span>` : ""}\n      ${e.walk ? '<span class="i-walk">Walkable</span>' : ""}\n      <span class="cap">${esc(e.name)}</span></div>\n    <div class="i-body">\n      <div class="i-meta">${esc(e.area || "")}${"bar" === e.cat && e.sub ? " · " + esc(e.sub) : ""}${e.cuisine ? " · " + esc(e.cuisine) : ""}</div>\n      <div class="note-txt" style="color:var(--ink)">${esc(e.blurb)}</div>\n      <div class="ichips">\n        ${s ? `<span class="mchip star">★ ${s.toFixed(1)}<i>${esc(revs(e))}</i></span>` : ""}\n        ${"michelin" === e.sub ? '<span class="mchip star">Michelin</span>' : ""}\n        ${e.price ? `<span class="mchip">${esc(e.price)}</span>` : ""}\n        ${e.dur ? `<span class="mchip">${esc(e.dur)}</span>` : ""}</div>\n      ${e.dist ? `<div class="i-dist">${esc(e.dist)}</div>` : ""}\n      <div class="iacts">\n        ${e.url ? `<a class="ilink" href="${esc(e.url)}" target="_blank" rel="noopener">Website</a>` : ""}\n        ${e.phone ? `<a class="ilink" href="tel:${esc(e.phone.replace(/\s/g, ""))}">Call</a>` : ""}\n        ${e.geo ? `<a class="ilink" href="${mapURL(e.geo, e.name)}" target="_blank" rel="noopener">Map</a>` : ""}\n        <button class="ibtn${t ? " on" : ""}" onclick="event.stopPropagation();openPlan('${e.id}')">${t ? "In your plans" : "Add to plans"}</button>\n      </div></div></div>`;
    var a;
  },
  legsOfCity = (e) => (T.legs || []).filter((t) => (t.city || t.id) === e);
function dests() {
  const e = (T.legs || []).filter((e) => "ALL" === WHO || "RP" === e.who || e.who === WHO),
    t = new Map();
  e.forEach((e) => {
    const n = e.city || e.id,
      s = t.get(n) || { city: n, legs: [], from: e.from, to: e.to };
    (s.legs.push(e),
      e.from < s.from && (s.from = e.from),
      e.to > s.to && (s.to = e.to),
      t.set(n, s));
  });
  const n = [...t.values()];
  return (
    n.forEach((e) => {
      ((e.main = e.legs
        .slice()
        .sort((e, t) => nDays(D(t.from), D(t.to)) - nDays(D(e.from), D(e.to)))[0]),
        (e.name = e.main.name),
        (e.nights = nDays(D(e.from), D(e.to))),
        (e.ids = new Set(e.legs.map((e) => e.id))),
        (e.ideas = sugAll().filter((t) => e.ids.has(t.leg)).length),
        (e.acts = T.activities.filter((t) => mine(t) && t.city === e.city)),
        (e.stays = T.stays.filter((t) => mine(t) && t.city === e.city)),
        (e.plans = e.acts.length + e.stays.length),
        (e.booked = e.acts.filter((e) => "booked" === actState(e)).length));
    }),
    n.sort((e, t) => e.from.localeCompare(t.from))
  );
}
const destOf = () => dests().find((e) => e.city === PLEG) || null;
function openDest(e) {
  ((PDAY = null), (PLEG = e), (PSIDE = "plans"), (AREA = "all"), (ISUB = "all"));
  const t = dests().find((t) => t.city === e);
  (t && (LEG = t.main.id), render());
}
function backDest() {
  ((PLEG = null), render());
}
function setPSide(e) {
  ((PSIDE = e), render());
}
function setPView(e) {
  ((PVIEW = e), store.set("pview", e), (KEEPY = 0), render());
}
const kmApart = (e, t) => {
  const n = (e) => (e * Math.PI) / 180,
    s = n(t[0] - e[0]),
    a = n(t[1] - e[1]),
    i = Math.sin(s / 2) ** 2 + Math.cos(n(e[0])) * Math.cos(n(t[0])) * Math.sin(a / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(i));
};
function zoneCentres(e) {
  const t = {};
  sugAll().forEach((n) => {
    if (!e.ids.has(n.leg)) return;
    const s = llOf(n.geo);
    s &&
      [n.zone]
        .concat(n.zones || [])
        .filter(Boolean)
        .forEach((e) => {
          (t[e] = t[e] || []).push(s);
        });
  });
  const n = {};
  return (
    Object.keys(t).forEach((e) => {
      const s = t[e];
      n[e] = [
        s.reduce((e, t) => e + t[0], 0) / s.length,
        s.reduce((e, t) => e + t[1], 0) / s.length,
      ];
    }),
    n
  );
}
function zonesOfAct(e, t) {
  if (e && e.sid) {
    const t = sugAll().find((t) => t.id === e.sid);
    if (t) {
      const e = [t.zone].concat(t.zones || []).filter(Boolean);
      if (e.length) return e;
    }
  }
  if (t && e && e.geo) {
    const n = llOf(e.geo);
    if (n) {
      let e = null,
        s = 1 / 0;
      if (
        (Object.keys(t).forEach((a) => {
          const i = kmApart(n, t[a]);
          i < s && ((s = i), (e = a));
        }),
        e && s <= 25)
      )
        return [e];
    }
  }
  return null;
}
function ideasFilter() {
  const e = destOf() || dests()[0];
  if (!e) return { legs: [], leg: null, all: [], cats: [], items: [], subbar: "" };
  const t = e.legs,
    n = e.main,
    s = sugAll().filter((t) => e.ids.has(t.leg)),
    a = (zoneCentres(e), ZO.filter((e) => s.some((t) => inZ(t, e))));
  a.length < 2 ? (AREA = "all") : "all" === AREA || a.includes(AREA) || (AREA = "all");
  const i = "all" === AREA ? s : s.filter((e) => inZ(e, AREA)),
    o = (e) => i.filter((t) => t.cat === e).length,
    l = CATO.filter(o);
  if (!l.length) return { legs: t, leg: n, all: i, cats: [], items: [], subbar: "" };
  o(ICAT) || (ICAT = l[0]);
  let c = i.filter((e) => e.cat === ICAT),
    r = "";
  if ("eat" === ICAT) {
    const e = (e) => c.filter((t) => (t.sub || "other") === e).length,
      t = SUBO.filter(e);
    t.length > 1 &&
      ("all" === ISUB || e(ISUB) || (ISUB = "all"),
      (r = `<div class="subseg"><button class="${"all" === ISUB ? "on" : ""}" onclick="setISub('all')">All ${c.length}</button>${t.map((t) => `<button class="${ISUB === t ? "on" : ""}" onclick="setISub('${t}')">${SUBL[t]} <span>${e(t)}</span></button>`).join("")}</div>`),
      "all" !== ISUB && (c = c.filter((e) => (e.sub || "other") === ISUB)));
  }
  return (
    (c = c.slice().sort((e, t) => {
      if (e.date && t.date) return e.date < t.date ? -1 : 1;
      if (e.date) return -1;
      if (t.date) return 1;
      const n = score(e),
        s = score(t);
      return (null == s ? 0 : s) - (null == n ? 0 : n);
    })),
    { legs: t, leg: n, all: i, cats: l, items: c, subbar: r, n: o, zones: a, legAll: s }
  );
}
function ideasBody() {
  const e = ideasFilter(),
    { cats: t, items: n, subbar: s } = e,
    a = e.n;
  return t.length
    ? `<div class="seg">${t.map((e) => `<button class="${e === ICAT ? "on" : ""}" onclick="setICat('${e}')">${CATL[e]} <span style="opacity:.55">${a(e)}</span></button>`).join("")}</div>\n    ${s}\n    ${n.map(ideaCard).join("") || '<div class="note">Nothing suggested here yet.</div>'}`
    : '<div class="note">Nothing suggested here yet.</div>';
}
function plansBody(e) {
  const t = zoneCentres(e);
  let n = e.acts;
  "all" !== AREA &&
    (n = n.filter((e) => {
      const n = zonesOfAct(e, t);
      return !n || n.indexOf(AREA) >= 0;
    }));
  const s = {};
  n.forEach((e) => {
    (s[e.date] = s[e.date] || []).push(e);
  });
  const a = Object.keys(s).sort(),
    i = "all" !== AREA && n.some((e) => !zonesOfAct(e, t)),
    o = e.stays.slice().sort((e, t) => e.in.localeCompare(t.in)),
    l = { building: "🏢", house: "🏡", hotel: "🏨", resort: "🏝️" };
  return `${o.length ? `<div class="dgroup">Where you're staying<b>${o.length}</b></div>\n    <div class="stays in-dest">${o.map((e) => `<div class="stay-card tapc" onclick="openStay(${e._i})">\n      ${PIMG ? hero(e, l[e.icon] || "🏨") : ""}\n      <div class="row" style="align-items:flex-start"><h3 style="margin-top:0;flex:1">${esc(e.name)}</h3>\n        <svg class="nb-arw" style="position:static;opacity:.5;margin-top:3px" viewBox="0 0 24 24"><path d="m9 5 7 7-7 7"/></svg></div>\n      <div class="s-dates">${fmt(e.in)} → ${fmt(e.out)} · ${e.nights} nights</div>\n      <div style="margin-top:9px">${whoChip(e.who)}</div></div>`).join("")}</div>` : ""}\n    ${
    a.length
      ? a
          .map(
            (e) =>
              `<div class="dgroup">${fmtL(e)}<b>${s[e].length}</b></div>\n        ${s[e]
                .slice()
                .sort((e, t) => (e.start || "99:99").localeCompare(t.start || "99:99"))
                .map((e) => planCard(e, !0))
                .join("")}`,
          )
          .join("")
      : `<div class="note">${e.acts.length ? "Nothing here in this area." : "Nothing planned here yet — the Ideas tab is where to start."}</div>`
  }\n    ${i ? '<div class="note" style="margin-top:10px">One or more plans here have no coordinates yet, so they cannot be placed in an area — they show under all of them.</div>' : ""}`;
}
function openCal() {
  ((CALOPEN = !0), paintCal());
}
function closeCal() {
  ((CALOPEN = !1), paintCal());
}
function paintCal() {
  let e = document.getElementById("calpop");
  if (
    (e || ((e = document.createElement("div")), (e.id = "calpop"), document.body.appendChild(e)),
    !CALOPEN)
  )
    return ((e.className = "modal"), (e.innerHTML = ""), void syncLock());
  ((e.className = "modal open"),
    e.setAttribute("onclick", "if(event.target===this)closeCal()"),
    (e.innerHTML = `<div class="mbox" role="dialog" aria-modal="true" aria-label="Pick a day">\n    <button class="mx" onclick="closeCal()" aria-label="Close">&times;</button>\n    <div class="kicker">Go to a day</div>\n    ${calGrid()}</div>`),
    syncLock());
}
function openDay(e) {
  ((PDAY = e), (SEL = e), (CALOPEN = !1), paintCal(), render());
}
function backDay() {
  ((PDAY = null), render());
}
function calGrid() {
  calInit();
  const e = iso(D(T.start)),
    t = iso(D(T.end)),
    n = iso(today()),
    s = CAL.getFullYear(),
    a = CAL.getMonth(),
    i = (new Date(s, a, 1).getDay() + 6) % 7,
    o = new Date(s, a + 1, 0).getDate(),
    l = 12 * s + a,
    c = 12 * D(e).getFullYear() + D(e).getMonth(),
    r = 12 * D(t).getFullYear() + D(t).getMonth(),
    d = [];
  for (let e = 0; e < i; e++) d.push("<div></div>");
  for (let i = 1; i <= o; i++) {
    const o = iso(new Date(s, a, i)),
      l = o < e || o > t,
      c = l ? 0 : dayEntries(o).length;
    d.push(
      `<button class="cal-day${l ? " out" : " trip"}${o === SEL ? " sel" : ""}${o === n ? " today" : ""}"\n      ${l ? 'disabled aria-disabled="true"' : `onclick="openDay('${o}')"`}>\n      <span class="cd-num">${i}</span>\n      ${c ? `<span class="cd-dots">${Array(Math.min(c, 4)).fill("<i></i>").join("")}</span>` : ""}\n      <span class="cd-strips">${whoStrips(
        o,
      )
        .map((e) => `<i class="cstrip" style="background:${e}"></i>`)
        .join("")}</span>\n    </button>`,
    );
  }
  return `<div class="calhead">\n      <button class="cal-nav" onclick="shiftMonth(-1)" ${l > c ? "" : "disabled"}>&lsaquo;</button>\n      <span class="cal-month">${MONL[a]} ${s}</span>\n      <button class="cal-nav" onclick="shiftMonth(1)" ${l < r ? "" : "disabled"}>&rsaquo;</button>\n    </div>\n    <div class="cal-grid">${["M", "T", "W", "T", "F", "S", "S"].map((e) => `<div class="cal-dow">${e}</div>`).join("")}${d.join("")}</div>\n    <div class="note" style="margin-top:9px">Only ${fmt(T.start)} to ${fmt(T.end)} can be picked.</div>`;
}
function vDay() {
  return `<div class="backbar">\n      <button onclick="backDay()"><svg viewBox="0 0 24 24"><path d="m15 5-7 7 7 7"/></svg>Plans</button>${imgBtn()}</div>\n    <section class="sec">\n      <div class="datebar" style="margin-bottom:12px">\n        <button class="cal-nav" onclick="stepDay(-1)" ${PDAY > iso(D(T.start)) ? "" : "disabled"}>&lsaquo;</button>\n        <span class="dsel"><span class="dsel-day">${fmtL(PDAY)}</span>\n          <span class="dsel-sub">Day <b>${nDays(D(T.start), D(PDAY)) + 1}</b> of ${nDays(D(T.start), D(T.end)) + 1}</span></span>\n        <button class="cal-nav" onclick="stepDay(1)" ${PDAY < iso(D(T.end)) ? "" : "disabled"}>&rsaquo;</button>\n      </div>\n      ${dayPanel(PDAY)}\n    </section>`;
}
function stepDay(e) {
  const t = D(PDAY);
  (t.setDate(t.getDate() + e),
    t < D(T.start) ||
      t > D(T.end) ||
      ((PDAY = iso(t)),
      (SEL = PDAY),
      (CAL = new Date(t.getFullYear(), t.getMonth(), 1)),
      render()));
}
const pviewBar = () =>
  `<div class="ptabs pview">
    <button class="${"legs" === PVIEW ? "on" : ""}" onclick="setPView('legs')">By place</button>
    <button class="${"all" === PVIEW ? "on" : ""}" onclick="setPView('all')">Everything</button>
  </div>`;

// Every plan across the whole trip, in date order, grouped under a clear date heading.
function vAllPlans() {
  const acts = (T.activities || [])
    .filter(mine)
    .filter((a) => a.date)
    .slice()
    .sort((a, b) =>
      (a.date + "T" + (a.start || "99:99")).localeCompare(b.date + "T" + (b.start || "99:99")),
    );
  if (!acts.length)
    return `<section class="sec">${pviewBar()}<div class="note">Nothing planned yet.</div></section>`;

  const byDate = {};
  acts.forEach((a) => (byDate[a.date] = byDate[a.date] || []).push(a));
  const dates = Object.keys(byDate).sort();
  const todayISO = iso(today());

  const body = dates
    .map((d) => {
      const where = whereOn(d),
        n = byDate[d].length,
        dt = D(d),
        past = d < todayISO,
        isToday = d === todayISO,
        day = nDays(D(T.start), dt) + 1;
      return `<div class="daymark${isToday ? " now" : ""}${past ? " past" : ""}">
          <div class="dm-l">
            <div class="dm-date">${DOW[dt.getDay()]} ${dt.getDate()} ${MON[dt.getMonth()]}</div>
            <div class="dm-sub">${isToday ? "Today" : day > 0 ? "Day " + day : ""}${where ? (day > 0 || isToday ? " · " : "") + esc(where.name) : ""}</div>
          </div>
          <span class="dm-n">${n}</span>
        </div>
        ${byDate[d].map((a) => planCard(a, !0)).join("")}`;
    })
    .join("");

  return `<section class="sec">${pviewBar()}
    <div class="sg-head"><h2>Everything, in order</h2><span class="n">${acts.length} plans · ${dates.length} days</span></div>
    ${body}</section>`;
}

function vDests() {
  const e = dests();
  return e.length
    ? `<section class="sec">${pviewBar()}\n    <button class="card calbar" onclick="openCal()">\n      <svg viewBox="0 0 24 24"><path d="M8 3v4M16 3v4"/><rect x="3" y="6" width="18" height="15" rx="2"/><path d="M3 11h18"/></svg>\n      <b>Go to a day</b>\n      <svg class="calgo" viewBox="0 0 24 24"><path d="m9 5 7 7-7 7"/></svg>\n    </button>\n    <div class="sg-head"><h2>Where you're going</h2><span class="n">${e.length} places</span></div>\n    <div class="dgrid">${e.map((e) => `<button class="dtile${DIMG[e.city] ? "" : " noimg"}" onclick="openDest('${e.city}')">\n      ${DIMG[e.city] ? `<img src="${DIMG[e.city]}" alt="" loading="lazy" onerror="this.closest('.dtile').classList.add('noimg')">` : ""}\n      <span class="dt-scrim"></span>\n      <span class="dt-txt">\n        <b>${esc(e.name)}</b>\n        <i>${fmtS(e.from)} – ${fmtS(e.to)} · ${e.nights} nights</i>\n        <span class="dt-chips">\n          ${e.plans ? `<em class="good">${e.plans} planned</em>` : '<em class="dim">nothing yet</em>'}\n          ${e.ideas ? `<em>${e.ideas} ideas</em>` : ""}\n        </span>\n      </span></button>`).join("")}</div>\n  </section>`
    : '<div class="center">Nothing for this traveller.</div>';
}
function vPlans() {
  if (PDAY) return vDay();
  if (!PLEG) return "all" === PVIEW ? vAllPlans() : vDests();
  const e = destOf();
  if (!e) return ((PLEG = null), vDests());
  const t = sugAll().filter((t) => e.ids.has(t.leg)),
    n = zoneCentres(e),
    s = ZO.filter((e) => t.some((t) => inZ(t, e)));
  s.length < 2 ? (AREA = "all") : "all" === AREA || s.includes(AREA) || (AREA = "all");
  const a = (s) =>
      "ideas" === PSIDE
        ? t.filter((e) => inZ(e, s)).length
        : e.acts.filter((e) => {
            const t = zonesOfAct(e, n);
            return t && t.indexOf(s) >= 0;
          }).length,
    i = s.filter((e) => a(e) > 0);
  return (
    "all" === AREA || i.includes(AREA) || (AREA = "all"),
    `<div class="backbar">\n      <button onclick="backDest()"><svg viewBox="0 0 24 24"><path d="m15 5-7 7 7 7"/></svg>Plans</button>\n      <span>${esc(e.name)}</span>${"plans" === PSIDE ? imgBtn() : ""}</div>\n    <section class="sec">\n      <div class="card" style="margin-bottom:12px">\n        <div class="kicker">${fmt(e.from)} → ${fmt(e.to)} · ${e.nights} nights</div>\n        <div class="dim" style="margin-top:5px">${esc(e.main.note || "")}</div>\n        <div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap">${e.legs.map((e) => whoChip(e.who)).join("")}</div>\n        <div class="btnrow">${"plans" === PSIDE ? `<button class="addbtn" onclick="newPlan('${e.city}')">+ Add a plan</button>` : ""}</div>\n      </div>\n      <div class="ptabs">\n        <button class="${"plans" === PSIDE ? "on" : ""}" onclick="setPSide('plans')">Plans <span>${e.plans}</span></button>\n        <button class="${"ideas" === PSIDE ? "on" : ""}" onclick="setPSide('ideas')">Ideas <span>${e.ideas}</span></button>\n      </div>\n      ${i.length > 1 ? `<div class="areabar">\n        <button class="${"all" === AREA ? "on" : ""}" onclick="setArea('all')">${"ideas" === PSIDE ? "All " + t.length : "All areas"}</button>\n        ${i.map((e) => `<button class="${AREA === e ? "on" : ""}" onclick="setArea('${e}')">${ZL[e]} ${a(e)}</button>`).join("")}\n      </div>` : ""}\n      ${"plans" === PSIDE ? plansBody(e) : ideasBody()}\n    </section>`
  );
}
const ideasOn = () => !!(T && T.flags && T.flags.ideas);
function ensureIdeasTab() {
  const e = document.getElementById("tabs");
  if (!e) return;
  const t = e.querySelector('[data-t="ideas"]');
  (t && t.remove(),
    "ideas" === TAB && ((TAB = "cal"), (PLEG = null)),
    ideasOn() || "ideas" !== PSIDE || (PSIDE = "plans"));
}
/* ───────────────────────────── MONEY ─────────────────────────────
   One ledger, built from everything that carries a price: stays,
   flights, activities, plus T.finance for the costs that do not
   belong to any single record (baggage, storage, travel money).
   A cost lives in exactly one of those places, so nothing is
   counted twice. Paid/unpaid can be overridden per line and the
   override syncs through money_state, same pattern as the to-dos. */
const ledgerFX = () => (T.fx && T.fx.rates) || { GBP: 1 },
  toGBP = (e, t) => {
    if (null == e || !t || "points" === t) return null;
    const n = ledgerFX()[t];
    return n ? e / n : null;
  },
  gbp = (e) =>
    null == e
      ? "&mdash;"
      : "£" + (Math.abs(e) < 100 ? e.toFixed(2) : Math.round(e).toLocaleString("en-GB"));
let MPAID = store.get("moneyPaid", {});
const paidOf = (e) => (e.id in MPAID ? !!MPAID[e.id] : !!e.paid);
async function pushMoney(e, t) {
  try {
    await fetch(`${SB_URL}/rest/v1/money_state`, {
      method: "POST",
      headers: {
        apikey: SB_KEY,
        Authorization: "Bearer " + SB_KEY,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify({ key: e, paid: !!t }),
    });
  } catch (e) {}
}
async function loadMoney() {
  let e = null;
  try {
    const t = await fetch(`${SB_URL}/rest/v1/money_state?select=*`, {
      headers: HDRS,
      cache: "no-store",
    });
    t.ok && (e = await t.json());
  } catch (e) {}
  if (e) {
    const t = {};
    (e.forEach((e) => (t[e.key] = !!e.paid)), (MPAID = t), store.set("moneyPaid", MPAID));
  }
}
function togPaid(e) {
  const t = ledger().find((t) => t.id === e);
  if (!t) return;
  const n = !paidOf(t);
  ((MPAID[e] = n),
    store.set("moneyPaid", MPAID),
    pushMoney(e, n),
    (KEEPY = window.scrollY),
    render());
}
const MCATS = [
  "Flights",
  "Accommodation",
  "Baggage",
  "Storage",
  "Activities",
  "Work",
  "Fees",
  "Cash",
];
function ledger() {
  const e = [],
    t = (t) => {
      null != t.amount && t.ccy && mine(t) && e.push(t);
    };
  return (
    (T.stays || []).forEach((e, n) =>
      t({
        id: "stay:" + (e.ref || "") + ":" + (e.name || n),
        label: e.name,
        sub:
          (e.via ? e.via + " · " : "") +
          fmt(e.in) +
          " – " +
          fmt(e.out) +
          (e.nights ? ", " + e.nights + (1 === e.nights ? " night" : " nights") : ""),
        cat: "Accommodation",
        who: e.payer || e.who,
        guest: e.who,
        amount: e.amount,
        ccy: e.ccy,
        paid: !0 === e.paid,
        due: (e.in || "").slice(0, 10),
        ref: e.ref,
        note: e.cancel ? "Cancellation: " + e.cancel : "",
      }),
    ),
    (T.flights || []).forEach((e, n) =>
      t({
        id: "flight:" + (e.no || n) + ":" + (e.dep || "").slice(0, 10) + ":" + (e.who || ""),
        label: e.no + " " + city(e.from).code + " → " + city(e.to).code,
        sub: (e.airline || "") + (e.cabin ? " · " + e.cabin : ""),
        cat: "Flights",
        who: e.payer || e.who,
        amount: e.amount,
        ccy: e.ccy,
        paid: !0 === e.paid,
        due: (e.dep || "").slice(0, 10),
        ref: e.ref,
        note: "",
      }),
    ),
    (T.activities || []).forEach((e, n) =>
      t({
        id: "act:" + (e.pid || n),
        label: e.name,
        sub: (e.type || "") + (e.loc ? " · " + e.loc : ""),
        cat: "Fee" === e.type ? "Fees" : "Work" === e.type ? "Work" : "Activities",
        who: e.payer || e.who,
        amount: e.amount,
        ccy: e.ccy,
        paid: !0 === e.paid,
        due: e.date,
        ref: "",
        note: "",
      }),
    ),
    (T.finance || []).forEach((e) =>
      t({
        id: e.id,
        label: e.label,
        sub: e.src || e.method || "",
        cat: e.cat || "Fees",
        who: e.payer || e.who,
        amount: e.amount,
        ccy: e.ccy,
        paid: !0 === e.paid,
        due: e.due || e.on,
        ref: e.ref,
        note: e.note || "",
      }),
    ),
    e.sort((e, t) => (e.due || "9").localeCompare(t.due || "9")),
    e
  );
}
function totals() {
  const e = {};
  return (
    ledger().forEach((t) => {
      const n = t.ccy;
      ((e[n] = e[n] || { paid: 0, due: 0 }),
        paidOf(t) ? (e[n].paid += t.amount) : (e[n].due += t.amount));
    }),
    e
  );
}
const fmtTHB = (e) => "฿" + Math.round(e).toLocaleString("en-GB");
function outstanding() {
  const e = totals();
  return Object.entries(e)
    .filter(([e, t]) => t.due > 0)
    .map(([e, t]) => money(t.due, e))
    .join(" · ");
}
const mRow = (e) => {
    const t = paidOf(e),
      n = toGBP(e.amount, e.ccy),
      s = "points" === e.ccy;
    return `<div class="led${t ? " on" : ""}" onclick="togPaid(${JSON.stringify(e.id)})">
    <div class="led-box${t ? " on" : ""}"><svg viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg></div>
    <div class="led-txt">
      <b>${esc(e.label)}</b>
      ${e.sub ? `<i>${esc(e.sub)}</i>` : ""}
      <span class="led-meta">${e.due ? fmtS(e.due) : ""}${e.ref ? (e.due ? " · " : "") + "ref " + esc(e.ref) : ""}${e.guest && e.guest !== e.who ? " · " + ("R" === e.guest ? "Robbie's room" : "Mum &amp; Dad's room") : ""}${whoChip(e.who)}</span>
      ${e.note ? `<span class="led-note">${esc(e.note)}</span>` : ""}
    </div>
    <div class="led-amt">
      <b>${s ? e.amount.toLocaleString("en-GB") + " pts" : money(e.amount, e.ccy)}</b>
      ${!s && "GBP" !== e.ccy && null != n ? `<i>${gbp(n)}</i>` : ""}
    </div></div>`;
  },
  mBar = (e, t) => {
    const n = e + t;
    return n
      ? `<div class="mbar"><span style="width:${Math.round((e / n) * 100)}%"></span></div>`
      : "";
  };
function vMoney() {
  const e = ledger(),
    t = totals(),
    n = e.filter((e) => !paidOf(e)),
    s = e.filter((e) => paidOf(e)),
    a = (e) => e.reduce((e, t) => e + (toGBP(t.amount, t.ccy) || 0), 0),
    i = a(s),
    o = a(n),
    l = T.fx || {},
    r = Object.entries(t).filter(([e]) => "points" !== e),
    c = t.points ? t.points.paid + t.points.due : 0,
    d = {};
  e.forEach((e) => {
    const t = e.cat || "Other";
    ((d[t] = d[t] || { paid: 0, due: 0 }),
      paidOf(e)
        ? (d[t].paid += toGBP(e.amount, e.ccy) || 0)
        : (d[t].due += toGBP(e.amount, e.ccy) || 0));
  });
  const u = MCATS.filter((e) => d[e]).concat(Object.keys(d).filter((e) => !MCATS.includes(e)));
  return `
  <section class="sec">
    <div class="mhero">
      <div class="mhero-k">The trip so far${"ALL" === WHO ? "" : ", " + ("R" === WHO ? "yours" : "Mum &amp; Dad's")}</div>
      <div class="mhero-v">${gbp(i + o)}</div>
      <div class="mhero-sp"><span class="mh-paid">${gbp(i)} paid</span><span class="mh-due${o ? "" : " nil"}">${o ? gbp(o) + " to pay" : "nothing outstanding"}</span></div>
      ${mBar(i, o)}
      <div class="mhero-n">Converted at ${esc(l.src || "stored rates")}${l.on ? ", " + fmtS(l.on) : ""}. ${Object.entries(ledgerFX()).filter(([e]) => "GBP" !== e).map(([e, t]) => e + " " + t).join(" · ")}.</div>
    </div>
  </section>

  <section class="sec"><div class="sg-head"><h2>By currency</h2><span class="n">as actually billed</span></div>
    <div class="card">
      <div class="mny-head"><span></span><span>Paid</span><span>To pay</span></div>
      ${r.map(([e, t]) => `<div class="mny-row"><span class="mny-ccy">${e}</span><span class="mny-paid${t.paid ? "" : " mny-zero"}">${t.paid ? money(t.paid, e) : "&mdash;"}</span><span class="mny-due${t.due ? "" : " mny-zero"}">${t.due ? money(t.due, e) : "&mdash;"}</span></div>`).join("")}
      ${c ? `<div class="mny-pts">Plus ${c.toLocaleString("en-GB")} points redeemed — the Courtyard in Phuket, and Avios against the Qatar tickets. Not counted in the pound figures above.</div>` : ""}
    </div></section>

  <section class="sec"><div class="sg-head"><h2>Where it goes</h2><span class="n">in pounds</span></div>
    <div class="card">
      ${u.map((e) => {
        const t = d[e],
          n = t.paid + t.due;
        return `<div class="mcat"><div class="mcat-r"><span>${esc(e)}</span><b>${gbp(n)}</b></div>
          ${mBar(t.paid, t.due)}
          ${t.due ? `<i>${gbp(t.due)} still to pay</i>` : ""}</div>`;
      }).join("")}
    </div></section>

  ${n.length ? `<section class="sec"><div class="sg-head"><h2>Still to pay</h2><span class="n">${n.length}</span></div>
    <div class="card">${n.map(mRow).join("")}</div>
    <div class="dim" style="text-align:center;font-size:11px;margin-top:8px">Tap a line when you have paid it — it syncs across your devices</div></section>` : ""}

  ${s.length ? `<section class="sec"><div class="sg-head"><h2>Already paid</h2><span class="n">${s.length}</span></div>
    <div class="card">${s.map(mRow).join("")}</div></section>` : ""}

  <section class="sec"><div class="card"><div class="note-txt">Only bookings with a price recorded appear here. Hansar Samui, Basildene Manor, the Scarborough house and several flights had no cost on the confirmation, so the real total is higher than the figure at the top.</div></div></section>`;
}
function vInfo() {
  const e = totals(),
    t = T.todo.filter(mine),
    n = T.deadlines.filter(mine);
  Math.max(1, ...Object.values(e).flatMap((e) => [e.paid + e.due]));
  const D = Object.entries(e).filter(([c, v]) => "points" !== c && v.due > 0);
  return `\n  <section class="sec"><button class="infob" onclick="setTab('money')">\n    <svg viewBox="0 0 24 24"><rect x="2.5" y="6" width="19" height="12" rx="2"/><circle cx="12" cy="12" r="2.6"/><path d="M6 9.5v5M18 9.5v5"/></svg>\n    <span><b>Money</b><i>${D.length ? "Still to pay " + D.map(([c, v]) => money(v.due, c)).join(" · ") : "Nothing outstanding"}</i></span>\n    <svg class="nb-arw" style="position:static;opacity:.5" viewBox="0 0 24 24"><path d="m9 5 7 7-7 7"/></svg>\n  </button></section>\n\n  ${n.length ? `<section class="sec"><div class="sg-head"><h2>Deadlines</h2></div>\n    ${n.map((e) => `<div class="card err" style="padding:13px 16px"><div class="dl-row"><h3 style="font-size:15px">${esc(e.title)}</h3>\n      <span class="mchip bad">${fmt(e.date)} ${esc(e.time)}</span></div>\n      <div class="note-txt">${esc(e.detail)} ${whoChip(e.who)}</div></div>`).join("")}</section>` : ""}\n\n  <section class="sec"><div class="sg-head"><h2>To do</h2><span class="n">${t.filter((e) => !isDone(e.text)).length} open</span></div>\n    <div class="card">${t
    .map((e) => {
      const t = isDone(e.text);
      return `<div class="chk${t ? " done" : ""}" onclick='tog(this,${JSON.stringify(e.text)})'>\n        <div class="box${t ? " on" : ""}"><svg viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg></div>\n        <div class="tx">${esc(e.text)} ${e.urgent ? '<span class="mchip bad">soon</span> ' : ""}${whoChip(e.who)}</div></div>`;
    })
    .join(
      "",
    )}</div>\n    <div class="dim" style="text-align:center;font-size:11px">Ticks sync across your devices</div></section>\n\n  <section class="sec"><div class="sg-head"><h2>Emergency</h2><span class="n">works offline</span></div>\n    ${T.emergency.map((e) => `<div class="card" style="padding:13px 16px"><div class="label" style="margin:0 0 6px">${esc(e.place)}</div>\n      ${e.items.map((e) => `<div class="row" style="margin-top:5px"><span class="meta">${esc(e.label)}</span>\n        <span class="meta">${e.value ? `<a href="tel:${esc(e.value.replace(/\s/g, ""))}">${esc(e.value)}</a>` : '<span class="dim">to add</span>'}</span></div>`).join("")}\n    </div>`).join("")}</section>\n  ${STALE ? '<div class="note" style="margin-bottom:18px">Showing a saved copy — no connection when this loaded.</div>' : ""}`;
}
function tog(e, t) {
  const n = !isDone(t);
  ((DONE[t] = n),
    store.set("todoDone", DONE),
    pushTodo(t, n),
    e.classList.toggle("done", n),
    e.querySelector(".box").classList.toggle("on", n));
}
let timer = null;
function ticks() {
  clearInterval(timer);
  const e = whereOn(iso(today())),
    t = T ? events().find((e) => e.at > new Date()) : null,
    n = () => {
      const n = new Date(),
        s = document.getElementById("clkL"),
        a = document.getElementById("clkH");
      if (s && e && null != e.tz) {
        const t = n.getTime() + 6e4 * n.getTimezoneOffset(),
          i = new Date(t + 36e5 * e.tz);
        s.textContent =
          String(i.getHours()).padStart(2, "0") + ":" + String(i.getMinutes()).padStart(2, "0");
        const o = new Date(t);
        a.textContent =
          String(o.getHours()).padStart(2, "0") + ":" + String(o.getMinutes()).padStart(2, "0");
      }
      const i = document.getElementById("cd");
      if (i && t) {
        let e = t.at - n;
        if (e < 0) i.textContent = "now";
        else {
          const t = Math.floor(e / 864e5),
            n = Math.floor(e / 36e5) % 24,
            s = Math.floor(e / 6e4) % 60;
          i.textContent = t ? t + "d " + n + "h" : n ? n + "h " + s + "m" : s + "m";
        }
      }
      const o = document.getElementById("cdRoute");
      if (o) {
        const e = (e, t) => {
            const n = document.getElementById("cd-" + e);
            n && (n.textContent = String(t).padStart(2, "0"));
          },
          t = nextFlight(),
          s = document.getElementById("cdWhen");
        if (t) {
          ((o.textContent =
            (t.no || "Flight") + " · " + city(t.from).name + " → " + city(t.to).name),
            s &&
              (s.textContent =
                fmtL(t.dep.slice(0, 10)) +
                " · " +
                tm(t.dep) +
                " local" +
                (t.tbc ? " · not booked" : "")));
          let a = new Date(t.dep) - n;
          (a < 0 && (a = 0),
            e("d", Math.floor(a / 864e5)),
            e("h", Math.floor(a / 36e5) % 24),
            e("m", Math.floor(a / 6e4) % 60),
            e("s", Math.floor(a / 1e3) % 60));
        } else
          ((o.textContent = "No flights left to catch"),
            ["d", "h", "m", "s"].forEach((t) => e(t, 0)),
            s && (s.textContent = ""));
      }
    };
  (n(), (timer = setInterval(n, 1e3)));
}
const CATC = {
    do: "#38bdf8",
    eat: "#a3e635",
    bar: "#c084fc",
    beach: "#22d3ee",
    mkt: "#fbbf24",
    sport: "#fb923c",
  },
  KINDC = {
    stay: "#c3c2b7",
    in: "#c3c2b7",
    out: "#c3c2b7",
    flight: "#60a5fa",
    transfer: "#22d3ee",
    act: "#fbbf24",
  };
let MAPV = null,
  _gmp = null,
  _gmap = null,
  _gmk = [],
  _ginfo = null,
  _gerr = null,
  MSCOPE = "day",
  MLAYER = { booked: !0, planned: !0, ideas: !0 },
  MCAT = { do: !0, eat: !0, bar: !0, beach: !0, mkt: !0, sport: !0 };
const LAYL = { booked: "Booked", planned: "Planned", ideas: "Ideas" },
  LAYC = { booked: "#0ca30c", planned: "#c98500", ideas: "#898781" },
  llOf = (e) => {
    if (!e || "string" != typeof e) return null;
    const t = e.split(",");
    if (2 !== t.length) return null;
    const n = parseFloat(t[0]),
      s = parseFloat(t[1]);
    return isFinite(n) && isFinite(s) ? [n, s] : null;
  },
  cityLL = (e) => {
    const t = T && T.cities && T.cities[e];
    return t && isFinite(t.lat) && isFinite(t.lon) ? [t.lat, t.lon] : null;
  },
  svURL = (e) => `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${e[0]},${e[1]}`;
function legForDate(e) {
  const t = (T.legs || [])
    .filter((e) => "ALL" === WHO || "RP" === e.who || e.who === WHO)
    .slice()
    .sort((e, t) => e.from.localeCompare(t.from));
  return t.length
    ? t.find((t) => t.from <= e && e < t.to) ||
        t.find((t) => t.from <= e && e <= t.to) ||
        t.find((t) => t.from > e) ||
        t[t.length - 1]
    : null;
}
const actState = (e) => (e.sid && "Booked" !== e.status ? "planned" : "booked"),
  catOfSid = (e) => {
    const t = sugAll().find((t) => t.id === e);
    return t ? t.cat : null;
  };
function mapPoints() {
  if (!T) return { pts: [], title: "", leg: null };
  calInit();
  const e = (MAPV && MAPV.ds) || SEL || iso(today()),
    t = MAPV && MAPV.leg && legOf(MAPV.leg).id ? legOf(MAPV.leg) : legForDate(e),
    n = "leg" === MSCOPE && !!t,
    s = n ? t.from : e,
    a = n ? t.to : e,
    i = (e) => e >= s && e <= a,
    o = [];
  if (
    (T.stays.filter(mine).forEach((e) => {
      const t = e.in.slice(0, 10),
        n = e.out.slice(0, 10);
      if (n < s || t > a) return;
      const i = llOf(e.geo) || cityLL(e.city);
      i &&
        o.push({
          ll: i,
          label: e.name,
          sub: city(e.city).name + " · " + fmt(t) + " → " + fmt(n),
          kind: "stay",
          i: e._i,
        });
    }),
    MLAYER.booked &&
      (T.flights.filter(mine).forEach((e) => {
        if (!i(e.dep.slice(0, 10))) return;
        const t = cityLL(e.from);
        t &&
          o.push({
            ll: t,
            label: (e.no || "Flight") + " → " + city(e.to).name,
            sub: [tm(e.dep), e.tbc ? "not booked" : e.airline].filter(Boolean).join(" · "),
            kind: "booked",
            t: e.dep.slice(11),
            i: e._i,
            ik: "flight",
          });
      }),
      T.transfers.filter(mine).forEach((e) => {
        if (!i(e.date)) return;
        const t = llOf(e.geo) || cityLL(e.from);
        t &&
          o.push({
            ll: t,
            label: (e.kind || "Transfer") + " → " + city(e.to).name,
            sub: [e.time, e.tbc ? "not booked" : ""].filter(Boolean).join(" · "),
            kind: "booked",
            t: e.time || "",
            i: e._i,
            ik: "transfer",
          });
      })),
    T.activities.filter(mine).forEach((e) => {
      if (!i(e.date)) return;
      const t = actState(e);
      if (!MLAYER[t]) return;
      const n = e.sid ? catOfSid(e.sid) : null;
      if (n && !MCAT[n]) return;
      const s = llOf(e.geo) || cityLL(e.city);
      s &&
        o.push({
          ll: s,
          label: e.name,
          sub: [e.start, e.loc].filter(Boolean).join(" · "),
          kind: t,
          cat: n,
          sid: e.sid,
          t: e.start || "",
          i: e._i,
          ik: "act",
        });
    }),
    MLAYER.ideas && t)
  ) {
    const e = new Set(legsOfCity(t.city || t.id).map((e) => e.id));
    sugAll().forEach((t) => {
      if (!e.has(t.leg) || PICKS[t.id] || !MCAT[t.cat]) return;
      const n = llOf(t.geo);
      n &&
        o.push({
          ll: n,
          label: t.name,
          sub: [t.area, t.rating].filter(Boolean).join(" · "),
          kind: "idea",
          cat: t.cat,
          sid: t.id,
        });
    });
  }
  n ||
    o
      .filter((e) => "booked" === e.kind || "planned" === e.kind)
      .sort((e, t) => (e.t || "99:99").localeCompare(t.t || "99:99"))
      .forEach((e, t) => (e.n = t + 1));
  const l = n ? t.name + " · whole leg" : fmtL(e);
  return { pts: o, title: l, leg: t };
}
function setMScope(e) {
  ((MSCOPE = e), paintMap());
}
function toggleMLayer(e) {
  ((MLAYER[e] = !MLAYER[e]), paintMap());
}
function toggleMCat(e) {
  ((MCAT[e] = !MCAT[e]), paintMap());
}
function inTrip(e) {
  const t = D(e || iso(today()));
  return T && t >= D(T.start) && t <= D(T.end);
}
function openMapTab() {
  openMap(inTrip() ? "day" : "ideas");
}
function openMap(e, t) {
  (T && calInit(),
    (MAPV = { k: e || "cal", ds: t || SEL || iso(today()), leg: "ideas" === e ? LEG : null }),
    (MSCOPE = "ideas" === e ? "leg" : "day"),
    (MLAYER = { booked: !0, planned: !0, ideas: "ideas" === e }),
    CATO.forEach((e) => (MCAT[e] = !0)),
    paintMap());
}
function closeMap() {
  (clearTimeout(_gwatch),
    (MAPV = null),
    (MSHEET = null),
    (_gmap = null),
    (_gmk = []),
    (_ginfo = null),
    paintMap());
}
const hasGKey = () =>
    "undefined" != typeof window && "string" == typeof window.GKEY && window.GKEY.length > 10,
  GSTYLE = [
    { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
    { featureType: "poi.business", stylers: [{ visibility: "off" }] },
    { featureType: "poi.medical", stylers: [{ visibility: "off" }] },
    { featureType: "transit", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  ];
function ensureGoogle() {
  return window.google && window.google.maps
    ? Promise.resolve(window.google.maps)
    : _gmp ||
        ((_gmp = new Promise((e, t) => {
          const n = document.createElement("script");
          ((n.src =
            "https://maps.googleapis.com/maps/api/js?v=weekly&loading=async&libraries=places,marker&key=" +
            encodeURIComponent(window.GKEY)),
            (n.async = !0),
            (n.onload = () =>
              window.google && window.google.maps
                ? e(window.google.maps)
                : t(new Error("no google.maps"))),
            (n.onerror = () => {
              ((_gmp = null), t(new Error("blocked")));
            }),
            document.head.appendChild(n));
        })),
        _gmp);
}
async function gLib() {
  const e = await ensureGoogle();
  let t = e.Map,
    n = e.Marker,
    s = e.LatLngBounds;
  if (e.importLibrary) {
    const [a, i, o] = await Promise.all([
      e.importLibrary("maps").catch(() => ({})),
      e.importLibrary("marker").catch(() => ({})),
      e.importLibrary("core").catch(() => ({})),
    ]);
    ((t = (a && a.Map) || t), (n = (i && i.Marker) || n), (s = (o && o.LatLngBounds) || s));
  }
  if (!t || !n || !s) throw new Error("google.maps classes unavailable");
  return { Map: t, Marker: n, LatLngBounds: s };
}
const circPath = (e) =>
    `M 0,0 m -${e},0 a ${e},${e} 0 1,0 ${2 * e},0 a ${e},${e} 0 1,0 ${2 * -e},0`,
  pinCol = (e) => ("stay" === e.kind ? "#ffffff" : e.cat ? CATC[e.cat] : LAYC[e.kind] || "#c3c2b7");
let PIDS = null,
  _pidLoad = null;
function loadPids() {
  return PIDS
    ? Promise.resolve(PIDS)
    : _pidLoad ||
        ((PIDS = store.get("pids", {})),
        (_pidLoad = fetch(`${SB_URL}/rest/v1/place_ids?select=sid,place_id`, {
          headers: HDRS,
          cache: "no-store",
        })
          .then((e) => (e.ok ? e.json() : []))
          .then(
            (e) => (
              (e || []).forEach((e) => {
                PIDS[e.sid] = e.place_id;
              }),
              store.set("pids", PIDS),
              PIDS
            ),
          )
          .catch(() => PIDS)),
        _pidLoad);
}
function savePid(e, t, n) {
  ((PIDS[e] = t),
    store.set("pids", PIDS),
    fetch(`${SB_URL}/rest/v1/place_ids`, {
      method: "POST",
      headers: Object.assign(
        { "Content-Type": "application/json", Prefer: "resolution=merge-duplicates" },
        HDRS,
      ),
      body: JSON.stringify({ sid: e, place_id: t, name: n || "" }),
    }).catch(() => {}));
}
async function resolvePid(e) {
  const t = e.sid || "geo:" + e.ll.join(",");
  if (PIDS && PIDS[t]) return PIDS[t];
  if (!window.google || !google.maps || !google.maps.importLibrary) return null;
  try {
    const { Place: n } = await google.maps.importLibrary("places"),
      s = [e.label, e.sub && e.sub.split(" · ")[0]].filter(Boolean).join(", "),
      { places: a } = await n.searchByText({
        textQuery: s,
        fields: ["id", "location"],
        locationBias: { lat: e.ll[0], lng: e.ll[1] },
        maxResultCount: 5,
        language: "en-GB",
      });
    if (!a || !a.length) return null;
    const i = a
      .map((t) => ({ pl: t, d: hav(e.ll[0], e.ll[1], t.location.lat(), t.location.lng()) }))
      .sort((e, t) => e.d - t.d)[0];
    return !i || i.d > 500 ? null : (savePid(t, i.pl.id, e.label), i.pl.id);
  } catch (e) {
    return null;
  }
}
const hav = (e, t, n, s) => {
  const a = Math.PI / 180,
    i =
      Math.sin(((n - e) * a) / 2) ** 2 +
      Math.cos(e * a) * Math.cos(n * a) * Math.sin(((s - t) * a) / 2) ** 2;
  return 12742e3 * Math.asin(Math.sqrt(i));
};
let MSHEET = null;
const gmapsURL = (e) =>
  e.pid
    ? `https://www.google.com/maps/place/?q=place_id:${e.pid}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(e.label)}&query_place_id=`;
function openMapSheet(e) {
  ((MSHEET = {
    p: e,
    expanded: !1,
    pid: PIDS ? PIDS[e.sid || "geo:" + e.ll.join(",")] : null,
    state: "idle",
  }),
    paintMapSheet(),
    setTimeout(() => {
      try {
        _gmap && _gmap.panTo && (_gmap.panTo({ lat: e.ll[0], lng: e.ll[1] }), _gmap.panBy(0, 60));
      } catch (e) {}
    }, 240));
}
function closeMapSheet() {
  ((MSHEET = null), paintMapSheet());
}
function expandMapSheet() {
  MSHEET &&
    ((MSHEET.expanded = !MSHEET.expanded),
    paintMapSheet(),
    MSHEET && MSHEET.expanded && loadPlaceCard());
}
async function loadPlaceCard() {
  const e = MSHEET;
  if (!e || "loading" === e.state) return;
  if (!hasGKey()) return ((e.state = "none"), void paintMapSheet());
  ((e.state = "loading"), paintMapSheet());
  const t = e.pid || (await resolvePid(e.p));
  if (MSHEET === e && ((e.pid = t), (e.state = t ? "ok" : "none"), paintMapSheet(), t))
    try {
      (await google.maps.importLibrary("places"),
        await customElements.whenDefined("gmp-place-details"));
      const e = document.querySelector("#mv-place gmp-place-details-place-request");
      e && (e.place = t);
    } catch (t) {
      ((e.state = "none"), paintMapSheet());
    }
}
function mapSheetBody() {
  const e = MSHEET;
  if (!e) return "";
  const t = e.p,
    n = t.sid ? sugAll().find((e) => e.id === t.sid) : null,
    s = t.sid ? PICKS[t.sid] : null,
    a = "stay" === t.kind ? "Staying here" : LAYL[t.kind] || "",
    i = [
      t.cat
        ? `<span class="mchip"><i class="dotc" style="background:${CATC[t.cat]}"></i>${CATL[t.cat]}</span>`
        : "",
      a ? `<span class="mchip" style="color:${LAYC[t.kind] || "var(--ink-2)"}">${a}</span>` : "",
      n && n.walk ? '<span class="mchip good">Walkable</span>' : "",
      n && n.price
        ? `<span class="mchip">${esc(n.price.length > 34 ? n.price.slice(0, 32) + "…" : n.price)}</span>`
        : "",
    ]
      .filter(Boolean)
      .join(""),
    o = [
      t.sid
        ? `<button class="mapbtn" onclick="mapOpenIdea('${t.sid}')">My notes</button>`
        : null != t.i
          ? `<button class="mapbtn" onclick="mapOpenSheet('${"stay" === t.kind ? "stay" : "act"}',${t.i})">My notes</button>`
          : "",
      t.sid && !s
        ? `<button class="mapbtn go" onclick="openPlan('${t.sid}')">Add to plans</button>`
        : "",
      `<a class="mapbtn" href="${e.pid ? gmapsURL(e) : mapURL(t.ll.join(","), t.label)}" target="_blank" rel="noopener">Directions</a>`,
      inAU(t.ll.join(","))
        ? `<a class="mapbtn" href="${wazeURL(t.ll.join(","))}" target="_blank" rel="noopener">▲ Waze</a>`
        : "",
    ]
      .filter(Boolean)
      .join("");
  let l = "";
  return (
    e.expanded &&
      ((l =
        "loading" === e.state
          ? '<div class="mv-pload">Fetching this place from Google…</div>'
          : "ok" === e.state
            ? '<div id="mv-place"><gmp-place-details>\n        <gmp-place-details-place-request></gmp-place-details-place-request>\n        <gmp-place-content-config>\n          <gmp-place-media lightbox-preferred></gmp-place-media>\n          <gmp-place-rating></gmp-place-rating>\n          <gmp-place-type></gmp-place-type>\n          <gmp-place-price></gmp-place-price>\n          <gmp-place-open-now-status></gmp-place-open-now-status>\n          <gmp-place-opening-hours></gmp-place-opening-hours>\n          <gmp-place-address></gmp-place-address>\n          <gmp-place-phone-number></gmp-place-phone-number>\n          <gmp-place-website></gmp-place-website>\n          <gmp-place-reviews></gmp-place-reviews>\n          <gmp-place-attribution light-scheme-color="gray" dark-scheme-color="white"></gmp-place-attribution>\n        </gmp-place-content-config>\n      </gmp-place-details></div>'
            : `<div class="mv-pload">${hasGKey() ? "Google has no listing that matches this one closely enough to be sure it is the same place." : "Google details need the API key adding — everything else here works without it."}</div>`),
      n &&
        n.why &&
        (l += `<div class="mv-why"><h4>Why it is on the list</h4><p>${esc(n.why)}</p></div>`)),
    `<div class="mv-grab" onclick="expandMapSheet()"></div>\n    <div class="mv-shead">\n      <div style="flex:1;min-width:0">\n        <h3>${esc(t.label)}</h3>\n        <div class="mv-ssub">${esc(t.sub || "")}</div>\n      </div>\n      <button class="mv-x" onclick="closeMapSheet()" aria-label="Close">&times;</button>\n    </div>\n    ${i ? `<div class="mv-schips">${i}</div>` : ""}\n    <div class="mv-sacts">${o}\n      <button class="mapbtn wide" onclick="expandMapSheet()">${e.expanded ? "Hide Google details" : "Google details"}</button>\n    </div>\n    <div class="mv-scard">${l}</div>`
  );
}
function paintMapSheet() {
  const e = document.getElementById("mv-sheet"),
    t = document.getElementById("mapv");
  e &&
    t &&
    (t.classList.toggle("peek", !!MSHEET && !MSHEET.expanded),
    t.classList.toggle("full", !(!MSHEET || !MSHEET.expanded)),
    (e.innerHTML = MSHEET ? mapSheetBody() : ""),
    _gmap && window.google && setTimeout(() => google.maps.event.trigger(_gmap, "resize"), 260));
}
function paintMap() {
  let e = document.getElementById("mapv");
  if (
    (e || ((e = document.createElement("div")), (e.id = "mapv"), document.body.appendChild(e)),
    !MAPV)
  )
    return ((e.className = "mapv"), (e.innerHTML = ""), void syncLock());
  const { pts: t, title: n, leg: s } = mapPoints(),
    a = { booked: 0, planned: 0, ideas: 0 },
    i = { booked: "booked", planned: "planned", idea: "ideas" };
  t.forEach((e) => {
    const t = i[e.kind];
    t && a[t]++;
  });
  const o = "day" === MAPV.k && "day" === MSCOPE,
    l = Object.keys(LAYL)
      .map(
        (e) =>
          `<button class="mvchip${MLAYER[e] ? " on" : ""}" onclick="toggleMLayer('${e}')">\n      <i style="background:${LAYC[e]}"></i>${LAYL[e]}<b>${a[e]}</b></button>`,
      )
      .join(""),
    c = CATO.map(
      (e) =>
        `<button class="mvchip cat${MCAT[e] ? " on" : ""}" onclick="toggleMCat('${e}')">\n      <i style="background:${CATC[e]}"></i>${CATL[e]}</button>`,
    ).join(""),
    r = `<button class="mvchip${MLAYER.ideas ? " on" : ""}" onclick="toggleMLayer('ideas')">\n      <i style="background:${LAYC.ideas}"></i>Ideas nearby<b>${a.ideas}</b></button>`;
  if (
    ((e.className = "mapv open" + (MSHEET ? (MSHEET.expanded ? " full" : " peek") : "")),
    (e.innerHTML = `<div class="mv-head">\n      <h3>${esc(n)}</h3>\n      <div class="mv-scope">\n        <button class="${"day" === MSCOPE ? "on" : ""}" onclick="setMScope('day')">Day</button>\n        <button class="${"leg" === MSCOPE ? "on" : ""}" ${s ? "" : "disabled"} onclick="setMScope('leg')">Leg</button>\n      </div>\n      <button class="mv-x" onclick="closeMap()" aria-label="Close map">&times;</button></div>\n    <div class="mv-body"><div id="mv-map"></div>\n      <div class="mv-msg" id="mv-msg">Loading map&hellip;</div></div>\n    <div class="mv-sheet" id="mv-sheet"></div>\n    <div class="mv-filters">\n      ${o ? `<div class="mvf-row">${r}</div>` : `<div class="mvf-row">${l}</div><div class="mvf-row">${c}</div>`}\n    </div>`),
    syncLock(),
    !t.length)
  ) {
    const e = document.getElementById("mv-msg");
    return void (
      e &&
      (e.innerHTML = s
        ? o
          ? `<div><b>Nothing booked on ${esc(fmtL(MAPV.ds))}.</b><br>\n          Turn on <b>Ideas nearby</b> below to see what is around.</div>`
          : "Nothing matches those filters."
        : "Nothing here has a location yet.")
    );
  }
  (loadPids(),
    MSHEET && paintMapSheet(),
    (hasGKey()
      ? drawGoogle(t)
      : Promise.reject(new Error("no API key — config.js is missing or was not deployed"))
    ).catch((e) => {
      ((_gerr = (e && e.message) || String(e)),
        console.warn("Google Maps unavailable:", e),
        showGErr(t));
    }));
}
async function drawGoogle(e) {
  const { Map: t, Marker: n, LatLngBounds: s } = await gLib(),
    a = document.getElementById("mv-msg");
  a && a.remove();
  const i = document.getElementById("mv-map");
  if (!i) throw new Error("gone");
  ((_gmap = new t(i, {
    mapTypeControl: !1,
    streetViewControl: !0,
    fullscreenControl: !1,
    clickableIcons: !1,
    styles: GSTYLE,
    gestureHandling: "greedy",
  })),
    (_gmk = []));
  const o = new s();
  return (
    e.forEach((e) => {
      const t = { lat: e.ll[0], lng: e.ll[1] },
        s = new n({
          position: t,
          map: _gmap,
          title: e.label,
          icon: {
            path: circPath("idea" === e.kind ? 6 : 8.5),
            scale: 1,
            fillColor: pinCol(e),
            fillOpacity: "idea" === e.kind ? 0.75 : 1,
            strokeColor: "#ffffff",
            strokeWeight: "idea" === e.kind ? 1.6 : 2.4,
          },
          label: e.n
            ? { text: String(e.n), color: "#ffffff", fontSize: "11px", fontWeight: "700" }
            : null,
        });
      (s.addListener("click", () => openMapSheet(e)), _gmk.push(s), o.extend(t));
    }),
    1 === e.length
      ? (_gmap.setCenter({ lat: e[0].ll[0], lng: e[0].ll[1] }), _gmap.setZoom(15))
      : _gmap.fitBounds(o, 48),
    (_gerr = null),
    setTimeout(() => {
      try {
        _gmap &&
          window.google &&
          google.maps &&
          google.maps.event &&
          google.maps.event.trigger(_gmap, "resize");
      } catch (e) {}
    }, 80),
    watchMap(),
    !0
  );
}
let _gwatch = null;
function watchMap() {
  (clearTimeout(_gwatch),
    (_gwatch = setTimeout(() => {
      const e = document.getElementById("mv-map");
      if (!MAPV || !e) return;
      const t = e.getBoundingClientRect();
      (!!e.querySelector(".gm-style") && t.height > 40) ||
        ((_gerr =
          t.height <= 40
            ? "the map had no room to draw (" +
              Math.round(t.width) +
              "x" +
              Math.round(t.height) +
              ")"
            : "Google loaded but never drew the map. Check the key restrictions and the daily quota."),
        console.warn("Map watchdog:", _gerr),
        showGErr());
    }, 4e3)));
}
function showGErr(e) {
  const t = document.getElementById("mv-map"),
    n = document.getElementById("mv-msg"),
    s = n || document.createElement("div");
  (n ||
    ((s.id = "mv-msg"), (s.className = "mv-msg"), t && t.parentNode && t.parentNode.appendChild(s)),
    (s.innerHTML = `<div><b>The map could not load.</b><br>${esc(_gerr || "")}<br>\n    <button class="mapbtn" style="margin-top:12px" onclick="retryMap()">Try again</button></div>`));
}
function retryMap() {
  (clearTimeout(_gwatch), (_gmp = null), (_gerr = null), (_gmap = null), paintMap());
}
function mapOpenIdea(e) {
  const t = sugAll().findIndex((t) => t.id === e);
  t >= 0 && openSheet("idea", t);
}
function mapOpenSheet(e, t) {
  openSheet("in" === e || "out" === e ? "stay" : e, t);
}
(window.addEventListener("keydown", (e) => {
  if ("Escape" !== e.key) return;
  const t = document.getElementById("fx");
  if (t && t.classList.contains("open")) return closeFX();
  MAPV && !SHEET && closeMap();
}),
  ["gesturestart", "gesturechange", "gestureend"].forEach((e) =>
    document.addEventListener(
      e,
      (e) => {
        (e.target.closest && e.target.closest(".gm-style,#mv-map")) || e.preventDefault();
      },
      { passive: !1 },
    ),
  ));
const FXSEED = { AUD: 1.9112, THB: 44.8509 },
  FXSEEDON = "2026-08-15",
  FXSYM = { GBP: "£", AUD: "$", THB: "฿" },
  FXDP = { GBP: 2, AUD: 2, THB: 0 };
let FX = null,
  _fxFetch = null;
function fxState() {
  if (!FX) {
    const e = store.get("fx", null);
    FX =
      e && e.rates && e.rates.AUD && e.rates.THB
        ? {
            pair: "AUD",
            dir: "toGBP",
            amount: "",
            rates: e.rates,
            on: e.on,
            at: e.at || 0,
            seed: !1,
          }
        : {
            pair: "AUD",
            dir: "toGBP",
            amount: "",
            rates: Object.assign({}, FXSEED),
            on: FXSEEDON,
            at: 0,
            seed: !0,
          };
  }
  return FX;
}
function fxRates() {
  const e = fxState();
  (!e.seed && e.at && Date.now() - e.at < 432e5) ||
    _fxFetch ||
    (_fxFetch = fetch("https://open.er-api.com/v6/latest/GBP", { cache: "no-store" })
      .then((e) => (e.ok ? e.json() : Promise.reject(0)))
      .then((t) => {
        if (!(t && "success" === t.result && t.rates && t.rates.AUD && t.rates.THB)) throw 0;
        ((e.rates = { AUD: t.rates.AUD, THB: t.rates.THB }),
          (e.on = (t.time_last_update_utc ? new Date(t.time_last_update_utc) : new Date())
            .toISOString()
            .slice(0, 10)),
          (e.seed = !1),
          (e.at = Date.now()),
          store.set("fx", { rates: e.rates, on: e.on, at: e.at }),
          fxPaint());
      })
      .catch(() => {})
      .then(() => {
        _fxFetch = null;
      }));
}
const fxNum = (e) => {
    const t = parseFloat(String(e).replace(/[^0-9.]/g, ""));
    return isFinite(t) ? t : 0;
  },
  fxFmt = (e, t) =>
    FXSYM[t] +
    e.toLocaleString("en-GB", { minimumFractionDigits: FXDP[t], maximumFractionDigits: FXDP[t] });
function fxConv(e) {
  const t = fxState(),
    n = t.rates[t.pair];
  return "toGBP" === t.dir ? e / n : e * n;
}
const fxFrom = () => ("toGBP" === fxState().dir ? fxState().pair : "GBP"),
  fxTo = () => ("toGBP" === fxState().dir ? "GBP" : fxState().pair);
function openFX() {
  (fxState(), fxRates());
  (document.getElementById("fx").classList.add("open"),
    syncLock(),
    fxPaint(),
    setTimeout(() => {
      const e = document.getElementById("fxIn");
      e && e.focus();
    }, 60));
}
function closeFX() {
  (document.getElementById("fx").classList.remove("open"), syncLock());
}
function fxSetPair(e) {
  ((fxState().pair = e), fxPaint());
}
function fxSwap() {
  const e = fxState();
  ((e.dir = "toGBP" === e.dir ? "fromGBP" : "toGBP"), fxPaint());
}
function fxInput(e) {
  ((fxState().amount = e), fxPaint(!0));
}
function fxPaint(e) {
  const t = fxState();
  if (!document.getElementById("fx")) return;
  const n = fxFrom(),
    s = fxTo(),
    a = t.rates[t.pair],
    i = fxNum(t.amount),
    o = (e, t) => {
      const n = document.getElementById(e);
      n && (n.textContent = t);
    };
  (o("fxOut", "" === t.amount ? "—" : fxFmt(fxConv(i), s)),
    o("fxQ", "" === t.amount ? "" : `${fxFmt(i, n)} =`));
  if (
    (o(
      "fxRate",
      "toGBP" === t.dir
        ? `1 ${t.pair} = ${(1 / a).toFixed(4)} GBP`
        : `1 GBP = ${a.toFixed("THB" === t.pair ? 2 : 4)} ${t.pair}`,
    ),
    o(
      "fxWhen",
      t.seed
        ? "Approximate — no live rate yet"
        : "Bank rate " + fmt(t.on) + ". Cards and bureaux will be worse.",
    ),
    e)
  )
    return;
  (o("fxFromCur", n), o("fxToCur", s));
  const l = document.getElementById("fxIn");
  l && ((l.placeholder = "0"), l.value !== t.amount && (l.value = t.amount));
  const c = document.getElementById("fxSym");
  (c && (c.textContent = FXSYM[n]),
    document
      .querySelectorAll("#fx .fxpair")
      .forEach((e) => e.classList.toggle("on", e.dataset.p === t.pair)));
  const r =
      "GBP" === n
        ? [5, 10, 20, 50, 100]
        : "THB" === n
          ? [100, 500, 1e3, 2e3, 5e3]
          : [5, 10, 20, 50, 100],
    d = document.getElementById("fxTable");
  d &&
    (d.innerHTML = r
      .map((e) => `<div class="fxr"><span>${fxFmt(e, n)}</span><b>${fxFmt(fxConv(e), s)}</b></div>`)
      .join(""));
}
function fxBox() {
  return '<div class="modal" id="fx" onclick="if(event.target===this)closeFX()">\n    <div class="mbox" role="dialog" aria-modal="true" aria-label="Currency converter">\n      <button class="mx" onclick="closeFX()" aria-label="Close">&times;</button>\n      <div class="kicker">Convert</div>\n      <div class="fxpairs">\n        <button class="fxpair on" data-p="AUD" onclick="fxSetPair(\'AUD\')">Australia</button>\n        <button class="fxpair" data-p="THB" onclick="fxSetPair(\'THB\')">Thailand</button>\n      </div>\n      <div class="fxdir">\n        <span id="fxFromCur">AUD</span>\n        <button class="fxswap" onclick="fxSwap()" aria-label="Reverse">&#8646;</button>\n        <span id="fxToCur">GBP</span>\n      </div>\n      <div class="fxfield">\n        <span class="fxsym" id="fxSym">$</span>\n        <input id="fxIn" type="text" inputmode="decimal" autocomplete="off"\n          oninput="fxInput(this.value)" placeholder="0">\n      </div>\n      <div class="fxres"><span class="fxq" id="fxQ"></span><b id="fxOut">&mdash;</b></div>\n      <div class="fxtable" id="fxTable"></div>\n      <div class="fxrate" id="fxRate"></div>\n      <div class="fxwhen" id="fxWhen"></div>\n    </div></div>';
}
function render() {
  if (!T) return;
  (grabX(),
    ensureIdeasTab(),
    ["flights", "transfers", "activities", "stays"].forEach((e) =>
      (T[e] || []).forEach((e, t) => (e._i = t)),
    ));
  const e = today(),
    t = e >= D(T.start) && e <= D(T.end);
  ((document.getElementById("hometab").textContent = t ? "Today" : "Summary"),
    (document.getElementById("kicker").textContent = t
      ? "Day " + (nDays(D(T.start), e) + 1)
      : "19 Nov 2026 – 24 Jan 2027"),
    document
      .querySelectorAll("#trav button")
      .forEach((e) => e.classList.toggle("active", e.dataset.w === WHO)),
    document
      .querySelectorAll("#tabs button")
      .forEach((e) => e.setAttribute("aria-current", e.dataset.t === TAB)));
  const n = { travel: "Travel", stays: "Accommodation", info: "Trip info", stay: "" },
    s = "stay" === TAB ? "Accommodation" : "Today",
    a = "stay" === TAB ? (T.stays[STAYI] || {}).name || "" : n[TAB],
    i =
      void 0 !== n[TAB]
        ? `<div class="backbar">\n      <button onclick="${"stay" === TAB ? "setTab('stays')" : "setTab('home')"}">\n      <svg viewBox="0 0 24 24"><path d="m15 5-7 7 7 7"/></svg>${s}</button>\n      ${a && a !== s ? `<span>${esc(a)}</span>` : ""}</div>`
        : "";
  if (
    ((document.getElementById("view").innerHTML =
      i +
      ("home" === TAB
        ? vHome()
        : "travel" === TAB
          ? vTravel()
          : "stays" === TAB
            ? vStays()
            : "stay" === TAB
              ? vStay()
              : "cal" === TAB
                ? vPlans()
                : "money" === TAB
                  ? vMoney()
                  : "pack" === TAB
                    ? "P" === WHO
                      ? '<div class="center">The packing lists are Robbie\'s.</div>'
                      : '<div class="pk">' + PK.view() + "</div>"
                    : vInfo())),
    KEEPA)
  ) {
    const e = KEEPA;
    KEEPA = null;
    const t = document.querySelector(e.sel);
    t && window.scrollBy(0, Math.round(t.getBoundingClientRect().top - e.top));
  } else if (null == KEEPY) window.scrollTo(0, 0);
  else {
    const e = KEEPY;
    ((KEEPY = null), window.scrollTo(0, e));
  }
  (restoreX(), ticks());
}
function setWho(e) {
  ((WHO = e), store.set("who", e), render());
}
function setTab(e) {
  ("cal" === e && "cal" === TAB && ((PLEG = null), (PDAY = null)),
    "pack" === e && "pack" === TAB && PK.reset(),
    (TAB = e),
    render());
}
const HDRS = { apikey: SB_KEY, Authorization: "Bearer " + SB_KEY };
async function boot() {
  const e = store.get("trip", null);
  try {
    const e = await fetch(`${SB_URL}/rest/v1/trip_app?id=eq.1&select=data`, {
      headers: HDRS,
      cache: "no-store",
    });
    if (!e.ok) throw 0;
    const t = await e.json();
    ((T = t[0].data), store.set("trip", T), (STALE = !1));
  } catch (t) {
    ((T = e), (STALE = !0));
  }
  let t = null,
    n = null;
  try {
    const [e, s] = await Promise.all([
      fetch(`${SB_URL}/rest/v1/suggest?select=data`, { headers: HDRS, cache: "no-store" }),
      fetch(`${SB_URL}/rest/v1/legs?select=data&order=pos.asc`, {
        headers: HDRS,
        cache: "no-store",
      }),
    ]);
    if (e.ok && s.ok) {
      const a = (await e.json()).map((e) => e.data),
        i = (await s.json()).map((e) => e.data);
      a.length && i.length && ((t = a), (n = i), store.set("suggest", a), store.set("legs", i));
    }
  } catch (e) {}
  (t || (t = store.get("suggest", null)),
    n || (n = store.get("legs", null)),
    T && (t && (T.suggest = t), n && (T.legs = n)),
    T
      ? (render(),
        await Promise.all([
          loadPicks(),
          loadEdits(),
          loadSCon(),
          loadTodos(),
          loadMoney(),
          PK.load(),
        ]),
        mergePicks(),
        render())
      : (document.getElementById("view").innerHTML =
          '<div class="center">Could not load the trip, and there is no saved copy on this device yet. Open it once with a connection.</div>'));
}

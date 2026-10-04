/* ───────────────────────────── PACKING ─────────────────────────────
   The packing app, folded into the trip app as a tab.

   Everything lives inside this closure. The trip app and the packing
   code both want names like store, esc, render, TAB and totals, so
   nothing here is global except window.PK — the handful of entry
   points the inline handlers in the generated HTML call.

   State: ticks and bag moves sync through Supabase pack_state, custom
   items through pack_items, exactly as the standalone app did, so the
   two stayed interchangeable right up to the point the standalone one
   was retired. */
const PK = (function () {
  const D = PACKDATA,
    BAGS = D.bags,
    LEGS = D.legs,
    DAYBAGS = D.daybags || [],
    SHOPPING = D.shopping || [];

  let ITEMS = D.items.slice().concat(store.get("pack:custom", [])),
    ST = store.get("pack:state", {}),
    LEG = store.get("pack:leg", null),
    VIEW = "leg",
    OPENBAG = null,
    OPENDAY = null,
    OPENSHOP = null,
    Q = "",
    ADDBAG = "",
    OFFLINE = !1;

  const KEEPSCROLL = () => {
    KEEPY = window.scrollY;
  };
  const COL = {
      L1: "var(--blue)",
      L2: "var(--green)",
      CB: "var(--violet)",
      BP: "var(--orange)",
      SL: "var(--pink)",
      WORN: "var(--violet)",
      worn: "var(--violet)",
    },
    ICON = { L1: "🧳", L2: "👟", CB: "🎒", BP: "🪢", SL: "📱", WORN: "👕", worn: "👕" },
    CATICON = {
      docs: "📄",
      tech: "🔌",
      toiletries: "🧴",
      health: "💊",
      clothing: "👕",
      footwear: "👟",
      kit: "🧰",
      flight: "✈️",
      added: "✏️",
    },
    MODE = {
      cabin: { label: "Cabin", cls: "cabin" },
      checked: { label: "Checked", cls: "checked" },
      with: { label: "With you", cls: "with" },
      worn: { label: "Worn", cls: "worn" },
      left: { label: "Not with you", cls: "left" },
    };

  const bagOf = (i) => (ST[i.id] && ST[i.id].bag) || i.bag,
    packed = (i) => !!(ST[i.id] && ST[i.id].packed),
    on = (k) => !!(ST[k] && ST[k].packed),
    kg = (g) => (g >= 1000 ? (g / 1000).toFixed(1) + " kg" : Math.round(g) + " g"),
    bagMeta = (id) =>
      BAGS.find((b) => b.id === (id === "worn" ? "WORN" : id)) || {
        id: id,
        name: id,
        img: "",
      },
    legOf = () => LEGS.find((x) => x.id === LEG) || LEGS[0];

  /* ---------- sync ---------- */
  async function pushState(iid) {
    const s = ST[iid] || {};
    try {
      (await fetch(`${SB_URL}/rest/v1/pack_state`, {
        method: "POST",
        headers: Object.assign({}, HDRS, {
          "Content-Type": "application/json",
          Prefer: "resolution=merge-duplicates,return=minimal",
        }),
        body: JSON.stringify({ iid: iid, packed: !!s.packed, bag: s.bag || null }),
      }),
        (OFFLINE = !1));
    } catch (e) {
      OFFLINE = !0;
    }
  }
  async function pushItem(it) {
    try {
      await fetch(`${SB_URL}/rest/v1/pack_items`, {
        method: "POST",
        headers: Object.assign({}, HDRS, {
          "Content-Type": "application/json",
          Prefer: "resolution=merge-duplicates,return=minimal",
        }),
        body: JSON.stringify({ id: it.id, pos: 999, cat: it.cat, data: it }),
      });
    } catch (e) {}
  }
  async function load() {
    try {
      const r = await fetch(`${SB_URL}/rest/v1/pack_state?select=*`, {
        headers: HDRS,
        cache: "no-store",
      });
      if (!r.ok) throw 0;
      const rows = await r.json(),
        s = {};
      (rows.forEach((x) => (s[x.iid] = { packed: !!x.packed, bag: x.bag || null })),
        (ST = s),
        store.set("pack:state", s),
        (OFFLINE = !1));
    } catch (e) {
      OFFLINE = !0;
    }
    try {
      const r = await fetch(`${SB_URL}/rest/v1/pack_items?select=data`, {
        headers: HDRS,
        cache: "no-store",
      });
      if (r.ok) {
        const custom = (await r.json()).map((x) => x.data).filter(Boolean);
        (store.set("pack:custom", custom),
          (ITEMS = D.items.slice().concat(custom)));
      }
    } catch (e) {}
  }
  function tick(k) {
    const s = ST[k] || (ST[k] = {});
    ((s.packed = !s.packed), store.set("pack:state", ST), pushState(k), KEEPSCROLL(), render());
  }

  /* ---------- custom items ---------- */
  const customFor = (legId, bagId) =>
    ITEMS.filter((i) => i.legs && i.legs[legId] === bagId);
  const placedOn = (legId) => {
    const s = new Set();
    const l = LEGS.find((x) => x.id === legId);
    ((l.bags || []).forEach((b) => (b.ids || []).forEach((x) => s.add(x))),
      ITEMS.forEach((i) => i.legs && i.legs[legId] && s.add(i.id)));
    return s;
  };
  const unplacedOn = (legId) => {
    const s = placedOn(legId);
    return ITEMS.filter((i) => !s.has(i.id));
  };

  function setAddBag(b) {
    ((ADDBAG = ADDBAG === b ? "" : b), KEEPSCROLL(), render());
  }
  function addSave() {
    const el = document.getElementById("pk-new"),
      name = (el && el.value || "").trim();
    if (!name) return;
    if (!ADDBAG) return;
    const id =
      "x-" +
      name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") +
      "-" +
      Date.now().toString(36).slice(-4);
    const from = LEGS.findIndex((x) => x.id === legOf().id),
      legs = {};
    LEGS.slice(Math.max(0, from)).forEach((l) => (legs[l.id] = ADDBAG));
    const it = {
      id: id,
      name: name,
      cat: "added",
      bag: ADDBAG,
      qty: 1,
      g: 0,
      fate: "always",
      note: "Added by you.",
      legs: legs,
    };
    ITEMS = ITEMS.concat([it]);
    store.set("pack:custom", store.get("pack:custom", []).concat([it]));
    (pushItem(it), (ADDBAG = ""), el && (el.value = ""), KEEPSCROLL(), render());
  }

  /* ---------- weights and counts ---------- */
  const rowsOf = (b) =>
    b.items.reduce((a, x) => a + (x.inside && x.inside.length ? x.inside.length : 1), 0) +
    customFor(legOf().id, b.bag).length;
  const key = (l, b, n, k) =>
    "plan:" + l.id + ":" + b.bag + ":" + n + (k == null ? "" : ":" + k);
  function doneOf(l, b) {
    let d = 0;
    (b.items.forEach((x, n) => {
      if (x.inside && x.inside.length)
        x.inside.forEach((y, k) => on(key(l, b, n, k)) && d++);
      else on(key(l, b, n)) && d++;
    }),
      customFor(l.id, b.bag).forEach((i) => packed(i) && d++));
    return d;
  }
  function gramsOf(l, b) {
    if ("left" === b.mode) return 0;
    const extra =
      customFor(l.id, b.bag).reduce((a, i) => a + (i.g || 0), 0) +
      (bagMeta(b.bag).empty || 0);
    if (b.ids && b.ids.length)
      return (
        extra +
        b.ids.reduce((a, id) => {
          const i = ITEMS.find((x) => x.id === id);
          return a + (i ? i.g || 0 : 0);
        }, 0)
      );
    return (
      extra +
      ITEMS.filter((i) => bagOf(i) === b.bag && !(l.stored && "store" === i.fate)).reduce(
        (a, i) => a + (i.g || 0),
        0,
      )
    );
  }
  const exact = (b) => !!(b.ids && b.ids.length) || "left" === b.mode;
  function progress(l) {
    let t = 0,
      d = 0;
    ((l.bags || []).forEach((b) => {
      "left" !== b.mode && ((t += rowsOf(b)), (d += doneOf(l, b)));
    }),
      (l.do || []).forEach((x, n) => {
        (t++, on("do:" + l.id + ":" + n) && d++);
      }));
    return { t: t, d: d, pc: t ? Math.round((d / t) * 100) : 0 };
  }

  /* ---------- rows ---------- */
  const parentOf = (i) => {
    if (!i.inbag) return null;
    const p = ITEMS.find((x) => x.id === i.inbag);
    return p && bagOf(p) === bagOf(i) ? p : null;
  };
  function kidsOf(pool) {
    const set = new Set(pool.map((i) => i.id)),
      k = {};
    return (
      pool.forEach((i) => {
        const p = parentOf(i);
        p && set.has(p.id) && ((k[p.id] = k[p.id] || []).push(i));
      }),
      k
    );
  }
  const nestedIds = (pool) =>
    new Set([].concat(...Object.values(kidsOf(pool))).map((i) => i.id));

  const pill = (i) =>
    (i.crit ? '<span class="pill crit">essential</span>' : "") +
    ("store" === i.fate ? '<span class="pill store">parks in Bangkok</span>' : "") +
    ("buy" === i.fate ? '<span class="pill buy">buy en route</span>' : "") +
    ("handover" === i.fate ? '<span class="pill hand">given away in Phuket</span>' : "");

  const itemRow = (i, extra) =>
    `<div class="row${packed(i) ? " done" : ""}">
      <button class="tick${packed(i) ? " on" : ""}" onclick="PK.tick('${i.id}')" aria-label="packed">
        <svg viewBox="0 0 24 24"><path d="M4 12.5 9.5 18 20 6.5"/></svg></button>
      <div class="rbody"><div class="rname">${esc(i.name)}${i.qty > 1 ? ` <span class="qty">×${i.qty}</span>` : ""}${extra || ""}</div>
        ${i.note ? `<div class="rnote">${esc(i.note)}</div>` : ""}
        <div class="rfoot">${pill(i)}</div></div></div>`;

  function listHTML(arr, pool) {
    const all = pool || arr,
      kids = kidsOf(all),
      nested = nestedIds(all);
    return arr
      .filter((i) => !nested.has(i.id))
      .map((i) => {
        const k = kids[i.id];
        if (!k || !k.length) return itemRow(i);
        const d = k.filter(packed).length;
        return (
          itemRow(i, `<span class="inside">${d}/${k.length} inside</span>`) +
          `<div class="kids">${k.map((x) => itemRow(x)).join("")}</div>`
        );
      })
      .join("");
  }

  const planRow = (l, b, x, n, k) => {
    const q = key(l, b, n, k);
    return `<div class="row${on(q) ? " done" : ""}" style="padding:10px 0">
      <button class="tick${on(q) ? " on" : ""}" onclick="PK.tick('${q}')" aria-label="packed">
        <svg viewBox="0 0 24 24"><path d="M4 12.5 9.5 18 20 6.5"/></svg></button>
      <div class="rbody"><div class="rname">${esc(x.n)}</div>
        ${x.note ? `<div class="rnote">${esc(x.note)}</div>` : ""}</div></div>`;
  };

  /* ---------- views ---------- */
  function vBag(l, b) {
    const m = MODE[b.mode] || MODE.with,
      meta = bagMeta(b.bag),
      d = doneOf(l, b),
      rows = rowsOf(b),
      g = gramsOf(l, b),
      mine = customFor(l.id, b.bag);
    return `<button class="back" onclick="PK.back()">‹ ${esc(l.name)}</button>
      <div class="sec">
        <div class="sg-head"><h2>${esc(meta.name)}</h2><span class="n">${esc(l.dates)}</span></div>
        <div class="card" style="--bc:${COL[b.bag] || "var(--muted)"};margin-bottom:14px">
          <div class="bagtop">
            ${meta.img ? `<span class="bagph"><img src="${esc(meta.img)}" alt="" loading="lazy" onerror="this.closest('.bagph').classList.add('noimg')"></span>` : `<span class="bagic">${ICON[b.bag] || "👕"}</span>`}
            <span style="flex:1;min-width:0">
              <span class="sash ${m.cls}">${m.label}</span>
              <span class="bagmeta" style="display:block;margin-top:5px">${d} of ${rows} packed${g ? " · " + (exact(b) ? "about " : "roughly ~") + kg(g) : ""}${bagMeta(b.bag).empty ? " · bag " + kg(bagMeta(b.bag).empty) : ""}</span>
            </span></div>
          <div class="fill" style="--bc:${COL[b.bag] || "var(--muted)"}"><i style="width:${rows ? (d / rows) * 100 : 0}%"></i></div>
        </div>
        <div class="card">
        ${b.items
          .filter((x) => !x.inside || !x.inside.length)
          .map((x) => planRow(l, b, x, b.items.indexOf(x)))
          .join("")}
        ${mine.map((i) => itemRow(i)).join("")}
        </div>
        ${b.items
          .map((x, n) => {
            if (!x.inside || !x.inside.length) return "";
            const d2 = x.inside.filter((y, k) => on(key(l, b, n, k))).length;
            return `<div class="label" style="margin-top:16px">${esc(x.n)}
                <span class="inside">${d2}/${x.inside.length}</span></div>
              ${x.note ? `<div class="subnote">${esc(x.note)}</div>` : ""}
              <div class="card">${x.inside.map((y, k) => planRow(l, b, y, n, k)).join("")}</div>`;
          })
          .join("")}
      </div>`;
  }

  function vLeg(l) {
    const pr = progress(l),
      unplaced = unplacedOn(l.id),
      tiles = (l.bags || [])
        .map((b, i) => {
          const m = MODE[b.mode] || MODE.with,
            meta = bagMeta(b.bag),
            d = doneOf(l, b),
            n = rowsOf(b),
            g = gramsOf(l, b);
          return `<button class="btile ${m.cls}${"left" === b.mode ? " off" : ""}" style="--bc:${COL[b.bag] || "var(--muted)"}" onclick="PK.openBag(${i})">
          <span class="sash ${m.cls}">${m.label}</span>
          <span class="btile-ph">${meta.img ? `<img src="${esc(meta.img)}" alt="" loading="lazy" onerror="this.closest('.btile-ph').classList.add('noimg')">` : `<i>${ICON[b.bag] || "👕"}</i>`}</span>
          <span class="btile-n">${esc(meta.name)}</span>
          <span class="btile-m">${"left" === b.mode ? "Left behind" : d + " / " + n}${g ? " · " + (exact(b) ? "" : "~") + kg(g) : ""}</span>
          ${"left" === b.mode ? "" : `<span class="btile-f"><i style="width:${n ? (d / n) * 100 : 0}%"></i></span>`}
        </button>`;
        })
        .join("");
    return `<div class="sec">
        <div class="legwhere" style="margin-bottom:4px">${esc(l.where)}</div>
        ${l.via ? `<div class="legvia">${esc(l.via)}</div>` : ""}
        <div class="card" style="margin:11px 0 14px">
          <div class="note">${esc(l.note)}</div>
          <div class="bagtop" style="margin-top:13px">
            <span style="flex:1"><span class="bagname" style="display:block">${pr.d} of ${pr.t} done</span>
            <span class="bagmeta">Tick as you pack${(() => {
              const t = (l.bags || []).reduce((a, b) => a + gramsOf(l, b), 0);
              return t ? " · about " + kg(t) + " all in" : "";
            })()}</span></span>
            <span class="bagpill${100 === pr.pc && pr.t ? " done" : ""}">${pr.pc}%</span></div>
          <div class="fill" style="--bc:var(--blue)"><i style="width:${pr.pc}%"></i></div>
        </div>
        <div class="label">The bags</div>
        <div class="btiles">${tiles}</div>
        ${
          unplaced.length
            ? `<div class="alert"><b>${unplaced.length} not placed on this leg</b><p>${unplaced
                .slice(0, 14)
                .map((i) => esc(i.name))
                .join(", ")}${unplaced.length > 14 ? ", and " + (unplaced.length - 14) + " more" : ""}.</p></div>`
            : `<div class="covered">✓ All ${ITEMS.length} items accounted for on this leg</div>`
        }
        ${
          (l.bags || []).some((b) => !exact(b))
            ? '<div class="alert info"><b>Weights here are rough</b><p>This leg has not been worked through item by item yet, so the figures come from where things live by default.</p></div>'
            : ""
        }
        ${
          (l.do || []).length
            ? `<div class="label">Before this leg</div><div class="card">
          ${l.do
            .map((x, n) => {
              const k = "do:" + l.id + ":" + n;
              return `<div class="row${on(k) ? " done" : ""}" style="padding:10px 0">
              <button class="tick${on(k) ? " on" : ""}" onclick="PK.tick('${k}')" aria-label="done">
                <svg viewBox="0 0 24 24"><path d="M4 12.5 9.5 18 20 6.5"/></svg></button>
              <div class="rbody"><div class="rname">${esc(x.n)}</div>
                ${x.note ? `<div class="rnote">${esc(x.note)}</div>` : ""}</div></div>`;
            })
            .join("")}
          </div>`
            : ""
        }
      </div>`;
  }

  function vAll() {
    const q = Q.toLowerCase(),
      list = ITEMS.filter(
        (i) =>
          !q ||
          i.name.toLowerCase().includes(q) ||
          (i.note || "").toLowerCase().includes(q) ||
          i.cat.includes(q),
      ),
      nst = nestedIds(list),
      cats = {};
    list.forEach((i) => {
      nst.has(i.id) || (cats[i.cat] = cats[i.cat] || []).push(i);
    });
    return `<button class="back" onclick="PK.back()">‹ Packing</button>
      <input class="search" id="pk-q" placeholder="Search everything…" value="${esc(Q)}"
        oninput="PK.search(this.value)">
      <div class="sec">${
        Object.keys(cats).length
          ? Object.keys(cats)
              .map(
                (c) =>
                  `<div class="catline">${CATICON[c] || "•"} ${esc(c)} <span></span></div>` +
                  listHTML(cats[c], list),
              )
              .join("")
          : '<div class="center">Nothing matches.</div>'
      }</div>`;
  }

  function vDay(d) {
    return `<button class="back" onclick="PK.back()">‹ Packing</button>
      <div class="sec"><div class="sg-head"><h2>${esc(d.name)}</h2><span class="n">${esc(d.dates)}</span></div>
      <div class="legwhere" style="margin-bottom:11px">${esc(d.where)}</div>
      <div class="card" style="margin-bottom:14px"><div class="note">${esc(d.note)}</div></div>
      ${d.warn ? `<div class="alert"><b>Worth knowing</b><p>${esc(d.warn)}</p></div>` : ""}
      <div class="card">${d.items
        .map((i, n) => {
          const k = "day:" + d.id + ":" + n;
          return `<div class="row${on(k) ? " done" : ""}" style="padding:10px 0">
          <button class="tick${on(k) ? " on" : ""}" onclick="PK.tick('${k}')" aria-label="packed">
            <svg viewBox="0 0 24 24"><path d="M4 12.5 9.5 18 20 6.5"/></svg></button>
          <div class="rbody"><div class="rname">${esc(i.name)}${i.crit ? ' <span class="pill crit">don\'t skip</span>' : ""}</div>
            ${i.note ? `<div class="rnote">${esc(i.note)}</div>` : ""}</div></div>`;
        })
        .join("")}</div></div>`;
  }

  function vShop(sh) {
    return `<button class="back" onclick="PK.back()">‹ Packing</button>
      <div class="sec"><div class="sg-head"><h2>${esc(sh.name)}</h2><span class="n">${esc(sh.when)}</span></div>
      <div class="legwhere" style="margin-bottom:11px">${esc(sh.where)}</div>
      <div class="card" style="margin-bottom:14px"><div class="note">${esc(sh.note)}</div></div>
      <div class="card">${sh.items
        .map((i, n) => {
          const k = "shop:" + sh.id + ":" + n;
          return `<div class="row${on(k) ? " done" : ""}" style="padding:10px 0">
          <button class="tick${on(k) ? " on" : ""}" onclick="PK.tick('${k}')" aria-label="bought">
            <svg viewBox="0 0 24 24"><path d="M4 12.5 9.5 18 20 6.5"/></svg></button>
          <div class="rbody"><div class="rname">${esc(i.name)}${i.crit ? ' <span class="pill crit">don\'t skip</span>' : ""}</div>
            ${i.note ? `<div class="rnote">${esc(i.note)}</div>` : ""}</div></div>`;
        })
        .join("")}</div></div>`;
  }

  function view() {
    const l = legOf();
    if (!l) return '<div class="center">No legs defined.</div>';
    if ("bag" === VIEW && l.bags && l.bags[OPENBAG]) return vBag(l, l.bags[OPENBAG]);
    if ("all" === VIEW) return vAll();
    if ("day" === VIEW) {
      const d = DAYBAGS.find((x) => x.id === OPENDAY);
      if (d) return vDay(d);
    }
    if ("shop" === VIEW) {
      const sh = SHOPPING.find((x) => x.id === OPENSHOP);
      if (sh) return vShop(sh);
    }
    const from = LEGS.findIndex((x) => x.id === l.id),
      rest = LEGS.slice(Math.max(0, from));
    return (
      `<div class="legpick">
        <select onchange="PK.setLeg(this.value)" aria-label="Which leg">
          ${LEGS.map((x) => `<option value="${x.id}"${x.id === l.id ? " selected" : ""}>${esc(x.name)} · ${esc(x.dates)}</option>`).join("")}
        </select>
        <svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
      </div>` +
      vLeg(l) +
      `<div class="sec">
        ${
          DAYBAGS.length
            ? `<div class="label">Day bags</div>
          ${DAYBAGS.map(
            (d) => `<button class="daycard" onclick="PK.openDay('${d.id}')">
            <div class="dayhead"><span>
              <span class="bagname" style="display:block">${esc(d.name)}</span>
              <span class="bagmeta">${esc(d.bag)} · ${d.items.length} things</span></span>
              <span class="bagpill">${esc(d.dates)}</span></div>
            <div class="bagnote">${esc(d.where)}</div></button>`,
          ).join("")}`
            : ""
        }
        ${
          SHOPPING.length
            ? `<div class="label">Buy on arrival</div>
          ${SHOPPING.map(
            (sh) => `<button class="daycard" onclick="PK.openShop('${sh.id}')">
            <div class="dayhead"><span>
              <span class="bagname" style="display:block">${esc(sh.name)}</span>
              <span class="bagmeta">${esc(sh.where)} · ${sh.items.length} things</span></span>
              <span class="bagpill">${esc(sh.when)}</span></div></button>`,
          ).join("")}`
            : ""
        }

        <div class="label">Everything</div>
        <button class="daycard" onclick="PK.openAll()">
          <div class="dayhead"><span>
            <span class="bagname" style="display:block">Full inventory</span>
            <span class="bagmeta">${ITEMS.length} items · ${kg(ITEMS.reduce((a, i) => a + (i.g || 0), 0))} all in</span></span>
            <span class="bagpill">${ITEMS.filter(packed).length}/${ITEMS.length}</span></div>
          <div class="bagnote">Search everything you are taking, in one list.</div></button>

        <div class="label">Missing something?</div>
        <div class="card"><div class="colhead">Add an item</div>
          <div class="colsub">Pick the bag it goes in. It is added to ${rest.length === LEGS.length ? "every leg" : "this leg and the " + (rest.length - 1) + " after it"}, and to the full inventory.</div>
          <div class="addrow"><input id="pk-new" placeholder="e.g. snorkel mask"></div>
          <div class="pickbags">${BAGS.map(
            (b) =>
              `<button class="pickbag${ADDBAG === b.id ? " on" : ""}" style="--bc:${COL[b.id] || "var(--muted)"}" onclick="PK.setAddBag('${b.id}')">
              <span class="pbox"><svg viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg></span>${esc(b.name)}</button>`,
          ).join("")}</div>
          <div class="addrow" style="margin-top:11px"><button class="addgo${ADDBAG ? "" : " off"}" onclick="PK.addSave()">Add to ${ADDBAG ? esc(bagMeta(ADDBAG).name) : "…"}</button></div>
        </div>
        ${OFFLINE ? '<div class="note" style="margin-top:14px">Saved on this device — no connection when this loaded.</div>' : ""}
      </div>`
    );
  }

  return {
    view: view,
    load: load,
    tick: tick,
    setAddBag: setAddBag,
    addSave: addSave,
    setLeg: function (id) {
      ((LEG = id), store.set("pack:leg", id), (VIEW = "leg"), (OPENBAG = null), (KEEPY = 0), render());
    },
    openBag: function (i) {
      ((OPENBAG = i), (VIEW = "bag"), (KEEPY = 0), render());
    },
    openDay: function (id) {
      ((OPENDAY = id), (VIEW = "day"), (KEEPY = 0), render());
    },
    openShop: function (id) {
      ((OPENSHOP = id), (VIEW = "shop"), (KEEPY = 0), render());
    },
    openAll: function () {
      ((VIEW = "all"), (KEEPY = 0), render());
    },
    back: function () {
      ((VIEW = "leg"), (OPENBAG = null), (KEEPY = 0), render());
    },
    search: function (v) {
      ((Q = v), KEEPSCROLL(), render());
      const e = document.getElementById("pk-q");
      e && (e.focus(), e.setSelectionRange(e.value.length, e.value.length));
    },
    reset: function () {
      ((VIEW = "leg"), (OPENBAG = null), (Q = ""));
    },
  };
})();

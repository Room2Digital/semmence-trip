#!/usr/bin/env python3
"""
Build index.html from the readable sources in src/.

    python3 build.py            build, then verify against the previous index.html
    python3 build.py --no-verify

The sources in src/ are the real thing now — edit those, never index.html,
which is generated and will be overwritten.

Verification compares the newly built file against the previous index.html at
the level that matters:

  * JavaScript  — parsed to an AST with acorn and compared structurally, so
                  whitespace and formatting are ignored but any behavioural
                  change is caught.
  * CSS         — canonicalised (whitespace, quoting and number formats
                  normalised) and compared as a token stream.

It reports any difference rather than failing, because once you start editing
src/ you *expect* differences. The point is that you see exactly what changed.
Needs node with acorn available (npm install acorn) for the JS check; without
it the JS comparison is skipped and it says so.
"""
import json
import re
import subprocess
import sys
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "src"
OUT = ROOT / "index.html"


def packdata() -> dict:
    """The packing lists, built from the modules in packdata/."""
    sys.path.insert(0, str(ROOT / "packdata"))
    import items, legs, bags, daybags, shopping

    return {
        "items": items.I,
        "legs": legs.LEGS,
        "bags": bags.BAGS,
        "daybags": daybags.DAYBAGS,
        "shopping": shopping.SHOPPING,
    }


def packcoverage(data) -> None:
    """A leg whose bags carry `ids` is claiming to account for part of the
    inventory. Say what it misses, so a leg meant to be complete cannot
    quietly stop being complete."""
    known = {i["id"] for i in data["items"]}
    for leg in data["legs"]:
        claimed = set()
        for b in leg.get("bags", []):
            for x in b.get("ids") or []:
                claimed.add(x[0] if isinstance(x, (list, tuple)) else x)
        if not claimed:
            continue
        unknown = sorted(claimed - known)
        missing = sorted(known - claimed)
        # part-quantities have to add back up to the whole item, or a leg is
        # quietly carrying more or fewer T-shirts than exist.
        counts = {}
        for b in leg.get("bags", []):
            for x in b.get("ids") or []:
                if isinstance(x, (list, tuple)):
                    counts[x[0]] = counts.get(x[0], 0) + x[1]
        for iid, n in sorted(counts.items()):
            item = next((i for i in data["items"] if i["id"] == iid), None)
            if item and n != item.get("qty", 1):
                print("  pack %s: %s split into %d but there are %d"
                      % (leg["id"], iid, n, item.get("qty", 1)))

        if unknown:
            print("  pack %s: %d id(s) not in items.py — %s" % (leg["id"], len(unknown), ", ".join(unknown)))
        if missing:
            print("  pack %s: %d unplaced — %s" % (leg["id"], len(missing), ", ".join(missing)))
        else:
            print("  pack %s: all %d items accounted for." % (leg["id"], len(known)))


def css_sanity(path):
    """The packing CSS was scoped from the old app by a script, and a mangled
    @media once swallowed every rule after it without a word. Braces balanced
    and no .pk @media is cheap to check and would have caught it."""
    s = path.read_text(encoding="utf-8")
    depth = 0
    for ch in s:
        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth < 0:
                sys.exit("%s: a closing brace with nothing open." % path.name)
    if depth:
        sys.exit("%s: %d unclosed rule(s) — everything after the first one is dead."
                 % (path.name, depth))
    if ".pk @media" in s or ".pk @" in s:
        sys.exit("%s: an at-rule got a .pk prefix, which makes it invalid and "
                 "silently kills the rest of the stylesheet." % path.name)


def daybagrefs(data) -> None:
    """A day bag line can reference an inventory item. If that id stops
    existing the line still renders, it just quietly stops being linked —
    which is how four dead references survived in the Rottnest bag."""
    known = {i["id"] for i in data["items"]}
    for d in data["daybags"]:
        bad = [i["name"] for i in d["items"] if i.get("ref") and i["ref"] not in known]
        if bad:
            print("  pack %s: %d dead ref(s) — %s" % (d["id"], len(bad), ", ".join(bad)))


def build() -> str:
    shell = (SRC / "shell.html").read_text(encoding="utf-8")
    for token, filename in (
        ("{{BASE_CSS}}", "base.css"),
        ("{{APP_CSS}}", "app.css"),
        ("{{APP_JS}}", "app.js"),
        ("{{PACK_CSS}}", "pack.css"),
        ("{{PACK_JS}}", "pack.js"),
    ):
        if token not in shell:
            sys.exit(f"shell.html is missing the {token} placeholder")
        shell = shell.replace(token, (SRC / filename).read_text(encoding="utf-8"))

    css_sanity(SRC / "pack.css")
    css_sanity(SRC / "app.css")

    data = packdata()
    blob = json.dumps(data, ensure_ascii=True, separators=(",", ":")).replace("</", "<\\/")
    if "{{PACK_DATA}}" not in shell:
        sys.exit("shell.html is missing the {{PACK_DATA}} placeholder")
    shell = shell.replace("{{PACK_DATA}}", blob)
    PACK_SUMMARY.append(data)
    return shell


PACK_SUMMARY = []


def canon_css(text: str) -> str:
    text = re.sub(r"/\*.*?\*/", "", text, flags=re.S)
    text = re.sub(r"\s+", "", text)
    text = text.replace(";}", "}").replace("'", '"')
    text = re.sub(r'\[([\w-]+)="([^"]*)"\]', r"[\1=\2]", text)

    def num(m):
        try:
            return str(float(m.group(0)))
        except ValueError:
            return m.group(0)

    return re.sub(r"-?(?:\d+\.?\d*|\.\d+)", num, text)


def parts(html: str):
    styles = re.findall(r"<style[^>]*>(.*?)</style>", html, re.S)
    scripts = re.findall(r"<script>(.*?)</script>", html, re.S)
    return styles, scripts


AST_JS = r"""
const acorn=require('acorn'),fs=require('fs');
const o={ecmaVersion:'latest',sourceType:'script'};
function norm(n){if(Array.isArray(n))return n.map(norm);
 if(n&&typeof n==='object'){const r={};for(const k of Object.keys(n).sort()){
  if(['start','end','loc','range','raw'].includes(k))continue;r[k]=norm(n[k]);}return r;}
 return n;}
const a=JSON.stringify(norm(acorn.parse(fs.readFileSync(process.argv[2],'utf8'),o)));
const b=JSON.stringify(norm(acorn.parse(fs.readFileSync(process.argv[3],'utf8'),o)));
console.log(a===b?'SAME':'DIFF');
"""


def js_same(a: str, b: str):
    """Returns True/False, or None if the check could not be run."""
    if not shutil.which("node"):
        return None
    tmp = ROOT / ".build-tmp"
    tmp.mkdir(exist_ok=True)
    try:
        (tmp / "a.js").write_text(a, encoding="utf-8")
        (tmp / "b.js").write_text(b, encoding="utf-8")
        (tmp / "cmp.js").write_text(AST_JS, encoding="utf-8")
        r = subprocess.run(
            ["node", str(tmp / "cmp.js"), str(tmp / "a.js"), str(tmp / "b.js")],
            capture_output=True, text=True,
        )
        if r.returncode != 0:
            return None
        return r.stdout.strip() == "SAME"
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


def main():
    verify = "--no-verify" not in sys.argv
    previous = OUT.read_text(encoding="utf-8") if (verify and OUT.exists()) else None

    out = build()
    OUT.write_text(out, encoding="utf-8")
    print(f"built index.html  {len(out):,} bytes")

    if previous is None:
        print("no previous index.html to compare against")
        return

    old_css, old_js = parts(previous)
    new_css, new_js = parts(out)

    if len(old_css) != len(new_css) or len(old_js) != len(new_js):
        print("block count changed (%d→%d css, %d→%d js) — expected when a new"
              % (len(old_css), len(new_css), len(old_js), len(new_js)))
        print("style or script block is added to shell.html; otherwise check it.")
    else:
        for i, (a, b) in enumerate(zip(old_css, new_css)):
            same = canon_css(a) == canon_css(b)
            print(f"  css block {i}: {'unchanged' if same else 'CHANGED'}")
        for i, (a, b) in enumerate(zip(old_js, new_js)):
            same = js_same(a, b)
            if same is None:
                print(f"  js  block {i}: not checked (node/acorn unavailable)")
            else:
                print(f"  js  block {i}: {'unchanged' if same else 'CHANGED'}")

    print()
    if PACK_SUMMARY:
        d = PACK_SUMMARY[-1]
        print()
        print("packing: %d items, %d legs, %d bags, %.1f kg listed"
              % (len(d["items"]), len(d["legs"]), len(d["bags"]),
                 sum(i.get("g", 0) or 0 for i in d["items"]) / 1000.0))
        packcoverage(d)
        daybagrefs(d)
    print()
    print("'CHANGED' is expected once you start editing src/ — it means the")
    print("build picked your edits up. 'unchanged' means a pure reformat.")


if __name__ == "__main__":
    main()

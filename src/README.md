# Source

**Edit the files in here. Never edit `index.html` — it is generated and will be overwritten.**

```
src/shell.html   the HTML skeleton: <head>, header, nav, and three placeholders
src/base.css     the few rules that must apply before the main stylesheet loads
src/app.css      the stylesheet — 3,400 lines, ~530 rules
src/app.js       the application — 2,650 lines, 140 functions
```

Build with:

```bash
python3 build.py
```

That substitutes the three files into `shell.html` and writes `index.html`,
then tells you whether the JavaScript and CSS actually changed behaviour or
were only reformatted. Then deploy as usual with `deploy.command`.

## Where this came from

The app was only ever deployed, never kept as source — the readable original
was lost. On 2 Oct 2026 the production build was recovered byte-for-byte from
Vercel, and on 3 Oct it was reformatted into the files above.

That reformat was **proved** not to change behaviour, not assumed:

- the JavaScript was parsed before and after and the two syntax trees compared
  in full (1.19 million characters of structure) — identical, differing only in
  how five decimal literals are written (`.16` vs `0.16`)
- the CSS was canonicalised (whitespace, quoting and number formats normalised)
  and compared as a token stream — identical

`build.py` runs those same two checks on every build, so you always know
whether an edit did what you meant.

## Reading app.js

Function names survived minification, so the code is navigable even though
local variables are still single letters. Useful landmarks:

| Looking for | Search for |
|---|---|
| What renders on screen | `function render(` — picks one view and sets `#view.innerHTML` |
| A specific screen | `vHome`, `vPlans`, `vStays`, `vInfo`, `vDests`, `vDay` |
| Startup and data loading | `async function boot(` at the very bottom |
| Money totals | `function totals(` |
| Ideas you've chosen | `loadPicks`, `savePick`, `mergePicks` |
| To-do ticks | `loadTodos`, `pushTodo`, `isDone` |
| Currency converter | functions beginning `fx` |

There is no framework and no build step beyond concatenation. State lives in a
handful of globals (`T` is the whole trip, `WHO` the traveller filter, `TAB` the
current screen) and every change calls `render()`.

### Dead code

Around 22 functions relating to Google Maps are still present but unreachable —
`drawGoogle`, `ensureGoogle`, `gLib`, `openMap`, `paintMap`, `openMapSheet`,
`mapSVG` and friends. The map was removed in v31 because the Google Cloud
project has no billing account, so the API loaded but refused to draw. The
entry points are gone; the functions were left because excising them from
minified code was more risk than it was worth. Now that the source is readable,
deleting them is straightforward if you want the file smaller.

`config.js` held only the Google Maps API key and is no longer loaded.

## Data

Content lives in Supabase (project `xsgvdwoekpluynhsdlxm`) and needs no deploy
to change:

| Table | What |
|---|---|
| `trip_app` | one row — flights, stays, transfers, activities, to-dos, deadlines |
| `suggest` | one row per idea, ~206 of them |
| `legs` | the trip legs, ordered |
| `picks` | ideas you've scheduled — written by the app |
| `todo_state` | to-do ticks — written by the app, synced across devices |

Note that `trip_app.data` still carries stale copies of `suggest` and `legs`
from before they were normalised into their own tables. `boot()` overwrites
them on load, so they do nothing — but don't edit them expecting a change.

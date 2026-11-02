# mechviz

An AI-powered skill that transforms any machine or mechanism into a fully interactive 3D simulator — all packed into a single offline HTML page.

Describe how something works, and it builds a complete visual explainer: the machine runs live in the center, every instrument panel reads real computed values, subsystem buttons open up the internals, and an auto-tour mode guides viewers through the whole thing hands-free.

## Install

```
npm install && npx playwright install chromium
```

You need Node.js 20 or newer. For video recording you also need `ffmpeg`, and for procedural sound Python 3.

## Use

Ask your AI coding assistant in plain words:

> Build me a simulator of a 4-stroke motorcycle engine I can take apart.

> How does a mechanical watch keep time? Show me as a simulator.

> Make a visual explainer of a hydraulic excavator arm and record a 20-second video.

Or build one of the 3 bundled examples:

```
node sims/build.mjs v8-live          # mechviz-out/dist/v8-live.html
node sims/build.mjs cessna-live
node sims/build.mjs strandbeest-live
```

## What is inside

| | |
|---|---|
| `SKILL.md` | The instruction set: how a machine is modelled, the visual rules, the review loop. |
| `sims/kit/` | Runtime engine, stage setup, shader warm-up utilities. |
| `sims/v8-*`, `sims/cessna-*`, `sims/strandbeest-*` | 3 complete example machines. `-shared` is the model, `-live` the interactive page, `-film` the recorded tour. |
| `sims/build.mjs` | Bundles a machine into one self-contained HTML file with three.js and fonts inlined. |
| `sims/capture.mjs` | Renders the film frame by frame to a 60 fps mp4, or generates review sheets of stills. |
| `sfx/`, `run_sfx.py` | Procedural audio engine synced to the film's timeline, mastered to −14 LUFS. |

## License

MIT — Sams Alif

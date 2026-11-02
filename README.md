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

Or build one of the 6 bundled simulators:

```
node sims/build.mjs v8-live            # V8 Engine
node sims/build.mjs cessna-live        # Cessna Landing Gear
node sims/build.mjs strandbeest-live   # Strandbeest Walker
node sims/build.mjs bee-live           # Robo-Bee Flapping MAV
node sims/build.mjs octopus-live       # Soft-Robotic Octopus Hydro-Jet
node sims/build.mjs scorpion-live      # Bionic Scorpio-Rover
```

## What is inside

| | |
|---|---|
| `SKILL.md` | The instruction set: how a machine is modelled, the visual rules, the review loop. |
| `sims/kit/` | Runtime engine, stage setup, shader warm-up utilities. |
| `sims/v8-*`, `sims/cessna-*`, `sims/strandbeest-*` | Classic mechanical engineering machines. |
| `sims/bee-live`, `sims/octopus-live`, `sims/scorpion-live` | Biomimetic & bio-robotic machines (Bee, Octopus, Scorpion). |
| `sims/build.mjs` | Bundles a machine into one self-contained HTML file with three.js and fonts inlined. |
| `portal/` | Interactive web portal showcasing all simulators. |
| `sims/capture.mjs` | Renders the film frame by frame to a 60 fps mp4, or generates review sheets of stills. |
| `sfx/`, `run_sfx.py` | Procedural audio engine synced to the film's timeline, mastered to −14 LUFS. |

## License

MIT — Sams Alif

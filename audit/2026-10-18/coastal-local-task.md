# Coastal Glass — local Blender work request

The author explicitly requested the local Codex task to perform this work because the Blender source is too large to transfer. Cloud task: `クラウド`. Local task: `ローカル` (01a14b23-a25d-7723-8dec-98b8c456eddb). Cloud currently maintains TbyD-hiro53/tbyd-hiro53.github.io main; fetch latest before starting, use an isolated branch/worktree, and preserve other current edits.

## Goal

Replace the fixed night lighthouse beam with a continuous rotating beacon, using **precomputed full-direction occlusion**, without increasing scene geometry or adding per-frame shadow-map renders. The author already approved this approach. Make a reviewable interactive preview; original Blender master and current production scene must remain intact.

## Locate source locally

The author identified a possible `binary dusk blender` folder beneath the Mac user home. Search that folder and related original archives for a Coastal Glass scene containing lighthouse, glazed decagonal lantern, opaque mullions/roof/floor, coast, road and surrounding terrain. Names may reference Binary Dusk because the web renderer follows that workflow. Confirm by scene content, not folder name alone. Source hashes in `coastal-glass-rt-v2-scene.json`: source SHA256 024b97f4343a7e4046468e0f3a97ef543c0d2bc157f83e31487966a5dc257179; rc1 SHA256 3fe758e9e6cb76a5b36dd2f74700be89191ce82856a40b2f3716b06bd1b6678c. A related editable scene is usable if geometry correspondence is verified.

The cloud searched all 17 remote heads, 399 commits and five historical ZIPs. No Coastal original is in that public repository. Do not request uploading the large master; render derived data locally.

## Existing runtime

- `coastal-glass-observation-v3-w3-renderer.js`, `...-w3-picking.js`, `...-w3-app.js`; `coastal-glass-rt-v2-night.js` and `...-night-lighting-config.json`.
- World coordinates are original Blender Z-up metres. Lamp internal source: [12.655214309692383, 22, 11.005817413330078]. Current axis azimuth −72°, elevation −3°, 5.6° outer / 4.2° inner cone; range 220m; exit pupil about .37037m in front of the internal source.
- Existing opaque shadow image is only 256² at a fixed 80° view. Rotating that image or its matrix is incorrect. Runtime currently ray-marches 32 volume samples with light-space visibility, and has direct water/glass irradiance plus separate CPU observation picking.
- Water clock uses seconds %16 for its seamless waves. **Do not derive beacon rotation from this modulo clock** if using a different period, or it will jump. Add a separate axis/pupil update from the same full scene seconds. Initial phase should match the approved −72° beam, then rotate smoothly (start with a restrained 20–30s revolution and document chosen period).

## Deliverables

1. Bake all-direction opaque depth from the internal source, e.g. six 256²/512² cubemap faces or a suitably sampled panorama. Exclude water as before; glazing transmits (.88) instead of becoming opaque. Include opaque lantern mullions/cap/floor and actual terrain/buildings. Verify six known world rays/face seams and nearest depths. Preserve source and use a derived scene/copy.
2. Save small same-origin depth assets under a new version prefix. Prefer raw typed-array/gzip or verified linear/raw image handling to avoid browser color conversion of encoded depth. Supply dimensions, packing/range, coordinate conventions, file sizes/SHA256 and bake script/config. Original large `.blend` stays on Mac.
3. Create versioned shader/renderer/picking updates if feasible. Keep original versions. Rotate both beam axis and pupil position; static shadow lookup stays world-oriented. Make optical visibility and tap hit test agree. Preserve approved moon/sun sizes, sunset reflection, glass motions, all four framing presets, reduced motion/pause/hidden-tab behavior and Liquid Glass UI. No mechanical beacon sound.
4. Check whether approved night background plates contain a stationary baked beam contribution; if so, remove/rebake that contribution properly, retaining approved moonlight and materials. Do not leave a stationary ghost pool while the visible beam rotates.
5. Validate full rotation at multiple angles, pillar interruptions, terrain occlusion, water/glass response, seams, pause/resume and all four views. Compare added requests/decoded bytes/draw calls and available actual Mac GPU timing; don't claim zero overhead. No per-frame full shadow render.

## Handoff back to cloud

Push a **separate feature branch** (no force push, no main promotion), or supply a small derivative-assets ZIP/patch. Report branch + commit, asset filenames, source scene path (in the private chat), validation and remaining issues. Keep the giant Blender master and finished 8K images out of the public Git repository. Cloud integrates runtime/preview HTML and preserves its concurrent common-reading-UI and preview-audio changes; avoid replacing old portal/index/CANON files wholesale. Root publication still requires author review of this new rotating light.

Cloud can inspect the local task's final status. This document is a prepared request, not evidence that the local task has started.

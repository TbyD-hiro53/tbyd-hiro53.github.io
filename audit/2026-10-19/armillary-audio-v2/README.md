# Armillary v1/v2 — wind, rotation, sparks and hologram audio preview

The author explicitly requested apparatus effects after the first wind-only preview. This supersedes the earlier silent-apparatus direction for these two works. Production HTML and approved original application files remain unchanged; only the two preview entry points use new immutable application/audio files.

## Sound and synchronization

- Existing approved grass wind and distant coastal air are retained unchanged.
- Four subdued rotation voices use the same recorded conveyor-Foley buffer at different starting offsets. Each voice's pitch, gain, cutoff and restrained stereo position follow that ring/lens pair's actual angular speed and axis. No common invented rotation clock.
- Sparks are short processed mechanical-contact recordings, used as designed spark Foley. They are not represented as electrical field recordings. Actual visible arc births supply events and screen position. Bright onscreen events only, fresh within260ms, maximum two concurrent voices and at least220ms between triggers; old events are discarded after activation, pause or scene-time jumps. No constant crackle independent of the image.
- The central hologram has a low, strange continuous tone assembled from an actual servo recording, slowed, reversed and layered with a quiet crossed delay. The three visual hologram states use smoothly changing playback rate/cutoff; the existing14-second scene cycle drives transitions. The metronome image does not produce an added beat.
- Core/close views emphasize the internal sound; wide/rim views emphasize the retained outside air.

## Runtime and UI

Same menu-adjacent44px slash-speaker control, default muted and volume55%. No AudioContext or audio asset request before a gesture. Seven loop voices plus at most two short transient voices. Four rotation voices share one decoded buffer. Existing pause, visibility, page navigation, cross-tab ownership and retry behavior retained. Both continuous and one-shot voices stop on pause/mute/background. Poll interval60ms only while enabled; no separate animation RAF. The paused-menu invalidation fix from the first preview is preserved.

New app files add only bounded arc-birth observations and a read-only `audioState()` API. They do not consume RNG, change shaders, geometry, colors, camera, timing or motion. `app-hooks.json` records source hashes. The observation list retains at most64 events.

## Sources / licenses

All sources are already acquired public HQ MP3 previews, not original WAV files. The author preferred collected recordings; no generated oscillators are used.

- waweee, **Wind in the grass**, Freesound517995, CC0. Approved corrected50–80s excerpt; unchanged outdoor-v1 asset.
- Kyster, **Near the ocean.wav**, Freesound165580, CC BY4.0. Approved615–675s excerpt; unchanged outdoor-v1 asset.
- oldestmillennial, **ConveyorLoop.wav**, Freesound538210, CC BY3.0. Existing approved S07 Foley; shared `device-audio-v2-20261019-rumble.mp3` uses1–19s, .70 speed/pitch,55–800Hz,24s final loop. Exact processing: `audit/2026-10-19/device-audio-v2/audio-build.json`.
- humanoide9000, **Camera lens servo**, Freesound336556, CC BY4.0. Approved source S05, new artistic processing for this preview. The source is a camera motor/contact recording. Hologram:0.38–1.65s, .34/.43/.68 pitch layers including reversal, filtered/delayed,14s final loop. Spark variants:0.215–0.4s,1.86–2.08s and5.7–5.95s, bandpassed and shortened with decay. Exact edits, hashes, peak and loop-seam checks in `audio-build.json`.

Source pages and license links are in `sources.json` and the artwork's sound credits. An electrical-spark search on Freesound returned HTTP403; no unverified substitute download or claimed electrical recording was used. The recording-derived spark/rotation/hologram mix remains for the author's listening approval.

## Cost and validation

Seven unique runtime audio files total2,566,575 bytes; winds and rumble are reused across previews and cacheable. `assets.json` gives exact hashes and unique decoded-buffer cost. Rotation voices share the24s buffer; it is fetched/decoded once.

`test.py BASE_URL LABEL` exercises both previews, actual visible-spark triggers and spatial position, four independently driven rotation rates, hologram state changes, all five view mixes, mute/no initial requests, pause/one-shot cessation, the paused menu, volume/credits, responsive control placement, pagehide/pageshow and cross-tab mute. `results.json` records completed local results for both works at deviceScaleFactor0.25 (CSS viewport dimensions unchanged): the software GPU at normal DPR stalled the scene clock during continuous rendering, while reduced raster resolution allowed genuine scene frames and visual arc births to advance. No runtime resolution override or synthetic event injection is used. First-spawn tests pass on the actual scene; rotation and hologram parameters use actual engine data. The parent separately verifies display at normal DPR. `results.json` includes the raster setting; `runtime-dependencies.json` captures all fetched runtime resources. The parent workflow preserves the complete dependency ZIP and verifies an independent extraction before deployment. Native Safari and subjective listening are not claimed.

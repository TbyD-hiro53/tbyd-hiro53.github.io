# Armillary v1 / v2 and Binary Dusk — audio preview v1

Review-only integration; production artwork HTML and approved visual assets are unchanged.

- Armillary v1 and v2 share natural grass wind on the island. Wide and rim views have more outside air; the central view is quieter. Ring rotation, levitation and lenses remain silent. No fabricated mechanical or electrical effects.
- Binary Dusk uses quieter grass wind at the high viewpoint and a restrained, low-passed coastal-air layer to the left. Sunset does not trigger effects; the forest disc remains silent.
- Same menu-adjacent 44 px Liquid Glass speaker, one-tap slash toggle, default muted, volume 55%. Audio contexts and MP3 requests begin only on gesture. Pause/resume, page visibility, pagehide/pageshow, cross-tab ownership and load error retry use the approved Confluence lifecycle. All new runtime code is IIFE, same-site and versioned.
- Existing hosts continue rendering glass controls. The Armillary host's menu content can be recreated, so an observer reattaches the audio settings group inside its scroll area after each rebuild. Credits remain in that scroll area. UI hiding follows the original menu/top controls.

## Sources and edits

The source files are downloaded public HQ MP3 previews, not original WAVs. No synthetic sound or unreviewed intervals are introduced.

1. **waweee — Wind in the grass**, Freesound 517995, CC0 1.0. https://freesound.org/people/waweee/sounds/517995/ ; https://creativecommons.org/publicdomain/zero/1.0/
   Uses the corrected and approved S04 50–80 s interval, 45 Hz highpass and +42 dB gain. The original first 20 s excerpt with voices is excluded. This is recorded mountain grass wind; it is not presented as a recording of a fictional giant tree.
2. **Kyster — Near the ocean.wav**, Freesound 165580, CC BY 4.0. https://freesound.org/people/Kyster/sounds/165580/ ; https://creativecommons.org/licenses/by/4.0/
   Uses 615–675 s within the previously approved Coastal 615–705 s interval. 110 Hz highpass, 5500 Hz lowpass, -28 dBFS normalization followed by gentle peak compression. Recorded near coastal dunes and vegetation, mixed as remote air rather than a close surf loop.

Both loops receive a 1 s equal-power cyclic overlap, .32*tanh(x/.32) peak control, a quiet-slope cyclic starting point and 100 ms encoding guards. Runtime strips the guards after MP3 decode. Runtime lowpass and gain are view-dependent; no speed/pitch manipulation. Exact hashes, loop seam measurements, RMS and encoded sizes are in `audio-build.json`.

Encoded total: **1,770,666 bytes** (shared and cacheable across all three works). Decoded buffers: **33,792,000 bytes** at 48 kHz stereo (29 + 59 seconds), or 31,046,400 bytes at 44.1 kHz. Only two looping Web Audio sources; no new frame loop, textures or geometry. Audio state is polled every 120 ms while enabled.

## Validation and preservation

`test.py`, `results.json` and `runtime-dependencies.json` document completed normal-DPR Chromium verification for Armillary v2 and Binary Dusk: actual speaker gesture, no initial audio traffic, 29/59 s decoded loops, pause/resume, all five Armillary viewpoints, both Binary orientation assets, 320/390/844/1100 CSS widths, menu volume/credits, persisted page lifecycle and cross-tab ownership. No browser errors. Armillary v1 separately passed initial silence, gesture playback, all five views, pause/resume and 320 px layout before a 390 px screenshot timed out under concurrent software GPU load. Its remaining final smoke belongs to the parent independent archive run. `v1-static-dependencies.json` is an explicitly static supplement of verified existing v1 asset names, not claimed browser capture. Representative v1 320 px and v2/Binary menu screenshots were inspected. The parent release workflow creates a combined complete dependency ZIP and tests a separate extraction before preview deployment. This directory does not claim those parent steps have already passed. Native Safari hardware and subjective listening are not claimed; the author's review remains necessary.

## Paused UI correction found during independent extraction

The independent v1 test found a real existing composer integration issue: while motion was paused, menu DOM opened but the glass host retained stale surface/clip rectangles and outside labels disappeared. The composer host was constructed without a scene request callback. v2 uses the same composer and also needs the correction; Binary's host already has a callback.

The new outdoor module connects both the host's `requestFrame` and UI's `invalidate` to the original artwork's deduplicated renderer through `ArmillaryArtwork.tune({})`. The empty options object changes no visual parameter; it only requests the existing frame. There is no independent RAF loop and no clock advance while paused. Visual viewport events use the same request.

`paused-ui-results.json` records diagnosis before and after the callback bridge. `paused-ui-test.py BASE_URL LABEL` checks both works against any independently served archive: a paused menu and credits actually render, resized glass bounds match DOM after the transition settles, about/back preserves settings, closing restores the labels, motion/time remain paused, and frames stop after the UI settles. `paused-ui-final.json` records the local final check. Native Safari is not claimed.

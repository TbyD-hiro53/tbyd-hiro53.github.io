# Confluence — downstream current and wind-led basin

User feedback: the river lacks flow towards the open water, and close/loud water at the sea-side viewpoint is implausible; wind should be more prominent there. This revision is an interactive preview, not a production replacement.

## Water

A new immutable engine copy changes the water shader only. The established v13 landscape, baked color/depth maps, viewer, controls and production page remain unchanged. The east inlet's surface folds and sparse glints translate towards decreasing world X along its curved centerline. Near the floor opening they travel towards negative Z into the basin. Broad opposing ambient waves are subdued inside the inlet. Touch ripples are carried by the flow at their origin, then disperse as before.

Time translates scalar stream coordinates at a constant speed; it is never multiplied by a spatially varying velocity field. Surface derivatives therefore do not progressively compress into the moire reported in earlier versions. Distance/footprint filtering remains active. A 4-hour rendering check and a downstream transport check use the actual GPU shader. The latter isolates the current-height output from static reflections and compares an unobstructed surface patch at its stationary, downstream and upstream projected positions. This verifies direction, not a physical fluid simulation.

## Sound

| View | River gain | Near-flow gain | Wind gain |
| --- | ---: | ---: | ---: |
| Floor opening | .09 (was .40) | .08 (was .58) | .18 |
| Beneath a disc / open water | .065 (was .72) | .025 (was .28) | .70 |
| Shore path | .28 (was .40) | .55 (was .82) | .35 |

The open-water river and near-flow layers are about 21 dB quieter before additional filtering. Wind now dominates there; the bank retains close water. All levels share the existing 55% master default and smooth viewpoint transitions. Wind stays broad/centered; water panning continues to follow the viewer's yaw.

The two approved water loops remain byte-identical to audio v1. The added wind is an excerpt from the Kyster recording already accepted for Coastal (615–675 s, within its accepted 615–705 s selection): [Near the ocean.wav — Kyster](https://freesound.org/people/Kyster/sounds/165580/), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). It was recorded near coastal dunes with shrubbery, not on Confluence's fictional shore. Excerpt, EQ, RMS level, peak control and loop have been edited. Attribution, license and changes appear in the menu. The acquired source is a public HQ stereo MP3, not an original WAV.

Wind download is 1,185,480 bytes; all three sound files total 1,876,244 bytes and only load after a gesture. Decoded buffers total roughly 36 MB at 48 kHz. The wind has a 59 s loop with cyclic MP3 guards removed after decoding. No new synthesized wind or film sound is used.

## Checks and preservation

Three viewpoints, camera-relative stereo, pause/volume/UI, description dismissal, water touch, cross-tab/lifecycle controls and four screen layouts are checked in Chromium. The final dependency ZIP is independently extracted and checked before pushing. Source previews, license records and processing scripts are included; existing Blender sources remain in the v13 production archive. Native Safari and subjective model-side listening are not claimed.

# Armillary electrical crackle preview v3

The previous camera servo clicks were rejected as insufficiently crackling. Both Armillary previews now use short, irregular clusters from an actual electrical discharge recording. Rotation, wind, the internal hologram bed, read-only visual event hooks and the paused-menu rendering repair remain unchanged from audio v2. Production pages are untouched.

## Recording and rights

“Electric Sparks, Railway, A.wav” by **InspectorJ (www.jshaw.co.uk)**, Freesound sound **412313**, **CC BY 4.0**. Source: https://freesound.org/people/InspectorJ/sounds/412313/ . License: https://creativecommons.org/licenses/by/4.0/ . Public HQ MP3 preview acquired; the original WAV was not acquired. The source records arcing at icy railway electrical contacts. Sanitized source metadata, download URL and SHA-256 are in sources.json. The alternate Tesla-generator recording 94128 was researched but is **not used**.

Excerpts are 5.08–5.51, 5.54–6.04 and 6.04–6.49 seconds. Each keeps the recording's own irregular crackling, folded to mono for screen-position panning, high-passed at 700 Hz and low-passed at 10 kHz, level adjusted and softly peak-limited, with 4 ms edge fades. There is no synthesized oscillator/noise, artificial click train, pitch shift or reversal in these sparks. Excerpt selection and filtering reduce the railway low background; this is not claimed to be perfectly isolated electricity. Complete reproducible edits and hashes are in build.py and audio-build.json. Attribution and modification notice appear in the audio menu.

## Runtime

A visible, bright, freshly emitted visual arc triggers one of the three 0.43–0.50 second clusters. Event age is capped at 260 ms, concurrent clusters at one, start spacing at 320 ms, and there is at least 75 ms silence after the previous cluster ends. Position and distance determine pan/gain. Pausing, muting or hiding the page cancels the burst as well as stopping the continuous beds. No audio context or media request occurs before the speaker gesture. Old servo-spark assets are not requested.

The complete seven-file audio payload is 2,576,183 bytes; decoded shared buffers occupy 44,696,232 bytes at 44.1 kHz. Most bytes belong to unchanged wind/mechanical/hologram beds. New three spark MP3s total 34,817 bytes. Runtime dependencies contain all 52 files observed across both pages; visual dependencies and app hook revisions are unchanged from v2.

## Verification

Focused Chromium checks passed for both previews: no initial audio; correct new source requests and no old spark requests; a real rendered arc after advancing scene time triggers playback; one-cluster concurrency; pause cancels sounds and prevents new events; paused menu and new credit render; resume and mute work; no page errors. Observed visual-event-to-audio scene-time latency: v1 16.7 ms; v2 0 ms. See results.json and test.py. The test uses CSS viewport 390×844 and deviceScaleFactor 0.25 for software-GPU timing; it does not represent a native-device performance benchmark. Responsive/menu geometry is unchanged from the already-tested v2; this focused regression does not claim a new native Safari or listening review.

## Independent preservation verification

The scoped two-work ZIP was extracted to /workspace/verification/armillary-audio-v3 and served separately on8079. Both previews passed actual visible-spark triggering, new recording fetches/no rejected old spark assets, pause stopping loops and bursts, credits, resume and mute with zero JS/HTTP errors. Scene-time latency observed0–100ms in this software-GPU run. DPR0.25 applies only to test execution. See independent-results.json.

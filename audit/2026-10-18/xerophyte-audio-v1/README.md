# Xerophyte — accepted sand and wind, artwork preview

User approved S03 v4 and requested blending it with wind, with changing intensity. S04 and S06 remain approved; this change implements Xerophyte only. Production xerophyte.html remains unchanged until the artwork mix is reviewed.

## Sound and timing

The accepted continuous sand wash (Lonofi 446950 + quiet Vrymaa 825860) retains its source, filtering and relative levels. Wind recording keirofinch 376534 is separated into a second loop. No rejected contact-microphone impacts (244967) are used. Both loops are circular, with equal-power overlaps and no periodic fade to silence. Only 912,805 encoded bytes load, after the speaker gesture; decoded stereo buffers total about 16 MB at 44.1 kHz (the browser may resample).

Audio reads Xerophyte's existing clock, wind, dust density, veil and gust functions. Wind builds before sand, the sand follows the visible storm, the veil adds a broad swell, and the passing storm leaves a quiet wind. No independent storm timer or extra visual rendering loop is introduced. Gain/filter targets update every 120 ms and are smoothed. The immutable artwork script copy differs only by exposing its existing gust function. The three-minute one-shot SANDSTORM remains unchanged.

The menu-adjacent 44 px speaker toggle uses the same Liquid Glass host as the other controls. It starts muted, with volume at 55%. Pause, tab hiding, persisted page navigation, cross-tab audio claims and sound-load retry are handled. Per-voice fades prevent a retiring source from being abruptly reopened by a rapid toggle. Opening or closing a description does not reset the clock or sound. Opening the menu hides the lower controls/status to avoid overlap; its scrolling area stays above copyright text.

## Sources and licenses

- [Sand blown by the wind — Lonofi / Mathias Rossignol](https://freesound.org/people/Lonofi/sounds/446950/), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). The uploader explicitly describes a synthetic designed sand sweep, not a field recording. Excerpt, EQ, envelope levelling, level and loop edited.
- [Desert sand - Dune atmosphere — Vrymaa](https://freesound.org/people/Vrymaa/sounds/825860/), [CC0](https://creativecommons.org/publicdomain/zero/1.0/). Uploader-described flowing sand recording; excerpt, EQ, level and loop edited.
- [Strong Wind Recorded with Soundfield Microphone Manchester2 — keirofinch](https://freesound.org/people/keirofinch/sounds/376534/), [CC0](https://creativecommons.org/publicdomain/zero/1.0/). Excerpt, EQ, level and loop edited.

The menu includes attribution, license links and modifications. Sources are publicly available HQ MP3 previews. Original WAV/FLAC files have not been obtained. See audio-build.json and build_audio.py for exact processing, and the prior audio-survey-v4 records for source metadata.

## Verification and archive

Browser checks cover user-gesture playback; silent/no-audio-fetch initial state; nine points in the artwork storm timeline; pause/resume; volume zero; description close; UI hiding; persisted pagehide/pageshow; cross-tab ownership; rapid toggles; network-error retry; and 320×568, 390×844, 844×390 and 1100×800 layouts. Timeline probes are accelerated checks, not a real-time three-minute listening test. Chromium with touch emulation is available; native iPhone/Safari and model-side subjective listening are not claimed.

The full artwork dependency ZIP includes shared scripts/styles, baked artwork layers, audio, source previews and editing/validation records. It requires a local HTTP server; direct file:// playback is not claimed. archive-info.json and independent-browser-validation.json record the independently extracted check. Production publication is not part of this preview revision.

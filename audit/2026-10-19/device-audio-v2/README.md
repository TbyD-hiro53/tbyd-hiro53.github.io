# Cortex / Tricore mechanical audio preview v2

The author requested removal of Cortex's liquid sound, then asked for strange, unsettling machine sound in Tricore instead of liquid. Both preview pages now load only mechanical foley: neither previous water recording is fetched. Core No.37 and all production pages retain their previous versions.

Cortex uses a quiet low mechanical layer, reduced further in the brain view. Tricore adds a separate metallic layer; acceleration view makes it closer and more prominent, while brain view softens it. Slow, small gain changes shade the continuous recordings. Visuals and the existing real-time liquid simulation are unchanged.

Source: S07, **ConveyorLoop.wav**, **oldestmillennial**, https://freesound.org/people/oldestmillennial/sounds/538210/, licensed **CC BY 3.0**, https://creativecommons.org/licenses/by/3.0/. The downloaded input is the public HQ MP3, not original WAV. It is chain / VHS / bicycle mechanical foley, not an actual recording of these fictional machines. Source seconds 1–19, speed/pitch reductions, high/low-pass EQ, conservative gain, soft peak control, equal-power loop overlap and codec guards. No synthesized oscillator or added water recording. Attribution and editing disclosure are in both menus and the preview hub.

`build-audio.py` reproduces the two new versioned MP3s from the preserved input; `audio-build.json` records exact filters, hashes, levels and seam measurements. Rumble loop 24 seconds; metallic loop 18 seconds. Cortex downloads 485,399 bytes, Tricore 850,634 bytes only after a speaker gesture. Decoded stereo buffers at44.1kHz: Cortex 8,467,200 bytes; Tricore 14,817,600 bytes. All existing pause, mute, page lifecycle and cross-tab handoff behavior is retained.

`test.py` exercises real speaker/pause/view/menu controls, four viewport sizes, expected buffers, absence of water fetches, gain relationships and lifecycle behavior. Chromium device emulation is not a native Safari or subjective listening test. Final mix approval remains pending; changes are previews only.

## Verification outcome

Both previews passed the control/lifecycle tests and four viewport sizes. The first Cortex attempt tapped resume before the responsive controls settled; it timed out. After waiting for layout settlement, the actual pause/resume control and all remaining checks passed. An independent extracted-site smoke test also passed both previews, with no JS/HTTP errors and no pre-gesture audio request. This was a test-timing correction; no artwork or audio lifecycle workaround was introduced.

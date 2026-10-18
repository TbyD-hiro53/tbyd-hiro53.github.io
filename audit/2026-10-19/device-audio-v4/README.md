# Cortex / Tricore audio v4 — steady mechanical ambience

Author requested removal of audible volume waves from both works. The shared recording had roughly 19–21dB of loudness variation over 0.5–1s windows. Tricore also applied two slow sine gain envelopes. Render-clock resynchronization could additionally retrigger fade-ins when rendering time lagged behind the audio clock.

- Rebuilt the existing S07 mechanical recording from the acquired original HQ MP3 (oldestmillennial, ConveyorLoop.wav, 538210, CC BY3.0). No new recording or synthesized tone.
- Stereo-linked circular RMS leveling is baked into a new immutable 24s MP3. Two offline smoothing passes retain waveform/texture while removing broad swells. Mean level remains approximately −23.93dBFS, comparable to v3. Processing consumes no extra runtime CPU.
- Decoded output measured through each artwork's actual Q=.5 low-pass: 1s RMS range ≤0.48dB, 0.5s ≤1.03dB, 0.25s ≤1.95dB, including the loop seam. `audio-build.json` records all processing and comparison values.
- Removed Tricore's periodic gain envelope. Continuous machine ambience runs on the audio clock without render-time resynchronization; normal pause/mute/background/tab handling remains.
- Preserve v3 levels by location: Cortex .60/.44 (brain), Tricore main1.12/brain.68/acceleration1.52, default master55%. User-controlled volume and spatial distance changes still apply. Removed liquid/clatter stay removed.
- New module and MP3 used by the two previews only. Other works and production pages remain at their approved versions.

Preservation ZIP contains both works and runtime dependencies, source HQ MP3, processing recipe and attribution. Independent extraction testing covers gesture-only loading, 24-second looping beyond a full cycle, scene-clock drift without fade restart, view levels, pause/resume and mute. Software Chromium DPR.25 is used only for test performance; no claim of real-device Safari or subjective listening approval. Final listening review pending.

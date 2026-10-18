# Cortex / Tricore audio preview v3

Author feedback: increase machine sound in both works; remove Tricore's rattling/clattering layer.

Both works now load only the existing24-second `device-audio-v2-20261019-rumble.mp3`. The metallic layer is removed from the layer list, loading, voice creation and view mix. It remains preserved as a historical v2 asset; Armillary and all other previews keep their own audio versions.

Low mechanical gain is doubled in every view (+6.0206dB), with the existing55% master default, filters and gentle Tricore envelope unchanged:

- Cortex brain .22→.44, other views .30→.60.
- Tricore main .56→1.12, brain .34→.68, acceleration .76→1.52.

The decoded rumble's measured peak is0.319997. At100% master, maximum Tricore gain1.52×1.085 gives a conservative pre-filter peak bound0.528, below clipping; the nonresonant low-pass further reduces high-frequency detail. Only one buffer/voice per work;24s stereo44.1kHz is8,467,200bytes decoded,485,399bytes transferred. No extra gain from the removed layer.

Source unchanged: oldestmillennial, **ConveyorLoop.wav**, https://freesound.org/people/oldestmillennial/sounds/538210/, **CC BY3.0**, https://creativecommons.org/licenses/by/3.0/. Recorded mechanical foley, source1–19s slowed to0.70 and filtered55–800Hz, overlapped into24s. Public HQ MP3 acquired, not original WAV. Attribution/edit disclosure remains in both menus. Exact source/processed hashes and build method are preserved from the v2 audit.

Only the new immutable audio module, two preview references, review-hub descriptions/links and status documents change. Visuals, UI and production artwork pages remain unchanged. Final listening approval is pending.

The preservation ZIP contains both works' runtime dependency union, source recording, processing provenance and this audit. It is a two-work bundle, not the entire gallery; use its README's direct preview URLs after starting a local server. Gallery navigation and external license/source links require the full site/network. The previous complete-site archives remain intact.

## Verified

Both previews passed independent-extraction browser checks: no audio fetch before gesture, only one rumble request and24s buffer, +6.02dB view gains, no metal layer, pause/resume and mute, zero JS/HTTP errors. Tricore checked all three views; Cortex checked its default and brain views. DPR0.25 was used only for software-GPU test performance; runtime quality is unchanged. No claim of nativeSafari testing or subjective listening approval.

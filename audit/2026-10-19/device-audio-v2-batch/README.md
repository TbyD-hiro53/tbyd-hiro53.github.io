# Device audio revision v2 — listening preview

Author feedback: remove liquid sound from Cortex; use eerie machinery instead of liquid for Tricore; add rotation, sparks and strange hologram effects to Armillary v1/v2 while retaining wind. These requests supersede v1's silent Armillary apparatus recommendation. Earth and Preservation Hall also receive quieter exterior wind without microphone buffeting and a subtle indoor ventilation fan. SHOKO reduces lower-floor water and adds appropriately shaded outside air only to scenes with openings. This release updates seven listening previews and their source list; production artwork HTML stays unchanged.

Cortex and Tricore use edited recorded mechanical foley, with all water-recording layers removed. Armillary's details and source/edit records are documented in the separate armillary-audio-v2 audit. Sanctum's glasslike resonance direction was discussed; it is not implemented in this release.

The preservation ZIP includes the site dependency tree and nine raw public HQ MP3 source previews (not original WAV/FLAC or Blender sources). Extract it and serve with `python -m http.server 8076`, then open `/preview/20261017/audio-preview-v1.html`. The SHA256 manifest verifies every included file. The previous v1 ZIP remains unchanged.

Browser checks use Chromium / software WebGL and emulated viewport sizes, not native Safari or a claim of subjective listening approval. See the individual results and independent extraction results. Final artwork sound approval remains pending.

## Completed checks

All seven updated previews passed independent-extraction gesture-only audio loading, expected loop playback, 44px speaker, mute and zero JS/HTTP errors. Cortex/Tricore used normal DPR; other five used DPR0.25 to keep software-GPU verification responsive, with unchanged CSS sizes and untouched runtime quality settings. The Armillary detailed tests additionally confirmed real visible arc births triggering sounds, four actual independent rotation rates, hologram changes, pause/menu and page/cross-tab lifecycle. Separate work audits record all-view mix checks. This is not physical-device or subjective listening approval.

# Confluence — water perspective preview

The author requested proceeding with the proposed Confluence audio preview. Sources S08/S09 were among the previously positively reviewed selections. This implements the artwork mix for review, not production publication. The approved v13 landscape, renderer, baked maps, interaction code and production confluence.html are unchanged.

Two collected water recordings play as circular beds. Only the reviewed 0–20 s region is used: each excerpt spans 1–19 s. Equal-power one-second seam overlap yields 17-second loops. Filtering, level adjustment and gentle soft-knee peak control reduce isolated transients. Cyclic 100 ms guards on each side keep the loop boundary inside the encoded MP3; Web Audio removes the guards after decoding. The build report checks decoded peaks and seam steps. Combined download is 690,764 bytes and starts only after a speaker gesture; two stereo buffers occupy about 13 MB at 48 kHz.

- Gap in the floor: quieter, filtered water below the open floor.
- Beneath the disc: broader basin bed, less close-up trickle.
- Shore path: clearer nearby flow, to the left at the initial viewing direction.

The spatial anchors follow the visible water positions. Panning tracks camera yaw, with a broad river layer and a more localized near layer. View changes smooth gain/filter targets over 450 ms without restarting the loops. This is an artistic perspective mix, not a physical acoustic simulation. The discs remain silent; no new synthesized splashes, motors, voices or music are added.

The Liquid Glass speaker sits beside the menu, uses a 44 px hit area, and starts muted. Menu volume defaults to 55%. Pause/resume, hidden pages, persisted navigation, cross-tab audio ownership, UI hiding and load-error retry use the already validated Xerophyte lifecycle. Descriptions do not reset the camera or sound. Menu content scrolls above copyright text and hides lower controls while open.

## Sources

- Nox_Sound, [Ambiance_River_Flow_Medium_Loop_Stereo.wav](https://freesound.org/people/Nox_Sound/sounds/479322/), CC0 1.0.
- peridactyloptrix, [Water, small stream](https://freesound.org/people/peridactyloptrix/sounds/197705/), CC0 1.0.

Both are publicly available HQ MP3 previews, not the original WAVs. The latter source describes a six-channel original; the acquired and used preview is stereo. Credits, CC0 link and modifications appear in the artwork menu. Source metadata/hashes and the recipe accompany this record.

## Validation / preservation

The complete runtime ZIP includes all three views, previous-version delta bases, shared scripts/styles, audio, source previews, credits and the processing recipe. It requires a local HTTP server; direct file:// playback is not claimed. The unchanged editable Blender source remains in the earlier Confluence v13 production archive.

Browser checks cover all three baked views, real gesture playback, no initial audio request, opposite camera directions reversing the pan, description dismissal preserving the camera, water-tap interaction, pause/volume/UI/lifecycle controls, cross-tab ownership and 320/390/844/1100 px layouts. The independently extracted final archive is tested before deployment. Chromium touch emulation is available; native Safari and subjective listening by the model are not claimed.

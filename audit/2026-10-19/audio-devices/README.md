# Device audio preview v1 — 2026-10-19

Review-only integrations for Lacto-Cortex, Lacto-Tricore and Core No.37. Production HTML is unchanged. Sources were audition-approved; these artwork mixes await review.

## Sound design

- Cortex: quiet perfusion plus low pipe/drive recording. Brain view raises fluid slightly while lowering drive; a 2.5% fluid envelope follows the existing 0.78-second artwork clock. No heartbeat or synthesized beep.
- Tricore: one continuous circulation; acceleration view raises fluid density/upper detail, brain view keeps mechanical drive quiet. All three existing baked views and w5 real-time fluid remain unchanged.
- Core No.37: low combined pipe/drive with subdued chain-based foley, reduced to 62% while existing narration is displayed. No audible invented 37th-reactor event.

## Source and license

S01 JackRabbott 700254 and S02 finneganmilla 554314 are CC0. S07 oldestmillennial 538210 ConveyorLoop.wav is CC BY 3.0; it is chain/VHS/bicycle foley, not a recording of the fictional facility. Authors, title, source URL, license link and edits appear in each relevant menu. See sources.json.

All edits use source 1–19 seconds within the approved first20-second audition. One-second equal-power circular overlap, high/low-pass EQ, conservative RMS adjustment and tanh peak control; no added generated sounds. MP3 encode160kbps with100ms cyclic guards removed on decode. See build-audio.py and audio-build.json for exact filters, measured seam steps and hashes. Original WAV/FLAC not acquired: preserved input is Freesound public HQ MP3.

## Runtime and performance

Two17-second stereo buffers per work: 690,764 encoded bytes;11,995,200 decoded bytes at44.1kHz,13,056,000 at48kHz. No audio context or audio fetch before speaker gesture. Default muted, volume55%;44px speaker beside menu toggles slash in one tap. Liquid Glass host is reused; controls and attribution are in the existing menu. Audio follows pause, visibility, bfcache and shared cross-tab claim. No positional fake source beyond understated stereo recordings. Layer gains crossfade.

Only Cortex needs a new immutable app copy. It adds window.__h53DeviceScene, a read-only accessor for readiness, scene clock and view key; existing scene rendering and geometry/assets are byte-preserved. Core and Tricore reuse their existing APIs. Existing production-versus-preview differences before edits were only base/noindex.

## Verification / reproducibility

Run `python audit/2026-10-19/audio-devices/test.py http://127.0.0.1:8060 /tmp/device-audio-results` against a server rooted at the preserved complete site tree. The script collects runtime dependency paths including all Tricore views, verifies gesture loading, pause/mute, view mix, narrative mode, menu credits, volume, bfcache and cross-tab claim. Viewport checks320×568,390×844,844×390,1100×800 are Chromium emulations, not physical Safari testing. Parent release builds a complete dependency archive and independently tests extracted previews before deployment. Keep this distinction: no production release is authorized for these new mixes yet.

## Completed verification

All three previews passed the four-viewport matrix, gesture-only load, audio start/mute, real pause/resume controls, view changes, volume, bfcache and cross-tab handoff without JS/HTTP errors. Network collection found96 existing dependencies totaling43,662,207 bytes across allthree works (deduplicated); see dependencies.json. Tricore tested allthree views; Cortex allfive dedicated views; Core ONE YEAR mode plus narrative duck. Finalcompact320px menu check places panelbottom514 abovecopyrighttop528 and hides title/footer text behind expandedmenu (menu-check.json). Screenshots stored under /workspace/render-work/audio-devices/qa; no claim of nativeSafari or physical listening verification.

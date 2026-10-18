# Core No.37 / Binary Dusk — approved audio production release, 2026-10-19

The author approved the audio previews that were not singled out for further revision. This release promotes only Core No.37 and Binary Dusk. Other audio previews remain separate.

Changes are limited to the already reviewed preview integrations: Core adds device-audio-v1-20261019.js and the existing dismiss-v2 helper; Binary adds outdoor-audio-v1-20261019.js. Existing artwork rendering, models, narrative and approved scene controls are retained. Production entries have no preview base/noindex and retain their canonical root URLs.

Core: quiet pipe/drive plus subdued conveyor foley; narration reduces the mix. Binary: grass wind plus distant sea to the left; no new sunset, ring or machine event sounds. Both default muted and use the reviewed speaker next to the menu; audio is fetched only after a gesture.

Sources: S02 finneganmilla554314 (CC0), S07 oldestmillennial538210 (CC BY3.0), S04 waweee517995 (CC0; approved replacement interval50–80s), S10 Kyster165580 (CC BY4.0;615–675s). Menu credits include source and license links and editing notices. Raw inputs are publicly downloadable HQ MP3 previews, not original WAV/FLAC. Reproducible edits and source hashes remain in audio-devices and audio-outdoor audit folders.

A scoped preservation ZIP includes both production root entries, complete runtime dependencies, the four raw sources, provenance and verification scripts. The dependency union retains some extra assets used by related previews, but includes no unrelated artwork HTML. The full site/gallery is outside this archive scope; open either root artwork URL directly. Serve the extracted directory using `python -m http.server 8078 --bind 127.0.0.1` and open `/core-37.html?skipgc` or `/binary-dusk.html?skipgc`. Direct file:// playback is not promised. A minimal index links these two works so their Back links are useful in the scoped copy.

Focused root-route QA verifies initial mute/no fetch, gesture playback, pause/resume, volume/credits, Core ONE YEAR narration duck, Binary SUNSET and portrait/landscape dependencies, and mute. The same test is repeated against a separately extracted ZIP; see independent-results.json. Browser tests use headless Chromium, not physical Safari. User audition approval supplies the listening judgment.

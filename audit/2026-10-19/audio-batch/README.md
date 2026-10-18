# Ten artwork audio previews

The author requested parallel progress on the remaining artwork sound tasks. This batch adds preview-only audio to Cortex, Tricore, Core No.37, Armillary v1/v2, Binary Dusk, Earth Origin Material, Preservation Hall, SHOKO and Sanctum. Existing production artwork HTML remains unchanged. The review entry is `preview/20261017/audio-preview-v1.html`.

## Sound and interaction

Previously auditioned recordings are used with bounded excerpts, loop seams, peak control and restrained scene-specific gains. S04 uses the accepted corrected grass-wind interval, not the rejected voice-heavy opening; S06 uses the accepted cleaned room interval. No film audio or generated noise is added. Source identifiers, original preview hashes, edited file hashes, licenses and processing are recorded in the group audits. The review page and artwork menus provide source attribution.

Audio is muted initially and fetched only after the speaker gesture. The speaker sits beside the menu and indicates mute with a diagonal slash. Playback follows scene pause and page visibility; shared tab claims prevent competing artwork sound. Views change the mix without making the apparatus invent sounds absent from the source setting.

Caloris remains silent because it is observed in vacuum. Vacant Seat remains silent because its beat is explicitly not sound. See `../audio-pending-design.md`. These are intentional recommendations, not claims that new audio has been implemented there. Sanctum tests a quiet room bed; this is not presented as a recording of its fictional apparatus or energy streams.

## Validation and preservation

Group tests exercise layout, start/mute, view changes, pause and relevant lifecycle/menu cases. The full delivered website and the eight acquired source HQ MP3 previews are packed into a single archive so lazy portrait/landscape views and fallbacks are preserved. A separate extraction is served and all ten previews are opened and played before deployment. Exact archive hashes and independent browser reports are retained with this audit.

Chromium tests verify decoded buffers and Web Audio playback state, not subjective listening quality or physical speaker output. Native Safari/iPhone is not claimed. Source originals in WAV/FLAC and Blender editing sources are not part of this audio snapshot.

Independent extraction playback passed for all ten works: no sound request before gesture, loaded loops, 44px controls, mute, and no JavaScript/HTTP errors. A subsequent visual inspection caught Armillary’s pre-existing paused composer redraw gap; the outdoor preview module bridges UI invalidation to the artwork’s existing render request, without resuming its simulation. Focused paused-menu regression results supplement the playback checks.

Final isolated Armillary v1/v2 paused-menu regression passed: panel matches DOM bounds, credits survive menu regeneration, controls reappear after closing, simulation time remains fixed and settled rendering stops. The final runtime hashes match the independent extraction.

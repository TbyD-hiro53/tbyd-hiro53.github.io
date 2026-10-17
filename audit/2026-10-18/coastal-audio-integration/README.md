# Coastal rotating beacon + audio v3

Author requested audio integration after local rotating-beacon publication. Base scene commit: a8318b2 (compact beacon v3). The root HTML keeps its night/renderer/picking/app references, shared reading layout and original sunset start, adding only the established audio v3 module and v2 outside-dismiss helper. The dated Coastal preview now uses the same rotating-beacon runtime plus audio, with preview base/noindex metadata.

Audio: existing left-panned waves and centered recorded wind gusts (h53-audio-trial-v3-20261018-coastal.mp3). See audio-v3-publication.md and validation/audio-v3-assets.json for source licenses, processing and hashes. The sound button remains beside the menu. No replacement of rotating-beacon geometry, textures, clock or baked occlusion. Initial silence and gesture activation are retained.

The author's temporary hold was lifted by the subsequent request: “coastal公開されました。音実装よろしく”. This authorizes the combined production publication.

Validation passed locally and from the independently extracted full site archive: 3 screen sizes, single-tap mute/enable, UI hide/restore, page lifecycle, tab exclusivity; actual sunset-to-night transition with audio, pause/resume synchronization, and beacon axes at 0/6/24 seconds. No JS/shader errors. Archive source a6dc55a, 720,111,831 bytes, 1,335 entries, CRC pass, SHA256 dbeb24a659b2c68bb6a1abf906e2d0e881ab08b4f4e67f5365ca362c53430170. Native iPhone/Safari verification is not claimed.

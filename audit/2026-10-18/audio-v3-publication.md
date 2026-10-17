# Audio publication — approved Carriage and Coastal revision 3

Author approval: publish Carriage's speaker UI and sound. Coastal: place water toward the left, use stronger howling gusts, combine with the separately approved rotating beacon, then publish the combined version.

Carriage root HTML adopts the exact auditioned v2 audio module, original v1 train recording and v2 outside-dismiss helper. Visual assets remain unchanged.

Coastal v3 replaces Soft Wind with swiftoid / wind howl.mp3, https://freesound.org/people/swiftoid/sounds/84914/ . The individual page states CC0 and describes a real wind recording through an old window with an artificial stereo pan added afterward. Following the uploader's advice, this pan is removed by averaging to mono. Public HQ MP3 acquired without authentication; no original-download or subjective audition claim. The previous gentle-wave recording is retained. Source licenses and hashes are recorded in validation/audio-v3-assets.json.

Water is placed at equal-power pan −0.55 (left about 8.66dB above right), keeping both channels and mono compatibility. The new wind stays centered with its recorded gust envelope, high-pass 80Hz / low-pass 7kHz and RMS 2dB above the water stem before panning. Both recordings use equal-power cyclic overlaps, then an 80-second composite loop. Peak attenuation is shared, preserving balance and dynamics. Encoded stereo MP3 is 192kbps, 1.92MB. No additional runtime audio node, shader or 3D pass. The speaker beside the menu, one-tap toggle, initial mute, volume, pause/visibility behavior and tab exclusivity are preserved.

The recording replaces synthetic gust generation; this is source selection and processing, not a claim to have measured perceived realism. Real Safari/headphone listening remains distinct from Chromium interaction checks.

At initial preparation, the local rotating-beacon task was still uploading its approved derivative files. The Coastal root must only be promoted after acquiring that implementation and preserving its scene references. The v3 preview audio is prepared independently in the meantime.

Local validation passed for both works: three screen sizes, speaker adjacency and slash state, one-tap operation, hide/restore, page lifecycle and cross-tab exclusion. English landscape with HTTP 503/retry also passed. The complete site snapshot is preserved in h53-audio-v3-site.zip (source 6936049), SHA256 687b9b7d19d8b3d157082bbc6800c504d3b99fc5a98f24f995030c1c95707798, 696,962,405 bytes, 1,290 entries, CRC verified. Independent extraction testing uses port 8051.

Independent extracted-site verification passed for both works, including Carriage at the production root URL. No JS errors. Coastal remains the audio preview while the approved beacon upload is pending.

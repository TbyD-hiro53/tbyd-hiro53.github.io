# Shared reading UI publication — 2026-10-18

Promote the previously previewed reading-layout guard to the remaining production works. Version 3 adds Earth's real copyright selector `#cr`, as requested in the author's final Earth UI review. Existing `.h53-copy`, narration `#log/#phase`, external controls and titles remain temporarily hidden while a modal explanation is open and return afterward. The heading has no opaque sub-panel. Small viewports use safe-area/visualViewport bounds and scrolling text.

The 25 actual root pages were loaded and their generated DOM/CSS collected. Script-free layout fixtures then tested six dimensions/text-size conditions per panel: 320×568, 390×844, 768×1024, 844×390, 568×320 at double body text, 1920×1080 at double body text. 180 conditions passed; no root-page startup/resource errors, viewport overflow or visible external buttons/copyright. These are layout checks, not a claim of exercising all scene interactions on all devices. Earth also passed actual panel open/close and copyright restoration at three dimensions, plus independently extracted publication testing.

Confluence's root scene remains its previously published version; only the shared explanation guard is added. The new hybrid landscape remains a separate preview. Coastal and Carriage audio are preview-only. No other production artwork geometry, lighting, clock or narrative is replaced by this UI change.

Source test, results, archive and independent verification are saved alongside this note. Chromium/SwiftShader used; real iPhone/Safari/VoiceOver not measured.

Preservation: `h53-reading-and-audio-audition.zip`, source 4ab0c20, 555,833,596 bytes, 1,204 entries, SHA256 c019d48374fee28b420a27ef394fa5094b0b80599dc5e431d0080433af8934ba. CRC passed. Independently extracted and served on port 8047: both audio previews passed actual enable/mute/pause/lifecycle tests; Confluence, Core 37, Earth, Caloris, Carriage and Xerophyte passed 36 layout conditions.

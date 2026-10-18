# Confluence v13 production replacement

The author approved publication and replacement of the existing work on 2026-10-18. `confluence.html` now uses the approved v13 preview's scene, baked maps and interactions at the existing public URL. Preview-only base/noindex/return-navigation overrides are removed; the back link returns to `index.html#place`. The original versioned assets and preview remain available.

The collection card's Japanese/English descriptions and CANON_TEXT source now describe the approved water interaction and three viewpoints. New thumbnail and social-card images are captured directly from the approved rendered scene. Novel fragments are unchanged.

The initial gap-view resource payload measured with a 390×844 Chromium viewport is 37,498,518 bytes, so the card shows 38 MB and states that other views load separately. This measures asset bytes, not a native phone's network timing. The scene and texture decoding are identical to the verified preview.

The root route loads v13, has the public back link and canonical URL, and does not carry a noindex directive. Full independent-archive browser results follow below after verification.

## Release validation

The full production ZIP includes the editable packed Blender scene and all site dependencies. CRC checking passed. Independently extracted archive: Chromium 1100×800 DPR1 and 390×844 DPR2 passed all three view loads, water touch, description bounds/closing and repeated-view texture-count checks without page, console or missing-resource errors. The real-time fallback also loaded with DecompressionStream unavailable. Public return navigation and absence of preview noindex were checked on both viewports. Native iOS/Safari is unavailable here.

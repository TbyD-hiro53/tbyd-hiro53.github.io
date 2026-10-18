# Confluence v13 — close five unwanted ground openings

The author reported holes around the vegetation in v12. The source terrain deliberately cut five elliptical water pockets through the full land solid at (19,14), (29,18.1), (43,18.1), (66,16.1), and (−21,−11). They read as deep dark holes rather than shallow natural recesses.

The correction removes the five inner contours from the Three.js land extrusion. The exact old 3,184-triangle land component was located and replaced in the packed Blender scene, retaining the material, UV mapping, shoreline contour, road, vegetation and other land components. All five centers and four surrounding points each are supported at terrain height by a geometry ray test. The same construction change is made in the real-time fallback.

The complete panorama, detail and reflection passes are rebaked at the same dimensions as v12. New immutable v13 assets may use lossless XOR or horizontal-filtered additive corrections against the retained v12 maps when smaller than standalone compression. The runtime decodes one map at a time to bound temporary memory; the exact original RGBA values are checked by SHA256. This changes storage, not image resolution or pixel quality.

This is a preview correction. Production confluence.html is retained. Final browser, archive and publication results are appended after they complete.

The initial download of a correction map may also fetch its v12 base. GPU texture dimensions and decoded pixels are unchanged; no claim of lower transfer cost is made. Native iOS/Safari is unavailable in this cloud environment; browser checks use Chromium with desktop and touch viewport emulation.

## Validation

- All 18 runtime-decoded maps exactly match the packaged RGBA SHA256 values; new compressed maps total 26,007,536 bytes.
- All 25 Blender terrain rays, 25 real-time terrain rays, and 25 baked-depth samples confirm support around the five former holes.
- Chromium 1100×800 DPR1 and 390×844 DPR2: all three views load, water touch works, panel stays in the viewport, repeated view changes retain bounded texture counts, and no page/console/resource errors occur.
- At 448×1000: closing a description followed by a double tap preserves the look direction in all three views; a later explicit reset works.
- The no-DecompressionStream real-time fallback loads successfully.
- The three final desktop views were visually checked. Native Safari has not been tested.

The complete preview archive (source e1df0cf) includes all dependencies and the packed editable Blender scene. ZIP CRC validation passed; the independently extracted copy passed the same desktop/touch-view tests without page, console or resource errors. Archive checksum and results are stored beside this document.

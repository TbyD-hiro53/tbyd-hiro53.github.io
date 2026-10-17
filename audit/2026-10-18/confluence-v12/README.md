# Confluence v12 — landscape and interaction corrections

Preview only. The author reported repetitive inexpensive-looking branches/leaves, a thin vertical line that moves with the scenery, and camera reset when dismissing an explanation.

## Diagnosed defects

The longitude discontinuity of the equirectangular panorama produces an incorrect implicit texture gradient. At yaw 180.25/180.65 degrees the old shader chooses coarse mip levels for a two-pixel stripe. A same-camera shader A/B comparison reproduced the stripe and isolated the correction to those columns. Explicit periodic UV gradients retain the ordinary mip filtering away from the seam. WebGL1 without gradient support uses linear panorama sampling without mipmaps. The detail patch retains its own mipmaps.

The canvas double-click reset was removed. The explicit Reset control and R remain available. Dismissal clears pointer state and blocks scene gestures during the closing animation and a short trailing interval. Touch dismissal followed by a double-click/click at the same location preserves yaw, pitch and field of view; a later explicit Reset still works. This prevents the symptom without assuming the user's exact OS event sequence was reproduced.

## Landscape

Replaced the old crossed foliage cards and repetitive branch meshes with curved individual leaves, tapered petioles and branches. Three growth patterns vary blade width, branch reach, rise and droop. Trunk lean, branch angle and root spread vary deterministically. The single remnant wall and roots enclosing it remain. Dark ground pockets in the Blender-only pilot are intentional still-water recesses; live water fills them in the complete renderer.

Static vegetation remains in Cycles radiance/depth panoramas, directional detail and reflection passes; water, discs and touch ripples remain live. No extra live leaf meshes or particle load. Full export dimensions are 4096×2048 panorama, 4096×4096 detail, 2048×1024 reflection per viewpoint. The packaging pipeline checks pilot dimensions before reusing passes.

Validation and independent archive results are recorded after the final full-resolution renders. Native iOS/Safari verification is not claimed.

## Completed validation

All 18 maps were rebuilt at full dimensions. Lossless RGBA delta/gzip encoding reduces the maps from 121,434,707 to 80,856,308 bytes; the actual JavaScript loader reconstructed every source byte, verified by SHA256. No lower resolution or lossy image compression was introduced.

Chromium passed desktop 1100×800 / DPR1 and mobile 390×844 / DPR2 through all three views, repeated viewpoint switching, texture lifetime, live water touch, explanation bounds and long water clocks. With DecompressionStream unavailable, the existing real-time fallback rendered without script errors. The final v12 scene also passed dismissal-followed-by-double-click/reset gesture tests at all views, preserving the camera; a later explicit reset works. Screenshots were inspected.

The scene uses three varied growth families, tapered branches and curved leaves, kept entirely in the baked static scene. The user's requested preview remains separate from the production root.

Independent archive from e5ef837: full dependencies and the packed editable Blender scene, 966711952 bytes, SHA256 2052d5196ac66e327302368d3d678bd89f06bb5f3b77695136153e665330a9c7, CRC passed. The complete desktop/mobile/view-switch/water/fallback checks passed again after extraction to a separate directory.

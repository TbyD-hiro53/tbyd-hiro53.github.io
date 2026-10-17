# Earth v11 — entrance scenery at views 1 and 4

The author's post-publication report was reproduced at the two entrance-facing directions. The v9 forest module only supplied a 3072×4096 perspective to view 4's side aperture. View 1's entrance and view 4's distant entrance still sampled the old 2048/3072-wide all-direction panoramas. Enlarging those small angular regions caused the blur; JPEG quality alone did not address it.

Add two Cycles perspective color/radial-depth pairs from the same packed forest scene. View 1: 3072×4096, 82° horizontal, pitched down 15°. View 4 entrance: 2048×2048, 36°, pitched down 6°. These directions include the visible ground through the doorway. The approved view 4 side-aperture v9 image remains byte-for-byte unchanged. Indoor materials, illumination and geometry remain unchanged.

Rendering uses the existing v9 scene, 16 Cycles samples, guided OIDN, 98% denoised/2% raw, JPEG 97 with no chroma subsampling. No enlargement or sharpening. Depth converts Cycles axial Z to radial distance before encoding. The depth-tested perspective overlays use the same camera eye as the panorama, so the doorway and live objects continue to occlude the forest. A feathered edge outside the opening blends into the old full-direction background.

Only the current station's maps are retained; switching to the records room releases them. Devices capped below 4096 textures use matching reduced perspective pairs, not the low-resolution angular patch of the panorama. WebGL 1 uses no NPOT mipmaps. Rendering still has one forest quad; no additional live vegetation draw pass.

Chromium/SwiftShader validation passed at 1280×900, 390×844 / DPR 2, 844×390, and WebGL 1 with a simulated 2048 texture ceiling. Both entrance directions and the preserved side opening displayed the expected image sizes. Actual drag, record opening/closing, repeated station changes, stable texture counts and full forest-map release at view 2 passed; no JS/resource/shader errors. Real iPhone/Safari measurements are not claimed.

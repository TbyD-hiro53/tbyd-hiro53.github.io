# Coastal Glass compact rotating beacon

Author approval for the rotating lighthouse and publication was received on 2026-10-18. A subsequent author request required smaller delivery. This package reduces actual page loading as well as the lighthouse derivatives. It preserves the latest shared reading UI, production's sunset start, and concurrent preview audio.

## Size and transport

- Lighthouse-only derivatives: 49,229,394 to 9,485,475 bytes (80.7% reduction).
- The additional compact replacements for existing sunset plates, scene depth and geometry total 13,832,092 bytes across all four views. These are substitutes for older, larger assets, not simultaneous extra downloads.
- Smartphone portrait (390×844): initial sunset assets plus HTML total 5,896,329 bytes; after visiting night, 7,891,582 bytes. These are local served file-byte totals from observed requests, with gzip counted compressed. Text may be compressed further on Pages. This is not a physical iPhone measurement.
- The largest new binary is 2,027,971 bytes. Each upload remains below 10 MB. No master, EXR, private source location or 8K image is published.

Night/sunset radiance retains original plate resolution, using an 8-bit logarithmic code per RGB channel: q=round(255*log2(1+c/1e-5)/18), decoded c=(2^(18*q/255)-1)*1e-5; alpha uses 8 bits. Runtime restores half-float textures before sampling, so interpolation remains scene-linear. The static diffuse normal/albedo map alone is half-size in each dimension, with nearest sampling. This is a lossy optimisation, not a claim of identical colour pixels.

Gzip payloads marked delta or log8 use four planar byte channels, with each row's first byte unchanged and subsequent bytes stored as modulo-256 horizontal differences. Reconstruction occurs in raw typed arrays without browser image colour conversion. Lantern depth, terrain depth and geometry reconstruct byte-for-byte; 512² shadow precision is unchanged. The 24-second rotation, axis/pupil updates and CPU visibility are unchanged. No extra geometry or per-frame shadow render is introduced.

## Validation

Four views and four night phases were compared at identical clocks, plus four sunset views. Night mean channel error is at most 0.045/255; sunset at most 0.086/255. Every tested frame has a 99.9th-percentile channel error of 1/255. One 4:3 night sample has an isolated maximum difference of 17/255; other night frames and all sunset frames have maxima no greater than 2/255. Draw calls and triangle counts match at each compared pose. The raw lighthouse shadow bytes match. No browser errors occurred. These changes reuse saved bakes; no Blender rendering was repeated.

The inherited angular shadow approximation and vegetation-instance exclusion remain. Native iPhone/Safari testing remains unperformed. The browser validation timings mix loading and comparisons and are not a performance benchmark.

## Reproduction

The two scripts under tools are the exact local conversion scripts. Place them in a working directory's tools folder with the saved derivative repository in sibling repository/. First run build_compact.py on the original v1 derivative pack, then build_compact_page.py. They use Python, numpy and Pillow; they do not open or modify Blender masters. Existing v1 bakes and the private source archive remain local. Packing reports record actual output hashes and source-byte reconstruction checks.

Publication changes only three script references in coastal-glass.html, the Coastal Glass size chip, its generator entry, and the newly versioned assets/audit files. Current index/CANON content and other works are preserved. Original large versions are retained locally and are not added to the published tree.

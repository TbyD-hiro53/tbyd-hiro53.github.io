"""Update the Empyrean study card and Lacto-Cortex title from CANON_TEXT.md.

The original full-site builder was not present in the repository. This
bounded replacement updates the study card and asset 06 version label;
existing asset prose is preserved.
Run with Python 3 from the repository root. No third-party dependencies.
"""
from pathlib import Path
import html
import re

root = Path(__file__).resolve().parent
canon = (root / 'CANON_TEXT.md').read_text(encoding='utf-8')
section = canon.split('## STUDY — Empyrean Sigil 3D / 01', 1)[1]
def field(name):
    match = re.search(r'\*\*' + re.escape(name) + r'\*\*\s*\n([^\n]+)', section)
    if not match:
        raise ValueError('Missing canonical field: ' + name)
    return html.escape(match.group(1))

start = '<!-- EMPYREAN_3D_STUDY_START -->'
end = '<!-- EMPYREAN_3D_STUDY_END -->'
card = f'''{start}
<article class="entry">
  <a class="entry-main" href="empyrean-sigil-3d.html">
    <div class="row"><span class="idx">STUDY</span><span class="name">Empyrean Sigil 3D</span></div>
    <p class="desc" lang="ja">{field('説明 JA')}</p>
    <p class="desc" lang="en">{field('説明 EN')}</p>
    <div class="spec"><span class="chip live">Live</span><span class="chip">3D study</span><span class="chip">WebGL</span></div>
    <span class="thumb"><img src="empyrean-sigil-3d-thumb.png?v=2" alt="Empyrean Sigil 3D — 立体構造のプレビュー" width="1000" height="1000" loading="lazy" decoding="async"></span>
  </a>
</article>
{end}'''
path = root / 'index.html'
source = path.read_text(encoding='utf-8')
if start in source:
    source, n = re.subn(re.escape(start) + r'[\s\S]*?' + re.escape(end), lambda _: card, source)
    if n != 1:
        raise ValueError('Unexpected duplicate study block')
else:
    target = source.index('href="empyrean-sigil.html"')
    position = source.index('</article>', target) + len('</article>')
    source = source[:position] + '\n' + card + source[position:]
source, n = re.subn(r'(id="count">)18 assets(?: \+ 1 study)*(</span>)',
                    r'\g<1>18 assets + 1 study\2', source)
if n != 1:
    raise ValueError('Expected exactly one holdings count')
source = source.replace('シリーズ 18 点。', 'シリーズ 18 点と独立Study 1 点。')
lacto_title = re.search(r'^## ASSET 06 — (Lacto-Cortex v\d+)\s*$', canon, re.M)
if not lacto_title:
    raise ValueError('Missing canonical Lacto-Cortex title')
asset_start = source.index('href="lacto-cortex.html"')
asset_end = source.index('</article>', asset_start)
asset = source[asset_start:asset_end]
asset, n = re.subn(r'(<span class="name">)Lacto-Cortex v\d+(</span>)',
                   lambda m: m[1] + html.escape(lacto_title[1]) + m[2], asset)
if n != 1:
    raise ValueError('Expected exactly one Lacto-Cortex entry title')
# The existing thumbnail remains an earlier illustration of the asset.
asset = re.sub(r'alt="Lacto-Cortex v\d+ —', 'alt="Lacto-Cortex —', asset)
source = source[:asset_start] + asset + source[asset_end:]
path.write_text(source, encoding='utf-8')
print('Updated study card and Lacto-Cortex title; preserved asset prose.')

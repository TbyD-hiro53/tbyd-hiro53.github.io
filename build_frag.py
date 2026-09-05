"""Add/update the Empyrean Sigil study card from CANON_TEXT.md.

The original full-site builder was not present in the repository. This
bounded replacement updates only this study card; existing prose is preserved.
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
    <div class="row"><span class="idx">STUDY</span><span class="name">Empyrean Sigil 3D / 01</span></div>
    <p class="desc" lang="ja">{field('説明 JA')}</p>
    <p class="desc" lang="en">{field('説明 EN')}</p>
    <div class="spec"><span class="chip live">Live</span><span class="chip">3D study</span><span class="chip">Compatibility</span></div>
    <span class="thumb"><img src="empyrean-sigil-3d-thumb.png" alt="Empyrean Sigil 3D — 立体構造のプレビュー" width="1000" height="1000" loading="lazy" decoding="async"></span>
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
source = source.replace('id="count">18 assets', 'id="count">18 assets + 1 study')
source = source.replace('シリーズ 18 点。', 'シリーズ 18 点と独立Study 1 点。')
path.write_text(source, encoding='utf-8')
print('Updated one study card; preserved existing asset entries.')

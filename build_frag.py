"""Update the Empyrean study card and Lacto-Cortex entry from CANON_TEXT.md.

The original full-site builder was not present in the repository. This
bounded replacement updates the study card and asset 06 title/descriptions;
existing narrative and other assets are preserved.
Run with Python 3 from the repository root. No third-party dependencies.
Use --viewing-only to update shared viewing notices and description metadata.
"""
from pathlib import Path
import html
import re
import sys

root = Path(__file__).resolve().parent
canon = (root / 'CANON_TEXT.md').read_text(encoding='utf-8')

# ASSET 20 registration is isolated from legacy replacement modes.
if sys.argv[1:] == ['--asset20-only']:
    section = canon.split('## ASSET 20 — Earth Origin Material', 1)[1].split('\n## ', 1)[0]
    def a20(name):
        match = re.search(r'\*\*' + re.escape(name) + r'\*\*\s*\n([^\n]+)', section)
        if not match:
            raise ValueError('Missing ASSET 20 field: ' + name)
        return html.escape(match[1])
    phase = re.search(r'\*\*位相\*\* (.+)', section)[1]
    log = re.search(r'\*\*観測ログ\*\* `([^`]+)`', section)[1]
    start = '<!-- ASSET20_START -->'
    end = '<!-- ASSET20_END -->'
    card = f"""{start}
<article class="entry" data-k="gl">
  <a class="entry-main" href="earth-origin-material.html">
    <div class="row"><span class="idx">ASSET 20</span><span class="name">Earth Origin Material</span></div>
    <p class="desc" lang="ja">{a20('説明 JA')}</p>
    <p class="desc" lang="en">{a20('説明 EN')}</p>
    <div class="spec"><span class="chip live">Live</span><span class="chip">WebGL</span><span class="chip">tap to inspect</span></div>
    <span class="thumb"><img src="earth-origin-material-thumb.jpg" alt="地球圏由来保存物 — 保存区の開口から、幹の重なりと根の道、その奥の円盤を見る" width="640" height="640" loading="lazy" decoding="async"></span>
  </a>
  <details class="frag">
    <summary><span>{html.escape(phase)}</span></summary>
    <p class="log">{html.escape(log)}</p>
    <p class="txt" lang="ja">{a20('断章 JA')}</p>
    <p class="txt" lang="en">{a20('断章 EN')}</p>
  </details>
</article>
{end}"""
    path = root/'index.html'
    source = path.read_text(encoding='utf-8')
    if start in source:
        source, count = re.subn(re.escape(start) + r'[\s\S]*?' + re.escape(end), lambda _: card, source)
        if count != 1:
            raise ValueError('Duplicate ASSET 20 block')
    else:
        if 'href="earth-origin-material.html"' in source:
            raise ValueError('Unmanaged ASSET 20 already exists')
        offset = source.index('</article>', source.index('href="confluence.html"')) + len('</article>')
        source = source[:offset] + '\n' + card + source[offset:]
    # The CANON card is counted as a holding alongside numbered ASSET cards.
    total = len(re.findall(r'<span class="idx">(?:ASSET \d+|CANON)</span>', source))
    source, count = re.subn(r'(id="count">)\d+ assets( \+ 1 study</span>)', lambda m: m[1] + str(total) + ' assets' + m[2], source)
    if count != 1:
        raise ValueError('Expected one holdings count')
    path.write_text(source, encoding='utf-8')
    print('Registered ASSET 20 from CANON_TEXT; all other entries preserved.')
    raise SystemExit(0)

# Update only shared viewing notices, preserving all work entries and narrative.
if sys.argv[1:] == ['--viewing-only']:
    notices = canon.split('## サイト共通案内 / Site notices', 1)[1].split('\n## ', 1)[0]
    def notice(name):
        match = re.search(r'\*\*' + re.escape(name) + r'\*\*\s*\n([^\n]+)', notices)
        if not match:
            raise ValueError('Missing site notice: ' + name)
        return html.escape(match.group(1), quote=True)
    path = root / 'index.html'
    source = path.read_text(encoding='utf-8')
    for attribute, key in [('name', 'description'), ('name', 'twitter:description'), ('property', 'og:description')]:
        pattern = r'(<meta\s+' + attribute + r'="' + re.escape(key) + r'"\s+content=")[^"]*(")'
        source, count = re.subn(pattern, lambda m: m[1] + notice('共有説明 JA') + m[2], source)
        if count != 1:
            raise ValueError('Expected one metadata field: ' + key)
    pattern = r'(<div class="notes">\s*<h2>Viewing</h2>)([\s\S]*?)(</div>)'
    def viewing(match):
        body = match[2]
        for lang in ['ja', 'en']:
            body, count = re.subn(r'(<p lang="' + lang + r'">)[\s\S]*?(</p>)',
                                  lambda m: m[1] + notice('Viewing ' + lang.upper()) + m[2], body)
            if count != 1:
                raise ValueError('Expected one Viewing paragraph: ' + lang)
        return match[1] + body + match[3]
    source, count = re.subn(pattern, viewing, source)
    if count != 1:
        raise ValueError('Expected one Viewing block')
    path.write_text(source, encoding='utf-8')
    print('Updated Viewing JA/EN and three description metadata fields.')
    raise SystemExit(0)

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
lacto_section = canon.split('## ASSET 06 — ', 1)[1].split('\n## ', 1)[0]
for lang, field_name in [('ja', '説明 JA'), ('en', '説明 EN')]:
    value = re.search(r'\*\*' + re.escape(field_name) + r'\*\*\s*\n([^\n]+)', lacto_section)
    if not value:
        raise ValueError('Missing Lacto-Cortex description: ' + lang)
    asset, n = re.subn(r'(<p class="desc" lang="' + lang + r'">)[^<]*(</p>)',
                      lambda m: m[1] + html.escape(value[1]) + m[2], asset)
    if n != 1:
        raise ValueError('Expected one Lacto-Cortex description: ' + lang)
# The existing thumbnail remains an earlier illustration of the asset.
asset = re.sub(r'alt="Lacto-Cortex v\d+ —', 'alt="Lacto-Cortex —', asset)
source = source[:asset_start] + asset + source[asset_end:]
path.write_text(source, encoding='utf-8')
print('Updated canonical study and Lacto-Cortex fields; preserved narrative.')

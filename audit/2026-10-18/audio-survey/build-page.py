from pathlib import Path
import json,html,subprocess,shutil,zipfile,hashlib
R=Path('/workspace/tbyd-hiro53.github.io');A=R/'audit/2026-10-18/audio-survey';P=R/'preview/20261017';O=Path('/workspace/previews/2026-10-18/audio-survey');ss=json.loads((A/'sources.json').read_text());works=json.loads((A/'works.json').read_text());E=html.escape
for s in ss:
 if not s['downloaded']:continue
 target=P/('audio-survey-'+s['id']+'.mp3');start=615 if s['id']=='165580' else 0
 subprocess.run(['ffmpeg','-v','error','-y','-ss',str(start),'-i',str(O/s['file']),'-t','20','-af','afade=t=in:d=0.2,afade=t=out:st=19.5:d=0.5','-c:a','libmp3lame','-b:a','128k',str(target)],check=True)
 s['auditionFile']=target.name;s['auditionEdit']='元録音の20秒抜粋、冒頭0.2秒・末尾0.5秒フェード、128kbps MP3。音量正規化なし。'+('開始10:15。' if start else '開始0:00。')
head='''<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>音の検討・収集一覧 — h!ro53</title><style>:root{color-scheme:dark;font-family:system-ui,-apple-system,sans-serif;background:#10191b;color:#e4eded}*{box-sizing:border-box}body{margin:0;line-height:1.85}main{max-width:1100px;padding:30px 20px 80px;margin:auto}h1{font-size:clamp(1.6rem,5vw,2.4rem);line-height:1.5}h2{margin-top:3rem}a{color:#9adbd7;text-underline-offset:4px}nav{display:flex;gap:22px;flex-wrap:wrap}section.card,details{border:1px solid #ffffff25;border-radius:18px;margin:16px 0;padding:18px 22px;background:#ffffff05}summary{cursor:pointer;font-weight:600;padding:4px 0;min-height:44px}h3{margin:0 0 10px}small,.muted{color:#adbdc0}.status{border-left:3px solid #9adbd7;padding-left:14px}audio{display:block;max-width:100%;width:440px;margin:16px 0}p{overflow-wrap:anywhere}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,390px),1fr));gap:16px}.grid .card{margin:0}a:focus-visible,summary:focus-visible{outline:2px solid #9adbd7;outline-offset:5px}@media(max-width:480px){main{padding:20px 14px 60px}section.card,details{padding:15px}}@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto}}</style></head><body><main><p><a href="index.html?skipgc">プレビュー一覧</a></p><h1>音の検討・収集一覧</h1><p>2026年10月18日 · 装置6作品／観測地9作品</p><p class="status">車窓は音搭載・公開済み。残る14作品の音を検討しています。<strong>候補10件のうち、公開HQ MP3を3件取得済み、7件は取得待ちです。</strong>原音WAV／FLACは未取得。まだ各作品へ音を追加した状態ではありません。</p><p>取得待ちの7件は個別ページで出典とライセンスを確認できましたが、クラウドから音声配信先へ接続するとHTTP 403になります。下の出典リンクから候補をご確認いただけます。サインインだけで解消するとは未確認です。</p><nav><a href="#apparatus">装置</a><a href="#observation">観測地</a><a href="#sources">音源10件</a><a href="../../audit/2026-10-18/audio-survey/README.md">台帳（Markdown）</a></nav>'''
parts=[head]
for cat,id in [('装置','apparatus'),('観測地','observation')]:
 parts.append(f'<h2 id="{id}">{cat}</h2>')
 for w in works:
  if w['category']!=cat:continue
  refs=w['sources']
  for s in ss:refs=refs.replace(s['key'],f'<a href="#{s["key"]}">{s["key"]}</a>')
  parts.append(f'<section class="card"><h3>{E(w["title"])}</h3><p>{E(w["direction"])}</p><p>候補：{refs}</p><p class="status">{E(w["status"])}</p></section>')
parts.append('<h2 id="sources">音源候補</h2><p>取得済みの3件は20秒の確認用抜粋を置きました。クリックするまで読み込み・再生しません。音量は録音ごとに異なります。説明・形式の確認済みであり、全候補の試聴採用が完了したという意味ではありません。</p><div class="grid">')
for s in ss:
 parts.append(f'<section class="card" id="{s["key"]}"><h3>{s["key"]} · {E(s["label"])}</h3><p><a href="{E(s["url"])}" target="_blank" rel="noopener">{E(s["title"])}</a><br>{E(s["author"])}</p><p><a href="{E(s["licenseURL"])}">{E(s["license"])}</a> · {E(s["status"])}</p><p>{E(s["note"])}</p>')
 if s['downloaded']:parts.append(f'<audio controls preload="none" aria-label="{E(s["label"])}の20秒抜粋" src="{s["auditionFile"]}"></audio><small>{E(s["auditionEdit"])}音源には上記ライセンスが適用されます。</small>')
 else:parts.append('<p class="muted">音声ファイルは未取得です。出典ページでの確認待ち。</p>')
 parts.append('</section>')
parts.append('''</div><h2>実装の共通方針</h2><p>初期消音。メニュー隣のスピーカーをワンタップで切り替えます。視点が変わるときは滑らかに音を移し、作品の停止・非表示に追従します。Confluenceの円盤は無音、会長室の拍は音にせず、Calorisの真空設定を守ります。</p><details><summary>除外した素材と未選定の音</summary><p>会話や店内放送を含む搬送機、紙切り・紙破り、清掃作業の落ち葉音、室内の窓が鳴る風、合成した室内音は除外。サーボ候補791339は、ページのCC BY表示と説明内の元素材のCC BY-NC条件が一致せず除外しました。</p><p>Sanctumの専用電気設備音、Armillary v2の短い放電、Xerophyteの砂の飛散は未選定です。適合する素材が得られるまで追加しません。</p></details><p class="muted">このページは検討資料です。作品の音搭載完了や全音源の採用を示すものではありません。音源の出典とライセンスは各項目に記載しています。</p></main><script>(function(){'use strict';document.addEventListener('play',function(e){if(e.target.tagName==='AUDIO')document.querySelectorAll('audio').forEach(function(a){if(a!==e.target)a.pause();});},true);document.addEventListener('visibilitychange',function(){if(document.hidden)document.querySelectorAll('audio').forEach(function(a){a.pause();});});})();</script></body></html>''')
(P/'audio-survey.html').write_text(''.join(parts));(A/'sources.json').write_text(json.dumps(ss,ensure_ascii=False,indent=2));(O/'sources.json').write_text(json.dumps(ss,ensure_ascii=False,indent=2));shutil.copy(__file__,A/'build-page.py')
p=P/'index.html';s=p.read_text();marker='<h1'
# Add a dedicated review link immediately after the main title closing tag.
pos=s.index('</h1>')+5;s=s[:pos]+'<p><a href="audio-survey.html">装置・観測地：全15作品の音計画と音源一覧</a></p>'+s[pos:];p.write_text(s)
print('review page and 3 excerpts ready')

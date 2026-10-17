from pathlib import Path
import re,json,html,hashlib,subprocess,shutil
R=Path('/workspace/tbyd-hiro53.github.io');D=Path('/tmp/h53-audio-survey');A=R/'audit/2026-10-18/audio-survey';A.mkdir(parents=True,exist_ok=True);O=Path('/workspace/previews/2026-10-18/audio-survey');O.mkdir(parents=True,exist_ok=True)
lookup={x['url']:x for f in D.glob('*candidates.json') for x in json.loads(f.read_text()) if x.get('hq')}
ids=[('S01','JackRabbott','700254','配管を流れる水','Cortex・Tricore','管内音の比較第一候補。水の粘性と苺乳の見え方の差は編集・試聴で判断する。'),('S02','finneganmilla','554314','金属管からタンクへ流れる水とエンジン','Cortex・Tricore・Core No.37','給水と機械が一体の録音。エンジンが強すぎる区間は不採用。'),('S03','keirofinch','376534','実録の強風','Xerophyte','砂嵐の比較候補。録音地は都市部なので、鳥・街音が入る区間を試聴で除外する。砂漠録音とは表示しない。'),('S04','waweee','517995','山の長い草を抜ける風','Armillary v1/v2・Binary Dusk・保存棟・Earth','草の実録。巨木の葉と同じ音とは断定せず、外気の候補として比較する。'),('S05','humanoide9000','336556','カメラレンズのサーボ','Caloris（接触音案）・書庫の搬送機','実在モーターの短音。音程を下げる等の編集は可能だが、大型機器の実録と偽らない。'),('S06','kyles','451614','大きなほぼ空のホールの換気','保存棟・Earth・書庫・会長室・Sanctum','室内の空気感の比較候補。説明は almost empty。無人・無音声の保証はなく試聴選別が必要。'),('S07','oldestmillennial','538210','チェーン式コンベヤーのフォーリー','書庫下層・Core No.37','自転車チェーン等を録音して組んだ効果音。現場録音ではない。金属音が強すぎれば除外。')]
sources=[]
for sid,author,n,label,works,note in ids:
 u=f'https://freesound.org/people/{author}/sounds/{n}/';raw=lookup[u];page=(D/(n+'.html')).read_text();title=html.unescape(re.search('<title>(.*?)</title>',page,re.S).group(1)).replace('Freesound - ','');clean=html.unescape(re.sub('<[^>]+>',' ',re.sub(r'<script[\s\S]*?</script>','',page)));clean=re.sub(r'\s+',' ',clean);a=clean.find('Log in Join')+11;b=clean.find('Comments',a);lic=raw['licenses'][0];licname='CC0 1.0' if '/zero/' in lic else ('CC BY 3.0' if '/3.0/' in lic else 'CC BY 4.0')
 sources.append(dict(key=sid,id=n,author=author,title=title,label=label,url=u,license=licname,licenseURL=lic,hqURL=raw['hq'][0],descriptionAndOriginalSpecs=clean[a:b],works=works,note=note,status='候補・権利確認済み／音声取得待ち（配信先HTTP 403）',downloaded=False,originalAcquired=False))
for sid,n,author,title,label,file in [('S08','479322','Nox_Sound','Ambiance_River_Flow_Medium_Loop_Stereo.wav','中程度の川・水路のループ','/workspace/previews/2026-10-18/next-audio/479322-hq.mp3'),('S09','197705','peridactyloptrix','Water, small stream','静かな小川','/workspace/previews/2026-10-18/next-audio/197705-hq.mp3'),('S10','165580','Kyster','Near the ocean.wav','海岸の砂丘・低木を抜ける風','/tmp/h53-audio-v4/wind-165580-preview.mp3')]:
 src=Path(file);target=O/(n+'-hq-preview.mp3');shutil.copyfile(src,target);p=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_format','-show_streams','-of','json',str(src)]));st=p['streams'][0];cc='CC BY 4.0' if n=='165580' else 'CC0 1.0';url=f'https://freesound.org/people/{author}/sounds/{n}/';sources.append(dict(key=sid,id=n,author=author,title=title,label=label,url=url,license=cc,licenseURL='https://creativecommons.org/licenses/by/4.0/' if n=='165580' else 'https://creativecommons.org/publicdomain/zero/1.0/',works='Confluence・書庫下層' if n!='165580' else 'Armillaryの遠い外気（比較用）',note='公開HQ MP3を保存・デコード確認済み。採用・聴感の承認は未了。' if n!='165580' else 'Coastalで作者が採用した録音。海の低い遠音を含むため、森林・砂漠へそのまま流用しない。比較用。',status='公開HQ MP3取得済み／原音WAV未取得',downloaded=True,originalAcquired=False,file=target.name,bytes=src.stat().st_size,sha256=hashlib.sha256(src.read_bytes()).hexdigest(),duration=float(p['format']['duration']),sampleRate=int(st['sample_rate']),channels=st['channels']))
works=[
('装置','lacto-cortex','Lacto-Cortex','S01・S02','静かな灌流と、ごく低い駆動音。脳に近い視点で液体を感じ、管の音だけが主役にならない。0.78秒の脈動へ軽く同期。','実録の管内音を取得待ち。'),
('装置','lacto-tricore','Lacto-Tricore','S01・S02','全景は低い循環音。加速視点は水流の密度を増やし、脳視点は静かに戻す。三段を別々の音量で競わせず、同じ流れが加速する音像にする。','実録の管内音を取得待ち。'),
('装置','sanctum','Sanctum','S06（空間の比較枠）','環の連続運動に合う、途切れない静かな低音。火花ごとの銃声や雷鳴は付けない。三条は音高で過剰に色分けしない。','室内基礎音を取得待ち。電気設備の専用録音は未選定。S06を装置音として採用確定とはしない。'),
('装置','armillary','The Armillary v1','S04・S10','山頂の風と草の擦れを主体にし、回転環は静かに保つ。回転数の変化に合わせた大げさな風切り音は入れない。','S10取得済み、山の風S04は取得待ち。'),
('装置','armillary-v2','The Armillary v2','S04・S10','v1と同じ島の外気を共有。浮遊するレンズは無接触なので機械的な擦れを付けない。放電音を入れるなら短く小さく、視覚イベントへ同期。','風候補あり。放電の専用実録は未選定なので実装保留。'),
('装置','lacto-caloris','Lacto-Caloris','S05（任意の接触音案）','真空の外部観測なので、空気を伝わるファン・風切り音は付けない。推奨は静寂。音を加えるなら、接触センサーを通した構造振動として明示し、展開・収縮時だけ小さく鳴らす。','真空設定を優先。接触音モードの採否は未決。サーボ素材は取得待ち。'),
('観測地','binary-dusk','Binary Dusk','S04・S10','高い枝上の外気、近い葉、左奥の海を遠くに置く。日の沈下に効果音を付けない。森の円盤を勝手にモーター音源にしない。','草の風は取得待ち。海岸風は取得済みだが遠景用の比較に限定。'),
('観測地','shoko','書庫 SHOKO','S06・S07・S08・S09','上層は静かな室内の空気。下層でだけ水路と搬送の低い擦れを聞かせ、視点変更時はクロスフェード。説明パネルを開くだけで紙をめくる音は付けない。','流水2素材取得済み。搬送と室内音は取得待ち。'),
('観測地','vacant-seat','The Vacant Seat','S06（比較のみ）','原典の拍は「音ではない」。0.78秒ごとの鼓動やビープへ置き換えない。静寂を主体に、必要ならごく薄い連続した室内音だけを検討する。','室内音取得待ち。無音を保持する案を第一候補とする。'),
('観測地','preservation-hall','The Preservation Hall','S04・S06','室内は薄い空気感、戸の視点で外の植生の風を近づける。人の声、足音、鳥の種類を勝手に足して世界設定を変えない。','室内音と草の風の比較素材を取得待ち。'),
('観測地','confluence','The Confluence','S08・S09','水だけが下にある。円盤の回転は無音を維持する。岸・円盤の真下・床の切れ目で水の距離と方向を変え、静かに連続させる。','流水2素材を取得済み。プレビューへの音実装はまだ行っていない。'),
('観測地','earth-origin-material','Earth Origin Material','S04・S06','室内の静けさと、開口から届く植生の風を分ける。天体参照室は静かに落とし、星や通信要求に電子音・宇宙音を付けない。','室内と外気の比較素材を取得待ち。'),
('観測地','the-changes','The Carriage Window','既存341208','作者合格・本番公開済み。メニュー隣のスピーカーを一度タップして切替。','今回の未搭載作業の対象外。現行を維持。'),
('観測地','core-37','Core No.37','S02・S07','多数の機器を一つの低い機械的な呼吸へまとめる。37号の遅れを音で示す場合も小さく、原典の観測の余白を残す。ナレーション表示中は音量を下げる案。','駆動・搬送の録音を取得待ち。'),
('観測地','xerophyte','Xerophyte','S03','平常時は乾いた弱い風。SANDSTORMの進行で風量と幅を変える。花そのものに機械音は付けない。砂の飛散は別の適合する実録が取れた場合だけ追加。','強風の比較候補は取得待ち。砂の専用素材は未選定。')]
rows=[dict(category=a,slug=b,title=c,sources=d,direction=e,status=f) for a,b,c,d,e,f in works]
# Remove vendor-only AudioContext false positives from the inventory: these are bundled Three.js classes, not instantiated artwork sound.
inventory=json.loads((D/'inventory.json').read_text())
for x in inventory:
 x['audioImplemented']=x['file']=='the-changes.html'
 if x['audioCode'] and not x['audioImplemented']:x['audioCodeFinding']='Only bundled Three.js audio classes; no artwork playback implementation found.'
(A/'inventory.json').write_text(json.dumps(inventory,ensure_ascii=False,indent=2));(A/'sources.json').write_text(json.dumps(sources,ensure_ascii=False,indent=2));(A/'works.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2));(O/'sources.json').write_text(json.dumps(sources,ensure_ascii=False,indent=2))
lines=['# 装置・観測地の音計画と音源台帳','', '2026-10-18（日本時間）。公開一覧の装置6作品・観測地9作品を照合。車窓は搭載・公開済み、未搭載14作品を検討。Coastalはこの2カテゴリ外だが、風+4dB版を別途公開済み。','', '**収集状況：10候補中、3件の公開HQ MP3を取得済み、7件は個別ページで出典・ライセンスを確認済みだが音声配信がHTTP 403のため未取得。原音WAV/FLACは0件。候補の説明とファイル検査は、人による試聴・採用承認の代わりではない。**','', '音はまだ14作品へ実装していない。全作品に無理に音を足さず、Calorisの真空、会長室の非音響的な拍、Confluenceの無音の円盤を維持する。','', '## 作品別','', '|カテゴリ|作品|候補|方向性・現在の状態|','|---|---|---|---|']
for w in rows:lines.append(f"|{w['category']}|{w['title']}|{w['sources']}|{w['direction']} {w['status']}|")
lines+=['','## 音源一覧','', '|ID|音源・作者|ライセンス|取得状況・留意点|','|---|---|---|---|']
for x in sources:lines.append(f"|{x['key']}|[{x['title']}]({x['url']}) — {x['author']}|[{x['license']}]({x['licenseURL']})|{x['status']}。{x['note']}|")
lines+=['','## 実装方針','', '- 初期消音。メニュー隣のスピーカーをワンタップ、斜線の有無で状態を示す。音量を上げる操作とは分ける。','- サイト同梱の短いループをユーザー操作後に読み込む。非表示・作品の停止に追従し、複数タブの同時再生を避ける。','- 視点ごとに音量・定位を滑らかに変更。説明を閉じても音・視点をリセットしない。','- 0.78秒同期は作品の共通時間を参照し、独立setIntervalでずらさない。モノラル端末でも主要音が消えない範囲の定位にする。','- 連続音は30〜80秒程度、必要な短音だけ別バッファ。複数の長尺ファイルを全作品で先読みしない。','- CC BYは作者・個別URL・ライセンス・編集内容を表示。音源のライセンスを作品全体へ誤って適用しない。','', '## 除外した例','', '- Artninja 791339：ページはCC BYだが説明の一部元音源がCC BY-NC。権利条件が一致しないため除外。','- nigelcoop 180001：搬送機の機械音ではなく店内アナウンス。','- tom_woysky 863494：作業者の会話を含みCC BY-NC。','- one_moment 842225：囁き・足音・包装紙が混じる。','- secondbody 614506：合成された室内音。実録優先方針から外す。','- PLukx 256125：砂漠実録だが鳥と低木が明示され、砂嵐の主音には未採用。','- 紙切り・紙破り、落ち葉の清掃音、室内窓のうなりは場面と不一致。','', '## 取得待ちについて','', 'Freesoundの個別ページは一部取得できるが、公開プレビューの配信先は403。従来取得できたURLも同様だったため、サインインだけで解決するとは断定していない。認証情報・Cookieは要求しない。取得待ち7件は一覧の個別ページから確認できる。原音を採用する段階では、ユーザーが指定した通り必要時にサインイン・ファイル受け渡しを相談する。','']
(A/'README.md').write_text('\n'.join(lines));(O/'README.md').write_text('\n'.join(lines))
shutil.copy(__file__,A/'build-catalog.py');shutil.copy(D/'acquire.py',A/'acquire.py')
print(len(rows),'works',len(sources),'sources',sum(x['downloaded'] for x in sources),'downloaded')

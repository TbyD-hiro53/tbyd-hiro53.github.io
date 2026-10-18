from pathlib import Path
import json,shutil,subprocess,re
R=Path('/workspace/tbyd-hiro53.github.io');old=R/'audit/2026-10-18/audio-survey';A=R/'audit/2026-10-18/audio-survey-v2';O=Path('/workspace/previews/2026-10-18/audio-survey');rows=json.loads((O/'acquisition-results.json').read_text());assert len(rows)==7 and all(x['status'].startswith('downloaded') for x in rows)
A.mkdir(exist_ok=True);sources=json.loads((old/'sources.json').read_text());receipts={x['id']:x for x in rows}
for s in sources:
 if s['id'] not in receipts:continue
 info=receipts[s['id']];file=Path(info['file']);probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(file)]));stream=probe['streams'][0]
 s.update(downloaded=True,file=file.name,bytes=info['bytes'],sha256=info['sha256'],duration=float(probe['format']['duration']),sampleRate=int(stream['sample_rate']),channels=stream['channels'],status='公開HQ MP3取得済み／原音WAV・FLAC未取得')
works=json.loads((old/'works.json').read_text())
for w in works:
 w['status']=w['status'].replace('取得待ち','取得済み（採用試聴は未了）').replace('素材を取得済み（採用試聴は未了）','素材は取得済み（採用試聴は未了）')
(A/'sources.json').write_text(json.dumps(sources,ensure_ascii=False,indent=2));(A/'works.json').write_text(json.dumps(works,ensure_ascii=False,indent=2));(A/'acquisition-results.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2))
s=(old/'README.md').read_text().replace('音計画と音源台帳','音計画と音源台帳 v2');s=re.sub(r'\*\*収集状況：.*?\*\*','**収集状況：10候補すべての公開HQ MP3を取得・デコード確認済み。前回HTTP 403で取得できなかった7件も、実行環境の再開後の再試行で取得できた。原音WAV/FLACは未取得。採用の試聴承認と作品への実装は未了。**',s)
s=s.replace('候補・権利確認済み／音声取得待ち（配信先HTTP 403）','公開HQ MP3取得済み／原音WAV・FLAC未取得').replace('取得待ち','取得済み（採用試聴は未了）')
a=s.index('## 取得済み（採用試聴は未了）について');b=s.index('## 検証と保存',a);s=s[:a]+'## 再取得の結果\n\n環境再開後に既存の公開プレビューURLを再試行し、7件を取得できた。サインインや認証情報は使用していない。元の個別ページ・ライセンス確認は前版の記録を継承。acquisition-results.jsonに取得ファイルとSHA256を記録した。\n\n'+s[b:];s=s[:s.index('## 検証と保存')]+'## 検証と保存\n\n全10音源のffprobe解析を確認。全候補の確認用抜粋を一覧に用意。ブラウザと保存版の確認結果は実施後に追記する。\n';(A/'README.md').write_text(s)
# Reuse the established review generator, with the new inventory and accurate clip durations.
s=(old/'build-page.py').read_text().replace("A=R/'audit/2026-10-18/audio-survey'","A=R/'audit/2026-10-18/audio-survey-v2'")
s=s.replace("start=615 if s['id']=='165580' else 0", "start=615 if s['id']=='165580' else 0;duration=min(20,s['duration']-start);fade=max(0,duration-.5)")
s=s.replace("'-t','20','-af','afade=t=in:d=0.2,afade=t=out:st=19.5:d=0.5'", "'-t',str(duration),'-af',f'afade=t=in:d=0.2,afade=t=out:st={fade}:d=0.5'")
s=s.replace("subprocess.run(['ffmpeg'", "if not target.exists():subprocess.run(['ffmpeg'")
s=s.replace(";shutil.copy(__file__,A/'build-page.py')",'').replace('の20秒抜粋','の最大20秒抜粋')
s=s.replace('元録音の20秒抜粋','元録音の最大20秒抜粋').replace('公開HQ MP3を3件取得済み、7件は取得待ちです。','公開HQ MP3を全10件取得済みです。').replace('取得済みの3件は20秒の確認用抜粋','全10件に最大20秒の確認用抜粋')
s=s.replace('取得待ちの7件は個別ページで出典とライセンスを確認できましたが、クラウドから音声配信先へ接続するとHTTP 403になります。下の出典リンクから候補をご確認いただけます。サインインだけで解消するとは未確認です。','前回取得できなかった7件も、環境再開後の再試行で取得できました。すべてサインイン不要の公開プレビューです。原音の取得や、作品への採用・実装完了を示すものではありません。')
s=s.replace('../../audit/2026-10-18/audio-survey/README.md','../../audit/2026-10-18/audio-survey-v2/README.md').replace("(P/'audio-survey.html')","(P/'audio-survey-v2.html')")
start=s.index("p=P/'index.html'");s=s[:start]+"p=P/'index.html';s=p.read_text().replace('href=\"audio-survey.html\"','href=\"audio-survey-v2.html\"');p.write_text(s)\nprint('review v2 ready with 10 acquired sources')\n"
(A/'build-page.py').write_text(s);subprocess.run(['python',str(A/'build-page.py')],check=True)
shutil.copy(__file__,A/'update-audio-survey.py')
print('AUDIO COLLECTION COMPLETE')

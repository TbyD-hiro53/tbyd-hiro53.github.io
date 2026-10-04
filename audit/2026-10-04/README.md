# Web UI audit — 2026-10-04

公開作品のUI・読込競合・描画解除の修正と検証を記録する。Three.js r128、作品の造形・時系列・色管理、正本文、既存材質・形状資産を維持する。本番反映は未実施である。

## 修正単位

1. `c27a13b`：入口の明暗表示・目次構造・hash復帰、読書UIの更新と操作名、小説6作の原文保護。EN UIでも『白』篇04の「戻る」を維持する。
2. `4097a17`：共有メニューの開→閉→開、旧作のpointer取消・残指再基準化、離脱中の描画解除、障害案内、Cellwafer favicon。
3. `8f9b272`：Confluence現行/v2–4の古い進捗・失敗が最新選択を上書きしない。Tricoreの最後の選択、重複読込共有、部分失敗時texture解放。
4. `cfeb802`：Armillary/Sanctumのcontext loss案内、Chrome系の写真・再読込導線、Coastal説明時の障害バナー抑制とJA/EN、写真・非表示・離脱時の単一描画予約。
5. `5eeacda`：場面ビューアの読書本文focus/Space/スクロール位置、4作品の停止復帰、暫定書庫44px操作寸法。

全hash・変更ファイルは `change-units.json`、43ページ台帳は `page-ledger.csv`、最終件数は `summary.json` に記録する。大量の画像・初回ログはこの公開差分へ含めない。

## 実行済み検証

- 静的：1400参照、496依存、227 JavaScript構文検査、確定欠落0。
- Chromium / SwiftShader：43ページ×390×844 / 844×390 = 86条件。最終捕捉例外・HTTP失敗・consoleエラー・横溢れ0。初回撮影timeout4件は作品の停止状態の実描画で補完した。
- Linux WebKitGTK 2.52.6：43ページ86条件でURLと読み込み完了を照合。捕捉例外・resource error・ローカルHTTP失敗・横溢れ0。小説6作の原文一致、16→17.5→19px後のUI維持、目次3往復、JA/EN障害表示8件、主要3D ready4件を確認した。初回誤計測は合格件数から除外した。
- Chromium操作回帰：Modern 3Dの7ページ43機能、JA/EN障害表示8件、Viewers6ページと書庫7場面/高速選択、4作品RAF停止復帰、旧作26ページ、gesture VM14件、Confluence4版の競合、Tricoreの実WebGL/アセット遅延選択・読込共有、小説6作の目次・字体・保存位置を確認した。

## 検証条件と未実施範囲

全ページ初回検査はRAF callbackを250ms遅延した計装である。ソフトウェアGPUの描画時間は実機性能を示さない。旧作非読書20件の操作fixtureではThree.js描画をbypassし、初回実描画とは分けて検査した。Canvas2D、Core37/Tricoreのraw WebGLと追加Tricore実アセット検査は実描画である。合成pagehide/pageshow/visibilitychangeはhandlerの検査であり、実BFCacheの検査ではない。

実機iPhone/Safari、ハードウェアの連続ピンチ/二指→一指/指外れ、OS画面ロック・別アプリ復帰・全画面、VoiceOver、低速回線、GPUメモリ・発熱、保存ZIP展開、全作品の全周期・長時間鑑賞は未実施である。Linux WebKitをiOS Safariの代替と扱わない。

CoastalのClose→Backは、閉じ途中のinert/入力遮断と閉鎖後500/750msの一回遷移を確認した。閉じ途中の入力遮断を残留不具合と断定していない。Core37初期pointer反復とConfluence v4の実入力高速反復はtimeoutを含み、追加DOM fixtureの合格と同一視しない。

## 再実行

リポジトリのルートでNode.jsとPython3を用いて実行する。

```sh
python3 audit/2026-10-04/static/check_static.py
node audit/2026-10-04/legacy/gesture-regression.cjs
node audit/2026-10-04/legacy/confluence-race-regression.cjs --assert
node audit/2026-10-04/legacy/tricore-race-regression.cjs --assert
```

静的検査の出力は生成物としてignoreする。VM回帰は実ソースのhandlerと制御を実行し、端末の実入力を検証するものではない。

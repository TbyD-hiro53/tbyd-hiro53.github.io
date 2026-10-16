# 2026-10-16 — 承認済み8作品の通常公開

作者の「全て合格」「公開への反映」の指示により、完成プレビュー8作品を既存の通常URLへ反映する。作品のアプリ・素材は最終承認プレビューと同じ。プレビュー専用のbase/noindex/戻り先を通常ページへ持ち込まない。

|通常URL|公開する版|
|---|---|
|lacto-cortex.html|app c5、UI/観測 c6|
|lacto-caloris.html|app c16|
|coastal-glass.html|観測 w3|
|sanctum.html|app w12|
|armillary.html|v1 app w2|
|armillary-v2.html|v2 app w2|
|binary-dusk.html|描画 w4、liquid app v2|
|vacant-seat.html|design v7、liquid app v3|

共有UIは `h53-chrome-v2-20261016.js`。承認済みプレビューの共有UIとバイト単位で同一。旧v1を保存し、今回の8作品だけ新ファイルへ切り替える。通常の一覧は既存URLのまま、Chrome Liturgyの公開終了も維持する。

Confluenceの再構築は案のみで、今回の8作品に含めない。Coastal Glassの灯台は、最終プレビューと同じ固定光（回転未実装）。小説・正典本文は変更しない。

## 公開前の検証と保存

- プレビュー専用のラッパーを除外して、8作品の候補HTMLが最終プレビューと一致することを照合。
- JavaScript構文と差分の空白エラーを検査。
- コミットから `h53-public-site-20261016.zip` を作成。全依存物・旧版・本記録を含む。
- ZIPのCRCを検査して別ディレクトリへ展開し、HTTPで8作品の通常URLを開く。読み込み完了、現行スクリプト、描画、操作、戻り先、横はみ出し、実行時エラー・HTTP欠落を確認する。
- 結果はZIPと同じ保存先の `publication-validation.json` に記録する。保存先は `/workspace/previews/2026-10-16/`。
- 起動方法：展開フォルダで `python3 -m http.server 8011` を実行し、`http://localhost:8011/index.html?skipgc` を開く。HTMLのfile起動ではない。

ブラウザ検証はChromium/SwiftShader。iPhone/Safari実機の計測やGitHub Pages外部配信確認を代替するものではない。公開直前にorigin/mainを再取得し、通常のfast-forwardで反映する。

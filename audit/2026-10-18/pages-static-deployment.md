# 静的サイトとしてのPages配信

Earth v9のコミットf753fc0に対する [Pages実行39055642783](https://github.com/TbyD-hiro53/tbyd-hiro53.github.io/actions/runs/39055642783) が失敗した。公開Actionsページの注記で、Jekyllのgithub-metadataプラグインがGitHub自身のAPIから500を受け、CANON_TEXT.mdのレイアウト生成時に停止したことを確認。作品のJavaScriptや新しい画像の実行エラーではない。

追跡ファイルにはJekyll設定、テンプレート、SCSS/Sass、YAML front matterのlayout/permalink、Liquidのsite参照、生成されるassets/css/style.cssへの参照がない。鑑賞ページは完成済みのHTML・CSS・JavaScript・画像として保存されている。

サイトルートへ.nojekyllを追加し、GitHub PagesでJekyllの変換を省く。作品・プレビューのURL、ライブラリ、画像、UIは変更しない。Markdownの監査資料やCANONは生ファイルとして配信され、Jekyllテーマ付きHTMLへの自動変換は行わない。これらの生成HTMLに鑑賞ページが依存していないことは上記の参照検索で確認した。

Earth v9の保存ZIP（source 6ead836）はローカルHTTPサーバーで検証済みの描画依存一式で、Jekyll変換を起動条件としていない。本設定はPagesの配信処理をその保存方法に揃えるもので、ベイク画像や作品の変更ではない。

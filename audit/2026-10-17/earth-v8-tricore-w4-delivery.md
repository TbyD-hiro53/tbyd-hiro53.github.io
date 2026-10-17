# Earth v8 / Tricore w4 保存・動作確認

素材のソース: 845e2314e6adf5610ab458de1b78ac57683f7874
保存ZIP: /workspace/previews/2026-10-17/earth-v8/h53-earth-v8-tricore-w4-preview.zip
SHA256: e6dd8ce71c96bab8e7f5dde09f40954483045244773a41bcdb0193839b9585e3
サイズ: 569585149 bytes / 1135 entries、CRC正常。

全サイト依存物と編集用のBlender室内・森シーン、森の原画・深度、再制作手順を同梱。別ディレクトリへ展開し、HTTP 8043からEarthの全4視点・森・端末タップ、Tricoreの全3視点・配管説明・一時停止を確認。JS・HTTP・GLエラーなし。

追加した停止テストの初回は説明を閉じる途中にDOM clickを送って失敗した。検証を、説明の閉じる処理完了を待ち、実際にメニューと停止ボタンをタップする手順へ修正して再確認し、停止中の粒子ステップ不変・有限値を確認した。作品の停止処理は変更していない。修正後検証スクリプトと結果はvalidation/earth-v8-tricore-w4-archive*。

プレビューのみ反映。通常公開ページは保持。公開サーバーへのHTTPSは環境のプロキシが403を返し配信完了を直接検証できない。ブラウザ実機Safariの性能は未測定。

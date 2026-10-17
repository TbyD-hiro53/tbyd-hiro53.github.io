# 未公開改修 — 2026-10-18（日本時間）

| 項目 | 状況 | 残作業 |
| --- | --- | --- |
| Earth Origin Material | v9画質を作者承認。v10で閉じる記号と下部クレジットの干渉を修正し、本番HTMLへ切替・独立保存一式も検証 | 配信確認 |
| Lacto Tricore | w5作者承認。本番HTMLへ切替、3視点・管タップ・停止を独立保存一式から検証 | 配信確認 |
| The Confluence | v10の道・根・水・UIはプレビュー済み。新方式の小規模な静的比較ベイクを実施。根・道の硬さが残るため造形と合成の実装を継続 | 岸の道の造形推敲、Cycles背景・反射と動的水面の比較試作、残る2視点 |
| Coastal Glass 回転灯 | 事前計算方針は承認。回転灯未実装 | 遮蔽データ、回転光、負荷・視覚検証 |
| 環境音・効果音 | Freesoundの候補3件の形式・CC0条件を確認。公開試聴MP3を2件取得。聴感での選定と組み込みは未実施 | 原音取得・試聴、車窓・Coastal試作。詳細はaudio-shortlist.md |
| 共通説明UI v2 | 25作品をプレビューで検証済み、4作品のみ本番反映 | 残る21作品への本番反映 |

Freesoundは初めプロキシ403で停止していたが、再確認時にはログイン・検索・個別ページがHTTP 200で取得でき、公開HQ MP3も取得できた。MacのSafari操作ツールはなく、Safariの認証情報はクラウドへ共有されない。作者の依頼でFreesoundログインページを開き、Safari専用のx-safari-httpsリンクを使ってSafariへ引き渡した。作者から「Safariで開いた」と確認を得た。Safariの起動は完了。画面操作・ダウンロード用接続や認証状態の共有ができたことは意味しない。

共通UI未公開21件: armillary, armillary-v2, binary-dusk, cellwafer, coastal-glass, code-rain, code-rain-frozen, code-rain-utterance, confluence, cyberwafer, earth-origin-material, empyrean-sigil, empyrean-sigil-3d, lacto-cortex, lacto-tricore, late-core, preservation-hall, residual-index-53, sanctum, sigil-fusion, vacant-seat。

Caloris、The Carriage Window、Core No.37、Xerophyteの直近承認済み改修は本番反映済み。上記21件のうちConfluence・Earth・Tricoreを除く作品は、以前承認された作品改修自体は公開済みで、その後追加した共通UI差分が未公開。

通信許可の下書きへ freesound.org、cdn.freesound.org、tbyd-hiro53.github.io を追加して保存した。ツールの応答はrequires_publish:trueで、ツール自身による適用・公開は行っていない。その後に実接続が成功した事実と、設定公開の操作を実施したかは区別する。既存パッケージ管理用プリセットは維持。Chromeの標準版向け起動リンク google-chrome://https://freesound.org/home/login/ も送信したが、こちらは起動確認をまだ得ていない。

作者より、サインインが必要になった時点で再依頼するよう指定。続いて、表の残作業を順に消化する指示を受けた。進行順はEarth → Tricore → Confluence → Coastal回転灯 → 音 → 共通説明UI。未承認の作品改修は操作可能なプレビューで確認できる状態まで完成させ、公開済みの作品や承認済み旧版を維持する。

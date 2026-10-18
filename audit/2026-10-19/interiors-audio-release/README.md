# Earth / 保存棟 / SHOKO 音声v3の公開反映

2026-10-19。作者の「他は合格。公開へ」に基づき、改修指摘中のCortex/Tricore・Armillary・Sanctumを除き、承認済み3作品の音を既存公開ページへ反映する。

## 公開HTMLの変更

- Earth Origin Material：`interiors-audio-v3-20261019.js` を追加。公開中の森林v11・室内v9・アプリv10、メタデータ・canonical・戻る先を維持。
- The Preservation Hall：同じ音JSを追加。公開中v7の描画、メタデータ・canonical・戻る先を維持。
- SHOKO：`shoko-audio-v3-20261019.js` を追加。音ボタンのLiquid Glass登録に必要な既存ホスト参照を公開する承認済み `shoko-interiors-audio-v1-20261019-app.js` へ切替。このアプリの差分はホスト参照、音量/出典のキーボード操作対象追加、視点URL更新でパスとクエリーを維持する処理の3点のみ。描画・景観・下層の運動はそのまま。
- 公開HTMLにプレビューのbase/noindexやプレビュー戻り先は持ち込まない。サイト全体のindex・ステータス・音源一覧は親作業で管理する。

## 音源・保存

音は作者確認済みv3と同一。近接ファン478643左135–165秒、樹木の風523389の85–115秒。SHOKOの下層水2層と搬送音は既存の承認済み混合を維持。出典・ライセンス・処理・元録音hashは `audit/2026-10-19/earth-audio-v3/` と音メニューに保存。

既存プレビュー一式ZIPを基に、公開ルート3HTML・OG画像・公開保存用README/目次と監査記録を追加した新しいZIPを作る。旧ZIPを上書きしない。ZIPには再現に必要な描画・UI・音・元HQ MP3を含み、MANIFEST.jsonのSHA256とZIP CRCを確認後、別ディレクトリへ展開する。保存用indexは3作品へのローカル目次であり、サイト本来の公開indexを変更するものではない。

HTTPサーバーを起動して `/earth-origin-material.html?skipgc`、`/preservation-hall.html?skipgc`、`/shoko.html?skipgc#lower` を開く。file://直接再生ではない。独立展開の動作検証は `independent-results.json`、保存ZIPの場所/hashは `archive-info.json`。

既にv3プレビューで全16視点・各音層・停止/復帰・音量・別タブ排他を確認済み。本反映では公開ルートの意味（canonical、indexへの戻り先、base/noindexなし）と代表視点の表示・再生、SHOKOの視点切替で公開パスが維持されることを重点確認する。Chromium software WebGLによる検証であり、実機Safari/iPhoneを確認したとするものではない。

### QA操作の補足

メニュー内へフォーカスを移さず出典テキストだけを読む検査では、EscapeはEarthの面内keydownに届かない。メニューが開いたまま外側のspeakerを押すとoutside-dismissの正常なクリック消費で音は切り替わらない。このため公開反映検査では、Earth/保存棟はメニューボタンで明示的に閉じ、SHOKOは外側の操作がinertになるモーダル仕様に従いEscapeで閉じ、閉じ入力の抑制時間を待ってからspeakerを押す。音ボタン/面の製品実装を回避目的で書き換えてはいない。

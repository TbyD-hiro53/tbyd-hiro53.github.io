# Coastal Glass — 公開版 v1

2026-09-18 作者承認の observation v3 を公開する。作品名・副題・設定・19件の観測記録・景観・操作は承認済み版を維持する。

- 入口: `coastal-glass.html`。依存物はすべてルート直下、同一サイト内。
- Three.js r128 / IIFE。分割構成は `TECHNICAL_POLICY.md` に従う。
- `coastal-glass-observation-v3-*` が観測説明・対象判定・屈折UI。`coastal-glass-rt-v2-*` が承認済み形状・モーション・環境素材。
- 正常時はWebGLで主役と海を描画する。写真・連番・動画への置換ではない。固定背景は事前計算の光と深度を用いる。
- 二場面は「沈み途中」「夜間」。アニメーション時刻とは独立して切り替える。
- ガラスUIは当該フレームの景観を屈折合成するWeb近似。Apple純正描画ではない。

## 作品固有の色管理と描画条件

作者が了承した出力を保つため、`LinearEncoding` / `toneMapped:false` を維持する。シーンリニアRec.709のHDRを、最終合成のBlender AgX 33³ Medium Low Contrast LUTで一度だけ表示用sRGBへ変換する。旧一般規約のsRGBEncoding / ACESFilmicToneMappingを追加で適用しない。これは当作品の承認済み色管理であり、他作品の設定変更を意味しない。

`.bin.gz` はコード側の `DecompressionStream('gzip')` で展開する。サーバーによるContent-Encodingの追加で二重展開しないこと。カメラ別背景・深度・ID・反射と4カメラを一組として扱う。描画負荷は承認済みの画素数上限で制御し、一律にDPR設定を変更しない。

元の主役サイズ、モーション、最上部円盤下面の存在境界、断面と対象判定を保持する。円盤初出現時の既知の色変化は未解決のまま受け継ぐ。

## 公開処理

作品のHTML headにcanonical・OG・SNS・著作権・既定の計数断片を追加した。戻る操作と可視の著作権は既存UIを使い、二重注入しない。`?skipgc` は同一オリジンのlocalStorageへ検証除外を保存する。計数以外に第三者依存はない。

ポータルは `CANON_TEXT.md` を正本に `python3 build_frag.py --coastal-glass-only` で生成する。ASSET 23、CHROME LITURGYの直後。既存作品のIDは変更しない。

## 保存・再開

HTMLのfile://直接起動ではなく、フォルダをHTTPサーバーで配信し `coastal-glass.html?skipgc` を開く。保存一式には同一サイトの依存物・構成一覧・起動方法を同梱する。Blender原本・完成8K画像を公開用リポジトリへ含めない。

© 2026 h!ro53 / deus ex machina. 鑑賞を許可する。著作権は `LICENSE.md` に従う。Three.jsは同梱ファイルに示すMIT Licenseを適用する。

# Earth v6 外景の再制作

Blender 4.3.2 / Cycles CPU、Python 3、numpy、Pillow、Playwright Chromium、oidn 0.2.1（同梱 OIDN 1.4.3）。実制作環境の Blender は内蔵 OIDN 非対応のため、色画像を後処理でデノイズした。ランタイムに Blender / Python は不要。

1. リポジトリを HTTP で起動する（例: `python -m http.server 8030`）。`EO_SOURCE_URL` は v5/v6 の Earth プレビューURL。既存の基礎森と v5 refine の下生えをエクスポートする。v6の描画用スクリーン面は除外する。
2. `EO_BAKE_DIR` に作業ディレクトリを指定して作成。`export.py` で幾何・UV・マテリアル・配置を `forest.json` に保存。
3. `blender -b -t 4 -P bake.py` : シーンを構築し、開口視点の全天球3072×1536 / 64サンプルと放射距離を焼く。
4. `blender -b -t 4 -P resume.py` : 通路・参照室の全天球2048×1024 / 40サンプルを焼く。
5. `blender -b -t 4 -P hero.py` : 開口正面96度の1536×2048 / 48サンプルを焼く。固定眼点は開口視点と同一。
6. `denoise.py` に `forest-0.png forest-2.png forest-3.png hero.png` の各実パスを渡す。sRGBをlinear RGBへ変換し、OIDN RTの色のみでデノイズ、sRGBへ戻す。実際の完成素材はこの後処理を通したもの。
7. `EO_REPO_DIR` に出力先リポジトリを指定し `package.py 0 2 3 hero`。距離に基づく薄い霧を色へ合成してからJPEG化。開口全天球は1024×512へ縮小し、正面の細部を別画像に配分する。距離は0〜512mの16bit値をPNGのR/Gへ保存。

`EO_BAKE_DIR` の既定は `/tmp/earth-v6`、`EO_REPO_DIR` の既定は実行時のディレクトリ。ライブラリ検索パスが必要な環境では oidn パッケージの `lib.linux.x64` を `LD_LIBRARY_PATH` に追加する。

`earth-forest-v6-hero-packed.blend` は画像を内包する編集可能なシーン。独立プレビューZIPに同梱し、サイトへの読み込みは行わない。小説本文と作品内の文章は変更しない。樹種・照明・下生えの具体的造形は美術上の補完であり、原典の詳細な植生図とは扱わない。

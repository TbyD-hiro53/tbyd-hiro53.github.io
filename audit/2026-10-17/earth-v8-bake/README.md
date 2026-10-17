# Earth v8 再制作

Blender 4.3.2、Python/Pillow/NumPy、OIDN 1.4.3（この環境ではPythonラッパーoidn 0.2.1）を使用。v7の静的室内とv6の森の原本を継承。スクリプトは既存作品の色や形状を作り直さず、画素配分・ノイズ除去を改修する。

- `EO_DETAIL_DIR`: 作業出力先（既定 `/tmp/earth-v8`）。
- `EO_REPO_DIR`: 出力JPEGを置くサイトのディレクトリ。
- `EO_INTERIOR_SOURCE`: ZIP内 `blender-source/interior.blend`。
- `EO_FOREST_SOURCE`: ZIP内 `blender-source/earth-forest-v6.blend`。
- `EO_FOREST_DEPTH`: ZIP内 `blender-source/forest-hero-depth.npy`。

`blender -b -t 4 --python-exit-code 1 --python render.py` で4方向をレンダリングする。既存の同名PNGがある方向は省略するので、再計算時はその方向の出力一式を別の場所へ移す。画像、法線、アルベドを同じカメラから書き出す。処理失敗は `--python-exit-code 1` で検出する。

各方向について `blender -b -t 1 --python-exit-code 1 --python extract-guides.py -- 0`（0を0〜3へ変更）を実行し、その後 `python package.py 0 1 2 3` でガイド付きOIDN処理とJPEG化を行う。OIDNのPythonモジュールと共有ライブラリのあるディレクトリを必要に応じてPYTHONPATH/LD_LIBRARY_PATHへ指定する。

森は `forest-guides.py` で元カメラのアルベド・法線を4サンプルで取り出す。元の48サンプルの色画像はZIP内 `blender-source/forest-hero.png` を使う。これを作業先 `detail-4.png` に置き、forest-normal/albedo-0001.exrをdetail-4-normal/albedo-0001.exrとして参照できるようにする。`extract-guides.py -- 4` と `package.py 4` で再処理する。ノイズ除去後に元の深度から同じ霧を合成する。

ブラウザ側は新規v8 interior/forestスクリプトだけを差し替える。アプリ、幾何分類、元の全球画像、森の深度、動く天体・表示・ガラスはv7/v6を継承。`file://`ではなくHTTPサーバーで起動する。

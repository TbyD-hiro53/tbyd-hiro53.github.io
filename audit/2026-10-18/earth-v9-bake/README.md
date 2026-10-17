# Earth v9 再ベイク

Blender 4.3.2 / Cycles CPU、Python + Pillow + NumPy、外部OIDN 1.4.3（Python oidn 0.2.1）。Blender本体のOIDNはこの環境では使用不可。

環境変数: `EO_BAKE_DIR`（作業出力先）、`EO_REPO_DIR`（JPEG/PNGを書き出すサイトルート）、`EO_INTERIOR_SOURCE`（保存ZIP内のblender-source/interior-4k.blend）、`EO_FOREST_SOURCE`（同forest-4k.blend）。既存PNGを検出すると省略するので、新規出力先を使う。

1. `blender -b -t 4 --python-exit-code 1 --python render.py -- interior`
2. `blender -b -t 4 --python-exit-code 1 --python render.py -- forest`
3. 0,1,2,3,4について `blender -b -t 1 --python-exit-code 1 --python extract-guides.py -- 0` を実行（末尾番号を変える）。
4. OIDNのモジュールと共有ライブラリをPython/ライブラリ検索パスへ設定し、`python package.py 0 1 2 3 4`。

室内は4096×4096、82度、4つの眼点。森の開口用は3072×4096、水平72度で同じ眼点から再描画。Cyclesは16 samples、adaptive min 4 / threshold .045、film filter width .75。画素数増加と狭い再構成フィルタで輪郭を取り直し、法線・アルベド付きOIDNと2%の原信号でノイズを抑える。JPEG品質97・色差間引きなし。既存画像の拡大、輪郭強調、AI補完は行わない。

森の透明な背景は霧の色へ合成してからノイズを除去。新しい同眼点の深度を取得し、同じ霧と円盤の前後関係へ使う。新しい投影の画角とブラウザ側のheroTanは必ず一致させる。世界・形状・材質・露出は既存シーンを継承する。

新規v9のapp/interior/forestをプレビューから読み込む。室内の4K全球画像など継承資産もZIPに同梱する。全球背景自体を8Kに変更したものではなく、主要方向を高精細な透視画像で補う構成。

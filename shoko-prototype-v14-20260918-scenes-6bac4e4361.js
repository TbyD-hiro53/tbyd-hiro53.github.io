window.SHOKO_CONFIG = {
  "build": "v14-web-20260918-r1",
  "assetVersion": "v14-shared-entrance-bd-assets-v12-other-four",
  "title": "書庫",
  "scenes": [
    {
      "id": "exterior",
      "name": "外皮",
      "alt": "茶色い幹の厚い縦の裂け目から、白い木肌の通り抜け部分を経て受入へ続く。",
      "sourceVersion": "v14",
      "images": {
        "portrait": {
          "src": "shoko-prototype-v14-20260918-01_exterior-portrait-457891888c.jpg",
          "width": 1080,
          "height": 1920
        },
        "landscape": {
          "src": "shoko-prototype-v14-20260918-01_exterior-landscape-006b862db0.jpg",
          "width": 1920,
          "height": 1080
        }
      },
      "hotspots": [
        {
          "id": "entrance",
          "title": "入口",
          "body": "茶色い樹皮の割れ目が縦に広がっている。厚い木の内側へ、白い床が続く。",
          "source": "篇08・09／作者の外皮色指定",
          "rect": {
            "portrait": [
              0.46,
              0.06,
              0.17,
              0.67
            ],
            "landscape": [
              0.468,
              0.05,
              0.09,
              0.81
            ]
          },
          "anchor": {
            "portrait": [
              0.53,
              0.65
            ],
            "landscape": [
              0.51,
              0.69
            ]
          }
        },
        {
          "id": "root",
          "title": "根",
          "body": "太い根が幹から広がり、地面へ沈んでいる。道はその根のあいだを通る。",
          "source": "篇08",
          "rect": {
            "portrait": [
              0.25,
              0.735,
              0.265,
              0.115
            ],
            "landscape": [
              0.36,
              0.86,
              0.13,
              0.12
            ]
          },
          "anchor": {
            "portrait": [
              0.43,
              0.77
            ],
            "landscape": [
              0.47,
              0.91
            ]
          }
        }
      ]
    },
    {
      "id": "intake",
      "name": "受入",
      "alt": "外の開口と、白い空間の奥にある受入面。",
      "sourceVersion": "v14",
      "images": {
        "portrait": {
          "src": "shoko-prototype-v14-20260918-02_intake-portrait-3500c4f78f.jpg",
          "width": 1080,
          "height": 1920
        },
        "landscape": {
          "src": "shoko-prototype-v14-20260918-02_intake-landscape-a0049c25df.jpg",
          "width": 1920,
          "height": 1080
        }
      },
      "hotspots": [
        {
          "id": "intake",
          "title": "受入面",
          "body": "腰の高さに、板のような面がある。下に窪みがあり、その横には票が出る小さな開きがある。",
          "source": "篇09",
          "rect": {
            "portrait": [
              0.46,
              0.618,
              0.21,
              0.19
            ],
            "landscape": [
              0.478,
              0.68,
              0.105,
              0.29
            ]
          },
          "anchor": {
            "portrait": [
              0.56,
              0.66
            ],
            "landscape": [
              0.531,
              0.735
            ]
          }
        },
        {
          "id": "lift",
          "title": "昇降",
          "body": "受入の奥に、壁が縦に開く場所がある。白い床が、その先へ続いている。",
          "source": "篇09・10",
          "rect": {
            "portrait": [
              0.799,
              0.527,
              0.098,
              0.105
            ],
            "landscape": [
              0.638,
              0.542,
              0.047,
              0.152
            ]
          },
          "anchor": {
            "portrait": [
              0.847,
              0.575
            ],
            "landscape": [
              0.662,
              0.62
            ]
          }
        }
      ]
    },
    {
      "id": "room",
      "name": "居室",
      "alt": "等寸の二台と、中央の空床。その奥に卓と通路。",
      "sourceVersion": "v12",
      "images": {
        "portrait": {
          "src": "shoko-prototype-v12-20260917-03_room-portrait-a91d6ccba4.jpg",
          "width": 1080,
          "height": 1920
        },
        "landscape": {
          "src": "shoko-prototype-v12-20260917-03_room-landscape-3e4162fe55.jpg",
          "width": 1920,
          "height": 1080
        }
      },
      "hotspots": [
        {
          "id": "beds",
          "title": "二台",
          "body": "左右の壁ぎわに、高さも長さも同じ台がある。薄い敷物が載り、真ん中の床は空いている。",
          "source": "篇11",
          "rect": {
            "portrait": [
              0.015,
              0.632,
              0.418,
              0.25
            ],
            "landscape": [
              0.162,
              0.672,
              0.308,
              0.3
            ]
          }
        },
        {
          "id": "table",
          "title": "卓",
          "body": "奥の壁の下に、卓が一つある。その面に、紙が二枚置かれている。",
          "source": "篇11",
          "rect": {
            "portrait": [
              0.245,
              0.554,
              0.27,
              0.09
            ],
            "landscape": [
              0.372,
              0.591,
              0.14,
              0.114
            ]
          },
          "anchor": {
            "portrait": [
              0.38,
              0.571
            ],
            "landscape": [
              0.43,
              0.608
            ]
          }
        }
      ]
    },
    {
      "id": "reading",
      "name": "閲覧層",
      "alt": "人の尺度の架が、高く立ち上がる白木の内側へ重なる。",
      "sourceVersion": "v12",
      "images": {
        "portrait": {
          "src": "shoko-prototype-v12-20260917-04_reading-portrait-4da3fa64dc.jpg",
          "width": 1080,
          "height": 1920
        },
        "landscape": {
          "src": "shoko-prototype-v12-20260917-04_reading-landscape-b06c055c1b.jpg",
          "width": 1920,
          "height": 1080
        }
      },
      "hotspots": [
        {
          "id": "bindings",
          "title": "綴じ",
          "body": "厚いものと薄いものがあり、背の高さも揃っていない。違う形の綴じが、棚の上に並べられている。",
          "source": "篇12",
          "rect": {
            "portrait": [
              0.015,
              0.552,
              0.219,
              0.219
            ],
            "landscape": [
              0.058,
              0.55,
              0.228,
              0.3
            ]
          }
        },
        {
          "id": "shelves",
          "title": "架",
          "body": "架のあいだに通路が続く。並びの終わりは、奥の暗さに入って見えなくなる。",
          "source": "篇12",
          "rect": {
            "portrait": [
              0.69,
              0.545,
              0.28,
              0.27
            ],
            "landscape": [
              0.655,
              0.467,
              0.3,
              0.398
            ]
          }
        }
      ]
    },
    {
      "id": "lower",
      "name": "下層",
      "alt": "乾いた通路、水路、その上を奥へ伸びる搬送桁。",
      "sourceVersion": "v12",
      "images": {
        "portrait": {
          "src": "shoko-prototype-v12-20260917-05_lower-portrait-2e024e9a8d.jpg",
          "width": 1080,
          "height": 1920
        },
        "landscape": {
          "src": "shoko-prototype-v12-20260917-05_lower-landscape-239e8ee90a.jpg",
          "width": 1920,
          "height": 1080
        }
      },
      "hotspots": [
        {
          "id": "girder",
          "title": "桁",
          "body": "水路の上に桁が渡されている。四角い荷が一つずつ、水と同じ向きへ運ばれていく。",
          "source": "篇15",
          "rect": {
            "portrait": [
              0.63,
              0.386,
              0.35,
              0.1
            ],
            "landscape": [
              0.61,
              0.28,
              0.25,
              0.115
            ]
          }
        },
        {
          "id": "water",
          "title": "水路",
          "body": "乾いた通路の脇を水が流れる。低い青緑の光が、水面に映っている。",
          "source": "篇14・15",
          "rect": {
            "portrait": [
              0.67,
              0.68,
              0.29,
              0.175
            ],
            "landscape": [
              0.62,
              0.64,
              0.27,
              0.25
            ]
          },
          "anchor": {
            "portrait": [
              0.815,
              0.7675
            ],
            "landscape": [
              0.75,
              0.72
            ]
          }
        }
      ],
      "video": {
        "landscape": "shoko-prototype-v12-20260917-lower-landscape-19af9d3151.mp4",
        "portrait": "shoko-prototype-v12-20260917-lower-portrait-029c6deef7.mp4",
        "duration": 12,
        "fps": 12
      }
    },
    {
      "id": "daylight",
      "name": "外光層",
      "alt": "厚い木の縦の割れ目から、根と道、丸い外周壁、平らな土と等間隔の低い建物、遠方の一本の線を見る。",
      "sourceVersion": "v14",
      "images": {
        "portrait": {
          "src": "shoko-prototype-v14-20260918-06_daylight-portrait-85cfa49494.jpg",
          "width": 1080,
          "height": 1920
        },
        "landscape": {
          "src": "shoko-prototype-v14-20260918-06_daylight-landscape-3023ee5156.jpg",
          "width": 1920,
          "height": 1080
        }
      },
      "hotspots": [
        {
          "id": "opening",
          "title": "外の光",
          "body": "厚い木の壁が、縦に割れている。茶色い外皮の内側へ、白い木肌が続き、横から光が入る。",
          "source": "篇22",
          "rect": {
            "portrait": [
              0.33,
              0.13,
              0.2,
              0.43
            ],
            "landscape": [
              0.43,
              0.1,
              0.15,
              0.49
            ]
          },
          "anchor": {
            "portrait": [
              0.37,
              0.35
            ],
            "landscape": [
              0.456,
              0.4
            ]
          }
        },
        {
          "id": "beyond",
          "title": "開きの外",
          "body": "下には巨大な根が四方へ広がり、その間に細い道がある。周囲を丸い外周区の壁が囲む。壁の外には平らな土と、同じ間隔で続く低い建物があり、遠方へ一本のまっすぐな線が伸びている。",
          "source": "篇22・26",
          "rect": {
            "portrait": [
              0.015,
              0.365,
              0.285,
              0.3
            ],
            "landscape": [
              0.035,
              0.385,
              0.34,
              0.44
            ]
          },
          "anchor": {
            "portrait": [
              0.14,
              0.53
            ],
            "landscape": [
              0.19,
              0.61
            ]
          }
        }
      ]
    },
    {
      "id": "branch",
      "name": "枝の内部",
      "alt": "低く細長い枝の内側。架は奥へ向かって減っていく。",
      "sourceVersion": "v12",
      "images": {
        "portrait": {
          "src": "shoko-prototype-v12-20260917-07_branch-portrait-fbc8cb8108.jpg",
          "width": 1080,
          "height": 1920
        },
        "landscape": {
          "src": "shoko-prototype-v12-20260917-07_branch-landscape-a16815969b.jpg",
          "width": 1920,
          "height": 1080
        }
      },
      "hotspots": [
        {
          "id": "shelves",
          "title": "奥へ続く架",
          "body": "二列の架が一列になり、空いた段が増えていく。最後の棚には、三冊が残っている。",
          "source": "篇24",
          "rect": {
            "portrait": [
              0.125,
              0.49,
              0.28,
              0.27
            ],
            "landscape": [
              0.07,
              0.463,
              0.32,
              0.28
            ]
          }
        },
        {
          "id": "light",
          "title": "採光口",
          "body": "壁の高いところに、細い開きがある。そこから、床へ斜めの光が落ちる。",
          "source": "篇24",
          "rect": {
            "portrait": [
              0.205,
              0.347,
              0.137,
              0.14
            ],
            "landscape": [
              0.366,
              0.3,
              0.06,
              0.18
            ]
          }
        }
      ]
    }
  ]
};

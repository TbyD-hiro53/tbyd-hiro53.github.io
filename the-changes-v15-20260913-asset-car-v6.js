/* asset-car-v6.js — ASSET 20 "The Changes" / part A : car interior
   h!ro53 · deus ex machina.  Three.js r128, ES5, single IIFE, no external requests.

   v5 は c3 §4。寸法（c2 §3）は一切動かしていない。足したのは造作である。
     妻壁  側壁の 0.90 倍まで明度を落とし、貫通扉の輪郭を入れた。
           幅 0.90 x 高 1.95・中心 z = 0・見込み 0.03 の凹み＋枠＋戸。
           取っ手は付けない（原文「取っ手がなく、近づくと開いた」）。窓も無い。
     窓    枠を三段にした。外枠（壁から 0.020 立つ面）→ 見込み 0.050 の返し
           → 内枠 → 硝子の押さえ → 硝子。上部に開く小窓の割りを一本（ref2）。
           窓台（下枠）に奥行 0.06 の水平面。
     座席  縁のパイピング（径 0.012 の丸紐）を座面と背の周囲に回した。
           座面と背の間に隙間 0.02。塊の台座をやめ、薄板の脚＋貫＋受け板にした。
     荷棚  側壁 高さ 1.86 に奥行 0.26 の棚。parts.rack で独立（外せる）。
     天井  長手のリブ（幅 0.06・出 0.012）を 0.40 の格子で。帯の下は抜く。
     床    通路と座席下に高さ差 0.012 の見切り。
     壁    腰 0.62 に見切りの溝（出っ張らせると座席の背に当たる）。幅木 高 0.08。
     扉    戸当たり（召し合わせの立ち）と腰の桟。窓は入れない。
   直した骨格の不具合が一つある。v1〜v4 は panel() に世界法線を渡しておらず、
   +z 側の内壁・外壁が裏返って背面カリングで消え、妻壁の法線は面に平行だった
   （実測：side を DoubleSide にすると 500x500 で 11,544 画素が変わった）。
   v5 は変換の法線写像 tf.n([0,0,1]) を渡す。差は 0 画素になる。

   v3 は二つだけ直した（Ryota の指摘）。
     一 広げた。内法 幅 2.70 → 3.30 ／ 高 2.25 → 2.42 ／ 通路 0.90 → 1.10
       窓 高 1.02 → 1.10（腰から上が広く抜ける）。契約 c2 §3 の値。
       屋根は crown 2.62・camber 0.16 の弧に組み直した。弧は |z| = 1.65 で
       y = 2.478 を通り、天井面 2.42 の上を必ず越える（v2 は 2.183 で
       天井の縁が屋根を突き抜けていた）。
     二 白さを落とした。照明は部品側では作らない。材質の基準色を落とし、
       検討ページの照明を契約 c2 §2（空の PMREM が主・環境光 0.30・
       方向光 0.26・露出 0.86）に差し替えて、その光の下で数値を合わせた。
       壁 #ded4da → #c3bcc0 ／ 天井は壁より僅かに明るいだけ ／ 床は暗い灰の
       まま更に落とし、座席下だけ僅かに明るい ／ 座席の布 #2e4348 は現状維持。
       汚れは足していない。落としたのは明度だけ。
   v2 で直した床の継ぎ目の対策はそのまま引き継いでいる（床の板を車体の外板
   まで通す・壁を床の上に載せる・継ぎ目で頂点を共有する）。新しい幅で証明を
   やり直した。公開する API は v2 と同じ。 */
(function () {
  'use strict';
  var T = window.THREE;

  window.CH = window.CH || {};
  var CH = window.CH;
  CH.parts = CH.parts || {};
  if (!CH.U) {
    CH.U = {
      V: 27.6923, PITCH: 21.6, BEAT: 0.78, DISC: 2.4, LOOP: 31.2,
      RAIL_Y: -1.15,
      SKY_TOP: [0.494, 0.541, 0.518],
      SKY_MID: [0.604, 0.639, 0.612],
      SKY_LOW: [0.435, 0.478, 0.455],
      GROUND: [0.373, 0.353, 0.329],
      MOSS: [0.306, 0.361, 0.282],
      ROOT: [0.416, 0.380, 0.341],
      WALL: [0.725, 0.698, 0.706],
      SAP: [0.184, 0.373, 0.353],
      FOG_N: 90.0, FOG_F: 620.0
    };
  }

  /* CH.U は先に読まれた部品が古い鍵で作っている場合がある。既定値で受ける */
  function U3(k, d) {
    var v = CH.U ? CH.U[k] : null;
    return (v && v.length === 3) ? v : d;
  }
  /* sRGB 0..1 -> linear。板を「その色そのもの」で出すために使う */
  function s2l(c) {
    var o = [], i, v;
    for (i = 0; i < 3; i++) {
      v = c[i];
      o.push(v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
    }
    return o;
  }

  /* ============================ 1. contract constants ====================== */

  var IN_HW = 1.65;          /* interior half width  (z)  3.30      */
  var IN_H = 2.42;           /* interior height                     */
  var IN_HL = 9.60;          /* interior half length (x)  19.2      */
  var EX_HW = 1.75;          /* exterior half width       3.50      */
  var EX_HL = 10.00;         /* exterior half length      20.0      */
  var ROOF_Y = 2.62;         /* roof outer crown                    */
  var SILL_Y = -0.32;        /* bottom edge of the body side        */
  var RAIL_Y = -1.15;

  var DOOR_HW = 0.80, DOOR_H = 2.00;
  var LINE_W = 0.90, LINE_H = 0.12, LINE_CY = 2.16;

  var XS = [-8.00, -6.40, -4.80, -3.20, -1.60, 1.60, 3.20, 4.80, 6.40, 8.00];

  var WIN_W = 1.28, WIN_HW = 0.64;
  var WIN_H = 1.10, WIN_Y0 = 0.72, WIN_Y1 = 1.82, WIN_CY = 1.27;
  var GLASS_Z = 1.686;       /* |z| of the glass pane (v5: 枠が深くなった) */

  var SEAT_D = 0.46, SEAT_TOP = 0.44, SEAT_HZ = 0.55, SEAT_CZ = 1.10;
  var AISLE_HW = 0.55;       /* SEAT_CZ - SEAT_HZ : aisle 1.10       */
  var BACK_T = 0.09, BACK_TOP = 1.05, BACK_BOT = 0.10;
  var BOX_HALF = 0.80;       /* back-plane to box centre             */

  var BAND_HW = 0.17, BAND_Z = 0.68, BAND_Y = 2.41, BAND_HL = 9.30;

  var FLOOR_LAP = 0.002;     /* the floor laps 2 mm under the walls  */

  var R_OUT = 0.045;         /* fillet, outer forms                  */
  var R_EDGE = 0.020;        /* fillet, boards and edges             */

  var BEAT = 0.78;

  /* ---- v5 : 造作。c2 §3 の寸法は動かさない。足す物の寸法だけ ---------- */
  var EMB = 0.006;             /* 面に埋める深さ。同一平面を作らない       */
  /* 妻壁の明度。ACES + sRGB は暗い側を伸ばすので、線形の 0.868 が
     画面では側壁比 0.90（10% 暗い）になる。実測で合わせた値（契約 c3 §4） */
  var END_DIM = 0.868;
  var EDOOR_HW = 0.45;         /* 貫通扉 幅 0.90                          */
  var EDOOR_H = 1.95;          /* 貫通扉 高                               */
  var EDOOR_REV = 0.03;        /* 見込み（凹みの深さ）                     */
  var SILL_D = 0.068, SILL_T = 0.05;     /* 窓台。丸 0.008 を引いて水平面 0.060 */
  var SILL_HX = 0.670;
  var SILL_TOP = 0.7185;       /* 開口の下辺 0.72 の 1.5 mm 下。同一平面を作らない */
  var SASH_Y = 1.50;           /* 上部に開く小窓の割り（ref2）             */
  var RACK_Y = 1.86, RACK_D = 0.26, RACK_T = 0.030;   /* 荷棚             */
  var RACK_X0 = 1.02, RACK_X1 = 9.62;
  var BRK_X = [2.40, 4.00, 5.60, 7.20, 8.80];         /* 荷棚の受け       */
  var RIB_HW = 0.030, RIB_D = 0.012;                  /* 天井のリブ       */
  var RIB_Z = [0, 0.40, 1.20, 1.60];                  /* 0.40 の格子      */
  var SKIRT_TOP = 0.092, SKIRT_HZ = 0.012;            /* 幅木 高 0.08     */
  var DADO_V0 = 0.608, DADO_V1 = 0.632, DADO_D = 0.009, DADO_CH = 0.004;
  var FLOOR_STEP = 0.012, FLOOR_STEP_W = 0.014;       /* 通路との見切り   */
  var PIPE_R = 0.006, PIPE_RHO = R_OUT;               /* 径 0.012 の丸紐  */
  var SEAT_GAP = 0.02;         /* 座面と背の隙間                          */
  /* 布の外形。丸紐が外へ 0.006 出て、組み立て全体で契約の寸法になる */
  var CLOTH_HZ = SEAT_HZ - PIPE_R;                    /* 0.544           */
  var CUSH_CX = BACK_T + SEAT_GAP + SEAT_D * 0.5;     /* 0.34            */
  var CUSH_HX = SEAT_D * 0.5 - PIPE_R;                /* 0.224           */
  var CUSH_CY = SEAT_TOP - 0.05;                      /* 0.39            */
  var BACK_CY = (BACK_BOT + BACK_TOP) * 0.5;          /* 0.575           */
  var BACK_HY = (BACK_TOP - BACK_BOT) * 0.5 - PIPE_R; /* 0.469           */

  /* ---- v3 : 明度の当たり。ここだけで白さを調整する ------------------- */
  var COL_SHELL = 0xc3bcc0;  /* pale white, dimmed: walls, pillars, doors */
  var COL_CEIL = 0xc9c2c6;   /* ceiling : only a shade above the wall     */
  var COL_FAB = 0x2e4348;    /* seat cloth  (unchanged - Ryota's ruling)  */
  var COL_FABW = 0x4b6065;   /* cloth where the elbow rubbed it out       */
  var COL_FRAME = 0xa8a1a5;
  var COL_PALE = 0xf2dbe9;

  var FLOOR_K = 0.30;       /* aisle floor, vertex value                 */
  var FLOOR_KS = 0.35;      /* floor under the seats : a shade lighter   */
  var CEIL_K = 0.88;         /* ceiling vertex value                      */
  var WALL_K = 0.84;         /* wall vertex value                         */

  /* envMapIntensity。空の PMREM が主光源（契約 c2 §2）                    */
  var EI = { shell: 0.92, ceil: 0.90, fab: 0.92, fabW: 0.92,
             frame: 0.95, pipe: 0.52, glass: 0.60, band: 0.30, floor: 0.75 };
  var EM_CEIL = 0.10;        /* 天井の粒（台帳⑨。黒帯にしない）            */
  var EM_BAND = 0.38;        /* 天井の帯。発光。統合すると帯が画面で一番白い
                                ものになったので v3 の 0.58 から落とした        */
  var EM_LINE = 0.72;

  function wrap(a, m) { return ((a % m) + m) % m; }

  /* ============================ 2. rng ==================================== */

  var _seed = 1;
  function rnd() { _seed = (_seed * 9301 + 49297) % 233280; return _seed / 233280; }
  function rseed(s) { _seed = ((s % 233280) + 233280) % 233280; }

  /* ============================ 3. geometry buffers ======================= */

  function Buf() { this.p = []; this.n = []; this.u = []; this.c = []; this.i = []; }

  Buf.prototype.vert = function (p, n, uv, c) {
    var k = this.p.length / 3;
    this.p.push(p[0], p[1], p[2]);
    this.n.push(n[0], n[1], n[2]);
    this.u.push(uv[0], uv[1]);
    this.c.push(c[0], c[1], c[2]);
    return k;
  };

  /* quad given in loop order; winding is fixed against the supplied normals */
  Buf.prototype.quad = function (P, N, UV, C) {
    var e1 = [P[1][0] - P[0][0], P[1][1] - P[0][1], P[1][2] - P[0][2]];
    var e2 = [P[2][0] - P[0][0], P[2][1] - P[0][1], P[2][2] - P[0][2]];
    var e3 = [P[3][0] - P[0][0], P[3][1] - P[0][1], P[3][2] - P[0][2]];
    var f1 = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    var f2 = [e2[1] * e3[2] - e2[2] * e3[1], e2[2] * e3[0] - e2[0] * e3[2], e2[0] * e3[1] - e2[1] * e3[0]];
    var a1 = Math.sqrt(f1[0] * f1[0] + f1[1] * f1[1] + f1[2] * f1[2]);
    var a2 = Math.sqrt(f2[0] * f2[0] + f2[1] * f2[1] + f2[2] * f2[2]);
    if (a1 < 1e-10 && a2 < 1e-10) return;
    var ns = [N[0][0] + N[1][0] + N[2][0] + N[3][0],
              N[0][1] + N[1][1] + N[2][1] + N[3][1],
              N[0][2] + N[1][2] + N[2][2] + N[3][2]];
    var fw = (f1[0] + f2[0]) * ns[0] + (f1[1] + f2[1]) * ns[1] + (f1[2] + f2[2]) * ns[2];
    var ia = this.vert(P[0], N[0], UV[0], C[0]);
    var ib = this.vert(P[1], N[1], UV[1], C[1]);
    var ic = this.vert(P[2], N[2], UV[2], C[2]);
    var id = this.vert(P[3], N[3], UV[3], C[3]);
    if (fw >= 0) {
      if (a1 > 1e-10) this.i.push(ia, ib, ic);
      if (a2 > 1e-10) this.i.push(ia, ic, id);
    } else {
      if (a1 > 1e-10) this.i.push(ia, ic, ib);
      if (a2 > 1e-10) this.i.push(ia, id, ic);
    }
  };

  Buf.prototype.count = function () { return this.i.length / 3; };

  /* append another buffer through a position / normal / colour map */
  Buf.prototype.append = function (o, pf, nf, cf) {
    var base = this.p.length / 3, k, kk;
    for (k = 0; k < o.p.length; k += 3) {
      var lp = [o.p[k], o.p[k + 1], o.p[k + 2]];
      var ln = [o.n[k], o.n[k + 1], o.n[k + 2]];
      var wp = pf(lp), wn = nf(ln), wc = cf ? cf(lp) : [o.c[k], o.c[k + 1], o.c[k + 2]];
      kk = (k / 3) * 2;
      this.p.push(wp[0], wp[1], wp[2]);
      this.n.push(wn[0], wn[1], wn[2]);
      this.u.push(o.u[kk], o.u[kk + 1]);
      this.c.push(wc[0], wc[1], wc[2]);
    }
    for (k = 0; k < o.i.length; k += 3) {
      /* the map may mirror; re-check the winding against the mapped normal */
      var a = base + o.i[k], b = base + o.i[k + 1], c = base + o.i[k + 2];
      var e1 = [this.p[b * 3] - this.p[a * 3], this.p[b * 3 + 1] - this.p[a * 3 + 1], this.p[b * 3 + 2] - this.p[a * 3 + 2]];
      var e2 = [this.p[c * 3] - this.p[a * 3], this.p[c * 3 + 1] - this.p[a * 3 + 1], this.p[c * 3 + 2] - this.p[a * 3 + 2]];
      var f = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
      var d = f[0] * this.n[a * 3] + f[1] * this.n[a * 3 + 1] + f[2] * this.n[a * 3 + 2];
      if (d >= 0) this.i.push(a, b, c); else this.i.push(a, c, b);
    }
  };

  Buf.prototype.geo = function () {
    var g = new T.BufferGeometry();
    g.setAttribute('position', new T.Float32BufferAttribute(this.p, 3));
    g.setAttribute('normal', new T.Float32BufferAttribute(this.n, 3));
    g.setAttribute('uv', new T.Float32BufferAttribute(this.u, 2));
    g.setAttribute('color', new T.Float32BufferAttribute(this.c, 3));
    g.setIndex(this.i);
    /* Orient every triangle after Float32 quantisation, including tiny caps. */
    var pp=g.attributes.position, nn=g.attributes.normal, ix=g.index, ii, aa, bb, cc, ux,uy,uz,vx,vy,vz,nx,ny,nz,dd;
    for(ii=0;ii<ix.count;ii+=3){aa=ix.getX(ii);bb=ix.getX(ii+1);cc=ix.getX(ii+2);
      ux=pp.getX(bb)-pp.getX(aa);uy=pp.getY(bb)-pp.getY(aa);uz=pp.getZ(bb)-pp.getZ(aa);
      vx=pp.getX(cc)-pp.getX(aa);vy=pp.getY(cc)-pp.getY(aa);vz=pp.getZ(cc)-pp.getZ(aa);
      nx=uy*vz-uz*vy;ny=uz*vx-ux*vz;nz=ux*vy-uy*vx;
      dd=nx*(nn.getX(aa)+nn.getX(bb)+nn.getX(cc))+ny*(nn.getY(aa)+nn.getY(bb)+nn.getY(cc))+nz*(nn.getZ(aa)+nn.getZ(bb)+nn.getZ(cc));
      if(dd<0){ix.setX(ii+1,cc);ix.setX(ii+2,bb);}
    }

    g.computeBoundingBox();
    g.computeBoundingSphere();
    return g;
  };

  /* ============================ 4. rounded box ============================ */
  /* one shared radius per part; an edge is filleted only when BOTH of the
     faces that meet there are flagged. faces touching something else stay
     square so flush joints do not open a groove. */

  var QPI = Math.PI / 4;

  function axisList(h, r, rn, rp, nseg, extras, subs) {
    var L = [], i, t, lo, hi;
    lo = rn ? -(h - r) : -h;
    hi = rp ? (h - r) : h;
    if (rn) { for (i = nseg; i >= 1; i--) { t = i * QPI / nseg; L.push(-(h - r) - r * Math.tan(t)); } }
    L.push(lo);
    if (subs && subs > 1) { for (i = 1; i < subs; i++) L.push(lo + (hi - lo) * i / subs); }
    if (extras) { for (i = 0; i < extras.length; i++) { if (extras[i] > lo + 1e-6 && extras[i] < hi - 1e-6) L.push(extras[i]); } }
    L.push(hi);
    if (rp) { for (i = 1; i <= nseg; i++) { t = i * QPI / nseg; L.push((h - r) + r * Math.tan(t)); } }
    L.sort(function (a, b) { return a - b; });
    var O = [L[0]];
    for (i = 1; i < L.length; i++) { if (L[i] - O[O.length - 1] > 1e-7) O.push(L[i]); }
    return O;
  }

  /* opt = { c:[cx,cy,cz], h:[hx,hy,hz], r:, mask:{xn,xp,yn,yp,zn,zp},
            nseg:, extras:{x:[],y:[],z:[]}, subs:[sx,sy,sz],
            uvs: metres->uv scale, col: fn(px,py,pz)->[r,g,b],
            pick: fn(axis, sign, mid[3]) -> Buf                        */
  function rbox(opt) {
    var h = opt.h, r = opt.r, m = opt.mask, ns = opt.nseg || 2;
    var ex = opt.extras || {}, sb = opt.subs || [1, 1, 1];
    var lo = [m.xn ? -(h[0] - r) : -h[0], m.yn ? -(h[1] - r) : -h[1], m.zn ? -(h[2] - r) : -h[2]];
    var hi = [m.xp ? (h[0] - r) : h[0], m.yp ? (h[1] - r) : h[1], m.zp ? (h[2] - r) : h[2]];
    var rf = [[m.xn, m.xp], [m.yn, m.yp], [m.zn, m.zp]];
    var LS = [
      axisList(h[0], r, m.xn, m.xp, ns, ex.x, sb[0]),
      axisList(h[1], r, m.yn, m.yp, ns, ex.y, sb[1]),
      axisList(h[2], r, m.zn, m.zp, ns, ex.z, sb[2])
    ];

    function map(p, fa, fs) {
      var q = [0, 0, 0], d = [0, 0, 0], i;
      for (i = 0; i < 3; i++) {
        q[i] = p[i] < lo[i] ? lo[i] : (p[i] > hi[i] ? hi[i] : p[i]);
        d[i] = p[i] - q[i];
      }
      var L = Math.sqrt(d[0] * d[0] + d[1] * d[1] + d[2] * d[2]);
      var pos, nrm;
      if (L > 1e-9) pos = [q[0] + d[0] / L * r, q[1] + d[1] / L * r, q[2] + d[2] / L * r];
      else pos = [p[0], p[1], p[2]];
      if (rf[fa][fs > 0 ? 1 : 0] && L > 1e-9) nrm = [d[0] / L, d[1] / L, d[2] / L];
      else { nrm = [0, 0, 0]; nrm[fa] = fs; }
      return { p: pos, n: nrm };
    }

    var A = [[1, 2], [2, 0], [0, 1]];  /* in-plane axes for face normal 0/1/2 */
    var fa, fs, ai, bi, i, j;
    for (fa = 0; fa < 3; fa++) {
      ai = A[fa][0]; bi = A[fa][1];
      for (fs = -1; fs <= 1; fs += 2) {
        var LA = LS[ai], LB = LS[bi];
        for (i = 0; i < LA.length - 1; i++) {
          for (j = 0; j < LB.length - 1; j++) {
            var P = [], N = [], UV = [], C = [];
            var aa = [LA[i], LA[i + 1], LA[i + 1], LA[i]];
            var bb = [LB[j], LB[j], LB[j + 1], LB[j + 1]];
            var k, mid = [0, 0, 0];
            for (k = 0; k < 4; k++) {
              var p = [0, 0, 0];
              p[fa] = fs * h[fa]; p[ai] = aa[k]; p[bi] = bb[k];
              var v = map(p, fa, fs);
              P.push([v.p[0] + opt.c[0], v.p[1] + opt.c[1], v.p[2] + opt.c[2]]);
              N.push(v.n);
              UV.push([aa[k] * opt.uvs, bb[k] * opt.uvs]);
              mid[0] += v.p[0] / 4; mid[1] += v.p[1] / 4; mid[2] += v.p[2] / 4;
            }
            for (k = 0; k < 4; k++) C.push(opt.col ? opt.col(P[k][0], P[k][1], P[k][2]) : [1, 1, 1]);
            var B = opt.pick ? opt.pick(fa, fs, mid) : opt.buf;
            if (B) B.quad(P, N, UV, C);
          }
        }
      }
    }
  }

  /* ============================ 5. flat panel with holes ================== */
  /* xf(u,v,w) -> world position ; nrm = surface normal */

  function uniq(a) {
    a.sort(function (x, y) { return x - y; });
    var o = [a[0]], i;
    for (i = 1; i < a.length; i++) if (a[i] - o[o.length - 1] > 1e-7) o.push(a[i]);
    return o;
  }

  function inHoles(u, v, holes) {
    for (var i = 0; i < holes.length; i++) {
      var h = holes[i];
      if (u > h[0] + 1e-6 && u < h[1] - 1e-6 && v > h[2] + 1e-6 && v < h[3] - 1e-6) return true;
    }
    return false;
  }

  function panel(B, U, V, holes, xf, nrm, uvs, col) {
    var i, j;
    for (i = 0; i < U.length - 1; i++) {
      for (j = 0; j < V.length - 1; j++) {
        var uc = (U[i] + U[i + 1]) * 0.5, vc = (V[j] + V[j + 1]) * 0.5;
        if (inHoles(uc, vc, holes)) continue;
        var uu = [U[i], U[i + 1], U[i + 1], U[i]];
        var vv = [V[j], V[j], V[j + 1], V[j + 1]];
        var P = [], N = [], UV = [], C = [], k;
        for (k = 0; k < 4; k++) {
          var p = xf(uu[k], vv[k], 0);
          P.push(p); N.push(nrm); UV.push([uu[k] * uvs, vv[k] * uvs]);
          C.push(col ? col(p[0], p[1], p[2]) : [1, 1, 1]);
        }
        B.quad(P, N, UV, C);
      }
    }
  }


  /* ============================ 6. procedural maps ======================== */
  /* every texture is drawn on a canvas. no external request. */

  function noiseField(size, octs, seed) {
    rseed(seed);
    var out = new Float32Array(size * size), o, amp = 1, tot = 0, g = 4, i, x, y;
    for (o = 0; o < octs; o++) {
      var lat = new Float32Array(g * g);
      for (i = 0; i < g * g; i++) lat[i] = rnd();
      for (y = 0; y < size; y++) {
        for (x = 0; x < size; x++) {
          var fx = x / size * g, fy = y / size * g;
          var x0 = Math.floor(fx), y0 = Math.floor(fy);
          var tx = fx - x0, ty = fy - y0;
          tx = tx * tx * (3 - 2 * tx); ty = ty * ty * (3 - 2 * ty);
          var x1 = (x0 + 1) % g, y1 = (y0 + 1) % g; x0 = x0 % g; y0 = y0 % g;
          var a = lat[y0 * g + x0], b = lat[y0 * g + x1];
          var c = lat[y1 * g + x0], d = lat[y1 * g + x1];
          var t0 = a + (b - a) * tx, t1 = c + (d - c) * tx;
          out[y * size + x] += amp * (t0 + (t1 - t0) * ty);
        }
      }
      tot += amp; amp *= 0.5; g *= 2;
    }
    for (i = 0; i < size * size; i++) out[i] /= tot;
    return out;
  }

  function fieldToNormal(field, size, strength) {
    var cv = document.createElement('canvas');
    cv.width = size; cv.height = size;
    var ctx = cv.getContext('2d');
    var img = ctx.createImageData(size, size), d = img.data, x, y;
    function at(a, b) { return field[((b % size) + size) % size * size + ((a % size) + size) % size]; }
    for (y = 0; y < size; y++) {
      for (x = 0; x < size; x++) {
        var gx = (at(x + 1, y - 1) + 2 * at(x + 1, y) + at(x + 1, y + 1))
               - (at(x - 1, y - 1) + 2 * at(x - 1, y) + at(x - 1, y + 1));
        var gy = (at(x - 1, y + 1) + 2 * at(x, y + 1) + at(x + 1, y + 1))
               - (at(x - 1, y - 1) + 2 * at(x, y - 1) + at(x + 1, y - 1));
        var nx = -gx * strength, ny = -gy * strength, nz = 1.0;
        var L = Math.sqrt(nx * nx + ny * ny + nz * nz);
        var k = (y * size + x) * 4;
        d[k] = Math.round((nx / L * 0.5 + 0.5) * 255);
        d[k + 1] = Math.round((ny / L * 0.5 + 0.5) * 255);
        d[k + 2] = Math.round((nz / L * 0.5 + 0.5) * 255);
        d[k + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    return cv;
  }

  function fieldToGray(field, size, lo, hi) {
    var cv = document.createElement('canvas');
    cv.width = size; cv.height = size;
    var ctx = cv.getContext('2d');
    var img = ctx.createImageData(size, size), d = img.data, i;
    for (i = 0; i < size * size; i++) {
      var v = Math.round((lo + (hi - lo) * field[i]) * 255);
      if (v < 0) v = 0; if (v > 255) v = 255;
      d[i * 4] = v; d[i * 4 + 1] = v; d[i * 4 + 2] = v; d[i * 4 + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    return cv;
  }

  /* plain weave: warp over weft in alternating cells, plus a slack noise */
  function weaveField(size, cell, seed) {
    var n = noiseField(size, 3, seed);
    var out = new Float32Array(size * size), x, y;
    for (y = 0; y < size; y++) {
      for (x = 0; x < size; x++) {
        var cx = Math.floor(x / cell), cy = Math.floor(y / cell);
        var tx = (x % cell) / cell, ty = (y % cell) / cell;
        var h;
        if (((cx + cy) & 1) === 0) h = Math.sin(Math.PI * tx) * 0.90 + Math.sin(Math.PI * ty) * 0.10;
        else h = Math.sin(Math.PI * ty) * 0.90 + Math.sin(Math.PI * tx) * 0.10;
        out[y * size + x] = h * 0.96 + n[y * size + x] * 0.04;
      }
    }
    return out;
  }

  function texFrom(canvas, srgb) {
    var t = new T.CanvasTexture(canvas);
    t.wrapS = T.RepeatWrapping; t.wrapT = T.RepeatWrapping;
    t.anisotropy = 8;
    if (srgb) t.encoding = T.sRGBEncoding;
    return t;
  }

  var TEX = null;
  function buildTex() {
    if (TEX) return TEX;
    TEX = {};
    var S = 512;
    /* fine panel grain — walls, floor, frames, doors */
    var f1 = noiseField(S, 7, 17);
    /* Microtexture is finer than the independent broad roughness variation. */
    for (var fi = 0; fi < f1.length; fi++) f1[fi] = f1[fi] * 0.25 + rnd() * 0.035;
    TEX.panelN = texFrom(fieldToNormal(f1, S, 8.0), false);
    var f2 = noiseField(S, 4, 8123);
    TEX.panelR = texFrom(fieldToGray(f2, S, 0.82, 1.00), false);
    /* ceiling grain, faintly lit */
    var f3 = noiseField(S, 3, 4409);
    TEX.ceilE = texFrom(fieldToGray(f3, S, 0.96, 1.00), false);
    /* cloth */
    var w = weaveField(S, 4, 991);
    TEX.fabC = texFrom(fieldToGray(w, S, 0.89, 1.0), true);
    TEX.fabN = texFrom(fieldToNormal(w, S, 9.0), false);
    var f4 = noiseField(S, 4, 6067);
    TEX.fabR = texFrom(fieldToGray(f4, S, 0.88, 1.00), false);
    /* contact shadow, drawn once, reused under every seat */
    TEX.decal = texFrom(decalCanvas(), false);
    TEX.decal.wrapS = T.ClampToEdgeWrapping;
    TEX.decal.wrapT = T.ClampToEdgeWrapping;
    /* the line above the door */
    TEX.lineCv = document.createElement('canvas');
    TEX.lineCv.width = 1024; TEX.lineCv.height = 137;
    drawLine(TEX.lineCv, LINE_TEXT);
    TEX.line = new T.CanvasTexture(TEX.lineCv);
    TEX.line.wrapS = T.ClampToEdgeWrapping;
    TEX.line.wrapT = T.ClampToEdgeWrapping;
    TEX.line.encoding = T.sRGBEncoding;
    TEX.line.anisotropy = 8;
    return TEX;
  }

  /* 接地の陰。板は座席の枠に合わせた長方形（幅が 0.90 -> 1.10 になった）。
     枠の踏み面 DEC_FU x DEC_FV の外へ DEC_FADE で消える。 */
  /* v5 : 台座をやめ薄板の脚にしたので、踏み面を脚の位置に合わせ直した */
  var DEC_FU = 0.18, DEC_FV = 0.435;   /* footprint half extents     */
  var DEC_FADE = 0.15;
  var DEC_HU = DEC_FU + DEC_FADE, DEC_HV = DEC_FV + DEC_FADE;

  function decalCanvas() {
    var N = 128, cv = document.createElement('canvas');
    cv.width = N; cv.height = N;
    var ctx = cv.getContext('2d');
    var img = ctx.createImageData(N, N), d = img.data, x, y;
    for (y = 0; y < N; y++) {
      for (x = 0; x < N; x++) {
        var u = (x / (N - 1) - 0.5) * 2 * DEC_HU, v = (y / (N - 1) - 0.5) * 2 * DEC_HV;
        var du = Math.abs(u) - DEC_FU, dv = Math.abs(v) - DEC_FV;
        if (du < 0) du = 0; if (dv < 0) dv = 0;
        var dist = Math.sqrt(du * du + dv * dv) / DEC_FADE;
        var a = 1.0 - dist;
        if (a < 0) a = 0;
        a = a * a * (3 - 2 * a);
        var k = (y * N + x) * 4, g = Math.round(a * 255);
        d[k] = g; d[k + 1] = g; d[k + 2] = g; d[k + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    return cv;
  }

  var LINE_TEXT = '＞ 当該列車　次停車　乗換　八';

  function drawLine(cv, str) {
    var w = cv.width, h = cv.height, ctx = cv.getContext('2d');
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#0d1116';
    ctx.fillRect(0, 0, w, h);
    /* a shallow vignette so the panel is not a flat black card */
    var gr = ctx.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, 'rgba(255,255,255,0.045)');
    gr.addColorStop(0.5, 'rgba(255,255,255,0.0)');
    gr.addColorStop(1, 'rgba(0,0,0,0.20)');
    ctx.fillStyle = gr; ctx.fillRect(0, 0, w, h);
    var fs = Math.round(h * 0.62);
    var fam = 'px system-ui, "Noto Sans CJK JP", "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif';
    ctx.font = '500 ' + fs + fam;
    /* 幅に収める。収めないと ＞ と末尾の数が切れる（統合の実測で発覚） */
    var maxW = w * 0.94;
    while (fs > 8 && ctx.measureText(str).width > maxW) {
      fs -= 1; ctx.font = '500 ' + fs + fam;
    }
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    /* one pass of bloom, then the crisp glyphs */
    ctx.shadowColor = 'rgba(242,219,233,0.85)';
    ctx.shadowBlur = 2;
    ctx.fillStyle = 'rgba(242,219,233,0.34)';
    ctx.fillText(str, w / 2, h * 0.53);
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#f2dbe9';
    ctx.fillText(str, w / 2, h * 0.53);
  }

  /* ============================ 7. materials ============================== */

  var M = null;

  function mats() {
    var tx = buildTex();
    var env = CH.ENV || null;
    if (!M) {
      M = {};
      M.shell = new T.MeshStandardMaterial({
        color: COL_SHELL, roughness: 0.39, metalness: 0.0,
        vertexColors: true,
        normalMap: tx.panelN, roughnessMap: tx.panelR
      });
      M.shell.normalScale = new T.Vector2(0.035, 0.035);

      M.ceil = new T.MeshStandardMaterial({
        color: COL_CEIL, roughness: 0.66, metalness: 0.0,
        vertexColors: true,
        normalMap: tx.panelN, roughnessMap: tx.panelR,
        emissive: new T.Color(COL_PALE), emissiveMap: tx.ceilE, emissiveIntensity: EM_CEIL
      });
      M.ceil.normalScale = new T.Vector2(0.012, 0.012);

      M.fab = new T.MeshStandardMaterial({
        color: COL_FAB, roughness: 0.94, metalness: 0.0,
        vertexColors: true,
        map: tx.fabC, normalMap: tx.fabN, roughnessMap: tx.fabR
      });
      M.fab.normalScale = new T.Vector2(0.070, 0.070);

      M.fabW = new T.MeshStandardMaterial({
        color: COL_FABW, roughness: 0.74, metalness: 0.0,
        vertexColors: true,
        map: tx.fabC, normalMap: tx.fabN, roughnessMap: tx.fabR
      });
      M.fabW.normalScale = new T.Vector2(0.042, 0.042);

      M.frame = new T.MeshStandardMaterial({
        color: COL_FRAME, roughness: 0.38, metalness: 0.30,
        vertexColors: true,
        normalMap: tx.panelN, roughnessMap: tx.panelR
      });
      M.frame.normalScale = new T.Vector2(0.030, 0.030);

      /* 縁のパイピング。壁より僅かに明るく、僅かに滑らか。飛ばさない */
      M.pipe = new T.MeshStandardMaterial({
        color: 0x6a7b7c, roughness: 0.68, metalness: 0.0,
        vertexColors: true, normalMap: tx.panelN, roughnessMap: tx.panelR
      });
      M.pipe.normalScale = new T.Vector2(0.012, 0.012);

      M.floor = new T.MeshStandardMaterial({ color: 0x788080, roughness: 0.56, metalness: 0.0,
        vertexColors: true, normalMap: tx.panelN, roughnessMap: tx.panelR });
      M.floor.normalScale = new T.Vector2(0.026, 0.026);
      M.glass = new T.MeshStandardMaterial({
        color: 0xd9e2e4, roughness: 0.05, metalness: 0.0,
        transparent: true, opacity: 0.15, depthWrite: false,
        side: T.DoubleSide
      });

      M.band = new T.MeshStandardMaterial({
        color: 0x14171c, roughness: 0.55, metalness: 0.0,
        vertexColors: true,
        emissive: new T.Color(COL_PALE), emissiveMap: tx.ceilE, emissiveIntensity: EM_BAND
      });

      M.line = new T.MeshStandardMaterial({
        color: 0x0d1116, roughness: 0.30, metalness: 0.0,
        map: tx.line, emissive: new T.Color(0xffffff),
        emissiveMap: tx.line, emissiveIntensity: EM_LINE
      });

      M.decal = new T.MeshBasicMaterial({
        color: 0x0a0c10, transparent: true, opacity: 0.34,
        alphaMap: tx.decal, depthWrite: false,
        polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2
      });

      /* 窓の外の板。トーンマップを通さず「その色そのもの」を出す */
      M.stub = new T.MeshBasicMaterial({
        vertexColors: true, side: T.DoubleSide, fog: false, toneMapped: false
      });
    }

    var k;
    for (k in EI) {
      if (M[k]) { M[k].envMap = env; M[k].envMapIntensity = EI[k] * ENVK; M[k].needsUpdate = true; }
    }
    CH.parts.car.matsQuality=M;
    return M;
  }

  var ENVK = 1.0;   /* dimmed by setNight */

  /* ============================ 8. wall frames (rings) ==================== */
  /* a ring is a profile (rho, w) swept round a rounded-rect core. it laps
     over the wall face on the outside (flush -> no fillet there, bug ledger
     "do not round an edge that meets a hidden face") and carries the fillet
     on the aperture side. */

  function rrLoop(cu, cv, rho, nArc) {
    var pts = [], k, i, a;
    var sx = [1, -1, -1, 1], sy = [1, 1, -1, -1];
    for (k = 0; k < 4; k++) {
      for (i = 0; i <= nArc; i++) {
        a = (k * 90 + i * 90 / nArc) * Math.PI / 180;
        pts.push([sx[k] * cu + rho * Math.cos(a), sy[k] * cv + rho * Math.sin(a),
                  Math.cos(a), Math.sin(a)]);
      }
    }
    return pts;
  }

  /* prof : [[rho,w], ...] outer -> inner.  xf/xn map local (u,v,w) to world. */
  function ring(B, cu, cv, ou, ov, prof, nArc, xf, xn, uvs, col) {
    var i, j, L = prof.length, N4 = 4 * (nArc + 1) + 1;
    /* per-profile-point 2d normal, averaged across segments */
    var sn = [];
    for (i = 0; i < L - 1; i++) {
      var drho = prof[i + 1][0] - prof[i][0], dw = prof[i + 1][1] - prof[i][1];
      var m = Math.sqrt(drho * drho + dw * dw) || 1;
      sn.push([dw / m, -drho / m]);
    }
    var pn = [];
    for (i = 0; i < L; i++) {
      var a = sn[i > 0 ? i - 1 : 0], b = sn[i < L - 1 ? i : L - 2];
      var nx = a[0] + b[0], ny = a[1] + b[1];
      var mm = Math.sqrt(nx * nx + ny * ny) || 1;
      pn.push([nx / mm, ny / mm]);
    }
    var loops = [], nrms = [];
    for (i = 0; i < L; i++) {
      var lp = rrLoop(cu, cv, prof[i][0], nArc), q = [], qn = [];
      for (j = 0; j < lp.length; j++) {
        q.push([ou + lp[j][0], ov + lp[j][1], prof[i][1]]);
        qn.push([lp[j][2] * pn[i][0], lp[j][3] * pn[i][0], pn[i][1]]);
      }
      q.push(q[0]); qn.push(qn[0]);
      loops.push(q); nrms.push(qn);
    }
    for (i = 0; i < L - 1; i++) {
      for (j = 0; j < loops[i].length - 1; j++) {
        var A = loops[i][j], Bp = loops[i][j + 1], C = loops[i + 1][j + 1], D = loops[i + 1][j];
        var P = [xf(A[0], A[1], A[2]), xf(Bp[0], Bp[1], Bp[2]), xf(C[0], C[1], C[2]), xf(D[0], D[1], D[2])];
        var NN = [xn(nrms[i][j]), xn(nrms[i][j + 1]), xn(nrms[i + 1][j + 1]), xn(nrms[i + 1][j])];
        var UV = [[A[0] * uvs, A[1] * uvs], [Bp[0] * uvs, Bp[1] * uvs],
                  [C[0] * uvs, C[1] * uvs], [D[0] * uvs, D[1] * uvs]];
        var CC = [col(P[0]), col(P[1]), col(P[2]), col(P[3])];
        B.quad(P, NN, UV, CC);
      }
    }
  }

  /* window surround: core (0.50,0.41); aperture rho .100 -> outer rho .220,
     which covers the square 1.28x1.10 hole corner (rho .198). */
  var WIN_CORE_U = 0.50, WIN_CORE_V = 0.41;
  /* v5 : 三段。外枠（壁から 0.020 立つ面）→ 見込み 0.050 の返し
     → 内枠（w = -0.030）→ 硝子の押さえ → 硝子（w = -0.036）。
     返しは rho 0.130 で、開口の縁（rho 0.140）より内側に入る。壁に潜らない。 */
  var WIN_PROF_IN = [
    [0.2200,  0.00015], [0.2130,  0.00520], [0.2010,  0.01560], [0.1930,  0.02000],
    [0.1400,  0.02000], [0.1360,  0.01900], [0.1330,  0.01300], [0.1300, -0.03000],
    [0.1240, -0.03000], [0.1060, -0.03000], [0.1000, -0.02100], [0.0960, -0.01400],
    [0.0880, -0.01400], [0.0840, -0.02600], [0.0820, -0.03500]
  ];
  /* exterior gasket: same core, shallower */
  var WIN_PROF_OUT = [
    [0.2200, 0.00015], [0.2110, 0.00420], [0.1960, 0.01050], [0.1600, 0.01260],
    [0.1490, 0.01340], [0.1440, 0.01240], [0.1425, 0.01000], [0.1420, 0.00600]
  ];

  var DOOR_CORE_U = 0.68, DOOR_CORE_V = 0.88, DOOR_CV = 0.97;
  var DOOR_PROF_IN = [
    [0.2200, 0.00015], [0.2120, 0.00420], [0.2000, 0.01260], [0.1400, 0.01620],
    [0.1150, 0.01760], [0.1060, 0.01840], [0.1018, 0.01710], [0.1005, 0.01420],
    [0.1000, 0.00850]
  ];
  var DOOR_PROF_OUT = [
    [0.2200, 0.00015], [0.2100, 0.00420], [0.1900, 0.01050], [0.1300, 0.01260],
    [0.1080, 0.01340], [0.1020, 0.01240], [0.1005, 0.01000], [0.1000, 0.00600]
  ];

  /* 妻壁の貫通扉。芯 (0.355, 0.855)・中心 v = 0.94。
     開口 (0.45, 0..1.95) の縁を rho 0.20 まで被い、rho 0.090 で w = -0.029 まで
     潜って戸（w = -0.030）に会う。潜り始める rho は 0.094 で、開口の内側。 */
  var EDOOR_CU = 0.355, EDOOR_CV = 0.855, EDOOR_CY = 0.94;
  var EDOOR_PROF = [
    [0.2000,  0.00015], [0.1930,  0.00420], [0.1820,  0.01250], [0.1300,  0.01600],
    [0.1120,  0.01700], [0.1020,  0.01500], [0.0965,  0.00700], [0.0940,  0.00000],
    [0.0920, -0.01200], [0.0900, -0.02900]
  ];
  /* 戸の中の枠（枠の中に枠）。縁から 0.075 内へ入った浅い立ち */
  var ELEAF_CU = 0.345, ELEAF_CV = 0.870, ELEAF_CY = 0.975;
  var ELEAF_PROF = [
    [0.0300, 0.00020], [0.0230, 0.00520], [0.0130, 0.00600], [0.0050, 0.00230],
    [0.0020, 0.00000]
  ];

  /* ============================ 9. transforms ============================= */

  function wallIn(s) {
    return {
      p: function (u, v, w) { return [-s * u, v, s * (IN_HW - w)]; },
      n: function (n) { return [-s * n[0], n[1], -s * n[2]]; }
    };
  }
  function wallOut(s) {
    return {
      p: function (u, v, w) { return [-s * u, v, s * (EX_HW + w)]; },
      n: function (n) { return [-s * n[0], n[1], s * n[2]]; }
    };
  }
  function endIn(e) {
    return {
      p: function (u, v, w) { return [e * (IN_HL - w), v, e * u]; },
      n: function (n) { return [-e * n[2], n[1], e * n[0]]; }
    };
  }

  /* ============================ 10. shell ================================= */

  function shellColour(x, y, z) {
    var c = WALL_K;
    if (y < 0.40) c = WALL_K * 0.524 + (y / 0.40) * WALL_K * 0.476;
    if (y > 2.15) c = WALL_K + Math.min(1, (y - 2.15) / 0.27) * 0.08;
    if (Math.abs(z) > 1.50 && y > 0.40 && y < 2.15) c *= 1.0 - (Math.abs(z) - 1.50) * 0.14;
    return [c, c, c];
  }
  /* 通路は暗い灰。座席下は僅かに明るい。壁ぎわは接地の陰で落とす */
  function floorColour(x, y, z) {
    var e = Math.abs(z), c;
    if (e <= AISLE_HW) c = FLOOR_K;
    else c = FLOOR_K + (FLOOR_KS - FLOOR_K) * Math.min(1, (e - AISLE_HW) / 0.22);
    if (e > 1.42) c *= 1.0 - Math.min(1, (e - 1.42) / 0.23) * 0.34;
    return [c, c, c];
  }
  function ceilColour(x, y, z) {
    var c = CEIL_K, e = Math.abs(z);
    if (e > 1.25) c *= 1.0 - (e - 1.25) * 0.42;
    return [c, c, c];
  }
  function darkColour() { return [0.22, 0.22, 0.22]; }
  function revealColour() { return [0.34, 0.34, 0.34]; }
  /* 妻壁。通路から見て画面で一番明るい面だったので落とす（c3 §4） */
  function endColour(x, y, z) {
    var c = shellColour(x, y, z)[0] * END_DIM;
    return [c, c, c];
  }
  function leafColour(x, y, z) {
    var c = shellColour(x, y, z)[0] * END_DIM * 0.945;
    return [c, c, c];
  }
  function grooveColour(P) {
    var c = shellColour(P[0], P[1], P[2])[0] * 0.90;
    return [c, c, c];
  }
  function rackColour(x, y) { var c = 0.80 - (y > RACK_Y ? 0.0 : 0.06); return [c, c, c]; }
  function ribColour() { return [CEIL_K * 0.985, CEIL_K * 0.985, CEIL_K * 0.985]; }
  function pipeColour() { return [1.0, 1.0, 1.0]; }
  function frameColour(x, y) { var c = y < 0.14 ? 0.42 + y * 1.4 : 0.62; return [c, c, c]; }
  /* ring() / strip() は色関数に「点の配列」を一つだけ渡す。橋渡し */
  function shellColourP(P) { return shellColour(P[0], P[1], P[2]); }
  function endColourP(P) { return endColour(P[0], P[1], P[2]); }
  function leafColourP(P) { return leafColour(P[0], P[1], P[2]); }

  function strip(B, pts, nrm, xf, xn, uvs, col) {
    /* pts: [[u,v,w],...] two rows given as [rowA, rowB] */
    var i, A = pts[0], Bo = pts[1];
    for (i = 0; i < A.length - 1; i++) {
      var P = [xf(A[i][0], A[i][1], A[i][2]), xf(A[i + 1][0], A[i + 1][1], A[i + 1][2]),
               xf(Bo[i + 1][0], Bo[i + 1][1], Bo[i + 1][2]), xf(Bo[i][0], Bo[i][1], Bo[i][2])];
      var n = xn(nrm);
      var UV = [[A[i][0] * uvs, A[i][2] * uvs], [A[i + 1][0] * uvs, A[i + 1][2] * uvs],
                [Bo[i + 1][0] * uvs, Bo[i + 1][2] * uvs], [Bo[i][0] * uvs, Bo[i][2] * uvs]];
      B.quad(P, [n, n, n, n], UV, [col(P[0]), col(P[1]), col(P[2]), col(P[3])]);
    }
  }

  /* the depth of the opening between inner face (w=0) and outer face (w=-0.10) */
  function reveal(B, hole, U, V, tf, uvs, sides, depth) {
    var u0 = hole[0], u1 = hole[1], v0 = hole[2], v1 = hole[3];
    var wOut = -(depth === undefined ? (EX_HW - IN_HW) : depth);
    var i, cu = [], cv = [];
    for (i = 0; i < U.length; i++) if (U[i] > u0 + 1e-6 && U[i] < u1 - 1e-6) cu.push(U[i]);
    for (i = 0; i < V.length; i++) if (V[i] > v0 + 1e-6 && V[i] < v1 - 1e-6) cv.push(V[i]);
    var uu = [u0].concat(cu, [u1]), vv = [v0].concat(cv, [v1]);
    function rowU(v, w) { var r = [], k; for (k = 0; k < uu.length; k++) r.push([uu[k], v, w]); return r; }
    function rowV(u, w) { var r = [], k; for (k = 0; k < vv.length; k++) r.push([u, vv[k], w]); return r; }
    if (sides.top) strip(B, [rowU(v1, 0), rowU(v1, wOut)], [0, -1, 0], tf.p, tf.n, uvs, revealColour);
    if (sides.bot) strip(B, [rowU(v0, 0), rowU(v0, wOut)], [0, 1, 0], tf.p, tf.n, uvs, revealColour);
    if (sides.left) strip(B, [rowV(u0, 0), rowV(u0, wOut)], [1, 0, 0], tf.p, tf.n, uvs, revealColour);
    if (sides.right) strip(B, [rowV(u1, 0), rowV(u1, wOut)], [-1, 0, 0], tf.p, tf.n, uvs, revealColour);
  }

  /* 見切りの溝。壁面に彫る（出っ張らせると座席の背に当たる）。
     壁の切り U をそのまま使って T 字接合を作らない。 */
  function grooveRun(B, tf, U, u0, u1, v0, v1, d, uvs, col) {
    var i, sub = [], ch = DADO_CH;
    for (i = 0; i < U.length; i++) if (U[i] >= u0 - 1e-6 && U[i] <= u1 + 1e-6) sub.push(U[i]);
    if (sub.length < 2) return;
    function row(v, w) { var r = [], k; for (k = 0; k < sub.length; k++) r.push([sub[k], v, w]); return r; }
    var L = Math.sqrt(ch * ch + d * d);
    strip(B, [row(v0, 0), row(v0 + ch, -d)], [0, d / L, ch / L], tf.p, tf.n, uvs, col);
    strip(B, [row(v0 + ch, -d), row(v1 - ch, -d)], [0, 0, 1], tf.p, tf.n, uvs, col);
    strip(B, [row(v1 - ch, -d), row(v1, 0)], [0, -d / L, ch / L], tf.p, tf.n, uvs, col);
  }

  /* 丸紐（パイピング）。角丸長方形の稜に沿って断面 nSide の管を掃く。
     xf(a,b,w) -> world ／ xn([na,nb,nw]) -> world normal */
  function cord(B, cu, cv, rho, r, nSide, nArc, xf, xn, uvs, col) {
    var loops = [], nrms = [], i, j;
    for (i = 0; i <= nSide; i++) {
      var a = i / nSide * Math.PI * 2, ca = Math.cos(a), sa = Math.sin(a);
      var lp = rrLoop(cu, cv, rho + ca * r, nArc), q = [], qn = [];
      for (j = 0; j < lp.length; j++) {
        q.push([lp[j][0], lp[j][1], sa * r]);
        qn.push([lp[j][2] * ca, lp[j][3] * ca, sa]);
      }
      q.push(q[0]); qn.push(qn[0]);
      loops.push(q); nrms.push(qn);
    }
    for (i = 0; i < loops.length - 1; i++) {
      for (j = 0; j < loops[i].length - 1; j++) {
        var A = loops[i][j], Bp = loops[i][j + 1], C = loops[i + 1][j + 1], D = loops[i + 1][j];
        var P = [xf(A[0], A[1], A[2]), xf(Bp[0], Bp[1], Bp[2]),
                 xf(C[0], C[1], C[2]), xf(D[0], D[1], D[2])];
        var NN = [xn(nrms[i][j]), xn(nrms[i][j + 1]), xn(nrms[i + 1][j + 1]), xn(nrms[i + 1][j])];
        var UV = [[A[0] * uvs, A[1] * uvs], [Bp[0] * uvs, Bp[1] * uvs],
                  [C[0] * uvs, C[1] * uvs], [D[0] * uvs, D[1] * uvs]];
        B.quad(P, NN, UV, [col(), col(), col(), col()]);
      }
    }
  }

  /* 通路と座席下の見切り。座席下が 0.012 高い */
  function floorY(z) {
    var e = Math.abs(z);
    if (e <= AISLE_HW) return 0;
    if (e >= AISLE_HW + FLOOR_STEP_W) return FLOOR_STEP;
    return FLOOR_STEP * (e - AISLE_HW) / FLOOR_STEP_W;
  }

  function cylinder(B, ax, c, r, half, nseg, col) {
    /* ax: 0/1/2 axis index. c: centre. capped n-gon. */
    var a0 = (ax + 1) % 3, a1 = (ax + 2) % 3, i;
    function pt(k, side) {
      var a = k / nseg * Math.PI * 2, p = [0, 0, 0];
      p[ax] = c[ax] + side * half; p[a0] = c[a0] + Math.cos(a) * r; p[a1] = c[a1] + Math.sin(a) * r;
      return p;
    }
    for (i = 0; i < nseg; i++) {
      var A = pt(i, -1), Bp = pt(i + 1, -1), C = pt(i + 1, 1), D = pt(i, 1);
      var na = [0, 0, 0], nb = [0, 0, 0];
      na[a0] = Math.cos(i / nseg * Math.PI * 2); na[a1] = Math.sin(i / nseg * Math.PI * 2);
      nb[a0] = Math.cos((i + 1) / nseg * Math.PI * 2); nb[a1] = Math.sin((i + 1) / nseg * Math.PI * 2);
      B.quad([A, Bp, C, D], [na, nb, nb, na],
             [[i * 0.1, 0], [(i + 1) * 0.1, 0], [(i + 1) * 0.1, half], [i * 0.1, half]],
             [col(), col(), col(), col()]);
      var cA = [0, 0, 0], cB = [0, 0, 0];
      cA[ax] = c[ax] - half; cA[a0] = c[a0]; cA[a1] = c[a1];
      cB[ax] = c[ax] + half; cB[a0] = c[a0]; cB[a1] = c[a1];
      var nm = [0, 0, 0], np = [0, 0, 0]; nm[ax] = -1; np[ax] = 1;
      B.quad([cA, A, Bp, cA], [nm, nm, nm, nm], [[0, 0], [1, 0], [1, 1], [0, 0]],
             [col(), col(), col(), col()]);
      B.quad([cB, D, C, cB], [np, np, np, np], [[0, 0], [1, 0], [1, 1], [0, 0]],
             [col(), col(), col(), col()]);
    }
  }

  /* ============================ 11. build : shell ========================= */

  var WIN_HOLES = [], DOOR_HOLE = [-DOOR_HW, DOOR_HW, 0, DOOR_H];
  (function () {
    for (var i = 0; i < XS.length; i++) WIN_HOLES.push([XS[i] - WIN_HW, XS[i] + WIN_HW, WIN_Y0, WIN_Y1]);
  })();

  function sideCutsU(outer) {
    var U = [-IN_HL, IN_HL, -DOOR_HW, DOOR_HW, 0], i;
    if (outer) { U.push(-EX_HL); U.push(EX_HL); }
    for (i = 0; i < XS.length; i++) { U.push(XS[i] - WIN_HW); U.push(XS[i] + WIN_HW); U.push(XS[i]); }
    for (i = -4; i <= 4; i++) U.push(i * 2.4);
    return uniq(U);
  }
  function sideCutsV(outer) {
    var V = outer
      ? [SILL_Y, -0.16, 0, 0.36, WIN_Y0, WIN_CY, WIN_Y1, DOOR_H, EAVE_Y]
      : [0, 0.04, 0.12, 0.26, 0.50, DADO_V0, DADO_V1, WIN_Y0, WIN_CY, WIN_Y1,
         DOOR_H, 2.05, LINE_CY, 2.27, 2.35, IN_H];
    return uniq(V);
  }

  /* 屋根 : crown = ROOF_Y、半幅 EX_HW での落ち = ROOF_CAMBER の弧。
     |z| = IN_HW での高さは 2.478 で、天井面 IN_H = 2.42 を必ず越える。
     （v2 は 2.183 で天井の縁が屋根の外へ 0.067 突き抜けていた） */
  var EAVE_R = 0.07, ROOF_CAMBER = 0.16;
  var ROOF_R = (EX_HW * EX_HW + ROOF_CAMBER * ROOF_CAMBER) / (2 * ROOF_CAMBER);
  var ROOF_YC = ROOF_Y - ROOF_R;
  /* EAVE_Y : where the flat body side meets the eaves fillet (internal tangency) */
  var EAVE_Y = ROOF_YC + Math.sqrt((ROOF_R - EAVE_R) * (ROOF_R - EAVE_R) -
                                   (EX_HW - EAVE_R) * (EX_HW - EAVE_R));

  function roofProfile() {
    /* (z, y) from -EX_HW round to +EX_HW, eaves filleted into the crown arc */
    var pts = [], i, n = 5, m = 22;
    var fz = -(EX_HW - EAVE_R), fy = EAVE_Y;                 /* fillet centre  */
    var d = Math.sqrt((ROOF_R - EAVE_R) * (ROOF_R - EAVE_R) - fz * fz);
    var tz = fz * ROOF_R / (ROOF_R - EAVE_R);
    var ty = ROOF_YC + d * ROOF_R / (ROOF_R - EAVE_R);
    var a0 = Math.atan2(fy - fy, -EX_HW - fz);               /* = PI          */
    var a1 = Math.atan2(ty - fy, tz - fz);
    a0 = Math.PI;
    for (i = 0; i <= n; i++) {
      var a = a0 + (a1 - a0) * i / n;
      pts.push([fz + EAVE_R * Math.cos(a), fy + EAVE_R * Math.sin(a)]);
    }
    var b0 = Math.atan2(ty - ROOF_YC, tz), b1 = Math.PI / 2;
    for (i = 1; i <= m; i++) {
      var b = b0 + (b1 - b0) * i / m;
      pts.push([ROOF_R * Math.cos(b), ROOF_YC + ROOF_R * Math.sin(b)]);
    }
    var half = pts.length;
    for (i = half - 2; i >= 0; i--) pts.push([-pts[i][0], pts[i][1]]);
    return pts;
  }

  function buildShell(B, FLOOR, FRAMES) {
    var i, j, s, e;
    var Ui = sideCutsU(false), Vi = sideCutsV(false);
    var Uo = sideCutsU(true), Vo = sideCutsV(true);
    var holes = WIN_HOLES.concat([DOOR_HOLE]);

    /* v5 : 腰の見切りは壁を彫って作る。板の列を一行抜く */
    var holesIn = holes.concat([[-IN_HL, IN_HL, DADO_V0, DADO_V1]]);
    for (s = -1; s <= 1; s += 2) {
      var ti = wallIn(s), to = wallOut(s);
      /* v5 : 世界法線を渡す。v4 までは [0,0,1] のままで +z 側が裏返っていた */
      var nIn = ti.n([0, 0, 1]), nOut = to.n([0, 0, 1]);
      panel(B, Ui, Vi, holesIn, ti.p, nIn, 4.5, shellColour);
      panel(B, Uo, Vo, holes, to.p, nOut, 4.5, shellColour);
      grooveRun(B, ti, Ui, -IN_HL, -DOOR_HW, DADO_V0, DADO_V1, DADO_D, 4.5, grooveColour);
      grooveRun(B, ti, Ui, DOOR_HW, IN_HL, DADO_V0, DADO_V1, DADO_D, 4.5, grooveColour);
      for (i = 0; i < WIN_HOLES.length; i++) {
        reveal(B, WIN_HOLES[i], Ui, Vi, ti, 4.5, { top: 1, bot: 1, left: 1, right: 1 });
        ring(FRAMES, WIN_CORE_U, WIN_CORE_V, XS[i], WIN_CY, WIN_PROF_IN, 8, ti.p, ti.n, 4.5, shellColourP);
        ring(FRAMES, WIN_CORE_U, WIN_CORE_V, XS[i], WIN_CY, WIN_PROF_OUT, 8, to.p, to.n, 4.5, shellColourP);
      }
      reveal(B, DOOR_HOLE, Ui, Vi, ti, 4.5, { top: 1, bot: 0, left: 1, right: 1 });
      ring(B, DOOR_CORE_U, DOOR_CORE_V, 0, DOOR_CV, DOOR_PROF_IN, 4, ti.p, ti.n, 4.5, shellColourP);
      ring(B, DOOR_CORE_U, DOOR_CORE_V, 0, DOOR_CV, DOOR_PROF_OUT, 4, to.p, to.n, 4.5, shellColourP);
      (function (tf) {
        var wp = IN_HW - 1.696, P = [tf.p(-DOOR_HW, -0.02, wp), tf.p(DOOR_HW, -0.02, wp),
                                     tf.p(DOOR_HW, DOOR_H, wp), tf.p(-DOOR_HW, DOOR_H, wp)];
        var n = tf.n([0, 0, 1]), dk = [0.15, 0.15, 0.15];
        B.quad(P, [n, n, n, n], [[0, 0], [4, 0], [4, 5], [0, 5]], [dk, dk, dk, dk]);
      })(ti);
      /* the housing the line sits in */
      rbox({
        buf: B, c: [0, LINE_CY, s * (IN_HW - 0.012)], h: [0.50, 0.105, 0.012],
        r: 0.010, nseg: 2,
        mask: { xn: 1, xp: 1, yn: 1, yp: 1, zn: s > 0 ? 1 : 0, zp: s > 0 ? 0 : 1 },
        uvs: 4.5, col: function () { return [0.40, 0.40, 0.40]; }
      });
    }

    /* floor - v2 : the seam is closed two ways
       (1) the end rows carry every cut the side wall (sideCutsU) and the end
           wall use, so at y = 0 the floor and the walls share vertices and no
           T-junction is left on either seam.
       (2) the sheet then laps FLOOR_LAP past the inner faces, so the walls
           stand ON the floor sheet instead of meeting it along a shared edge.
           A lapped joint cannot open a pinhole however the rounding falls.
           In z the sheet runs the whole way to the body side (EX_HW), so the
           pocket behind the door leaves has a floor too: through the 8 mm slot
           between the leaves the eye used to see under the backing panel and
           out of the car (v1: measured 33 px at pitch -0.30). In x, FLOOR_LAP is
           enough - the end wall pocket is already closed by the underframe.
           All of the lap hides inside the side wall (0.10 thick) and behind
           the end wall (0.40), so none of it is ever seen. */
    var FU = [], FV = [-EX_HW, -IN_HW, -1.60, -1.52, -1.40, -1.25, -1.10,
                       -(AISLE_HW + FLOOR_STEP_W), -AISLE_HW,
                       0, AISLE_HW, AISLE_HW + FLOOR_STEP_W,
                       1.10, 1.25, 1.40, 1.52, 1.60, IN_HW, EX_HW];
    var FCUT = sideCutsU(false);
    for (i = -24; i <= 24; i++) FU.push(i * 0.4);
    for (i = 0; i < FCUT.length; i++) FU.push(FCUT[i]);
    /* v5 : 妻壁の貫通扉が 0.03 凹むので、床はその奥まで通す（隙間を作らない） */
    FU.push(-IN_HL - EDOOR_REV - 0.010); FU.push(IN_HL + EDOOR_REV + 0.010);
    FU = uniq(FU);
    for (i = 0; i < FU.length - 1; i++) {
      for (j = 0; j < FV.length - 1; j++) {
        var za = FV[j], zb = FV[j + 1], ya = floorY(za), yb = floorY(zb);
        var P = [[FU[i], ya, za], [FU[i + 1], ya, za], [FU[i + 1], yb, zb], [FU[i], yb, zb]];
        var nq;
        if (Math.abs(yb - ya) < 1e-9) nq = [0, 1, 0];
        else {
          var dz = zb - za, dy = yb - ya, LL = Math.sqrt(dz * dz + dy * dy);
          nq = [0, dz / LL, -dy / LL];
        }
        var N = [nq, nq, nq, nq];
        var UV = [], C = [], k;
        for (k = 0; k < 4; k++) { UV.push([P[k][0] * 3.0, P[k][2] * 3.0]); C.push(floorColour(P[k][0], 0, P[k][2])); }
        FLOOR.quad(P, N, UV, C);
      }
    }
    /* end walls, inner face —— v5 : 明度を落とし、貫通扉の輪郭を入れる */
    var EDOOR_HOLE = [-EDOOR_HW, EDOOR_HW, 0, EDOOR_H];
    var EU = uniq([-IN_HW, -1.40, -1.10, -0.55, -EDOOR_HW, -0.22, 0, 0.22,
                   EDOOR_HW, 0.55, 1.10, 1.40, IN_HW]);
    var EV = uniq([0, 0.04, 0.12, 0.26, 0.60, 1.05, 1.50, EDOOR_H, 2.05, 2.15, 2.30, IN_H]);
    for (e = -1; e <= 1; e += 2) {
      var te = endIn(e), nEnd = te.n([0, 0, 1]);
      panel(B, EU, EV, [EDOOR_HOLE], te.p, nEnd, 4.5, endColour);
      reveal(B, EDOOR_HOLE, EU, EV, te, 4.5,
             { top: 1, bot: 0, left: 1, right: 1 }, EDOOR_REV);
      ring(B, EDOOR_CU, EDOOR_CV, 0, EDOOR_CY, EDOOR_PROF, 4, te.p, te.n, 4.5, endColourP);
      /* 戸。取っ手は付けない。窓も入れない */
      (function (tf) {
        function leafP(u, v) { return tf.p(u, v, -EDOOR_REV); }
        panel(B, [-EDOOR_HW, -0.22, 0, 0.22, EDOOR_HW],
              [0, 0.30, DADO_V0, 1.20, 1.60, EDOOR_H], [], leafP, nEnd, 4.5, leafColour);
        ring(B, ELEAF_CU, ELEAF_CV, 0, ELEAF_CY, ELEAF_PROF, 3,
             function (u, v, w) { return tf.p(u, v, w - EDOOR_REV); }, tf.n, 4.5, leafColourP);
      })(te);
    }
    /* exterior : roof, ends, underframe */
    var rp = roofProfile();
    var RX = [];
    for (i = -10; i <= 10; i++) RX.push(i * 1.0);
    for (i = 0; i < RX.length - 1; i++) {
      for (j = 0; j < rp.length - 1; j++) {
        var q0 = rp[j], q1 = rp[j + 1];
        var Pr = [[RX[i], q0[1], q0[0]], [RX[i + 1], q0[1], q0[0]],
                  [RX[i + 1], q1[1], q1[0]], [RX[i], q1[1], q1[0]]];
        var n0 = roofNormal(q0), n1 = roofNormal(q1);
        B.quad(Pr, [n0, n0, n1, n1],
               [[RX[i] * 2.2, q0[0] * 2.2], [RX[i + 1] * 2.2, q0[0] * 2.2],
                [RX[i + 1] * 2.2, q1[0] * 2.2], [RX[i] * 2.2, q1[0] * 2.2]],
               [shellColour(0, 2.3, 0), shellColour(0, 2.3, 0), shellColour(0, 2.3, 0), shellColour(0, 2.3, 0)]);
      }
    }
    /* end caps at x = +/-10 : rectangle to the eaves, then the arch */
    for (e = -1; e <= 1; e += 2) {
      var x = e * EX_HL, nx = [e, 0, 0];
      var ZC = [-EX_HW, -1.30, -0.55, 0, 0.55, 1.30, EX_HW];
      var YC = [SILL_Y, 0, 0.9, 1.6, 2.1, EAVE_Y];
      for (i = 0; i < ZC.length - 1; i++) {
        for (j = 0; j < YC.length - 1; j++) {
          B.quad([[x, YC[j], ZC[i]], [x, YC[j], ZC[i + 1]], [x, YC[j + 1], ZC[i + 1]], [x, YC[j + 1], ZC[i]]],
                 [nx, nx, nx, nx],
                 [[ZC[i] * 2.2, YC[j] * 2.2], [ZC[i + 1] * 2.2, YC[j] * 2.2],
                  [ZC[i + 1] * 2.2, YC[j + 1] * 2.2], [ZC[i] * 2.2, YC[j + 1] * 2.2]],
                 [shellColour(x, YC[j], ZC[i]), shellColour(x, YC[j], ZC[i + 1]),
                  shellColour(x, YC[j + 1], ZC[i + 1]), shellColour(x, YC[j + 1], ZC[i])]);
        }
      }
      for (j = 0; j < rp.length - 1; j++) {
        B.quad([[x, EAVE_Y, rp[j][0]], [x, EAVE_Y, rp[j + 1][0]],
                [x, rp[j + 1][1], rp[j + 1][0]], [x, rp[j][1], rp[j][0]]],
               [nx, nx, nx, nx],
               [[rp[j][0] * 2.2, 0], [rp[j + 1][0] * 2.2, 0],
                [rp[j + 1][0] * 2.2, rp[j + 1][1] * 2.2], [rp[j][0] * 2.2, rp[j][1] * 2.2]],
               [shellColour(x, 2.2, 0), shellColour(x, 2.2, 0), shellColour(x, 2.2, 0), shellColour(x, 2.2, 0)]);
      }
    }
    /* underfloor */
    var nu = [0, -1, 0];
    B.quad([[-EX_HL, SILL_Y, -EX_HW], [EX_HL, SILL_Y, -EX_HW], [EX_HL, SILL_Y, EX_HW], [-EX_HL, SILL_Y, EX_HW]],
           [nu, nu, nu, nu], [[0, 0], [12, 0], [12, 2], [0, 2]],
           [darkColour(), darkColour(), darkColour(), darkColour()]);
    rbox({ buf: B, c: [0, -0.47, 0], h: [9.60, 0.15, 1.60], r: R_OUT, nseg: 3,
           mask: { xn: 1, xp: 1, yn: 1, yp: 0, zn: 1, zp: 1 }, uvs: 2.2, col: darkColour });
  }

  function roofNormal(q) {
    var z = q[0], y = q[1];
    var dz = z - 0, dy = y - ROOF_YC;
    var m = Math.sqrt(dz * dz + dy * dy) || 1;
    if (y < EAVE_Y + 0.002) { return [0, 0, z < 0 ? -1 : 1]; }
    return [0, dy / m, dz / m];
  }

  /* ============================ 12. seats ================================= */
  /* one seat unit in local coords: back plane at x = 0, facing +x,
     centred on z = 0, floor at y = 0.  20 boxes = 40 units. */

  var WEAR_LO = 0.70, WEAR_HI = 0.90, WEAR_TOP = 1.018;

  function seatCol(x, y, z) {
    var c = 1.0;
    if (y < 0.30) c *= 0.86 + (y / 0.30) * 0.14;      /* into the floor shadow */
    return [c, c, c];
  }

  function buildSeat(bPlain, bWorn) {
    /* backrest —— v5 : 丸紐が外へ 0.006 出るぶん布を締める。
       組み立て全体では契約どおり 上端 1.05・幅（z）1.10 */
    rbox({
      c: [BACK_T * 0.5, BACK_CY, 0],
      h: [BACK_T * 0.5, BACK_HY, CLOTH_HZ],
      r: R_OUT, nseg: 3,
      mask: { xn: 0, xp: 1, yn: 1, yp: 1, zn: 1, zp: 1 },
      extras: { y: [WEAR_LO - BACK_CY, WEAR_HI - BACK_CY, WEAR_TOP - BACK_CY] },
      subs: [1, 16, 18], uvs: 12.5, col: seatCol,
      pick: function (fa, fs, mid) {
        var y = mid[1] + BACK_CY;
        if (y > WEAR_TOP) return bWorn;
        if (fa === 2 && y > WEAR_LO && y < WEAR_HI) return bWorn;
        return bPlain;
      }
    });
    /* cushion —— 背との間に隙間 0.02 */
    rbox({
      buf: bPlain,
      c: [CUSH_CX, CUSH_CY, 0],
      h: [CUSH_HX, 0.05, CLOTH_HZ],
      r: R_OUT, nseg: 3,
      mask: { xn: 1, xp: 1, yn: 1, yp: 1, zn: 1, zp: 1 },
      subs: [14, 1, 18], uvs: 12.5, col: seatCol
    });
    return null;
  }

  /* 縁のパイピング。座面と背の周りを一周する（ref2） */
  function buildPipe(B) {
    /* 座面：角丸長方形は x-z 面、管の軸方向 w は y */
    cord(B, CUSH_HX - PIPE_RHO, CLOTH_HZ - PIPE_RHO, PIPE_RHO, PIPE_R, 6, 2,
      function (a, b, w) { return [CUSH_CX + a, CUSH_CY + w, b]; },
      function (n) { return [n[0], n[2], n[1]]; }, 6.0, pipeColour);
    /* 背：角丸長方形は y-z 面、管の軸方向 w は x */
    cord(B, BACK_HY - PIPE_RHO, CLOTH_HZ - PIPE_RHO, PIPE_RHO, PIPE_R, 6, 2,
      function (a, b, w) { return [BACK_T * 0.5 + w, BACK_CY + a, b]; },
      function (n) { return [n[2], n[0], n[1]]; }, 6.0, pipeColour);
  }

  /* v5 : 塊の台座をやめ、薄板の脚・貫・受け板にした（ref2）。
     床（座席下は y = FLOOR_STEP）へ接地する */
  function buildSeatFrame(B) {
    var zs;
    /* 座面の受け板 */
    rbox({
      buf: B, c: [CUSH_CX, 0.332, 0], h: [CUSH_HX + 0.002, 0.010, 0.500],
      r: 0.005, nseg: 1, mask: { xn: 1, xp: 1, yn: 1, yp: 0, zn: 1, zp: 1 },
      uvs: 5.0, col: frameColour
    });
    /* 脚（薄い板） */
    for (zs = -1; zs <= 1; zs += 2) {
      rbox({
        buf: B, c: [0.330, (FLOOR_STEP - 0.006 + 0.322) * 0.5, zs * 0.420],
        h: [0.170, (0.322 - FLOOR_STEP + 0.006) * 0.5, 0.010],
        r: 0.005, nseg: 1, mask: { xn: 1, xp: 1, yn: 0, yp: 0, zn: 1, zp: 1 },
        uvs: 5.0, col: frameColour
      });
    }
    /* 貫 */
    rbox({
      buf: B, c: [0.300, 0.105, 0], h: [0.028, 0.013, 0.420],
      r: 0.005, nseg: 1, mask: { xn: 1, xp: 1, yn: 1, yp: 1, zn: 0, zp: 0 },
      uvs: 5.0, col: frameColour
    });
    return null;
  }

  /* ------- v5 : 窓台・小窓の割り・荷棚・幅木・天井のリブ ---------------- */

  function buildSills(B) {
    var s, i;
    for (s = -1; s <= 1; s += 2) {
      for (i = 0; i < XS.length; i++) {
        rbox({
          buf: B, c: [XS[i], SILL_TOP - SILL_T * 0.5, s * (IN_HW - SILL_D * 0.5 + EMB * 0.5)],
          h: [SILL_HX, SILL_T * 0.5, (SILL_D + EMB) * 0.5],
          r: 0.008, nseg: 1,
          mask: { xn: 1, xp: 1, yn: 1, yp: 1, zn: s > 0 ? 1 : 0, zp: s > 0 ? 0 : 1 },
          uvs: 4.5, col: shellColour
        });
      }
    }
  }

  function buildSash(B) {
    var s, i;
    for (s = -1; s <= 1; s += 2) {
      for (i = 0; i < XS.length; i++) {
        rbox({
          buf: B, c: [XS[i], SASH_Y, s * 1.674], h: [0.584, 0.024, 0.010],
          r: 0.005, nseg: 1,
          mask: { xn: 0, xp: 0, yn: 1, yp: 1, zn: 1, zp: 1 },
          uvs: 4.5, col: shellColour
        });
      }
    }
  }

  function buildSkirt(B) {
    var s, e, i, sp = [[-IN_HL, -DOOR_HW], [DOOR_HW, IN_HL]];
    for (s = -1; s <= 1; s += 2) {
      for (i = 0; i < 2; i++) {
        rbox({
          buf: B, c: [(sp[i][0] + sp[i][1]) * 0.5, (FLOOR_STEP - 0.006 + SKIRT_TOP) * 0.5,
                      s * (IN_HW - SKIRT_HZ + EMB)],
          h: [(sp[i][1] - sp[i][0]) * 0.5, (SKIRT_TOP - FLOOR_STEP + 0.006) * 0.5, SKIRT_HZ],
          r: 0.006, nseg: 1,
          mask: { xn: 0, xp: 0, yn: 0, yp: 1, zn: s > 0 ? 1 : 0, zp: s > 0 ? 0 : 1 },
          uvs: 4.5, col: shellColour
        });
      }
    }
    for (e = -1; e <= 1; e += 2) {
      for (s = -1; s <= 1; s += 2) {
        rbox({
          buf: B, c: [e * (IN_HL - SKIRT_HZ + EMB), (FLOOR_STEP - 0.006 + SKIRT_TOP) * 0.5,
                      s * (EDOOR_HW + IN_HW) * 0.5],
          h: [SKIRT_HZ, (SKIRT_TOP - FLOOR_STEP + 0.006) * 0.5, (IN_HW - EDOOR_HW) * 0.5],
          r: 0.006, nseg: 1,
          mask: { xn: e > 0 ? 1 : 0, xp: e > 0 ? 0 : 1, yn: 0, yp: 1, zn: 0, zp: 0 },
          uvs: 4.5, col: endColour
        });
      }
    }
  }

  /* 荷棚。原文に記述は無い。参考画像に共通し「客車」に見える最大の要素。
     parts.rack で独立させてあるので、外すのは visible = false 一つで済む。 */
  function buildRack(B) {
    var s, i, sp = [[-RACK_X1, -RACK_X0], [RACK_X0, RACK_X1]];
    for (s = -1; s <= 1; s += 2) {
      for (i = 0; i < 2; i++) {
        rbox({
          buf: B, c: [(sp[i][0] + sp[i][1]) * 0.5, RACK_Y + RACK_T * 0.5,
                      s * (IN_HW - RACK_D * 0.5 + EMB * 0.5)],
          h: [(sp[i][1] - sp[i][0]) * 0.5, RACK_T * 0.5, (RACK_D + EMB) * 0.5],
          r: 0.010, nseg: 2,
          mask: { xn: 1, xp: 1, yn: 1, yp: 1, zn: s > 0 ? 1 : 0, zp: s > 0 ? 0 : 1 },
          uvs: 3.0, col: rackColour
        });
      }
      for (i = 0; i < BRK_X.length; i++) {
        var e;
        for (e = -1; e <= 1; e += 2) {
          rbox({
            buf: B, c: [e * BRK_X[i], RACK_Y - 0.0335, s * (IN_HW - 0.128 + EMB * 0.5)],
            h: [0.011, 0.0365, (0.256 + EMB) * 0.5],
            r: 0.004, nseg: 1,
            mask: { xn: 1, xp: 1, yn: 1, yp: 0, zn: s > 0 ? 1 : 0, zp: s > 0 ? 0 : 1 },
            uvs: 3.0, col: rackColour
          });
        }
      }
    }
  }

  function buildRibs(B) {
    var i, s;
    for (i = 0; i < RIB_Z.length; i++) {
      for (s = (RIB_Z[i] === 0 ? 1 : -1); s <= 1; s += 2) {
        rbox({
          buf: B, c: [0, IN_H - RIB_D * 0.5 + EMB * 0.5, s * RIB_Z[i]],
          h: [9.30, (RIB_D + EMB) * 0.5, RIB_HW],
          r: 0.004, nseg: 1,
          mask: { xn: 1, xp: 1, yn: 1, yp: 0, zn: 1, zp: 1 },
          uvs: 1.5, col: ribColour
        });
      }
    }
  }

  function seatMatrices() {
    var out = [], i, mtx, q0 = new T.Quaternion(), q1 = new T.Quaternion();
    q1.setFromAxisAngle(new T.Vector3(0, 1, 0), Math.PI);
    var one = new T.Vector3(1, 1, 1);
    for (i = 0; i < XS.length; i++) {
      for (var zs = -1; zs <= 1; zs += 2) {
        mtx = new T.Matrix4();
        mtx.compose(new T.Vector3(XS[i] - BOX_HALF, 0, zs * SEAT_CZ), q0, one);
        out.push(mtx);
        mtx = new T.Matrix4();
        mtx.compose(new T.Vector3(XS[i] + BOX_HALF, 0, zs * SEAT_CZ), q1, one);
        out.push(mtx);
      }
    }
    return out;
  }

  /* ============================ 13. loose pieces ========================== */

  function buildGlass(B) {
    for (var s = -1; s <= 1; s += 2) {
      var tf = wallIn(s), w = IN_HW - GLASS_Z;
      for (var i = 0; i < XS.length; i++) {
        var u0 = XS[i] - WIN_HW, u1 = XS[i] + WIN_HW;
        var P = [tf.p(u0, WIN_Y0, w), tf.p(u1, WIN_Y0, w), tf.p(u1, WIN_Y1, w), tf.p(u0, WIN_Y1, w)];
        var n = tf.n([0, 0, 1]);
        B.quad(P, [n, n, n, n], [[0, 0], [1, 0], [1, 1], [0, 1]],
               [[1, 1, 1], [1, 1, 1], [1, 1, 1], [1, 1, 1]]);
      }
    }
  }

  function buildDoorLeaf(B, s, lr) {
    /* leaf sits just behind the surround; slides along +/-u */
    var tf = wallIn(s);
    var u0 = lr > 0 ? 0.004 : -0.820, u1 = lr > 0 ? 0.820 : -0.004;
    var uc = (u0 + u1) * 0.5, hu = (u1 - u0) * 0.5;
    var vc = 0.97, hv = 1.03;
    var wc = IN_HW - 1.6405 - 0.020;      /* centre of a 0.04 thick leaf */
    var tmp = new Buf();
    rbox({
      buf: tmp, c: [0, 0, 0], h: [hu, hv, 0.020], r: R_EDGE, nseg: 2,
      mask: { xn: 1, xp: 1, yn: 0, yp: 1, zn: 0, zp: 1 },
      uvs: 4.0, col: function () { return [1, 1, 1]; }
    });
    /* v5 : 召し合わせの立ち（戸当たり）と腰の桟。窓は入れない */
    var lead = -lr;
    rbox({
      buf: tmp, c: [lead * (hu - 0.020), 0, 0.024], h: [0.020, hv - 0.018, 0.004],
      r: 0.003, nseg: 1, mask: { xn: 1, xp: 1, yn: 1, yp: 1, zn: 0, zp: 1 },
      uvs: 4.0, col: function () { return [1, 1, 1]; }
    });
    rbox({
      buf: tmp, c: [0, DADO_V0 + 0.012 - vc, 0.0225], h: [hu - 0.026, 0.012, 0.0025],
      r: 0.0015, nseg: 1, mask: { xn: 1, xp: 1, yn: 1, yp: 1, zn: 0, zp: 1 },
      uvs: 4.0, col: function () { return [1, 1, 1]; }
    });
    B.append(tmp,
      function (p) { return tf.p(uc + p[0], vc + p[1], wc + p[2]); },
      function (n) { return tf.n(n); },
      function (p) { var y = vc + p[1]; var c = y < 0.34 ? 0.62 + y * 0.7 : 0.86; return [c, c, c]; });
  }

  function buildLine(B) {
    for (var s = -1; s <= 1; s += 2) {
      var tf = wallIn(s), w = IN_HW - 1.6255;
      var u0 = -LINE_W * 0.5, u1 = LINE_W * 0.5;
      var v0 = LINE_CY - LINE_H * 0.5, v1 = LINE_CY + LINE_H * 0.5;
      var P = [tf.p(u0, v0, w), tf.p(u1, v0, w), tf.p(u1, v1, w), tf.p(u0, v1, w)];
      var n = tf.n([0, 0, 1]);
      B.quad(P, [n, n, n, n], [[0, 0], [1, 0], [1, 1], [0, 1]],
             [[1, 1, 1], [1, 1, 1], [1, 1, 1], [1, 1, 1]]);
    }
  }

  function buildBands(B) {
    for (var s = -1; s <= 1; s += 2) {
      rbox({
        buf: B, c: [0, BAND_Y + 0.007, s * BAND_Z], h: [BAND_HL, 0.007, BAND_HW],
        r: 0.005, nseg: 2,
        mask: { xn: 1, xp: 1, yn: 1, yp: 0, zn: 1, zp: 1 },
        uvs: 3.0, col: function () { return [1, 1, 1]; }
      });
    }
  }

  function buildDecals(B) {
    var i, zs, k, mats = seatMatrices(), v = new T.Vector3();
    for (i = 0; i < mats.length; i++) {
      var m = mats[i];
      /* footprint centre = the seat frame; the board is symmetric about it */
      v.set(0.330, 0, 0).applyMatrix4(m);
      var dy = FLOOR_STEP + 0.004;
      var P = [[v.x - DEC_HU, dy, v.z - DEC_HV], [v.x + DEC_HU, dy, v.z - DEC_HV],
               [v.x + DEC_HU, dy, v.z + DEC_HV], [v.x - DEC_HU, dy, v.z + DEC_HV]];
      B.quad(P, [[0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0]],
             [[0, 0], [1, 0], [1, 1], [0, 1]],
             [[1, 1, 1], [1, 1, 1], [1, 1, 1], [1, 1, 1]]);
    }
  }

  /* two flat boards outside the car so the windows are readable on the
     review page. the host removes userData.parts.stub. */
  function buildStub(B) {
    /* 契約 c2 §2 の空と土。トーンマップを通さないので linear に直して渡す */
    var sky = s2l(U3('SKY_MID', [0.604, 0.639, 0.612]));
    var gnd = s2l(U3('GROUND', [0.373, 0.353, 0.329]));
    var H = RAIL_Y, i;
    function board(a, b, c, d, col) {
      B.quad([a, b, c, d], [[0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1]],
             [[0, 0], [1, 0], [1, 1], [0, 1]], [col, col, col, col]);
    }
    for (i = -1; i <= 1; i += 2) {
      board([-140, -24, i * 40], [140, -24, i * 40], [140, H, i * 40], [-140, H, i * 40], gnd);
      board([-140, H, i * 40], [140, H, i * 40], [140, 34, i * 40], [-140, 34, i * 40], sky);
      board([i * 90, -24, -140], [i * 90, -24, 140], [i * 90, H, 140], [i * 90, H, -140], gnd);
      board([i * 90, H, -140], [i * 90, H, 140], [i * 90, 34, 140], [i * 90, 34, -140], sky);
    }
  }

  /* ============================ 14. build ================================= */

  var GRP = null, PARTS = null, SEAT_N = 0;

  function smoothstep(a, b, x) {
    var t = (x - a) / (b - a);
    if (t < 0) t = 0; if (t > 1) t = 1;
    return t * t * (3 - 2 * t);
  }

  function buildCeiling(B) {
    var CX = [], CZ = [-IN_HW, -1.58, -1.42, -1.10, -0.85, -0.68, -0.51, -0.25,
                       0, 0.25, 0.51, 0.68, 0.85, 1.10, 1.42, 1.58, IN_HW], i, j;
    for (i = -8; i <= 8; i++) CX.push(i * 1.2);
    for (i = 0; i < CX.length - 1; i++) {
      for (j = 0; j < CZ.length - 1; j++) {
        var P = [[CX[i], IN_H, CZ[j]], [CX[i + 1], IN_H, CZ[j]],
                 [CX[i + 1], IN_H, CZ[j + 1]], [CX[i], IN_H, CZ[j + 1]]];
        var N = [[0, -1, 0], [0, -1, 0], [0, -1, 0], [0, -1, 0]], UV = [], C = [], k;
        for (k = 0; k < 4; k++) { UV.push([P[k][0] * 1.5, P[k][2] * 1.5]); C.push(ceilColour(0, 0, P[k][2])); }
        B.quad(P, N, UV, C);
      }
    }
    buildRibs(B);
  }

  function build() {
    var m = mats();
    var g = new T.Group();
    g.name = 'car';

    var bShell = new Buf(), bFloor = new Buf(), bWindow = new Buf(); buildShell(bShell, bFloor, bWindow);
    buildSills(bWindow); buildSash(bWindow); buildSkirt(bShell);
    var bRack = new Buf(); buildRack(bRack);
    var bPipe = new Buf(); buildPipe(bPipe);
    var bCeil = new Buf(); buildCeiling(bCeil);
    var bFab = new Buf(), bWorn = new Buf(); buildSeat(bFab, bWorn);
    var bFrm = new Buf(); buildSeatFrame(bFrm);
    var bGlass = new Buf(); buildGlass(bGlass);
    var bBand = new Buf(); buildBands(bBand);
    var bLine = new Buf(); buildLine(bLine);
    var bDec = new Buf(); buildDecals(bDec);
    var bStub = new Buf(); buildStub(bStub);

    var shell = new T.Mesh(bShell.geo(), m.shell);
    shell.name = 'shell'; shell.castShadow = false; shell.receiveShadow = true;
    var floor = new T.Mesh(bFloor.geo(), m.floor); floor.name = 'floor'; floor.receiveShadow = true;
    var ceil = new T.Mesh(bCeil.geo(), m.ceil);
    ceil.name = 'ceiling'; ceil.castShadow = false; ceil.receiveShadow = true;

    var mtx = seatMatrices();
    SEAT_N = mtx.length;
    var col = new T.Color();
    function inst(geo, mat, nm, log) {
      var im = new T.InstancedMesh(geo, mat, SEAT_N);
      var i;
      rseed(70931);
      for (i = 0; i < SEAT_N; i++) {
        im.setMatrixAt(i, mtx[i]);
        var v = 0.978 + rnd() * 0.030;
        col.setRGB(v, v, v * 0.998);
        im.setColorAt(i, col);
      }
      im.instanceMatrix.needsUpdate = true;
      if (im.instanceColor) im.instanceColor.needsUpdate = true;
      im.castShadow = true; im.receiveShadow = true;
      im.frustumCulled = false;
      im.name = nm;
      im.userData.h53log = log;
      return im;
    }
    var seatFab = inst(bFab.geo(), m.fab, 'seat-cloth', 'seat');
    var seatWorn = inst(bWorn.geo(), m.fabW, 'seat-worn', 'seat');
    var seatFrm = inst(bFrm.geo(), m.frame, 'seat-frame', 'seat');
    var seatPipe = inst(bPipe.geo(), m.pipe, 'seat-pipe', 'seat');

    var rack = new T.Mesh(bRack.geo(), m.frame);
    rack.name = 'rack'; rack.userData.h53log = 'rack';
    rack.castShadow = false; rack.receiveShadow = true;

    var glass = new T.Mesh(bGlass.geo(), m.glass);
    glass.name = 'glass'; glass.userData.h53log = 'window';
    glass.castShadow = false; glass.receiveShadow = false; glass.renderOrder = 3;

    var bands = new T.Mesh(bBand.geo(), m.band);
    bands.name = 'bands'; bands.userData.h53log = 'band';
    bands.castShadow = false; bands.receiveShadow = false;

    var line = new T.Mesh(bLine.geo(), m.line);
    line.name = 'doorline'; line.userData.h53log = 'doorline';
    line.castShadow = false; line.receiveShadow = false;

    var decals = new T.Mesh(bDec.geo(), m.decal);
    decals.name = 'contact'; decals.castShadow = false; decals.receiveShadow = false;
    decals.renderOrder = 2;

    var stub = new T.Mesh(bStub.geo(), m.stub);
    stub.name = 'stub'; stub.castShadow = false; stub.receiveShadow = false;
    stub.frustumCulled = false; stub.renderOrder = -1;

    function doorGroup(s, nm) {
      var gg = new T.Group(); gg.name = nm;
      var lv = [], k;
      for (k = -1; k <= 1; k += 2) {
        var b = new Buf(); buildDoorLeaf(b, s, k);
        var mesh = new T.Mesh(b.geo(), m.shell);
        mesh.name = nm + (k > 0 ? '-b' : '-a');
        mesh.castShadow = false; mesh.receiveShadow = true;
        mesh.userData.h53log = 'door';
        gg.add(mesh); lv.push(mesh);
      }
      gg.userData.leaves = lv;
      return gg;
    }
    var doorL = doorGroup(1, 'doorPanelL');
    var doorR = doorGroup(-1, 'doorPanelR');

    var roomLight = new T.AmbientLight(0xcfe0e4, 0.11);
    roomLight.name = 'roomLight';

    var seats = new T.Group(); seats.name = 'seats';
    seats.add(seatFab); seats.add(seatWorn); seats.add(seatFrm); seats.add(seatPipe);
    seats.userData.meshes = [seatFab, seatWorn, seatFrm, seatPipe];
    seats.userData.h53log = 'seat';

    var windowFrame = new T.Mesh(bWindow.geo(), m.frame); windowFrame.name = 'window-assembly'; g.add(windowFrame);
    g.add(shell); g.add(floor); g.add(ceil); g.add(seats); g.add(rack);
    g.add(bands); g.add(line); g.add(decals);
    g.add(doorL); g.add(doorR);
    g.add(glass); g.add(stub); g.add(roomLight);

    PARTS = {
      shell: shell, ceiling: ceil, seats: seats,
      seatCloth: seatFab, seatWorn: seatWorn, seatFrame: seatFrm,
      seatPipe: seatPipe, rack: rack,
      bands: bands, doorPanelL: doorL, doorPanelR: doorR,
      glass: glass, stub: stub, contact: decals, roomLight: roomLight
    };
    g.userData.parts = PARTS;
    /* 契約 c2 §4 */
    g.userData.EYE = {
      a: [1.13, 1.18, 0.86], b: [2.07, 1.18, 0.86],
      c: [0, 1.62, 0], d: [-1.34, 1.62, 0.42]
    };
    g.userData.WINDOW = { xs: XS.slice(0), y0: WIN_Y0, h: WIN_H, w: WIN_W, z: IN_HW };
    /* d は c2 で扉の斜め手前に動いた。yaw 0 のままだと側壁が顔の前に来る。
       (-1.34, 0.42) から +z 側の扉の中心 (0, 1.6255) へ向ける値に直した */
    g.userData.EYE_YAW = { a: 0, b: -Math.PI / 2, c: Math.PI / 2, d: 0.83 };
    GRP = g;
    _apply();
    return g;
  }

  /* ============================ 15. beat and dusk ========================= */

  var _night = 0, _pulse = 1;

  function _apply() {
    if (!M) return;
    var s1 = smoothstep(0.00, 0.42, _night);
    var s2 = smoothstep(0.30, 0.72, _night);
    var s3 = smoothstep(0.72, 1.00, _night);

    M.band.emissiveIntensity = EM_BAND * 1.05 * (1 - s1) * _pulse;
    M.ceil.emissiveIntensity = EM_CEIL * (1 - s2) * _pulse;
    M.line.emissiveIntensity = EM_LINE * (1.0 - 0.62 * s3);
    M.line.color.setHex(0x0d1116);

    ENVK = 1.0 - 0.88 * s2;
    var k;
    for (k in EI) if (M[k]) M[k].envMapIntensity = EI[k] * ENVK;

    if (PARTS) {
      PARTS.bands.scale.x = Math.max(0.0001, 1.0 - s1);
      /* One end stays anchored. The other retreats, instead of shrinking to the centre. */
      PARTS.bands.position.x = -BAND_HL * s1;
      PARTS.bands.visible = s1 < 0.995;
      if (PARTS.roomLight) PARTS.roomLight.intensity = 0.11 * (1 - s2);
    }
  }

  function tick(t) {
    var ph = wrap(t, BEAT) / BEAT;
    _pulse = 1.0 + 0.04 * Math.sin(ph * Math.PI * 2);
    _apply();
  }

  function setNight(k) {
    _night = k < 0 ? 0 : (k > 1 ? 1 : k);
    _apply();
  }

  function setLine(str) {
    LINE_TEXT = str;
    var tx = buildTex();
    drawLine(tx.lineCv, str);
    tx.line.needsUpdate = true;
  }

  CH.parts.car = {
    build: build, tick: tick, mats: mats,
    setLine: setLine, setNight: setNight, name: 'car'
  };
  CH.parts.car.VERSION = 'v6';
  CH.parts.car.stateAt = function () { return { night: _night, band: M.band.emissiveIntensity, ceiling: M.ceil.emissiveIntensity, row: M.line.emissiveIntensity, light: PARTS.roomLight.intensity, bandLeft: -BAND_HL, bandRight: -BAND_HL + BAND_HL * 2 * (1 - smoothstep(0, 0.42, _night)), line: LINE_TEXT }; };
  CH.parts.car.prototype = function () { return GRP || build(); };

})();

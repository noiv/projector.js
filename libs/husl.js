// Generated by CoffeeScript 1.3.3
(function() {
  var conv, dotProduct, f, f_inv, fromLinear, lab_e, lab_k, m, m_inv, maxChroma, maxChromaD, refU, refV, refX, refY, refZ, rgbPrepare, root, round, stylus, toLinear, _hradExtremum, _maxChroma;

  m = {
    R: [3.2406, -1.5372, -0.4986],
    G: [-0.9689, 1.8758, 0.0415],
    B: [0.0557, -0.2040, 1.0570]
  };

  m_inv = {
    X: [0.4124, 0.3576, 0.1805],
    Y: [0.2126, 0.7152, 0.0722],
    Z: [0.0193, 0.1192, 0.9505]
  };

  refX = 0.95047;

  refY = 1.00000;

  refZ = 1.08883;

  refU = 0.19784;

  refV = 0.46834;

  lab_e = 0.008856;

  lab_k = 903.3;

  _maxChroma = function(L, H) {
    var cosH, hrad, sinH, sub1, sub2;
    hrad = H / 360 * 2 * Math.PI;
    sinH = Math.sin(hrad);
    cosH = Math.cos(hrad);
    sub1 = Math.pow(L + 16, 3) / 1560896;
    sub2 = sub1 > 0.008856 ? sub1 : L / 903.3;
    return function(channel) {
      var bottom, lbottom, m1, m2, m3, rbottom, top, _ref;
      _ref = m[channel], m1 = _ref[0], m2 = _ref[1], m3 = _ref[2];
      top = (0.99915 * m1 + 1.05122 * m2 + 1.14460 * m3) * sub2;
      rbottom = 0.86330 * m3 - 0.17266 * m2;
      lbottom = 0.12949 * m3 - 0.38848 * m1;
      bottom = (rbottom * sinH + lbottom * cosH) * sub2;
      return function(limit) {
        return L * (top - 1.05122 * limit) / (bottom + 0.17266 * sinH * limit);
      };
    };
  };

  _hradExtremum = function(L) {
    var lhs, rhs, sub;
    lhs = (Math.pow(L, 3) + 48 * Math.pow(L, 2) + 768 * L + 4096) / 1560896;
    rhs = 1107 / 125000;
    sub = lhs > rhs ? lhs : 10 * L / 9033;
    return function(channel, limit) {
      var bottom, hrad, m1, m2, m3, top, _ref;
      _ref = m[channel], m1 = _ref[0], m2 = _ref[1], m3 = _ref[2];
      top = -3015466475 * m3 * sub + 603093295 * m2 * sub - 603093295 * limit;
      bottom = 1356959916 * m1 * sub - 452319972 * m3 * sub;
      hrad = Math.atan2(top, bottom);
      if (limit === 0) {
        hrad += Math.PI;
      }
      return hrad;
    };
  };

  maxChroma = function(L, H) {
    var C, channel, limit, mc1, mc2, result, _i, _j, _len, _len1, _ref, _ref1;
    result = Infinity;
    mc1 = _maxChroma(L, H);
    _ref = ['R', 'G', 'B'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      channel = _ref[_i];
      mc2 = mc1(channel);
      _ref1 = [0, 1];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        limit = _ref1[_j];
        C = mc2(limit);
        if ((0 < C && C < result)) {
          result = C;
        }
      }
    }
    return result;
  };

  maxChromaD = function(L) {
    var C, channel, he1, hrad, limit, minima_C, _i, _j, _len, _len1, _ref, _ref1;
    minima_C = [];
    he1 = _hradExtremum(L);
    _ref = ['R', 'G', 'B'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      channel = _ref[_i];
      _ref1 = [0, 1];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        limit = _ref1[_j];
        hrad = he1(channel, limit);
        C = maxChroma(L, hrad * 180 / Math.PI);
        minima_C.push(C);
      }
    }
    return Math.min.apply(Math, minima_C);
  };

  dotProduct = function(a, b) {
    var i, ret, _i, _ref;
    ret = 0;
    for (i = _i = 0, _ref = a.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
      ret += a[i] * b[i];
    }
    return ret;
  };

  round = function(num, places) {
    var n;
    n = Math.pow(10, places);
    return Math.round(num * n) / n;
  };

  f = function(t) {
    if (t > lab_e) {
      return Math.pow(t, 1 / 3);
    } else {
      return 7.787 * t + 16 / 116;
    }
  };

  f_inv = function(t) {
    if (Math.pow(t, 3) > lab_e) {
      return Math.pow(t, 3);
    } else {
      return (116 * t - 16) / lab_k;
    }
  };

  fromLinear = function(c) {
    if (c <= 0.0031308) {
      return 12.92 * c;
    } else {
      return 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
    }
  };

  toLinear = function(c) {
    var a;
    a = 0.055;
    if (c > 0.04045) {
      return Math.pow((c + a) / (1 + a), 2.4);
    } else {
      return c / 12.92;
    }
  };

  rgbPrepare = function(tuple) {
    var ch, n, _i, _j, _len, _len1, _results;
    tuple = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = tuple.length; _i < _len; _i++) {
        n = tuple[_i];
        _results.push(round(n, 3));
      }
      return _results;
    })();
    for (_i = 0, _len = tuple.length; _i < _len; _i++) {
      ch = tuple[_i];
      if (ch < -0.0001 || ch > 1.0001) {
        throw new Error("Illegal rgb value: " + ch);
      }
      if (ch < 0) {
        ch = 0;
      }
      if (ch > 1) {
        ch = 1;
      }
    }
    _results = [];
    for (_j = 0, _len1 = tuple.length; _j < _len1; _j++) {
      ch = tuple[_j];
      _results.push(Math.round(ch * 255));
    }
    return _results;
  };

  conv = {
    'xyz': {},
    'luv': {},
    'lch': {},
    'husl': {},
    'huslp': {},
    'rgb': {},
    'hex': {}
  };

  conv.xyz.rgb = function(tuple) {
    var B, G, R;
    R = fromLinear(dotProduct(m.R, tuple));
    G = fromLinear(dotProduct(m.G, tuple));
    B = fromLinear(dotProduct(m.B, tuple));
    return [R, G, B];
  };

  conv.rgb.xyz = function(tuple) {
    var B, G, R, X, Y, Z, rgbl;
    R = tuple[0], G = tuple[1], B = tuple[2];
    rgbl = [toLinear(R), toLinear(G), toLinear(B)];
    X = dotProduct(m_inv.X, rgbl);
    Y = dotProduct(m_inv.Y, rgbl);
    Z = dotProduct(m_inv.Z, rgbl);
    return [X, Y, Z];
  };

  conv.xyz.luv = function(tuple) {
    var L, U, V, X, Y, Z, varU, varV;
    X = tuple[0], Y = tuple[1], Z = tuple[2];
    varU = (4 * X) / (X + (15 * Y) + (3 * Z));
    varV = (9 * Y) / (X + (15 * Y) + (3 * Z));
    L = 116 * f(Y / refY) - 16;
    if (L === 0) {
      return [0, 0, 0];
    }
    U = 13 * L * (varU - refU);
    V = 13 * L * (varV - refV);
    return [L, U, V];
  };

  conv.luv.xyz = function(tuple) {
    var L, U, V, X, Y, Z, varU, varV, varY;
    L = tuple[0], U = tuple[1], V = tuple[2];
    if (L === 0) {
      return [0, 0, 0];
    }
    varY = f_inv((L + 16) / 116);
    varU = U / (13 * L) + refU;
    varV = V / (13 * L) + refV;
    Y = varY * refY;
    X = 0 - (9 * Y * varU) / ((varU - 4) * varV - varU * varV);
    Z = (9 * Y - (15 * varV * Y) - (varV * X)) / (3 * varV);
    return [X, Y, Z];
  };

  conv.luv.lch = function(tuple) {
    var C, H, Hrad, L, U, V;
    L = tuple[0], U = tuple[1], V = tuple[2];
    C = Math.pow(Math.pow(U, 2) + Math.pow(V, 2), 1 / 2);
    Hrad = Math.atan2(V, U);
    H = Hrad * 360 / 2 / Math.PI;
    if (H < 0) {
      H = 360 + H;
    }
    return [L, C, H];
  };

  conv.lch.luv = function(tuple) {
    var C, H, Hrad, L, U, V;
    L = tuple[0], C = tuple[1], H = tuple[2];
    Hrad = H / 360 * 2 * Math.PI;
    U = Math.cos(Hrad) * C;
    V = Math.sin(Hrad) * C;
    return [L, U, V];
  };

  conv.husl.lch = function(tuple) {
    var C, H, L, S, max;
    H = tuple[0], S = tuple[1], L = tuple[2];
    if (L > 99.9999999) {
      return [100, 0, H];
    }
    if (L < 0.00000001) {
      return [0, 0, H];
    }
    max = maxChroma(L, H);
    C = max / 100 * S;
    return [L, C, H];
  };

  conv.lch.husl = function(tuple) {
    var C, H, L, S, max;
    L = tuple[0], C = tuple[1], H = tuple[2];
    if (L > 99.9999999) {
      return [H, 0, 100];
    }
    if (L < 0.00000001) {
      return [H, 0, 0];
    }
    max = maxChroma(L, H);
    S = C / max * 100;
    return [H, S, L];
  };

  conv.huslp.lch = function(tuple) {
    var C, H, L, S, max;
    H = tuple[0], S = tuple[1], L = tuple[2];
    if (L > 99.9999999) {
      return [100, 0, H];
    }
    if (L < 0.00000001) {
      return [0, 0, H];
    }
    max = maxChromaD(L);
    C = max / 100 * S;
    return [L, C, H];
  };

  conv.lch.huslp = function(tuple) {
    var C, H, L, S, max;
    L = tuple[0], C = tuple[1], H = tuple[2];
    if (L > 99.9999999) {
      return [H, 0, 100];
    }
    if (L < 0.00000001) {
      return [H, 0, 0];
    }
    max = maxChromaD(L);
    S = C / max * 100;
    return [H, S, L];
  };

  conv.rgb.hex = function(tuple) {
    var ch, hex, _i, _len;
    hex = "#";
    tuple = rgbPrepare(tuple);
    for (_i = 0, _len = tuple.length; _i < _len; _i++) {
      ch = tuple[_i];
      ch = ch.toString(16);
      if (ch.length === 1) {
        ch = "0" + ch;
      }
      hex += ch;
    }
    return hex;
  };

  conv.hex.rgb = function(hex) {
    var b, g, r;
    if (hex.charAt(0) === "#") {
      hex = hex.substring(1, 7);
    }
    r = hex.substring(0, 2);
    g = hex.substring(2, 4);
    b = hex.substring(4, 6);
    return [r, g, b].map(function(n) {
      return parseInt(n, 16) / 255;
    });
  };

  conv.lch.rgb = function(tuple) {
    return conv.xyz.rgb(conv.luv.xyz(conv.lch.luv(tuple)));
  };

  conv.rgb.lch = function(tuple) {
    return conv.luv.lch(conv.xyz.luv(conv.rgb.xyz(tuple)));
  };

  conv.husl.rgb = function(tuple) {
    return conv.lch.rgb(conv.husl.lch(tuple));
  };

  conv.rgb.husl = function(tuple) {
    return conv.lch.husl(conv.rgb.lch(tuple));
  };

  conv.huslp.rgb = function(tuple) {
    return conv.lch.rgb(conv.huslp.lch(tuple));
  };

  conv.rgb.huslp = function(tuple) {
    return conv.lch.huslp(conv.rgb.lch(tuple));
  };

  root = {};

  try {
    stylus = require('stylus');
    root = function() {
      return function(style) {
        style.define('husl', function(H, S, L, A) {
          var B, G, R, _ref;
          _ref = rgbPrepare(conv.husl.rgb([H.val, S.val, L.val])), R = _ref[0], G = _ref[1], B = _ref[2];
          return new stylus.nodes.RGBA(R, G, B, (A != null ? A.val : 1));
        });
        return style.define('huslp', function(H, S, L, A) {
          var B, G, R, _ref;
          _ref = rgbPrepare(conv.huslp.rgb([H.val, S.val, L.val])), R = _ref[0], G = _ref[1], B = _ref[2];
          return new stylus.nodes.RGBA(R, G, B, (A != null ? A.val : 1));
        });
      };
    };
  } catch (_error) {}

  root.fromRGB = function(R, G, B) {
    return conv.rgb.husl([R, G, B]);
  };

  root.fromHex = function(hex) {
    return conv.rgb.husl(conv.hex.rgb(hex));
  };

  root.toRGB = function(H, S, L) {
    return conv.husl.rgb([H, S, L]);
  };

  root.toHex = function(H, S, L) {
    return conv.rgb.hex(conv.husl.rgb([H, S, L]));
  };

  root.p = {};

  root.p.toRGB = function(H, S, L) {
    return conv.xyz.rgb(conv.luv.xyz(conv.lch.luv(conv.huslp.lch([H, S, L]))));
  };

  root.p.toHex = function(H, S, L) {
    return conv.rgb.hex(conv.xyz.rgb(conv.luv.xyz(conv.lch.luv(conv.huslp.lch([H, S, L])))));
  };

  root.p.fromRGB = function(R, G, B) {
    return conv.lch.huslp(conv.luv.lch(conv.xyz.luv(conv.rgb.xyz([R, G, B]))));
  };

  root.p.fromHex = function(hex) {
    return conv.lch.huslp(conv.luv.lch(conv.xyz.luv(conv.rgb.xyz(conv.hex.rgb(hex)))));
  };

  root._conv = conv;

  root._maxChroma = maxChroma;

  root._rgbPrepare = rgbPrepare;

  if (typeof module !== "undefined" && module !== null) {
    module.exports = root;
  }

  if (typeof jQuery !== "undefined" && jQuery !== null) {
    jQuery.husl = root;
  }

}).call(this);

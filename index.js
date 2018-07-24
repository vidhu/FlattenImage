import { PNG } from 'pngjs';

const threshold = 0.05;
const maxDelta = 35215 * threshold * threshold;

export const Merge = pngBuffs =>
  Promise.all(
    pngBuffs.map(
      pngBuff => Promise.resolve(PNG.sync.read(pngBuff))
    )
  ).then(pngs => {
    const base = pngs[0];
    const polies = pngs.splice(1);

    const diff = polies.map(poly => calcDiff(base, poly));
    const combined = diff.reduce((acc, poly) => combineDiff(acc, poly), base);
    return PNG.sync.write(combined);
  });

const combineDiff = (base, diff) => {
  for (var y = 0; y < base.height; y++) {
    for (var x = 0; x < base.width; x++) {
      let idx = (base.width * y + x) << 2;
      if (diff.data[idx + 3]) {
        copyTo(base, diff, idx);
      }
    }
  }
  return base;
};

const calcDiff = (base, poly) => {
  const diff = new PNG({ width: base.width, height: base.height });

  for (var y = 0; y < base.height; y++) {
    for (var x = 0; x < base.width; x++) {
      let idx = (base.width * y + x) << 2;

      let delta = colorDelta(base.data, poly.data, idx, idx);
      if (delta > maxDelta) {
        diff.data[idx] = poly.data[idx];
        diff.data[idx + 1] = poly.data[idx + 1];
        diff.data[idx + 2] = poly.data[idx + 2];
        diff.data[idx + 3] = 255;
      }
    }
  }

  return diff;
};

const colorDelta = (img1, img2, k, m, yOnly) => {
  var a1 = img1[k + 3] / 255,
    a2 = img2[m + 3] / 255,
    r1 = blend(img1[k + 0], a1),
    g1 = blend(img1[k + 1], a1),
    b1 = blend(img1[k + 2], a1),
    r2 = blend(img2[m + 0], a2),
    g2 = blend(img2[m + 1], a2),
    b2 = blend(img2[m + 2], a2),
    y = rgb2y(r1, g1, b1) - rgb2y(r2, g2, b2);

  if (yOnly) return y; // brightness difference only

  var i = rgb2i(r1, g1, b1) - rgb2i(r2, g2, b2),
    q = rgb2q(r1, g1, b1) - rgb2q(r2, g2, b2);

  return 0.5053 * y * y + 0.299 * i * i + 0.1957 * q * q;
};

const rgb2y = (r, g, b) => {
  return r * 0.29889531 + g * 0.58662247 + b * 0.11448223;
};
const rgb2i = (r, g, b) => {
  return r * 0.59597799 - g * 0.2741761 - b * 0.32180189;
};
const rgb2q = (r, g, b) => {
  return r * 0.21147017 - g * 0.52261711 + b * 0.31114694;
};

// blend semi-transparent color with white
const blend = (c, a) => {
  return 255 + (c - 255) * a;
};

const copyTo = (to, from, pos, alpha) => {
  to.data[pos] = from.data[pos];
  to.data[pos + 1] = from.data[pos + 1];
  to.data[pos + 2] = from.data[pos + 2];
  to.data[pos + 3] = alpha ? alpha : 255;
};

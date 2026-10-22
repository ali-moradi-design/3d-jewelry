// Generates public/hdri/aurelune-studio.hdr: a mid-dark photo studio with a few soft boxes.
// Run with: node scripts/generate-studio-hdr.mjs
// The file is original work of this repo (no third-party license). Dark surroundings plus
// bright, sharp light panels are what make gemstones and polished metal read as luxurious.
import { writeFileSync, mkdirSync } from 'node:fs';

const W = 1024;
const H = 512;

// Lights in (longitude, latitude) radians; half sizes; linear radiance; tint.
const lights = [
  { lon: -0.9, lat: 0.95, w: 0.55, h: 0.3, v: 7, tint: [1, 0.97, 0.92] }, // big top-left softbox
  { lon: 1.3, lat: 0.35, w: 0.12, h: 0.55, v: 14, tint: [0.95, 0.97, 1] }, // tall strip, right
  { lon: -2.1, lat: 0.1, w: 0.1, h: 0.5, v: 9, tint: [1, 0.96, 0.9] }, // tall strip, back left
  { lon: 0.2, lat: 1.2, w: 0.35, h: 0.18, v: 5, tint: [1, 1, 1] }, // overhead
  { lon: 3.0, lat: -0.1, w: 0.4, h: 0.12, v: 3, tint: [1, 0.85, 0.7] }, // warm low rim, behind
  { lon: 0.0, lat: 0.0, w: 0.06, h: 0.3, v: 6, tint: [1, 1, 1] }, // thin front fill strip
];

const wrap = (a) => ((((a + Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)) - Math.PI;
const soft = (d, half) => {
  const edge = half * 0.18;
  return Math.min(1, Math.max(0, (half - d) / edge));
};

const rgbe = (r, g, b) => {
  const max = Math.max(r, g, b);
  if (max < 1e-32) return [0, 0, 0, 0];
  const e = Math.ceil(Math.log2(max));
  const scale = 256 / 2 ** e;
  return [
    Math.min(255, Math.floor(r * scale)),
    Math.min(255, Math.floor(g * scale)),
    Math.min(255, Math.floor(b * scale)),
    e + 128,
  ];
};

const rows = [];
for (let y = 0; y < H; y++) {
  const lat = (0.5 - (y + 0.5) / H) * Math.PI; // +pi/2 at the top
  const row = [];
  for (let x = 0; x < W; x++) {
    const lon = ((x + 0.5) / W - 0.5) * 2 * Math.PI;
    // dark base with a faint vertical gradient
    const base =
      0.16 +
      0.16 * Math.max(0, Math.sin(lat)) +
      (lat < 0 ? 0.3 * Math.min(1, -Math.sin(lat) * 2) : 0);
    let r = base * 0.98;
    let g = base;
    let b = base * 1.04;
    for (const light of lights) {
      const k =
        soft(Math.abs(wrap(lon - light.lon)), light.w) * soft(Math.abs(lat - light.lat), light.h);
      if (k > 0) {
        r += light.v * k * light.tint[0];
        g += light.v * k * light.tint[1];
        b += light.v * k * light.tint[2];
      }
    }
    row.push(rgbe(r, g, b));
  }
  rows.push(row);
}

// Radiance .hdr with new-style run-length encoding.
const chunks = [Buffer.from(`#?RADIANCE\nFORMAT=32-bit_rle_rgbe\n\n-Y ${H} +X ${W}\n`, 'ascii')];
for (const row of rows) {
  const out = [2, 2, W >> 8, W & 255];
  for (let c = 0; c < 4; c++) {
    let i = 0;
    while (i < W) {
      let run = 1;
      while (i + run < W && run < 127 && row[i + run][c] === row[i][c]) run++;
      if (run >= 4) {
        out.push(128 + run, row[i][c]);
        i += run;
      } else {
        const start = i;
        let len = 0;
        while (i < W && len < 128) {
          let r2 = 1;
          while (i + r2 < W && r2 < 4 && row[i + r2][c] === row[i][c]) r2++;
          if (r2 >= 4) break;
          i++;
          len++;
        }
        out.push(len);
        for (let k = start; k < start + len; k++) out.push(row[k][c]);
      }
    }
  }
  chunks.push(Buffer.from(out));
}

mkdirSync('public/hdri', { recursive: true });
writeFileSync('public/hdri/aurelune-studio.hdr', Buffer.concat(chunks));
console.log('wrote public/hdri/aurelune-studio.hdr');

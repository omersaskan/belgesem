// Decal alaninin altindaki govde albedo'sunu (materyal + doku ornegi) olcer.
const fs = require('fs');
const sharp = require('sharp');
const { NodeIO } = require('@gltf-transform/core');

const RECT = { zA: -0.1460, zB: -0.0678, yA: 0.0425, yB: 0.0779 };

function xf(m, p) {
  return [
    m[0] * p[0] + m[4] * p[1] + m[8] * p[2] + m[12],
    m[1] * p[0] + m[5] * p[1] + m[9] * p[2] + m[13],
    m[2] * p[0] + m[6] * p[1] + m[10] * p[2] + m[14],
  ];
}

async function build(glb) {
  const io = new NodeIO();
  const doc = await io.read(glb);
  const root = doc.getRoot();
  const tris = [];
  const texCache = new Map();
  for (const node of root.listNodes()) {
    const mesh = node.getMesh();
    if (!mesh || /logo|decal/i.test(node.getName())) continue;
    const m = node.getWorldMatrix();
    for (const prim of mesh.listPrimitives()) {
      const pos = prim.getAttribute('POSITION').getArray();
      const uvA = prim.getAttribute('TEXCOORD_0');
      const uv = uvA ? uvA.getArray() : null;
      const idxAcc = prim.getIndices();
      const idx = idxAcc ? idxAcc.getArray() : null;
      const cnt = (idx ? idx.length : prim.getAttribute('POSITION').getCount()) / 3;
      const mat = prim.getMaterial();
      for (let t = 0; t < cnt; t++) {
        const i0 = idx ? idx[t * 3] : t * 3, i1 = idx ? idx[t * 3 + 1] : t * 3 + 1, i2 = idx ? idx[t * 3 + 2] : t * 3 + 2;
        const p0 = xf(m, [pos[i0 * 3], pos[i0 * 3 + 1], pos[i0 * 3 + 2]]);
        const p1 = xf(m, [pos[i1 * 3], pos[i1 * 3 + 1], pos[i1 * 3 + 2]]);
        const p2 = xf(m, [pos[i2 * 3], pos[i2 * 3 + 1], pos[i2 * 3 + 2]]);
        const zmin = Math.min(p0[2], p1[2], p2[2]), zmax = Math.max(p0[2], p1[2], p2[2]);
        const ymin = Math.min(p0[1], p1[1], p2[1]), ymax = Math.max(p0[1], p1[1], p2[1]);
        if (zmax < RECT.zA - 0.02 || zmin > RECT.zB + 0.02 || ymax < RECT.yA - 0.02 || ymin > RECT.yB + 0.02) continue;
        tris.push({
          p0, p1, p2, zmin, zmax, ymin, ymax, mat,
          uv0: uv ? [uv[i0 * 2], uv[i0 * 2 + 1]] : null,
          uv1: uv ? [uv[i1 * 2], uv[i1 * 2 + 1]] : null,
          uv2: uv ? [uv[i2 * 2], uv[i2 * 2 + 1]] : null,
        });
      }
    }
  }
  return { tris, texCache };
}

async function texData(texCache, tex) {
  if (!texCache.has(tex)) {
    const { data, info } = await sharp(Buffer.from(tex.getImage())).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    texCache.set(tex, { data, w: info.width, h: info.height, c: info.channels });
  }
  return texCache.get(tex);
}

function hit(tris, z, y, side) {
  let best = null;
  for (const t of tris) {
    if (z < t.zmin || z > t.zmax || y < t.ymin || y > t.ymax) continue;
    const { p0, p1, p2 } = t;
    const d = (p1[1] - p2[1]) * (p0[2] - p2[2]) + (p2[2] - p1[2]) * (p0[1] - p2[1]);
    if (Math.abs(d) < 1e-12) continue;
    const l0 = ((p1[1] - p2[1]) * (z - p2[2]) + (p2[2] - p1[2]) * (y - p2[1])) / d;
    const l1 = ((p2[1] - p0[1]) * (z - p2[2]) + (p0[2] - p2[2]) * (y - p2[1])) / d;
    const l2 = 1 - l0 - l1;
    if (l0 < -1e-9 || l1 < -1e-9 || l2 < -1e-9) continue;
    const xh = l0 * p0[0] + l1 * p1[0] + l2 * p2[0];
    if (best === null || (side > 0 ? xh > best.x : xh < best.x)) best = { x: xh, t, l: [l0, l1, l2] };
  }
  return best;
}

module.exports = { build, texData, hit, RECT };

if (require.main === module) {
  (async () => {
    const { tris, texCache } = await build('assets/forklift.glb');
    console.log('bolgedeki ucgen:', tris.length);
    for (const side of [1, -1]) {
      const mats = new Map();
      const cols = [];
      for (let j = 0; j <= 12; j++) for (let i = 0; i <= 30; i++) {
        const y = RECT.yA + (RECT.yB - RECT.yA) * j / 12;
        const z = RECT.zA + (RECT.zB - RECT.zA) * i / 30;
        const h = hit(tris, z, y, side);
        if (!h) continue;
        const name = h.t.mat ? h.t.mat.getName() : 'null';
        mats.set(name, (mats.get(name) || 0) + 1);
        const mat = h.t.mat;
        const bc = mat.getBaseColorFactor();
        const tex = mat.getBaseColorTexture();
        let rgb = [bc[0] * 255, bc[1] * 255, bc[2] * 255];
        if (tex && h.t.uv0) {
          const td = await texData(texCache, tex);
          const u = h.l[0] * h.t.uv0[0] + h.l[1] * h.t.uv1[0] + h.l[2] * h.t.uv2[0];
          const v = h.l[0] * h.t.uv0[1] + h.l[1] * h.t.uv1[1] + h.l[2] * h.t.uv2[1];
          const px = Math.min(td.w - 1, Math.max(0, Math.round((u - Math.floor(u)) * (td.w - 1))));
          const py = Math.min(td.h - 1, Math.max(0, Math.round((v - Math.floor(v)) * (td.h - 1))));
          const o = (py * td.w + px) * td.c;
          rgb = [td.data[o] * bc[0], td.data[o + 1] * bc[1], td.data[o + 2] * bc[2]];
        }
        cols.push(rgb);
      }
      const avg = [0, 1, 2].map(c => cols.reduce((a, r) => a + r[c], 0) / cols.length);
      const varr = [0, 1, 2].map(c => Math.sqrt(cols.reduce((a, r) => a + (r[c] - avg[c]) ** 2, 0) / cols.length));
      console.log(side > 0 ? '+X' : '-X', 'materyaller:', [...mats].map(([k, v]) => `${k}:${v}`).join(' '));
      console.log('   ortalama albedo RGB', avg.map(v => v.toFixed(1)).join(','), ' std', varr.map(v => v.toFixed(1)).join(','), ' ornek', cols.length);
    }
  })().catch(e => { console.error(e); process.exit(1); });
}

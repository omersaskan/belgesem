// X ekseni boyunca isin atarak govde panelinin derinligini olcer.
// Kullanim: node scratch/panel_probe.js <side +1|-1> <zA> <zB> <yA> <yB> <NU> <NV>
const { NodeIO } = require('@gltf-transform/core');

function xf(m, p) {
  return [
    m[0] * p[0] + m[4] * p[1] + m[8] * p[2] + m[12],
    m[1] * p[0] + m[5] * p[1] + m[9] * p[2] + m[13],
    m[2] * p[0] + m[6] * p[1] + m[10] * p[2] + m[14],
  ];
}

// Bolge: sadece logo civari
const REGION = { zMin: -0.22, zMax: 0.00, yMin: -0.01, yMax: 0.17 };

async function loadTriangles(glbPath, opts = {}) {
  const io = new NodeIO();
  const doc = await io.read(glbPath);
  const root = doc.getRoot();
  const tris = [];
  const skip = opts.skipNames || [];
  for (const node of root.listNodes()) {
    const mesh = node.getMesh();
    if (!mesh) continue;
    if (skip.some(s => node.getName().toLowerCase().includes(s))) continue;
    const m = node.getWorldMatrix();
    for (const prim of mesh.listPrimitives()) {
      const a = prim.getAttribute('POSITION').getArray();
      const idxAcc = prim.getIndices();
      const idx = idxAcc ? idxAcc.getArray() : null;
      const triCount = (idx ? idx.length : prim.getAttribute('POSITION').getCount()) / 3;
      for (let t = 0; t < triCount; t++) {
        const i0 = idx ? idx[t * 3] : t * 3, i1 = idx ? idx[t * 3 + 1] : t * 3 + 1, i2 = idx ? idx[t * 3 + 2] : t * 3 + 2;
        const p0 = xf(m, [a[i0 * 3], a[i0 * 3 + 1], a[i0 * 3 + 2]]);
        const p1 = xf(m, [a[i1 * 3], a[i1 * 3 + 1], a[i1 * 3 + 2]]);
        const p2 = xf(m, [a[i2 * 3], a[i2 * 3 + 1], a[i2 * 3 + 2]]);
        const zmin = Math.min(p0[2], p1[2], p2[2]), zmax = Math.max(p0[2], p1[2], p2[2]);
        const ymin = Math.min(p0[1], p1[1], p2[1]), ymax = Math.max(p0[1], p1[1], p2[1]);
        if (zmax < REGION.zMin || zmin > REGION.zMax || ymax < REGION.yMin || ymin > REGION.yMax) continue;
        tris.push([p0, p1, p2, zmin, zmax, ymin, ymax]);
      }
    }
  }
  return tris;
}

// (z,y) duzleminde nokta-ucgen testi + baricentrik x
function probe(tris, z, y, side) {
  let best = null;
  for (const t of tris) {
    if (z < t[3] || z > t[4] || y < t[5] || y > t[6]) continue;
    const [p0, p1, p2] = t;
    const x0 = p0[2], y0 = p0[1], x1 = p1[2], y1 = p1[1], x2 = p2[2], y2 = p2[1];
    const d = (y1 - y2) * (x0 - x2) + (x2 - x1) * (y0 - y2);
    if (Math.abs(d) < 1e-12) continue;
    const l0 = ((y1 - y2) * (z - x2) + (x2 - x1) * (y - y2)) / d;
    const l1 = ((y2 - y0) * (z - x2) + (x0 - x2) * (y - y2)) / d;
    const l2 = 1 - l0 - l1;
    if (l0 < -1e-9 || l1 < -1e-9 || l2 < -1e-9) continue;
    const xh = l0 * p0[0] + l1 * p1[0] + l2 * p2[0];
    if (best === null || (side > 0 ? xh > best : xh < best)) best = xh;
  }
  return best;
}

module.exports = { loadTriangles, probe };

if (require.main === module) {
  (async () => {
    const side = +(process.argv[2] || 1);
    const zA = +(process.argv[3] || -0.1425), zB = +(process.argv[4] || -0.0675);
    const yA = +(process.argv[5] || 0.0534), yB = +(process.argv[6] || 0.0815);
    const NU = +(process.argv[7] || 26), NV = +(process.argv[8] || 10);
    const tris = await loadTriangles('assets/forklift.glb', { skipNames: ['logo'] });
    console.log('bolgedeki ucgen sayisi:', tris.length);
    console.log(`dikdortgen z:[${zA}, ${zB}] y:[${yA}, ${yB}] taraf:${side > 0 ? '+X' : '-X'}`);
    let mn = Infinity, mx = -Infinity, miss = 0;
    const rows = [];
    for (let j = NV; j >= 0; j--) {
      const y = yA + (yB - yA) * j / NV;
      let row = (y).toFixed(4) + ' ';
      for (let i = 0; i <= NU; i++) {
        const z = zA + (zB - zA) * i / NU;
        const x = probe(tris, z, y, side);
        if (x === null) { row += '  ----'; miss++; continue; }
        const ax = Math.abs(x);
        mn = Math.min(mn, ax); mx = Math.max(mx, ax);
        row += ' ' + (ax * 1000).toFixed(1).padStart(5);
      }
      rows.push(row);
    }
    rows.forEach(r => console.log(r));
    console.log('X (mm*1000) min', (mn * 1000).toFixed(2), 'max', (mx * 1000).toFixed(2), 'fark', ((mx - mn) * 1000).toFixed(2), 'isabetsiz:', miss);
  })().catch(e => { console.error(e); process.exit(1); });
}

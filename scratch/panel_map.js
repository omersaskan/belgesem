// +X yonune bakan yan panel yuzeylerini (z,y) duzleminde ASCII haritala
const { NodeIO } = require('@gltf-transform/core');

function xf(m, p) {
  return [
    m[0] * p[0] + m[4] * p[1] + m[8] * p[2] + m[12],
    m[1] * p[0] + m[5] * p[1] + m[9] * p[2] + m[13],
    m[2] * p[0] + m[6] * p[1] + m[10] * p[2] + m[14],
  ];
}
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const len = a => Math.hypot(a[0], a[1], a[2]);

const XMIN = +(process.argv[2] || 0.082);      // bu X'ten disarisi
const ZLO = -0.20, ZHI = -0.02, YLO = 0.03, YHI = 0.12;
const NZ = 90, NY = 34;

(async () => {
  const io = new NodeIO();
  const doc = await io.read('assets/forklift.glb');
  const root = doc.getRoot();

  const grid = [];               // [iy][iz] -> {mesh -> maxX}
  for (let y = 0; y < NY; y++) grid.push(new Array(NZ).fill(null));
  const decalCells = new Set();

  for (const node of root.listNodes()) {
    const mesh = node.getMesh();
    if (!mesh) continue;
    const isDecal = node.getName() === 'Belgesem_logo_decal';
    const m = node.getWorldMatrix();
    const short = node.getName().replace('AM98_011_forklift_', '').replace(/_Material.*/, '');
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
        const nv = cross(sub(p1, p0), sub(p2, p0));
        const L = len(nv);
        if (L === 0) continue;
        const nx = Math.abs(nv[0] / L);
        if (!isDecal && nx < 0.80) continue;
        const cx = (p0[0] + p1[0] + p2[0]) / 3, cy = (p0[1] + p1[1] + p2[1]) / 3, cz = (p0[2] + p1[2] + p2[2]) / 3;
        if (cx < XMIN) continue;
        // ucgeni orneklemek yerine 3 kosesini de bas
        for (const p of [p0, p1, p2, [cx, cy, cz]]) {
          if (p[0] < XMIN) continue;
          const iz = Math.floor((p[2] - ZLO) / (ZHI - ZLO) * NZ);
          const iy = Math.floor((p[1] - YLO) / (YHI - YLO) * NY);
          if (iz < 0 || iz >= NZ || iy < 0 || iy >= NY) continue;
          if (isDecal) { decalCells.add(iy + ':' + iz); continue; }
          const cur = grid[iy][iz];
          if (!cur || p[0] > cur.x) grid[iy][iz] = { x: p[0], name: short };
        }
      }
    }
  }

  const letters = {};
  let nextLetter = 0;
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  console.log(`X >= ${XMIN} olan +X bakan yuzeyler; Z: ${ZLO}..${ZHI} (soldan saga), Y: ${YHI}..${YLO} (yukaridan asagi)`);
  for (let y = NY - 1; y >= 0; y--) {
    let row = '';
    for (let z = 0; z < NZ; z++) {
      if (decalCells.has(y + ':' + z)) { row += '#'; continue; }
      const c = grid[y][z];
      if (!c) { row += '.'; continue; }
      if (!(c.name in letters)) letters[c.name] = alphabet[nextLetter++ % 26];
      row += letters[c.name];
    }
    console.log((YLO + (y + 0.5) * (YHI - YLO) / NY).toFixed(4), row);
  }
  let axis = '           ';
  console.log('legend:', Object.entries(letters).map(([k, v]) => `${v}=${k}`).join('  '));
  console.log('Z ekseni: sol', ZLO, ' sag', ZHI, ' adim', ((ZHI - ZLO) / NZ).toFixed(4));
})().catch(e => { console.error(e); process.exit(1); });

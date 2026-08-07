// Decal duzlemi, UV yonelimi ve kapi paneli sinirlarini olc
const fs = require('fs');
const { NodeIO } = require('@gltf-transform/core');

(async () => {
  const io = new NodeIO();
  const doc = await io.read('assets/forklift.glb');
  const root = doc.getRoot();

  // world node zinciri
  const world = root.listNodes().find(n => n.getName() === 'world');
  console.log('world T/R/S:', world.getTranslation(), world.getRotation(), world.getScale());

  const decalNode = root.listNodes().find(n => n.getName() === 'Belgesem_logo_decal');
  const prim = decalNode.getMesh().listPrimitives()[0];
  const pos = prim.getAttribute('POSITION').getArray();
  const uv = prim.getAttribute('TEXCOORD_0').getArray();
  const nrm = prim.getAttribute('NORMAL') ? prim.getAttribute('NORMAL').getArray() : null;
  const n = prim.getAttribute('POSITION').getCount();
  console.log('decal vtx:', n, 'indices:', prim.getIndices() ? prim.getIndices().getCount() : 'none');

  // UV uc noktalarindaki dunya konumlari -> yonelim
  let uMin = Infinity, uMax = -Infinity, vMin = Infinity, vMax = -Infinity;
  for (let i = 0; i < n; i++) {
    uMin = Math.min(uMin, uv[i * 2]); uMax = Math.max(uMax, uv[i * 2]);
    vMin = Math.min(vMin, uv[i * 2 + 1]); vMax = Math.max(vMax, uv[i * 2 + 1]);
  }
  console.log('UV range u:', uMin.toFixed(3), uMax.toFixed(3), ' v:', vMin.toFixed(3), vMax.toFixed(3));

  function nearest(targetU, targetV) {
    let best = null, bestD = Infinity;
    for (let i = 0; i < n; i++) {
      const d = (uv[i * 2] - targetU) ** 2 + (uv[i * 2 + 1] - targetV) ** 2;
      if (d < bestD) { bestD = d; best = i; }
    }
    return { i: best, p: [pos[best * 3], pos[best * 3 + 1], pos[best * 3 + 2]], uv: [uv[best * 2], uv[best * 2 + 1]] };
  }
  for (const [tu, tv, lbl] of [[uMin, vMin, 'u0v0'], [uMax, vMin, 'u1v0'], [uMin, vMax, 'u0v1'], [uMax, vMax, 'u1v1']]) {
    const r = nearest(tu, tv);
    console.log(lbl, 'pos=', r.p.map(v => v.toFixed(2)).join(','), 'uv=', r.uv.map(v => v.toFixed(3)).join(','));
  }

  // normal ortalamasi
  if (nrm) {
    const avg = [0, 0, 0];
    for (let i = 0; i < n; i++) for (let c = 0; c < 3; c++) avg[c] += nrm[i * 3 + c];
    console.log('avg normal:', avg.map(v => (v / n).toFixed(3)).join(','));
  }

  // X dagilimi (kac farkli kabuk?)
  const xs = [];
  for (let i = 0; i < n; i++) xs.push(pos[i * 3]);
  xs.sort((a, b) => a - b);
  console.log('X percentiles:', [0, .1, .25, .5, .75, .9, 1].map(p => xs[Math.min(n - 1, Math.round(p * (n - 1)))].toFixed(3)).join(' | '));

  // Kapi paneli: decal bolgesine yakin govde ucgenleri (x>50) -> Y/Z sinirlari
  const targets = ['AM98_011_forklift_carpaint_2_Material #0_0', 'AM98_011_forklift_carpaint_3_Material #5_0', 'AM98_011_forklift_carpaint_5_Material #18_0'];
  for (const node of root.listNodes()) {
    const mesh = node.getMesh();
    if (!mesh || !targets.includes(node.getName())) continue;
    for (const p of mesh.listPrimitives()) {
      const a = p.getAttribute('POSITION').getArray();
      const cnt = p.getAttribute('POSITION').getCount();
      // decal Z araligi civari, x>50 olan noktalar
      let yMin = Infinity, yMax = -Infinity, zMin = Infinity, zMax = -Infinity, xMax = -Infinity, c = 0;
      for (let i = 0; i < cnt; i++) {
        const x = a[i * 3], y = a[i * 3 + 1], z = a[i * 3 + 2];
        if (x < 50) continue;
        if (z > -10 || z < -140) continue;
        c++;
        yMin = Math.min(yMin, y); yMax = Math.max(yMax, y);
        zMin = Math.min(zMin, z); zMax = Math.max(zMax, z);
        xMax = Math.max(xMax, x);
      }
      console.log(node.getName(), 'x>50 & -140<z<-10 nokta:', c, 'Y:', yMin.toFixed(2), yMax.toFixed(2), 'Z:', zMin.toFixed(2), zMax.toFixed(2), 'xMax:', xMax.toFixed(2));
    }
  }

  // logo dokusunu kaydet
  const logoTex = root.listMaterials().find(m => m.getName() === 'Belgesem_logo').getBaseColorTexture();
  fs.writeFileSync('scratch/logo_current.png', logoTex.getImage());
  console.log('logo yazildi scratch/logo_current.png', logoTex.getImage().byteLength, 'bytes mime', logoTex.getMimeType());
})().catch(e => { console.error(e); process.exit(1); });

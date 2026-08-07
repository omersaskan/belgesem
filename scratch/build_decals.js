// Iki tarafa da (sag +X / sol -X) govde yuzeyine oturan Belgesem logo decal'i uretir.
// Eski tek-tarafli duz decal kaldirilir, yerine panel egrisini takip eden izgara konur.
const fs = require('fs');
const sharp = require('sharp');
const { NodeIO } = require('@gltf-transform/core');
const { loadTriangles, probe } = require('./panel_probe.js');

// --- hedef dikdortgen (dunya/glTF koordinati, sag taraf icin) ---
// fit_decal.js ile pay=0.0025 icin bulunan en buyuk gecerli yerlesim
const RECT = { zA: -0.1460, zB: -0.0678, yA: 0.0425, yB: 0.0779 };
const NU = 48, NV = 22;          // izgara cozunurlugu
const EPS = 0.0008;              // yuzeyden disari kaldirma (z-fighting)
const CROP = { left: 26, top: 0, width: 265, height: 120 };  // logo dokusundaki seffaf payi at

const IN = process.argv[2] || 'assets/forklift.glb';
const OUT = process.argv[3] || 'scratch/forklift_new.glb';

const norm = v => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

async function buildSide(tris, side) {
  const { zA, zB, yA, yB } = RECT;
  const P = [];                                  // P[j][i] = [x,y,z]
  let misses = 0;
  for (let j = 0; j <= NV; j++) {
    const row = [];
    const y = yA + (yB - yA) * j / NV;
    for (let i = 0; i <= NU; i++) {
      const z = zA + (zB - zA) * i / NU;
      let x = probe(tris, z, y, side);
      if (x === null) { misses++; x = null; }
      row.push([x, y, z]);
    }
    P.push(row);
  }
  // isabetsiz noktalari komsulardan doldur
  for (let pass = 0; pass < 6 && misses; pass++) {
    for (let j = 0; j <= NV; j++) for (let i = 0; i <= NU; i++) {
      if (P[j][i][0] !== null) continue;
      const n = [];
      for (const [dj, di] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
        const q = P[j + dj] && P[j + dj][i + di];
        if (q && q[0] !== null) n.push(q[0]);
      }
      if (n.length) { P[j][i][0] = n.reduce((a, b) => a + b, 0) / n.length; misses--; }
    }
  }
  if (misses) throw new Error(`decal izgarasinda ${misses} nokta yuzeye oturmadi`);

  // yuzey normalleri (izgara tanjantlarindan), disari bakacak sekilde
  const N = [];
  for (let j = 0; j <= NV; j++) {
    const row = [];
    for (let i = 0; i <= NU; i++) {
      const a = P[j][Math.min(i + 1, NU)], b = P[j][Math.max(i - 1, 0)];
      const c = P[Math.min(j + 1, NV)][i], d = P[Math.max(j - 1, 0)][i];
      let n = norm(cross(sub(a, b), sub(c, d)));
      if (n[0] * side < 0) n = [-n[0], -n[1], -n[2]];
      row.push(n);
    }
    N.push(row);
  }

  // konum (normal boyunca EPS kadar disari) + UV
  const pos = [], nrm = [], uv = [];
  for (let j = 0; j <= NV; j++) for (let i = 0; i <= NU; i++) {
    const p = P[j][i], n = N[j][i];
    pos.push(p[0] + n[0] * EPS, p[1] + n[1] * EPS, p[2] + n[2] * EPS);
    nrm.push(n[0], n[1], n[2]);
    // sag taraftan bakinca on taraf (zB) solda; sol taraftan bakinca arka (zA) solda
    const u = side > 0 ? 1 - i / NU : i / NU;
    const v = 1 - j / NV;                       // v=0 ust
    uv.push(u, v);
  }

  // ucgenler: yuz normali disari baksin
  const idx = [];
  const faceOut = (a, b, c) => {
    const pa = [pos[a * 3], pos[a * 3 + 1], pos[a * 3 + 2]];
    const pb = [pos[b * 3], pos[b * 3 + 1], pos[b * 3 + 2]];
    const pc = [pos[c * 3], pos[c * 3 + 1], pos[c * 3 + 2]];
    const fn = cross(sub(pb, pa), sub(pc, pa));
    return fn[0] * side > 0 ? [a, b, c] : [a, c, b];
  };
  const at = (j, i) => j * (NU + 1) + i;
  for (let j = 0; j < NV; j++) for (let i = 0; i < NU; i++) {
    idx.push(...faceOut(at(j, i), at(j, i + 1), at(j + 1, i + 1)));
    idx.push(...faceOut(at(j, i), at(j + 1, i + 1), at(j + 1, i)));
  }
  return { pos, nrm, uv, idx };
}

(async () => {
  const io = new NodeIO();
  const doc = await io.read(IN);
  const root = doc.getRoot();

  const mat = root.listMaterials().find(m => m.getName() === 'Belgesem_logo');
  if (!mat) throw new Error('Belgesem_logo materyali bulunamadi');
  const tex = mat.getBaseColorTexture();

  // doku baska materyalde kullaniliyor mu?
  const sharedBy = root.listMaterials().filter(m => m.getBaseColorTexture() === tex);
  if (sharedBy.length !== 1) throw new Error('logo dokusu paylasilmis: ' + sharedBy.map(m => m.getName()));

  // dokuyu seffaf paydan kirp (logo ayni alanda daha buyuk gorunsun)
  const cropped = await sharp(Buffer.from(tex.getImage())).extract(CROP).png().toBuffer();
  const meta = await sharp(cropped).metadata();
  tex.setImage(cropped);
  tex.setMimeType('image/png');
  console.log('logo dokusu kirpildi ->', meta.width + 'x' + meta.height, cropped.byteLength, 'bayt');

  // eski decal node + mesh'i kaldir
  for (const node of root.listNodes()) {
    if (!/logo|decal/i.test(node.getName())) continue;
    const mesh = node.getMesh();
    console.log('eski decal kaldiriliyor:', node.getName());
    node.dispose();
    if (mesh) mesh.dispose();
  }

  const tris = await loadTriangles(IN, { skipNames: ['logo'] });
  console.log('bolgedeki govde ucgeni:', tris.length);

  // decal'ler dogrudan sahne kokune eklenirken world node'un olcegi (0.0015) uygulanir;
  // bu yuzden yerel koordinat = dunya / 0.0015
  const world = root.listNodes().find(n => n.getName() === 'world');
  const S = world.getScale()[0];
  const scene = root.listScenes()[0];

  const buf = doc.getRoot().listBuffers()[0];
  for (const [side, label] of [[1, 'R'], [-1, 'L']]) {
    const g = await buildSide(tris, side);
    const local = g.pos.map((v, i) => v / S);
    const prim = doc.createPrimitive()
      .setAttribute('POSITION', doc.createAccessor().setType('VEC3').setArray(new Float32Array(local)).setBuffer(buf))
      .setAttribute('NORMAL', doc.createAccessor().setType('VEC3').setArray(new Float32Array(g.nrm)).setBuffer(buf))
      .setAttribute('TEXCOORD_0', doc.createAccessor().setType('VEC2').setArray(new Float32Array(g.uv)).setBuffer(buf))
      .setIndices(doc.createAccessor().setType('SCALAR').setArray(new Uint32Array(g.idx)).setBuffer(buf))
      .setMaterial(mat);
    const mesh = doc.createMesh(`Belgesem_logo_decal_${label}`).addPrimitive(prim);
    const node = doc.createNode(`Belgesem_logo_decal_${label}`).setMesh(mesh);
    world.addChild(node);
    let xmin = Infinity, xmax = -Infinity;
    for (let i = 0; i < g.pos.length; i += 3) { xmin = Math.min(xmin, g.pos[i]); xmax = Math.max(xmax, g.pos[i]); }
    console.log(`decal ${label}: ${g.pos.length / 3} vertex, ${g.idx.length / 3} ucgen, dunya X ${xmin.toFixed(4)}..${xmax.toFixed(4)}`);
  }
  void scene;

  await io.write(OUT, doc);
  console.log('yazildi:', OUT, (fs.statSync(OUT).size / 1e6).toFixed(2), 'MB');
})().catch(e => { console.error(e); process.exit(1); });

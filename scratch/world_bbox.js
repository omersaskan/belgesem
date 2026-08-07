// Dunya-uzayi bbox'lari + decal dunya konumu
const { NodeIO } = require('@gltf-transform/core');

function xf(m, p) {
  return [
    m[0] * p[0] + m[4] * p[1] + m[8] * p[2] + m[12],
    m[1] * p[0] + m[5] * p[1] + m[9] * p[2] + m[13],
    m[2] * p[0] + m[6] * p[1] + m[10] * p[2] + m[14],
  ];
}

(async () => {
  const io = new NodeIO();
  const doc = await io.read('assets/forklift.glb');
  const root = doc.getRoot();

  for (const node of root.listNodes()) {
    const mesh = node.getMesh();
    if (!mesh) continue;
    const m = node.getWorldMatrix();
    const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
    let cnt = 0;
    for (const prim of mesh.listPrimitives()) {
      const a = prim.getAttribute('POSITION').getArray();
      const n = prim.getAttribute('POSITION').getCount();
      cnt += n;
      for (let i = 0; i < n; i++) {
        const w = xf(m, [a[i * 3], a[i * 3 + 1], a[i * 3 + 2]]);
        for (let c = 0; c < 3; c++) { if (w[c] < min[c]) min[c] = w[c]; if (w[c] > max[c]) max[c] = w[c]; }
      }
    }
    console.log(node.getName().padEnd(52),
      'min', min.map(v => v.toFixed(3)).join(',').padEnd(24),
      'max', max.map(v => v.toFixed(3)).join(','), 'vtx', cnt);
  }

  const decal = root.listNodes().find(n => n.getName() === 'Belgesem_logo_decal');
  console.log('\ndecal worldMatrix:', Array.from(decal.getWorldMatrix()).map(v => +v.toFixed(6)).join(','));
  const parents = [];
  let p = decal.getParentNode();
  while (p) { parents.push(p.getName()); p = p.getParentNode(); }
  console.log('decal parent chain:', parents.join(' <- '));

  const body = root.listNodes().find(n => n.getName() === 'AM98_011_forklift_carpaint_2_Material #0_0');
  console.log('carpaint_2 worldMatrix:', Array.from(body.getWorldMatrix()).map(v => +v.toFixed(6)).join(','));
})().catch(e => { console.error(e); process.exit(1); });

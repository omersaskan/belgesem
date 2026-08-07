// assets/forklift.glb icindeki logo/decal ve govde yapisini incele
const { NodeIO } = require('@gltf-transform/core');

function bboxOf(prim) {
  const pos = prim.getAttribute('POSITION');
  const a = pos.getArray();
  const n = pos.getCount();
  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < n; i++) {
    for (let c = 0; c < 3; c++) {
      const v = a[i * 3 + c];
      if (v < min[c]) min[c] = v;
      if (v > max[c]) max[c] = v;
    }
  }
  return { min, max, count: n };
}

(async () => {
  const io = new NodeIO();
  const doc = await io.read('assets/forklift.glb');
  const root = doc.getRoot();

  console.log('=== SCENES ===');
  for (const sc of root.listScenes()) {
    console.log('scene:', sc.getName(), 'children:', sc.listChildren().map(c => c.getName()));
  }

  console.log('\n=== NODES (mesh tasiyanlar) ===');
  for (const node of root.listNodes()) {
    const mesh = node.getMesh();
    if (!mesh) continue;
    console.log(`node "${node.getName()}" -> mesh "${mesh.getName()}"`);
    console.log('   T:', node.getTranslation(), 'R:', node.getRotation(), 'S:', node.getScale());
    console.log('   parent:', node.getParentNode() ? node.getParentNode().getName() : '(scene)');
    for (const prim of mesh.listPrimitives()) {
      const bb = bboxOf(prim);
      const mat = prim.getMaterial();
      console.log('   prim mat=', mat ? mat.getName() : 'null',
        'vtx=', bb.count,
        'min=', bb.min.map(v => v.toFixed(3)).join(','),
        'max=', bb.max.map(v => v.toFixed(3)).join(','));
    }
  }

  console.log('\n=== MATERIALS ===');
  root.listMaterials().forEach((m, i) => {
    const t = m.getBaseColorTexture();
    console.log(`${i} "${m.getName()}" alpha=${m.getAlphaMode()} cutoff=${m.getAlphaCutoff()} double=${m.getDoubleSided()} tex=${t ? t.getName() || '(unnamed)' : 'none'}`);
  });

  console.log('\n=== TEXTURES ===');
  root.listTextures().forEach((t, i) => {
    const img = t.getImage();
    console.log(`${i} "${t.getName()}" mime=${t.getMimeType()} bytes=${img ? img.byteLength : 0}`);
  });
})().catch(e => { console.error(e); process.exit(1); });

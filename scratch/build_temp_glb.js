const fs = require('fs');
const { NodeIO } = require('@gltf-transform/core');

const OFFSET_X = 5.5; // decal'i kapidan disari (+X) otele

(async () => {
  const io = new NodeIO();
  const doc = await io.read('assets/forklift.glb');
  const root = doc.getRoot();

  const mat = root.listMaterials().find(m => /logo|decal/i.test(m.getName()));
  // Opak logo dokusunu yukle, yeni texture olustur
  const png = fs.readFileSync('scratch/logo_opaque.png');
  const tex = mat.getBaseColorTexture();
  tex.setImage(png);          // PNG (RGB, alphasiz)
  tex.setMimeType('image/png');
  mat.setAlphaMode('OPAQUE'); // MASK -> OPAQUE
  mat.setAlphaCutoff(0.5);
  console.log('logo materyali OPAQUE yapildi, doku opak PNG ile degistirildi');

  // Decal prim POSITION'larini +X otele
  for (const mesh of root.listMeshes()) {
    if (!/logo|decal/i.test(mesh.getName())) continue;
    for (const prim of mesh.listPrimitives()) {
      const pos = prim.getAttribute('POSITION');
      const arr = pos.getArray().slice(); // kopya
      const n = pos.getCount();
      for (let i = 0; i < n; i++) arr[i * 3 + 0] += OFFSET_X;
      pos.setArray(arr);
      console.log('decal', mesh.getName(), 'POSITION +X', OFFSET_X, 'otelendi, vtx:', n);
    }
  }

  await io.write('scratch/forklift_temp.glb', doc);
  console.log('scratch/forklift_temp.glb yazildi');
})().catch(e => { console.error(e); process.exit(1); });

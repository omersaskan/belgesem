const { NodeIO } = require('@gltf-transform/core');
(async () => {
  const io = new NodeIO();
  const doc = await io.read('assets/forklift.glb');
  const root = doc.getRoot();
  console.log('=== MESHES (', root.listMeshes().length, ') ===');
  root.listMeshes().forEach((m, i) => {
    const prims = m.listPrimitives();
    console.log(`Mesh ${i} "${m.getName()}" prims=${prims.length}`);
    prims.forEach((p, j) => {
      const mat = p.getMaterial();
      const uvs = p.listSemantics().filter(s => s.startsWith('TEXCOORD'));
      console.log(`   prim${j} mat="${mat ? mat.getName() : 'NONE'}" uvSets=[${uvs}]`);
    });
  });
  console.log('\n=== MATERIALS (', root.listMaterials().length, ') ===');
  root.listMaterials().forEach((mat, i) => {
    const bc = mat.getBaseColorTexture();
    const bcInfo = mat.getBaseColorTextureInfo();
    console.log(`Mat ${i} "${mat.getName()}" alpha=${mat.getAlphaMode()} double=${mat.getDoubleSided()} baseColorTex=${bc ? (bc.getName() || '(unnamed)') : 'none'} texCoord=${bcInfo ? bcInfo.getTexCoord() : '-'} baseColorFactor=[${mat.getBaseColorFactor()}]`);
  });
  console.log('\n=== TEXTURES (', root.listTextures().length, ') ===');
  root.listTextures().forEach((t, i) => {
    const img = t.getImage();
    console.log(`Tex ${i} "${t.getName() || '(unnamed)'}" mime=${t.getMimeType()} bytes=${img ? img.byteLength : 0}`);
  });
})().catch(e => { console.error(e); process.exit(1); });

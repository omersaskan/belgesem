// iOS USDZ icin ara GLB: logo dokusu OPAK yapilir, her iki decal kendi tarafina otelenir.
// QuickLook seffaf/alpha-clip decal'i cizmiyor; bu yuzden logo opak turuncu zemine gomulur.
const fs = require('fs');
const sharp = require('sharp');
const { NodeIO } = require('@gltf-transform/core');

const OFFSET = 2.0;                 // yerel birim (world olcegi 0.0015 => ~3mm dunya) z-fighting payi
// decal'in altindaki govde albedo'su (panel_albedo.js ile olculdu: Material_7, her iki tarafta ayni)
const BODY_ORANGE = { r: 251, g: 107, b: 44 };
const BODY_ROUGHNESS = 0.6;         // Material_7 ile ayni parlaklik -> opak yama gorunmesin

(async () => {
  const io = new NodeIO();
  const doc = await io.read('assets/forklift.glb');
  const root = doc.getRoot();

  const mat = root.listMaterials().find(m => /logo|decal/i.test(m.getName()));
  if (!mat) throw new Error('logo materyali yok');
  const tex = mat.getBaseColorTexture();

  // seffaf logo -> govde turuncusu zemin uzerine yapistir (tam opak)
  const src = Buffer.from(tex.getImage());
  const meta = await sharp(src).metadata();
  const opaque = await sharp({
    create: { width: meta.width, height: meta.height, channels: 3, background: BODY_ORANGE },
  }).composite([{ input: src }]).removeAlpha().png().toBuffer();
  fs.writeFileSync('scratch/logo_opaque.png', opaque);
  tex.setImage(opaque);
  tex.setMimeType('image/png');
  mat.setAlphaMode('OPAQUE');
  mat.setRoughnessFactor(BODY_ROUGHNESS);
  console.log(`logo dokusu opak yapildi (${meta.width}x${meta.height}), materyal OPAQUE, roughness ${BODY_ROUGHNESS}`);

  // her decal'i kendi tarafina otele
  for (const node of root.listNodes()) {
    const mesh = node.getMesh();
    if (!mesh || !/logo|decal/i.test(node.getName())) continue;
    for (const prim of mesh.listPrimitives()) {
      const acc = prim.getAttribute('POSITION');
      const arr = acc.getArray().slice();
      const n = acc.getCount();
      let sum = 0;
      for (let i = 0; i < n; i++) sum += arr[i * 3];
      const side = sum >= 0 ? 1 : -1;
      for (let i = 0; i < n; i++) arr[i * 3] += side * OFFSET;
      acc.setArray(arr);
      console.log(`${node.getName()}: ${side > 0 ? '+X' : '-X'} yonunde ${OFFSET} otelendi (${n} vertex)`);
    }
  }

  await io.write('scratch/forklift_temp.glb', doc);
  console.log('scratch/forklift_temp.glb yazildi');
})().catch(e => { console.error(e); process.exit(1); });

const fs = require('fs');
const { NodeIO } = require('@gltf-transform/core');
(async () => {
  const io = new NodeIO();
  const doc = await io.read('assets/forklift.glb');
  const root = doc.getRoot();
  // Belgesem_logo materyalinin base color dokusu
  const mat = root.listMaterials().find(m => /logo|decal/i.test(m.getName()));
  if (!mat) { console.log('logo materyali yok'); return; }
  const tex = mat.getBaseColorTexture();
  console.log('logo mat:', mat.getName(), 'alphaMode:', mat.getAlphaMode());
  const img = tex.getImage();
  fs.writeFileSync('scratch/logo_src.png', Buffer.from(img));
  console.log('logo dokusu -> scratch/logo_src.png bytes:', img.byteLength, 'mime:', tex.getMimeType());

  // decal mesh node translation + vertex X araligi (kapi yuzeyine gore konum)
  for (const node of root.listNodes()) {
    const mesh = node.getMesh();
    if (mesh && /logo|decal/i.test(mesh.getName())) {
      console.log('decal node:', node.getName(), 'translation:', node.getTranslation(), 'scale:', node.getScale());
      const prim = mesh.listPrimitives()[0];
      const pos = prim.getAttribute('POSITION');
      let minx=1e9,maxx=-1e9,miny=1e9,maxy=-1e9,minz=1e9,maxz=-1e9;
      const el=[0,0,0];
      for (let i=0;i<pos.getCount();i++){pos.getElement(i,el);
        minx=Math.min(minx,el[0]);maxx=Math.max(maxx,el[0]);
        miny=Math.min(miny,el[1]);maxy=Math.max(maxy,el[1]);
        minz=Math.min(minz,el[2]);maxz=Math.max(maxz,el[2]);}
      console.log('  decal local POS x:[',minx.toFixed(2),maxx.toFixed(2),'] y:[',miny.toFixed(2),maxy.toFixed(2),'] z:[',minz.toFixed(2),maxz.toFixed(2),']');
    }
  }
})().catch(e=>{console.error(e);process.exit(1);});

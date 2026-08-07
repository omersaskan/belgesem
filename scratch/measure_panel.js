// Ortografik render'da turuncu panelin sinirlarini olc -> dunya (glTF) koordinatlarina cevir
const sharp = require('sharp');

// render_side.py ortho eslesmesi
const UPP = 0.6122 / 1600;            // dunya birimi / piksel  (ortho_scale/res_x)
const CY = -0.020687580108642578;      // blender Y merkez
const CZ = 0.15735916793346405;        // blender Z merkez
const pxToBY = px => CY + (px - 800) * UPP;
const pxToBZ = py => CZ - (py - 500) * UPP;
const bYToGZ = by => -by;              // glTF Z = -blender Y
const bZToGY = bz => bz;               // glTF Y = blender Z

const isOrange = (r, g, b) => r > 70 && r > g * 1.35 && g > b * 1.05 && r > b * 1.6;

(async () => {
  const file = process.argv[2] || 'scratch/side_px_nodecal.png';
  const { data, info } = await sharp(file).raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels: c } = info;

  // decal'in mevcut piksel kutusu
  const dz = [-0.142, -0.067], dy = [0.053, 0.082];
  const dpx = dz.map(gz => 800 + (-gz - CY) / UPP).sort((a, b) => a - b);
  const dpy = dy.map(gy => 500 - (gy - CZ) / UPP).sort((a, b) => a - b);
  console.log('mevcut decal piksel kutusu x', dpx.map(v => v.toFixed(0)), 'y', dpy.map(v => v.toFixed(0)));

  // her sutunda turuncu dikey araligi (decal bolgesi civari)
  console.log('\nsutun | pxX | gltfZ   | turuncu ust(gY) | turuncu alt(gY) | yukseklik | kesinti');
  for (let px = 940; px <= 1360; px += 20) {
    let top = -1, bot = -1;
    const runs = [];
    let runStart = -1;
    for (let py = 350; py < 950; py++) {
      const i = (py * w + px) * c;
      const o = isOrange(data[i], data[i + 1], data[i + 2]);
      if (o && runStart < 0) runStart = py;
      if (!o && runStart >= 0) { runs.push([runStart, py - 1]); runStart = -1; }
    }
    if (runStart >= 0) runs.push([runStart, 949]);
    const big = runs.filter(r => r[1] - r[0] > 8);
    if (!big.length) { console.log(px, 'turuncu yok'); continue; }
    top = big[0][0]; bot = big[big.length - 1][1];
    const gz = bYToGZ(pxToBY(px));
    console.log(
      String(px).padStart(5),
      '| z=' + gz.toFixed(4).padStart(8),
      '| ust y=' + bZToGY(pxToBZ(top)).toFixed(4),
      '| alt y=' + bZToGY(pxToBZ(bot)).toFixed(4),
      '| h=' + ((bot - top) * UPP).toFixed(4),
      '| parca=' + big.map(r => `${r[0]}-${r[1]}`).join(' ')
    );
  }
})().catch(e => { console.error(e); process.exit(1); });

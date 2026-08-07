// Logo bolgesindeki turuncu panelin sutun-sutun serbest dikey araligi
const sharp = require('sharp');
const UPP = 0.6122 / 1600;
const CY = -0.020687580108642578, CZ = 0.15735916793346405;
const pxToGZ = px => -(CY + (px - 800) * UPP);
const pyToGY = py => CZ - (py - 500) * UPP;

const isOrange = (r, g, b) => r > 70 && r > g * 1.35 && g > b * 1.05 && r > b * 1.6;

(async () => {
  const { data, info } = await sharp(process.argv[2] || 'scratch/side_px_nodecal.png')
    .raw().toBuffer({ resolveWithObject: true });
  const { width: w, channels: c } = info;
  const px0 = +(process.argv[3] || 1000), px1 = +(process.argv[4] || 1290);
  const seedY = +(process.argv[5] || 750);

  console.log('px   gltfZ      ust_py ust_gY   alt_py alt_gY   yukseklik');
  for (let px = px0; px <= px1; px += 5) {
    const at = py => { const i = (py * w + px) * c; return isOrange(data[i], data[i + 1], data[i + 2]); };
    if (!at(seedY)) { console.log(String(px).padStart(4), pxToGZ(px).toFixed(4), '  <seed turuncu degil>'); continue; }
    let top = seedY; while (top > 300 && at(top - 1)) top--;
    let bot = seedY; while (bot < 990 && at(bot + 1)) bot++;
    console.log(
      String(px).padStart(4),
      pxToGZ(px).toFixed(4).padStart(8),
      String(top).padStart(7), pyToGY(top).toFixed(4).padStart(8),
      String(bot).padStart(7), pyToGY(bot).toFixed(4).padStart(8),
      ((bot - top) * UPP).toFixed(4).padStart(9));
  }
})().catch(e => { console.error(e); process.exit(1); });

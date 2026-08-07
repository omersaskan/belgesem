// Onceki/sonraki karsilastirma gorseli uretir (render'lar oturum scratchpad'inde)
const sharp = require('sharp');
const SP = process.argv[2];
const W = 760, H = 456;
const label = t => Buffer.from(
  `<svg width="${W}" height="44"><rect width="100%" height="100%" fill="#111827"/>` +
  `<text x="16" y="30" font-family="Segoe UI,Arial" font-size="21" fill="#f9fafb">${t}</text></svg>`);

(async () => {
  const panels = [
    ['ONCE   -  sag taraf (tek logo)', SP + '/side_px.png', { left: 930, top: 610, width: 420, height: 252 }],
    ['SONRA  -  sag taraf (%26 buyuk)', SP + '/new_px.png', { left: 930, top: 610, width: 420, height: 252 }],
    ['SONRA  -  sol taraf (YENI)', SP + '/new_mx.png', { left: 250, top: 610, width: 420, height: 252 }],
  ];
  const imgs = [];
  for (const [t, f, c] of panels) {
    const body = await sharp(f).extract(c).resize({ width: W, height: H, fit: 'fill' }).png().toBuffer();
    const lab = await sharp(label(t)).png().toBuffer();
    imgs.push(await sharp({ create: { width: W, height: H + 44, channels: 3, background: '#111827' } })
      .composite([{ input: lab, top: 0, left: 0 }, { input: body, top: 44, left: 0 }]).png().toBuffer());
  }
  const h = H + 44;
  await sharp({ create: { width: W, height: h * 3 + 24, channels: 3, background: '#111827' } })
    .composite(imgs.map((b, i) => ({ input: b, top: i * (h + 12), left: 0 })))
    .png().toFile(SP + '/karsilastirma.png');
  console.log('yazildi:', SP + '/karsilastirma.png');
})().catch(e => { console.error(e); process.exit(1); });

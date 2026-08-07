// Referans logolarini ekranda goruntulendikleri boyuta (160x80 kutu, img max %85/%70)
// kucultup WebP'ye cevirir. 2x DPR icin hedef 280x120.
// HTML'deki src'ler de .webp'ye guncellenir.
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SRC_DIR = 'assets/referanslarımız/logoss';
const OUT_DIR = 'assets/referanslarımız/logoss-webp';
const MAX_W = 280, MAX_H = 120;
const APPLY = process.argv.includes('--apply');

(async () => {
  const pages = fs.readdirSync('.').filter(f => f.endsWith('.html'));
  // HTML'lerde gecen logo dosyalari
  const used = new Map();               // dosyaAdi -> [sayfa...]
  for (const p of pages) {
    const txt = fs.readFileSync(p, 'utf8');
    for (const m of txt.matchAll(/assets\/referanslarımız\/logoss\/([^'"]+?\.(?:png|jpe?g|gif|webp|webp))/gi)) {
      const f = decodeURIComponent(m[1]);
      if (!used.has(f)) used.set(f, []);
      if (!used.get(f).includes(p)) used.get(f).push(p);
    }
  }
  console.log(`HTML'lerde kullanilan logo: ${used.size}`);

  if (APPLY && !fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  // ".webp"ye cevirince ad cakisan gruplari onceden bul (orn. indir.png + indir.jpeg)
  const baseCount = new Map();
  for (const [file] of used) {
    const b = file.replace(/\.(png|jpe?g|gif|webp)$/i, '.webp');
    baseCount.set(b, (baseCount.get(b) || 0) + 1);
  }
  const collides = f => baseCount.get(f.replace(/\.(png|jpe?g|gif|webp)$/i, '.webp')) > 1;

  let before = 0, after = 0, done = 0, missing = [];
  const rename = new Map();             // eski dosya adi -> {name,w,h}
  for (const [file] of used) {
    const src = path.join(SRC_DIR, file);
    if (!fs.existsSync(src)) { missing.push(file); continue; }
    // cakisanlarda orijinal uzanti korunur: "indir.png" -> "indir.png.webp"
    const outName = collides(file) ? file + '.webp' : file.replace(/\.(png|jpe?g|gif|webp)$/i, '.webp');
    if (collides(file)) console.log(`  ad cakismasi: ${file} -> ${outName}`);
    const out = path.join(OUT_DIR, outName);
    const meta = await sharp(src).metadata();
    const buf = await sharp(src)
      .resize({ width: MAX_W, height: MAX_H, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82, effort: 5 })
      .toBuffer();
    const srcSize = fs.statSync(src).size;
    const outMeta = await sharp(buf).metadata();
    before += srcSize; after += buf.length; done++;
    rename.set(file, { name: outName, w: outMeta.width, h: outMeta.height });
    if (APPLY) fs.writeFileSync(out, buf);
    if (done <= 5) {
      const nm = await sharp(buf).metadata();
      console.log(`  ${file} ${meta.width}x${meta.height} ${(srcSize / 1024).toFixed(0)}KB -> ${nm.width}x${nm.height} ${(buf.length / 1024).toFixed(0)}KB`);
    }
  }
  if (missing.length) console.log(`\n!! diskte olmayan (atlandi): ${missing.join(', ')}`);

  console.log(`\n${done} logo: ${(before / 1e6).toFixed(2)} MB -> ${(after / 1e6).toFixed(2)} MB  (kazanc ${((1 - after / before) * 100).toFixed(0)}%)`);

  if (!APPLY) { console.log('\n(kuru calisma — yazmak icin --apply)'); return; }

  // HTML src'lerini yeni klasore/uzantiya cevir + lazy + gercek boyut
  const dims = new Map();               // yeni yol -> {w,h}
  for (const p of pages) {
    let txt = fs.readFileSync(p, 'utf8');
    const orig = txt;
    // HTML'de yollar ham UTF-8, yuzde kodlama yok
    txt = txt.replace(/(assets\/referanslarımız\/)logoss\/([^'"]+?\.(?:png|jpe?g|gif|webp))/gi, (all, pre, f) => {
      const r = rename.get(f);
      if (!r) return all;
      const np = pre + 'logoss-webp/' + r.name;
      dims.set(np, r);
      return np;
    });
    // referans logolarina lazy + kendi gercek olculeri
    txt = txt.replace(/<img src='(assets\/referanslarımız\/logoss-webp\/[^']+)' alt='Referans'>/g, (all, src) => {
      const d = dims.get(src);
      const wh = d ? ` width='${d.w}' height='${d.h}'` : '';
      return `<img src='${src}' alt='Referans' loading='lazy' decoding='async'${wh}>`;
    });
    if (txt !== orig) {
      fs.writeFileSync(p, txt);
      console.log(`guncellendi: ${p}`);
    }
  }
})().catch(e => { console.error(e); process.exit(1); });

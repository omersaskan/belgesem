// galeri.html'in referans verdigi eksik assets/web (1200w) ve assets/mobile (600w)
// gorsellerini orijinallerden uretir. resize_images.ps1 ile ayni profil (sadece
// genislik sinirlamasi, kirpma yok) ama daha iyi sikistirici (mozjpeg).
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SOURCES = ['assets/new_photos', 'assets/new_machinery_images', 'assets/makine_resimleri'];
const TARGETS = { web: 1200, mobile: 600 };
const QUALITY = 85;
const APPLY = process.argv.includes('--apply');

function findSource(name) {
  for (const d of SOURCES) {
    const p = path.join(d, name);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

(async () => {
  const html = fs.readFileSync('galeri.html', 'utf8');
  const refs = new Set();
  for (const m of html.matchAll(/assets\/(web|mobile)\/([A-Za-z0-9_-]+\.jpe?g)/gi)) refs.add(m[1] + '/' + m[2]);

  const todo = [];
  for (const rel of [...refs].sort()) {
    const [dir, name] = rel.split('/');
    const out = path.join('assets', dir, name);
    let reason = null;
    if (!fs.existsSync(out)) reason = 'eksik';
    else {
      const meta = await sharp(out).metadata();
      if (meta.width > TARGETS[dir]) reason = `kucultulmemis (${meta.width}x${meta.height})`;
    }
    if (!reason) continue;
    const src = findSource(name);
    if (!src) { console.log(`!! KAYNAK YOK: ${out} (${reason})`); continue; }
    todo.push({ out, src, dir, name, reason });
  }

  console.log(`islenecek: ${todo.length} dosya  (${APPLY ? 'UYGULANIYOR' : 'kuru calisma, --apply ile yaz'})\n`);
  let bytes = 0;
  for (const t of todo) {
    const buf = await sharp(t.src).resize({ width: TARGETS[t.dir], withoutEnlargement: true })
      .jpeg({ quality: QUALITY, mozjpeg: true }).toBuffer();
    const meta = await sharp(buf).metadata();
    bytes += buf.length;
    if (APPLY) fs.writeFileSync(t.out, buf);
    console.log(`${t.out.padEnd(30)} <- ${t.src.padEnd(34)} ${meta.width}x${meta.height} ${(buf.length / 1024).toFixed(0)}KB  [${t.reason}]`);
  }
  console.log(`\ntoplam ${todo.length} dosya, ${(bytes / 1e6).toFixed(1)} MB`);
})().catch(e => { console.error(e); process.exit(1); });

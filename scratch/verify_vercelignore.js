// .vercelignore guvenlik kontrolu: sitenin referans verdigi hicbir dosya deploy disi kalmasin.
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const patterns = fs.readFileSync('.vercelignore', 'utf8')
  .split(/\r?\n/).map(s => s.trim()).filter(s => s && !s.startsWith('#'));

function ignored(rel) {
  const p = rel.replace(/\\/g, '/');
  return patterns.some(pat => {
    if (pat.includes('*')) {
      const rx = new RegExp('^' + pat.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '[^/]*') + '$');
      return p.split('/').some(seg => rx.test(seg));
    }
    return p === pat || p.startsWith(pat + '/');
  });
}

// site kaynaklarindan yerel dosya referanslarini topla
const pageFiles = fs.readdirSync(ROOT).filter(f => /\.(html|css|js)$/i.test(f));
const refs = new Map();   // rel yol -> kaynak dosya
const RE = /(?:src|href|data-src|poster|content|srcset|imagesrcset)\s*=\s*["']([^"']+)["']|url\(\s*["']?([^"')]+)["']?\s*\)|["'](assets\/[^"']+)["']/gi;

for (const f of pageFiles) {
  const txt = fs.readFileSync(path.join(ROOT, f), 'utf8');
  let m;
  while ((m = RE.exec(txt))) {
    const raw = m[1] || m[2] || m[3];
    if (!raw) continue;
    // srcset "a.jpg 600w, b.jpg 1200w" -> tek tek yollar
    const parts = raw.includes(',') && /\d+[wx]\s*(,|$)/.test(raw)
      ? raw.split(',').map(s => s.trim().split(/\s+/)[0])
      : [raw];
    for (let u of parts) {
      if (!u) continue;
      if (/^(https?:|data:|blob:|mailto:|tel:|#|\/\/)/i.test(u)) continue;
      u = decodeURIComponent(u.split('#')[0].split('?')[0]).replace(/^\.\//, '').replace(/^\//, '');
      if (!u) continue;
      if (!refs.has(u)) refs.set(u, f);
    }
  }
}

let missing = 0, excluded = 0;
for (const [u, from] of [...refs].sort()) {
  const abs = path.join(ROOT, u);
  const exists = fs.existsSync(abs);
  const ign = ignored(u);
  if (ign) { console.log(`!! DEPLOY DISI ama referansli: ${u}   (${from})`); excluded++; }
  else if (!exists) { console.log(`?  diskte yok: ${u}   (${from})`); missing++; }
}
console.log(`\ntoplam yerel referans: ${refs.size}`);
console.log(`deploy disi kalan referansli dosya: ${excluded}  ${excluded ? '<-- SORUN' : '(temiz)'}`);
console.log(`zaten diskte olmayan referans: ${missing} (mevcut durum, .vercelignore ile ilgisiz)`);

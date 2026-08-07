// index.html'de elle yapilan kritik-yol duzeltmelerini diger sayfalara da uygular:
//  - lucide: render-bloklayan -> defer (+ createIcons DOMContentLoaded'a tasinir)
//  - Font Awesome ve Google Fonts: media=print/onload ile bloklamayan yukleme (+ noscript yedegi)
const fs = require('fs');
const APPLY = process.argv.includes('--apply');

const FA = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';

const pages = fs.readdirSync('.').filter(f => f.endsWith('.html') && f !== 'index.html');
for (const p of pages) {
  let txt = fs.readFileSync(p, 'utf8');
  const before = txt;
  const notes = [];

  // 1) lucide -> defer + surum sabitle
  txt = txt.replace(/<script\s+src="https:\/\/unpkg\.com\/lucide@[^"]*"\s*><\/script>/g, () => {
    notes.push('lucide defer');
    return '<script defer src="https://unpkg.com/lucide@1.29.0/dist/umd/lucide.min.js"></script>';
  });

  // 2) satir ici lucide.createIcons() -> DOMContentLoaded
  txt = txt.replace(/(<script>\s*)lucide\.createIcons\(\);(\s*<\/script>)/g, (all, a, b) => {
    notes.push('createIcons ertelendi');
    return a + "document.addEventListener('DOMContentLoaded', function () {\n            if (window.lucide) lucide.createIcons();\n        });" + b;
  });

  // 3) Font Awesome -> bloklamayan
  txt = txt.replace(new RegExp('<link rel="stylesheet" href="' + FA.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '"\\s*>', 'g'), () => {
    notes.push('FA async');
    return `<link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin>\n    <link rel="stylesheet" href="${FA}" media="print" onload="this.media='all'">\n    <noscript><link rel="stylesheet" href="${FA}"></noscript>`;
  });

  // 4) Google Fonts stylesheet -> bloklamayan (preconnect satirlarina dokunma)
  txt = txt.replace(/<link([^>]*?)href="(https:\/\/fonts\.googleapis\.com\/css2\?[^"]+)"([^>]*?)rel="stylesheet"([^>]*?)>/g,
    (all, a, href, b, c) => {
      if (all.includes('media=')) return all;
      notes.push('fonts async');
      return `<link${a}href="${href}"${b}rel="stylesheet"${c} media="print" onload="this.media='all'">\n    <noscript><link href="${href}" rel="stylesheet"></noscript>`;
    });

  if (txt !== before) {
    if (APPLY) fs.writeFileSync(p, txt);
    console.log(`${p}: ${notes.join(', ')}`);
  } else {
    console.log(`${p}: degisiklik yok`);
  }
}
if (!APPLY) console.log('\n(kuru calisma — yazmak icin --apply)');

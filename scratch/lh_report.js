// Lighthouse JSON raporunu ozetler
const fs = require('fs');
const r = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));

console.log('URL:', r.finalDisplayedUrl);
console.log('\n=== SKORLAR ===');
for (const [k, c] of Object.entries(r.categories)) {
  console.log(`  ${c.title.padEnd(16)} ${Math.round((c.score ?? 0) * 100)}`);
}

console.log('\n=== METRIKLER ===');
for (const id of ['first-contentful-paint', 'largest-contentful-paint', 'total-blocking-time',
  'cumulative-layout-shift', 'speed-index', 'interactive']) {
  const a = r.audits[id];
  if (a) console.log(`  ${a.title.padEnd(30)} ${a.displayValue || ''}`);
}

const onlyCat = process.argv[3];
for (const [key, cat] of Object.entries(r.categories)) {
  if (onlyCat && key !== onlyCat) continue;
  const fails = cat.auditRefs
    .map(ref => ({ ref, a: r.audits[ref.id] }))
    .filter(({ a }) => a && a.score !== null && a.score < 0.9 && a.scoreDisplayMode !== 'notApplicable');
  if (!fails.length) continue;
  console.log(`\n=== ${cat.title.toUpperCase()} - GECMEYEN (${fails.length}) ===`);
  for (const { ref, a } of fails.sort((x, y) => (x.a.score - y.a.score))) {
    const saving = a.details && a.details.overallSavingsMs ? ` [~${Math.round(a.details.overallSavingsMs)}ms]` : '';
    const bytes = a.details && a.details.overallSavingsBytes ? ` [${Math.round(a.details.overallSavingsBytes / 1024)}KB]` : '';
    console.log(`  (${Math.round(a.score * 100)}) ${a.title}${a.displayValue ? ' — ' + a.displayValue : ''}${saving}${bytes}`);
    const items = a.details && a.details.items;
    if (items && items.length && process.argv.includes('--detay')) {
      for (const it of items.slice(0, 6)) {
        const label = it.url || it.node?.snippet || it.source?.url || JSON.stringify(it).slice(0, 90);
        console.log('       - ' + String(label).replace(/^https?:\/\/[^/]+/, '').slice(0, 100));
      }
      if (items.length > 6) console.log(`       ... +${items.length - 6}`);
    }
  }
}

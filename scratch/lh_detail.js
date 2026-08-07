// Secili Lighthouse denetimlerinin madde detaylarini yazar
const r = JSON.parse(require('fs').readFileSync(process.argv[2], 'utf8'));

function show(id, n = 8) {
  const a = r.audits[id];
  if (!a) return;
  console.log(`### ${a.title}${a.displayValue ? ' — ' + a.displayValue : ''}`);
  const items = (a.details && a.details.items) || [];
  for (const x of items.slice(0, n)) {
    const u = String(x.url || (x.node && x.node.snippet) || x.entity || '').replace(/^https?:\/\/[^/]+/, '');
    const w = x.wastedBytes ? Math.round(x.wastedBytes / 1024) + 'KB' : '';
    const ms = x.wastedMs ? Math.round(x.wastedMs) + 'ms' : '';
    const sz = x.totalBytes ? '(' + Math.round(x.totalBytes / 1024) + 'KB toplam)' : '';
    console.log('   ' + decodeURIComponent(u).slice(0, 90) + '  ' + w + ' ' + ms + ' ' + sz);
  }
  if (items.length > n) console.log(`   ... +${items.length - n}`);
  console.log();
}

for (const id of process.argv.slice(3)) {
  const [name, n] = id.split(':');
  show(name, n ? +n : 8);
}

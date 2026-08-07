// Panel uzerinde tasmayan EN BUYUK logo dikdortgenini bul (en/boy orani sabit)
const { loadTriangles, probe } = require('./panel_probe.js');

const ASPECT = +(process.argv[3] || 320 / 120);   // logo dokusu en/boy
const MARGIN = +(process.argv[2] || 0.0035);  // panel kenarina birakilacak guvenlik payi
const FLUSH_TOL = 0.006;       // ayni duz panel sayilacak maks X sapmasi
const Y_BOTTOM = 0.0425;       // alttaki panel cizgisi (y~0.038) uzerinde kal

function rectOk(tris, zA, zB, yA, yB, side, nu = 22, nv = 10) {
  const vals = [];
  for (let j = 0; j <= nv; j++) {
    const y = yA + (yB - yA) * j / nv;
    for (let i = 0; i <= nu; i++) {
      const z = zA + (zB - zA) * i / nu;
      const x = probe(tris, z, y, side);
      if (x === null) return { ok: false, why: `delik z=${z.toFixed(4)} y=${y.toFixed(4)}` };
      vals.push(Math.abs(x));
    }
  }
  const mx = Math.max(...vals), mn = Math.min(...vals);
  if (mx - mn > FLUSH_TOL) return { ok: false, why: `X sapmasi ${(mx - mn).toFixed(4)}`, spread: mx - mn };
  return { ok: true, spread: mx - mn, xmin: mn, xmax: mx };
}

(async () => {
  const side = 1;
  const tris = await loadTriangles('assets/forklift.glb', { skipNames: ['logo'] });
  console.log('ucgen:', tris.length);

  // mevcut decal
  const cur = { zA: -0.1425, zB: -0.0675, yA: 0.0534, yB: 0.0815 };
  const curH = cur.yB - cur.yA, curW = cur.zB - cur.zA;
  console.log('mevcut: w', curW.toFixed(4), 'h', curH.toFixed(4), 'oran', (curW / curH).toFixed(3));
  console.log('mevcut dikdortgen kontrol (paysiz):', rectOk(tris, cur.zA, cur.zB, cur.yA, cur.yB, side));
  console.log('mevcut dikdortgen kontrol (payli):',
    rectOk(tris, cur.zA - MARGIN, cur.zB + MARGIN, cur.yA - MARGIN, cur.yB + MARGIN, side));

  // arama: (yA, zA) izgarasi uzerinde en buyuk h
  let best = null;
  for (let yA = Y_BOTTOM; yA <= 0.062; yA += 0.001) {
    for (let zA = -0.155; zA <= -0.130; zA += 0.001) {
      let lo = curH, hi = 0.060, okH = null, okRes = null;
      // once mevcut boyut gecerli mi
      if (!rectOk(tris, zA - MARGIN, zA + curW + MARGIN, yA - MARGIN, yA + curH + MARGIN, side).ok) continue;
      for (let it = 0; it < 14; it++) {
        const h = (lo + hi) / 2, w = h * ASPECT;
        const r = rectOk(tris, zA - MARGIN, zA + w + MARGIN, yA - MARGIN, yA + h + MARGIN, side);
        if (r.ok) { lo = h; okH = h; okRes = r; } else hi = h;
      }
      if (okH && (!best || okH > best.h)) best = { h: okH, w: okH * ASPECT, yA, zA, res: okRes };
    }
  }
  if (!best) { console.log('uygun yerlesim bulunamadi'); return; }
  console.log('\nEN IYI:');
  console.log('  zA', best.zA.toFixed(4), 'zB', (best.zA + best.w).toFixed(4),
    'yA', best.yA.toFixed(4), 'yB', (best.yA + best.h).toFixed(4));
  console.log('  w', best.w.toFixed(4), 'h', best.h.toFixed(4),
    '=> olcek', (best.h / curH).toFixed(3), 'x');
  console.log('  panel X', best.res);
})().catch(e => { console.error(e); process.exit(1); });

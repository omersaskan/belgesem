const https = require('https');
const http = require('http');
const fs = require('fs');

const urls = [
    'https://www.sesgazetesi.com.tr/aydin-insaatcilar-odasindan-uyelerine-buyuk-firsat?fbclid=IwY2xjawGasKpleHRuA2FlbQIxMQABHeBoy1yVHG_XQCpKDubbrqSbnnISjRZf0gtDwVsRSKt-OI_dfdNVGlgWlA_aem_0NFLqRWQfKCOh1mjXL7AsA',
    'https://dnghbr.site/e4c81c00',
    'https://www.aydindenge.com.tr/efeler/26/09/2024/efeler-belediyesinden-is-birligi-protokolu',
    'https://www.aydindetay.com/2024/05/incirliovada-tarim-makineleri-operatorleri-belgelerine-kavustu/',
    'https://www.aydindetay.com/2024/12/baskan-aricidan-istihdama-yonelik-onemli-adim/',
    'https://www.aydindetay.com/2025/01/belgesemden-aydinda-bir-ilk/',
    'http://aydindetay.com/2025/04/didim-belediyesinden-istihdam-atagi/',
    'https://www.aydindenge.com.tr/aydin/24/04/2025/belgesemden-didimde-istihdama-guclu-katki',
    'https://www.sokeekspres.com/amp/haber/25100977/baskan-sakalar-belgesemin-kalitesini-yakindan-inceledi',
    'https://www.haberler.com/amp/germencik-belediyesi-ve-belgesem-is-ve-tarim-makineleri-operatorluk-kursu-isbirligi-16668441-haberi/',
    'https://www.iha.com.tr/aydin-haberleri/kocarli-belediyesi-belgesem-ile-istihdam-protokolu-imzaladi-49231613',
    'https://denizliyeniolay.com/etiket/belgesem-is-ve-tarim-makineleri-operator-yetistirme-kursu',
    'https://www.cine.bel.tr/haber/belgesem-operator-yetistirme-kursu-belgelerini-teslim-ettik',
    'https://haber.sabancimedya.com/nazilli-belediyesi-ile-belgesem-arasinda-indirim-protokolu/',
    'https://www.millethaber.com.tr/amp/haber/aydin-in-ilk-ve-tek-operatorluk-kursu-belgesem/2635/',
    'https://www.aydinkulis.com/belgesemden-anlamli-protokol/amp'
];

function fetchTitle(url) {
    return new Promise((resolve) => {
        const client = url.startsWith('https') ? https : http;
        const req = client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const titleMatch = data.match(/<title[^>]*>([^<]+)<\/title>/i);
                const imgMatch = data.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
                let title = titleMatch ? titleMatch[1].trim().replace(/&#[0-9]+;/g, '').replace(/&[a-z]+;/gi, '').split('|')[0].trim() : 'BELGESEM Haber';
                let img = imgMatch ? imgMatch[1] : 'https://images.unsplash.com/photo-1585829365234-781fcd0d13d2?auto=format&fit=crop&q=80&w=800';
                
                if (title.length > 80) title = title.substring(0, 80) + '...';
                resolve({ url, title, img });
            });
        }).on('error', () => {
            let fallbackTitle = url.split('/').filter(p => p).pop().replace(/-/g, ' ').replace(/\?.*/, '');
            resolve({ url, title: fallbackTitle || 'BELGESEM Haber', img: 'https://images.unsplash.com/photo-1585829365234-781fcd0d13d2?auto=format&fit=crop&q=80&w=800' });
        });
        
        req.setTimeout(5000, () => {
            req.destroy();
        });
    });
}

Promise.all(urls.map(fetchTitle)).then(results => {
    let html = '';
    results.forEach(r => {
        html += `                    <div class="news-card">
                        <div class="news-image">
                            <img src="${r.img}" alt="Haber" style="width:100%; height:200px; object-fit:cover;">
                        </div>
                        <div class="news-content">
                            <h3 style="font-size: 1.1rem; margin-bottom: 15px;">${r.title}</h3>
                            <a href="${r.url}" target="_blank" class="read-more">Habere Git <i data-lucide="arrow-right"></i></a>
                        </div>
                    </div>\n`;
    });
    fs.writeFileSync('news.html', html);
    console.log('Done');
});

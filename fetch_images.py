import urllib.request
import re
import json

urls = [
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
]

results = []
for u in urls:
    try:
        req = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'})
        html = urllib.request.urlopen(req, timeout=10).read().decode('utf-8', errors='ignore')
        
        img_match = re.search(r'<meta\s+(?:name|property)=[\'"]og:image[\'"]\s+content=[\'"]([^\'"]+)[\'"]', html, re.I)
        if not img_match:
            img_match = re.search(r'<meta\s+content=[\'"]([^\'"]+)[\'"]\s+(?:name|property)=[\'"]og:image[\'"]', html, re.I)
            
        img = img_match.group(1) if img_match else 'NONE'
        
        # fix relative urls
        if img.startswith('/'):
            domain = re.search(r'https?://[^/]+', u).group(0)
            img = domain + img
            
        print(f"FOUND: {u} -> {img}")
        results.append(img)
    except Exception as e:
        print(f"ERROR on {u}: {e}")
        results.append('NONE')

with open('image_results.json', 'w') as f:
    json.dump(results, f)

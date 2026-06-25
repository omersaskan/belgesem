const fs = require('fs');
const path = 'c:\\Users\\Lenovo\\Desktop\\belgesem\\script.js';
let content = fs.readFileSync(path, 'utf8');

// Find start and end of the block to replace
const startMarker = "const machineryDetails = {";
const endMarker = "function updateModalContent(name) {";

let startIndex = content.indexOf(startMarker);
let endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
    console.error("Could not find markers!");
    process.exit(1);
}

// We need to also replace updateModalContent entirely
const endOfUpdateModalContent = content.indexOf("document.getElementById('modal-category')", endIndex);

const newCode = `const machineryDetails = {
        "BEKO LODER": {
            category: "İş Makinesi",
            duration: "60 Saat Eğitim",
            imageWeb: "assets/web/DSC07062.jpg",
            imageMobile: "assets/mobile/DSC07061.jpg",
            intro: "Beko Loder, ya da diğer bilinen adıyla kazıcı-yükleyici, traktör gövdesinin önünde kova ve arkasında kazıcı ile birleştirilmesi ile ortaya çıkmış olan bir iş makinesidir.",
            objectives: [
                "Kazıcı ve yükleyici kısımların hidrolik sistem kontrollerini kavrama",
                "Malzeme yükleme, taşıma ve toprak kazma tekniklerini geliştirme",
                "Emniyet kuralları ve iş güvenliği standartlarını uygulama",
                "Dar alanlarda ve küçük ölçekli şantiyelerde güvenli sürüş"
            ],
            workAreas: "Dar alanlı ve küçük ölçekteki yapı yerleri, Yol yapım faaliyetleri, Kazı işleri, İnşaat ve yapı işlemleri, Kent ve peyzaj tasarımları."
        },
        "EKSKAVATÖR": {
            category: "İş Makinesi",
            duration: "60 Saat Eğitim",
            imageWeb: "assets/web/DSC07080.jpg",
            imageMobile: "assets/mobile/DSC07080.jpg",
            intro: "Alt kısmı paletli, lastik tekerlekli veya kamyon şasili olan bu esnek iş makinesi, kendi bulunduğu düzeyin altında veya üzerinde kazı yapabilme kabiliyetine sahiptir.",
            objectives: [
                "Tahrik motoru ve kumanda tertibatının teknik işleyişini anlama",
                "Farklı kepçe türleri (düz, ters, çeneli) ile kazı teknikleri",
                "Yıkım, kazı ve arazi düzenleme operasyonlarında güvenlik",
                "Aşınan parçaların kontrolü ve periyodik bakım bilgisi"
            ],
            workAreas: "Yıkım, kazı ve arazi düzenleme işleri, büyük ölçekli altyapı ve inşaat projeleri."
        },
        "LODER": {
            category: "İş Makinesi",
            duration: "60 Saat Eğitim",
            imageWeb: "assets/web/DSC07064.jpg",
            imageMobile: "assets/mobile/DSC07063.jpg",
            intro: "Loder (Yükleyici), önde yüklemeyi sağlayan kepçe kısmından oluşan ve ağır malzemelerin taşınması, yüklenmesi ya da boşaltılması işlemlerinde kullanılan güçlü bir makinedir.",
            objectives: [
                "Kepçe ve hidrolik sistemlerin etkin ve güvenli kullanımı",
                "Ağır malzemelerin dengeli yüklenmesi ve transferi",
                "İnşaat, madencilik ve tarım alanlarındaki operasyonel süreçler",
                "Verimli yakıt kullanımı ve operasyonel hız teknikleri"
            ],
            workAreas: "İnşaat şantiyeleri (bina, yol, köprü), maden ocakları, tarım arazileri, belediye ve kamu kurumları altyapı çalışmaları."
        },
        "FORKLİFT": {
            category: "İş Makinesi",
            duration: "60 Saat Eğitim",
            imageWeb: "assets/web/DSC07098_1.jpg",
            imageMobile: "assets/mobile/DSC07098.jpg",
            intro: "Forklift, ağır yükleri çatalları aracılığıyla kaldırmak ve özellikle paletlerin üzerindeki ağırlıkları taşımak, kaldırmak ve istif etmek için kullanılan vazgeçilmez bir araçtır.",
            objectives: [
                "Yüklerin dengeli kaldırılması ve raflara güvenli istiflenmesi",
                "Lojistik ve depo içi dar alanlarda manevra kabiliyeti",
                "Çatal kontrolü ve yük merkezi hesaplama prensipleri",
                "İş makinesi operatörlük belgesi standartlarına uygun kullanım"
            ],
            workAreas: "Otomotiv sektörü, gıda sektörü, lojistik depoları, antrepolar ve çeşitli üretim tesisleri."
        },
        "GREYDER": {
            category: "İş Makinesi",
            duration: "60 Saat Eğitim",
            imageWeb: "assets/web/DSC07056.jpg",
            imageMobile: "assets/mobile/DSC07055.jpg",
            intro: "Greyderler; tesviye işleri, yol yapımı, hendek kazma, karıştırma, yayma ve karla mücadele gibi çok amaçlı görevlerde kullanılan hassas makinelerdir.",
            objectives: [
                "Tesviye, bombelik verme ve yüzey düzleme teknikleri",
                "Malzeme yayma ve yana yığma operasyonları",
                "Hafif kazıma ve hendek açma süreçlerinde bıçak kontrolü",
                "Yol yapım ve bakım projelerinde operasyonel yetkinlik"
            ],
            workAreas: "Yol yapımı, yüzey düzleme çalışmaları, tarım arazisi düzenleme, karla mücadele faaliyetleri."
        },
        "DOZER (PALETLİ)": {
            category: "İş Makinesi",
            duration: "60 Saat Eğitim",
            imageWeb: "assets/web/DSC07059.jpg",
            imageMobile: "assets/mobile/DSC07060.jpg",
            intro: "İnşaat sahalarında toprak ve moloz taşımak için kullanılan, büyük bir bıçak ve güçlü paletlerle donatılmış, yüksek itme gücüne sahip iş makinesidir.",
            objectives: [
                "Bıçak kontrolü ile toprak kazma ve taşıma teknikleri",
                "Zorlu arazi koşullarında paletli şasi hakimiyeti",
                "İnşaat, maden ve tarım alanlarındaki zemin hazırlık süreçleri",
                "Güvenli operasyon ve makine sınırlarının etkin kullanımı"
            ],
            workAreas: "İnşaat şantiyeleri (bina, yol, köprü), maden sahaları, belediye yol bakım çalışmaları, tarım arazisi hazırlığı."
        },
        "SİLİNDİR": {
            category: "İş Makinesi",
            duration: "60 Saat Eğitim",
            imageWeb: "assets/web/DSC07073.jpg",
            imageMobile: "assets/mobile/DSC07071.jpg",
            intro: "Asfalt silindiri; yola dökülen asfalt, çakıl gibi malzemelerin eşit ve düz bir şekilde yayılmasını sağlayan, zemini sıkıştırarak presleyen kritik bir araçtır.",
            objectives: [
                "Zemin sıkıştırma ve presleme tekniklerini uygulama",
                "Engebeli arazileri dayanıklı ve düz hale getirme",
                "Büyük yapı inşaatları öncesi zemin güçlendirme yöntemleri",
                "Yol, havaalanı ve stadyum yapımındaki operasyonel adımlar"
            ],
            workAreas: "Karayolu yapımı ve onarımı, inşaat alanları, su kanalı açımı, havaalanı ve otogar yapımı, stadyum projeleri."
        },
        "MOBİL VİNÇ": {
            category: "İş Makinesi",
            duration: "60 Saat Eğitim",
            imageWeb: "assets/web/DSC07050.jpg",
            imageMobile: "assets/mobile/DSC07049.jpg",
            intro: "Tekerlekli şasi üzerine monte edilmiş, çeşitli yükleri kaldırıp taşıyabilen hidrolik veya elektrikli sistemlerle donatılmış çok yönlü bir kaldırma aracıdır.",
            objectives: [
                "Ağır makine, konteyner ve yapı elemanlarının güvenli kaldırılması",
                "Montaj ve demontaj süreçlerinde hassas vinç kontrolü",
                "Dış cephe çalışmaları ve yüksek katlı bina operasyonları",
                "Enerji ve sanayi sektöründeki teknik kaldırma prosedürleri"
            ],
            workAreas: "Fabrika taşıma, ağır makine nakliyesi, çelik konstrüksiyon montajı, bina dış cephe işleri, enerji sektörü montaj çalışmaları."
        },
        "İSTİF MAKİNESİ": {
            category: "İş Makinesi",
            duration: "60 Saat Eğitim",
            imageWeb: "assets/web/DSC07095.jpg",
            imageMobile: "assets/mobile/DSC07091.jpg",
            intro: "Genellikle elektrikli modelleri bulunan, dar alanlarda yükleri belirli bir yüksekliğe (6 metreye kadar) kaldırarak depolama düzeni sağlayan araçlardır.",
            objectives: [
                "Yüklerin yüksek raflara güvenli yerleştirilmesi ve düzenlenmesi",
                "Dar alanlarda akülü istif makinesi manevra teknikleri",
                "Depo içi düzenleme ve lojistik verimlilik standartları",
                "Güvenli yük kaldırma ve taşıma kapasitesi kontrolü"
            ],
            workAreas: "Depolar, fabrikalar, limanlar ve lojistik merkezleri."
        },
        "ELEKTRİKLİ TRANSPALET": {
            category: "İş Makinesi",
            duration: "18 Saat Eğitim",
            imageWeb: "assets/web/DSC07095.jpg",
            imageMobile: "assets/mobile/DSC07095.jpg",
            intro: "Paletli yüklerin kısa mesafelerde taşınması ve depolama alanları arasında kolayca yönlendirilmesi için tasarlanmış, zemin seviyesinde çalışan pratik araçlardır.",
            objectives: [
                "Elektrikli transpalet ile güvenli yük transferi",
                "Depolama alanları arası lojistik akışın yönetimi",
                "Palet yerleştirme ve kısa mesafe taşıma teknikleri",
                "Makine periyodik bakımı ve şarj yönetimi"
            ],
            workAreas: "Depolar, fabrikalar, atölyeler ve gıda sektörü işletmeleri."
        },
        "KÖPRÜLÜ VİNÇ": {
            category: "İş Makinesi",
            duration: "48 Saat Eğitim",
            imageWeb: "assets/web/DSC07046.jpg",
            imageMobile: "assets/mobile/DSC07045.jpg",
            intro: "İki paralel ray üzerinde hareket eden köprü yapısıyla geniş alanlarda ağır yük taşıma kabiliyeti sunan güçlü ve dayanıklı sistemlerdir.",
            objectives: [
                "Ray üstü hareketli sistemlerin kontrol mekanizmaları",
                "Ağır metal ve endüstriyel yüklerin güvenli transferi",
                "Döküm haneler ve tersane gibi zorlu ortamlarda çalışma disiplini",
                "Sapanlama ve işaretçi koordinasyonu ile vinç kullanımı"
            ],
            workAreas: "Demir-çelik tesisleri, döküm haneler, tersaneler, madenler, limanlar ve gıda üretim tesisleri."
        },
        "PERSONEL VE YÜK YÜKSELTİCİ (MANLİFT)": {
            category: "İş Makinesi",
            duration: "60 Saat Eğitim",
            imageWeb: "assets/web/DSC07044.jpg",
            imageMobile: "assets/mobile/DSC07043.jpg",
            intro: "İşçilerin ve ekipmanların güvenli bir şekilde yüksekte çalışmasını sağlayan, verimli ve emniyetli bir çalışma ortamı sunan platformlardır.",
            objectives: [
                "Yükseklikte çalışma güvenliği ve platform kontrolü",
                "Bakım, onarım ve montaj işlerinde manlift kullanımı",
                "Farklı zemin koşullarında stabilizasyon teknikleri",
                "Keşif, taahhüt ve süsleme çalışmalarındaki operasyonlar"
            ],
            workAreas: "AVM'ler, fabrikalar, tersaneler, inşaat alanları, tesis bakımı ve dış cephe reklam çalışmaları."
        },
        "ÇEKME ARACI İŞ MAKİNESİ": {
            category: "İş Makinesi",
            duration: "60 Saat Eğitim",
            imageWeb: "assets/web/DSC07048.jpg",
            imageMobile: "assets/mobile/DSC07047.jpg",
            intro: "Trafiğe kapalı alanlarda bagaj, kargo ve yüklerin güvenli taşınması için kullanılan, genellikle elektrikle çalışan çekme araçlarıdır.",
            objectives: [
                "Römork bağlantısı ve güvenli yük sevkiyatı",
                "Havalimanı ve fabrika içi trafik kurallarına uyum",
                "Elektrikli çekme araçlarının teknik kontrolü ve kullanımı",
                "Yüklerin sarsıntısız ve emniyetli transferi"
            ],
            workAreas: "Fabrikalar, büyük depolar ve havalimanları."
        },
        "ZEMİN, YOL SÜPÜRME VE TEMİZLEME MAKİNESİ": {
            category: "İş Makinesi",
            duration: "60 Saat Eğitim",
            imageWeb: "https://images.unsplash.com/photo-1541625602330-2277a4c4b282?auto=format&fit=crop&q=80&w=1000",
            imageMobile: "https://images.unsplash.com/photo-1541625602330-2277a4c4b282?auto=format&fit=crop&q=80&w=1000",
            intro: "Sert zeminlerin fırça, ped ve vakum sistemleri ile hızlı ve etkili bir şekilde temizlenmesini sağlayan profesyonel temizlik makineleridir.",
            objectives: [
                "Fırça ve vakum sistemlerinin etkin ayarlanması",
                "Temizlik kimyasallarının doğru kullanımı ve zemin analizi",
                "Geniş alanlarda zaman ve iş gücü tasarrufu teknikleri",
                "Sürücülü otomatlar ve yüksek basınçlı sistemlerin yönetimi"
            ],
            workAreas: "Fabrikalar, AVM'ler, oteller, okullar, hastaneler ve üretim tesisleri."
        },
        "BUGGY (GOLF ARABASI)": {
            category: "İş Makinesi",
            duration: "44 Saat Eğitim",
            imageWeb: "assets/web/DSC07100.jpg",
            imageMobile: "assets/mobile/DSC07099.jpg",
            intro: "Elektrikli veya içten yanmalı motorlu, yol dışı alanlarda personel ve bagaj/yük taşıma amacıyla kullanılan pratik araçlardır.",
            objectives: [
                "Güvenli yolcu ve hafif yük taşıma teknikleri",
                "Kampüs ve tatil köyü içi güvenli sürüş disiplini",
                "Elektrikli motor sistemleri ve şarj prosedürleri",
                "Dar yollarda ve kalabalık alanlarda manevra yetkinliği"
            ],
            workAreas: "Fabrikalar, kampüsler, tatil köyleri, hastaneler, havalimanları ve oteller."
        },
        "PAMUK TOPLAMA MAKİNESİ": {
            category: "Tarım Makinesi",
            duration: "78 Saat Eğitim",
            imageWeb: "https://images.unsplash.com/photo-1541625602330-2277a4c4b282?auto=format&fit=crop&q=80&w=1000",
            imageMobile: "https://images.unsplash.com/photo-1541625602330-2277a4c4b282?auto=format&fit=crop&q=80&w=1000",
            intro: "Pamuk bitkisinin tarladan otomasyonla toplanmasını sağlayan, traktörle çekilen veya kendi yürür çeşitleri bulunan ileri teknoloji bir tarım makinesidir.",
            objectives: [
                "Pamuk hasat sistemlerinin teknik kontrolü ve ayarları",
                "Hasat sırasında ürün kaybını minimize etme teknikleri",
                "Kendi yürür makinelerde arazi hakimiyeti ve güvenlik",
                "Sezonluk bakım ve depolama öncesi hazırlık süreçleri"
            ],
            workAreas: "Özel tarım işletmeleri, büyük ölçekli pamuk çiftlikleri ve hasat hizmeti veren firmalar."
        },
        "SİLAJ MAKİNESİ": {
            category: "Tarım Makinesi",
            duration: "78 Saat Eğitim",
            imageWeb: "https://images.unsplash.com/photo-1541625602330-2277a4c4b282?auto=format&fit=crop&q=80&w=1000",
            imageMobile: "https://images.unsplash.com/photo-1541625602330-2277a4c4b282?auto=format&fit=crop&q=80&w=1000",
            intro: "Yeşil yem bitkilerini biçip parçalayarak havasız ortamda saklanabilir (silaj) hale getiren, besin değerini koruyan profesyonel tarım makinesidir.",
            objectives: [
                "Biçme ve parçalama mekanizmalarının hassas ayarı",
                "Yemlerin besin değerini koruyacak işleme teknikleri",
                "Traktör kuyruk mili veya kendinden motorlu sistemlerin kullanımı",
                "Hatasız doldurma ve nakliye koordinasyonu"
            ],
            workAreas: "Tarla hasat alanları, çiftlik içi silo yakınları ve hayvancılık işletmeleri."
        },
        "BİÇERDÖVER": {
            category: "Tarım Makinesi",
            duration: "60 Saat Eğitim",
            imageWeb: "assets/web/DSC07054.jpg",
            imageMobile: "assets/mobile/DSC07052.jpg",
            intro: "Hasat, harman ve savurma işlemlerini tek geçişte yaparak buğday, arpa, mısır gibi ürünleri ayrıştıran yüksek kapasiteli motorlu tarım makinesidir.",
            objectives: [
                "Ürüne göre dövme ve eleme sistemi ayarlamaları",
                "GPS destekli hasat ve verim izleme sistemleri",
                "Maksimum kapasite ile minimum ürün kaybı stratejileri",
                "Yangın güvenliği ve hasat sırasında acil durum yönetimi"
            ],
            workAreas: "Geniş tarım arazileri, özel hasat işletmeleri ve büyük ölçekli çiftlikler."
        },
        "ÇIRÇIR MAKİNESİ": {
            category: "Tarım Makinesi",
            duration: "78 Saat Eğitim",
            imageWeb: "assets/web/DSC07038.jpg",
            imageMobile: "assets/mobile/DSC07037.jpg",
            intro: "Tarladan toplanan kütlü pamuğu çiğitlerinden ve yabancı maddelerden ayırarak elyafı temizleyen kritik bir endüstriyel cihazdır.",
            objectives: [
                "Liflerin tohumdan ayrılması sürecindeki teknik kontrol",
                "Elyaf temizleme ve kalite standartlarının korunması",
                "Endüstriyel çırçır sistemlerinin güvenli işletimi",
                "Hammadde girişinden temizlenmiş pamuk çıkışına kadar proses yönetimi"
            ],
            workAreas: "Çırçır fabrikaları, pamuk işleme tesisleri ve tekstil ön hazırlık birimleri."
        },
        "SONDAJ": {
            category: "İş Makinesi",
            duration: "60 Saat Eğitim",
            imageWeb: "assets/mobile/DSC07041.jpg", /* Forced mobile image per user request */
            imageMobile: "assets/mobile/DSC07041.jpg",
            intro: "Sondaj makinesi, yer altında su, maden veya zemin etüdü için delik açmada kullanılan güçlü bir iş makinesidir.",
            objectives: [
                "Sondaj kulesi ve matkap sistemlerinin kurulumu",
                "Farklı zemin yapılarında delme teknikleri",
                "Sondaj çamuru ve kuyu güvenliği yönetimi",
                "Hidrolik ve mekanik sistemlerin periyodik kontrolü"
            ],
            workAreas: "Su kuyusu açma, maden arama, zemin etüdü ve jeotermal projeler."
        },
        "İTFAİYE ARACI": {
            category: "İş Makinesi",
            duration: "60 Saat Eğitim",
            imageWeb: "assets/web/DSC07070.jpg",
            imageMobile: "assets/mobile/DSC07069.jpg",
            intro: "İtfaiye araçları, yangınla mücadele ve kurtarma operasyonları için özel donanımlara sahip acil müdahale araçlarıdır.",
            objectives: [
                "Pompa ve su ikmal sistemlerinin kullanımı",
                "Merdiven ve kurtarma ekipmanlarının operasyonu",
                "Acil durum sürüş teknikleri ve saha güvenliği",
                "Araç üstü ekipmanların teknik bakımı"
            ],
            workAreas: "Belediye itfaiye teşkilatları, endüstriyel tesisler ve havalimanları."
        },
        "ÇÖP KAMYONU": {
            category: "İş Makinesi",
            duration: "60 Saat Eğitim",
            imageWeb: "assets/web/DSC07067.jpg",
            imageMobile: "assets/mobile/DSC07066.jpg",
            intro: "Çöp kamyonları, katı atıkların toplanması ve sıkıştırılarak taşınması için tasarlanmış özel donanımlı araçlardır.",
            objectives: [
                "Hidrolik sıkıştırma sistemlerinin kullanımı",
                "Atık toplama rotası ve zaman yönetimi",
                "Araç arkası personel güvenliği ve iletişim",
                "Hijyen ve periyodik bakım prosedürleri"
            ],
            workAreas: "Belediye temizlik işleri ve özel atık yönetim firmaları."
        },
        "BETON MİKSERİ": {
            category: "İş Makinesi",
            duration: "60 Saat Eğitim",
            imageWeb: "assets/web/DSC07075.jpg",
            imageMobile: "assets/mobile/DSC07074.jpg",
            intro: "Beton mikseri (transmikser), hazır betonun özelliklerini kaybetmeden şantiyeye taşınmasını ve dökülmesini sağlayan araçtır.",
            objectives: [
                "Tambur dönüş hızı ve karışım kontrolü",
                "Beton döküm ve oluk yönetimi",
                "Şantiye içi güvenli sürüş ve manevra",
                "Mikser temizliği ve teknik bakım esasları"
            ],
            workAreas: "Hazır beton tesisleri, inşaat şantiyeleri ve altyapı projeleri."
        },
        "VİDANJÖR": {
            category: "İş Makinesi",
            duration: "60 Saat Eğitim",
            imageWeb: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1000",
            imageMobile: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1000",
            intro: "Vidanjör, sıvı atıkların vakumlanarak toplanması ve nakledilmesi için kullanılan donanımlı bir iş makinesidir.",
            objectives: [
                "Vakum pompası ve emiş sistemlerinin kullanımı",
                "Sıvı atık sevkiyatı ve boşaltma prosedürleri",
                "Yüksek basınçlı yıkama ve kanal açma teknikleri",
                "Operasyonel güvenlik ve sızdırmazlık kontrolü"
            ],
            workAreas: "Belediye altyapı hizmetleri, endüstriyel atık yönetimi ve özel temizlik firmaları."
        },
        "KULE VİNÇ": {
            category: "İş Makinesi",
            duration: "60 Saat Eğitim",
            imageWeb: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1000",
            imageMobile: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1000",
            intro: "Kule vinç, özellikle yüksek katlı yapıların inşaatında ağır yüklerin dikey ve yatay taşınmasını sağlayan sabit kaldırma sistemidir.",
            objectives: [
                "Vinç kurulumu ve denge mekanizmalarını kavrama",
                "Yüksekte güvenli operasyon ve yükleme teknikleri",
                "Haberleşme ve işaretçi koordinasyonu",
                "Rüzgar hızı ve çevre koşullarına göre güvenli çalışma"
            ],
            workAreas: "Yüksek katlı bina inşaatları, büyük ölçekli şantiyeler ve liman operasyonları."
        }
    };

    function getMachineryData(name) {
        // Extra entries for machines without dedicated photos or special cases
        const extras = {
            "YÜK ASANSÖRÜ": {
                category: "İş Makinesi",
                duration: "60 Saat Eğitim",
                imageWeb: "assets/web/DSC07044.jpg",
                imageMobile: "assets/mobile/DSC07043.jpg",
                intro: "Yük asansörleri, fabrika ve depolarda ağır yüklerin katlar arasında güvenle taşınmasını sağlayan endüstriyel kaldırma sistemleridir.",
                objectives: [
                    "Asansör kapasitesi ve güvenli yük limitleri",
                    "Hidrolik ve elektrikli kontrol sistemlerinin kullanımı",
                    "Bakım ve arıza prosedürleri",
                    "İş güvenliği ve acil durum protokolleri"
                ],
                workAreas: "Fabrikalar, depolar, AVM'ler ve endüstriyel tesisler."
            },
            "SERDÜMEN / SAPANCI / İŞARETÇİ": {
                category: "İş Makinesi",
                duration: "30 Saat Eğitim",
                imageWeb: "assets/web/DSC07046.jpg",
                imageMobile: "assets/mobile/DSC07045.jpg",
                intro: "Vinç operasyonlarında yükün güvenli bağlanması, yönlendirilmesi ve koordinasyonunu sağlayan kritik yardımcı görev personelidir.",
                objectives: [
                    "Sapan türleri ve güvenli bağlama teknikleri",
                    "Vinç operatörü ile işaret iletişimi",
                    "Yük kapasitesi ve denge hesabı",
                    "Acil durum prosedürleri ve kurtarma teknikleri"
                ],
                workAreas: "İnşaat şantiyeleri, fabrikalar, tersaneler ve liman operasyonları."
            }
        };

        const allDetails = { ...machineryDetails, ...extras };

        const baseData = {
            title: name,
            category: "İş Makinesi",
            duration: "60 Saat Eğitim",
            imageWeb: "assets/web/DSC07062.jpg",
            imageMobile: "assets/mobile/DSC07061.jpg",
            intro: \`\${name} operatörlüğü eğitimi ile mesleki yeterliliğinizi en üst seviyeye taşıyın.\`,
            objectives: [
                "Güvenli makine kullanımı ve operasyon yönetimi",
                "Teknik bakım ve günlük kontrol prosedürleri",
                "İş sağlığı ve güvenliği standartlarına uyum",
                "Verimli çalışma ve yakıt tasarrufu teknikleri"
            ],
            workAreas: "İnşaat, sanayi ve altyapı projeleri, lojistik merkezleri, özel işletmeler."
        };

        if (name.includes("PAMUK") || name.includes("SİLAJ") || name.includes("BİÇERDÖVER") || name.includes("ÇIRÇIR")) {
            baseData.category = "Tarım Makinesi";
        }

        return { ...baseData, ...(allDetails[name] || {}) };
    }

    const modal = document.getElementById('machinery-modal');
    let currentPageMachines = [];
    let currentMachineIndex = -1;

    function updateModalContent(name) {
        const item = getMachineryData(name);
        if (!item) return;
        
        const heroImg = document.getElementById('modal-hero-img');
        heroImg.onerror = () => { heroImg.style.display = 'none'; };
        heroImg.onload = () => { heroImg.style.display = ''; };
        
        // Use the explicit web and mobile images with srcset
        if (item.imageWeb && item.imageMobile && !item.imageWeb.includes('unsplash')) {
            heroImg.src = item.imageWeb;
            heroImg.srcset = \`\${item.imageMobile} 600w, \${item.imageWeb} 1200w\`;
            heroImg.sizes = "(max-width: 768px) 100vw, 1200px";
        } else {
            heroImg.src = item.imageWeb || "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1000";
            heroImg.removeAttribute('srcset');
            heroImg.removeAttribute('sizes');
        }

        `;

content = content.substring(0, startIndex) + newCode + content.substring(endOfUpdateModalContent);
fs.writeFileSync(path, content, 'utf8');
console.log("Successfully updated script.js with explicit imageWeb and imageMobile mappings!");

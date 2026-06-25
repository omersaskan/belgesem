$path = "c:\Users\Lenovo\Desktop\belgesem\script.js"
$content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)

# Fix the getMachineryData function - fix encoding and add missing machines
$oldFunc = 'function getMachineryData(name) {
        const baseData = {
            title: name,
            category: "Eğitim Programı",
            duration: "80 Saat Eğitim",
            image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1000",
            intro: `${name} operatörlüğü eğitimi ile mesleki yeterliliğinizi en üst seviyeye taşıyın.`,
            objectives: [
                "Güvenli makine kullanımı ve operasyon yönetimi",
                "Teknik bakım ve günlük kontrol prosedürleri",
                "İş sağlığı ve güvenliği standartlarına uyum",
                "Verimli çalışma ve yakıt tasarrufu teknikleri"
            ],
            workAreas: "İnşaat, sanayi ve altyapı projeleri, lojistik merkezleri, özel işletmeler."
        };

        if (name.includes("MAKİNESİ") || name.includes("VİNÇ") || name.includes("KAMYONU") || name.includes("DOZER")) {
            baseData.category = "İş Makinesi";
        } else if (name.includes("PAMUK") || name.includes("SİLAJ") || name.includes("BİÇERDÖVER")) {
            baseData.category = "Tarım Makinesi";
        }

        return { ...baseData, ...(machineryDetails[name] || {}) };
    }'

# Find the actual function text (may have encoding issues)
$funcStart = $content.IndexOf("function getMachineryData(name)")
$funcEnd = $content.IndexOf("    const modal = document.getElementById")
$oldFuncActual = $content.Substring($funcStart, $funcEnd - $funcStart)

$newFunc = @'
function getMachineryData(name) {
        // Extra entries for machines without dedicated photos
        const extras = {
            "YÜK ASANSÖRÜ": {
                category: "İş Makinesi",
                duration: "60 Saat Eğitim",
                image: "assets/web/DSC07043.jpg",
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
                image: "assets/web/DSC07045.jpg",
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
            image: "assets/web/DSC07061.jpg",
            intro: `${name} operatörlüğü eğitimi ile mesleki yeterliliğinizi en üst seviyeye taşıyın.`,
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

'@

$newContent = $content.Replace($oldFuncActual, $newFunc)
[System.IO.File]::WriteAllText($path, $newContent, [System.Text.Encoding]::UTF8)
Write-Host "getMachineryData updated. New size: $((Get-Item $path).Length) bytes"

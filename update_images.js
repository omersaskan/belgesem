const fs = require('fs');

const mappings = {
    "ÇÖP KAMYONU": "1.jpeg",
    "SİLİNDİR": "2.jpeg",
    "ELEKTRİKLİ TRANSPALET": "3.jpeg",
    "EKSKAVATÖR": "4.jpeg",
    "KÖPRÜLÜ VİNÇ": "5.jpeg",
    "BETON MİKSERİ": "6.jpeg",
    "İTFAİYE ARACI": "7.jpeg",
    "LODER": "8.jpeg",
    "BEKO LODER": "9.jpeg",
    "GREYDER": "10.jpeg",
    "BUGGY \\(GOLF ARABASI\\)": "11.jpeg",
    "ÇIRÇIR MAKİNESİ": "12.jpeg",
    "ÇEKME ARACI - MAKİNESİ": "13.jpeg",
    "PERSONEL VE YÜK YÜKSELTİCİ \\(MANLİFT\\)": "14.jpeg",
    "DOZER \\(PALETLİ\\)": "15.jpeg",
    "İSTİF MAKİNESİ": "16.jpeg",
    "SONDAJ": "17.jpeg",
    "YÜK ASANSÖRÜ": "18.jpeg",
    "VİDANJÖR": "19.jpeg",
    "BİÇERDÖVER": "20.jpeg",
    "ZEMİN, YOL SÜPÜRME VE TEMİZLEME MAKİNESİ": "21.jpeg",
    "PAMUK TOPLAMA MAKİNESİ": "22.jpeg",
    "KULE VİNÇ": "23.jpeg"
};

let content = fs.readFileSync('script.js', 'utf8');

for (const [machineName, imgName] of Object.entries(mappings)) {
    // Regex to match the machine block start and its image properties
    // We only want to replace the FIRST occurrence of imageWeb and imageMobile within this block
    const blockRegex = new RegExp(`("${machineName}"|'${machineName}'):\\s*\\{[\\s\\S]*?\\}`, 'g');
    
    content = content.replace(blockRegex, (match) => {
        let updatedBlock = match.replace(/imageWeb:\s*['"][^'"]*['"]/, `imageWeb: "assets/yeni_gorseller/${imgName}"`);
        updatedBlock = updatedBlock.replace(/imageMobile:\s*['"][^'"]*['"]/, `imageMobile: "assets/yeni_gorseller/${imgName}"`);
        return updatedBlock;
    });
}

fs.writeFileSync('script.js', content, 'utf8');
console.log('Images updated successfully in script.js');

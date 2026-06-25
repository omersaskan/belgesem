const fs = require('fs');

const map = {
    'Ä±': 'ı',
    'ÅŸ': 'ş',
    'Åž': 'Ş',
    'Ã§': 'ç',
    'Ã‡': 'Ç',
    'Ã¶': 'ö',
    'Ã–': 'Ö',
    'Ã¼': 'ü',
    'Ãœ': 'Ü',
    'ÄŸ': 'ğ',
    'Äž': 'Ğ',
    'Ä°': 'İ',
    'Ã¢': 'â',
    'Ã\x8E': 'Î', // ÃŽ is Î but we can just use normal characters
    'Ã®': 'î',
    'Ã»': 'û',
    'Ã›': 'Û'
};

function fixFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    for (const [bad, good] of Object.entries(map)) {
        content = content.split(bad).join(good);
    }
    
    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed UTF-8 in ${filePath}`);
    }
}

const filesToFix = ['galeri.html', 'script.js'];

for (const file of filesToFix) {
    if (fs.existsSync(file)) {
        fixFile(file);
    }
}

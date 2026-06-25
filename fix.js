const fs = require('fs');
let html = fs.readFileSync('basinda-biz.html', 'utf8');
const newsHtml = fs.readFileSync('news.html', 'utf8')
    .replace(/\?t/g, "'")
    .replace(/Y/g, "ş")
    .replace(/Ǭ/g, "ü")
    .replace(//g, "ı");

let startStr = '<div class="grid grid-3 gap-30 news-grid">';
let endStr = '</div>\n            </div>\n        </section>';
if (!html.includes(endStr)) endStr = '</div>\r\n            </div>\r\n        </section>';

const start = html.indexOf(startStr);
const end = html.indexOf(endStr);

if (start !== -1 && end !== -1) {
    html = html.substring(0, start + startStr.length) + '\n' + newsHtml + '\n                ' + html.substring(end);
    fs.writeFileSync('basinda-biz.html', html);
    console.log("Replaced successfully!");
} else {
    console.log("Could not find start or end block.", start, end);
}

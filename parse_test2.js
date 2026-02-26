const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('workana_single.html', 'utf-8');
const $ = cheerio.load(html);

console.log("=== DESCRIPTION ===");
// Algumas divs comuns onde a Workana esconde o texto
const d1 = $('.expander').text().trim();
const d2 = $('.project-details').text().trim();
const d3 = $('section').text().trim();
console.log("D1 len:", d1.length);
console.log("D2 len:", d2.length);
console.log("D3 len:", d3.length);

if (d1) console.log(d1.substring(0, 100));
if (d2) console.log(d2.substring(0, 100));


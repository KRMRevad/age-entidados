const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('workana_single.html', 'utf-8');
const $ = cheerio.load(html);

// Description
console.log("=== DESCRIPTION ===");
console.log($('.expander').text().trim().substring(0, 200));

// Skills
console.log("\n=== SKILLS ===");
const skills = [];
$('.skills .skill').each((i, el) => { skills.push($(el).text().trim()); });
console.log(skills);

// Reward
console.log("\n=== REWARD ===");
$('.values').each((i, el) => console.log($(el).text().trim()));

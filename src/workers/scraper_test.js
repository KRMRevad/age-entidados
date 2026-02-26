const axios = require('axios');
const cheerio = require('cheerio');

async function test() {
    try {
        const { data } = await axios.get('https://www.workana.com/jobs?category=it-programming', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9,pt;q=0.8'
            }
        });
        const $ = cheerio.load(data);
        const projects = $('.project-item');
        console.log(`Encontrados ${projects.length} projetos com a classe .project-item`);
        
        if (projects.length === 0) {
            console.log("Dando log em parte do body pra ver o que veio:");
            console.log($('body').text().substring(0, 500));
        }
    } catch (e) {
        console.error("Erro:", e.message);
    }
}
test();

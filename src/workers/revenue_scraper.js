const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '../../squads/nexus/data');
const RAW_FILE = path.join(OUTPUT_DIR, 'raw_opportunities.json');
const WORKANA_URL = 'https://www.workana.com/jobs?category=it-programming';

async function runScraper() {
    console.log('Iniciando Varredura CLI-First (Puppeteer + Cheerio Deep Fetch)...');

    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    // Lista de Links
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    console.log(`Buscando projetos em: ${WORKANA_URL}`);
    await page.goto(WORKANA_URL, { waitUntil: 'networkidle2' });

    const htmlList = await page.content();
    const $list = cheerio.load(htmlList);
    const projectLinks = [];

    $list('.project-item').each((i, el) => {
        const item = $list(el);
        const relativeLink = item.find('.project-title a').attr('href');

        if (relativeLink) {
            const url = "https://www.workana.com" + relativeLink;
            const title = item.find('.project-title a').attr('title') || item.find('.project-title').text().trim();
            const rewardRaw = item.find('.values').text().trim() || 'N/A';

            const skills = [];
            item.find('.skills .skill').each((idx, s) => {
                skills.push($list(s).text().trim());
            });

            projectLinks.push({ url, title, rewardRaw, skills });
        }
    });

    console.log(`Encontrados ${projectLinks.length} links. Iniciando Extração Profunda (Deep Fetch)...`);
    const projects = [];

    for (let i = 0; i < Math.min(projectLinks.length, 10); i++) {
        const projData = projectLinks[i];
        console.log(`⬇️ Extraindo [${i + 1}/10]: ${projData.url}`);

        try {
            const detailPage = await browser.newPage();
            await detailPage.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
            await detailPage.goto(projData.url, { waitUntil: 'domcontentloaded' });

            const detailHtml = await detailPage.content();
            const $ = cheerio.load(detailHtml);

            // Descrição Profunda
            const full_description = $('.expander').first().text().trim() || '';

            // Parse Min/Max Reward da string original
            const numbers = (projData.rewardRaw.match(/\d+(?:[.,]\d+)?/g) || []).map(n => parseInt(n.replace(/\D/g, '')));
            let rewardMin = 0, rewardMax = 0;
            if (numbers.length === 1) {
                rewardMax = numbers[0];
            } else if (numbers.length >= 2) {
                rewardMin = numbers[0];
                rewardMax = numbers[1];
            }

            // ID
            let hash = 0;
            for (let j = 0; j < projData.url.length; j++) {
                hash = ((hash << 5) - hash) + projData.url.charCodeAt(j);
                hash = hash & hash;
            }

            projects.push({
                id: `wkn_${Math.abs(hash)}`,
                platform: 'Workana',
                title: projData.title,
                url: projData.url,
                rewardRaw: projData.rewardRaw,
                rewardMin,
                rewardMax,
                skills: projData.skills,
                full_description,
                status: 'raw',
                scraped_at: new Date().toISOString()
            });

            await detailPage.close();

        } catch (e) {
            console.log(`Erro em ${url}: ${e.message}`);
        }
    }

    if (projects.length > 0) {
        fs.writeFileSync(RAW_FILE, JSON.stringify(projects, null, 2));
        console.log(`\n✅ Sucesso! ${projects.length} Projetos com Deep Fetch salvos em: ${RAW_FILE}`);
    }

    await browser.close();
}

runScraper().catch(console.error);

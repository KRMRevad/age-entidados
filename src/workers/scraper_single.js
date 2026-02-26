const puppeteer = require('puppeteer');

async function test() {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh)');
    
    const url = 'https://www.workana.com/job/desenvolvedor-odoo-erp-para-personalizacao-e-criacao-de-modulos-customizados';
    console.log(`Abrindo ${url}`);
    
    await page.goto(url, { waitUntil: 'networkidle0' });
    
    const html = await page.content();
    require('fs').writeFileSync('workana_single.html', html);
    console.log("Salvo workana_single.html");
    
    await browser.close();
}
test();

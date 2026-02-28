#!/usr/bin/env node

/**
 * Auto-Cert Farmer Bot
 *
 * Conecta a um Chrome existente (via porta 9222) e resolve testes Workana automaticamente
 * usando LLM local (Alienware 100.66.114.87:1234) como orquestrador.
 *
 * Usage:
 *   node src/workers/cert_farmer.js [--url <workana_test_url>] [--max-questions <num>]
 */

const puppeteer = require('puppeteer-core');
const axios = require('axios');

// Config
const CONFIG = {
  // Chrome remote debugging port (já aberto pelo usuário)
  CHROME_WS_ENDPOINT: 'ws://localhost:9222',

  // LLM local (Alienware)
  LLM_HOST: '100.66.114.87',
  LLM_PORT: 1234,
  LLM_MODEL: 'neural-chat', // modelo padrão LM Studio

  // Timeout e retries
  CONNECT_TIMEOUT: 10000,
  LLM_TIMEOUT: 30000,
  MAX_RETRIES: 3,
  QUESTION_WAIT_TIME: 2000, // tempo entre cliques
};

// Logger simples
const log = {
  info: (msg) => console.log(`[INFO] ${new Date().toISOString()} | ${msg}`),
  error: (msg) => console.error(`[ERROR] ${new Date().toISOString()} | ${msg}`),
  success: (msg) => console.log(`[✓] ${msg}`),
  debug: (msg) => console.log(`[DEBUG] ${msg}`),
};

/**
 * Conecta ao Chrome existente via remote debugging
 */
async function connectToChrome() {
  try {
    log.info(`Conectando ao Chrome em ${CONFIG.CHROME_WS_ENDPOINT}...`);

    const browser = await puppeteer.connect({
      browserWSEndpoint: CONFIG.CHROME_WS_ENDPOINT,
      timeout: CONFIG.CONNECT_TIMEOUT,
    });

    log.success('Chrome conectado com sucesso');
    return browser;
  } catch (error) {
    log.error(`Falha ao conectar ao Chrome: ${error.message}`);
    log.error(`Certifique-se de que o Chrome está rodando com: --remote-debugging-port=9222`);
    throw error;
  }
}

/**
 * Extrai pergunta e opções do DOM da Workana
 */
async function extractQuestionAndOptions(page) {
  return await page.evaluate(() => {
    // Padrão 1: Workana - seção de questão
    let questionText = null;
    let options = [];

    // Tenta diferentes seletores comuns em testes Workana
    const questionSelectors = [
      '.question-text',
      '[data-testid="question"]',
      '.quiz-question',
      'h3.question',
      '.test-question',
      'div.question',
    ];

    for (const selector of questionSelectors) {
      const elem = document.querySelector(selector);
      if (elem) {
        questionText = elem.textContent.trim();
        break;
      }
    }

    // Se não achou, tenta o primeiro h3 ou span com tamanho de texto grande
    if (!questionText) {
      const headings = document.querySelectorAll('h3, h2, .h3, .h2');
      for (const h of headings) {
        const text = h.textContent.trim();
        if (text.length > 10 && text.length < 500) {
          questionText = text;
          break;
        }
      }
    }

    // Extrai opções - radio buttons ou divs com input
    const optionElements = document.querySelectorAll(
      'input[type="radio"], input[type="checkbox"], label input, .option-item, [role="radio"]'
    );

    optionElements.forEach((elem, idx) => {
      let label = '';

      // Procura label associado
      if (elem.tagName === 'INPUT') {
        const labelFor = document.querySelector(`label[for="${elem.id}"]`);
        if (labelFor) {
          label = labelFor.textContent.trim();
        } else {
          // Procura label parent
          const parentLabel = elem.closest('label');
          if (parentLabel) {
            label = parentLabel.textContent.trim();
          }
        }
      } else {
        label = elem.textContent.trim();
      }

      if (label) {
        options.push({
          index: idx,
          label: label,
          element: elem,
        });
      }
    });

    return {
      question: questionText || 'Pergunta não encontrada',
      options: options.map(o => ({ index: o.index, label: o.label })),
      optionCount: optionElements.length,
    };
  });
}

/**
 * Envia pergunta para LLM local e recebe resposta
 */
async function queryLLM(question, options) {
  const prompt = `
Você é um assistente inteligente que responde a testes de habilidades profissionais.

PERGUNTA: ${question}

OPÇÕES:
${options.map((opt, i) => `${i + 1}. ${opt.label}`).join('\n')}

Responda APENAS com o número da opção correta (1, 2, 3, etc).
Exemplo: Se achar que é a opção 2, responda: 2
Não explique, não justifique, apenas o número.
`;

  try {
    log.debug(`Enviando para LLM: "${question.substring(0, 50)}..."`);

    const response = await axios.post(
      `http://${CONFIG.LLM_HOST}:${CONFIG.LLM_PORT}/v1/chat/completions`,
      {
        model: CONFIG.LLM_MODEL,
        messages: [
          {
            role: 'system',
            content: 'Você é um assistente que responde testes profissionais. Responda APENAS com o número da opção (1, 2, 3, etc).',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.1,
        max_tokens: 10,
      },
      { timeout: CONFIG.LLM_TIMEOUT }
    );

    const answer = response.data.choices[0].message.content.trim();
    const optionNumber = parseInt(answer.match(/\d+/)?.[0] || '1');

    log.debug(`LLM respondeu: ${answer} (opção ${optionNumber})`);
    return optionNumber;
  } catch (error) {
    log.error(`Erro ao conectar LLM: ${error.message}`);
    log.info('Usando fallback: resposta aleatória');

    // Fallback: escolhe aleatória entre opções disponíveis
    return Math.floor(Math.random() * options.length) + 1;
  }
}

/**
 * Clica na opção correta usando JS puro
 */
async function clickOption(page, optionIndex) {
  try {
    log.info(`Clicando na opção ${optionIndex}...`);

    const clicked = await page.evaluate((idx) => {
      // Tenta clicar em radio buttons
      const radios = document.querySelectorAll('input[type="radio"]');
      if (radios[idx - 1]) {
        radios[idx - 1].click();
        return true;
      }

      // Tenta clicar em labels associados
      const labels = document.querySelectorAll('label');
      let count = 0;
      for (const label of labels) {
        if (label.querySelector('input[type="radio"]')) {
          count++;
          if (count === idx) {
            label.click();
            return true;
          }
        }
      }

      // Tenta clicar em elementos com data-option
      const optionElements = document.querySelectorAll('[data-option]');
      if (optionElements[idx - 1]) {
        optionElements[idx - 1].click();
        return true;
      }

      // Último recurso: procura por divs clicáveis
      const clickableOptions = document.querySelectorAll('.option, [role="radio"], .choice');
      if (clickableOptions[idx - 1]) {
        clickableOptions[idx - 1].click();
        return true;
      }

      return false;
    }, optionIndex);

    if (clicked) {
      log.success(`Opção ${optionIndex} clicada com sucesso`);
      return true;
    } else {
      log.error(`Não conseguiu encontrar elemento para opção ${optionIndex}`);
      return false;
    }
  } catch (error) {
    log.error(`Erro ao clicar: ${error.message}`);
    return false;
  }
}

/**
 * Procura e clica no botão "Próxima Questão" ou "Enviar"
 */
async function clickNextButton(page) {
  try {
    const clicked = await page.evaluate(() => {
      // Procura por botão Next em várias variações
      const buttons = document.querySelectorAll('button');
      for (const btn of buttons) {
        const text = btn.textContent.toLowerCase();
        if (
          text.includes('próxim') ||
          text.includes('next') ||
          text.includes('continuar') ||
          text.includes('enviar')
        ) {
          btn.click();
          return true;
        }
      }
      return false;
    });

    if (clicked) {
      log.success('Botão próxima questão clicado');
      return true;
    }
    return false;
  } catch (error) {
    log.error(`Erro ao clicar próxima questão: ${error.message}`);
    return false;
  }
}

/**
 * Detecta se o teste foi completado
 */
async function isTestComplete(page) {
  return await page.evaluate(() => {
    const completionSelectors = [
      '.test-complete',
      '.completion-message',
      '[data-testid="results"]',
      '.final-score',
      'div:has(> h1:contains("resultado"))',
    ];

    const text = document.body.innerText.toLowerCase();
    if (text.includes('test complete') || text.includes('parabéns') || text.includes('resultado')) {
      return true;
    }

    return false;
  });
}

/**
 * Executa o loop principal do bot
 */
async function runBot(maxQuestions = 0) {
  let browser = null;
  let questionCount = 0;

  try {
    // Conecta ao Chrome
    browser = await connectToChrome();
    const pages = await browser.pages();
    const page = pages[0];

    if (!page) {
      throw new Error('Nenhuma aba aberta no Chrome. Abra a página do teste Workana.');
    }

    log.info(`Página atual: ${page.url()}`);
    log.info('Iniciando resolução de questões...\n');

    // Loop principal
    while (true) {
      // Verifica limite
      if (maxQuestions > 0 && questionCount >= maxQuestions) {
        log.info(`Limite de ${maxQuestions} questões atingido`);
        break;
      }

      // Verifica se teste foi completado
      if (await isTestComplete(page)) {
        log.success('\n🎉 Teste concluído com sucesso!');
        break;
      }

      // Aguarda um pouco pela página carregar
      await page.waitForTimeout(CONFIG.QUESTION_WAIT_TIME);

      // Extrai pergunta e opções
      const { question, options } = await extractQuestionAndOptions(page);

      if (!options || options.length === 0) {
        log.error('Não encontrou opções. A página pode não estar carregada.');
        log.info('Aguardando 3 segundos e tentando novamente...');
        await page.waitForTimeout(3000);
        continue;
      }

      questionCount++;
      log.info(`\n--- Questão ${questionCount} ---`);
      log.info(`P: ${question}`);
      log.info(`Opções disponíveis: ${options.length}`);

      // Query LLM
      const selectedOption = await queryLLM(question, options);

      // Valida índice
      if (selectedOption < 1 || selectedOption > options.length) {
        log.error(`Opção inválida: ${selectedOption}. Usando aleatória.`);
        selectedOption = Math.floor(Math.random() * options.length) + 1;
      }

      log.info(`Opção selecionada: ${selectedOption} - "${options[selectedOption - 1]?.label}"`);

      // Clica na opção
      const optionClicked = await clickOption(page, selectedOption);
      if (!optionClicked) {
        log.error('Falha ao clicar. Pulando para próxima...');
      }

      // Aguarda um pouco
      await page.waitForTimeout(1000);

      // Clica no botão próximo
      const nextClicked = await clickNextButton(page);
      if (!nextClicked) {
        log.error('Não encontrou botão próxima questão. Teste pode estar completo.');
        break;
      }
    }

    log.success(`\n📊 Bot finalizou: ${questionCount} questões resolvidas`);

  } catch (error) {
    log.error(`Fatal: ${error.message}`);
    process.exit(1);
  } finally {
    // Fecha browser (nota: não fecha o Chrome principal, apenas desconecta)
    if (browser) {
      await browser.disconnect();
      log.info('Desconectado do Chrome');
    }
  }
}

/**
 * Entry point
 */
async function main() {
  const args = process.argv.slice(2);
  let maxQuestions = 0;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--max-questions') {
      maxQuestions = parseInt(args[i + 1], 10);
    }
  }

  log.info('=== Auto-Cert Farmer Bot ===');
  log.info(`LLM: ${CONFIG.LLM_HOST}:${CONFIG.LLM_PORT}`);
  log.info(`Chrome: ${CONFIG.CHROME_WS_ENDPOINT}`);

  await runBot(maxQuestions);
}

main().catch(err => {
  log.error(`Erro não tratado: ${err.message}`);
  process.exit(1);
});

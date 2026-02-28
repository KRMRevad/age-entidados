#!/usr/bin/env node

/**
 * ENTIDADOS AGE — Backend Server
 *
 * Orquestra:
 * - Revenue Radar (Radar de Oportunidades)
 * - Status das Barras Vitais
 * - Integração com Supabase
 * - WebSocket para atualizações em tempo real
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// ============================================================
// CONFIGURAÇÃO
// ============================================================

const PORT = process.env.PORT || 3000;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const WORK_DIR = path.resolve(__dirname, '../..');
const RADAR_FILE = path.join(WORK_DIR, 'squads/nexus/data/radar_opportunities.json');
const PROPOSALS_DIR = path.join(WORK_DIR, 'proposals');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from dashboard directory (SPA served here)
app.use(express.static(path.join(WORK_DIR, 'dashboard')));

// Inicializar Supabase (opcional, se configurado)
let supabase = null;
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  console.log('✅ Supabase conectado');
} else {
  console.log('⚠️  Supabase não configurado. Use .env para habilitar.');
}

// ============================================================
// HELPERS
// ============================================================

function loadRadar() {
  try {
    if (fs.existsSync(RADAR_FILE)) {
      const data = fs.readFileSync(RADAR_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Erro ao ler Radar:', error.message);
  }
  return [];
}

function getRadarStats(projects) {
  const stats = {
    total: projects.length,
    hot: projects.filter(p => p.tier === 'hot').length,
    warm: projects.filter(p => p.tier === 'warm').length,
    cool: projects.filter(p => p.tier === 'cool').length,
    avgScore: projects.length > 0
      ? Math.round(projects.reduce((sum, p) => sum + (p.score || 0), 0) / projects.length)
      : 0,
    highestScore: projects.length > 0
      ? Math.max(...projects.map(p => p.score || 0))
      : 0,
    totalEffortHours: projects.reduce((sum, p) => sum + (p.effort_hours || 0), 0),
  };
  return stats;
}

function getHealthStatus() {
  /**
   * Verifica as 5 barras vitais:
   * 1. Caixa (dummy para demo)
   * 2. Receita
   * 3. Oportunidades
   * 4. Produção
   * 5. Qualidade
   */
  const radarProjects = loadRadar();
  const stats = getRadarStats(radarProjects);

  return {
    timestamp: new Date().toISOString(),
    barras: {
      caixa: {
        label: 'Caixa',
        value: 0, // R$ 0 — CRÍTICO (seria buscado de Supabase em produção)
        status: 'critical',
        percentage: 0,
      },
      receita: {
        label: 'Receita 24h',
        value: 0, // Seria buscado de log_financeiro em produção
        status: 'critical',
        percentage: 0,
      },
      oportunidades: {
        label: 'Oportunidades',
        value: stats.hot,
        target: 5,
        status: stats.hot >= 5 ? 'green' : stats.hot >= 2 ? 'yellow' : 'critical',
        percentage: Math.min(100, (stats.hot / 5) * 100),
      },
      producao: {
        label: 'Produção',
        value: `${stats.totalEffortHours}h`,
        status: 'yellow', // A trabalhar
        percentage: 50,
      },
      qualidade: {
        label: 'Qualidade',
        value: `${stats.avgScore}%`,
        status: 'green',
        percentage: Math.min(100, stats.avgScore),
      },
    },
    radarStats: stats,
  };
}

// ============================================================
// ROTAS — RADAR
// ============================================================

/**
 * GET /api/radar
 * Retorna todas as oportunidades do Radar
 */
app.get('/api/radar', (req, res) => {
  try {
    const projects = loadRadar();
    const stats = getRadarStats(projects);

    res.json({
      success: true,
      stats,
      projects,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/radar/hot
 * Retorna apenas os projetos "HOT" (prioridade máxima)
 */
app.get('/api/radar/hot', (req, res) => {
  try {
    const projects = loadRadar();
    const hotProjects = projects.filter(p => p.tier === 'hot');

    res.json({
      success: true,
      count: hotProjects.length,
      projects: hotProjects,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/radar/:id
 * Retorna uma oportunidade específica
 */
app.get('/api/radar/:id', (req, res) => {
  try {
    const projects = loadRadar();
    const project = projects.find(p => p.id === req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Projeto não encontrado',
      });
    }

    res.json({
      success: true,
      project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ============================================================
// WEBHOOK — N8N INTEGRATION
// ============================================================

const WEBHOOK_FILE = path.join(WORK_DIR, 'data/n8n-opportunities.json');

function ensureWebhookDir() {
  const webhookDir = path.dirname(WEBHOOK_FILE);
  if (!fs.existsSync(webhookDir)) {
    fs.mkdirSync(webhookDir, { recursive: true });
  }
}

function loadWebhookData() {
  try {
    ensureWebhookDir();
    if (fs.existsSync(WEBHOOK_FILE)) {
      const data = fs.readFileSync(WEBHOOK_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('❌ Erro ao ler webhook data:', error.message);
  }
  return [];
}

function saveWebhookData(data) {
  try {
    ensureWebhookDir();
    fs.writeFileSync(WEBHOOK_FILE, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`✅ Webhook data salvo: ${WEBHOOK_FILE} (${data.length} registros)`);
  } catch (error) {
    console.error('❌ Erro ao salvar webhook data:', error.message);
  }
}

/**
 * POST /api/webhook/n8n
 * Recebe payload do N8N com nova oportunidade
 * Esperado: { platform, title, url, reward, effort_hours, tier, score, description }
 */
app.post('/api/webhook/n8n', (req, res) => {
  try {
    const payload = req.body;

    // Validação básica
    if (!payload.title || !payload.url) {
      return res.status(400).json({
        success: false,
        error: 'Payload inválido. Requerido: title, url',
      });
    }

    // Carregar dados existentes
    let opportunities = loadWebhookData();

    // Criar registro novo
    const newOpportunity = {
      id: `n8n-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      platform: payload.platform || 'workana',
      title: payload.title,
      url: payload.url,
      reward: payload.reward || payload.rewardRaw || 'N/A',
      effort_hours: payload.effort_hours || 0,
      tier: payload.tier || 'cool',
      score: payload.score || 50,
      description: payload.description || '',
      status: 'novo', // novo, processado, enviado, recusado, aceito
    };

    // Adicionar ao início (mais recentes primeiro)
    opportunities.unshift(newOpportunity);

    // Manter apenas últimos 100 registros
    if (opportunities.length > 100) {
      opportunities = opportunities.slice(0, 100);
    }

    // Salvar
    saveWebhookData(opportunities);

    console.log(`🎯 Oportunidade N8N recebida: ${newOpportunity.title}`);

    res.status(201).json({
      success: true,
      message: 'Oportunidade recebida e salva',
      opportunity: newOpportunity,
      totalCount: opportunities.length,
    });
  } catch (error) {
    console.error('❌ Erro no webhook:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/webhook/n8n
 * Retorna todas as oportunidades recebidas via webhook
 */
app.get('/api/webhook/n8n', (req, res) => {
  try {
    const opportunities = loadWebhookData();
    const stats = {
      total: opportunities.length,
      novo: opportunities.filter(o => o.status === 'novo').length,
      processado: opportunities.filter(o => o.status === 'processado').length,
      hot: opportunities.filter(o => o.tier === 'hot').length,
      warm: opportunities.filter(o => o.tier === 'warm').length,
      cool: opportunities.filter(o => o.tier === 'cool').length,
    };

    res.json({
      success: true,
      stats,
      opportunities,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/webhook/n8n/hot
 * Retorna apenas oportunidades "HOT" recebidas via webhook
 */
app.get('/api/webhook/n8n/hot', (req, res) => {
  try {
    const opportunities = loadWebhookData();
    const hotOpps = opportunities.filter(o => o.tier === 'hot' || o.score >= 80);

    res.json({
      success: true,
      count: hotOpps.length,
      opportunities: hotOpps,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ============================================================
// ROTAS — HEALTH & STATUS
// ============================================================

/**
 * GET /api/health
 * Status das 5 barras vitais
 */
app.get('/api/health', (req, res) => {
  try {
    const health = getHealthStatus();
    res.json({
      success: true,
      ...health,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/status
 * Status resumido do sistema
 */
app.get('/api/status', (req, res) => {
  try {
    const projects = loadRadar();
    const stats = getRadarStats(projects);
    const health = getHealthStatus();

    res.json({
      success: true,
      system: 'operational',
      mode: 'SURVIVAL',
      radarProjects: stats.total,
      hotOpportunities: stats.hot,
      healthStatus: health.barras,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ============================================================
// ROTAS — PROPOSALS & DASHBOARD
// ============================================================

/**
 * GET /api/proposals/:id
 * Returns the full content of a proposal markdown file for clipboard copying
 */
app.get('/api/proposals/:id', (req, res) => {
  try {
    const proposalId = req.params.id;

    // Sanitize to prevent path traversal
    if (proposalId.includes('..') || proposalId.includes('/')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid proposal ID'
      });
    }

    // Try common naming patterns
    const patterns = [
      `PROPOSAL-${proposalId}.md`,
      `PROPOSAL-${proposalId}-HOT.md`,
      `${proposalId}.md`
    ];

    let content = null;
    let foundFile = null;

    for (const pattern of patterns) {
      const filePath = path.join(PROPOSALS_DIR, pattern);
      if (fs.existsSync(filePath)) {
        content = fs.readFileSync(filePath, 'utf-8');
        foundFile = pattern;
        break;
      }
    }

    if (!content) {
      return res.status(404).json({
        success: false,
        error: `Proposal '${proposalId}' not found`
      });
    }

    res.json({
      success: true,
      id: proposalId,
      filename: foundFile,
      content: content,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /dashboard
 * Serves the premium dashboard SPA from dashboard/index.html
 * (Handled by express.static middleware above)
 */

// ============================================================
// ROTAS — UTILITÁRIOS
// ============================================================

/**
 * GET /
 * Health check básico
 */
app.get('/', (req, res) => {
  res.json({
    app: 'Entidados AGE',
    version: '1.0.0',
    mode: 'SURVIVAL',
    message: '🚀 Backend rodando em modo Brain-Muscle orchestration',
    endpoints: {
      'GET /api/health': 'Status das 5 barras vitais',
      'GET /api/status': 'Status resumido do sistema',
      'GET /api/radar': 'Todas as oportunidades',
      'GET /api/radar/hot': 'Apenas oportunidades HOT',
      'GET /api/radar/:id': 'Detalhes de uma oportunidade',
      'GET /api/proposals/:id': 'Conteúdo de uma proposta (para clipboard)',
      'POST /api/webhook/n8n': '🚀 [N8N] Receber nova oportunidade',
      'GET /api/webhook/n8n': 'Listar oportunidades recebidas via N8N',
      'GET /api/webhook/n8n/hot': 'Apenas oportunidades HOT do N8N',
      'GET /dashboard': 'Dashboard SPA (via express.static)',
    },
  });
});

// ============================================================
// INICIAR SERVIDOR
// ============================================================

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║ 🚀 ENTIDADOS AGE — Backend Running                    ║
╠═══════════════════════════════════════════════════════╣
║ Server: http://localhost:${PORT}
║ Dashboard: http://localhost:${PORT}/dashboard
║ API: http://localhost:${PORT}/api/status
║ Mode: SURVIVAL (Brain-Muscle Orchestration)
╚═══════════════════════════════════════════════════════╝
  `);

  // Status inicial
  const health = getHealthStatus();
  console.log(`\n📊 Status Inicial:`);
  console.log(`   🔥 HOT: ${health.radarStats.hot} projetos`);
  console.log(`   🌡️  WARM: ${health.radarStats.warm} projetos`);
  console.log(`   ❄️  COOL: ${health.radarStats.cool} projetos`);
  console.log(`   ⏱️  Esforço total: ${health.radarStats.totalEffortHours}h`);
});

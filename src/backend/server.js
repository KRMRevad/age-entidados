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
app.use('/dashboard', express.static(path.join(WORK_DIR, 'dashboard')));

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
// ROTAS — PROPOSALS (FEATURE 1)
// ============================================================

/**
 * GET /api/proposals
 * Lista todas as propostas em proposals/
 * Retorna: [ { id, filename, title, tier, score, timestamp }, ... ]
 */
app.get('/api/proposals', (req, res) => {
  try {
    const proposals = [];

    if (!fs.existsSync(PROPOSALS_DIR)) {
      return res.json({
        success: true,
        proposals: [],
        count: 0,
        timestamp: new Date().toISOString(),
      });
    }

    const files = fs.readdirSync(PROPOSALS_DIR).filter(f => f.endsWith('.md'));

    files.forEach(filename => {
      try {
        const filePath = path.join(PROPOSALS_DIR, filename);
        const content = fs.readFileSync(filePath, 'utf-8');
        const stat = fs.statSync(filePath);

        // Extrair título da primeira linha (# Heading)
        const titleMatch = content.match(/^#\s+(.+?)$/m);
        const title = titleMatch ? titleMatch[1] : filename.replace('.md', '');

        // Extrair tier e score dos metadados (se existirem)
        const tierMatch = content.match(/tier:\s*(\w+)/i);
        const scoreMatch = content.match(/score:\s*(\d+)/i);

        const tier = tierMatch ? tierMatch[1].toLowerCase() : 'cool';
        const score = scoreMatch ? parseInt(scoreMatch[1]) : 0;

        // Extrair ID do filename (PROPOSAL-{id}.md ou PROPOSAL-{id}-HOT.md)
        const idMatch = filename.match(/PROPOSAL-(.+?)(?:-HOT)?\.md/);
        const id = idMatch ? idMatch[1] : filename.replace('.md', '');

        proposals.push({
          id,
          filename,
          title,
          tier,
          score,
          timestamp: stat.mtime.toISOString(),
        });
      } catch (err) {
        console.error(`Erro ao processar proposta ${filename}:`, err.message);
      }
    });

    // Ordenar por data (mais recente primeiro)
    proposals.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json({
      success: true,
      proposals,
      count: proposals.length,
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
// ROTAS — CRM PIPELINE (FEATURE 2 & 3)
// ============================================================

const CRM_FILE = path.join(WORK_DIR, 'data/crm-pipeline.json');
const FINANCIAL_LOG_FILE = path.join(WORK_DIR, 'data/financial-log.json');
const HUMAN_TASKS_FILE = path.join(WORK_DIR, 'data/human_tasks.json');

function ensureDataDir() {
  const dataDir = path.dirname(CRM_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function loadHumanTasks() {
  try {
    ensureDataDir();
    if (fs.existsSync(HUMAN_TASKS_FILE)) {
      const data = fs.readFileSync(HUMAN_TASKS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('❌ Erro ao ler human tasks:', error.message);
  }
  return [];
}

function saveHumanTasks(data) {
  try {
    ensureDataDir();
    fs.writeFileSync(HUMAN_TASKS_FILE, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`✅ Human tasks salvo: ${HUMAN_TASKS_FILE}`);
  } catch (error) {
    console.error('❌ Erro ao salvar human tasks:', error.message);
  }
}

function loadCrmPipeline() {
  try {
    ensureDataDir();
    if (fs.existsSync(CRM_FILE)) {
      const data = fs.readFileSync(CRM_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('❌ Erro ao ler CRM pipeline:', error.message);
  }
  return {};
}

function saveCrmPipeline(data) {
  try {
    ensureDataDir();
    fs.writeFileSync(CRM_FILE, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`✅ CRM pipeline salvo: ${CRM_FILE}`);
  } catch (error) {
    console.error('❌ Erro ao salvar CRM pipeline:', error.message);
  }
}

function loadFinancialLog() {
  try {
    ensureDataDir();
    if (fs.existsSync(FINANCIAL_LOG_FILE)) {
      const data = fs.readFileSync(FINANCIAL_LOG_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('❌ Erro ao ler financial log:', error.message);
  }
  return [];
}

function saveFinancialLog(data) {
  try {
    ensureDataDir();
    fs.writeFileSync(FINANCIAL_LOG_FILE, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`✅ Financial log salvo: ${FINANCIAL_LOG_FILE}`);
  } catch (error) {
    console.error('❌ Erro ao salvar financial log:', error.message);
  }
}

/**
 * POST /api/opportunities/:id/kanban
 * Move uma oportunidade no pipeline CRM
 * Body: { status: 'lead' | 'sent' | 'negotiation' | 'hired' | 'delivered' | 'paid' | 'lost' }
 * Quando status='paid', incrementa receita em financial_log
 */
app.post('/api/opportunities/:id/kanban', (req, res) => {
  try {
    const oppId = req.params.id;
    const { status } = req.body;

    const validStatuses = ['lead', 'sent', 'negotiation', 'hired', 'delivered', 'paid', 'lost'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Status inválido. Permitidos: ${validStatuses.join(', ')}`,
      });
    }

    // Carregar dados de oportunidades (radar)
    const radarOpps = loadRadar();
    const opp = radarOpps.find(p => p.id === oppId);

    if (!opp) {
      return res.status(404).json({
        success: false,
        error: 'Oportunidade não encontrada',
      });
    }

    // Carregar/atualizar CRM
    let crm = loadCrmPipeline();
    crm[oppId] = {
      id: oppId,
      title: opp.title,
      platform: opp.platform,
      reward: opp.reward_raw || opp.reward || 'N/A',
      status,
      updatedAt: new Date().toISOString(),
    };

    // Se status é 'paid', registrar receita
    if (status === 'paid') {
      const financialLog = loadFinancialLog();
      const amount = parseInt(opp.reward_raw || opp.reward || 0) || 0;

      financialLog.push({
        id: `fin-${oppId}`,
        opportunityId: oppId,
        title: opp.title,
        amount,
        type: 'revenue',
        timestamp: new Date().toISOString(),
      });

      saveFinancialLog(financialLog);
      console.log(`💰 Receita registrada: ${opp.title} (${amount})`);
    }

    saveCrmPipeline(crm);

    res.json({
      success: true,
      opportunity: crm[oppId],
      message: `Oportunidade movida para '${status}'`,
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
 * GET /api/analytics/pipeline
 * Analytics do funil completo
 * Retorna métricas: conversion, pipeline_value, distribuição por tier/status
 */
app.get('/api/analytics/pipeline', (req, res) => {
  try {
    const radarOpps = loadRadar();
    const webhookOpps = loadWebhookData();
    const crm = loadCrmPipeline();
    const financialLog = loadFinancialLog();

    // Contar propostas
    const proposalsCount = fs.existsSync(PROPOSALS_DIR)
      ? fs.readdirSync(PROPOSALS_DIR).filter(f => f.endsWith('.md')).length
      : 0;

    // Calcular pipeline value
    const pipelineValue = radarOpps.reduce((sum, opp) => {
      const reward = parseInt(opp.reward_raw || opp.reward || 0) || 0;
      return sum + reward;
    }, 0);

    // Contar por status no CRM
    const statusCounts = {
      lead: Object.values(crm).filter(o => o.status === 'lead').length,
      sent: Object.values(crm).filter(o => o.status === 'sent').length,
      negotiation: Object.values(crm).filter(o => o.status === 'negotiation').length,
      hired: Object.values(crm).filter(o => o.status === 'hired').length,
      delivered: Object.values(crm).filter(o => o.status === 'delivered').length,
      paid: Object.values(crm).filter(o => o.status === 'paid').length,
      lost: Object.values(crm).filter(o => o.status === 'lost').length,
    };

    // Contar por plataforma
    const platformCounts = {};
    radarOpps.forEach(opp => {
      const plat = opp.platform || 'unknown';
      platformCounts[plat] = (platformCounts[plat] || 0) + 1;
    });

    // Receita realizada
    const totalRevenue = financialLog.reduce((sum, entry) => sum + (entry.amount || 0), 0);

    // Conversão
    const totalOpportunities = radarOpps.length;
    const conversionRate = totalOpportunities > 0
      ? ((proposalsCount / totalOpportunities) * 100).toFixed(2)
      : 0;

    res.json({
      success: true,
      pipeline: {
        total_opportunities: totalOpportunities,
        total_proposals: proposalsCount,
        conversion_scraped_to_proposal: `${conversionRate}%`,
        pipeline_value: pipelineValue,
        total_revenue_realized: totalRevenue,
      },
      distribution: {
        tiers: {
          hot: radarOpps.filter(o => o.tier === 'hot').length,
          warm: radarOpps.filter(o => o.tier === 'warm').length,
          cool: radarOpps.filter(o => o.tier === 'cool').length,
        },
        statuses: statusCounts,
        platforms: platformCounts,
      },
      metrics: {
        avg_score: radarOpps.length > 0
          ? Math.round(radarOpps.reduce((sum, o) => sum + (o.score || 0), 0) / radarOpps.length)
          : 0,
        total_effort_hours: radarOpps.reduce((sum, o) => sum + (o.effort_hours || 0), 0),
      },
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
// ROTAS — HUMAN TASKS (PENDÊNCIAS DO CEO)
// ============================================================

/**
 * GET /api/human-tasks
 * Retorna todas as tarefas pendentes para o humano
 */
app.get('/api/human-tasks', (req, res) => {
  try {
    const tasks = loadHumanTasks();
    const pending = tasks.filter(t => t.status === 'pending');

    // Ordena por urgência (critical > high > medium > low) e data
    const urgencyWeight = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
    pending.sort((a, b) => {
      const weightDiff = (urgencyWeight[b.urgency] || 0) - (urgencyWeight[a.urgency] || 0);
      if (weightDiff !== 0) return weightDiff;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    res.json({
      success: true,
      tasks: pending,
      count: pending.length,
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
 * POST /api/human-tasks/:id/resolve
 * Marca uma tarefa humana como resolvida
 */
app.post('/api/human-tasks/:id/resolve', (req, res) => {
  try {
    const taskId = req.params.id;
    const tasks = loadHumanTasks();
    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (taskIndex === -1) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    tasks[taskIndex].status = 'resolved';
    tasks[taskIndex].resolvedAt = new Date().toISOString();

    saveHumanTasks(tasks);

    res.json({
      success: true,
      message: 'Task resolved successfully',
      task: tasks[taskIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================================
// ROTAS — WEBHOOK BATCH (FEATURE 4)
// ============================================================

/**
 * POST /api/webhook/n8n/batch
 * Recebe array de oportunidades
 * Body: [ { platform, title, url, ... }, ... ]
 * Retorna: { success: true, processed: N, errors: [] }
 */
app.post('/api/webhook/n8n/batch', (req, res) => {
  try {
    const { opportunities } = req.body;

    if (!Array.isArray(opportunities)) {
      return res.status(400).json({
        success: false,
        error: 'Esperado: { opportunities: [...] }',
      });
    }

    let processed = 0;
    const errors = [];

    // Carregar dados existentes
    let allOpps = loadWebhookData();

    opportunities.forEach((payload, idx) => {
      try {
        // Validação básica
        if (!payload.title || !payload.url) {
          errors.push({
            index: idx,
            error: 'Requerido: title, url',
          });
          return;
        }

        // Criar registro novo
        const newOpp = {
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
          status: 'novo',
        };

        allOpps.unshift(newOpp);
        processed++;
      } catch (err) {
        errors.push({
          index: idx,
          error: err.message,
        });
      }
    });

    // Manter apenas últimos 100 registros
    if (allOpps.length > 100) {
      allOpps = allOpps.slice(0, 100);
    }

    saveWebhookData(allOpps);

    console.log(`🎯 Batch N8N processado: ${processed} oportunidades, ${errors.length} erros`);

    res.status(201).json({
      success: true,
      processed,
      errors,
      totalCount: allOpps.length,
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
// ROTAS — HEALTH DETAILED (FEATURE 5)
// ============================================================

/**
 * GET /api/health/detailed
 * Status detalhado do sistema com uptime, memory, data staleness
 */
app.get('/api/health/detailed', (req, res) => {
  try {
    const baseHealth = getHealthStatus();

    // Server uptime
    const uptime = process.uptime();
    const uptimeFormatted = `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m`;

    // Memory usage
    const memUsage = process.memoryUsage();

    // Timestamps dos arquivos de dados
    const getFileTimestamp = (filePath) => {
      try {
        if (fs.existsSync(filePath)) {
          const stat = fs.statSync(filePath);
          return stat.mtime.toISOString();
        }
      } catch (err) {
        console.error(`Erro ao obter timestamp de ${filePath}:`, err.message);
      }
      return null;
    };

    const lastRadarTime = getFileTimestamp(RADAR_FILE);
    const lastWebhookTime = getFileTimestamp(WEBHOOK_FILE);

    // Verificar se dados estão "stale" (> 1h)
    const isStale = (timestamp) => {
      if (!timestamp) return false;
      const age = Date.now() - new Date(timestamp).getTime();
      return age > 3600000; // 1 hora em ms
    };

    // Contar arquivos em proposals/
    const proposalsCount = fs.existsSync(PROPOSALS_DIR)
      ? fs.readdirSync(PROPOSALS_DIR).filter(f => f.endsWith('.md')).length
      : 0;

    res.json({
      success: true,
      system: {
        uptime: uptimeFormatted,
        uptime_seconds: Math.floor(uptime),
        memory_usage: {
          rss: `${(memUsage.rss / 1024 / 1024).toFixed(2)} MB`,
          heap_used: `${(memUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
          heap_total: `${(memUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
        },
      },
      data_sources: {
        radar: {
          last_update: lastRadarTime,
          status: isStale(lastRadarTime) ? 'stale' : 'online',
        },
        webhook: {
          last_update: lastWebhookTime,
          status: isStale(lastWebhookTime) ? 'stale' : 'online',
        },
      },
      proposals: {
        ready: proposalsCount,
      },
      vital_bars: baseHealth.barras,
      radar_stats: baseHealth.radarStats,
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
// ROTAS — AGENT STATUS (FEATURE 6)
// ============================================================

/**
 * GET /api/agent-status
 * Lista todos os agentes disponíveis
 * Retorna: [ { name, role, specFile }, ... ]
 */
app.get('/api/agent-status', (req, res) => {
  try {
    const agents = [];
    const agentsDir = path.join(WORK_DIR, '.antigravity/rules/agents');

    if (!fs.existsSync(agentsDir)) {
      return res.json({
        success: true,
        agents: [],
        count: 0,
        timestamp: new Date().toISOString(),
      });
    }

    const files = fs.readdirSync(agentsDir).filter(f => f.endsWith('.md'));

    files.forEach(filename => {
      try {
        const filePath = path.join(agentsDir, filename);
        const content = fs.readFileSync(filePath, 'utf-8');

        // Extrair nome e role das primeiras linhas
        const nameMatch = content.match(/^#\s+(.+?)$/m);
        const roleMatch = content.match(/\*\*role\*\*:\s*(.+?)$/im) ||
          content.match(/role[:\s]+([^\n]+)/i);

        const name = nameMatch ? nameMatch[1] : filename.replace('.md', '');
        const role = roleMatch ? roleMatch[1].trim() : 'Unknown';

        agents.push({
          name,
          role,
          specFile: filename,
          lastActive: null, // Será preenchido por future integrations
        });
      } catch (err) {
        console.error(`Erro ao processar agente ${filename}:`, err.message);
      }
    });

    res.json({
      success: true,
      agents,
      count: agents.length,
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
// ROTAS — FOLLOW-UPS (FEATURE 7)
// ============================================================

const FOLLOWUPS_FILE = path.join(WORK_DIR, 'data/followups.json');

function loadFollowups() {
  try {
    ensureDataDir();
    if (fs.existsSync(FOLLOWUPS_FILE)) {
      const data = fs.readFileSync(FOLLOWUPS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('❌ Erro ao ler followups:', error.message);
  }
  return [];
}

function saveFollowups(data) {
  try {
    ensureDataDir();
    fs.writeFileSync(FOLLOWUPS_FILE, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`✅ Followups salvo: ${FOLLOWUPS_FILE}`);
  } catch (error) {
    console.error('❌ Erro ao salvar followups:', error.message);
  }
}

/**
 * POST /api/followups
 * Registra um follow-up programado
 * Body: { opportunityId, scheduledAt, message, channel }
 */
app.post('/api/followups', (req, res) => {
  try {
    const { opportunityId, scheduledAt, message, channel } = req.body;

    if (!opportunityId || !scheduledAt || !message) {
      return res.status(400).json({
        success: false,
        error: 'Requerido: opportunityId, scheduledAt, message',
      });
    }

    const followups = loadFollowups();
    const newFollowup = {
      id: `fu-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      opportunityId,
      scheduledAt,
      message,
      channel: channel || 'email',
      createdAt: new Date().toISOString(),
      completed: false,
    };

    followups.push(newFollowup);
    saveFollowups(followups);

    console.log(`📅 Follow-up agendado para ${opportunityId}: ${scheduledAt}`);

    res.status(201).json({
      success: true,
      followup: newFollowup,
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
 * GET /api/followups
 * Retorna todos os follow-ups futuros ordenados por data
 */
app.get('/api/followups', (req, res) => {
  try {
    const followups = loadFollowups();

    // Ordenar por data (próximos primeiro)
    followups.sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));

    res.json({
      success: true,
      followups,
      count: followups.length,
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
 * GET /api/followups/due
 * Retorna follow-ups cujo scheduledAt já passou (CEO precisa agir)
 */
app.get('/api/followups/due', (req, res) => {
  try {
    const followups = loadFollowups();
    const now = new Date();

    const dueFollowups = followups.filter(f => !f.completed && new Date(f.scheduledAt) <= now);

    // Ordenar por data (mais antigos primeiro)
    dueFollowups.sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));

    res.json({
      success: true,
      followups: dueFollowups,
      count: dueFollowups.length,
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
// ROTAS — UTILITÁRIOS
// ============================================================

/**
 * GET /
 * Health check básico
 */
app.get('/', (req, res) => {
  res.json({
    app: 'Entidados AGE',
    version: '2.0.0',
    mode: 'SURVIVAL',
    message: '🚀 Backend rodando em modo Brain-Muscle orchestration com 7 features avançadas',
    endpoints: {
      'GET /api/health': 'Status das 5 barras vitais',
      'GET /api/health/detailed': '[NEW] Status detalhado com uptime, memory, data staleness',
      'GET /api/status': 'Status resumido do sistema',
      'GET /api/radar': 'Todas as oportunidades',
      'GET /api/radar/hot': 'Apenas oportunidades HOT',
      'GET /api/radar/:id': 'Detalhes de uma oportunidade',
      'GET /api/proposals': '[NEW] Lista TODAS as propostas (com tier, score, timestamp)',
      'GET /api/proposals/:id': 'Conteúdo de uma proposta (para clipboard)',
      'POST /api/opportunities/:id/kanban': '[NEW] Mover oportunidade no CRM (atualiza receita se paid)',
      'GET /api/analytics/pipeline': '[NEW] Analytics do funil: conversion, pipeline value, distribuição',
      'POST /api/webhook/n8n': 'Receber nova oportunidade',
      'POST /api/webhook/n8n/batch': '[NEW] Receber ARRAY de oportunidades em 1 request',
      'GET /api/webhook/n8n': 'Listar oportunidades recebidas via N8N',
      'GET /api/webhook/n8n/hot': 'Apenas oportunidades HOT do N8N',
      'GET /api/agent-status': '[NEW] Lista todos os agentes disponíveis',
      'POST /api/followups': '[NEW] Agendar follow-up para uma oportunidade',
      'GET /api/followups': '[NEW] Listar todos os follow-ups futuros',
      'GET /api/followups/due': '[NEW] Follow-ups vencidos (CEO precisa agir)',
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

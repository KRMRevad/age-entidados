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

const app = express();
app.use(cors());
app.use(express.json());

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
    },
  });
});

/**
 * GET /dashboard
 * Dashboard HTML simples (tempo real será via WebSocket)
 */
app.get('/dashboard', (req, res) => {
  const health = getHealthStatus();
  const projects = loadRadar();

  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Entidados AGE — Dashboard</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 100%);
      color: #fff;
      padding: 20px;
    }
    .container { max-width: 1400px; margin: 0 auto; }
    header { margin-bottom: 30px; }
    h1 { font-size: 2.5em; margin-bottom: 5px; }
    .subtitle { color: #888; font-size: 0.9em; }

    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 40px; }

    .card {
      background: linear-gradient(135deg, #1e1e3f 0%, #2d2d5f 100%);
      border: 1px solid #3d3d7f;
      border-radius: 12px;
      padding: 20px;
      position: relative;
      overflow: hidden;
    }

    .card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #ff6b6b, #ffd93d, #6bcf7f);
    }

    .card-title { font-size: 0.9em; color: #aaa; margin-bottom: 10px; text-transform: uppercase; }
    .card-value { font-size: 2em; font-weight: bold; margin-bottom: 5px; }
    .card-unit { color: #888; font-size: 0.85em; }

    .status-indicator {
      display: inline-block;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      margin-right: 8px;
      vertical-align: middle;
    }
    .status-critical { background: #ff6b6b; }
    .status-warning { background: #ffd93d; }
    .status-green { background: #6bcf7f; }

    .progress-bar {
      background: rgba(255,255,255,0.1);
      height: 6px;
      border-radius: 3px;
      margin-top: 10px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #ff6b6b, #ffd93d, #6bcf7f);
      transition: width 0.3s ease;
    }

    .projects-section { margin-top: 40px; }
    .projects-section h2 { margin-bottom: 20px; font-size: 1.5em; }

    .project-list { display: grid; gap: 15px; }
    .project-item {
      background: rgba(255,255,255,0.05);
      border-left: 4px solid #ffd93d;
      padding: 15px;
      border-radius: 6px;
      transition: transform 0.2s ease;
    }
    .project-item:hover { transform: translateX(5px); }
    .project-item.hot { border-left-color: #ff6b6b; }
    .project-item.warm { border-left-color: #ffd93d; }
    .project-item.cool { border-left-color: #6bcf7f; }

    .project-title { font-weight: bold; margin-bottom: 5px; }
    .project-meta { color: #aaa; font-size: 0.85em; }

    .tier-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 0.75em;
      font-weight: bold;
      margin-left: 10px;
    }
    .tier-hot { background: #ff6b6b; }
    .tier-warm { background: #ffd93d; color: #000; }
    .tier-cool { background: #6bcf7f; }

    .footer { color: #666; font-size: 0.85em; margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); }
    .footer p { margin-bottom: 10px; }

    @media (max-width: 768px) {
      h1 { font-size: 1.8em; }
      .grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>🧠 Entidados AGE</h1>
      <p class="subtitle">Brain-Muscle Orchestration • Revenue Hunter Live</p>
    </header>

    <div class="grid">
      <div class="card">
        <div class="card-title">💰 Caixa</div>
        <div class="card-value">R$ 0</div>
        <div class="card-unit">
          <span class="status-indicator status-critical"></span>CRÍTICO
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: 0%"></div>
        </div>
      </div>

      <div class="card">
        <div class="card-title">📊 Receita 24h</div>
        <div class="card-value">R$ 0</div>
        <div class="card-unit">
          <span class="status-indicator status-critical"></span>CRÍTICO
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: 0%"></div>
        </div>
      </div>

      <div class="card">
        <div class="card-title">🎯 Oportunidades HOT</div>
        <div class="card-value">${health.barras.oportunidades.value}</div>
        <div class="card-unit">
          <span class="status-indicator status-${health.barras.oportunidades.status}"></span>
          ${health.barras.oportunidades.status.toUpperCase()}
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${health.barras.oportunidades.percentage}%"></div>
        </div>
      </div>

      <div class="card">
        <div class="card-title">⚙️ Produção</div>
        <div class="card-value">${health.barras.producao.value}</div>
        <div class="card-unit">
          <span class="status-indicator status-warning"></span>EM ANDAMENTO
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${health.barras.producao.percentage}%"></div>
        </div>
      </div>

      <div class="card">
        <div class="card-title">✅ Qualidade</div>
        <div class="card-value">${health.barras.qualidade.value}</div>
        <div class="card-unit">
          <span class="status-indicator status-green"></span>VERDE
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${health.barras.qualidade.percentage}%"></div>
        </div>
      </div>
    </div>

    <div class="projects-section">
      <h2>🔥 TOP OPPORTUNITIES (HOT)</h2>
      <div class="project-list">
        ${projects
          .filter(p => p.tier === 'hot')
          .slice(0, 5)
          .map(p => `
            <div class="project-item hot">
              <div class="project-title">
                ${p.title}
                <span class="tier-badge tier-hot">HOT • ${p.score}%</span>
              </div>
              <div class="project-meta">
                ID: ${p.id} • Esforço: ${p.effort_hours}h • Recompensa: ${p.rewardRaw || 'N/A'}
              </div>
            </div>
          `).join('')}
      </div>
    </div>

    <div class="footer">
      <p>✨ Dashboard em tempo real • Dados atualizados: ${new Date().toLocaleString('pt-BR')}</p>
      <p>💡 Para dados via API: curl http://localhost:${PORT}/api/health</p>
    </div>
  </div>
</body>
</html>
  `;

  res.send(html);
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
║ API: http://localhost:${PORT}/api/status
║ Dashboard: http://localhost:${PORT}/dashboard
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

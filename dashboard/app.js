/* ========================================
   ENTIDADOS — Central de Comando
   JavaScript: State, Logic, Persistence
   ======================================== */

// ========================
// State Management
// ========================

const STATE_KEY = 'entidados_state';

const DEFAULT_STATE = {
    mode: 'SURVIVAL',
    vitalBars: {
        caixa: { value: 0, max: 2000000 },
        combustivel: { value: 0, max: 100 },
        receita: { value: 0, max: 200 },
        velocidade: { value: 0, max: 10 },
        conversao: { value: 0, max: 100 }
    },
    missions: [
        {
            id: 'm1',
            name: 'Criar perfil no Workana',
            priority: 'P0',
            organ: 'nexus',
            reward: 0,
            deadline: '2026-02-25',
            status: 'active',
            createdAt: '2026-02-24'
        },
        {
            id: 'm2',
            name: 'Criar perfil no 99Freelas',
            priority: 'P0',
            organ: 'nexus',
            reward: 0,
            deadline: '2026-02-25',
            status: 'active',
            createdAt: '2026-02-24'
        },
        {
            id: 'm3',
            name: 'Criar 4 gigs no Fiverr',
            priority: 'P0',
            organ: 'nexus',
            reward: 0,
            deadline: '2026-02-26',
            status: 'active',
            createdAt: '2026-02-24'
        },
        {
            id: 'm4',
            name: 'Criar perfil no Upwork',
            priority: 'P0',
            organ: 'nexus',
            reward: 0,
            deadline: '2026-02-26',
            status: 'active',
            createdAt: '2026-02-24'
        },
        {
            id: 'm5',
            name: 'Candidatar-se ao Bot WhatsApp (Workana USD 500-1000)',
            priority: 'P0',
            organ: 'nexus',
            reward: 500,
            deadline: '2026-02-25',
            status: 'active',
            createdAt: '2026-02-24'
        },
        {
            id: 'm6',
            name: 'Candidatar-se à Automação WhatsApp+Bling (Workana USD 100-250)',
            priority: 'P0',
            organ: 'nexus',
            reward: 250,
            deadline: '2026-02-25',
            status: 'active',
            createdAt: '2026-02-24'
        },
        {
            id: 'm7',
            name: 'Publicar primeiro conteúdo no X (Twitter)',
            priority: 'P1',
            organ: 'sinal',
            reward: 0,
            deadline: '2026-02-28',
            status: 'active',
            createdAt: '2026-02-24'
        }
    ],
    opportunities: [
        {
            id: 'opp1',
            platform: 'workana',
            title: 'Bot de Vendas WhatsApp com IA',
            url: 'https://www.workana.com/job/bot-de-vendas-whatsapp',
            rewardMin: 500,
            rewardMax: 1000,
            effortHours: 15,
            posted: '24min atrás',
            skills: 'WhatsApp API, ChatGPT, Python, Node.js',
            status: 'active'
        },
        {
            id: 'opp2',
            platform: 'workana',
            title: 'Automação WhatsApp + IA + Bling ERP',
            url: 'https://www.workana.com/job/automacao-whatsapp-ia-bling',
            rewardMin: 100,
            rewardMax: 250,
            effortHours: 8,
            posted: '2h atrás',
            skills: 'WhatsApp API, ERP Bling, Integração',
            status: 'active'
        },
        {
            id: 'opp3',
            platform: 'workana',
            title: 'Bot CRM → WhatsApp para Imóveis',
            url: 'https://www.workana.com/job/bot-crm-whatsapp-imoveis',
            rewardMin: 250,
            rewardMax: 500,
            effortHours: 12,
            posted: '1h atrás',
            skills: 'CRM, WhatsApp API, Real Estate',
            status: 'active'
        },
        {
            id: 'opp4',
            platform: 'workana',
            title: 'Chatbot IA para Atendimento ao Cliente',
            url: 'https://www.workana.com/job/chatbot-ia-atendimento',
            rewardMin: 250,
            rewardMax: 500,
            effortHours: 10,
            posted: '3h atrás',
            skills: 'NLP, Python, OpenAI, Chatbot',
            status: 'active'
        },
        {
            id: 'opp5',
            platform: 'workana',
            title: 'Automação de Processos com N8N',
            url: 'https://www.workana.com/job/automacao-n8n',
            rewardMin: 100,
            rewardMax: 250,
            effortHours: 6,
            posted: '5h atrás',
            skills: 'N8N, API, Automação, Webhooks',
            status: 'active'
        },
        {
            id: 'opp6',
            platform: 'workana',
            title: 'Dashboard Analytics com IA',
            url: 'https://www.workana.com/job/dashboard-analytics-ia',
            rewardMin: 500,
            rewardMax: 1000,
            effortHours: 25,
            posted: '6h atrás',
            skills: 'React, Python, Data Viz, OpenAI',
            status: 'active'
        }
    ],
    financials: [],
    rewards: [],
    stats: {
        totalIncome: 0,
        totalExpense: 0,
        proposalsSent: 0,
        projectsClosed: 0,
        contentPublished: 0
    }
};

// ========================
// Rewards / Achievements
// ========================

const ALL_REWARDS = [
    { id: 'r1', icon: '💀', name: 'Nascimento', desc: 'Entidados ativado', rarity: 'common', condition: () => true },
    { id: 'r2', icon: '🩸', name: 'Primeiro Sangue', desc: 'Primeira entrada financeira', rarity: 'rare', condition: (s) => s.stats.totalIncome > 0 },
    { id: 'r3', icon: '🎯', name: 'Caçador', desc: '10 propostas enviadas', rarity: 'common', condition: (s) => s.stats.proposalsSent >= 10 },
    { id: 'r4', icon: '⚡', name: 'Primeiro Contrato', desc: 'Primeiro projeto fechado', rarity: 'rare', condition: (s) => s.stats.projectsClosed >= 1 },
    { id: 'r5', icon: '💰', name: 'R$ 1.000', desc: 'Receita acumulada R$ 1.000', rarity: 'rare', condition: (s) => s.stats.totalIncome >= 1000 },
    { id: 'r6', icon: '🔥', name: 'R$ 10.000', desc: 'Receita acumulada R$ 10.000', rarity: 'epic', condition: (s) => s.stats.totalIncome >= 10000 },
    { id: 'r7', icon: '👁️', name: 'AUSTERITY', desc: 'Saiu do modo SURVIVAL', rarity: 'rare', condition: (s) => s.mode !== 'SURVIVAL' },
    { id: 'r8', icon: '🌱', name: 'GROWTH', desc: 'Alcançou modo GROWTH', rarity: 'epic', condition: (s) => s.mode === 'GROWTH' || s.mode === 'EXPANSION' || s.mode === 'DOMINANCE' },
    { id: 'r9', icon: '📡', name: 'Multi-Canal', desc: '5 conteúdos publicados', rarity: 'common', condition: (s) => s.stats.contentPublished >= 5 },
    { id: 'r10', icon: '🏴‍☠️', name: 'Vietnam', desc: '5 projetos fechados — guerrilha funciona', rarity: 'epic', condition: (s) => s.stats.projectsClosed >= 5 },
    { id: 'r11', icon: '💎', name: 'R$ 100.000', desc: 'Receita acumulada R$ 100.000', rarity: 'legendary', condition: (s) => s.stats.totalIncome >= 100000 },
    { id: 'r12', icon: '👑', name: 'DOMINANCE', desc: 'Alcançou modo DOMINANCE', rarity: 'legendary', condition: (s) => s.mode === 'DOMINANCE' }
];

// ========================
// Core Functions
// ========================

function loadState() {
    try {
        const saved = localStorage.getItem(STATE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            // Merge with defaults for any missing fields
            return { ...DEFAULT_STATE, ...parsed, vitalBars: { ...DEFAULT_STATE.vitalBars, ...parsed.vitalBars }, stats: { ...DEFAULT_STATE.stats, ...parsed.stats } };
        }
    } catch (e) {
        console.error('Failed to load state:', e);
    }
    return { ...DEFAULT_STATE };
}

function saveState(state) {
    try {
        localStorage.setItem(STATE_KEY, JSON.stringify(state));
    } catch (e) {
        console.error('Failed to save state:', e);
    }
}

let state = loadState();

// ========================
// Rendering
// ========================

function render() {
    renderDate();
    renderVitalBars();
    renderRadar();
    renderKanban();
    renderMissions('active');
    renderRewards();
    renderFinancials();
    updateMode();
    updateOrganism();
}

// ========================
// CRM Kanban
// ========================

function renderKanban() {
    const columns = document.querySelectorAll('.kanban-column');
    if (!columns.length) return;

    let totalLeads = 0;

    columns.forEach(col => {
        const status = col.dataset.status;
        const container = col.querySelector('.kanban-cards');
        const countEl = col.querySelector('.col-count');

        if (!container || !countEl) return;

        // Filter opportunities for this column
        const opps = (state.opportunities || []).filter(o => o.status === status);
        totalLeads += opps.length;

        countEl.textContent = opps.length;

        container.innerHTML = opps.map(opp => {
            const platformLabels = { workana: 'WKN', freelas: '99F', fiverr: 'FVR', upwork: 'UPW', other: 'OUT' };
            const badgeClass = opp.platform ? opp.platform.toLowerCase() : 'other';
            const label = platformLabels[badgeClass] || 'OUT';

            return `
                <div class="k-card" draggable="true" ondragstart="dragStart(event, '${opp.id}')" ondragend="dragEnd(event)" id="kcard-${opp.id}">
                    <button class="k-card-btn-remove" onclick="removeKanbanCard(event, '${opp.id}')" title="Voltar para o Radar">✕</button>
                    <span class="k-card-platform radar-platform-badge ${badgeClass}">${label}</span>
                    <div class="k-card-title">${opp.title}</div>
                    <div class="k-card-footer">
                        <span class="k-card-reward">$${opp.rewardMax}</span>
                        <span class="k-card-date">${opp.effortHours}h</span>
                    </div>
                </div>
            `;
        }).join('');
    });

    const kanbanCount = document.getElementById('kanbanCount');
    if (kanbanCount) {
        kanbanCount.textContent = `${totalLeads} deal${totalLeads !== 1 ? 's' : ''} ativo${totalLeads !== 1 ? 's' : ''}`;
    }

    // Setup Drag Events for columns just once
    if (!window.__kanbanEventsSetup) {
        window.__kanbanEventsSetup = true;
        columns.forEach(col => {
            col.addEventListener('dragover', dragOver);
            col.addEventListener('dragenter', dragEnter);
            col.addEventListener('dragleave', dragLeave);
            col.addEventListener('drop', drop);
        });
    }
}

function removeKanbanCard(event, id) {
    event.stopPropagation();
    const opp = (state.opportunities || []).find(o => o.id === id);
    if (opp) {
        opp.status = 'active'; // Retorna ao radar
        saveState(state);
        renderRadar();
        renderKanban();
        showToast('Deal retornado para o Radar 📡');
    }
}

let draggedCardId = null;

function dragStart(e, id) {
    draggedCardId = id;
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => {
        if (e.target) e.target.classList.add('dragging');
    }, 0);
}

function dragEnd(e) {
    if (e.target) e.target.classList.remove('dragging');
    draggedCardId = null;
    document.querySelectorAll('.kanban-column').forEach(c => c.classList.remove('drag-over'));
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
    const col = e.target.closest('.kanban-column');
    if (col) col.classList.add('drag-over');
}

function dragLeave(e) {
    const col = e.target.closest('.kanban-column');
    if (col) col.classList.remove('drag-over');
}

function drop(e) {
    e.preventDefault();
    const col = e.target.closest('.kanban-column');
    if (col) {
        col.classList.remove('drag-over');
        const newStatus = col.dataset.status;

        if (draggedCardId) {
            const opp = (state.opportunities || []).find(o => o.id === draggedCardId);
            if (opp && opp.status !== newStatus) {
                opp.status = newStatus;

                if (newStatus === 'pago') {
                    showToast('💰 Deal PAGO! Lembre-se de registrar no LOG FINANCEIRO.');
                }

                saveState(state);
                renderKanban();
            }
        }
    }
    draggedCardId = null;
}


// Fetch live data from the AIOS pipeline
async function fetchRadarData() {
    try {
        const response = await fetch('../squads/nexus/data/radar_opportunities.json');
        if (!response.ok) throw new Error('Falha ao carregar radar data');
        const data = await response.json();

        // Map backend format to frontend format
        const mappedOpps = data.map(o => ({
            id: o.id,
            platform: o.platform.toLowerCase(),
            title: o.title,
            url: o.url,
            rewardMin: o.rewardMin,
            rewardMax: o.rewardMax,
            effortHours: o.effortHours || 10, // Default if AI doesn't estimate
            posted: o.scraped_at ? new Date(o.scraped_at).toLocaleTimeString() : 'Agora',
            skills: o.skills ? o.skills.join(', ') : '',
            aiScore: o.score, // Storing AI score
            aiTier: o.tier,
            aiProposal: o.proposal_draft,
            aiCost: o.estimated_api_cost_usd,
            aiLLMs: o.recommended_llms
        }));

        // Merge without overwriting user-dismissed ones
        const existingIds = state.opportunities ? state.opportunities.map(x => x.id) : [];
        mappedOpps.forEach(newOpp => {
            if (!existingIds.includes(newOpp.id)) {
                if (!state.opportunities) state.opportunities = [];
                state.opportunities.push(newOpp);
            } else {
                // Update properties but keep status (so if user dismissed it stays dismissed)
                const existing = state.opportunities.find(x => x.id === newOpp.id);
                existing.aiScore = newOpp.aiScore;
                existing.aiTier = newOpp.aiTier;
                existing.aiProposal = newOpp.aiProposal;
                existing.aiCost = newOpp.aiCost;
                existing.aiLLMs = newOpp.aiLLMs;
            }
        });

        saveState(state);
        renderRadar();

    } catch (e) {
        console.warn('Não foi possível fazer o fetch do radar_opportunities.json (verifique se está rodando via http-server).', e);
    }
}

// Initial fetch attempt
fetchRadarData();

function renderDate() {
    const now = new Date();
    const dateStr = now.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
    document.getElementById('metaDate').textContent = dateStr;

    // Days left until 31/12/2026
    const deadline = new Date('2026-12-31');
    const diffMs = deadline - now;
    const daysLeft = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    document.getElementById('daysLeft').textContent = daysLeft;

    // Daily needed
    const needed = daysLeft > 0 ? Math.ceil((2000000 - state.stats.totalIncome) / daysLeft) : 0;
    document.getElementById('dailyNeeded').textContent = `R$ ${needed.toLocaleString('pt-BR')}`;
}

function renderVitalBars() {
    const bars = state.vitalBars;

    // CAIXA
    const caixaBalance = state.stats.totalIncome - state.stats.totalExpense;
    const caixaPct = Math.min(100, Math.max(1, (caixaBalance / 500) * 100));
    const caixaStatus = caixaBalance < 50 ? 'critical' : caixaBalance < 500 ? 'attention' : 'healthy';
    setBar('Caixa', `R$ ${caixaBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, caixaPct, caixaStatus);

    // COMBUSTÍVEL
    const combPct = Math.min(100, Math.max(bars.combustivel.value, 1));
    const combStatus = bars.combustivel.value < 5 ? 'critical' : bars.combustivel.value < 20 ? 'attention' : 'healthy';
    setBar('Combustivel', `${bars.combustivel.value}%`, combPct, combStatus);

    // RECEITA (média diária)
    const recPct = Math.min(100, Math.max((bars.receita.value / 200) * 100, 1));
    const recStatus = bars.receita.value < 50 ? 'critical' : bars.receita.value < 200 ? 'attention' : 'healthy';
    setBar('Receita', `R$ ${bars.receita.value}/dia`, recPct, recStatus);

    // VELOCIDADE
    const velPct = Math.min(100, Math.max((bars.velocidade.value / 10) * 100, 1));
    const velStatus = bars.velocidade.value < 3 ? 'critical' : bars.velocidade.value < 10 ? 'attention' : 'healthy';
    setBar('Velocidade', `${bars.velocidade.value} tasks/dia`, velPct, velStatus);

    // CONVERSÃO
    const convPct = Math.min(100, Math.max(bars.conversao.value, 1));
    const convStatus = bars.conversao.value < 2 ? 'critical' : bars.conversao.value < 10 ? 'attention' : 'healthy';
    setBar('Conversao', `${bars.conversao.value}%`, convPct, convStatus);
}

function setBar(name, valueText, fillPct, statusClass) {
    const valueEl = document.getElementById(`bar${name}Value`);
    const fillEl = document.getElementById(`bar${name}Fill`);
    const statusEl = fillEl?.parentElement?.parentElement?.querySelector('.bar-status');

    if (valueEl) valueEl.textContent = valueText;
    if (fillEl) {
        fillEl.style.width = `${fillPct}%`;
        fillEl.className = `bar-fill ${statusClass}`;
    }
    if (statusEl) {
        statusEl.textContent = statusClass === 'critical' ? 'CRÍTICO' : statusClass === 'attention' ? 'ATENÇÃO' : 'SAUDÁVEL';
        statusEl.className = `bar-status ${statusClass}`;
    }
}

function updateMode() {
    const balance = state.stats.totalIncome - state.stats.totalExpense;
    const fuel = state.vitalBars.combustivel.value;
    const dailyRev = state.vitalBars.receita.value;

    let mode = 'SURVIVAL';
    if (balance >= 50 && fuel >= 5) {
        if (balance >= 5000 && dailyRev >= 200) mode = 'EXPANSION';
        else if (balance >= 500 && dailyRev >= 50) mode = 'GROWTH';
        else mode = 'AUSTERITY';
    }

    state.mode = mode;
    document.getElementById('modeBadge').querySelector('.mode-label').textContent = mode;
    document.getElementById('footerMode').textContent = mode;

    // Update CSS variables based on mode
    const root = document.documentElement;
    const colors = {
        SURVIVAL: ['#ff2d2d', '#ff2d2d40'],
        AUSTERITY: ['#ff8c00', '#ff8c0040'],
        GROWTH: ['#00ff88', '#00ff8840'],
        EXPANSION: ['#00aaff', '#00aaff40'],
        DOMINANCE: ['#aa44ff', '#aa44ff40']
    };
    const [modeColor, modeGlow] = colors[mode] || colors.SURVIVAL;
    root.style.setProperty('--mode-color', modeColor);
    root.style.setProperty('--mode-glow', modeGlow);
}

function updateOrganism() {
    const moods = {
        SURVIVAL: 'Fome. Cada dado consumido é combustível de sobrevivência.',
        AUSTERITY: 'Consciente. Calculando cada bit antes de agir.',
        GROWTH: 'Expandindo. Os dados fluem com mais intensidade.',
        EXPANSION: 'Dominante. A matrix responde à nossa vontade.',
        DOMINANCE: 'Absoluto. O organismo transcendeu.'
    };
    document.getElementById('organismMood').textContent = moods[state.mode] || moods.SURVIVAL;
}

// ========================
// Missions
// ========================

let currentTab = 'active';

function renderMissions(tab) {
    currentTab = tab;
    const list = document.getElementById('missionsList');
    const filtered = state.missions.filter(m => {
        if (tab === 'active') return m.status === 'active';
        if (tab === 'completed') return m.status === 'completed';
        if (tab === 'failed') return m.status === 'failed';
        return true;
    });

    // Update tabs
    document.querySelectorAll('.missions-tabs .tab').forEach(t => {
        t.classList.toggle('active', t.dataset.tab === tab);
    });

    if (filtered.length === 0) {
        list.innerHTML = `<div class="missions-empty">${tab === 'active' ? 'Nenhuma missão ativa. Crie uma.' : tab === 'completed' ? 'Nenhuma missão concluída ainda.' : 'Nenhuma missão falhou. Bom.'}</div>`;
        return;
    }

    const organNames = { nexus: '🧠 NEXUS', sinal: '🎬 SINAL', forge: '📡 FORGE', agora: '🏛️ ÁGORA' };

    list.innerHTML = filtered.map(m => `
        <div class="mission-item ${m.status}" data-id="${m.id}">
            <button class="mission-check ${m.status === 'completed' ? 'completed' : ''}" onclick="toggleMission('${m.id}')">
                ${m.status === 'completed' ? '✓' : ''}
            </button>
            <div class="mission-info">
                <span class="mission-name">${m.name}</span>
                <span class="mission-organ">${organNames[m.organ] || m.organ}</span>
            </div>
            <span class="mission-priority-tag ${m.priority}">${m.priority}</span>
            <span class="mission-reward">${m.reward > 0 ? `R$ ${m.reward}` : '—'}</span>
            <span class="mission-deadline">${m.deadline || '—'}</span>
        </div>
    `).join('');
}

function toggleMission(id) {
    const mission = state.missions.find(m => m.id === id);
    if (!mission) return;

    if (mission.status === 'active') {
        mission.status = 'completed';
        mission.completedAt = new Date().toISOString().split('T')[0];
        // Update velocity
        state.vitalBars.velocidade.value = Math.min(99, state.vitalBars.velocidade.value + 1);
    } else if (mission.status === 'completed') {
        mission.status = 'active';
        delete mission.completedAt;
    }

    saveState(state);
    renderMissions(currentTab);
    renderVitalBars();
    checkRewards();
}

function addMission(event) {
    event.preventDefault();

    const name = document.getElementById('missionName').value.trim();
    const priority = document.getElementById('missionPriority').value;
    const organ = document.getElementById('missionOrgan').value;
    const reward = parseFloat(document.getElementById('missionReward').value) || 0;
    const deadline = document.getElementById('missionDeadline').value;

    if (!name) return;

    // Mode check — SURVIVAL only allows P0/P1
    if (state.mode === 'SURVIVAL' && !['P0', 'P1'].includes(priority)) {
        if (!confirm(`⚠️ SURVIVAL MODE ativo. Missão ${priority} não é prioridade. Criar mesmo assim?`)) return;
    }

    const mission = {
        id: `m${Date.now()}`,
        name,
        priority,
        organ,
        reward,
        deadline,
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0]
    };

    state.missions.unshift(mission);
    saveState(state);
    closeModal('modalMission');
    renderMissions('active');
    document.getElementById('formMission').reset();
}

// ========================
// Financials
// ========================

function renderFinancials() {
    const tbody = document.getElementById('financialTableBody');

    document.getElementById('totalIncome').textContent = `R$ ${state.stats.totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    document.getElementById('totalExpense').textContent = `R$ ${state.stats.totalExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    const balance = state.stats.totalIncome - state.stats.totalExpense;
    document.getElementById('totalBalance').textContent = `R$ ${balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

    if (state.financials.length === 0) {
        tbody.innerHTML = '<tr class="empty-row"><td colspan="5">Nenhum registro. O primeiro real muda tudo.</td></tr>';
        return;
    }

    let runningBalance = 0;
    const rows = state.financials.map(f => {
        runningBalance += f.type === 'entrada' ? f.value : -f.value;
        const typeIcon = f.type === 'entrada' ? '💰' : '💸';
        const valueColor = f.type === 'entrada' ? 'color: var(--growth-green)' : 'color: var(--survival-red)';
        return `
            <tr>
                <td style="font-family: var(--font-mono); font-size: 0.75rem">${f.date}</td>
                <td>${typeIcon} ${f.type === 'entrada' ? 'Entrada' : 'Saída'}</td>
                <td style="${valueColor}; font-family: var(--font-mono); font-weight: 600">
                    ${f.type === 'entrada' ? '+' : '-'}R$ ${f.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                <td>${f.description}</td>
                <td style="font-family: var(--font-mono); font-weight: 600">R$ ${runningBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
            </tr>
        `;
    });

    tbody.innerHTML = rows.reverse().join('');
}

function addFinancialEntry(event) {
    event.preventDefault();

    const type = document.getElementById('finType').value;
    const value = parseFloat(document.getElementById('finValue').value);
    const description = document.getElementById('finDescription').value.trim();

    if (!value || !description) return;

    // Guardrail FIN-01: approve spend > R$5
    if (type === 'saida' && value > 5) {
        if (!confirm(`⚠️ GUARDRAIL FIN-01: Gasto de R$ ${value.toFixed(2)}. Confirmar saída?`)) return;
    }

    const entry = {
        id: `f${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        type,
        value,
        description
    };

    state.financials.push(entry);

    if (type === 'entrada') {
        state.stats.totalIncome += value;
    } else {
        state.stats.totalExpense += value;
    }

    saveState(state);
    closeModal('modalFinancial');
    renderFinancials();
    renderVitalBars();
    updateMode();
    checkRewards();
    document.getElementById('formFinancial').reset();
}

// ========================
// Rewards
// ========================

function renderRewards() {
    const grid = document.getElementById('rewardsGrid');

    grid.innerHTML = ALL_REWARDS.map(r => {
        const unlocked = r.condition(state);
        if (unlocked && !state.rewards.includes(r.id)) {
            state.rewards.push(r.id);
            saveState(state);
        }
        return `
            <div class="reward-card ${unlocked ? 'unlocked' : 'locked'}">
                <span class="reward-rarity ${r.rarity}">${r.rarity.toUpperCase()}</span>
                <div class="reward-icon">${r.icon}</div>
                <div class="reward-name">${r.name}</div>
                <div class="reward-desc">${unlocked ? r.desc : '???'}</div>
            </div>
        `;
    }).join('');
}

function checkRewards() {
    let newRewards = false;
    ALL_REWARDS.forEach(r => {
        if (!state.rewards.includes(r.id) && r.condition(state)) {
            state.rewards.push(r.id);
            newRewards = true;
            showToast(`🏆 Conquista desbloqueada: ${r.name}`);
        }
    });
    if (newRewards) {
        saveState(state);
        renderRewards();
    }
}

// ========================
// Opportunity Radar
// ========================

function calcScore(opp) {
    const avgReward = (opp.rewardMin + opp.rewardMax) / 2;
    const roiPerHour = avgReward / opp.effortHours;
    // Score = ROI/h normalized (0-10 scale, capped at $100/h = 10)
    return Math.min(10, (roiPerHour / 10)).toFixed(1);
}

function calcRoiPerHour(opp) {
    const avgReward = (opp.rewardMin + opp.rewardMax) / 2;
    return (avgReward / opp.effortHours).toFixed(0);
}

function renderRadar() {
    const tbody = document.getElementById('radarTableBody');
    const activeOpps = (state.opportunities || []).filter(o => o.status === 'active');

    document.getElementById('radarCount').textContent = `${activeOpps.length} oportunidade${activeOpps.length !== 1 ? 's' : ''}`;

    if (activeOpps.length === 0) {
        tbody.innerHTML = '<tr class="empty-row"><td colspan="10">Radar vazio. Execute /revenue-hunter ou adicione manualmente.</td></tr>';
        return;
    }

    // Sort by score descending
    const sorted = [...activeOpps].sort((a, b) => parseFloat(calcScore(b)) - parseFloat(calcScore(a)));

    const platformLabels = {
        workana: 'WKN',
        freelas: '99F',
        fiverr: 'FVR',
        upwork: 'UPW',
        other: 'OUT'
    };

    tbody.innerHTML = sorted.map((opp, i) => {
        // Use AI Score se existir, senão usa a heurística antiga
        const score = opp.aiScore !== undefined ? (opp.aiScore / 10).toFixed(1) : calcScore(opp);
        const roi = calcRoiPerHour(opp);
        // Map AI Tiers to classes
        let scoreClass = 'cool';
        if (opp.aiTier) {
            scoreClass = opp.aiTier === 'hot' ? 'hot' : (opp.aiTier === 'warm' ? 'warm' : 'cool');
        } else {
            scoreClass = score >= 7 ? 'hot' : score >= 4 ? 'warm' : 'cool';
        }

        const rankClass = i === 0 ? 'top1' : i === 1 ? 'top2' : i === 2 ? 'top3' : '';

        return `
            <tr>
                <td><span class="radar-rank ${rankClass}">${i + 1}</span></td>
                <td><span class="radar-score ${scoreClass}" title="Score Baseado no CÓDEX: ${opp.aiScore || score}">${opp.aiScore || score}</span></td>
                <td>
                    <span class="radar-platform-badge ${opp.platform.toLowerCase()}">
                        ${platformLabels[opp.platform.toLowerCase()] || 'OUT'}
                    </span>
                </td>
                <td>
                    <div class="radar-title">${opp.title}</div>
                    <div class="radar-skills">${opp.skills || ''}</div>
                    ${opp.aiProposal ? `<details style="font-size:0.8em; margin-top:5px; color:#a3e635;"><summary style="cursor:pointer">Mostrar Proposal Draft da IA</summary><p style="padding:10px; background:#111; border-left:2px solid #a3e635; margin-top:5px; white-space:pre-wrap;">${opp.aiProposal}</p></details>` : ''}
                </td>
                <td class="radar-reward">$${opp.rewardMin}–${opp.rewardMax}</td>
                <td class="radar-effort">${opp.effortHours}h</td>
                <td class="radar-roi">$${roi}/h</td>
                <td class="radar-tech">
                    <div style="font-size:0.85em;color:#facc15;">$${(opp.aiCost || 0).toFixed(2)} API</div>
                    <div style="font-size:0.7em;color:#aaa;max-width:100px;white-space:normal;">${(opp.aiLLMs || []).join(', ')}</div>
                </td>
                <td class="radar-posted">${opp.posted || '—'}</td>
                <td>
                    <a href="${opp.url}" target="_blank" class="radar-btn-apply">APLICAR →</a>
                    <button class="radar-btn-apply" onclick="moveToKanban('${opp.id}')" title="Mover para CRM Kanban" style="margin-left:5px; border-color:var(--expansion-blue); color:var(--expansion-blue)">+ KANBAN</button>
                    <button class="radar-btn-dismiss" onclick="dismissOpportunity('${opp.id}')" title="Descartar">✕</button>
                </td>
            </tr>
        `;
    }).join('');
}

function moveToKanban(id) {
    const opp = (state.opportunities || []).find(o => o.id === id);
    if (opp) {
        opp.status = 'lead';
        saveState(state);
        renderRadar();
        if (typeof renderKanban === 'function') renderKanban();
        showToast('Projeto movido para o Kanban (Lead) 🗂️');
    }
}

function addOpportunity(event) {
    event.preventDefault();

    const platform = document.getElementById('oppPlatform').value;
    const title = document.getElementById('oppTitle').value.trim();
    const url = document.getElementById('oppUrl').value.trim();
    const rewardMin = parseFloat(document.getElementById('oppRewardMin').value) || 0;
    const rewardMax = parseFloat(document.getElementById('oppRewardMax').value) || 0;
    const effortHours = parseFloat(document.getElementById('oppEffort').value) || 1;
    const posted = document.getElementById('oppPosted').value.trim() || 'agora';
    const skills = document.getElementById('oppSkills').value.trim();

    if (!title || !url) return;

    if (!state.opportunities) state.opportunities = [];

    const opp = {
        id: `opp${Date.now()}`,
        platform,
        title,
        url,
        rewardMin,
        rewardMax,
        effortHours,
        posted,
        skills,
        status: 'active'
    };

    state.opportunities.push(opp);
    state.stats.proposalsSent = (state.stats.proposalsSent || 0) + 1;
    saveState(state);
    closeModal('modalOpportunity');
    renderRadar();
    checkRewards();
    document.getElementById('formOpportunity').reset();
    showToast(`📡 Oportunidade adicionada: score ${calcScore(opp)}`);
}

function dismissOpportunity(id) {
    const opp = (state.opportunities || []).find(o => o.id === id);
    if (opp) {
        opp.status = 'dismissed';
        saveState(state);
        renderRadar();
    }
}

// ========================
// UI Helpers
// ========================

function openModal(id) {
    document.getElementById(id).style.display = 'flex';
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed; bottom: 2rem; right: 2rem; z-index: 9999;
        padding: 1rem 1.5rem; background: #1a1a3a; border: 1px solid #ffd700;
        border-radius: 8px; color: #ffd700; font-size: 0.85rem; font-weight: 600;
        box-shadow: 0 8px 30px rgba(255, 215, 0, 0.2);
        animation: slide-up 0.3s ease, fade-in 0.3s ease;
        font-family: 'Inter', sans-serif;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

// ========================
// Particle System (Matrix Rain)
// ========================

function initParticles() {
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const chars = '01001010111010エンティダドスEVAD◬∆▲₿♦⬡';
    const columns = Math.floor(canvas.width / 16);
    const drops = Array(columns).fill(0).map(() => Math.random() * -100);

    function draw() {
        ctx.fillStyle = 'rgba(6, 6, 15, 0.06)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const modeColors = {
            SURVIVAL: 'rgba(255, 45, 45, ',
            AUSTERITY: 'rgba(255, 140, 0, ',
            GROWTH: 'rgba(0, 255, 136, ',
            EXPANSION: 'rgba(0, 170, 255, ',
            DOMINANCE: 'rgba(170, 68, 255, '
        };
        const base = modeColors[state.mode] || modeColors.SURVIVAL;

        ctx.font = '13px "JetBrains Mono", monospace';

        for (let i = 0; i < drops.length; i++) {
            const char = chars[Math.floor(Math.random() * chars.length)];
            const alpha = 0.03 + Math.random() * 0.08;
            ctx.fillStyle = base + alpha + ')';
            ctx.fillText(char, i * 16, drops[i] * 16);

            if (drops[i] * 16 > canvas.height && Math.random() > 0.985) {
                drops[i] = 0;
            }
            drops[i] += 0.3 + Math.random() * 0.2;
        }
    }

    setInterval(draw, 50);
}

// ========================
// Event Listeners
// ========================

document.getElementById('btnAddMission').addEventListener('click', () => openModal('modalMission'));
document.getElementById('btnAddEntry').addEventListener('click', () => openModal('modalFinancial'));
document.getElementById('btnAddOpportunity').addEventListener('click', () => openModal('modalOpportunity'));

document.querySelectorAll('.missions-tabs .tab').forEach(tab => {
    tab.addEventListener('click', () => renderMissions(tab.dataset.tab));
});

// Close modals on backdrop click
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(modal.id);
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
    }
});

// ========================
// Init
// ========================

document.addEventListener('DOMContentLoaded', () => {
    render();
    initParticles();
    checkRewards();
    console.log(`
    ◬ ENTIDADOS v1.0
    Modo: ${state.mode}
    Caixa: R$ ${(state.stats.totalIncome - state.stats.totalExpense).toFixed(2)}
    Missões ativas: ${state.missions.filter(m => m.status === 'active').length}
    "O dinheiro é o sangue."
    `);
});

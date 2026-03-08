import os
import json
import logging
from pathlib import Path

import os
import json
import logging
import urllib.request
from pathlib import Path

# Configuração
WORK_DIR = Path(__file__).parent.parent.parent
DATA_DIR = WORK_DIR / "squads" / "nexus" / "data"
RAW_FILE = DATA_DIR / "raw_opportunities.json"
RADAR_FILE = DATA_DIR / "radar_opportunities.json"
CODEX_FILE = WORK_DIR / "CODEX.md"

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def load_json(filepath: Path) -> list:
    if not filepath.exists():
        return []
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(filepath: Path, data: list):
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def read_codex() -> str:
    if not CODEX_FILE.exists():
        return ""
    with open(CODEX_FILE, 'r', encoding='utf-8') as f:
        return f.read()

def call_local_llm(prompt: str) -> dict:
    """Chama LLM local no Alienware (LM Studio ou Ollama) - Muscle Zero-Cost."""

    # Configuração — IP DO ALIENWARE NA REDE TAILSCALE
    ALIENWARE_IP = os.environ.get("ALIENWARE_IP", "100.66.114.87")
    LLM_PORT = os.environ.get("LLM_PORT", "1234")
    url = f"http://{ALIENWARE_IP}:{LLM_PORT}/v1/chat/completions"

    headers = {
        "Content-Type": "application/json"
    }

    data = {
        "model": "gpt-oss:20b",
        "messages": [
            {"role": "system", "content": "You are a helpful assistant that outputs only raw, valid JSON."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.3,
        "max_tokens": 1500
    }

    try:
        req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers=headers, method='POST')
        with urllib.request.urlopen(req, timeout=300) as response:
            result = json.loads(response.read().decode('utf-8'))
            if "choices" in result and len(result["choices"]) > 0:
                content = result["choices"][0]["message"]["content"]
                content = content.replace("```json", "").replace("```", "").strip()
                return json.loads(content)
            else:
                logging.warning(f"Resposta inesperada do LLM local: {result}")
                return None
    except Exception as e:
        logging.warning(f"Falha ao conectar ao LLM local em {url}: {e}")
        return None

def call_openrouter_free_llm(prompt: str) -> dict:
    """Tenta chamar OpenRouter usando os modelos Free para salvar Caixa (Survival Mode)."""

    api_key = os.environ.get("OPENROUTER_API_KEY")
    if not api_key:
        logging.warning("OPENROUTER_API_KEY não definida. Abortando tentativa de usar modelo Free.")
        return None

    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}",
        "HTTP-Referer": "https://synkra.ai",
        "X-Title": "age"
    }

    data = {
        "model": "google/gemini-2.0-flash-lite-preview-02-05:free",
        "messages": [
            {"role": "system", "content": "You are a helpful assistant that outputs only raw, valid JSON."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.3,
        "max_tokens": 1500
    }

    try:
        req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers=headers, method='POST')
        with urllib.request.urlopen(req, timeout=30) as response:
            result = json.loads(response.read().decode('utf-8'))
            if "choices" in result and len(result["choices"]) > 0:
                content = result["choices"][0]["message"]["content"]
                content = content.replace("```json", "").replace("```", "").strip()
                return json.loads(content)
            else:
                logging.warning(f"Resposta inesperada do OpenRouter: {result}")
                return None
    except Exception as e:
        logging.warning(f"Falha na API OpenRouter: {e}")
        return None

def evaluate_project(project: dict, codex: str) -> dict:
    prompt = f"""
    Atue como o Diretor de Operações (NEXUS Squad) da EVAD DAO.
    Seu objetivo é avaliar um projeto Freelance e decidir se devemos enviar uma proposta, baseado no nosso CÓDEX.
    
    CÓDEX ATUAL (Foco: SURVIVAL MODE - Precisamos de Receita Rápida, P0):
    {codex[:1000]}...
    
    DADOS DO PROJETO:
    - Título: {project.get('title')}
    - Recompensa: {project.get('rewardRaw')}
    - Habilidades: {', '.join(project.get('skills', []))}
    - Descrição: {project.get('full_description')}
    
    TAREFA:
    1. Calcule 'score' térmica (0-100).
    2. 'tier': "hot" (>80), "warm" (50-80), "cool" (<50).
    3. 'effort_hours': esforço em horas.
    4. 'proposal_draft': se tier for hot ou warm, rascunho de proposta persuasiva em Pt-BR.
    
    Responda APENAS com este JSON válido e NADA MAIS:
    {{
        "score": 85,
        "tier": "hot",
        "effort_hours": 12,
        "proposal_draft": "Olá, vi sua necessidade de..."
    }}
    """
    
    # 1. Tenta LLM Local no Alienware (Muscle Zero-Cost)
    logging.info(f"🧠 Tentando LLM local (Alienware)...")
    eval_result = call_local_llm(prompt)
    if eval_result:
        logging.info(f"✅ Sucesso via LLM local!")
        return eval_result

    # 2. Se falhar, tenta OpenRouter Free LLM como fallback
    logging.info(f"⚠️ LLM local indisponível. Tentando OpenRouter Free...")
    eval_result = call_openrouter_free_llm(prompt)
    if eval_result:
        logging.info(f"✅ Sucesso via OpenRouter!")
        return eval_result

    # 3. Se tudo falhar, retorna score 0
    logging.error(f"Erro ao avaliar projeto. LLM local e OpenRouter indisponíveis.")
    return {
        "score": 0,
        "tier": "cool",
        "effort_hours": 0,
        "proposal_draft": ""
    }

def run_drafter():
    logging.info("🚀 Iniciando Drafter do Revenue Hunter...")
    
    codex_content = read_codex()
    projects = load_json(RAW_FILE)
    
    if not projects:
        logging.warning(f"Nenhum projeto encontrado em {RAW_FILE}")
        return

    radar_projects = load_json(RADAR_FILE)
    processed_ids = {p['id'] for p in radar_projects}
    
    new_projects = [p for p in projects if p['id'] not in processed_ids]
    logging.info(f"Projetos a processar: {len(new_projects)} de {len(projects)}")
    
    for proj in new_projects:
        logging.info(f"🧠 Avaliando projeto: {proj['title'][:50]}...")
        
        eval_result = evaluate_project(proj, codex_content)
        
        # Merge de Resultados
        proj['score'] = eval_result.get('score', 0)
        proj['tier'] = eval_result.get('tier', 'cool')
        proj['effort_hours'] = eval_result.get('effort_hours', 10)
        proj['proposal_draft'] = eval_result.get('proposal_draft', '')
        proj['status'] = 'evaluated'
        
        radar_projects.append(proj)
        
        # Salva a cada iteração para não perder dados se a API cair
        save_json(RADAR_FILE, radar_projects)
        logging.info(f"✅ Projeto {proj['id']} salvo no Radar ({proj['tier'].upper()} - {proj['score']}/100)")
        
    logging.info(f"🏁 Drafter finalizado. Total no Radar: {len(radar_projects)}")

if __name__ == "__main__":
    run_drafter()

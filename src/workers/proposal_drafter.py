import os
import json
import logging
from pathlib import Path

try:
    from google import genai
    from google.genai import types
except ImportError:
    print("❌ Erro: Pacote 'google-genai' não encontrado. Execute: pip install google-genai")
    exit(1)

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

def init_llm():
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        logging.error("GEMINI_API_KEY não definida no ambiente.")
        return None
    return genai.Client(api_key=api_key)

def evaluate_project(client, project: dict, codex: str) -> dict:
    prompt = f"""
    Atue como o Diretor de Operações (NEXUS Squad) da EVAD DAO.
    Seu objetivo é avaliar um projeto Freelance e decidir se devemos enviar uma proposta, baseado no nosso CÓDEX.
    
    CÓDEX ATUAL (Foco: SURVIVAL MODE - Precisamos de Receita Rápida, P0 ou P1):
    {codex[:1000]}...
    
    DADOS DO PROJETO:
    - Título: {project.get('title')}
    - Recompensa (Raw): {project.get('rewardRaw')}
    - Habilidades: {', '.join(project.get('skills', []))}
    - Descrição: {project.get('full_description')}
    
    TAREFA:
    1. Calcule uma 'score' térmica de 0 a 100 (100 = Match perfeito, dinheiro rápido, alta viabilidade técnica).
    2. Classifique o 'tier': "hot" (>80), "warm" (50-80), "cool" (<50).
    3. Estime o esforço em horas ('effort_hours') necessário para nós entregarmos o projeto.
    4. Estime o custo de API em USD ('estimated_api_cost_usd') que teremos para rodar as LLMs/Agentes para entregar isso. Se for um chatbot simples, o custo é baixo. Se exigir muitos tokens, avalie.
    5. Liste quais LLMs ('recommended_llms') da nossa stack atual (ex: Gemini 2.5 Flash, Claude 3.5 Sonnet, OpenAI o1, DeepSeek R1) seriam necessárias.
    6. Se tier for "hot" ou "warm", redija um rascunho de 'proposal' persuasiva em Português.
    7. Gere um raciocínio curto ('reasoning') justificando a nota e as escolhas técnicas.
    
    Responda EXATAMENTE neste formato JSON válido:
    {{
        "score": 85,
        "tier": "hot",
        "effort_hours": 12,
        "estimated_api_cost_usd": 1.50,
        "recommended_llms": ["Gemini 2.5 Flash", "DeepSeek R1"],
        "reasoning": "Texto justificando...",
        "proposal_draft": "Olá, vi sua necessidade de... [texto da proposta]..."
    }}
    """
    
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
            ),
        )
        return json.loads(response.text)
    except Exception as e:
        logging.error(f"Erro ao avaliar projeto {project.get('id')}: {e}")
        return {
            "score": 0,
            "tier": "cool",
            "effort_hours": 0,
            "estimated_api_cost_usd": 0.0,
            "recommended_llms": [],
            "reasoning": f"Erro na avaliação via LLM: {str(e)}",
            "proposal_draft": ""
        }

def run_drafter():
    logging.info("🚀 Iniciando Drafter do Revenue Hunter...")
    client = init_llm()
    if not client:
        logging.warning("Executando em Modo Mock (Sem GEMINI_API_KEY). Apenas dados simulados serão gerados.")
    
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
        
        if client:
            eval_result = evaluate_project(client, proj, codex_content)
        else:
            # Mock Data
            score = 75 if len(proj['full_description']) > 150 else 40
            tier = "hot" if score > 80 else ("warm" if score > 50 else "cool")
            eval_result = {
                "score": score,
                "tier": tier,
                "effort_hours": 10 if tier == 'hot' else 25,
                "estimated_api_cost_usd": 0.50 if tier == 'hot' else 2.50,
                "recommended_llms": ["Mock LLM 1.0"],
                "reasoning": "Mock evaluation based on description length.",
                "proposal_draft": "Simulação de proposta... Olá, posso fazer isso." if tier in ['hot', 'warm'] else ""
            }
        
        # Merge de Resultados
        proj['score'] = eval_result.get('score', 0)
        proj['tier'] = eval_result.get('tier', 'cool')
        proj['effort_hours'] = eval_result.get('effort_hours', 10)
        proj['estimated_api_cost_usd'] = eval_result.get('estimated_api_cost_usd', 0.0)
        proj['recommended_llms'] = eval_result.get('recommended_llms', [])
        proj['reasoning'] = eval_result.get('reasoning', '')
        proj['proposal_draft'] = eval_result.get('proposal_draft', '')
        proj['status'] = 'evaluated'
        
        radar_projects.append(proj)
        
        # Salva a cada iteração para não perder dados se a API cair
        save_json(RADAR_FILE, radar_projects)
        logging.info(f"✅ Projeto {proj['id']} salvo no Radar ({proj['tier'].upper()} - {proj['score']}/100)")
        
    logging.info(f"🏁 Drafter finalizado. Total no Radar: {len(radar_projects)}")

if __name__ == "__main__":
    run_drafter()

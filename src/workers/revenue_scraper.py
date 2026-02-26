import json
import os
import re
import urllib.request
import urllib.parse
from datetime import datetime

# Configurações Iniciais
OUTPUT_DIR = "squads/nexus/data"
RAW_FILE = os.path.join(OUTPUT_DIR, "raw_opportunities.json")
WORKANA_URL = "https://www.workana.com/jobs?category=it-programming"

def setup():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

def fetch_html(url):
    req = urllib.request.Request(
        url, 
        headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}
    )
    try:
        with urllib.request.urlopen(req) as response:
            return response.read().decode('utf-8')
    except Exception as e:
        print(f"Erro ao buscar {url}: {e}")
        return None

def extract_projects(html):
    projects = []
    if not html:
        return projects
        
    # Extrair blocos de projetos usando Regex (simulando BeautifulSoup leve)
    project_blocks = re.findall(r'<div class="project-item[^>]*>(.*?)</div>\s*</div>\s*</div>', html, re.DOTALL)
    
    for block in project_blocks:
        try:
            # Título e Link
            title_match = re.search(r'<h2 class="project-title[^>]*>.*?<a href="([^"]+)"[^>]*title="([^"]+)"', block, re.DOTALL)
            if not title_match:
                continue
            
            relative_link = title_match.group(1)
            full_link = "https://www.workana.com" + relative_link
            title = title_match.group(2).strip()
            
            # Recompensa
            reward_match = re.search(r'<span class="values[^>]*>(.*?)</span>', block)
            reward_raw = reward_match.group(1).strip() if reward_match else "N/A"
            
            # Limpar e converter reward ("Menos de USD 50", "USD 50 - 100")
            reward_min, reward_max = parse_reward(reward_raw)
            
            # Pegar Detalhes Completos (Deep Fetch - A magia do Scraper)
            # O Scraper não para na listagem, ele entra na página de cada projeto
            detailed_html = fetch_html(full_link)
            full_description = ""
            skills = []
            
            if detailed_html:
                desc_match = re.search(r'<div class="expander js-expander-body[^>]*>(.*?)</div>', detailed_html, re.DOTALL)
                if desc_match:
                    full_description = re.sub(r'<[^>]+>', '', desc_match.group(1)).strip()
                
                # Skills Ocultas
                skills_matches = re.findall(r'<a class="skill[^>]*>(.*?)</a>', detailed_html)
                skills = [re.sub(r'<[^>]+>', '', s).strip() for s in skills_matches]

            projects.append({
                "id": f"wkn_{hash(title)}",
                "platform": "Workana",
                "title": title,
                "url": full_link,
                "rewardRaw": reward_raw,
                "rewardMin": reward_min,
                "rewardMax": reward_max,
                "full_description": full_description, # A DIFERENÇA DO NOVO SISTEMA!
                "skills": skills,
                "status": "raw",
                "scraped_at": datetime.now().isoformat()
            })
            print(f"Scraped profundo (Fio de Prumo): {title[:30]}...")
            
        except Exception as e:
            print(f"Erro processando um bloco: {e}")
            continue
            
    return projects

def parse_reward(reward_str):
    try:
        numbers = [int(re.sub(r'\D', '', n)) for n in re.findall(r'\d+', reward_str)]
        if len(numbers) == 1:
            return 0, numbers[0]
        elif len(numbers) >= 2:
            return numbers[0], numbers[1]
    except:
        pass
    return 0, 0

def run():
    print(f"Iniciando Varredura CLI-First (Revenue Scraper v2.0)...")
    setup()
    html = fetch_html(WORKANA_URL)
    
    if html:
        projects = extract_projects(html)
        print(f"\n{len(projects)} Projetos Coletados com Profundidade (Deep Fetch).")
        
        with open(RAW_FILE, 'w') as f:
            json.dump(projects, f, indent=4, ensure_ascii=False)
            
        print(f"Salvo em: {RAW_FILE}")
    else:
        print("Falha na coleta.")

if __name__ == "__main__":
    run()

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
NINE_NINE_URL = "https://www.99freelas.com.br/projects?categoria=web-desenvolvimento"

def setup():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

def fetch_url(url, headers=None):
    if not headers:
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as response:
            return response.read().decode('utf-8')
    except Exception as e:
        print(f"Erro ao buscar {url}: {e}")
        return None

def parse_reward(reward_str):
    try:
        numbers = [int(re.sub(r'\D', '', n)) for n in re.findall(r'\d+', reward_str.replace('.', ''))]
        if len(numbers) == 1:
            return 0, numbers[0]
        elif len(numbers) >= 2:
            return numbers[0], numbers[1]
    except:
        pass
    return 0, 0

def fetch_workana():
    projects = []
    print("\nBuscando Workana (se houver perfil logado ou não bloqueado)...")
    html = fetch_url(WORKANA_URL)
    if not html: return projects
    
    project_blocks = re.findall(r'<div class="project-item[^>]*>(.*?)</div>\s*</div>\s*</div>', html, re.DOTALL)
    for block in project_blocks[:5]: # Limit for speed
        try:
            title_match = re.search(r'<h2 class="project-title[^>]*>.*?<a href="([^"]+)"[^>]*title="([^"]+)"', block, re.DOTALL)
            if not title_match: continue
            
            relative_link = title_match.group(1)
            full_link = "https://www.workana.com" + relative_link
            title = title_match.group(2).strip()
            
            reward_match = re.search(r'<span class="values[^>]*>(.*?)</span>', block)
            reward_raw = reward_match.group(1).strip() if reward_match else "N/A"
            reward_min, reward_max = parse_reward(reward_raw)
            
            detailed_html = fetch_url(full_link)
            full_description = ""
            skills = []
            
            if detailed_html:
                desc_match = re.search(r'<div class="expander js-expander-body[^>]*>(.*?)</div>', detailed_html, re.DOTALL)
                if desc_match:
                    full_description = re.sub(r'<[^>]+>', '', desc_match.group(1)).strip()
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
                "full_description": full_description,
                "skills": skills,
                "status": "raw",
                "scraped_at": datetime.now().isoformat()
            })
            print(f"  [Workana] {title[:30]}...")
        except Exception as e:
            continue
    return projects

def fetch_99freelas():
    projects = []
    print("\nBuscando 99Freelas...")
    html = fetch_url(NINE_NINE_URL)
    if not html: return projects
    
    # Nova regex multi-linha para 99freelas
    matches = re.findall(r'<h1 class="title">\s*<a href="(/project/[^"]+)"[^>]*>([^<]+)</a>', html)
    
    for match in matches[:8]: # Pega as ultimas 8
        try:
            relative_link = match[0]
            # Replace HTML entities no title
            title = match[1].replace('&ccedil;', 'ç').replace('&atilde;', 'ã').replace('&iacute;', 'í').replace('&ecirc;', 'ê').replace('&otilde;', 'õ').strip()
            
            full_link = "https://www.99freelas.com.br" + relative_link
            
            detailed_html = fetch_url(full_link)
            full_description = ""
            skills = []
            reward_raw = "N/A"
            reward_min, reward_max = 0, 0
            
            if detailed_html:
                desc_match = re.search(r'<div class="text-keep-lines"(.*?)>(.*?)</div>', detailed_html, re.DOTALL)
                if desc_match:
                    full_description = re.sub(r'<[^>]+>', '', desc_match.group(2)).strip()
                
                skills_match = re.search(r'<p class="skills">Habilidades desejadas:(.*?)</p>', detailed_html, re.DOTALL)
                if skills_match:
                    skills_html = skills_match.group(1)
                    skills_list = re.findall(r'<a[^>]*>(.*?)</a>', skills_html)
                    skills = [s.strip() for s in skills_list]
                    
                reward_m = re.search(r'<b>Orçamento[a-zA-Z\s]*:</b>\s*(R\$[\s\d,\.]+ - R\$[\s\d,\.]+)', detailed_html)
                if reward_m:
                    reward_raw = reward_m.group(1).strip()
                    reward_min, reward_max = parse_reward(reward_raw)
            
            projects.append({
                "id": f"99f_{hash(title)}",
                "platform": "99Freelas",
                "title": title,
                "url": full_link,
                "rewardRaw": reward_raw,
                "rewardMin": reward_min,
                "rewardMax": reward_max,
                "full_description": full_description,
                "skills": skills,
                "status": "raw",
                "scraped_at": datetime.now().isoformat()
            })
            print(f"  [99Freelas] {title[:30]}...")
        except Exception as e:
            continue
            
    return projects

def run():
    print(f"Iniciando Varredura Multi-Plataforma (Revenue Scraper v3.1)...")
    setup()
    
    all_projects = []
    
    nine_projs = fetch_99freelas()
    all_projects.extend(nine_projs)
    
    workana_projs = fetch_workana()
    all_projects.extend(workana_projs)
    
    print(f"\nTotal: {len(all_projects)} oportunidades consolidadas.")
    
    if all_projects:
        with open(RAW_FILE, 'w') as f:
            json.dump(all_projects, f, indent=4, ensure_ascii=False)
        print(f"Salvo em: {RAW_FILE}")
    else:
        print("Falha ao coletar qualquer oportunidade.")

if __name__ == "__main__":
    run()

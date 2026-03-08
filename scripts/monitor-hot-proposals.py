#!/usr/bin/env python3
"""
🔥 HOT PROPOSALS MONITOR — Real-time Survival Mode Alerts
Monitora radar_opportunities.json e notifica quando score > 80 aparece.
Gera propostas formatadas em Markdown na raiz do projeto.
"""

import json
import os
import sys
import time
import hashlib
import subprocess
from pathlib import Path
from datetime import datetime

# Paths
REPO_ROOT = Path(__file__).parent.parent
OPPORTUNITIES_FILE = REPO_ROOT / "squads" / "nexus" / "data" / "radar_opportunities.json"
STATE_FILE = REPO_ROOT / ".aios" / "hot-proposals-state.json"
PROPOSALS_DIR = REPO_ROOT

# Ensure state directory exists
STATE_FILE.parent.mkdir(parents=True, exist_ok=True)


def load_state():
    """Load previously seen projects."""
    if STATE_FILE.exists():
        with open(STATE_FILE) as f:
            return json.load(f)
    return {"seen_projects": [], "last_check": None}


def save_state(state):
    """Save current state."""
    state["last_check"] = datetime.now().isoformat()
    with open(STATE_FILE, "w") as f:
        json.dump(state, f, indent=2)


def send_mac_notification(title, subtitle, message):
    """Send native Mac notification via osascript."""
    script = f"""
    display notification "{message}" \\
        with title "{title}" \\
        subtitle "{subtitle}"
    """
    try:
        subprocess.run(["osascript", "-e", script], check=True)
    except Exception as e:
        print(f"❌ Notification failed: {e}")


def generate_proposal_markdown(project):
    """Generate polished proposal in Markdown format."""
    proposal_id = project.get("id", "unknown")
    title = project.get("title", "Sem título")
    url = project.get("url", "")
    score = project.get("score", 0)
    reward_min = project.get("rewardMin", 0)
    reward_max = project.get("rewardMax", 0)
    effort_hours = project.get("effort_hours", 0)
    skills = ", ".join(project.get("skills", []))
    description = project.get("full_description", "")
    draft = project.get("proposal_draft", "")

    markdown = f"""# 🔥 PROPOSTA HOT — {title}

**ID:** `{proposal_id}`
**Score:** {score}/100 ⭐
**Valor:** USD {reward_min:,} - {reward_max:,}
**Esforço Estimado:** {effort_hours}h
**Skills:** {skills}
**Link:** [{url}]({url})

---

## 📋 Escopo do Projeto

{description}

---

## 💬 PROPOSTA PRONTA PARA COPIAR/COLAR

```
{draft}
```

---

## ✅ Ação Recomendada

1. Copie o texto acima (**PROPOSTA PRONTA**)
2. Acesse o link do projeto na Workana
3. Cole no campo de resposta
4. Envie!

**Gerado em:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
**Sistema:** age — Revenue Hunter Pipeline (Survival Mode)
"""
    return markdown


def process_hot_projects():
    """Main monitoring loop."""
    state = load_state()
    seen_projects = set(state.get("seen_projects", []))

    if not OPPORTUNITIES_FILE.exists():
        print(f"❌ File not found: {OPPORTUNITIES_FILE}")
        sys.exit(1)

    with open(OPPORTUNITIES_FILE) as f:
        opportunities = json.load(f)

    hot_projects = [p for p in opportunities if p.get("score", 0) > 80]

    if not hot_projects:
        print("✅ No HOT projects (score > 80) yet.")
        save_state(state)
        return

    print(f"\n🔥 FOUND {len(hot_projects)} HOT PROJECTS!\n")

    for project in hot_projects:
        project_id = project.get("id")
        score = project.get("score", 0)
        title = project.get("title", "")[:50]  # Truncate for notification
        reward_min = project.get("rewardMin", 0)
        reward_max = project.get("rewardMax", 0)

        if project_id not in seen_projects:
            # NEW HOT PROJECT DETECTED
            seen_projects.add(project_id)

            print(f"✨ NEW HOT PROJECT DETECTED:")
            print(f"   ID: {project_id}")
            print(f"   Title: {title}...")
            print(f"   Score: {score}/100")
            print(f"   Value: USD {reward_min:,} - {reward_max:,}\n")

            # Send Mac notification
            send_mac_notification(
                title="🔥 HOT PROJECT ALERT!",
                subtitle=f"Score: {score}/100",
                message=f"{title}... (USD {reward_min}-{reward_max})"
            )

            # Generate and save proposal markdown
            proposal_md = generate_proposal_markdown(project)
            proposal_file = PROPOSALS_DIR / f"PROPOSAL-{project_id}-HOT.md"
            with open(proposal_file, "w") as f:
                f.write(proposal_md)
            print(f"   📄 Proposta salva: {proposal_file.name}\n")

    state["seen_projects"] = list(seen_projects)
    save_state(state)
    print(f"✅ State saved. Monitoring {len(seen_projects)} HOT projects.")


def watch_mode(interval=30):
    """Watch mode: continuously monitor for new HOT projects."""
    print("👁️ WATCH MODE ACTIVE")
    print(f"Checking every {interval} seconds for HOT projects (score > 80)...\n")

    try:
        while True:
            process_hot_projects()
            time.sleep(interval)
    except KeyboardInterrupt:
        print("\n\n👋 Watch mode stopped.")


if __name__ == "__main__":
    if "--watch" in sys.argv:
        interval = int(sys.argv[2]) if len(sys.argv) > 2 else 30
        watch_mode(interval)
    else:
        process_hot_projects()

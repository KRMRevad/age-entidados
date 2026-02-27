#!/usr/bin/env python3

"""
🔗 Teste de Conectividade: Claude (Brain) → Alienware (Muscle)
Valida a conexão e testa a API do LLM antes de rodar o drafter completo.
"""

import os
import sys
import json
import urllib.request
import urllib.error

def get_config():
    """Obtém configuração do ambiente ou defaults."""
    alienware_ip = os.environ.get("ALIENWARE_IP", "100.66.114.87")
    llm_port = os.environ.get("LLM_PORT", "1234")
    return alienware_ip, llm_port

def test_connectivity(ip, port):
    """Testa se o servidor está acessível (ping simples)."""
    print(f"🔗 Testando conectividade com {ip}:{port}...")
    url = f"http://{ip}:{port}/v1/models"

    try:
        req = urllib.request.Request(url, method='GET')
        with urllib.request.urlopen(req, timeout=5) as response:
            print(f"✅ Servidor acessível!")
            return True
    except urllib.error.URLError as e:
        print(f"❌ Conexão recusada: {e.reason}")
        return False
    except Exception as e:
        print(f"❌ Erro: {e}")
        return False

def test_llm_health(ip, port):
    """Testa a saúde do LLM (lista modelos)."""
    print(f"\n🧠 Verificando saúde do LLM...")
    url = f"http://{ip}:{port}/v1/models"

    try:
        req = urllib.request.Request(url, method='GET')
        with urllib.request.urlopen(req, timeout=5) as response:
            data = json.loads(response.read().decode('utf-8'))
            models = data.get('data', [])
            if models:
                print(f"✅ Modelos disponíveis: {len(models)}")
                for model in models[:3]:
                    print(f"   - {model.get('id')}")
                return True
            else:
                print(f"⚠️  Nenhum modelo carregado no LM Studio/Ollama")
                return False
    except Exception as e:
        print(f"❌ Falha ao listar modelos: {e}")
        return False

def test_llm_inference(ip, port):
    """Testa a inferência com um prompt simples (JSON)."""
    print(f"\n🎯 Testando inferência (JSON response)...")
    url = f"http://{ip}:{port}/v1/chat/completions"

    prompt = """Responda com um JSON válido contendo:
    {
        "message": "Teste de conexão bem-sucedido!",
        "status": "ok"
    }
    RESPONDA APENAS COM JSON, NADA MAIS."""

    data = {
        "model": "gpt-oss:20b",
        "messages": [
            {"role": "system", "content": "You are a helpful assistant that outputs only raw, valid JSON."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.3,
        "max_tokens": 200
    }

    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(data).encode('utf-8'),
            headers={"Content-Type": "application/json"},
            method='POST'
        )
        with urllib.request.urlopen(req, timeout=60) as response:
            result = json.loads(response.read().decode('utf-8'))
            if "choices" in result and len(result["choices"]) > 0:
                content = result["choices"][0]["message"]["content"]
                content = content.replace("```json", "").replace("```", "").strip()
                try:
                    parsed = json.loads(content)
                    print(f"✅ Inferência bem-sucedida!")
                    print(f"   Response: {parsed}")
                    return True
                except json.JSONDecodeError:
                    print(f"⚠️  Response não é JSON válido: {content[:100]}")
                    return False
            else:
                print(f"❌ Resposta inesperada: {result}")
                return False
    except urllib.error.URLError as e:
        print(f"❌ Falha na requisição: {e.reason}")
        return False
    except Exception as e:
        print(f"❌ Erro: {e}")
        return False

def main():
    """Executa todos os testes."""
    print("=" * 60)
    print("🧠→💪 TESTE DE CONEXÃO: Brain-Muscle Integration")
    print("=" * 60)

    alienware_ip, llm_port = get_config()

    print(f"\n📍 Configuração:")
    print(f"   Alienware IP: {alienware_ip}")
    print(f"   LLM Port: {llm_port}")
    print()

    # Teste 1: Conectividade
    if not test_connectivity(alienware_ip, llm_port):
        print("\n❌ FALHA: Não consegue conectar ao Alienware")
        print("\n💡 Próximas ações:")
        print("   1. Verifique se o IP está correto:")
        print(f"      export ALIENWARE_IP=<IP_CORRETO>")
        print("   2. Garantir que LM Studio/Ollama está rodando")
        print("   3. Testar manualmente:")
        print(f"      curl http://{alienware_ip}:{llm_port}/v1/models")
        sys.exit(1)

    # Teste 2: Saúde do LLM
    if not test_llm_health(alienware_ip, llm_port):
        print("\n⚠️  AVISO: Não há modelos carregados")
        print("\n💡 Próximas ações:")
        print("   1. Abra LM Studio no Alienware")
        print("   2. Carregue um modelo (ex: Mistral 7B)")
        print("   3. Ative o servidor (porta 1234)")
        print("   4. Tente novamente")
        sys.exit(1)

    # Teste 3: Inferência
    if not test_llm_inference(alienware_ip, llm_port):
        print("\n⚠️  AVISO: Inferência falhou")
        print("\n💡 Possíveis causas:")
        print("   - Modelo carregado não está respondendo corretamente")
        print("   - Prompt muito complexo")
        print("   - Timeout na resposta (modelo lento?)")
        print("\n   Você ainda pode rodar o drafter, pode estar OK")
        response = input("Continuar mesmo assim? (s/n): ")
        if response.lower() != 's':
            sys.exit(1)

    # Todos os testes passaram
    print("\n" + "=" * 60)
    print("✅ TUDO OK! Brain-Muscle integration pronta!")
    print("=" * 60)
    print("\n🚀 Próximo passo:")
    print("   bash src/workers/run_revenue_pipeline.sh")
    print("\n💡 Ou rodar direto:")
    print("   python3 src/workers/proposal_drafter.py")

if __name__ == "__main__":
    main()

#!/bin/bash

##############################################################################
# start_cert_farmer.sh
#
# Quick-start para todo o eco-sistema do Auto-Cert Farmer
# Lança Chrome e Bot em paralelo com instruções claras
#
# Usage:
#   chmod +x start_cert_farmer.sh
#   ./start_cert_farmer.sh
#
##############################################################################

set -e

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║       🤖 Auto-Cert Farmer Bot — Quick Start Launcher 🤖       ║"
echo "║                                                               ║"
echo "║  Ecossistema: Chrome + Puppeteer + LLM (Alienware)            ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""

# Verifica se está no diretório correto
if [[ ! -f "src/workers/cert_farmer.js" ]]; then
  echo -e "${RED}✗ Erro: cert_farmer.js não encontrado${NC}"
  echo -e "${YELLOW}Execute este script da raiz do projeto:${NC}"
  echo "  cd /Users/kreligar3vad/Documents/Workspace/apps/Entidados\ AGE"
  echo "  ./start_cert_farmer.sh"
  exit 1
fi

# Verifica dependências
echo -e "${BLUE}Verificando dependências...${NC}"

if ! command -v node &> /dev/null; then
  echo -e "${RED}✗ Node.js não encontrado${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Node.js $(node --version)${NC}"

if ! npm list puppeteer-core > /dev/null 2>&1; then
  echo -e "${YELLOW}⚠ puppeteer-core não instalado. Instalando...${NC}"
  npm install
fi
echo -e "${GREEN}✓ puppeteer-core instalado${NC}"

# Verifica Chrome
CHROME_FOUND=false
if [[ -f "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" ]]; then
  CHROME_FOUND=true
elif [[ -f "/Applications/Chromium.app/Contents/MacOS/Chromium" ]]; then
  CHROME_FOUND=true
fi

if [[ "$CHROME_FOUND" == false ]]; then
  echo -e "${RED}✗ Chrome/Chromium não encontrado${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Chrome encontrado${NC}"

# Verifica LLM
echo -e "${BLUE}Testando conexão com LLM (100.66.114.87:1234)...${NC}"
if timeout 2 bash -c "echo >/dev/tcp/100.66.114.87/1234" 2>/dev/null; then
  echo -e "${GREEN}✓ LLM respondendo na porta 1234${NC}"
else
  echo -e "${YELLOW}⚠ LLM não está respondendo (fallback para aleatório)${NC}"
  echo -e "${YELLOW}  Certifique-se de que está rodando na Alienware${NC}"
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}INSTRUÇÕES:${NC}"
echo ""
echo -e "1. ${GREEN}Chrome será aberto em alguns segundos${NC}"
echo "   - Ele abrirá em um perfil isolado"
echo "   - Remote debugging ativo na porta 9222"
echo ""
echo -e "2. ${GREEN}Faça login manualmente${NC}"
echo "   - Acesse Workana.com"
echo "   - Faça login com sua conta"
echo "   - Resolva captchas/verificações (humano faz isso)"
echo ""
echo -e "3. ${GREEN}Abra um teste de certificação${NC}"
echo "   - Navegue para certificações"
echo "   - Clique em um teste disponível"
echo "   - Deixe a PRIMEIRA questão visível"
echo "   - ⚠️  NÃO passe para próxima questão ainda"
echo ""
echo -e "4. ${GREEN}Bot começará automaticamente${NC}"
echo "   - Quando Chrome estiver pronto, o bot iniciará"
echo "   - Verá os logs de cada pergunta resolvida"
echo "   - Teste será completado em segundos"
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

# Aguarda confirmação do usuário
echo -e "${YELLOW}Pressione ENTER para continuar...${NC}"
read -r

echo ""
echo -e "${BLUE}Iniciando Chrome + Bot...${NC}"
echo ""

# Lança Chrome em background
echo -e "${GREEN}[1/2] Lançando Chrome com remote debugging...${NC}"
./src/workers/launch_chrome.sh &
CHROME_PID=$!

# Aguarda Chrome estar pronto (testa conexão)
echo -e "${YELLOW}Aguardando Chrome estar pronto...${NC}"
MAX_WAIT=30
WAITED=0

while [[ $WAITED -lt $MAX_WAIT ]]; do
  if timeout 1 bash -c "echo >/dev/tcp/localhost/9222" 2>/dev/null; then
    echo -e "${GREEN}✓ Chrome pronto (remote debugging ativo)${NC}"
    break
  fi
  echo -n "."
  sleep 1
  ((WAITED++))
done

echo ""
echo ""

# Pequeno delay para usuário ver Chrome e fazer login
echo -e "${YELLOW}Aguardando 10 segundos para você fazer login...${NC}"
sleep 10

echo ""
echo -e "${GREEN}[2/2] Iniciando bot de certificação...${NC}"
echo ""

# Lança bot
node src/workers/cert_farmer.js

# Aguarda Chrome ser fechado
wait $CHROME_PID 2>/dev/null || true

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Sessão finalizada com sucesso!${NC}"
echo ""
echo -e "${YELLOW}Detalhes:${NC}"
echo "  - Verificação de certificação: PRONTA"
echo "  - Resultado será exibido acima"
echo "  - Próximos passos: Integração n8n"
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"

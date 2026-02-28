#!/bin/bash

##############################################################################
# launch_chrome.sh
#
# Utilitário para lançar Chrome com remote debugging ativo
# Necessário para que cert_farmer.js consiga se acoplar via porta 9222
#
# Usage:
#   chmod +x src/workers/launch_chrome.sh
#   ./src/workers/launch_chrome.sh [--profile <dir>] [--port 9222]
#
##############################################################################

set -e

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Config
CHROME_EXECUTABLE=""
DEBUG_PORT=9222
USER_PROFILE_DIR=""
WORKANA_URL="https://www.workana.com"

# Detecta SO
OS_TYPE=$(uname -s)

echo -e "${BLUE}=== Auto-Cert Farmer: Chrome Launcher ===${NC}\n"

# Detecta localização do Chrome por SO
if [[ "$OS_TYPE" == "Darwin" ]]; then
  # macOS
  CHROME_EXECUTABLE="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  if [[ ! -f "$CHROME_EXECUTABLE" ]]; then
    CHROME_EXECUTABLE="/Applications/Chromium.app/Contents/MacOS/Chromium"
  fi
  TEMP_DIR="/tmp"
elif [[ "$OS_TYPE" == "Linux" ]]; then
  # Linux
  CHROME_EXECUTABLE=$(which google-chrome || which chromium || echo "")
  TEMP_DIR="/tmp"
elif [[ "$OS_TYPE" == "MINGW64_NT" || "$OS_TYPE" == "CYGWIN_NT" ]]; then
  # Windows (WSL/Git Bash)
  CHROME_EXECUTABLE="C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
  TEMP_DIR="/tmp"
else
  echo -e "${RED}SO não suportado: $OS_TYPE${NC}"
  exit 1
fi

# Verifica se Chrome foi encontrado
if [[ -z "$CHROME_EXECUTABLE" ]] || [[ ! -f "$CHROME_EXECUTABLE" ]]; then
  echo -e "${RED}✗ Chrome não encontrado em: $CHROME_EXECUTABLE${NC}"
  echo -e "${YELLOW}Tente instalar Google Chrome ou definir a variável CHROME_BIN${NC}"
  exit 1
fi

echo -e "${GREEN}✓ Chrome encontrado: $CHROME_EXECUTABLE${NC}"

# Processa argumentos
while [[ $# -gt 0 ]]; do
  case $1 in
    --profile)
      USER_PROFILE_DIR="$2"
      shift 2
      ;;
    --port)
      DEBUG_PORT="$2"
      shift 2
      ;;
    --url)
      WORKANA_URL="$2"
      shift 2
      ;;
    --help)
      echo "Uso: ./launch_chrome.sh [opções]"
      echo ""
      echo "Opções:"
      echo "  --profile <dir>  Diretório de perfil do Chrome"
      echo "  --port <num>     Porta de debug (padrão: 9222)"
      echo "  --url <url>      URL para abrir (padrão: Workana)"
      echo "  --help           Mostrar este help"
      exit 0
      ;;
    *)
      echo "Opção desconhecida: $1"
      exit 1
      ;;
  esac
done

# Cria diretório de perfil temporário se não foi especificado
if [[ -z "$USER_PROFILE_DIR" ]]; then
  USER_PROFILE_DIR="$TEMP_DIR/chrome-cert-farmer-profile-$$"
  mkdir -p "$USER_PROFILE_DIR"
  echo -e "${GREEN}✓ Usando perfil temporário: $USER_PROFILE_DIR${NC}"
else
  mkdir -p "$USER_PROFILE_DIR"
  echo -e "${GREEN}✓ Usando perfil: $USER_PROFILE_DIR${NC}"
fi

echo ""
echo -e "${BLUE}Lançando Chrome com as seguintes configurações:${NC}"
echo "  Porta de Debug: $DEBUG_PORT"
echo "  Perfil: $USER_PROFILE_DIR"
echo "  URL: $WORKANA_URL"
echo ""

echo -e "${YELLOW}INSTRUÇÕES PARA O USUÁRIO:${NC}"
echo "1. Chrome será aberto em alguns segundos"
echo "2. Faça login na Workana manualmente se necessário"
echo "3. Resolva qualquer captcha ou verificação de segurança"
echo "4. Navegue até a página do teste de certificação"
echo "5. Abra a primeira questão do teste"
echo "6. Depois, em outro terminal, execute:"
echo -e "   ${GREEN}node src/workers/cert_farmer.js${NC}"
echo ""

# Pausa para o usuário ler as instruções
sleep 2

# Lança Chrome com remote debugging ativo
# Flags importantes:
# --remote-debugging-port: Permite conexão via WebSocket na porta 9222
# --user-data-dir: Usa um perfil isolado (não interfere com Chrome normal)
# --disable-sync: Desativa sincronização Google
# --disable-extensions: Desativa extensões (mais rápido)
# --disable-blink-features=AutomationControlled: Evita "headless" detection

echo -e "${BLUE}Iniciando Chrome...${NC}\n"

"$CHROME_EXECUTABLE" \
  --remote-debugging-port=$DEBUG_PORT \
  --user-data-dir="$USER_PROFILE_DIR" \
  --disable-sync \
  --disable-extensions \
  --disable-plugins \
  --disable-blink-features=AutomationControlled \
  --disable-dev-shm-usage \
  "$WORKANA_URL" &

CHROME_PID=$!

echo -e "${GREEN}✓ Chrome iniciado (PID: $CHROME_PID)${NC}"
echo -e "${GREEN}✓ Remote debugging ativo na porta $DEBUG_PORT${NC}"
echo ""
echo -e "${YELLOW}Para conectar o bot, execute em outro terminal:${NC}"
echo -e "  ${GREEN}node src/workers/cert_farmer.js${NC}"
echo ""
echo -e "${YELLOW}Para encerrar Chrome, pressione Ctrl+C ou feche a janela${NC}"
echo ""

# Aguarda que Chrome seja encerrado
wait $CHROME_PID

echo -e "${BLUE}Chrome foi encerrado${NC}"

# Limpa perfil temporário se for o caso
if [[ "$USER_PROFILE_DIR" == "$TEMP_DIR/chrome-cert-farmer-profile-"* ]]; then
  rm -rf "$USER_PROFILE_DIR"
  echo -e "${GREEN}✓ Perfil temporário removido${NC}"
fi

echo -e "${GREEN}✓ Launcher finalizado${NC}"

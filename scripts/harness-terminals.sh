#!/bin/bash
# Harness Engineering Multi-Terminal System
# Sets up 6 specialized tmux sessions for parallel agent workflows

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Initializing Harness Engineering Multi-Terminal System${NC}"

# Environment Setup - KIMI 2.5 Model Configuration
echo -e "${PURPLE}🤖 Model Configuration Setup${NC}"

# Check if .env file exists, if not create it
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}📝 Creating .env file for model configuration...${NC}"
    cat > .env << 'EOF'
# KIMI 2.5 Model Configuration (Novita AI)
NOVITA_API_KEY=your-novita-api-key-here
NOVITA_BASE_URL=https://api.novita.ai/v3/openai
KIMI_MODEL_ID=moonshot-ai/kimi-k2.5

# Claude Code Model Selection
CLAUDE_CODE_MODEL=kimi-2.5
CLAUDE_CODE_PROVIDER=novita

# Alternative Models (Optional)
ANTHROPIC_API_KEY=your-anthropic-key-here
OPENAI_API_KEY=your-openai-key-here
EOF
    echo -e "${GREEN}✅ Created .env file with model configuration${NC}"
    echo -e "${YELLOW}⚠️  Please update .env with your actual API keys${NC}"
else
    echo -e "${GREEN}✅ Found existing .env file${NC}"
fi

# Load environment variables
if [ -f ".env" ]; then
    export $(cat .env | grep -v '^#' | xargs)
    echo -e "${GREEN}✅ Environment variables loaded${NC}"
fi

# Display current model configuration
echo -e "${CYAN}📊 Current Model Configuration:${NC}"
echo "  KIMI Model: ${KIMI_MODEL_ID:-Not set}"
echo "  Novita URL: ${NOVITA_BASE_URL:-Not set}"
echo "  Claude Code Model: ${CLAUDE_CODE_MODEL:-Default}"
echo ""

# Check if tmux is installed
if ! command -v tmux &> /dev/null; then
    echo -e "${RED}❌ tmux is not installed. Please install tmux first.${NC}"
    exit 1
fi

# Kill existing sessions if they exist
echo -e "${YELLOW}🧹 Cleaning up existing sessions...${NC}"
tmux kill-session -t coordinator 2>/dev/null || true
tmux kill-session -t arch-guardian 2>/dev/null || true
tmux kill-session -t security 2>/dev/null || true
tmux kill-session -t data-guardian 2>/dev/null || true
tmux kill-session -t ui-experience 2>/dev/null || true
tmux kill-session -t integration 2>/dev/null || true

# Terminal 1: Master Coordinator
echo -e "${PURPLE}📋 Starting Terminal 1: Master Coordinator${NC}"
tmux new-session -d -s coordinator -c "$PROJECT_ROOT"
tmux send-keys -t coordinator 'clear' C-m
tmux send-keys -t coordinator 'echo "🎯 TERMINAL 1: Master Coordinator - Integration Orchestrator"' C-m
tmux send-keys -t coordinator 'echo "📚 Docs: docs/orchestration/master-coordinator.md"' C-m
tmux send-keys -t coordinator 'echo "🔧 Ready for: Task routing, conflict resolution, final integration"' C-m
tmux send-keys -t coordinator 'echo "💡 Model: $CLAUDE_CODE_MODEL ($CLAUDE_CODE_PROVIDER)"' C-m
tmux send-keys -t coordinator 'echo ""' C-m
tmux send-keys -t coordinator 'echo "# Start Claude Code with orchestrator context"' C-m
tmux send-keys -t coordinator 'echo "# claude-code --session orchestrator"' C-m

# Terminal 2: Architecture Guardian
echo -e "${BLUE}🏗️  Starting Terminal 2: Architecture Guardian${NC}"
tmux new-session -d -s arch-guardian -c "$PROJECT_ROOT"
tmux send-keys -t arch-guardian 'clear' C-m
tmux send-keys -t arch-guardian 'echo "🏗️  TERMINAL 2: Architecture Guardian - Architecture Enforcer"' C-m
tmux send-keys -t arch-guardian 'echo "📚 Docs: docs/agents/architecture-guardian.md"' C-m
tmux send-keys -t arch-guardian 'echo "🔧 Ready for: lib/ai/, patterns, factories, dependencies"' C-m
tmux send-keys -t arch-guardian 'echo ""' C-m
tmux send-keys -t arch-guardian 'echo "# claude-code --session arch-guardian"' C-m

# Terminal 3: Security Enforcer
echo -e "${RED}🛡️  Starting Terminal 3: Security Enforcer${NC}"
tmux new-session -d -s security -c "$PROJECT_ROOT"
tmux send-keys -t security 'clear' C-m
tmux send-keys -t security 'echo "🛡️  TERMINAL 3: Security Enforcer - Security Validator"' C-m
tmux send-keys -t security 'echo "📚 Docs: docs/agents/security-enforcer.md"' C-m
tmux send-keys -t security 'echo "🔧 Ready for: lib/auth/, encryption, rate limiting, CORS"' C-m
tmux send-keys -t security 'echo ""' C-m
tmux send-keys -t security 'echo "# claude-code --session security"' C-m

# Terminal 4: Data Guardian
echo -e "${GREEN}💾 Starting Terminal 4: Data Guardian${NC}"
tmux new-session -d -s data-guardian -c "$PROJECT_ROOT"
tmux send-keys -t data-guardian 'clear' C-m
tmux send-keys -t data-guardian 'echo "💾 TERMINAL 4: Data Guardian - Data Specialist"' C-m
tmux send-keys -t data-guardian 'echo "📚 Docs: docs/agents/data-guardian.md"' C-m
tmux send-keys -t data-guardian 'echo "🔧 Ready for: prisma/, lib/knowledge/, RAG, extraction"' C-m
tmux send-keys -t data-guardian 'echo ""' C-m
tmux send-keys -t data-guardian 'echo "# claude-code --session data-guardian"' C-m

# Terminal 5: UI Experience Agent
echo -e "${CYAN}🎨 Starting Terminal 5: UI Experience Agent${NC}"
tmux new-session -d -s ui-experience -c "$PROJECT_ROOT"
tmux send-keys -t ui-experience 'clear' C-m
tmux send-keys -t ui-experience 'echo "🎨 TERMINAL 5: UI Experience Agent - Frontend Specialist"' C-m
tmux send-keys -t ui-experience 'echo "📚 Docs: docs/agents/ui-experience-agent.md"' C-m
tmux send-keys -t ui-experience 'echo "🔧 Ready for: components/, app/, UI/UX, add-ins"' C-m
tmux send-keys -t ui-experience 'echo ""' C-m
tmux send-keys -t ui-experience 'echo "# claude-code --session ui-experience"' C-m

# Terminal 6: Integration Validator
echo -e "${YELLOW}✅ Starting Terminal 6: Integration Validator${NC}"
tmux new-session -d -s integration -c "$PROJECT_ROOT"
tmux send-keys -t integration 'clear' C-m
tmux send-keys -t integration 'echo "✅ TERMINAL 6: Integration Validator - QA Specialist"' C-m
tmux send-keys -t integration 'echo "📚 Docs: docs/agents/integration-validator.md"' C-m
tmux send-keys -t integration 'echo "🔧 Ready for: tests, build validation, observability"' C-m
tmux send-keys -t integration 'echo ""' C-m
tmux send-keys -t integration 'echo "# claude-code --session integration"' C-m

echo -e "${GREEN}✅ All terminals initialized!${NC}"
echo ""
echo -e "${BLUE}🎮 Quick Terminal Access:${NC}"
echo "  t1 / tmux attach -t coordinator     - Master Coordinator"
echo "  t2 / tmux attach -t arch-guardian   - Architecture Guardian"
echo "  t3 / tmux attach -t security        - Security Enforcer"
echo "  t4 / tmux attach -t data-guardian   - Data Guardian"
echo "  t5 / tmux attach -t ui-experience   - UI Experience Agent"
echo "  t6 / tmux attach -t integration     - Integration Validator"
echo ""
echo -e "${PURPLE}📋 Master Coordinator Commands:${NC}"
echo "  /spawn-parallel --workflows 4 --coordination-mode tmux"
echo "  /assign-task --terminal [2-6] --domain [arch|security|data|ui|integration]"
echo "  /resolve-conflicts --cross-terminal --integration-gate"
echo ""
echo -e "${CYAN}🚀 Starting master coordinator...${NC}"
tmux attach -t coordinator
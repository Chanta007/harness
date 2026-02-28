#!/bin/bash
# Harness Engineering Multi-Terminal System - Split Window Version
# Sets up 1 tmux session with 8 split panes for parallel agent workflows

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

echo -e "${BLUE}🚀 Initializing Harness Engineering 8-Split Terminal System${NC}"

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

# Kill existing session if it exists
echo -e "${YELLOW}🧹 Cleaning up existing harness session...${NC}"
tmux kill-session -t harness 2>/dev/null || true

echo -e "${PURPLE}🔧 Creating 4-pane split terminal layout...${NC}"

# Create main session
tmux new-session -d -s harness -c "$PROJECT_ROOT"

# Split into 4 panes (2x2 grid)
tmux split-window -h -t harness:0
tmux split-window -v -t harness:0.0
tmux split-window -v -t harness:0.1

# Adjust pane layout to be even
tmux select-layout -t harness tiled

# Setup Terminal 1: Master Coordinator (pane 0)
echo -e "${PURPLE}📋 Setting up Pane 1: Master Coordinator${NC}"
tmux send-keys -t harness:0.0 'clear' C-m
tmux send-keys -t harness:0.0 'echo "🎯 T1: Master Coordinator"' C-m
tmux send-keys -t harness:0.0 'echo "📚 docs/orchestration/"' C-m
tmux send-keys -t harness:0.0 'echo "# claude-code --session coordinator"' C-m

# Setup Terminal 2: Architecture Guardian (pane 1)
echo -e "${BLUE}🏗️  Setting up Pane 2: Architecture Guardian${NC}"
tmux send-keys -t harness:0.1 'clear' C-m
tmux send-keys -t harness:0.1 'echo "🏗️ T2: Architecture Guardian"' C-m
tmux send-keys -t harness:0.1 'echo "📚 docs/agents/architecture-guardian.md"' C-m
tmux send-keys -t harness:0.1 'echo "# claude-code --session arch-guardian"' C-m

# Setup Terminal 3: Security Enforcer (pane 2)
echo -e "${RED}🛡️  Setting up Pane 3: Security Enforcer${NC}"
tmux send-keys -t harness:0.2 'clear' C-m
tmux send-keys -t harness:0.2 'echo "🛡️ T3: Security Enforcer"' C-m
tmux send-keys -t harness:0.2 'echo "📚 docs/agents/security-enforcer.md"' C-m
tmux send-keys -t harness:0.2 'echo "# claude-code --session security"' C-m

# Setup Terminal 4: Data Guardian (pane 3)
echo -e "${GREEN}💾 Setting up Pane 4: Data Guardian${NC}"
tmux send-keys -t harness:0.3 'clear' C-m
tmux send-keys -t harness:0.3 'echo "💾 T4: Data Guardian"' C-m
tmux send-keys -t harness:0.3 'echo "📚 docs/agents/data-guardian.md"' C-m
tmux send-keys -t harness:0.3 'echo "# claude-code --session data-guardian"' C-m

# Create second window for terminals 5-8
echo -e "${PURPLE}🔧 Creating second window for terminals 5-8...${NC}"
tmux new-window -t harness -n "terminals-5-8"

# Split into 4 panes for second set
tmux split-window -h -t harness:1
tmux split-window -v -t harness:1.0
tmux split-window -v -t harness:1.1
tmux select-layout -t harness:1 tiled

# Setup Terminal 5: UI Experience Agent (window 1, pane 0)
echo -e "${CYAN}🎨 Setting up Pane 5: UI Experience Agent${NC}"
tmux send-keys -t harness:1.0 'clear' C-m
tmux send-keys -t harness:1.0 'echo "🎨 T5: UI Experience Agent"' C-m
tmux send-keys -t harness:1.0 'echo "📚 docs/agents/ui-experience-agent.md"' C-m
tmux send-keys -t harness:1.0 'echo "# claude-code --session ui-experience"' C-m

# Setup Terminal 6: Integration Validator (window 1, pane 1)
echo -e "${YELLOW}✅ Setting up Pane 6: Integration Validator${NC}"
tmux send-keys -t harness:1.1 'clear' C-m
tmux send-keys -t harness:1.1 'echo "✅ T6: Integration Validator"' C-m
tmux send-keys -t harness:1.1 'echo "📚 docs/agents/integration-validator.md"' C-m
tmux send-keys -t harness:1.1 'echo "# claude-code --session integration"' C-m

# Setup Terminal 7: TDD Testing Specialist (window 1, pane 2)
echo -e "${PURPLE}🔴 Setting up Pane 7: TDD Testing Specialist${NC}"
tmux send-keys -t harness:1.2 'clear' C-m
tmux send-keys -t harness:1.2 'echo "🔴 T7: TDD Testing Specialist"' C-m
tmux send-keys -t harness:1.2 'echo "📚 docs/agents/tdd-testing-specialist.md"' C-m
tmux send-keys -t harness:1.2 'echo "# claude-code --session tdd-specialist"' C-m

# Setup Terminal 8: Build Deploy Validator (window 1, pane 3)
echo -e "${BLUE}📦 Setting up Pane 8: Build Deploy Validator${NC}"
tmux send-keys -t harness:1.3 'clear' C-m
tmux send-keys -t harness:1.3 'echo "📦 T8: Build Deploy Validator"' C-m
tmux send-keys -t harness:1.3 'echo "📚 docs/agents/build-deploy-validator.md"' C-m
tmux send-keys -t harness:1.3 'echo "# claude-code --session build-deploy"' C-m

# Go back to first window
tmux select-window -t harness:0


# Select the first pane
tmux select-pane -t harness:0.0

echo -e "${GREEN}✅ 8-terminal split layout initialized!${NC}"
echo ""
echo -e "${BLUE}🎮 Access the Split Terminal System:${NC}"
echo "  tmux attach -t harness         - Attach to split terminal session"
echo "  tmux kill-session -t harness   - Close the session"
echo ""
echo -e "${PURPLE}🎯 Navigation within tmux:${NC}"
echo "  Ctrl+B + Arrow Keys  - Navigate between panes"
echo "  Ctrl+B + q           - Show pane numbers"
echo "  Ctrl+B + z           - Zoom/unzoom current pane"
echo ""
echo -e "${RED}🚪 Exit Commands:${NC}"
echo "  Ctrl+B + d           - Detach (keeps session running)"
echo "  exit (in any pane)    - Close that terminal"
echo "  tmux kill-session -t harness     - Completely close all terminals"
echo "  tmux kill-server      - Nuclear option (kills ALL tmux sessions)"
echo ""
echo -e "${CYAN}🔄 Switch Between Terminal Groups:${NC}"
echo "  Ctrl+B + 0           - Switch to Terminals 1-4 (Master, Arch, Security, Data)"
echo "  Ctrl+B + 1           - Switch to Terminals 5-8 (UI, Integration, TDD, Build)"
echo "  Ctrl+B + n           - Next window"
echo "  Ctrl+B + p           - Previous window"
echo ""
echo -e "${CYAN}📊 Current Model: ${KIMI_MODEL_ID} via ${CLAUDE_CODE_PROVIDER}${NC}"
echo ""
echo -e "${YELLOW}🚀 Ready! Run: tmux attach -t harness${NC}"
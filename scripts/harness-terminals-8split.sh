#!/bin/bash
# Harness Engineering Multi-Terminal System - All 8 Panes Version
# Creates 1 tmux session with all 8 terminals visible at once

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

echo -e "${BLUE}🚀 Initializing Harness Engineering 8-Pane Terminal Grid${NC}"

# Environment Setup - KIMI 2.5 Model Configuration
echo -e "${PURPLE}🤖 Model Configuration Setup${NC}"

# Load environment variables
if [ -f ".env" ]; then
    export $(cat .env | grep -v '^#' | xargs)
    echo -e "${GREEN}✅ Environment variables loaded${NC}"
fi

# Display current model configuration
echo -e "${CYAN}📊 Current Model: ${KIMI_MODEL_ID:-moonshot-ai/kimi-k2.5}${NC}"
echo ""

# Check if tmux is installed
if ! command -v tmux &> /dev/null; then
    echo -e "${RED}❌ tmux is not installed. Please install tmux first.${NC}"
    exit 1
fi

# Kill existing session if it exists
echo -e "${YELLOW}🧹 Cleaning up existing harness session...${NC}"
tmux kill-session -t harness-8 2>/dev/null || true

echo -e "${PURPLE}🔧 Creating 8-pane grid layout (2 rows x 4 columns)...${NC}"

# Create main session with larger default size
tmux new-session -d -s harness-8 -c "$PROJECT_ROOT"

# Create 2x4 grid layout
echo -e "${CYAN}📐 Building terminal grid...${NC}"

# First create 4 horizontal splits (top row)
tmux split-window -h -t harness-8:0.0  # Creates pane 1
tmux split-window -h -t harness-8:0.0  # Creates pane 2 (splits pane 0)
tmux split-window -h -t harness-8:0.1  # Creates pane 3 (splits pane 1)

# Now create bottom row by splitting each top pane vertically
tmux split-window -v -t harness-8:0.0  # Creates pane 4 (below pane 0)
tmux split-window -v -t harness-8:0.1  # Creates pane 5 (below pane 1)
tmux split-window -v -t harness-8:0.2  # Creates pane 6 (below pane 2)
tmux split-window -v -t harness-8:0.3  # Creates pane 7 (below pane 3)

# Adjust to tiled layout for better distribution
tmux select-layout -t harness-8 tiled

echo -e "${GREEN}🎯 Setting up all 8 terminals...${NC}"

# Setup Terminal 1: Master Coordinator (pane 0 - top left)
tmux send-keys -t harness-8:0.0 'clear' C-m
tmux send-keys -t harness-8:0.0 'echo "🎯 T1: Master Coordinator"' C-m
tmux send-keys -t harness-8:0.0 'echo "Task routing & orchestration"' C-m

# Setup Terminal 2: Architecture Guardian (pane 1 - top middle-left)
tmux send-keys -t harness-8:0.1 'clear' C-m
tmux send-keys -t harness-8:0.1 'echo "🏗️ T2: Architecture Guardian"' C-m
tmux send-keys -t harness-8:0.1 'echo "Patterns & dependencies"' C-m

# Setup Terminal 3: Security Enforcer (pane 2 - top middle-right)
tmux send-keys -t harness-8:0.2 'clear' C-m
tmux send-keys -t harness-8:0.2 'echo "🛡️ T3: Security Enforcer"' C-m
tmux send-keys -t harness-8:0.2 'echo "Auth & encryption"' C-m

# Setup Terminal 4: Data Guardian (pane 3 - top right)
tmux send-keys -t harness-8:0.3 'clear' C-m
tmux send-keys -t harness-8:0.3 'echo "💾 T4: Data Guardian"' C-m
tmux send-keys -t harness-8:0.3 'echo "Database & RAG"' C-m

# Setup Terminal 5: UI Experience Agent (pane 4 - bottom left)
tmux send-keys -t harness-8:0.4 'clear' C-m
tmux send-keys -t harness-8:0.4 'echo "🎨 T5: UI Experience"' C-m
tmux send-keys -t harness-8:0.4 'echo "Components & UX"' C-m

# Setup Terminal 6: Integration Validator (pane 5 - bottom middle-left)
tmux send-keys -t harness-8:0.5 'clear' C-m
tmux send-keys -t harness-8:0.5 'echo "✅ T6: Integration"' C-m
tmux send-keys -t harness-8:0.5 'echo "Testing & validation"' C-m

# Setup Terminal 7: TDD Testing Specialist (pane 6 - bottom middle-right)
tmux send-keys -t harness-8:0.6 'clear' C-m
tmux send-keys -t harness-8:0.6 'echo "🔴 T7: TDD Specialist"' C-m
tmux send-keys -t harness-8:0.6 'echo "RED-GREEN-REFACTOR"' C-m

# Setup Terminal 8: Build Deploy Validator (pane 7 - bottom right)
tmux send-keys -t harness-8:0.7 'clear' C-m
tmux send-keys -t harness-8:0.7 'echo "📦 T8: Build Deploy"' C-m
tmux send-keys -t harness-8:0.7 'echo "Build & deployment"' C-m

# Add command hints to each pane
sleep 1
tmux send-keys -t harness-8:0.0 'echo "# claude-code --session coordinator"' C-m
tmux send-keys -t harness-8:0.1 'echo "# claude-code --session arch-guardian"' C-m
tmux send-keys -t harness-8:0.2 'echo "# claude-code --session security"' C-m
tmux send-keys -t harness-8:0.3 'echo "# claude-code --session data-guardian"' C-m
tmux send-keys -t harness-8:0.4 'echo "# claude-code --session ui-experience"' C-m
tmux send-keys -t harness-8:0.5 'echo "# claude-code --session integration"' C-m
tmux send-keys -t harness-8:0.6 'echo "# claude-code --session tdd-specialist"' C-m
tmux send-keys -t harness-8:0.7 'echo "# claude-code --session build-deploy"' C-m

# Select the first pane (Master Coordinator)
tmux select-pane -t harness-8:0.0

echo -e "${GREEN}✅ All 8 terminals visible in grid layout!${NC}"
echo ""
echo -e "${BLUE}🎮 Access the 8-Terminal Grid:${NC}"
echo "  tmux attach -t harness-8        - Attach to 8-pane grid"
echo "  tmux kill-session -t harness-8  - Close the session"
echo ""
echo -e "${PURPLE}🎯 Navigation within 8-pane grid:${NC}"
echo "  Ctrl+B + Arrow Keys   - Navigate between panes"
echo "  Ctrl+B + q            - Show pane numbers (0-7)"
echo "  Ctrl+B + z            - Zoom/unzoom current pane (for focus)"
echo "  Ctrl+B + {            - Move current pane left"
echo "  Ctrl+B + }            - Move current pane right"
echo "  Ctrl+B + Space        - Cycle through layouts"
echo ""
echo -e "${RED}🚪 Exit Commands:${NC}"
echo "  Ctrl+B + d            - Detach (keeps session running)"
echo "  exit (in any pane)     - Close that terminal"
echo "  tmux kill-session -t harness-8  - Completely close all terminals"
echo "  tmux kill-server       - Nuclear option (kills ALL tmux sessions)"
echo ""
echo -e "${CYAN}🔄 Grid Layout:${NC}"
echo "  ┌─────────────┬─────────────┬─────────────┬─────────────┐"
echo "  │ T1: Master  │ T2: Arch    │ T3: Security│ T4: Data    │"
echo "  │ Coordinator │ Guardian    │ Enforcer    │ Guardian    │"
echo "  ├─────────────┼─────────────┼─────────────┼─────────────┤"
echo "  │ T5: UI      │ T6: Integr. │ T7: TDD     │ T8: Build   │"
echo "  │ Experience  │ Validator   │ Specialist  │ Deploy      │"
echo "  └─────────────┴─────────────┴─────────────┴─────────────┘"
echo ""
echo -e "${YELLOW}💡 Tip: Use Ctrl+B + z to zoom into any pane for full-screen work!${NC}"
echo ""
echo -e "${CYAN}📊 Model: ${KIMI_MODEL_ID:-moonshot-ai/kimi-k2.5}${NC}"
echo ""
echo -e "${YELLOW}🚀 Ready! Run: tmux attach -t harness-8${NC}"
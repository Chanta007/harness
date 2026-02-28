#!/bin/bash
# Harness Engineering v3: 8-Terminal Hyper-Focused System
# Sets up 8 specialized tmux sessions for TDD-driven parallel agent workflows

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
ORANGE='\033[0;33m'
PINK='\033[1;35m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Initializing Harness Engineering v3: 8-Terminal TDD System${NC}"

# Check if tmux is installed
if ! command -v tmux &> /dev/null; then
    echo -e "${RED}❌ tmux is not installed. Please install tmux first.${NC}"
    exit 1
fi

# Kill existing sessions if they exist
echo -e "${YELLOW}🧹 Cleaning up existing sessions...${NC}"
tmux kill-session -t coordinator 2>/dev/null || true
tmux kill-session -t arch-enforcer 2>/dev/null || true
tmux kill-session -t security-guardian 2>/dev/null || true
tmux kill-session -t data-schema 2>/dev/null || true
tmux kill-session -t knowledge-search 2>/dev/null || true
tmux kill-session -t component-engineer 2>/dev/null || true
tmux kill-session -t tdd-specialist 2>/dev/null || true
tmux kill-session -t build-deploy 2>/dev/null || true

# Terminal 1: Master Coordinator
echo -e "${PURPLE}📋 Starting Terminal 1: Master Coordinator${NC}"
tmux new-session -d -s coordinator -c "$PROJECT_ROOT"
tmux send-keys -t coordinator "echo '🎯 TERMINAL 1: Master Coordinator - Task Routing & TDD Orchestration'" Enter
tmux send-keys -t coordinator "echo '📚 Docs: docs/harness-v2/orchestration/master-coordinator.md'" Enter
tmux send-keys -t coordinator "echo '🔧 Ready for: Task routing, TDD cycle coordination, conflict resolution'" Enter
tmux send-keys -t coordinator "echo '🔄 TDD Mode: Routes RED→GREEN→REFACTOR across T2-T6, T8'" Enter
tmux send-keys -t coordinator "echo ''" Enter
tmux send-keys -t coordinator "# Start Claude Code with orchestrator context" Enter
tmux send-keys -t coordinator "# claude-code --session coordinator --agent master-orchestrator --docs docs/harness-v2/orchestration/" C-m

# Terminal 2: Architecture Enforcer
echo -e "${BLUE}🏗️  Starting Terminal 2: Architecture Enforcer${NC}"
tmux new-session -d -s arch-enforcer -c "$PROJECT_ROOT"
tmux send-keys -t arch-enforcer "echo '🏗️  TERMINAL 2: Architecture Enforcer - Patterns & Boundaries ONLY'" Enter
tmux send-keys -t arch-enforcer "echo '📚 Docs: docs/harness-v2/agents/architecture-enforcer.md'" Enter
tmux send-keys -t arch-enforcer "echo '🔧 Focus: lib/ai/factories, plugin registry, dependency layers'" Enter
tmux send-keys -t arch-enforcer "echo '❌ Excludes: Components (→T6), Database (→T4), Security (→T3)'" Enter
tmux send-keys -t arch-enforcer "echo ''" Enter
tmux send-keys -t arch-enforcer "# Start Claude Code with architecture context" Enter
tmux send-keys -t arch-enforcer "# claude-code --session arch-enforcer --agent architecture-enforcer --docs docs/harness-v2/agents/" C-m

# Terminal 3: Security Guardian
echo -e "${RED}🛡️  Starting Terminal 3: Security Guardian${NC}"
tmux new-session -d -s security-guardian -c "$PROJECT_ROOT"
tmux send-keys -t security-guardian "echo '🛡️  TERMINAL 3: Security Guardian - Auth & Encryption ONLY'" Enter
tmux send-keys -t security-guardian "echo '📚 Docs: docs/harness-v2/agents/security-guardian.md'" Enter
tmux send-keys -t security-guardian "echo '🔧 Focus: AuthGateway, encryption, security vulnerabilities'" Enter
tmux send-keys -t security-guardian "echo '❌ Excludes: Component security (→T6), DB security (→T4)'" Enter
tmux send-keys -t security-guardian "echo ''" Enter
tmux send-keys -t security-guardian "# Start Claude Code with security context" Enter
tmux send-keys -t security-guardian "# claude-code --session security-guardian --agent security-guardian --docs docs/harness-v2/agents/" C-m

# Terminal 4: Data Schema Specialist
echo -e "${GREEN}💾 Starting Terminal 4: Data Schema Specialist${NC}"
tmux new-session -d -s data-schema -c "$PROJECT_ROOT"
tmux send-keys -t data-schema "echo '💾 TERMINAL 4: Data Schema Specialist - Database Schema ONLY'" Enter
tmux send-keys -t data-schema "echo '📚 Docs: docs/harness-v2/agents/data-schema-specialist.md'" Enter
tmux send-keys -t data-schema "echo '🔧 Focus: Prisma schema, migrations, SQL performance'" Enter
tmux send-keys -t data-schema "echo '❌ Excludes: RAG/Search (→T5), Component data (→T6), Test data (→T7)'" Enter
tmux send-keys -t data-schema "echo ''" Enter
tmux send-keys -t data-schema "# Start Claude Code with database schema context" Enter
tmux send-keys -t data-schema "# claude-code --session data-schema --agent data-schema-specialist --docs docs/harness-v2/agents/" C-m

# Terminal 5: Knowledge & Search Agent
echo -e "${ORANGE}🔍 Starting Terminal 5: Knowledge & Search Agent${NC}"
tmux new-session -d -s knowledge-search -c "$PROJECT_ROOT"
tmux send-keys -t knowledge-search "echo '🔍 TERMINAL 5: Knowledge & Search Agent - RAG & Embeddings ONLY'" Enter
tmux send-keys -t knowledge-search "echo '📚 Docs: docs/harness-v2/agents/knowledge-search-agent.md'" Enter
tmux send-keys -t knowledge-search "echo '🔧 Focus: FastEmbed, vector search, knowledge base, RAG pipeline'" Enter
tmux send-keys -t knowledge-search "echo '❌ Excludes: Database schema (→T4), Search UI (→T6), Search tests (→T7)'" Enter
tmux send-keys -t knowledge-search "echo ''" Enter
tmux send-keys -t knowledge-search "# Start Claude Code with RAG/search context" Enter
tmux send-keys -t knowledge-search "# claude-code --session knowledge-search --agent knowledge-search-agent --docs docs/harness-v2/agents/" C-m

# Terminal 6: Component Engineer
echo -e "${CYAN}🎨 Starting Terminal 6: Component Engineer${NC}"
tmux new-session -d -s component-engineer -c "$PROJECT_ROOT"
tmux send-keys -t component-engineer "echo '🎨 TERMINAL 6: Component Engineer - React Components ONLY'" Enter
tmux send-keys -t component-engineer "echo '📚 Docs: docs/harness-v2/agents/component-engineer.md'" Enter
tmux send-keys -t component-engineer "echo '🔧 Focus: Server/Client boundaries, shadcn/ui, responsive design'" Enter
tmux send-keys -t component-engineer "echo '❌ Excludes: Component testing (→T7), Build optimization (→T8)'" Enter
tmux send-keys -t component-engineer "echo ''" Enter
tmux send-keys -t component-engineer "# Start Claude Code with component context" Enter
tmux send-keys -t component-engineer "# claude-code --session component-engineer --agent component-engineer --docs docs/harness-v2/agents/" C-m

# Terminal 7: TDD & Testing Specialist ⭐ NEW
echo -e "${PINK}🔴 Starting Terminal 7: TDD & Testing Specialist ⭐ NEW${NC}"
tmux new-session -d -s tdd-specialist -c "$PROJECT_ROOT"
tmux send-keys -t tdd-specialist "echo '🔴 TERMINAL 7: TDD & Testing Specialist - RED-GREEN-REFACTOR CYCLES'" Enter
tmux send-keys -t tdd-specialist "echo '📚 Docs: docs/harness-v2/agents/tdd-testing-specialist.md'" Enter
tmux send-keys -t tdd-specialist "echo '🔧 Focus: Write failing tests FIRST, validate implementations, guide refactoring'" Enter
tmux send-keys -t tdd-specialist "echo '🔄 Workflow: RED (2-5min) → GREEN (5-15min) → REFACTOR (5-10min)'" Enter
tmux send-keys -t tdd-specialist "echo '🎯 Coordinates: T2-T6,T8 for implementation, maintains test integrity'" Enter
tmux send-keys -t tdd-specialist "echo ''" Enter
tmux send-keys -t tdd-specialist "# Start Claude Code with TDD context" Enter
tmux send-keys -t tdd-specialist "# claude-code --session tdd-specialist --agent tdd-testing-specialist --docs docs/harness-v2/agents/" C-m

# Terminal 8: Build & Deploy Validator
echo -e "${YELLOW}📦 Starting Terminal 8: Build & Deploy Validator${NC}"
tmux new-session -d -s build-deploy -c "$PROJECT_ROOT"
tmux send-keys -t build-deploy "echo '📦 TERMINAL 8: Build & Deploy Validator - Build & Deployment ONLY'" Enter
tmux send-keys -t build-deploy "echo '📚 Docs: docs/harness-v2/agents/build-deploy-validator.md'" Enter
tmux send-keys -t build-deploy "echo '🔧 Focus: TypeScript compilation, production builds, CI/CD, deployment'" Enter
tmux send-keys -t build-deploy "echo '❌ Excludes: Unit testing (→T7), Component testing (→T7)'" Enter
tmux send-keys -t build-deploy "echo ''" Enter
tmux send-keys -t build-deploy "# Start Claude Code with build/deploy context" Enter
tmux send-keys -t build-deploy "# claude-code --session build-deploy --agent build-deploy-validator --docs docs/harness-v2/agents/" C-m

echo -e "${GREEN}✅ All 8 terminals initialized with hyper-focused responsibilities!${NC}"
echo ""
echo -e "${BLUE}🎮 Quick Terminal Access (8-Terminal System):${NC}"
echo "  t1 / tmux attach -t coordinator        - Master Coordinator (Task Routing & TDD Orchestration)"
echo "  t2 / tmux attach -t arch-enforcer      - Architecture Enforcer (Patterns & Boundaries)"
echo "  t3 / tmux attach -t security-guardian  - Security Guardian (Auth & Encryption)"
echo "  t4 / tmux attach -t data-schema        - Data Schema Specialist (Database Schema)"
echo "  t5 / tmux attach -t knowledge-search   - Knowledge & Search Agent (RAG & Embeddings)"
echo "  t6 / tmux attach -t component-engineer - Component Engineer (React Components)"
echo "  t7 / tmux attach -t tdd-specialist     - TDD & Testing Specialist ⭐ (RED-GREEN-REFACTOR)"
echo "  t8 / tmux attach -t build-deploy       - Build & Deploy Validator (Build & Deployment)"
echo ""
echo -e "${PINK}🔄 TDD Workflow Examples:${NC}"
echo "  T7 writes failing test → T1 routes to implementation terminal (T2-T6,T8)"
echo "  Implementation terminal writes minimal code → T7 validates GREEN"
echo "  T7 + implementation terminal collaborate on REFACTOR → Next cycle"
echo ""
echo -e "${PURPLE}📋 Master Coordinator TDD Commands:${NC}"
echo "  /tdd-cycle --requirement \"Add LLM provider\" --route T2 --validate T7"
echo "  /route-implementation --test-file \"llm-factory.test.ts\" --terminal T2"
echo "  /validate-green --test-name \"should create connection\" --terminal T7"
echo "  /coordinate-refactor --terminals \"T2,T7\" --maintain-green"
echo ""
echo -e "${ORANGE}🎯 Hyper-Focused Benefits:${NC}"
echo "  • Cognitive Load: 50-100 lines per agent (vs 150+ lines before)"
echo "  • Decision Speed: Single-focus domains enable faster decisions"
echo "  • TDD Integration: Dedicated T7 for test-first development"
echo "  • Parallel Efficiency: 8 agents can work simultaneously with clear boundaries"
echo ""
echo -e "${CYAN}🚀 Starting master coordinator with TDD orchestration...${NC}"
tmux attach -t coordinator
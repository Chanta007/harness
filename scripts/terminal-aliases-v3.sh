#!/bin/bash
# Terminal aliases for Harness Engineering v3: 8-Terminal TDD System
# Source this file in your shell: source scripts/terminal-aliases-v3.sh

# Terminal access aliases (8-terminal system)
alias t1='tmux attach -t coordinator'
alias t2='tmux attach -t arch-enforcer'
alias t3='tmux attach -t security-guardian'
alias t4='tmux attach -t data-schema'
alias t5='tmux attach -t knowledge-search'
alias t6='tmux attach -t component-engineer'
alias t7='tmux attach -t tdd-specialist'
alias t8='tmux attach -t build-deploy'

# Terminal descriptions for quick reference
alias thelp='echo "🎯 Harness v3: 8-Terminal TDD System:
  t1: Master Coordinator (Task Routing & TDD Orchestration)
  t2: Architecture Enforcer (Patterns & Boundaries ONLY)
  t3: Security Guardian (Auth & Encryption ONLY)
  t4: Data Schema Specialist (Database Schema ONLY)
  t5: Knowledge & Search Agent (RAG & Embeddings ONLY)
  t6: Component Engineer (React Components ONLY)
  t7: TDD & Testing Specialist ⭐ (RED-GREEN-REFACTOR CYCLES)
  t8: Build & Deploy Validator (Build & Deployment ONLY)"'

# Multi-terminal management
alias tlist='tmux list-sessions | grep -E "(coordinator|arch-enforcer|security-guardian|data-schema|knowledge-search|component-engineer|tdd-specialist|build-deploy)"'
alias tkill='tmux kill-session -t coordinator 2>/dev/null; tmux kill-session -t arch-enforcer 2>/dev/null; tmux kill-session -t security-guardian 2>/dev/null; tmux kill-session -t data-schema 2>/dev/null; tmux kill-session -t knowledge-search 2>/dev/null; tmux kill-session -t component-engineer 2>/dev/null; tmux kill-session -t tdd-specialist 2>/dev/null; tmux kill-session -t build-deploy 2>/dev/null; echo "🧹 All v3 terminals killed"'
alias trestart='./scripts/harness-terminals-v3.sh'

# TDD-specific aliases
alias tdd='tmux attach -t tdd-specialist'
alias tdd-red='echo "🔴 RED Phase: Write failing test (2-5 min) → Signal T1 for implementation routing"'
alias tdd-green='echo "🟢 GREEN Phase: Validate implementation passes test (5-15 min) → Block over-engineering"'
alias tdd-refactor='echo "🔄 REFACTOR Phase: Collaborate on code cleanup while maintaining green (5-10 min)"'

# Quick status check
alias tstatus='echo "🎯 Harness v3: 8-Terminal TDD System Status:"; tmux list-sessions 2>/dev/null | grep -E "(coordinator|arch-enforcer|security-guardian|data-schema|knowledge-search|component-engineer|tdd-specialist|build-deploy)" | sed "s/coordinator/  t1: Master Coordinator/" | sed "s/arch-enforcer/  t2: Architecture Enforcer/" | sed "s/security-guardian/  t3: Security Guardian/" | sed "s/data-schema/  t4: Data Schema Specialist/" | sed "s/knowledge-search/  t5: Knowledge & Search Agent/" | sed "s/component-engineer/  t6: Component Engineer/" | sed "s/tdd-specialist/  t7: TDD & Testing Specialist ⭐/" | sed "s/build-deploy/  t8: Build & Deploy Validator/" || echo "  No active sessions - run trestart to initialize"'

# Window splitting for monitoring all 8 terminals
alias tmonitor='tmux new-window -n monitor-v3 "watch -n 5 ./scripts/terminal-status-v3.sh"'

# TDD workflow shortcuts
alias tdd-cycle='echo "🔄 TDD Cycle Workflow:
1. T7: Write failing test for requirement
2. T1: Route implementation to appropriate terminal (T2-T6,T8)
3. Implementation terminal: Write minimal code to pass test
4. T7: Validate GREEN (test passes)
5. T7 + Implementation terminal: Collaborate on REFACTOR
6. Repeat for next requirement"'

# Parallel workflow management
alias tparallel='echo "🚀 Parallel TDD Workflows:
- Multiple T7 cycles can run simultaneously
- Each cycle isolated by feature/component
- T1 coordinates to prevent conflicts
- Branch-based isolation when needed"'

# Quick terminal spawning
alias tspawn1='tmux new-session -d -s temp1 -c "$PWD" && tmux attach -t temp1'
alias tspawn2='tmux new-session -d -s temp2 -c "$PWD" && tmux attach -t temp2'

echo "🎮 Harness v3: 8-Terminal TDD System aliases loaded:"
echo "  t1-t8: Quick access to terminals 1-8"
echo "  thelp: Show terminal descriptions"
echo "  tlist: List active Harness sessions"
echo "  tstatus: Show detailed terminal status"
echo "  tkill: Kill all Harness sessions"
echo "  trestart: Restart all terminals"
echo ""
echo "🔄 TDD Aliases:"
echo "  tdd: Access TDD specialist (T7)"
echo "  tdd-cycle: Show TDD workflow"
echo "  tdd-red/green/refactor: Phase reminders"
echo "  tparallel: Parallel workflow info"
# Harness Engineering v2: Multi-Agent Documentation System

> **Entry point for the agent-focused Harness Engineering methodology**

## Overview

Harness v2 decomposes the monolithic HARNESS.md into specialized agent documentation, enabling parallel multi-terminal workflows with focused responsibilities and cleaner coordination.

## Architecture

### 6-Terminal Agent System
```
Terminal 1: Master Coordinator     → Orchestration & task routing
Terminal 2: Architecture Guardian  → System design & patterns
Terminal 3: Security Enforcer     → Auth, encryption, compliance
Terminal 4: Data Guardian         → Database, state, RAG
Terminal 5: UI Experience Agent   → Frontend, components, UX
Terminal 6: Integration Validator → Testing, build, QA
```

### Documentation Structure
```
docs/
├── orchestration/     # Terminal 1: Master coordination
├── agents/           # Terminals 2-6: Specialized agents
├── workflows/        # Multi-terminal coordination patterns
├── reference/        # Shared technical constraints
└── templates/        # Reusable validation checklists
```

## Quick Start

### 1. Launch Terminal System
```bash
# Start all 6 terminals with tmux
./scripts/harness-terminals.sh

# Load terminal aliases
source scripts/terminal-aliases.sh
```

### 2. Terminal Access
```bash
t1  # Master Coordinator
t2  # Architecture Guardian
t3  # Security Enforcer
t4  # Data Guardian
t5  # UI Experience Agent
t6  # Integration Validator
```

### 3. Exit Commands
```bash
# From within tmux (any layout)
Ctrl+B + d               # Detach (keeps session running) - RECOMMENDED
exit                      # Close current terminal pane only
Ctrl+B + &               # Kill entire session (asks confirmation)

# Force exit commands
tmux kill-session -t harness         # Kill separate sessions layout
tmux kill-session -t harness-8       # Kill all-8-grid layout
tmux kill-server                     # Nuclear option - kills ALL tmux sessions
```

### 4. Agent-Specific Commands
```bash
# Each terminal loads its specialized documentation
# Terminal 2: Architecture Guardian
/validate-patterns --factories --dependencies
/enforce-layers --downward-only

# Terminal 3: Security Enforcer
/validate-auth --gateway-only
/check-encryption --sensitive-fields

# Terminal 4: Data Guardian
/validate-schema --prisma --migrations
/check-embeddings --message-search
```

## Documentation Navigation

| I want to... | Read this |
|--------------|-----------|
| **Coordinate multiple workflows** | [orchestration/master-coordinator.md](orchestration/master-coordinator.md) |
| **Validate architecture patterns** | [agents/architecture-guardian.md](agents/architecture-guardian.md) |
| **Enforce security compliance** | [agents/security-enforcer.md](agents/security-enforcer.md) |
| **Manage database changes** | [agents/data-guardian.md](agents/data-guardian.md) |
| **Validate UI/UX components** | [agents/ui-experience-agent.md](agents/ui-experience-agent.md) |
| **Run tests and build validation** | [agents/integration-validator.md](agents/integration-validator.md) |
| **Handle task handoffs between terminals** | [workflows/terminal-handoffs.md](workflows/terminal-handoffs.md) |
| **Resolve cross-terminal conflicts** | [workflows/conflict-resolution.md](workflows/conflict-resolution.md) |

## Key Benefits

### 🎯 **Focused Responsibility**
- Each agent sees only relevant constraints (100-150 lines vs 663)
- Specialized validation checklists per domain
- Reduced cognitive load and context switching

### ⚡ **Parallel Execution**
- 6 terminals work on different domains simultaneously
- Clean handoffs between specialized agents
- Automatic conflict detection and resolution

### 🔄 **Follow-Up Task Coordination**
- Terminal 1 orchestrates task routing
- Completion signals trigger next appropriate terminal
- Maintains context across complex multi-step workflows

### 📚 **Maintainable Documentation**
- Modular docs: update security rules → only touch security-enforcer.md
- Clear ownership: each agent owns their documentation
- Easier onboarding: read only relevant agent docs

## Integration with Existing System

This v2 system **extends** (not replaces) the existing Harness Engineering:

- **Preserves**: Original `docs/HARNESS.md`, `CONSTRAINTS.md`, `design/`, `plans/`
- **Adds**: Agent-focused decomposition in `docs/`
- **Enables**: Multi-terminal workflows while maintaining single-terminal compatibility

## Coordination Protocols

### Task Completion Flow
```
Agent (T2-T6): Complete task → Signal completion
Master (T1): Detect signal → Route follow-up → Assign next terminal
Next Agent: Receive assignment → Load context → Execute
```

### Conflict Resolution
```
Agent: Detect conflict → Escalate to Master
Master: Analyze conflict → Coordinate resolution → Validate solution
Agents: Implement resolution → Continue workflow
```

### Quality Gates
```
Each Terminal: Agent-specific validation checklist
Master: Cross-agent validation → Integration verification → Final approval
```

---

**Next Steps**: Start with `./scripts/harness-terminals.sh` to launch the terminal system, then follow agent-specific documentation for your domain.
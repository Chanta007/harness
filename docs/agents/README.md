# Agent Documentation Index

> **Simplified access to specialized agent documentation**

## Quick Access

Load any agent documentation directly in Claude Code:

```bash
/load docs/agents/coordinator.md    # Master coordination & task routing
/load docs/agents/architect.md      # System design & patterns
/load docs/agents/security.md       # Auth, encryption, compliance
/load docs/agents/data.md           # Database, state, RAG
/load docs/agents/frontend.md       # UI/UX, components
/load docs/agents/backend.md        # APIs, integration, validation
/load docs/agents/testing.md        # TDD, quality assurance
/load docs/agents/devops.md         # Build, deploy, infrastructure
```

## Agent Specializations

| Agent | Domain | Use For |
|-------|--------|---------|
| **coordinator** | Task routing & orchestration | Project planning, workflow coordination |
| **architect** | System design & patterns | Architecture decisions, technical design |
| **security** | Auth & compliance | Security reviews, vulnerability assessment |
| **data** | Database & RAG | Schema changes, knowledge base updates |
| **frontend** | UI/UX components | React components, user experience |
| **backend** | APIs & integration | Service logic, API design |
| **testing** | TDD & validation | Test strategies, quality gates |
| **devops** | Build & deployment | CI/CD, infrastructure, monitoring |

## Task Delegation with Personas

Use Claude Code's task delegation with specialized personas:

```bash
# Architecture analysis
/task "Review system architecture" --persona-architect

# Security audit
/task "Audit authentication system" --persona-security

# Frontend development
/task "Create responsive components" --persona-frontend

# Performance optimization
/task "Optimize database queries" --persona-performance
```

## Benefits of Single Session + Task Delegation

- ✅ **Simplified**: No terminal management complexity
- ✅ **Integrated**: All context in one Claude session
- ✅ **Flexible**: Switch between domains as needed
- ✅ **Tracked**: Built-in task and progress management
- ✅ **Specialized**: Access domain expertise via personas and documentation

**Recommended workflow**: Start with `/load docs/agents/coordinator.md` for overall project guidance, then load specific agent docs as needed for specialized work.
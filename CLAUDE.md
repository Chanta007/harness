# CLAUDE.md Template

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository using the Harness Engineering v3 multi-agent system.

## Project Overview

**[PROJECT_NAME]** - [Brief description of your project]

This project uses **Harness Engineering v3** with 8 specialized AI agents working in TDD-driven parallel workflows. Each agent has hyper-focused responsibilities and clear coordination protocols.

## Multi-Agent Development System

### **8-Terminal Architecture**

| Terminal | Agent Role | Primary Files/Patterns | Coordination |
|----------|------------|------------------------|--------------|
| **T1** | Master Coordinator | Task routing, conflict resolution | Orchestrates T2-T8 |
| **T2** | Architecture Enforcer | [lib/], patterns, factories | TDD implementation |
| **T3** | Security Guardian | [lib/auth/], encryption, security | TDD implementation |
| **T4** | Data Schema Specialist | [prisma/], database schema | TDD implementation |
| **T5** | Knowledge & Search Agent | [lib/knowledge/], RAG, embeddings | TDD implementation |
| **T6** | Component Engineer | [components/], [app/], UI/UX | TDD implementation |
| **T7** | TDD & Testing Specialist | [__tests__/], TDD cycles | Leads all TDD workflows |
| **T8** | Build & Deploy Validator | CI/CD, builds, deployment | TDD implementation |

### **TDD-First Development Pattern**

**CRITICAL**: All feature development follows TDD cycles:

1. **RED Phase** (T7): Write failing test for requirement (2-5 min)
2. **GREEN Phase** (T1→T2-T6,T8): Route to domain terminal, implement minimal code (5-15 min)
3. **REFACTOR Phase** (T7 + Domain): Collaborate on code quality while maintaining green (5-10 min)

## Quick Start Commands

**Multi-Agent System**:
```bash
# Start all 8 terminals
./scripts/harness-terminals-v3.sh

# Quick access to terminals
source scripts/terminal-aliases-v3.sh
t1  # Master Coordinator
t7  # TDD Specialist
t2  # Architecture Enforcer
# etc.
```

**Development Workflow**:
```bash
# [Add your project-specific commands here]
npm install                    # Install dependencies
npm run dev                   # Start development server
npm test                      # Run test suite
npm run build                 # Production build
```

**Before Committing**:
```bash
# Validate across all domains
npm test                      # T7: Test validation
npm run lint                  # T8: Code quality
npm run type-check           # T8: TypeScript validation
npm run build                # T8: Build validation
```

## Architecture Patterns

**[Customize these patterns for your project]**

### **Core Patterns** (T2 - Architecture Enforcer)
- **Factory Pattern**: All external service connections go through factories
- **Plugin Registry**: Extensible systems with registration patterns
- **Dependency Layers**: Strict layer enforcement

### **Security Patterns** (T3 - Security Guardian)
- **Authentication Gateway**: All auth flows through centralized gateway
- **Encryption Standards**: All sensitive data encrypted at rest
- **Rate Limiting**: API protection and abuse prevention

### **Data Patterns** (T4 - Data Schema Specialist)
- **Schema Evolution**: Zero-downtime migration patterns
- **Data Integrity**: ACID compliance and consistency guarantees
- **Performance Optimization**: Query optimization and indexing

### **Component Patterns** (T6 - Component Engineer)
- **Server/Client Boundaries**: Proper use of "use client" directive
- **Design System**: Consistent component library usage
- **Accessibility**: WCAG 2.1 AA compliance minimum

## TDD Integration

### **Test-First Methodology** (T7 Leadership)

**MANDATORY**: Terminal 7 (TDD Specialist) leads all feature development:

```typescript
// Example TDD cycle for new feature
describe('New Feature', () => {
  // RED: T7 writes failing test first
  it('should implement feature behavior', () => {
    // Test that describes desired behavior
    expect(newFeature()).toBeDefined()
  })
})

// GREEN: Domain terminal implements minimal code
// REFACTOR: T7 + domain terminal improve quality
```

### **Cross-Terminal Test Coordination**

- **Unit Tests**: T7 writes, domain terminals implement
- **Integration Tests**: T7 coordinates cross-terminal features
- **E2E Tests**: T8 (Build & Deploy) validates complete workflows
- **Performance Tests**: Domain terminals optimize, T7 validates

## Environment Setup

**Required Environment Variables**:
```bash
# [Customize for your project]
# Example variables:
DATABASE_URL=postgresql://...
API_KEY=...
ENCRYPTION_KEY=...
```

**MCP Server Integration**:
The Harness Engineering v3 system works optimally with MCP servers:
- **Serena MCP**: Semantic code understanding and project memory
- **Sequential MCP**: Complex multi-step analysis and reasoning
- **Context7 MCP**: Official documentation and framework patterns
- **Magic MCP**: UI component generation with design systems

## Domain-Specific Guidelines

### **[Add your domain-specific sections]**

**Backend Development** (T2, T3, T4):
- [Your backend patterns and standards]

**Frontend Development** (T6):
- [Your frontend patterns and standards]

**Search & Knowledge** (T5):
- [Your search and knowledge management patterns]

**Build & Deployment** (T8):
- [Your CI/CD and deployment patterns]

## Quality Standards

### **Code Quality Requirements**
- **Type Safety**: No `any` types in production code
- **Test Coverage**: >90% for critical business logic
- **Performance**: [Your performance standards]
- **Security**: [Your security requirements]

### **Documentation Standards**
- **Harness Docs**: Keep `docs/harness-v2/` updated with project changes
- **API Documentation**: [Your API docs standards]
- **Component Documentation**: [Your component docs standards]

## Troubleshooting

### **Multi-Agent System Issues**

**Terminal Coordination Problems**:
1. Check terminal boundaries in `docs/harness-v2/agents/`
2. Use T1 (Master Coordinator) for conflict resolution
3. Review TDD coordination in `docs/harness-v2/workflows/tdd-coordination.md`

**TDD Cycle Issues**:
1. Ensure T7 writes tests first (RED phase)
2. Keep implementation minimal in GREEN phase
3. Save improvements for REFACTOR phase

### **Project-Specific Issues**
[Add your project-specific troubleshooting]

## Cross-References

**Essential Documentation**:
- **System Overview**: `docs/harness-v2/README-v3-8terminal.md`
- **TDD Workflows**: `docs/harness-v2/workflows/tdd-coordination.md`
- **Master Coordination**: `docs/harness-v2/orchestration/master-coordinator.md`
- **Individual Agents**: `docs/harness-v2/agents/[terminal-name].md`

**[Add your project documentation links]**

---

**Remember**: This project uses TDD-driven multi-agent development. Terminal 7 (TDD Specialist) leads all feature cycles, with domain terminals providing specialized implementation expertise.
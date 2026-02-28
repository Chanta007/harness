# Harness Engineering v3: 8-Terminal Hyper-Focused System

> **Ultra-specialized agents with laser-focused responsibilities**

## 🎯 Design Philosophy

### **Single Responsibility Principle for Agents**
Each terminal has ONE primary domain with minimal overlap:
- **Smaller context windows** (50-100 lines vs 150+ lines)
- **Faster decision making** with fewer competing priorities
- **Cleaner handoffs** between highly specialized agents
- **Dedicated TDD workflow** with red-green-refactor cycles

### **Agent Specialization Matrix**

| Terminal | Agent Role | Single Focus | Primary Files |
|----------|------------|--------------|---------------|
| **T1** | Master Coordinator | Task routing & conflicts | Orchestration only |
| **T2** | Architecture Enforcer | Patterns & boundaries | `lib/ai/factories`, patterns |
| **T3** | Security Guardian | Auth & encryption | `lib/auth/`, `lib/encryption.ts` |
| **T4** | Data Schema Specialist | Database & schema | `prisma/`, data models |
| **T5** | Knowledge & Search Agent | RAG & embeddings | `lib/knowledge/`, `lib/ai/rag.ts` |
| **T6** | Component Engineer | React components | `components/`, UI architecture |
| **T7** | TDD & Testing Specialist | Red-Green-Refactor | `__tests__/`, TDD cycles |
| **T8** | Build & Deploy Validator | Builds & deployment | Build systems, E2E, CI/CD |

## 🔄 TDD Integration (Terminal 7)

### **Red-Green-Refactor Workflow**
```
Terminal 7: TDD Specialist
├─ RED: Write failing test first
├─ Signal T2-T6: Implement minimum code to pass
├─ GREEN: Validate test passes
├─ REFACTOR: Clean up implementation with other terminals
└─ Repeat cycle
```

### **TDD Coordination Pattern**
```yaml
TDD_Cycle:
  Red_Phase:
    Terminal: T7 (TDD Specialist)
    Action: Write failing test
    Duration: 2-5 minutes

  Green_Phase:
    Coordinator: T1 routes to appropriate implementation terminal
    Implementation: T2/T3/T4/T5/T6 writes minimal code
    Validation: T7 confirms test passes
    Duration: 5-15 minutes

  Refactor_Phase:
    Collaboration: T7 + implementation terminal
    Focus: Clean code without breaking tests
    Validation: T7 ensures tests still pass
    Duration: 5-10 minutes
```

## 📋 Terminal Specializations

### **Terminal 1: Master Coordinator**
**Focus**: Pure orchestration - no implementation
```yaml
Responsibilities:
  - Route tasks to T2-T8 based on domain
  - Coordinate TDD cycles between T7 and implementation terminals
  - Resolve conflicts between specialized agents
  - Final integration validation across all domains
```

### **Terminal 2: Architecture Enforcer**
**Focus**: ONLY patterns, factories, and boundaries
```yaml
Responsibilities:
  - Factory pattern compliance (LLM, Prompt, Auth)
  - Dependency layer enforcement
  - Plugin registry patterns
  - System boundary validation

Excludes:
  - Component design (→ T6)
  - Database design (→ T4)
  - Security implementation (→ T3)
```

### **Terminal 3: Security Guardian**
**Focus**: ONLY authentication, encryption, and security
```yaml
Responsibilities:
  - AuthGateway enforcement
  - Encryption implementation
  - Security vulnerability assessment
  - Rate limiting and input validation

Excludes:
  - Component security (→ T6)
  - Database security (→ T4)
  - Build security (→ T8)
```

### **Terminal 4: Data Schema Specialist**
**Focus**: ONLY database schema and data models
```yaml
Responsibilities:
  - Prisma schema design
  - Database migrations
  - Data model relationships
  - SQL performance optimization

Excludes:
  - Search/RAG (→ T5)
  - Component data flow (→ T6)
  - Test data (→ T7)
```

### **Terminal 5: Knowledge & Search Agent**
**Focus**: ONLY RAG, embeddings, and search
```yaml
Responsibilities:
  - Vector embeddings (FastEmbed)
  - RAG pipeline optimization
  - Knowledge base management
  - Search result ranking

Excludes:
  - Database schema (→ T4)
  - Search UI (→ T6)
  - Search testing (→ T7)
```

### **Terminal 6: Component Engineer**
**Focus**: ONLY React components and UI architecture
```yaml
Responsibilities:
  - React component design
  - shadcn/ui integration
  - Component composition patterns
  - Server/Client boundaries

Excludes:
  - UX research (can be added as T9 if needed)
  - Component testing (→ T7)
  - Build optimization (→ T8)
```

### **Terminal 7: TDD & Testing Specialist** ⭐ **NEW**
**Focus**: ONLY test-driven development and testing
```yaml
Responsibilities:
  - Write failing tests first (RED phase)
  - Validate implementations pass tests (GREEN phase)
  - Guide refactoring while maintaining tests (REFACTOR phase)
  - Unit test design and coverage

Workflow:
  - Receives requirements → writes failing test
  - Coordinates with T2-T6 for implementation
  - Validates implementation passes test
  - Collaborates on refactoring without breaking tests
```

### **Terminal 8: Build & Deploy Validator**
**Focus**: ONLY builds, deployment, and system validation
```yaml
Responsibilities:
  - TypeScript compilation validation
  - Production build success
  - E2E test execution
  - CI/CD pipeline health
  - Observability validation

Excludes:
  - Unit testing (→ T7)
  - Component testing (→ T7)
  - Database testing (→ T7 with T4)
```

## 🔄 TDD Workflow Examples

### **Example 1: Add LLM Provider**
```
T7 (TDD): Write failing test for new provider
T1 (Coord): Route to T2 (Architecture) for factory implementation
T2 (Arch): Implement minimal factory code to pass test
T7 (TDD): Validate test passes (GREEN)
T2 + T7: Refactor factory code while keeping tests green
T8 (Build): Validate build and integration
```

### **Example 2: Add UI Component**
```
T7 (TDD): Write failing component test
T1 (Coord): Route to T6 (Component) for implementation
T6 (Component): Implement minimal component to pass test
T7 (TDD): Validate test passes (GREEN)
T6 + T7: Refactor component while keeping tests green
T8 (Build): Run E2E tests and build validation
```

### **Example 3: Add Search Feature**
```
T7 (TDD): Write failing search tests
T1 (Coord): Route to T5 (Knowledge) for search logic
T5 (Knowledge): Implement minimal search to pass test
T7 (TDD): Validate test passes (GREEN)
T4 (Data): Add database support if needed
T6 (Component): Add search UI component
T5 + T7: Refactor search logic while keeping tests green
```

## 🚀 8-Terminal Launch System

### **Updated Terminal Script**
```bash
# New 8-terminal system
./scripts/harness-terminals-v3.sh

# Terminal aliases
t1  # Master Coordinator
t2  # Architecture Enforcer
t3  # Security Guardian
t4  # Data Schema Specialist
t5  # Knowledge & Search Agent
t6  # Component Engineer
t7  # TDD & Testing Specialist ⭐ NEW
t8  # Build & Deploy Validator
```

### **TDD Workflow Commands**
```bash
# Terminal 7 (TDD) specific commands
/tdd-red --write-failing-test --requirement "Add DeepSeek provider"
/tdd-green --validate-implementation --run-tests
/tdd-refactor --collaborate T2 --maintain-tests
/tdd-cycle --complete --next-requirement
```

## 📊 Benefits of 8-Terminal System

### **Cognitive Load Reduction**
- **T4 Data**: 200+ lines → 80 lines (schema only)
- **T6 Component**: 300+ lines → 100 lines (components only)
- **T7 TDD**: New dedicated workflow (80 lines)
- **T8 Build**: 250+ lines → 120 lines (build/deploy only)

### **TDD Integration Benefits**
- **Faster feedback cycles**: 2-5 min red, 5-15 min green, 5-10 min refactor
- **Higher quality**: Tests written before implementation
- **Better design**: API design driven by test requirements
- **Immediate validation**: Each implementation immediately tested

### **Specialization Benefits**
- **Faster decisions**: Each agent has single focus area
- **Cleaner handoffs**: Clear boundaries between agents
- **Parallel efficiency**: More agents can work simultaneously
- **Expertise depth**: Each agent becomes domain expert

## 🔧 Implementation Plan

**Phase 1**: Update existing 6-terminal docs to split responsibilities
**Phase 2**: Create T7 (TDD) documentation and workflows
**Phase 3**: Create T8 (Build) focused documentation
**Phase 4**: Update terminal scripts for 8-terminal system
**Phase 5**: Test TDD workflow coordination between terminals

Would you like me to proceed with implementing this 8-terminal system with dedicated TDD workflows?
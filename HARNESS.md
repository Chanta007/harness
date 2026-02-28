# HARNESS ENGINEERING v3 METHODOLOGY

> **Universal Entry Point**: Core methodology rules and complete documentation index

## 🎯 Core Principles

### 1. **Agent-Driven Development**
- Each domain has a specialized agent with clear responsibilities
- Agents coordinate through the orchestrator, not directly with each other
- Self-describing agents enable LLM-powered intelligent selection
- Agent execution follows dependency hierarchy and validation gates

### 2. **Systematic Quality Gates**
All development follows the 8-step validation cycle:
```
1. Syntax → 2. Type → 3. Lint → 4. Security → 5. Test → 6. Performance → 7. Documentation → 8. Integration
```

### 3. **Dependency Layer Enforcement**
Strict downward-only dependency flow:
```
PAGES → COMPONENTS → API ROUTES → SERVICES → CORE → INFRASTRUCTURE → TYPES
```

### 4. **Factory Pattern Compliance**
- **LLM Factory**: All AI interactions via `createLLMConnection()` → `completeLLM()`
- **Prompt Factory**: All prompts via `createPromptFactory()` → `factory.load()`
- **Auth Gateway**: All authentication via `AuthGateway` composition
- **Sandbox Router**: All code execution via tiered routing

## 🤖 Agent Orchestration Rules

### Agent Selection & Coordination
- **Intelligent Selection**: LLM analyzes task requirements and selects appropriate agents
- **Self-Describing**: Each agent provides capabilities, specializations, and best-use cases
- **Dependency-Aware**: Agent execution respects dependencies (Security → Backend → Frontend → Testing)
- **Parallel When Possible**: Independent tasks execute simultaneously
- **Real-Time Communication**: WebSocket coordination for multi-stream scenarios

### Mandatory Agent Inclusion
- **Security Agent**: Required for authentication, permissions, sensitive data
- **Testing Agent**: Required for all implementation tasks
- **Architecture Agent**: Required for system design and pattern validation
- **Documentation**: Auto-generated for compliance-required tasks

## 🔀 Multi-Stream Development

### Parallel Development Rules
- **Git Branch Isolation**: Each stream works in dedicated branch
- **Conflict Detection**: Automatic detection of overlapping file modifications
- **Real-Time Coordination**: WebSocket communication between streams and orchestrator
- **Progress Visualization**: Live dashboard showing all stream states
- **Resource Management**: Intelligent distribution of computational resources

### Stream Synchronization
- **Coordination Points**: Regular sync checks for dependency conflicts
- **Merge Strategy**: Systematic integration planning before merge
- **Quality Gates**: Each stream must pass all validation before completion

## 📋 Task Classification & Routing

### Task Types
- **authentication**: Security-first approach (Security → Backend → Frontend → Testing)
- **frontend**: UI/UX development (Frontend → Testing)
- **backend**: Server-side implementation (Backend → Testing)
- **fullstack**: Complete feature (Architecture → Security → Backend → Frontend → Testing)
- **performance**: Optimization work (Performance → Backend → Testing)
- **infrastructure**: DevOps operations (DevOps → Architecture → Testing)

### Execution Strategies
- **Sequential**: Tasks with dependencies
- **Parallel**: Independent tasks that can run simultaneously
- **Hybrid**: Mix of sequential and parallel based on dependency analysis

## 🛡️ Compliance & Validation

### Harness Compliance Requirements
- **FOLLOW_HARNESS_METHODOLOGY**: All tasks must adhere to methodology
- **AGENT_COORDINATION_REQUIRED**: No solo agent execution
- **SECURITY_REVIEW_REQUIRED**: For auth/sensitive data tasks
- **TESTING_REQUIRED**: For all implementation work
- **DOCUMENTATION_MANDATORY**: For complex/compliance-required tasks
- **CODE_REVIEW_BEFORE_MERGE**: All code changes require validation

### Quality Standards
- **Evidence-Based**: All decisions supported by measurable data
- **Security by Default**: Secure patterns and fail-safe mechanisms
- **Performance Aware**: Sub-3-second load times, <200ms API responses
- **Accessibility First**: WCAG 2.1 AA compliance minimum
- **Test Coverage**: ≥80% unit tests, ≥70% integration tests

## 📷 Multimodal Development

### Visual Context Integration
- **Screenshot Analysis**: UI mockups, error screens, performance dashboards
- **Context Enhancement**: Visual requirements automatically extracted
- **Design Validation**: Pixel-perfect implementation verification
- **Error Diagnosis**: Visual debugging with screenshot context

### Interactive Execution
- **Real-Time Control**: Pause, resume, modify requirements during execution
- **Status Monitoring**: Live progress updates and agent coordination visibility
- **Dynamic Requirements**: Add/modify requirements mid-execution
- **Feedback Loops**: Visual feedback integration for iterative development

## 🏗️ Architecture Patterns

### Factory Patterns
```typescript
// ✅ CORRECT: Factory usage
const connection = await createLLMConnection(orgId, modelId);
const response = await completeLLM(connection, { messages });

// ❌ VIOLATION: Direct SDK usage
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
```

### Plugin Registry
```typescript
// ✅ CORRECT: Registry pattern
const renderer = artifactRegistry.getRenderer(artifactType);

// ❌ VIOLATION: Type-specific logic
if (artifactType === 'powerpoint') return new PowerPointRenderer();
```

### Dependency Layers
```typescript
// ✅ CORRECT: Downward dependencies
// SERVICES importing from CORE
import { performRAGSearch } from '../ai/rag';

// ❌ VIOLATION: Upward dependencies
// CORE importing from SERVICES
import { extractionEngine } from '../analysis/extraction-engine';
```

## 📚 Documentation Index

### Quick Access - Agent Specifications
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

### Workflow & Process Documentation
- **Conflict Resolution**: `docs/workflows/conflict-resolution.md`
- **Quality Gates**: `docs/workflows/validation-cycle.md`
- **Multi-Stream Development**: `docs/workflows/parallel-development.md`

### Reference & Constraints
- **Dependency Layers**: `docs/reference/dependency-layers.md`
- **Tech Stack**: `docs/reference/tech-stack.md`
- **Security Patterns**: `docs/reference/security-patterns.md`
- **Performance Standards**: `docs/reference/performance-standards.md`

## 🚀 Orchestrator Integration

### Natural Language Interface
```bash
# Basic task execution
./harness "implement user authentication with OAuth"

# Multimodal with screenshots
./harness "fix this bug" --screenshot="error-console.png"

# Interactive development
./harness "build this UI" --screenshot="mockup.png" --interactive

# Multi-stream parallel development
./harness multi \
  --stream1="implement auth" --branch1="feature/auth" \
  --stream2="fix performance" --branch2="bugfix/perf" \
  --stream3="add dashboard" --branch3="feature/dash"
```

### Compliance Validation
The orchestrator automatically validates:
- Agent selection against task requirements
- Execution strategy against dependencies
- Quality gates against methodology standards
- Security requirements against sensitive data flags
- Testing requirements against implementation flags

## ⚡ Performance & Efficiency

### Resource Management
- **Token Optimization**: Context-aware compression and caching
- **Parallel Execution**: Maximum utilization of available computational resources
- **Intelligent Batching**: Grouped operations for efficiency
- **Cache Strategy**: Reuse of analysis results across related operations

### Quality Metrics
- **Completion Rate**: >95% task success rate
- **Compliance Rate**: 100% adherence to methodology requirements
- **Performance Standards**: Sub-3-second execution for simple tasks
- **Accuracy Rate**: >90% correct agent selection for task types

---

## 📖 Getting Started

### Quick Installation (2 minutes)
```bash
git clone https://github.com/Chanta007/harness.git
cd harness
./quick-setup.sh
```

### Deployment Options

**Render.com Docker (Recommended)**
```bash
npm run deploy       # Multi-service Docker container
```

**Digital Ocean (Alternative)**
```bash
npm run deploy:do    # Serverless functions + WebSocket coordination
```

### Production Architecture

**Render.com Docker Deployment**:
- **Multi-Service Container**: All services in single Docker container
- **MCP Server**: Methodology and agent coordination (Port 3000)
- **WebSocket Server**: Real-time multi-stream coordination (Port 3001)
- **Health Monitor**: Service monitoring and proxy (Port 8080)
- **Automatic Restarts**: Service monitoring and auto-recovery
- **Redis Cache**: Session state management (optional add-on)
- **PostgreSQL**: Persistent storage (optional add-on)

**Cost**: ~$7-10/month for complete infrastructure

1. **Read this document** - Universal methodology overview
2. **Load agent docs** - `/load docs/agents/coordinator.md` for project guidance
3. **Check constraints** - Review non-negotiable architectural rules
4. **Start development** - Use natural language orchestrator interface
5. **Validate compliance** - Ensure all quality gates pass

**Remember**: Harness Engineering v3 transforms complex multi-agent coordination into simple natural language commands while maintaining enterprise-grade methodology compliance and quality standards.
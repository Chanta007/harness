# Harness Engineering v3 Documentation

> **Complete documentation index following proven MindCoachLabs pattern**

## 🎯 Quick Start

1. **Read Universal Entry Point**: [`HARNESS.md`](../HARNESS.md) - Core methodology and complete index
2. **Load Agent Documentation**: Choose specialized agent based on your task
3. **Review Constraints**: Check non-negotiable rules and architectural boundaries
4. **Start Development**: Use natural language orchestrator interface

## 📚 Documentation Architecture

### Central Methodology
- **[HARNESS.md](../HARNESS.md)** - Universal entry point with core rules and complete index
- **[README-ORCHESTRATOR.md](../README-ORCHESTRATOR.md)** - Orchestrator transformation guide
- **[README-ENHANCED.md](../README-ENHANCED.md)** - Feature comparison and revolutionary use cases
- **[README-MULTISTREAM.md](../README-MULTISTREAM.md)** - Multi-stream parallel development
- **[MINDCOACH-INTEGRATION.md](../MINDCOACH-INTEGRATION.md)** - Backend integration architecture

### Agent Specifications (`docs/agents/`)
- **[coordinator.md](agents/README.md)** - Master coordination & task routing
- **[architect.md](agents/architect.md)** - System design & architectural patterns
- **[security.md](agents/security.md)** - Authentication, encryption, compliance
- **[data.md](agents/data.md)** - Database schema, state management, RAG
- **[frontend.md](agents/frontend.md)** - UI/UX components, responsive design
- **[backend.md](agents/backend.md)** - APIs, integration, service logic
- **[testing.md](agents/testing.md)** - TDD, quality assurance, validation
- **[devops.md](agents/devops.md)** - Build, deployment, infrastructure

### Workflow & Process (`docs/workflows/`)
- **[conflict-resolution.md](workflows/)** - Multi-agent conflict resolution
- **[validation-cycle.md](workflows/)** - 8-step quality gate process
- **[parallel-development.md](workflows/)** - Multi-stream coordination

### Reference & Constraints (`docs/reference/`)
- **[dependency-layers.md](reference/)** - Architectural layer boundaries
- **[tech-stack.md](reference/)** - Technology choices and patterns
- **[security-patterns.md](reference/)** - Security implementation standards
- **[performance-standards.md](reference/)** - Performance benchmarks and requirements

## 🚀 Harness v3 Transformation

### Before: Complex Multi-Terminal Setup
```bash
# Old v2 approach - 6+ terminals with tmux
./scripts/harness-terminals.sh
source scripts/terminal-aliases.sh
t1  # Master Coordinator
t2  # Architecture Guardian
# ... complex terminal management
```

### After: Ultra-Simple Orchestrator
```bash
# New v3 approach - Single natural language commands
./harness "implement user authentication with OAuth"
./harness "fix this bug" --screenshot="error-console.png"
./harness "build this UI" --screenshot="mockup.png" --interactive
```

## 🤖 Agent Usage Patterns

### Quick Agent Loading
```bash
# Load specific agent documentation in Claude Code
/load docs/agents/coordinator.md    # Overall project guidance
/load docs/agents/architect.md      # System design decisions
/load docs/agents/security.md       # Security reviews and auth
/load docs/agents/data.md           # Database and RAG work
/load docs/agents/frontend.md       # UI/UX development
/load docs/agents/backend.md        # API and service logic
/load docs/agents/testing.md        # Quality assurance
/load docs/agents/devops.md         # Build and deployment
```

### Task Delegation with Personas
```bash
# Architecture analysis
/task "Review system architecture" --persona-architect

# Security audit
/task "Audit authentication system" --persona-security

# Frontend development
/task "Create responsive components" --persona-frontend --magic

# Performance optimization
/task "Optimize database queries" --persona-performance --seq
```

## 🔀 Multi-Stream Development

### Parallel Development Streams
```bash
# Multiple features/bugs in parallel with git branch isolation
./harness multi \
  --stream1="implement auth system" --branch1="feature/auth" \
  --stream2="fix performance bug" --branch2="bugfix/perf" --screenshot2="metrics.png" \
  --stream3="add dashboard UI" --branch3="feature/dashboard" --screenshot3="mockup.png"
```

### Real-Time Coordination
- **Git Branch Isolation**: Each stream works in dedicated branch
- **Conflict Detection**: Automatic detection of overlapping file modifications
- **Progress Visualization**: Live dashboard showing all stream states
- **Agent Communication**: WebSocket coordination between streams

## 📋 Compliance & Quality

### Mandatory Requirements (from HARNESS.md)
- ✅ **Agent Coordination**: All tasks require multi-agent coordination
- ✅ **Quality Gates**: 8-step validation cycle enforcement
- ✅ **Security Review**: Required for authentication/sensitive data
- ✅ **Testing Coverage**: ≥80% unit tests, ≥70% integration tests
- ✅ **Documentation**: Auto-generated for compliance-required tasks

### Quality Standards
- **Evidence-Based**: All decisions supported by measurable data
- **Security by Default**: Secure patterns and fail-safe mechanisms
- **Performance Aware**: <3s load times, <200ms API responses
- **Accessibility First**: WCAG 2.1 AA compliance minimum

## 🔧 Development Workflow

1. **Start**: Load [`HARNESS.md`](../HARNESS.md) for methodology overview
2. **Plan**: Use orchestrator natural language interface for task specification
3. **Execute**: Agents coordinate automatically following methodology rules
4. **Validate**: All quality gates pass before task completion
5. **Document**: Compliance documentation auto-generated

## 🏗️ Architecture Patterns

### Factory Pattern Compliance
```typescript
// ✅ CORRECT: Factory usage
const connection = await createLLMConnection(orgId, modelId);
const response = await completeLLM(connection, { messages });
```

### Dependency Layer Enforcement
```
PAGES → COMPONENTS → API ROUTES → SERVICES → CORE → INFRASTRUCTURE → TYPES
```

### Plugin Registry Pattern
```typescript
// ✅ CORRECT: Registry pattern
const renderer = artifactRegistry.getRenderer(artifactType);
```

## 🎯 Benefits of v3 Transformation

### **User Experience**
- **🎯 Learning Curve**: Complex setup → Zero learning required
- **⚡ Time to Productivity**: Hours of setup → Instant execution
- **🧠 Cognitive Load**: Remember commands → Natural language only
- **📱 Accessibility**: Terminal-only → Multi-device ready

### **Development Velocity**
- **🔄 Task Coordination**: Manual agent management → Automatic orchestration
- **📷 Context Understanding**: Text-only → Rich visual context
- **🎯 Accuracy**: Generic solutions → Context-aware implementations
- **👥 Collaboration**: Individual → Team-coordinated development

### **Quality Assurance**
- **🛡️ Methodology Compliance**: Manual checking → Automatic validation
- **🧪 Testing**: Optional → Always included with Testing Agent
- **🔒 Security**: Afterthought → Security Agent always considered
- **📚 Documentation**: Manual → Auto-generated with compliance

## 🔗 Integration Points

### Claude Code Compatibility
- **MCP Servers**: Context7, Sequential, Magic, Playwright integration
- **Persona System**: Auto-activation based on task type and complexity
- **Task Management**: TodoWrite integration for progress tracking
- **Quality Gates**: Automated validation against methodology standards

### MindCoachLabs Backend
- **Session Persistence**: Resume complex tasks after interruptions
- **Team Collaboration**: Multiple developers on same development task
- **Development Analytics**: Track patterns and success rates
- **Context Preservation**: Full development history like coaching conversations

---

**Remember**: This documentation follows the proven MindCoachLabs pattern with a central entry point, detailed domain specifications, and comprehensive workflow guidance. All development must follow Harness Engineering v3 methodology for quality and compliance.
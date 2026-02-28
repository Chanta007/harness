# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Harness Engineering v3** is an AI agent orchestration system that transforms complex multi-agent development workflows into simple natural language commands. It follows a strict methodology for agent coordination, quality gates, and architectural patterns.

## Core Architecture

### Central Entry Point
- **HARNESS.md**: Universal methodology document - READ THIS FIRST for all development tasks
- Contains agent coordination rules, compliance requirements, and architectural patterns
- Defines 8-step validation cycle and dependency layer enforcement

### Main Components

**Orchestrator (`./harness`)**
- Node.js CLI that coordinates AI agents using natural language input
- Supports multimodal input (screenshots + text) and real-time interaction
- Handles multi-stream parallel development with git branch isolation

**MCP Server (`mcp-server/server.js`)**
- Provides intelligent agent selection and validation endpoints
- Runs on render.com with API key authentication
- Validates Harness methodology compliance

**Agent System (`docs/agents/`)**
- 8 specialized agents: coordinator, architect, security, data, frontend, backend, testing, devops
- Each agent has self-describing capabilities for LLM-powered selection
- Coordination follows dependency hierarchy (Security → Backend → Frontend → Testing)

## Development Commands

### Environment Setup
```bash
npm run setup-env          # Generate secure API keys and environment
chmod +x harness setup-harness.sh  # Make scripts executable
```

### Core Development
```bash
./harness "task description"              # Single natural language task
./harness "task" --screenshot="img.png"   # With visual context
./harness "task" --interactive             # Real-time control mode

# Multi-stream parallel development
./harness multi \
  --stream1="implement auth" --branch1="feature/auth" \
  --stream2="fix performance" --branch2="bugfix/perf"
```

### Testing & Validation
```bash
npm test                    # Run orchestrator tests
npm run deploy             # Deploy to render.com
npm run deploy:render      # Alternative deploy command
npm run deploy:do          # Deploy to DigitalOcean
```

### Docker Deployment
```bash
# Ensure package-lock.json exists before Docker build
npm install --package-lock-only

# Build and deploy (automatic via render.com)
git push origin main
```

## Methodology Compliance (CRITICAL)

All development MUST follow Harness Engineering methodology:

### Agent Coordination Rules
- **Never use single agents**: All tasks require multi-agent coordination
- **Security Agent**: REQUIRED for authentication, permissions, sensitive data
- **Testing Agent**: REQUIRED for all implementation tasks
- **Architecture Agent**: REQUIRED for system design and pattern validation

### Quality Gates (8-Step Validation)
```
1. Syntax → 2. Type → 3. Lint → 4. Security → 5. Test → 6. Performance → 7. Documentation → 8. Integration
```

### Dependency Layer Enforcement
```
PAGES → COMPONENTS → API ROUTES → SERVICES → CORE → INFRASTRUCTURE → TYPES
```
**Strict downward-only dependencies** - no upward imports allowed.

### Factory Pattern Compliance
```typescript
// ✅ CORRECT
const connection = await createLLMConnection(orgId, modelId);
const response = await completeLLM(connection, { messages });

// ❌ VIOLATION
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
```

## Security Requirements

### API Key Authentication
- All MCP server requests require `X-API-Key` header
- Use `process.env.HARNESS_API_KEY` for authentication
- Same static key for local development and production

### Environment Variables
```bash
HARNESS_API_KEY=harness_generated_secure_key  # REQUIRED
HARNESS_MCP_URL=https://harness-orchestrator.onrender.com
HARNESS_WS_URL=wss://harness-orchestrator.onrender.com
```

## Agent Documentation Loading

When working on domain-specific tasks, load appropriate agent documentation:

```bash
/load docs/agents/coordinator.md    # Overall project guidance
/load docs/agents/architect.md      # System design decisions
/load docs/agents/security.md       # Security reviews and auth
/load docs/agents/frontend.md       # UI/UX development
/load docs/agents/backend.md        # API and service logic
/load docs/agents/testing.md        # Quality assurance
/load docs/agents/devops.md         # Build and deployment
```

## Common Development Patterns

### Task Classification
- **authentication**: Security → Backend → Frontend → Testing
- **frontend**: Frontend → Testing
- **backend**: Backend → Architecture → Testing
- **fullstack**: Architecture → Security → Backend → Frontend → Testing → DevOps

### Multi-Stream Development
- Each stream gets dedicated git branch for isolation
- Real-time conflict detection for overlapping file modifications
- WebSocket communication between orchestrator and agents
- Live progress visualization dashboard

### Interactive Execution
```bash
# During --interactive mode
status              # Show current progress
pause [agent]       # Pause specific agent
resume             # Resume execution
modify "new req"   # Add requirements
screenshot "path"  # Add visual feedback
```

## File Structure Conventions

```
harness                     # Main orchestrator CLI
HARNESS.md                 # Central methodology (READ FIRST)
docs/
  agents/                  # Agent specifications
  workflows/               # Process documentation
  reference/               # Constraints and standards
mcp-server/server.js       # MCP server for agent coordination
scripts/setup-env.js      # Environment configuration
```

## Quality Standards

- **Evidence-Based**: All decisions supported by measurable data
- **Security by Default**: Secure patterns and fail-safe mechanisms
- **Performance**: <3s load times, <200ms API responses
- **Accessibility**: WCAG 2.1 AA compliance minimum
- **Test Coverage**: ≥80% unit tests, ≥70% integration tests

## Important Notes

1. **Always read HARNESS.md first** - contains non-negotiable methodology rules
2. **Never bypass agent coordination** - solo agent execution violates methodology
3. **Validate compliance** - all tasks must pass 8-step validation cycle
4. **Use natural language interface** - the `./harness` command is the primary entry point
5. **Respect dependency layers** - strictly enforce architectural boundaries
6. **Follow factory patterns** - use createLLMConnection() instead of direct SDK calls

## Common Issues & Solutions

### Docker Deployment Failures
- **Missing lockfile**: Run `npm install --package-lock-only` before git push
- **Scripts with Windows line endings**: Convert using `dos2unix` command
- **Permission errors**: Ensure scripts are executable with `chmod +x`

### Environment Setup Issues
- **API key missing**: Run `npm run setup-env` to generate HARNESS_API_KEY
- **MCP server connection**: Verify HARNESS_MCP_URL is set correctly
- **WebSocket issues**: Check HARNESS_WS_URL and firewall settings

## MCP Integration

This system is optimized for Model Context Protocol (MCP) usage:
- **Serena MCP**: Semantic code understanding and project memory
- **Context7 MCP**: Official library documentation and patterns
- **Magic MCP**: UI component generation with design systems
- **Sequential MCP**: Complex multi-step analysis and reasoning
- **Playwright MCP**: Browser automation and E2E testing

When Claude Code connects to this project, the orchestrator can intelligently coordinate with these MCP servers for enhanced development capabilities.
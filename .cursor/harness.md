# HARNESS REST API Reference — Cursor
*Auto-populated from live server at: 2026-03-01T00:11:23Z*

> **Full methodology**: See `HARNESS.md` in project root for complete documentation.

## Access Method
Terminal + curl (REST API — not a native MCP server)
Cursor AI does not call this natively — use the terminal or Cursor's run commands.

## Base URLs
- Remote: https://harness-d4o0.onrender.com  (may cold-start ~30s on first request)
- Local: http://localhost:3000 (run: node mcp-server/server.js)

## Authentication
All /api routes require: X-API-Key: $HARNESS_API_KEY

## Standard Workflow (before every /harness task)
1. Select agents:  POST /api/select-agents-harness  {"task": "..."}
2. Validate:       POST /api/validate               {"task": "...", "agents": [...]}
3. Load agent:     GET  /api/agents/{name}

## Endpoints
GET  /health                     — no auth required
GET  /api/methodology            — full HARNESS methodology
GET  /api/agents                 — list all agents
GET  /api/agents/{name}          — specific agent definition
POST /api/select-agents-harness  — intelligent agent selection
POST /api/validate               — HARNESS compliance check

## Agent Names (fetched live from /api/agents)

### coordinator (Terminal 1)
- **Role**: Integration Orchestrator
- **Specialization**: Multi-terminal workflow orchestration and system integration
- **Coordinates with**: all
- **Responsibilities**: Task routing, Conflict resolution, Integration validation

### architect (Terminal 2)
- **Role**: Architecture Enforcer
- **Specialization**: Architecture patterns and dependency compliance
- **Coordinates with**: all
- **Responsibilities**: Dependency validation, Factory patterns, System design

### security (Terminal 3)
- **Role**: Security Validator
- **Specialization**: Security validation and threat mitigation
- **Coordinates with**: backend, testing
- **Responsibilities**: Authentication, Encryption, Compliance

### data (Terminal 4)
- **Role**: Data Schema Specialist
- **Specialization**: Database architecture and knowledge systems
- **Coordinates with**: backend, security
- **Responsibilities**: Database design, RAG systems, Data integrity

### frontend (Terminal 5)
- **Role**: Frontend Specialist
- **Specialization**: User interface and experience optimization
- **Coordinates with**: testing, architect
- **Responsibilities**: UI/UX, Components, Accessibility

### backend (Terminal 6)
- **Role**: API Logic Specialist
- **Specialization**: Server-side logic and API development
- **Coordinates with**: data, security, testing
- **Responsibilities**: API design, Service logic, Integration

### testing (Terminal 7)
- **Role**: Quality Assurance
- **Specialization**: Test-driven development and quality assurance
- **Coordinates with**: all
- **Responsibilities**: Test design, Quality gates, Validation

### devops (Terminal 8)
- **Role**: DevOps Specialist
- **Specialization**: Build systems and deployment automation
- **Coordinates with**: testing, security
- **Responsibilities**: Build validation, CI/CD, Deployment

## Persona Flags
--persona-harness-coordinator
--persona-harness-architect
--persona-harness-security
--persona-harness-backend
--persona-harness-frontend
--persona-harness-data
--persona-harness-testing
--persona-harness-devops

## Rate Limits
- General:    100 req / 15 min per IP
- API routes:  50 req / 15 min per IP
- Health:     unlimited

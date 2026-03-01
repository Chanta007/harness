# HARNESS Engineering v3 — Cursor Setup

Use this prompt for both **fresh installs** and **updates** to an existing HARNESS environment in Cursor.
Paste it directly into Cursor's AI chat. It is safe to re-run — it checks before overwriting.

---

## KEY DIFFERENCES FROM CLAUDE CODE

| | Claude Code | Cursor |
|---|---|---|
| Config file | `~/.claude/CLAUDE.md` | `.cursorrules` (project root) |
| Agent memory | `~/.claude/MCP_Harness.md` | `.cursor/harness.md` (project) |
| MCP servers | `~/.claude/mcp.json` | `.cursor/mcp.json` |
| Subagents | Native Task tool | Not supported — REST API handles it |
| Parallelism | Native | Orchestrated inside REST server |

---

## PROMPT (paste into Cursor AI chat)

```
I need you to set up or update the HARNESS Engineering v3 system in this Cursor project.
Follow all steps below. This is safe to re-run — detect what exists and update rather than overwrite blindly.

---

## STEP 1 — DETECT ENVIRONMENT STATE

Before doing anything, check what already exists:

1. Check if .cursorrules exists in the project root
2. Check if .cursor/harness.md exists
3. Check if .cursor/mcp.json exists
4. Check if HARNESS_API_KEY is set: run `echo $HARNESS_API_KEY` in terminal
5. Check if HARNESS_MCP_URL is set: run `echo $HARNESS_MCP_URL` in terminal
6. Check server health:
   curl -s https://harness-d4o0.onrender.com/health

Report what you find before proceeding. Note what will change vs what will be left as-is.

---

## STEP 2 — FETCH LIVE AGENT DEFINITIONS FROM SERVER

HARNESS agent definitions are authoritative on the server. Fetch them now so local config
stays in sync as the server evolves.

Run these in the terminal:

curl -s -H "X-API-Key: $HARNESS_API_KEY" \
  https://harness-d4o0.onrender.com/api/agents

curl -s -H "X-API-Key: $HARNESS_API_KEY" \
  https://harness-d4o0.onrender.com/api/methodology

If HARNESS_API_KEY is not set, skip authenticated calls and use the static agent
list in STEP 4 as fallback. Note this in the setup report.

Use the live agent data to populate .cursor/harness.md in STEP 3.

---

## STEP 3 — CREATE OR UPDATE .cursor/harness.md

Create the .cursor/ directory if it doesn't exist.
If the file exists, compare and update only what has changed.

**Note on HARNESS.md**: The project root `HARNESS.md` is the universal methodology source of truth.
`.cursor/harness.md` is a Cursor-specific API reference that links back to HARNESS.md.
If HARNESS.md exists, add a "Cursor Quick Reference" section to it (see STEP 3b).

The file should contain:

# HARNESS REST API Reference — Cursor
*Auto-populated from live server at: [timestamp of this setup run]*

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
[Populate from live API response in STEP 2]
For each agent: name, role, terminal number, specialization, coordinates_with

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

---

## STEP 3b — UPDATE HARNESS.md WITH CURSOR REFERENCE (if it exists)

If `HARNESS.md` exists in the project root, add this "Cursor Quick Reference" section
at the end (merge, don't overwrite):

```markdown
---

## 🖥️ Cursor IDE Quick Reference

For Cursor users, see `.cursor/harness.md` for:
- Live agent definitions fetched from the server
- Quick curl command reference
- Cursor-specific workflow examples

### Cursor Setup Files
| File | Purpose |
|------|---------|
| `.cursorrules` | Cursor IDE behavior and HARNESS compliance rules |
| `.cursor/harness.md` | Auto-populated API reference (live from server) |
| `.cursor/mcp.json` | Optional MCP servers (context7, sequential-thinking) |

### Quick Cursor Commands
```bash
# Select agents for a task
curl -X POST -H "X-API-Key: $HARNESS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"task": "implement user authentication"}' \
  https://harness-d4o0.onrender.com/api/select-agents-harness

# Validate compliance
curl -X POST -H "X-API-Key: $HARNESS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"task": "task", "agents": ["coordinator","security","backend"]}' \
  https://harness-d4o0.onrender.com/api/validate
```
```

---

## STEP 4 — CREATE OR UPDATE .cursorrules

This file tells Cursor AI how to behave in this project. If it exists, merge — do not overwrite.

Create .cursorrules in the project root with this content:

# HARNESS Engineering v3 — Cursor Rules

## Agent System
This project uses HARNESS Engineering v3 multi-agent orchestration.
Reference .cursor/harness.md for full API documentation.

## Before Starting Any Task
Always query the HARNESS REST API to determine which agents are needed:

```bash
# Step 1: Select agents
curl -X POST \
  -H "X-API-Key: $HARNESS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"task": "describe the task here"}' \
  https://harness-d4o0.onrender.com/api/select-agents-harness

# Step 2: Validate compliance
curl -X POST \
  -H "X-API-Key: $HARNESS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"task": "task", "agents": ["coordinator","security","backend"]}' \
  https://harness-d4o0.onrender.com/api/validate
```

## Task Routing by Domain
- authentication  → security, backend, testing
- frontend        → frontend, testing
- backend         → backend, data, testing
- fullstack       → coordinator, architect, security, backend, frontend, testing, devops
- performance     → backend, testing
- infrastructure  → devops, architect, testing

## Agent Personas (load definition before executing)
Each agent has a full definition on the server. Load it when you activate that agent:
curl -H "X-API-Key: $HARNESS_API_KEY" https://harness-d4o0.onrender.com/api/agents/{name}

- coordinator: Master orchestrator, routes tasks, resolves conflicts
- architect:   System design, dependency layers, factory patterns
- security:    Auth, encryption, zero-trust, threat modeling
- backend:     APIs, services, reliability (99.9% uptime target)
- frontend:    UI/UX, WCAG 2.1 AA accessibility, <3s load times
- data:        Database design, schema migrations, AES-256-GCM encryption
- testing:     TDD (RED-GREEN-REFACTOR), ≥80% unit, ≥70% integration coverage
- devops:      CI/CD, zero-downtime deployments, infrastructure as code

## HARNESS Compliance Rules (enforce on every task)
- AGENT_COORDINATION_REQUIRED    — never use a single agent
- SECURITY_REVIEW_REQUIRED       — security agent mandatory for auth/sensitive data
- TESTING_REQUIRED               — testing agent mandatory for all implementation
- 8-STEP_VALIDATION              — syntax → type → lint → security → test → performance → docs → integration
- DEPENDENCY_LAYER_ENFORCEMENT   — PAGES → COMPONENTS → API ROUTES → SERVICES → CORE → INFRASTRUCTURE → TYPES
- FACTORY_PATTERN_COMPLIANCE     — all LLM via createLLMConnection(), all auth via AuthGateway

## Parallelism Note
Cursor does not support native subagents. The HARNESS REST server handles
parallelism internally — when you call /api/select-agents-harness, the server
determines parallel vs sequential execution. You execute the result sequentially
in Cursor following the returned coordination_strategy.

## Code Quality Standards
- TypeScript strict mode always
- Zod schemas for all API inputs
- Error boundaries on all async operations
- No console.log in production code

---

## STEP 5 — CONFIGURE MCP SERVERS (Optional but recommended)

If you want MCP servers available in Cursor (for context7, sequential-thinking, etc.),
create .cursor/mcp.json:

{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"]
    },
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    }
  }
}

Note: HARNESS itself is a REST API and does NOT go in mcp.json — it is called
via terminal/curl, not as an MCP tool.

---

## STEP 6 — ENVIRONMENT VARIABLES

Check if these are set. If not, provide instructions — do NOT set them yourself.

Required:
  HARNESS_API_KEY    — authenticates all /api calls
  HARNESS_MCP_URL    — https://harness-d4o0.onrender.com

If missing, add to ~/.zshrc or ~/.bashrc:
  export HARNESS_API_KEY=your_key_here
  export HARNESS_MCP_URL=https://harness-d4o0.onrender.com

Then: source ~/.zshrc

---

## STEP 7 — HOW TO USE HARNESS IN CURSOR

### Option A — Ask Cursor AI directly
Type in Cursor chat:
  "Using HARNESS, implement user authentication system"
  "HARNESS: build responsive dashboard with dark mode"
  "HARNESS security audit of the payment flow"

Cursor AI will:
1. Read .cursorrules to understand HARNESS context
2. Run curl commands in the terminal to select agents and validate
3. Load agent definitions from the server
4. Execute the task following HARNESS compliance rules

### Option B — Terminal CLI
If the repo is cloned locally:
  ./harness "implement user authentication system"
  ./harness "build responsive dashboard" --interactive

### Option C — Multi-stream (parallel workstreams)
Since Cursor doesn't support native parallel agents, open multiple Cursor windows
or terminal tabs, each working on an independent stream:
  Terminal 1: ./harness "implement auth" --branch="feature/auth"
  Terminal 2: ./harness "build dashboard" --branch="feature/dashboard"

---

## STEP 8 — VERIFICATION

Run these checks and report results:

[ ] .cursorrules exists in project root with HARNESS routing rules
[ ] .cursor/harness.md exists with live agent data
[ ] HARNESS_API_KEY is set in environment
[ ] HARNESS_MCP_URL is set in environment
[ ] curl /health returns {"status":"healthy"}
[ ] curl /api/agents returns agent list (requires API key)
[ ] Cursor AI correctly calls select-agents-harness when given a HARNESS task
[ ] All 6 compliance rules confirmed

Report: fresh install or update, what changed, what was correct, any missing items.

---

## WHAT IS HARNESS (reference)

HARNESS Engineering v3 is a multi-agent orchestration methodology for structured software development.
8 specialized agents coordinate on tasks, enforce quality gates, and follow strict architectural
compliance rules. Agent definitions live on the REST server and are fetched at runtime.

Key principles:
- Agent-Driven:    each domain has a specialized agent with clear responsibilities
- Parallel First:  independent tasks execute simultaneously (handled server-side)
- Quality Gated:   all work passes 8-step validation before completion
- Security First:  secure patterns and fail-safe mechanisms throughout
- Evidence-Based:  all decisions supported by measurable outcomes

The server is a REST API (not a native MCP server). Cursor accesses it via terminal curl calls.
Parallelism is orchestrated inside the REST server, not at the Cursor AI layer.
```

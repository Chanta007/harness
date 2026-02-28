# Multi-Agent Claude Code Usage

## Quick Start (3 commands)

### 1. Debug Issues (Multi-Agent)
```bash
./scripts/quick-debug.sh
# Then: /task "Debug auth failures" --delegate --persona-security --think-hard
```

### 2. Build Features (Multi-Agent)
```bash
./scripts/quick-build.sh
# Then: /task "Build user dashboard" --delegate --wave-mode --persona-frontend --persona-backend
```

### 3. Review Systems (Multi-Agent)
```bash
./scripts/quick-review.sh
# Then: /task "Security audit" --delegate --persona-security --validate
```

## Multi-Agent Benefits

✅ **Parallel Execution**: Multiple agents work simultaneously
✅ **Specialized Expertise**: Each agent focuses on their domain
✅ **Automatic Coordination**: Coordinator manages task distribution
✅ **Context Sharing**: Agents share relevant findings
✅ **Systematic Approach**: Follow Harness Engineering patterns

## Individual Agent Sessions

Start specialized agents directly:

```bash
./scripts/claude-agents/security.sh      # Security specialist
./scripts/claude-agents/architect.sh     # Architecture specialist
./scripts/claude-agents/frontend.sh      # Frontend specialist
./scripts/claude-agents/backend.sh       # Backend specialist
./scripts/claude-agents/testing.sh       # Testing specialist
./scripts/claude-agents/devops.sh        # DevOps specialist
```

## Task Delegation Commands

From any coordinator session:

| Task Type | Command |
|-----------|---------|
| **Security debugging** | `/task "Debug auth" --delegate --persona-security --think-hard` |
| **Architecture analysis** | `/task "Review patterns" --delegate --persona-architect --ultrathink` |
| **Feature development** | `/task "Build component" --delegate --wave-mode --persona-frontend` |
| **Performance optimization** | `/task "Optimize queries" --delegate --persona-performance --parallel-focus` |
| **System review** | `/task "Audit system" --delegate --wave-mode --all-agents` |

## Delegation Modes

- `--delegate` - Enable multi-agent delegation
- `--parallel-focus` - Parallel execution by focus area
- `--wave-mode` - Progressive multi-stage coordination
- `--all-agents` - Comprehensive multi-domain analysis

This system provides **true multi-agent workflows** with parallel execution and specialized expertise.

#!/bin/bash
# Multi-Agent Claude Code Setup Script
# Creates true multi-agent workflow with parallel delegation

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

echo -e "${BLUE}🤖 Setting up Multi-Agent Claude Code Workflows${NC}"

# Create multi-agent command templates
mkdir -p scripts/claude-agents

echo -e "${PURPLE}📝 Creating Multi-Agent Command Templates${NC}"

# Master coordinator command
cat > scripts/claude-agents/coordinator.sh << 'EOF'
#!/bin/bash
# Multi-Agent Coordinator - Route tasks to specialized agents
echo "🎯 Starting Multi-Agent Coordinator"
echo "Usage: Start master session, then delegate tasks to specialized agents"
echo ""
echo "Example commands:"
echo "/task 'Debug authentication system' --delegate --parallel-focus --persona-security"
echo "/task 'Review system architecture' --delegate --parallel-dirs --persona-architect"
echo "/task 'Build new feature' --delegate --wave-mode --persona-frontend --persona-backend"
echo ""
echo "The coordinator will:"
echo "1. Analyze task complexity"
echo "2. Spawn appropriate specialized agents"
echo "3. Coordinate parallel execution"
echo "4. Aggregate results"
echo ""
claude --session coordinator
EOF

# Security agent command
cat > scripts/claude-agents/security.sh << 'EOF'
#!/bin/bash
# Security Agent - Authentication, encryption, compliance
echo "🛡️ Starting Security Agent"
echo "Auto-loading security documentation..."
claude --session security-agent << 'CLAUDE_EOF'
/load docs/agents/security.md
/load docs/CONSTRAINTS.md
echo "Security agent ready for:"
echo "- Authentication debugging"
echo "- Security audits"
echo "- Compliance checking"
echo "- Vulnerability assessment"
CLAUDE_EOF
EOF

# Architecture agent command
cat > scripts/claude-agents/architect.sh << 'EOF'
#!/bin/bash
# Architecture Agent - System design, patterns, long-term decisions
echo "🏗️ Starting Architecture Agent"
echo "Auto-loading architecture documentation..."
claude --session architect-agent << 'CLAUDE_EOF'
/load docs/agents/architect.md
/load docs/design/core-architecture.md
/load docs/CONSTRAINTS.md
echo "Architecture agent ready for:"
echo "- System design decisions"
echo "- Pattern enforcement"
echo "- Dependency analysis"
echo "- Long-term planning"
CLAUDE_EOF
EOF

# Frontend agent command
cat > scripts/claude-agents/frontend.sh << 'EOF'
#!/bin/bash
# Frontend Agent - UI/UX, components, user experience
echo "🎨 Starting Frontend Agent"
echo "Auto-loading frontend documentation..."
claude --session frontend-agent << 'CLAUDE_EOF'
/load docs/agents/frontend.md
echo "Frontend agent ready for:"
echo "- UI component development"
echo "- Responsive design"
echo "- Accessibility compliance"
echo "- User experience optimization"
echo ""
echo "Enhanced with Magic MCP for component generation"
CLAUDE_EOF
EOF

# Backend agent command
cat > scripts/claude-agents/backend.sh << 'EOF'
#!/bin/bash
# Backend Agent - APIs, services, data processing
echo "💾 Starting Backend Agent"
echo "Auto-loading backend documentation..."
claude --session backend-agent << 'CLAUDE_EOF'
/load docs/agents/backend.md
/load docs/agents/data.md
echo "Backend agent ready for:"
echo "- API development"
echo "- Database operations"
echo "- Service integration"
echo "- Performance optimization"
CLAUDE_EOF
EOF

# Testing agent command
cat > scripts/claude-agents/testing.sh << 'EOF'
#!/bin/bash
# Testing Agent - TDD, quality assurance, validation
echo "✅ Starting Testing Agent"
echo "Auto-loading testing documentation..."
claude --session testing-agent << 'CLAUDE_EOF'
/load docs/agents/testing.md
echo "Testing agent ready for:"
echo "- TDD workflows"
echo "- Quality assurance"
echo "- Test strategy design"
echo "- Validation processes"
echo ""
echo "Enhanced with Playwright for E2E testing"
CLAUDE_EOF
EOF

# DevOps agent command
cat > scripts/claude-agents/devops.sh << 'EOF'
#!/bin/bash
# DevOps Agent - Build, deploy, infrastructure
echo "📦 Starting DevOps Agent"
echo "Auto-loading DevOps documentation..."
claude --session devops-agent << 'CLAUDE_EOF'
/load docs/agents/devops.md
echo "DevOps agent ready for:"
echo "- Build process optimization"
echo "- Deployment strategies"
echo "- Infrastructure management"
echo "- CI/CD pipeline setup"
CLAUDE_EOF
EOF

# Make all agent scripts executable
chmod +x scripts/claude-agents/*.sh

echo -e "${GREEN}✅ Multi-agent scripts created!${NC}"

# Create quick workflow commands
echo -e "${PURPLE}🚀 Creating Quick Workflow Commands${NC}"

cat > scripts/quick-debug.sh << 'EOF'
#!/bin/bash
# Quick Debug Workflow - Multi-agent debugging
echo "🔍 Starting Multi-Agent Debug Workflow"
echo ""
echo "This will start a coordinator and delegate debugging tasks"
echo ""

# Start coordinator with pre-loaded debug context
claude --session debug-coordinator << 'CLAUDE_EOF'
/load docs/HARNESS.md
/load docs/CONSTRAINTS.md
/load docs/agents/coordinator.md

echo "🎯 Debug Coordinator Ready"
echo ""
echo "Example multi-agent debug commands:"
echo "  /task 'Debug auth failures' --delegate --persona-security --think-hard"
echo "  /task 'Analyze performance issues' --delegate --persona-performance --parallel-focus"
echo "  /task 'Review error patterns' --delegate --wave-mode --persona-analyzer"
echo ""
echo "The coordinator will automatically:"
echo "1. Spawn specialized debugging agents"
echo "2. Coordinate parallel investigation"
echo "3. Aggregate findings"
echo "4. Provide systematic solutions"
CLAUDE_EOF
EOF

cat > scripts/quick-build.sh << 'EOF'
#!/bin/bash
# Quick Build Workflow - Multi-agent feature development
echo "🚀 Starting Multi-Agent Build Workflow"

claude --session build-coordinator << 'CLAUDE_EOF'
/load docs/agents/coordinator.md
/load docs/agents/architect.md
/load docs/agents/frontend.md
/load docs/agents/backend.md

echo "🏗️ Build Coordinator Ready"
echo ""
echo "Example multi-agent build commands:"
echo "  /task 'Build user dashboard' --delegate --wave-mode --persona-frontend --persona-backend"
echo "  /task 'Implement API endpoints' --delegate --persona-backend --persona-security"
echo "  /task 'Create responsive components' --delegate --persona-frontend --magic"
echo ""
echo "The coordinator will automatically:"
echo "1. Analyze feature requirements"
echo "2. Spawn frontend and backend agents"
echo "3. Coordinate parallel development"
echo "4. Ensure integration compatibility"
CLAUDE_EOF
EOF

cat > scripts/quick-review.sh << 'EOF'
#!/bin/bash
# Quick Review Workflow - Multi-agent system analysis
echo "📊 Starting Multi-Agent Review Workflow"

claude --session review-coordinator << 'CLAUDE_EOF'
/load docs/HARNESS.md
/load docs/CONSTRAINTS.md
/load docs/agents/

echo "🔍 Review Coordinator Ready"
echo ""
echo "Example multi-agent review commands:"
echo "  /task 'Review system architecture' --delegate --wave-mode --persona-architect --ultrathink"
echo "  /task 'Security audit' --delegate --persona-security --persona-analyzer --validate"
echo "  /task 'Performance analysis' --delegate --persona-performance --parallel-focus"
echo ""
echo "The coordinator will automatically:"
echo "1. Spawn appropriate specialist agents"
echo "2. Coordinate comprehensive analysis"
echo "3. Cross-validate findings"
echo "4. Generate actionable reports"
CLAUDE_EOF
EOF

chmod +x scripts/quick-*.sh

echo -e "${GREEN}✅ Quick workflow scripts created!${NC}"

# Create simple usage guide
cat > MULTI_AGENT_USAGE.md << 'EOF'
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
EOF

echo -e "${YELLOW}📚 Created MULTI_AGENT_USAGE.md guide${NC}"

echo -e "${GREEN}🎉 Multi-Agent Claude Code Setup Complete!${NC}"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo "1. Run: ./scripts/quick-debug.sh (for debugging)"
echo "2. Run: ./scripts/quick-build.sh (for development)"
echo "3. Run: ./scripts/quick-review.sh (for analysis)"
echo ""
echo -e "${PURPLE}Or start individual agents:${NC}"
echo "./scripts/claude-agents/coordinator.sh"
echo "./scripts/claude-agents/security.sh"
echo "./scripts/claude-agents/architect.sh"
echo ""
echo -e "${YELLOW}📖 See MULTI_AGENT_USAGE.md for detailed examples${NC}"
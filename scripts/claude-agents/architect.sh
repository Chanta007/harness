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

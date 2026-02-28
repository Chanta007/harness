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

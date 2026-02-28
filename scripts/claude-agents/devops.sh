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

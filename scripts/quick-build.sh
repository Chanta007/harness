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

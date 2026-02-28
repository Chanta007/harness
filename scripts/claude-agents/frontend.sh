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

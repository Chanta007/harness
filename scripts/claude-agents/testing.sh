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

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

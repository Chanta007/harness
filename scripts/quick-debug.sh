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

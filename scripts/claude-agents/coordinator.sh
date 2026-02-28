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

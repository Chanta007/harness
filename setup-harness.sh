#!/bin/bash

# Harness Engineering v3 - One-Time Setup Script
#
# Configures the ultra-simple orchestrator for natural language development

set -e

echo "🚀 Setting up Harness Engineering v3 Orchestrator..."
echo

# Check Node.js dependency
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed"
    echo "   Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check Claude Code dependency
if ! command -v claude &> /dev/null; then
    echo "❌ Claude Code is required but not installed"
    echo "   Please install Claude Code from https://claude.ai/code"
    exit 1
fi

# Create workspace directory
mkdir -p .harness-workspace
echo "✅ Created workspace directory"

# Verify agent documentation exists
if [ ! -d "docs/agents" ]; then
    echo "⚠️  Agent documentation not found at docs/agents/"
    echo "   Using fallback agent definitions..."
    mkdir -p docs/agents

    # Create basic agent definitions if they don't exist
    cat > docs/agents/architect.md << 'EOF'
# Architecture Agent

**Role**: Systems design and long-term architecture planning

**Specializations**:
- System architecture design
- Dependency management
- Scalability planning
- Technical debt assessment

**Capabilities**:
- Architectural analysis and recommendations
- Design pattern implementation
- System integration planning
- Performance architecture optimization
EOF

    cat > docs/agents/security.md << 'EOF'
# Security Agent

**Role**: Security analysis, threat modeling, and compliance

**Specializations**:
- Authentication and authorization
- Security vulnerability assessment
- Compliance verification
- Threat modeling

**Capabilities**:
- Security code review
- OAuth/JWT implementation
- RBAC system design
- Security best practices enforcement
EOF

    cat > docs/agents/frontend.md << 'EOF'
# Frontend Agent

**Role**: User interface development and user experience

**Specializations**:
- React/Vue/Angular development
- Responsive design implementation
- Accessibility compliance
- UI component creation

**Capabilities**:
- Component development
- State management
- CSS/styling implementation
- User interaction design
EOF

    cat > docs/agents/backend.md << 'EOF'
# Backend Agent

**Role**: Server-side development and API implementation

**Specializations**:
- API development
- Database integration
- Business logic implementation
- Performance optimization

**Capabilities**:
- REST/GraphQL API development
- Database schema design
- Service layer implementation
- Error handling and logging
EOF

    cat > docs/agents/testing.md << 'EOF'
# Testing Agent

**Role**: Quality assurance and test implementation

**Specializations**:
- Unit test development
- Integration testing
- E2E test automation
- Test coverage analysis

**Capabilities**:
- Test case creation
- Test automation setup
- Quality metrics tracking
- Bug detection and reporting
EOF

    echo "✅ Created basic agent definitions"
fi

# Validate harness script
if [ ! -f "harness" ]; then
    echo "❌ Harness orchestrator script not found"
    exit 1
fi

# Make harness script executable
chmod +x harness
echo "✅ Harness orchestrator configured"

# Test basic functionality
echo
echo "🧪 Testing orchestrator..."
./harness --help > /dev/null
echo "✅ Orchestrator test passed"

echo
echo "🎯 Harness Engineering v3 Setup Complete!"
echo
echo "Usage Examples:"
echo "  ./harness \"implement user authentication with OAuth\""
echo "  ./harness \"fix performance issues in the API\""
echo "  ./harness \"add real-time chat functionality\""
echo "  ./harness \"build a todo app with React and Node.js\""
echo
echo "🚀 Ready to orchestrate intelligent development!"
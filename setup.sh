#!/bin/bash
# Harness Engineering v3 Template Setup Script
# Initializes a new project with multi-agent system

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_ROOT"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Harness Engineering v3: Template Setup${NC}"
echo -e "${PURPLE}Initializing multi-agent TDD development system...${NC}"

# Check prerequisites
echo -e "${YELLOW}🔍 Checking prerequisites...${NC}"

if ! command -v tmux &> /dev/null; then
    echo -e "${RED}❌ tmux is not installed. Please install tmux first:${NC}"
    echo "  macOS: brew install tmux"
    echo "  Ubuntu: sudo apt-get install tmux"
    echo "  CentOS: sudo yum install tmux"
    exit 1
fi

if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ git is not installed. Please install git first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites check passed${NC}"

# Make scripts executable
echo -e "${YELLOW}🔧 Making scripts executable...${NC}"
chmod +x scripts/harness-terminals-v3.sh
chmod +x scripts/terminal-aliases-v3.sh

# Initialize git if not already initialized
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}📦 Initializing git repository...${NC}"
    git init
    git add .
    git commit -m "Initial commit: Harness Engineering v3 template setup

- 8-terminal multi-agent system
- TDD-driven development workflows
- Cross-terminal coordination protocols
- Hyper-focused agent responsibilities"
else
    echo -e "${CYAN}📦 Git repository already exists${NC}"
fi

# Create project-specific directories
echo -e "${YELLOW}📁 Creating project directories...${NC}"
mkdir -p {src,lib,components,tests,docs/project}

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    echo -e "${YELLOW}📝 Creating .gitignore...${NC}"
    cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnpm-store/

# Build outputs
dist/
build/
.next/
out/

# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
logs/

# Runtime
.tmp/
.cache/

# Testing
coverage/
.nyc_output/

# Harness Engineering
.harness-session/
EOF
fi

# Interactive project customization
echo ""
echo -e "${BLUE}📋 Project Customization${NC}"
echo -e "${CYAN}Let's customize this template for your project...${NC}"

read -p "Project name: " PROJECT_NAME
read -p "Project description: " PROJECT_DESCRIPTION
read -p "Primary language (javascript/typescript/python/other): " PRIMARY_LANG
read -p "Primary framework (react/vue/angular/express/django/other): " PRIMARY_FRAMEWORK

# Update CLAUDE.md with project info
echo -e "${YELLOW}📝 Updating CLAUDE.md with project information...${NC}"
sed -i.bak "s/\[PROJECT_NAME\]/$PROJECT_NAME/g" CLAUDE.md
sed -i.bak "s/\[Brief description of your project\]/$PROJECT_DESCRIPTION/g" CLAUDE.md
rm CLAUDE.md.bak

# Create package.json for Node.js projects
if [[ "$PRIMARY_LANG" == "javascript" || "$PRIMARY_LANG" == "typescript" ]]; then
    if [ ! -f "package.json" ]; then
        echo -e "${YELLOW}📦 Creating package.json...${NC}"
        cat > package.json << EOF
{
  "name": "$(echo $PROJECT_NAME | tr '[:upper:]' '[:lower:]' | sed 's/ /-/g')",
  "version": "1.0.0",
  "description": "$PROJECT_DESCRIPTION",
  "scripts": {
    "dev": "echo 'Add your dev command here'",
    "build": "echo 'Add your build command here'",
    "test": "echo 'Add your test command here'",
    "lint": "echo 'Add your lint command here'",
    "type-check": "echo 'Add your type-check command here'",
    "harness:start": "./scripts/harness-terminals-v3.sh",
    "harness:aliases": "source scripts/terminal-aliases-v3.sh"
  },
  "keywords": ["harness-engineering", "tdd", "multi-agent"],
  "license": "MIT"
}
EOF
    fi
fi

# Create project overview document
echo -e "${YELLOW}📋 Creating project documentation...${NC}"
cat > docs/project/overview.md << EOF
# $PROJECT_NAME

> $PROJECT_DESCRIPTION

## Harness Engineering v3 Integration

This project uses the 8-terminal multi-agent system for TDD-driven development:

- **Terminal 1**: Master Coordinator - Task routing & TDD orchestration
- **Terminal 7**: TDD Specialist - Leads red-green-refactor cycles

## Project Architecture

**Primary Language**: $PRIMARY_LANG
**Primary Framework**: $PRIMARY_FRAMEWORK

### Key Components

[Document your project's key components here]

### Development Workflow

1. Start multi-agent system: \`./scripts/harness-terminals-v3.sh\`
2. Access TDD Specialist: \`t7\`
3. Begin feature with failing test: \`/tdd-red --requirement "feature name"\`
4. Implement via domain terminals
5. Validate and refactor

## Quick Commands

\`\`\`bash
# Start development
npm run dev

# Run tests
npm test

# TDD workflow
t7  # Access TDD terminal
\`\`\`

## Domain Customization

[Document how you've customized the terminal responsibilities for your project]

EOF

# Terminal customization prompts
echo ""
echo -e "${PURPLE}🎯 Terminal Customization${NC}"
echo -e "${CYAN}Which terminals are most important for your project?${NC}"
echo "1. Architecture Enforcer (T2) - Patterns and system design"
echo "2. Security Guardian (T3) - Authentication and security"
echo "3. Data Schema Specialist (T4) - Database and data modeling"
echo "4. Knowledge & Search (T5) - Search, RAG, AI features"
echo "5. Component Engineer (T6) - UI/UX and frontend"
echo "6. Build & Deploy (T8) - CI/CD and deployment"

read -p "Enter terminal numbers in priority order (e.g., 2,6,4): " TERMINAL_PRIORITY

echo ""
echo -e "${GREEN}✅ Harness Engineering v3 setup complete!${NC}"
echo ""
echo -e "${BLUE}🎮 Next Steps:${NC}"
echo "1. Start the multi-agent system:"
echo -e "   ${CYAN}./scripts/harness-terminals-v3.sh${NC}"
echo ""
echo "2. Load terminal aliases (optional):"
echo -e "   ${CYAN}source scripts/terminal-aliases-v3.sh${NC}"
echo ""
echo "3. Begin development with TDD:"
echo -e "   ${CYAN}t7  # Access TDD Specialist${NC}"
echo -e "   ${CYAN}/tdd-red --requirement \"your first feature\"${NC}"
echo ""
echo "4. Customize terminals for your domain:"
echo -e "   ${CYAN}Edit docs/agents/[terminal-name].md${NC}"
echo ""
echo -e "${PURPLE}📚 Documentation:${NC}"
echo -e "   ${CYAN}docs/README-v3-8terminal.md${NC} - System overview"
echo -e "   ${CYAN}docs/workflows/tdd-coordination.md${NC} - TDD workflows"
echo -e "   ${CYAN}docs/project/overview.md${NC} - Project-specific docs"
echo ""
echo -e "${GREEN}🚀 Happy multi-agent development!${NC}"
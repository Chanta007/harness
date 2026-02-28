# Harness Engineering v3: 8-Terminal TDD Multi-Agent System Template

> **Production-Ready Multi-Agent Development Framework**: Template repository for implementing TDD-driven parallel development workflows with specialized AI agents

## 🎯 Overview

This template provides a complete multi-agent development system based on **Harness Engineering v3** methodology. It enables teams to implement Test-Driven Development (TDD) with 8 specialized AI agents working in parallel, each with hyper-focused responsibilities and clear coordination protocols.

### **Key Benefits**

- 🔄 **TDD-First Development**: Dedicated Terminal 7 leads red-green-refactor cycles
- ⚡ **Hyper-Focused Agents**: 50-100 lines of focused documentation per agent (vs 150+ monolithic)
- 🚀 **Parallel Efficiency**: Up to 4 simultaneous TDD workflows with conflict resolution
- 📋 **Systematic Coordination**: Cross-terminal protocols prevent scope creep and ensure consistency
- 🎯 **Faster Decision Making**: Single-responsibility agents make decisions in their domain quickly

## 🏗️ Architecture: 8-Terminal System

| Terminal | Agent Role | Primary Focus | Cycle Time |
|----------|------------|---------------|------------|
| **T1** | Master Coordinator | Task routing & TDD orchestration | N/A |
| **T2** | Architecture Enforcer | Patterns & boundaries ONLY | 5-15min |
| **T3** | Security Guardian | Auth & encryption ONLY | 5-15min |
| **T4** | Data Schema Specialist | Database schema ONLY | 5-15min |
| **T5** | Knowledge & Search Agent | RAG & embeddings ONLY | 5-15min |
| **T6** | Component Engineer | React components ONLY | 5-15min |
| **T7** | TDD & Testing Specialist | RED-GREEN-REFACTOR cycles | 2-5min |
| **T8** | Build & Deploy Validator | Build & deployment ONLY | 5-15min |

### **TDD Workflow Pattern**
```
T7: Write failing test (2-5 min)
  ↓
T1: Route to appropriate implementation terminal
  ↓
T2-T6,T8: Write minimal code to pass test (5-15 min)
  ↓
T7: Validate GREEN + collaborate on REFACTOR (5-10 min)
  ↓
Cycle complete (<20 min total)
```

## 🚀 Quick Start

### **Prerequisites**

1. **Claude Code** installed and configured
2. **tmux** installed (`brew install tmux` on macOS)
3. **Node.js 18+** (if working with Node.js projects)
4. **Git** for version control

### **Step 1: Clone Template**

```bash
# Option A: Use this template for a new project
git clone <this-repo-url> your-project-name
cd your-project-name

# Option B: Add to existing project
git clone <this-repo-url> temp-harness
cp -r temp-harness/docs temp-harness/scripts your-existing-project/
rm -rf temp-harness
```

### **Step 2: Initialize Multi-Agent System**

```bash
# Make scripts executable
chmod +x scripts/harness-terminals-v3.sh
chmod +x scripts/terminal-aliases-v3.sh

# Start all 8 terminals
./scripts/harness-terminals.sh

# Load terminal aliases (optional)
source scripts/terminal-aliases-v3.sh
```

### **Step 3: Project Analysis & Setup**

```bash
# Access Master Coordinator (Terminal 1)
tmux attach -t coordinator

# In Claude Code, start with project analysis
/analyze @. --comprehensive --harness-setup
```

## 📖 Using the System

### **For New Projects: Complete Setup Workflow**

#### **Phase 1: Project Analysis (T1 + All Terminals)**
```bash
# Terminal 1 (Master Coordinator)
/analyze @. --project-structure --dependencies --architecture

# This triggers systematic analysis across all terminals:
# T2: Architecture patterns and dependency analysis
# T3: Security requirements and threat model
# T4: Data modeling and storage requirements
# T5: Knowledge base and search requirements
# T6: UI/UX requirements and component needs
# T7: Testing strategy and TDD planning
# T8: Build and deployment requirements
```

#### **Phase 2: Planning & Documentation (T1 Coordination)**
```bash
# Create project-specific documentation
/document --create-harness-docs --project-specific

# Generated files:
# docs/project/
#   ├── project-overview.md
#   ├── architecture-decisions.md
#   ├── domain-responsibilities.md
#   ├── testing-strategy.md
#   └── deployment-plan.md
```

#### **Phase 3: Implementation (TDD-Driven Development)**
```bash
# Terminal 7 (TDD Specialist) - Start first feature
/tdd-cycle --requirement "User authentication system"

# This triggers the TDD workflow:
# T7: Write failing auth test
# T1: Route to T3 (Security Guardian)
# T3: Implement minimal auth to pass test
# T7: Validate GREEN, coordinate refactor with T3
# Cycle complete, ready for next feature
```

### **For Existing Projects: Integration Workflow**

#### **Phase 1: Project Assessment**
```bash
# Terminal 1: Analyze existing codebase
/analyze @. --existing-project --integration-points

# Identifies:
# - Current architecture patterns
# - Testing coverage gaps
# - Security vulnerabilities
# - Performance bottlenecks
# - Technical debt areas
```

#### **Phase 2: Gradual Integration**
```bash
# Start with one domain (e.g., add tests to existing feature)
# T7: Add tests for critical business logic
# T2: Refactor architecture for better patterns
# T3: Add security hardening
# T8: Improve build and deployment pipeline
```

#### **Phase 3: Parallel Enhancement**
```bash
# Multiple TDD cycles for different areas
# Workflow A: T7 + T5 (improve search functionality)
# Workflow B: T7 + T6 (enhance UI components)
# Workflow C: T7 + T3 (strengthen security)
```

## 🔧 Configuration

### **Terminal Customization**

Edit terminal roles for your project domain:

```bash
# Edit agent focus areas in:
docs/agents/[terminal-name].md

# Update routing logic in:
docs/orchestration/master-coordinator.md

# Modify TDD coordination for your stack:
docs/workflows/tdd-coordination.md
```

### **Project-Specific Adaptations**

```bash
# Backend-focused project
# Emphasize T2 (Architecture), T3 (Security), T4 (Data Schema)
# Reduce T6 (Component) scope

# Frontend-focused project
# Emphasize T6 (Component), T5 (Search/Content), T7 (TDD)
# Reduce T4 (Data Schema) scope

# DevOps-focused project
# Emphasize T8 (Build/Deploy), T3 (Security), T2 (Architecture)
# Adapt other terminals to infrastructure concerns
```

## 🤖 KIMI 2.5 Model Integration (Novita AI)

### **Setup Instructions**

The Harness Engineering v3 system can use KIMI 2.5 hosted on Novita AI for enhanced reasoning capabilities in Claude Code.

#### **Step 1: Get Novita API Access**
```bash
# 1. Sign up at https://novita.ai
# 2. Navigate to API dashboard
# 3. Create API key for KIMI 2.5 model access
# 4. Note your API endpoint and model ID
```

#### **Step 2: Configure Claude Code for KIMI 2.5**
```bash
# Add to your shell environment (.bashrc/.zshrc)
export NOVITA_API_KEY="your-novita-api-key"
export NOVITA_BASE_URL="https://api.novita.ai/v3/openai"
export KIMI_MODEL_ID="kimi-moonshot-v1-2.5"
```

#### **Step 3: Create Claude Code Configuration**
```bash
# Create ~/.claude-code/config.json
{
  "models": {
    "kimi-2.5": {
      "provider": "openai-compatible",
      "baseURL": "${NOVITA_BASE_URL}",
      "apiKey": "${NOVITA_API_KEY}",
      "model": "${KIMI_MODEL_ID}",
      "contextLength": 200000,
      "capabilities": ["reasoning", "analysis", "code-generation"]
    }
  },
  "harness-engineering": {
    "preferredModels": {
      "analysis": "kimi-2.5",
      "architecture": "kimi-2.5",
      "reasoning": "kimi-2.5",
      "coordination": "claude-sonnet"
    }
  }
}
```

#### **Step 4: Use KIMI 2.5 in Harness Terminals**
```bash
# Terminal-specific model usage

# T1 (Master Coordinator): Use Claude Sonnet for orchestration
# T2 (Architecture): Use KIMI 2.5 for deep architectural analysis
claude-code --model kimi-2.5 --session arch-enforcer

# T3 (Security): Use KIMI 2.5 for security reasoning
claude-code --model kimi-2.5 --session security-guardian

# T5 (Knowledge & Search): Use KIMI 2.5 for RAG optimization
claude-code --model kimi-2.5 --session knowledge-search

# T7 (TDD): Use Claude Sonnet for test coordination
claude-code --model claude-sonnet --session tdd-specialist
```

#### **Step 5: Harness-Specific KIMI Prompts**
```bash
# Add to each terminal's initialization
# T2 (Architecture) with KIMI 2.5
echo "You are an Architecture Enforcer using KIMI 2.5's enhanced reasoning capabilities. Focus on deep architectural analysis, pattern recognition, and system design optimization. Leverage KIMI's 200K context for comprehensive codebase understanding."

# T3 (Security) with KIMI 2.5
echo "You are a Security Guardian powered by KIMI 2.5. Use advanced reasoning for threat modeling, vulnerability analysis, and security architecture design. Apply KIMI's analytical capabilities for comprehensive security assessment."

# T5 (Knowledge & Search) with KIMI 2.5
echo "You are a Knowledge & Search Agent using KIMI 2.5. Leverage advanced reasoning for RAG optimization, embedding strategies, and search algorithm enhancement. Use KIMI's large context for knowledge base analysis."
```

### **Model Selection Strategy**

| Terminal | Recommended Model | Reason |
|----------|------------------|---------|
| **T1** | Claude Sonnet | Best for coordination and rapid decision-making |
| **T2** | KIMI 2.5 | Deep architectural reasoning and pattern analysis |
| **T3** | KIMI 2.5 | Complex security reasoning and threat modeling |
| **T4** | Claude Sonnet | Database schema requires proven reliability |
| **T5** | KIMI 2.5 | Advanced RAG optimization and search algorithms |
| **T6** | Claude Sonnet | Component development needs speed and reliability |
| **T7** | Claude Sonnet | TDD coordination requires fast, consistent responses |
| **T8** | Claude Sonnet | Build/deploy reliability over advanced reasoning |

### **Cost Optimization**
```bash
# Use KIMI 2.5 for analysis-heavy tasks
# Switch to Claude Sonnet for implementation tasks
# Monitor API usage across terminals
# Implement caching for repeated analysis queries
```

## 🎮 Terminal Quick Reference

### **Access Commands**
```bash
# Quick access (after loading aliases)
t1  # Master Coordinator
t2  # Architecture Enforcer
t3  # Security Guardian
t4  # Data Schema Specialist
t5  # Knowledge & Search Agent
t6  # Component Engineer
t7  # TDD Specialist
t8  # Build & Deploy Validator

# TDD shortcuts
tdd-cycle    # Show TDD workflow
tdd-red      # RED phase guidance
tdd-green    # GREEN phase guidance
tdd-refactor # REFACTOR phase guidance
```

### **Management Commands**
```bash
thelp     # Show all terminal descriptions
tlist     # List active sessions
tstatus   # Detailed terminal status
tkill     # Kill all sessions
trestart  # Restart all terminals
```

## 📋 Common Workflows

### **Workflow 1: Add New Feature (TDD-Driven)**
```bash
# 1. T7: Write failing test for feature
/tdd-red --requirement "Add user dashboard"

# 2. T1: Route implementation
# Routes to T6 (Component) for UI dashboard

# 3. T6: Implement minimal dashboard
# 4. T7: Validate test passes (GREEN)
# 5. T6 + T7: Refactor for quality
# 6. Cycle complete
```

### **Workflow 2: Fix Bug (Multi-Terminal)**
```bash
# 1. T7: Write regression test
# 2. T1: Route to appropriate domain terminal
# 3. Domain terminal: Fix bug to pass test
# 4. T7: Validate fix + ensure no breaking changes
# 5. All terminals: Review for related issues
```

### **Workflow 3: Security Hardening**
```bash
# 1. T3: Analyze security vulnerabilities
# 2. T7: Write security tests
# 3. T3: Implement security measures
# 4. T7: Validate security compliance
# 5. T8: Update deployment security
```

### **Workflow 4: Performance Optimization**
```bash
# 1. T8: Identify performance bottlenecks
# 2. T7: Write performance tests
# 3. Route optimization to appropriate terminal:
#    - T2: Architecture optimization
#    - T4: Database query optimization
#    - T5: Search algorithm optimization
#    - T6: Component performance optimization
# 4. T7: Validate performance improvements
```

## 🚨 Troubleshooting

### **Common Issues**

**Terminal won't start**:
```bash
# Check tmux installation
which tmux

# Kill existing sessions and restart
tmux kill-server
./scripts/harness-terminals.sh
```

**Agent confusion about domain**:
- Check `docs/agents/[terminal].md` for clear boundaries
- Update "Does NOT Handle" sections
- Restart affected terminal

**TDD cycles too slow**:
- Review test complexity (should be minimal)
- Check implementation scope (minimal for GREEN phase)
- Optimize terminal coordination protocols

**Conflicts between terminals**:
- Use T1 (Master Coordinator) for conflict resolution
- Implement branch-based isolation for parallel work
- Review domain boundaries in documentation

### **Performance Optimization**

```bash
# Monitor terminal performance
tmonitor

# Optimize for your project size:
# Small project (<1000 files): Use 4-6 terminals
# Medium project (1000-5000 files): Use 6-8 terminals
# Large project (>5000 files): Use all 8 terminals + parallel workflows
```

## 🔗 Advanced Usage

### **Parallel TDD Workflows**
```bash
# Run multiple TDD cycles simultaneously
# Each on different feature branches
# T1 coordinates resource allocation and conflict prevention

# Example: 3 parallel workflows
# Branch: feature/auth → T7a + T3 (authentication)
# Branch: feature/search → T7b + T5 (search optimization)
# Branch: feature/dashboard → T7c + T6 (new UI components)
```

### **Integration with CI/CD**
```bash
# Add Harness validation to CI pipeline
# T8 coordinates with CI/CD systems
# TDD cycles can run in CI environment
# Automated quality gates based on terminal protocols
```

### **Custom Domain Adaptation**
```bash
# Adapt terminals for specific domains:
# E-commerce: Emphasize T6 (UI), T3 (Payment security), T4 (Inventory)
# FinTech: Emphasize T3 (Security), T4 (Transaction data), T8 (Compliance)
# Healthcare: Emphasize T3 (HIPAA), T4 (Patient data), T5 (Medical knowledge)
```

## 📚 Documentation Structure

```
docs/
├── README-v3-8terminal.md          # System overview and design
├── agents/                         # Individual terminal documentation
│   ├── tdd-testing-specialist.md   # T7: TDD workflows and coordination
│   ├── architecture-enforcer.md    # T2: Patterns and boundaries
│   ├── security-guardian.md        # T3: Auth and encryption
│   ├── data-schema-specialist.md   # T4: Database schema
│   ├── knowledge-search-agent.md   # T5: RAG and embeddings
│   ├── component-engineer.md       # T6: React components
│   └── build-deploy-validator.md   # T8: Build and deployment
├── orchestration/
│   └── master-coordinator.md       # T1: Coordination protocols
├── workflows/
│   └── tdd-coordination.md         # Cross-terminal TDD protocols
└── reference/
    └── file-mapping.md              # File responsibility matrix
```

## 🤝 Contributing

This is a template repository. Adapt it for your specific project needs:

1. **Fork** this template for your project
2. **Customize** terminal responsibilities for your domain
3. **Update** documentation to reflect your project's architecture
4. **Share** improvements back to the template community

## 📄 License

MIT License - Adapt freely for your projects

## 🙏 Acknowledgments

- **Harness Engineering Methodology**: Systematic approach to AI-assisted development
- **Claude Code**: Primary development environment for multi-agent coordination
- **TDD Community**: Test-driven development best practices
- **tmux**: Terminal multiplexer enabling parallel agent workflows

---

**Ready to transform your development workflow?** Start with `./scripts/harness-terminals.sh` and experience TDD-driven multi-agent development!
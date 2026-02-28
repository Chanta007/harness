# Contributing to Harness Engineering v3 Template

Thank you for your interest in improving the Harness Engineering v3 multi-agent template!

## 🎯 Template Purpose

This template provides a baseline 8-terminal TDD-driven multi-agent system that can be adapted for any software project. Contributions should focus on improving the general template rather than project-specific features.

## 🤝 How to Contribute

### **Template Improvements**

1. **Agent Documentation**: Enhance terminal documentation in `docs/harness-v2/agents/`
2. **Coordination Protocols**: Improve TDD coordination workflows in `docs/harness-v2/workflows/`
3. **Setup Scripts**: Enhance setup and customization scripts
4. **Documentation**: Improve README, examples, and guides

### **Domain Adaptations**

1. **Language Support**: Add templates for different programming languages
2. **Framework Integration**: Add specific patterns for popular frameworks
3. **Deployment Patterns**: Add CI/CD templates for different platforms
4. **Tool Integration**: Add integration guides for development tools

## 📋 Contribution Guidelines

### **Pull Request Process**

1. **Fork** the template repository
2. **Create** a feature branch: `git checkout -b feature/improvement-name`
3. **Make** your changes with clear commit messages
4. **Test** the template with a sample project
5. **Update** documentation for your changes
6. **Submit** a pull request with detailed description

### **Code Standards**

- **Documentation**: All changes must include updated documentation
- **Testing**: Template changes should be tested with sample projects
- **Clarity**: Focus on clarity and ease of understanding
- **Generality**: Keep contributions general, not project-specific

### **Commit Message Format**

```
type(scope): brief description

Longer description of what changed and why

- Specific change 1
- Specific change 2
```

**Types**: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`
**Scopes**: `agents`, `scripts`, `docs`, `setup`, `coordination`

## 🧪 Testing Contributions

### **Template Testing**

1. **Create** a new test project using your modified template
2. **Run** the setup script: `./setup.sh`
3. **Verify** all 8 terminals start correctly
4. **Test** TDD workflows work as expected
5. **Document** any issues or improvements

### **Example Test Projects**

Test your template improvements with different project types:

- **Frontend**: React/Vue/Angular application
- **Backend**: API server with database
- **Full-stack**: Complete web application
- **CLI Tool**: Command-line application
- **Library**: Reusable code library

## 📖 Documentation Style

### **Writing Guidelines**

- **Clear**: Use simple, direct language
- **Actionable**: Include specific steps and commands
- **Complete**: Cover all necessary information
- **Consistent**: Follow existing formatting patterns

### **Code Examples**

- **Realistic**: Use practical, real-world examples
- **Commented**: Explain complex logic with comments
- **Tested**: Ensure all code examples work correctly
- **Formatted**: Use consistent code formatting

## 🚀 Feature Requests

### **Suggesting Improvements**

1. **Check** existing issues to avoid duplicates
2. **Describe** the problem or opportunity clearly
3. **Propose** a specific solution
4. **Consider** the impact on different project types
5. **Offer** to implement the improvement

### **Priority Areas**

- **Agent Coordination**: Improve cross-terminal workflows
- **TDD Integration**: Enhance test-driven development patterns
- **Setup Automation**: Simplify project initialization
- **Documentation**: Improve guides and examples
- **Tool Integration**: Add support for development tools

## 🛠️ Development Setup

### **Local Development**

```bash
# Clone the template
git clone <your-fork-url>
cd harness-engineering-v3-template

# Make it executable
chmod +x setup.sh
chmod +x scripts/harness-terminals-v3.sh

# Test with a sample project
./setup.sh
```

### **Testing Changes**

```bash
# Create test project
mkdir test-project
cp -r . test-project/
cd test-project

# Run setup and verify everything works
./setup.sh
./scripts/harness-terminals-v3.sh
```

## 📋 Issue Reporting

### **Bug Reports**

Include these details in bug reports:

- **Environment**: OS, terminal, Claude Code version
- **Steps**: Exact steps to reproduce
- **Expected**: What should happen
- **Actual**: What actually happens
- **Logs**: Any error messages or logs

### **Template Issues**

- **Setup Problems**: Issues with setup.sh or initialization
- **Terminal Issues**: Problems with tmux or terminal coordination
- **Documentation**: Unclear or missing documentation
- **Scripts**: Non-working or inefficient scripts

## 🎯 Project Vision

### **Core Principles**

1. **TDD-First**: Everything centers around test-driven development
2. **Agent Focus**: Each terminal has clear, focused responsibilities
3. **Easy Adoption**: Simple to understand and implement
4. **Framework Agnostic**: Works with any technology stack
5. **Scalable**: Grows with project complexity

### **Success Metrics**

- **Adoption**: Template used successfully across different project types
- **Clarity**: New users can set up and use the system quickly
- **Effectiveness**: Teams report improved development velocity
- **Flexibility**: Template adapts to various domains and frameworks

## 💬 Community

### **Getting Help**

- **Issues**: Use GitHub issues for questions and bug reports
- **Discussions**: Use GitHub discussions for general questions
- **Documentation**: Check existing docs first

### **Sharing Success Stories**

We love to hear about successful template usage:

- **Blog Posts**: Write about your experience
- **Case Studies**: Share how you adapted the template
- **Improvements**: Contribute back enhancements you've made

## 🙏 Recognition

Contributors will be recognized in:

- **README**: Contributors section
- **Release Notes**: Credit for specific contributions
- **Documentation**: Attribution for major improvements

Thank you for helping make the Harness Engineering v3 template better for everyone!
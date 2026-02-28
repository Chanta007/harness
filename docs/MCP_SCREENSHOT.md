# Screenshot MCP Integration Guide

Integration guide for Screenshot MCP server in Harness Engineering multi-agent workflows.

## Overview

The Screenshot MCP server provides visual debugging capabilities for multi-agent workflows, enabling:
- **Visual debugging** with screenshot capture and analysis
- **Documentation creation** with annotated step-by-step guides
- **Error investigation** using OCR text extraction from UI elements
- **Multi-platform support** for desktop and window-specific captures

## Installation & Setup

### 1. Install Screenshot MCP Server
```bash
cd mcp-servers/screenshot-mcp
npm install
npm run build
```

### 2. Claude Code Integration
Add to your MCP configuration (`.claude/config.json`):

```json
{
  "mcpServers": {
    "screenshot": {
      "command": "node",
      "args": ["./mcp-servers/screenshot-mcp/dist/index.js"],
      "cwd": "/path/to/harness-engineering-v3-template"
    }
  }
}
```

### 3. Multi-Agent Integration
The Screenshot agent is automatically available via:
```bash
./scripts/claude-agents/screenshot.sh
```

## Multi-Agent Workflow Patterns

### 📸 Visual Debugging Workflow
```bash
# 1. Start screenshot agent
./scripts/claude-agents/screenshot.sh

# 2. Capture error state
/task "Debug login form validation issue" --screenshot --persona-frontend

# 3. Analyze with delegation
/task "Extract error text and validate UI state" --delegate --screenshot-analyze
```

**Agent Coordination:**
- **Screenshot Agent** → Captures visual state and extracts text
- **Frontend Agent** → Analyzes UI behavior and validation logic
- **Analyzer Agent** → Correlates visual evidence with code patterns

### 📝 Documentation Creation Workflow
```bash
# 1. Multi-step documentation with visuals
/task "Create setup guide with screenshots" --delegate --wave-mode --persona-scribe --screenshot-annotate

# 2. Coordinate across phases
# Phase 1: Capture workflow screenshots
# Phase 2: Add annotations and highlights
# Phase 3: Generate documentation with embedded visuals
```

**Agent Coordination:**
- **Screenshot Agent** → Captures each setup step
- **Scribe Agent** → Creates documentation structure and content
- **Coordinator Agent** → Orchestrates multi-phase documentation creation

### 🔍 Investigation & Root Cause Analysis
```bash
# 1. Systematic visual investigation
/task "Investigate production UI anomalies" --delegate --systematic --screenshot --persona-analyzer

# 2. Multi-domain analysis
/task "Correlate visual state with backend logs" --delegate --parallel-focus --screenshot --persona-backend
```

**Agent Coordination:**
- **Screenshot Agent** → Documents visual anomalies
- **Analyzer Agent** → Systematic investigation methodology
- **Backend Agent** → Correlates visual state with server-side behavior

## Integration Commands

### Quick Visual Debugging
```bash
# Single command with screenshot capture
/task "Debug responsive layout on mobile viewport" --screenshot --persona-frontend --window chrome

# With specific analysis
/task "Extract validation error text from modal" --ocr --region "dialog-area" --persona-analyzer
```

### Documentation Generation
```bash
# Annotated step-by-step guides
/task "Document API integration workflow" --screenshot-annotate --persona-scribe --multi-step

# Feature demonstration with visuals
/task "Create feature demo with annotated screenshots" --delegate --persona-frontend --screenshot-demo
```

### Error Investigation
```bash
# Visual error investigation
/task "Investigate checkout flow failures" --screenshot --delegate --persona-qa --multi-capture

# Cross-platform validation
/task "Validate UI consistency across browsers" --screenshot --multi-window --persona-frontend
```

## Available Screenshot Flags

### Core Screenshot Operations
- `--screenshot` - Enable screenshot capture during task execution
- `--screenshot-analyze` - Capture + comprehensive image analysis
- `--screenshot-annotate` - Capture + add visual annotations
- `--ocr` - Extract text using OCR from captured images

### Capture Targeting
- `--window [title]` - Target specific window by title
- `--display [index]` - Multi-monitor support (0, 1, 2, ...)
- `--region [coords]` - Capture specific screen region
- `--multi-capture` - Capture multiple states during workflow

### Analysis Options
- `--extract-text` - OCR text extraction from UI elements
- `--extract-colors` - Color analysis and dominant color detection
- `--extract-ui` - Basic UI element detection and analysis
- `--extract-metadata` - Image metadata and technical information

### Annotation Types
- `--highlight-errors` - Highlight error states and messages
- `--annotate-flow` - Add workflow arrows and step numbers
- `--annotate-text` - Add explanatory text overlays
- `--mark-issues` - Circle or highlight problematic areas

## Agent Combinations

### Frontend + Screenshot
```bash
/task "Debug responsive grid layout" --delegate --persona-frontend --screenshot --multi-viewport
```
**Result**: UI analysis with visual evidence across different screen sizes

### Analyzer + Screenshot
```bash
/task "Investigate authentication flow errors" --delegate --persona-analyzer --screenshot --trace-flow
```
**Result**: Systematic investigation with visual documentation of each step

### Scribe + Screenshot
```bash
/task "Create user onboarding guide" --delegate --persona-scribe --screenshot-annotate --multi-step
```
**Result**: Professional documentation with annotated visual guides

### QA + Screenshot
```bash
/task "Validate cross-browser compatibility" --delegate --persona-qa --screenshot --multi-window
```
**Result**: Testing validation with visual proof across different browsers

## Output Organization

Screenshots are automatically organized in your project:

```
project-root/
├── screenshots/
│   ├── debug-session-2024-01-15/
│   │   ├── error-state-10-30-15.png
│   │   ├── annotated-fix-10-31-20.png
│   │   └── validation-success-10-32-45.png
│   ├── documentation/
│   │   ├── setup-step-1.png
│   │   ├── setup-step-2-annotated.png
│   │   └── final-result.png
│   └── investigation/
│       ├── before-fix.png
│       ├── during-debug.png
│       └── after-fix.png
```

## Advanced Integration Patterns

### 1. Progressive Documentation
```yaml
Phase_1_Capture:
  - Screenshot each major workflow step
  - Automatic timestamp organization
  - Window-specific captures for complex setups

Phase_2_Analysis:
  - OCR text extraction from UI elements
  - Color and layout analysis for design validation
  - UI element detection for interaction mapping

Phase_3_Annotation:
  - Add explanatory text overlays
  - Highlight important UI elements
  - Create visual flow indicators (arrows, numbering)

Phase_4_Integration:
  - Generate markdown documentation with embedded images
  - Create interactive HTML guides with click regions
  - Export for knowledge base or wiki integration
```

### 2. Multi-Platform Debugging
```yaml
Cross_Browser_Workflow:
  - Capture same workflow in Chrome, Firefox, Safari
  - Extract text and validate consistency
  - Highlight differences for compatibility analysis
  - Generate comparison reports with visual evidence

Mobile_Responsive_Testing:
  - Capture multiple viewport sizes
  - Validate responsive breakpoint behavior
  - Document mobile-specific UI adaptations
  - Create device-specific testing reports
```

### 3. Error Investigation Pipeline
```yaml
Error_Documentation_Workflow:
  - Capture error state immediately when detected
  - Extract error text using OCR for correlation with logs
  - Annotate probable cause areas in UI
  - Create reproduction steps with visual evidence
  - Generate bug reports with embedded screenshots
```

## MCP Integration Best Practices

### 1. Task Coordination
- Use `--delegate` with screenshot flags for agent coordination
- Combine screenshot capabilities with domain-specific personas
- Leverage wave mode for complex multi-step visual documentation

### 2. Performance Optimization
- Use region capture for large screen analysis
- Implement batch processing for multiple screenshot operations
- Cache common annotations and UI element templates

### 3. Quality Standards
- Maintain consistent screenshot naming conventions
- Use appropriate image compression for storage efficiency
- Implement retention policies for screenshot archives

### 4. Security Considerations
- Be mindful of sensitive information in screenshots
- Implement automatic PII detection and blurring
- Use secure storage for screenshots containing confidential data

## Troubleshooting

### Common Issues

**Permission Errors**:
- macOS: Grant accessibility permissions in System Preferences > Security & Privacy
- Windows: Run with elevated permissions for window capture
- Linux: Ensure X11 forwarding or Wayland compatibility

**Window Capture Fails**:
```bash
# List available windows first
/task "List available windows for capture" --list-windows

# Target specific window by exact title
/task "Capture VS Code debug session" --window "Visual Studio Code" --persona-backend
```

**OCR Accuracy Issues**:
- Use high-contrast themes for better text extraction
- Capture at higher resolutions when possible
- Use region-specific extraction for targeted text analysis

### Performance Tips

**Large Screenshot Operations**:
- Use region capture for specific areas instead of full desktop
- Implement image compression for storage optimization
- Consider batch processing for multiple screenshot analysis

**Multi-Window Workflows**:
- Use window listing to identify exact window titles
- Implement delays between window switches for proper focus
- Use display-specific capture for multi-monitor setups

---

## Integration Benefits

✅ **Visual Context** - Provides visual evidence for all debugging and documentation workflows
✅ **Agent Coordination** - Seamlessly integrates with all existing multi-agent personas
✅ **Documentation Quality** - Enhances documentation with professional annotated visuals
✅ **Investigation Capability** - Enables systematic visual investigation workflows
✅ **Multi-Platform Support** - Works across desktop environments and window managers
✅ **Automation Friendly** - Fully scriptable and integration-ready for CI/CD workflows

This Screenshot MCP integration transforms the Harness Engineering multi-agent system by adding visual intelligence to all workflows, enabling better debugging, documentation, and investigation capabilities.
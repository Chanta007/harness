#!/usr/bin/env node

/**
 * Harness Engineering v3 MCP Server
 * Central methodology and agent coordination service
 * Deployed on render.com for global access
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

// Health check endpoint for render.com
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'harness-mcp-server',
    version: process.env.HARNESS_VERSION || '3.0.0',
    timestamp: new Date().toISOString()
  });
});

// Get HARNESS.md methodology
app.get('/api/methodology', async (req, res) => {
  try {
    const methodologyPath = path.join(__dirname, '..', 'HARNESS.md');
    const methodology = await fs.readFile(methodologyPath, 'utf8');
    res.json({
      content: methodology,
      version: '3.0.0',
      updated: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load methodology' });
  }
});

// Get agent definitions
app.get('/api/agents', async (req, res) => {
  try {
    const agentsDir = path.join(__dirname, '..', 'agents');
    const agentFiles = await fs.readdir(agentsDir);
    const agents = {};

    for (const file of agentFiles.filter(f => f.endsWith('.json'))) {
      const agentPath = path.join(agentsDir, file);
      const agentData = JSON.parse(await fs.readFile(agentPath, 'utf8'));
      const agentName = file.replace('.json', '');
      agents[agentName] = agentData;
    }

    res.json({ agents, count: Object.keys(agents).length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load agents' });
  }
});

// Validate task against methodology
app.post('/api/validate', async (req, res) => {
  try {
    const { task, agents, context } = req.body;

    // Load validation rules
    const rulesPath = path.join(__dirname, '..', 'validation', 'rules.json');
    const rules = JSON.parse(await fs.readFile(rulesPath, 'utf8'));

    // Perform validation
    const validation = {
      compliant: true,
      violations: [],
      recommendations: [],
      required_agents: []
    };

    // Check agent coordination requirement
    if (!agents || agents.length === 0) {
      validation.compliant = false;
      validation.violations.push('AGENT_COORDINATION_REQUIRED: No agents selected');
    }

    // Check security requirements for auth tasks
    if (task.toLowerCase().includes('auth') && !agents.includes('security')) {
      validation.compliant = false;
      validation.violations.push('SECURITY_REVIEW_REQUIRED: Authentication tasks require security agent');
      validation.required_agents.push('security');
    }

    // Check testing requirements for implementation tasks
    if (task.toLowerCase().includes('implement') && !agents.includes('testing')) {
      validation.compliant = false;
      validation.violations.push('TESTING_REQUIRED: Implementation tasks require testing agent');
      validation.required_agents.push('testing');
    }

    res.json(validation);
  } catch (error) {
    res.status(500).json({ error: 'Validation failed', details: error.message });
  }
});

// Agent selection via LLM
app.post('/api/select-agents', async (req, res) => {
  try {
    const { task, context, screenshot_analysis } = req.body;

    // Load available agents
    const agentsDir = path.join(__dirname, '..', 'agents');
    const agentFiles = await fs.readdir(agentsDir);
    const availableAgents = {};

    for (const file of agentFiles.filter(f => f.endsWith('.json'))) {
      const agentPath = path.join(agentsDir, file);
      const agentData = JSON.parse(await fs.readFile(agentPath, 'utf8'));
      const agentName = file.replace('.json', '');
      availableAgents[agentName] = agentData;
    }

    // Simple agent selection logic (can be enhanced with actual LLM call)
    const selectedAgents = [];
    const taskLower = task.toLowerCase();

    // Rule-based selection
    if (taskLower.includes('auth') || taskLower.includes('security')) {
      selectedAgents.push('security');
    }
    if (taskLower.includes('ui') || taskLower.includes('component') || taskLower.includes('frontend')) {
      selectedAgents.push('frontend');
    }
    if (taskLower.includes('api') || taskLower.includes('backend') || taskLower.includes('server')) {
      selectedAgents.push('backend');
    }
    if (taskLower.includes('test') || taskLower.includes('implement')) {
      selectedAgents.push('testing');
    }
    if (taskLower.includes('architect') || taskLower.includes('design') || taskLower.includes('system')) {
      selectedAgents.push('architect');
    }

    // Always include coordinator for complex tasks
    if (selectedAgents.length > 1) {
      selectedAgents.unshift('coordinator');
    }

    res.json({
      selectedAgents,
      reasoning: `Selected based on task keywords: ${taskLower}`,
      availableAgents: Object.keys(availableAgents)
    });
  } catch (error) {
    res.status(500).json({ error: 'Agent selection failed', details: error.message });
  }
});

// Upload and analyze screenshots
app.post('/api/analyze-screenshot', async (req, res) => {
  try {
    const { image_data, task_context } = req.body;

    // For now, return mock analysis
    // In production, this would integrate with Novita.com vision models
    const analysis = {
      detected_elements: ['UI components', 'error messages', 'code structure'],
      suggestions: ['Consider responsive design', 'Accessibility improvements needed'],
      context_enhancement: `Screenshot shows ${task_context} with visual elements that suggest UI development task`,
      confidence: 0.85
    };

    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: 'Screenshot analysis failed', details: error.message });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Harness MCP Server running on port ${PORT}`);
  console.log(`📚 Methodology endpoint: /api/methodology`);
  console.log(`🤖 Agents endpoint: /api/agents`);
  console.log(`✅ Validation endpoint: /api/validate`);
  console.log(`🧠 Agent selection endpoint: /api/select-agents`);
  console.log(`📷 Screenshot analysis endpoint: /api/analyze-screenshot`);
});

module.exports = app;
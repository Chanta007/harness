#!/usr/bin/env node

/**
 * Harness Engineering v3 MCP Server
 * Central methodology and agent coordination service
 * Deployed on render.com for global access
 *
 * SECURITY FEATURES:
 * - Rate limiting (DoS protection)
 * - Timing-safe API key comparison
 * - Comprehensive security logging
 * - Case-insensitive header handling
 * - Minimal error disclosure
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable trust proxy for Render.com (critical for rate limiting)
app.set('trust proxy', true);

// Security logging function
function logSecurityEvent(event, req, details = {}) {
  const timestamp = new Date().toISOString();
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('User-Agent') || 'unknown';
  const method = req.method;
  const url = req.originalUrl;

  console.log(`[SECURITY] ${timestamp} - ${event} - IP: ${ip} - ${method} ${url} - UA: ${userAgent}`, details);
}

// Rate limiting middleware (DoS protection)
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests',
    message: 'Rate limit exceeded. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logSecurityEvent('RATE_LIMIT_EXCEEDED', req, {
      limit: 100,
      window: '15min'
    });
    res.status(429).json({
      error: 'Too many requests',
      message: 'Rate limit exceeded. Please try again later.'
    });
  },
  // Skip rate limiting for health checks
  skip: (req) => req.path === '/health'
});

// Strict rate limiting for API routes
const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 API requests per windowMs
  message: {
    error: 'API rate limit exceeded',
    message: 'Too many API requests. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logSecurityEvent('API_RATE_LIMIT_EXCEEDED', req, {
      limit: 50,
      window: '15min'
    });
    res.status(429).json({
      error: 'API rate limit exceeded',
      message: 'Too many API requests. Please try again later.'
    });
  }
});

// Apply rate limiting
app.use(authRateLimit);

// Middleware
app.use(cors());
app.use(express.json({
  limit: '10mb',
  strict: true
}));
app.use(express.static('public'));

// Enhanced API Key authentication middleware (HARNESS.md compliance + Security Gateway Pattern)
function validateApiKey(req, res, next) {
  // Case-insensitive header handling
  const apiKey = req.headers['x-api-key'] ||
                 req.headers['X-API-Key'] ||
                 req.headers['X-Api-Key'] ||
                 req.headers['x-API-key'];

  const expectedKey = process.env.HARNESS_API_KEY;

  // Log authentication attempt
  logSecurityEvent('AUTH_ATTEMPT', req, {
    hasApiKey: !!apiKey,
    hasExpectedKey: !!expectedKey,
    apiKeyLength: apiKey ? apiKey.length : 0
  });

  if (!expectedKey) {
    logSecurityEvent('AUTH_DEV_MODE', req, {
      warning: 'HARNESS_API_KEY not configured'
    });
    console.warn('⚠️ HARNESS_API_KEY not configured - running in development mode');
    return next(); // Allow in dev mode when no key is set
  }

  if (!apiKey) {
    logSecurityEvent('AUTH_MISSING_KEY', req, {
      status: 401,
      reason: 'no_api_key_provided'
    });
    return res.status(401).json({
      error: 'Authentication required',
      message: 'Access denied'
    });
  }

  // Constant-time comparison to prevent timing attacks
  const keyBuffer = Buffer.from(apiKey, 'utf8');
  const expectedBuffer = Buffer.from(expectedKey, 'utf8');

  // Ensure buffers are same length for timing safety
  if (keyBuffer.length !== expectedBuffer.length) {
    logSecurityEvent('AUTH_INVALID_KEY', req, {
      status: 403,
      reason: 'key_length_mismatch',
      providedLength: keyBuffer.length,
      expectedLength: expectedBuffer.length
    });

    // Still perform timing-safe comparison to prevent length-based attacks
    crypto.timingSafeEqual(keyBuffer, Buffer.alloc(keyBuffer.length));

    return res.status(403).json({
      error: 'Authentication failed',
      message: 'Access denied'
    });
  }

  // Timing-safe comparison
  const isValid = crypto.timingSafeEqual(keyBuffer, expectedBuffer);

  if (!isValid) {
    logSecurityEvent('AUTH_INVALID_KEY', req, {
      status: 403,
      reason: 'key_mismatch'
    });

    return res.status(403).json({
      error: 'Authentication failed',
      message: 'Access denied'
    });
  }

  // Successful authentication
  logSecurityEvent('AUTH_SUCCESS', req, {
    status: 200,
    authenticated: true
  });

  next();
}

// Apply API key validation and stricter rate limiting to all /api routes
app.use('/api', apiRateLimit, validateApiKey);

// Health check endpoint for render.com (no auth required)
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
    logSecurityEvent('API_ACCESS', req, {
      endpoint: '/api/methodology',
      action: 'methodology_request'
    });

    const methodologyPath = path.join(__dirname, '..', 'HARNESS.md');
    const methodology = await fs.readFile(methodologyPath, 'utf8');

    res.json({
      content: methodology,
      version: '3.0.0',
      updated: new Date().toISOString()
    });

    logSecurityEvent('API_SUCCESS', req, {
      endpoint: '/api/methodology',
      status: 200,
      contentSize: methodology.length
    });
  } catch (error) {
    logSecurityEvent('API_ERROR', req, {
      endpoint: '/api/methodology',
      error: error.message,
      status: 500
    });

    res.status(500).json({
      error: 'Service temporarily unavailable',
      message: 'Unable to process request'
    });
  }
});

// Get agent definitions
app.get('/api/agents', async (req, res) => {
  try {
    logSecurityEvent('API_ACCESS', req, {
      endpoint: '/api/agents',
      action: 'agents_request'
    });

    const agentsDir = path.join(__dirname, '..', 'agents');
    const agentFiles = await fs.readdir(agentsDir);
    const agents = {};

    for (const file of agentFiles.filter(f => f.endsWith('.json'))) {
      const agentPath = path.join(agentsDir, file);
      const agentData = JSON.parse(await fs.readFile(agentPath, 'utf8'));
      const agentName = file.replace('.json', '');
      agents[agentName] = agentData;
    }

    const response = { agents, count: Object.keys(agents).length };
    res.json(response);

    logSecurityEvent('API_SUCCESS', req, {
      endpoint: '/api/agents',
      status: 200,
      agentCount: response.count
    });
  } catch (error) {
    logSecurityEvent('API_ERROR', req, {
      endpoint: '/api/agents',
      error: error.message,
      status: 500
    });

    res.status(500).json({
      error: 'Service temporarily unavailable',
      message: 'Unable to process request'
    });
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
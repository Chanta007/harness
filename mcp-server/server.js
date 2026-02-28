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

// Secure trust proxy configuration for Render.com (prevents IP spoofing)
// Render.com uses exactly 3 proxy layers - only trust the legitimate proxy chain
app.set('trust proxy', 3);

// Security logging function
function logSecurityEvent(event, req, details = {}) {
  const timestamp = new Date().toISOString();
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('User-Agent') || 'unknown';
  const method = req.method;
  const url = req.originalUrl;

  console.log(`[SECURITY] ${timestamp} - ${event} - IP: ${ip} - ${method} ${url} - UA: ${userAgent}`, details);
}

// Rate limiting middleware (DoS protection with IP spoofing protection)
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests',
    message: 'Rate limit exceeded. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Custom key generator to prevent port-based bypasses and ensure clean IP extraction
  keyGenerator: (req) => {
    // Extract IP and remove port if present
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const cleanIp = ip.split(':').slice(-1)[0]; // Remove IPv6 port notation
    logSecurityEvent('RATE_LIMIT_KEY_GENERATED', req, {
      rawIp: ip,
      cleanIp: cleanIp,
      userAgent: req.get('User-Agent')?.substring(0, 50)
    });
    return cleanIp;
  },
  handler: (req, res) => {
    logSecurityEvent('RATE_LIMIT_EXCEEDED', req, {
      limit: 100,
      window: '15min',
      ip: req.ip
    });
    res.status(429).json({
      error: 'Too many requests',
      message: 'Rate limit exceeded. Please try again later.'
    });
  },
  // Skip rate limiting for health checks
  skip: (req) => req.path === '/health'
});

// Strict rate limiting for API routes with enhanced security
const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 API requests per windowMs
  message: {
    error: 'API rate limit exceeded',
    message: 'Too many API requests. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Custom key generator to prevent port-based bypasses
  keyGenerator: (req) => {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const cleanIp = ip.split(':').slice(-1)[0];
    return cleanIp;
  },
  handler: (req, res) => {
    logSecurityEvent('API_RATE_LIMIT_EXCEEDED', req, {
      limit: 50,
      window: '15min',
      ip: req.ip,
      endpoint: req.originalUrl
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

// Security validation endpoint - shows current client IP (development only)
app.get('/debug/client-ip', (req, res) => {
  // Only enable in development or with explicit debug flag
  if (process.env.NODE_ENV === 'production' && !process.env.ENABLE_IP_DEBUG) {
    return res.status(404).json({ error: 'Not found' });
  }

  logSecurityEvent('IP_DEBUG_REQUEST', req, {
    headers: req.headers,
    connection: req.connection.remoteAddress,
    socket: req.socket.remoteAddress
  });

  res.json({
    clientIp: req.ip,
    rawConnection: req.connection.remoteAddress,
    xForwardedFor: req.headers['x-forwarded-for'],
    xRealIp: req.headers['x-real-ip'],
    trustProxy: req.app.get('trust proxy'),
    warning: 'This endpoint is for development debugging only'
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

// HARNESS Agent Registry - Core agent definitions
const HARNESS_AGENTS = {
  coordinator: {
    name: 'Master Coordinator Agent',
    role: 'Integration Orchestrator',
    file: 'docs/agents/coordinator.md',
    terminal: 1,
    responsibilities: ['Task routing', 'Conflict resolution', 'Integration validation'],
    coordinates_with: ['all'],
    tools: ['*'],
    specialization: 'Multi-terminal workflow orchestration and system integration'
  },
  architect: {
    name: 'Architecture Guardian Agent',
    role: 'Architecture Enforcer',
    file: 'docs/agents/architect.md',
    terminal: 2,
    responsibilities: ['Dependency validation', 'Factory patterns', 'System design'],
    coordinates_with: ['all'],
    tools: ['Read', 'Edit', 'Sequential', 'Context7'],
    specialization: 'Architecture patterns and dependency compliance'
  },
  security: {
    name: 'Security Enforcer Agent',
    role: 'Security Validator',
    file: 'docs/agents/security.md',
    terminal: 3,
    responsibilities: ['Authentication', 'Encryption', 'Compliance'],
    coordinates_with: ['backend', 'testing'],
    tools: ['Read', 'Edit', 'Bash', 'Sequential'],
    specialization: 'Security validation and threat mitigation'
  },
  data: {
    name: 'Data Guardian Agent',
    role: 'Data Schema Specialist',
    file: 'docs/agents/data.md',
    terminal: 4,
    responsibilities: ['Database design', 'RAG systems', 'Data integrity'],
    coordinates_with: ['backend', 'security'],
    tools: ['Read', 'Edit', 'Sequential'],
    specialization: 'Database architecture and knowledge systems'
  },
  frontend: {
    name: 'UI Experience Agent',
    role: 'Frontend Specialist',
    file: 'docs/agents/frontend.md',
    terminal: 5,
    responsibilities: ['UI/UX', 'Components', 'Accessibility'],
    coordinates_with: ['testing', 'architect'],
    tools: ['Read', 'Edit', 'Magic', 'Playwright'],
    specialization: 'User interface and experience optimization'
  },
  backend: {
    name: 'API Logic Specialist',
    role: 'Backend Developer',
    file: 'docs/agents/backend.md',
    terminal: 6,
    responsibilities: ['API design', 'Service logic', 'Integration'],
    coordinates_with: ['data', 'security', 'testing'],
    tools: ['Read', 'Edit', 'Context7', 'Sequential'],
    specialization: 'Server-side logic and API development'
  },
  testing: {
    name: 'TDD Testing Specialist',
    role: 'Quality Assurance',
    file: 'docs/agents/testing.md',
    terminal: 7,
    responsibilities: ['Test design', 'Quality gates', 'Validation'],
    coordinates_with: ['all'],
    tools: ['Read', 'Edit', 'Bash', 'Playwright', 'Sequential'],
    specialization: 'Test-driven development and quality assurance'
  },
  devops: {
    name: 'Build & Deploy Validator',
    role: 'DevOps Specialist',
    file: 'docs/agents/devops.md',
    terminal: 8,
    responsibilities: ['Build validation', 'CI/CD', 'Deployment'],
    coordinates_with: ['testing', 'security'],
    tools: ['Read', 'Edit', 'Bash', 'Sequential'],
    specialization: 'Build systems and deployment automation'
  }
};

// Enhanced agent parser for markdown files
function parseAgentDefinition(content) {
  const lines = content.split('\n');
  const result = {
    capabilities: [],
    coordination_rules: [],
    validation_checklist: [],
    commands: [],
    domains: []
  };

  let currentSection = '';
  for (const line of lines) {
    if (line.startsWith('## ') || line.startsWith('### ')) {
      currentSection = line.replace(/^#{2,3} /, '').toLowerCase();
    }
    if (currentSection.includes('responsibilities') && line.trim().startsWith('- ')) {
      result.capabilities.push(line.replace(/^- \*?\*?/, '').replace(/\*?\*?:.*/, ''));
    }
    if (currentSection.includes('coordination') && line.trim().startsWith('- ')) {
      result.coordination_rules.push(line.replace(/^- /, ''));
    }
    if (line.trim().startsWith('□')) {
      result.validation_checklist.push(line.replace(/^□ /, ''));
    }
    if (line.trim().startsWith('/')) {
      result.commands.push(line.trim());
    }
    if (currentSection.includes('domains') && line.includes('**') && line.includes('(`')) {
      const domain = line.match(/\*\*([^*]+)\*\*.*\(`([^`]+)`/);
      if (domain) {
        result.domains.push({ name: domain[1], path: domain[2] });
      }
    }
  }
  return result;
}

// HARNESS Agents endpoint - List all available agents
app.get('/api/agents', async (req, res) => {
  try {
    logSecurityEvent('API_ACCESS', req, {
      endpoint: '/api/agents',
      action: 'harness_agents_request'
    });

    const agents = {};
    for (const [agentName, agentConfig] of Object.entries(HARNESS_AGENTS)) {
      try {
        const agentPath = path.join(__dirname, '..', agentConfig.file);
        const content = await fs.readFile(agentPath, 'utf8');
        const parsed = parseAgentDefinition(content);

        agents[agentName] = {
          ...agentConfig,
          status: 'available',
          parsed_capabilities: parsed
        };
      } catch (fileError) {
        agents[agentName] = {
          ...agentConfig,
          status: 'error',
          error: `Agent file not found: ${agentConfig.file}`
        };
      }
    }

    const response = {
      agents,
      count: Object.keys(agents).length,
      methodology: 'HARNESS Engineering v3',
      version: '3.0.0'
    };
    res.json(response);

    logSecurityEvent('API_SUCCESS', req, {
      endpoint: '/api/agents',
      status: 200,
      agentCount: response.count,
      methodology: 'harness_v3'
    });
  } catch (error) {
    logSecurityEvent('API_ERROR', req, {
      endpoint: '/api/agents',
      error: error.message,
      status: 500
    });

    res.status(500).json({
      error: 'Service temporarily unavailable',
      message: 'Unable to load HARNESS agents'
    });
  }
});

// Individual agent endpoint - Get specific agent definition
app.get('/api/agents/:agent_name', async (req, res) => {
  try {
    const agentName = req.params.agent_name;

    logSecurityEvent('API_ACCESS', req, {
      endpoint: `/api/agents/${agentName}`,
      action: 'single_agent_request'
    });

    if (!HARNESS_AGENTS[agentName]) {
      return res.status(404).json({
        error: 'Agent not found',
        message: `Agent '${agentName}' is not defined in HARNESS methodology`,
        available_agents: Object.keys(HARNESS_AGENTS)
      });
    }

    const agentConfig = HARNESS_AGENTS[agentName];

    try {
      const agentPath = path.join(__dirname, '..', agentConfig.file);
      const content = await fs.readFile(agentPath, 'utf8');
      const parsed = parseAgentDefinition(content);

      const response = {
        name: agentName,
        ...agentConfig,
        content: content,
        parsed_capabilities: parsed,
        status: 'available',
        last_updated: new Date().toISOString()
      };

      res.json(response);

      logSecurityEvent('API_SUCCESS', req, {
        endpoint: `/api/agents/${agentName}`,
        status: 200,
        agent_loaded: agentName
      });
    } catch (fileError) {
      logSecurityEvent('API_ERROR', req, {
        endpoint: `/api/agents/${agentName}`,
        error: `Agent file not found: ${agentConfig.file}`,
        status: 404
      });

      res.status(404).json({
        error: 'Agent definition not found',
        message: `Agent file not accessible: ${agentConfig.file}`,
        agent_config: agentConfig
      });
    }
  } catch (error) {
    logSecurityEvent('API_ERROR', req, {
      endpoint: `/api/agents/${req.params.agent_name}`,
      error: error.message,
      status: 500
    });

    res.status(500).json({
      error: 'Service temporarily unavailable',
      message: 'Unable to load agent definition'
    });
  }
});

// Enhanced agent selection with HARNESS coordination
app.post('/api/select-agents-harness', async (req, res) => {
  try {
    const { task, context = {} } = req.body;

    logSecurityEvent('API_ACCESS', req, {
      endpoint: '/api/select-agents-harness',
      action: 'harness_agent_selection'
    });

    if (!task) {
      return res.status(400).json({
        error: 'Task required',
        message: 'Task description is required for agent selection'
      });
    }

    // Intelligent agent selection based on HARNESS methodology
    const selectedAgents = [];
    const taskLower = task.toLowerCase();

    // Always include Coordinator for multi-agent tasks
    selectedAgents.push('coordinator');

    // Task-specific agent selection following HARNESS patterns
    if (taskLower.includes('auth') || taskLower.includes('security') || taskLower.includes('permission')) {
      selectedAgents.push('security', 'backend', 'testing');
    }

    if (taskLower.includes('frontend') || taskLower.includes('ui') || taskLower.includes('component')) {
      selectedAgents.push('frontend', 'testing');
    }

    if (taskLower.includes('backend') || taskLower.includes('api') || taskLower.includes('service')) {
      selectedAgents.push('backend', 'data', 'testing');
    }

    if (taskLower.includes('database') || taskLower.includes('data') || taskLower.includes('rag')) {
      selectedAgents.push('data', 'backend', 'security');
    }

    if (taskLower.includes('deploy') || taskLower.includes('build') || taskLower.includes('ci/cd')) {
      selectedAgents.push('devops', 'security', 'testing');
    }

    if (taskLower.includes('architecture') || taskLower.includes('design') || taskLower.includes('pattern')) {
      selectedAgents.push('architect');
    }

    // Remove duplicates and get agent details
    const uniqueAgents = [...new Set(selectedAgents)];
    const agentDetails = uniqueAgents.map(agentName => ({
      name: agentName,
      ...HARNESS_AGENTS[agentName]
    }));

    // Determine coordination strategy
    const coordinationStrategy = uniqueAgents.length > 3 ? 'sequential' : 'parallel';

    // Calculate execution order based on dependencies
    const executionOrder = calculateExecutionOrder(uniqueAgents);

    const response = {
      task,
      selected_agents: agentDetails,
      coordination_strategy: coordinationStrategy,
      execution_order: executionOrder,
      methodology: 'HARNESS Engineering v3',
      estimated_duration: estimateTaskDuration(uniqueAgents, task)
    };

    res.json(response);

    logSecurityEvent('API_SUCCESS', req, {
      endpoint: '/api/select-agents-harness',
      status: 200,
      agents_selected: uniqueAgents.length,
      strategy: coordinationStrategy
    });
  } catch (error) {
    logSecurityEvent('API_ERROR', req, {
      endpoint: '/api/select-agents-harness',
      error: error.message,
      status: 500
    });

    res.status(500).json({
      error: 'Service temporarily unavailable',
      message: 'Unable to select agents'
    });
  }
});

// Helper function to calculate execution order
function calculateExecutionOrder(agentNames) {
  const dependencies = {
    coordinator: 0,
    architect: 1,
    security: 2,
    data: 3,
    backend: 4,
    frontend: 5,
    testing: 6,
    devops: 7
  };

  return agentNames.sort((a, b) => dependencies[a] - dependencies[b]);
}

// Helper function to estimate task duration
function estimateTaskDuration(agentNames, task) {
  const baseTime = 15; // minutes
  const agentMultiplier = agentNames.length * 5;
  const complexityMultiplier = task.length > 100 ? 1.5 : 1;

  const estimatedMinutes = Math.round(baseTime + agentMultiplier * complexityMultiplier);
  return `${estimatedMinutes}-${estimatedMinutes + 15} minutes`;
}

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
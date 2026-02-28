#!/usr/bin/env node

/**
 * Novita.com Configuration for Harness Engineering v3
 * LLM model hosting and inference optimization
 */

const NOVITA_CONFIG = {
  // Primary model for agent selection and task analysis
  primary_model: {
    model_id: 'moonshot-ai/kimi-k2.5',
    endpoint: 'https://api.novita.ai/v3/openai/chat/completions',
    context_window: 128000,
    use_cases: ['agent_selection', 'task_analysis', 'validation'],
    cost_per_token: 0.000002, // Example pricing
    fallback: 'gpt-4-turbo-preview'
  },

  // Secondary models for specialized tasks
  models: {
    'moonshot-ai/kimi-k2.5': {
      specialization: 'general_reasoning',
      context_window: 128000,
      strengths: ['long_context', 'multimodal', 'code_analysis']
    },
    'anthropic/claude-3-haiku': {
      specialization: 'fast_responses',
      context_window: 200000,
      strengths: ['speed', 'efficiency', 'structured_output']
    },
    'openai/gpt-4-turbo-preview': {
      specialization: 'complex_reasoning',
      context_window: 128000,
      strengths: ['problem_solving', 'creative_tasks', 'code_generation']
    }
  },

  // Routing configuration for different operations
  routing: {
    agent_selection: {
      primary: 'moonshot-ai/kimi-k2.5',
      fallback: 'anthropic/claude-3-haiku',
      max_tokens: 4000,
      temperature: 0.3
    },
    screenshot_analysis: {
      primary: 'moonshot-ai/kimi-k2.5', // Multimodal capable
      fallback: 'openai/gpt-4-vision-preview',
      max_tokens: 2000,
      temperature: 0.1
    },
    task_validation: {
      primary: 'anthropic/claude-3-haiku', // Fast and structured
      fallback: 'moonshot-ai/kimi-k2.5',
      max_tokens: 1500,
      temperature: 0.0
    },
    complex_reasoning: {
      primary: 'openai/gpt-4-turbo-preview',
      fallback: 'moonshot-ai/kimi-k2.5',
      max_tokens: 8000,
      temperature: 0.4
    }
  },

  // Cost optimization settings
  cost_optimization: {
    enable_caching: true,
    cache_duration: 3600, // 1 hour
    batch_requests: true,
    max_batch_size: 10,
    fallback_on_rate_limit: true,
    prefer_cheaper_models: true
  },

  // Performance settings
  performance: {
    timeout: 30000, // 30 seconds
    retry_attempts: 3,
    retry_delay: 1000, // 1 second
    parallel_requests: 5,
    circuit_breaker_threshold: 5
  }
};

/**
 * Create optimized LLM client for Novita.com
 */
class NovitaLLMClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://api.novita.ai/v3/openai';
    this.cache = new Map();
    this.circuitBreaker = {
      failures: 0,
      lastFailure: null,
      isOpen: false
    };
  }

  async selectModel(operation, complexity = 'medium') {
    const routing = NOVITA_CONFIG.routing[operation];
    if (!routing) {
      return NOVITA_CONFIG.primary_model.model_id;
    }

    // Circuit breaker check
    if (this.circuitBreaker.isOpen) {
      const timeSinceLastFailure = Date.now() - this.circuitBreaker.lastFailure;
      if (timeSinceLastFailure < 60000) { // 1 minute cooldown
        return routing.fallback;
      } else {
        this.circuitBreaker.isOpen = false;
        this.circuitBreaker.failures = 0;
      }
    }

    // Cost optimization: prefer cheaper models for simple tasks
    if (complexity === 'simple' && NOVITA_CONFIG.cost_optimization.prefer_cheaper_models) {
      return routing.fallback;
    }

    return routing.primary;
  }

  async complete(operation, messages, options = {}) {
    try {
      const modelId = await this.selectModel(operation, options.complexity);
      const routing = NOVITA_CONFIG.routing[operation] || {};

      // Check cache first
      const cacheKey = `${operation}:${JSON.stringify(messages)}:${modelId}`;
      if (NOVITA_CONFIG.cost_optimization.enable_caching && this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey);
        if (Date.now() - cached.timestamp < NOVITA_CONFIG.cost_optimization.cache_duration * 1000) {
          return cached.result;
        }
      }

      const requestBody = {
        model: modelId,
        messages: messages,
        max_tokens: options.max_tokens || routing.max_tokens || 4000,
        temperature: options.temperature !== undefined ? options.temperature : routing.temperature || 0.3,
        stream: false
      };

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody),
        signal: AbortSignal.timeout(NOVITA_CONFIG.performance.timeout)
      });

      if (!response.ok) {
        throw new Error(`Novita API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      // Cache successful results
      if (NOVITA_CONFIG.cost_optimization.enable_caching) {
        this.cache.set(cacheKey, {
          result,
          timestamp: Date.now()
        });
      }

      // Reset circuit breaker on success
      this.circuitBreaker.failures = 0;

      return result;
    } catch (error) {
      // Circuit breaker logic
      this.circuitBreaker.failures++;
      this.circuitBreaker.lastFailure = Date.now();
      if (this.circuitBreaker.failures >= NOVITA_CONFIG.performance.circuit_breaker_threshold) {
        this.circuitBreaker.isOpen = true;
      }

      throw error;
    }
  }

  async analyzeScreenshot(imageData, taskContext) {
    const messages = [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Analyze this screenshot in the context of: ${taskContext}\n\nProvide structured analysis including:\n1. UI elements detected\n2. Technical context (framework, error states, etc.)\n3. Actionable recommendations\n4. Agent suggestions for Harness Engineering system`
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:image/jpeg;base64,${imageData}`
            }
          }
        ]
      }
    ];

    return this.complete('screenshot_analysis', messages, { complexity: 'medium' });
  }

  async selectAgents(taskDescription, availableAgents, context = {}) {
    const messages = [
      {
        role: 'system',
        content: `You are the Harness Engineering v3 agent selection system. Select the most appropriate agents for the given task based on their capabilities and the task requirements.

Available agents: ${JSON.stringify(availableAgents, null, 2)}

Selection criteria:
1. Task type and complexity
2. Required domain expertise
3. Harness methodology compliance
4. Multi-agent coordination patterns

Always follow these rules:
- Security agent required for authentication/sensitive tasks
- Testing agent required for implementation tasks
- Coordinator agent for complex multi-agent tasks
- Architecture agent for system design tasks`
      },
      {
        role: 'user',
        content: `Task: ${taskDescription}\n\nContext: ${JSON.stringify(context, null, 2)}\n\nSelect optimal agents and provide reasoning.`
      }
    ];

    return this.complete('agent_selection', messages, { complexity: 'medium' });
  }
}

module.exports = {
  NOVITA_CONFIG,
  NovitaLLMClient
};
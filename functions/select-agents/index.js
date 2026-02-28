/**
 * Digital Ocean Serverless Function: Agent Selection
 * Analyzes task description and selects appropriate AI agents
 */

const axios = require('axios');

// Agent definitions with capabilities and triggers
const AGENTS = {
  coordinator: {
    capabilities: ['task-routing', 'multi-agent-coordination', 'conflict-resolution'],
    triggers: ['complex', 'multi-domain', 'coordination']
  },
  architect: {
    capabilities: ['system-design', 'architecture-patterns', 'scalability'],
    triggers: ['architect', 'design', 'system', 'structure', 'scalability']
  },
  security: {
    capabilities: ['threat-modeling', 'authentication', 'encryption', 'compliance'],
    triggers: ['auth', 'security', 'login', 'encrypt', 'secure', 'vulnerability']
  },
  frontend: {
    capabilities: ['ui-components', 'responsive-design', 'accessibility', 'user-experience'],
    triggers: ['ui', 'component', 'frontend', 'interface', 'responsive', 'form', 'button']
  },
  backend: {
    capabilities: ['apis', 'databases', 'services', 'integration', 'performance'],
    triggers: ['api', 'database', 'backend', 'server', 'endpoint', 'service']
  },
  testing: {
    capabilities: ['test-automation', 'quality-assurance', 'validation', 'coverage'],
    triggers: ['test', 'quality', 'validation', 'coverage', 'bug', 'fix']
  },
  devops: {
    capabilities: ['deployment', 'ci-cd', 'infrastructure', 'monitoring'],
    triggers: ['deploy', 'infrastructure', 'ci', 'cd', 'docker', 'kubernetes']
  }
};

/**
 * Analyze task complexity
 */
function assessComplexity(taskDescription) {
  const complexityIndicators = [
    'authentication', 'database', 'api', 'security', 'performance',
    'integration', 'testing', 'deployment', 'architecture', 'scalability'
  ];

  const matches = complexityIndicators.filter(indicator =>
    taskDescription.toLowerCase().includes(indicator)
  ).length;

  if (matches >= 3) return 'high';
  if (matches >= 1) return 'medium';
  return 'low';
}

/**
 * Select agents based on task analysis
 */
function selectAgents(taskDescription, complexity) {
  const taskLower = taskDescription.toLowerCase();
  const selectedAgents = [];
  const reasoning = [];

  // Check each agent's triggers
  for (const [agentName, agent] of Object.entries(AGENTS)) {
    const matches = agent.triggers.filter(trigger =>
      taskLower.includes(trigger)
    ).length;

    if (matches > 0) {
      selectedAgents.push(agentName);
      reasoning.push(`${agentName}: matched ${matches} triggers (${agent.triggers.filter(t => taskLower.includes(t)).join(', ')})`);
    }
  }

  // Always include coordinator for multi-agent tasks
  if (selectedAgents.length > 1 && !selectedAgents.includes('coordinator')) {
    selectedAgents.unshift('coordinator');
    reasoning.unshift('coordinator: multi-agent coordination required');
  }

  // Include testing for implementation tasks
  if ((taskLower.includes('implement') || taskLower.includes('build') || taskLower.includes('create'))
      && !selectedAgents.includes('testing')) {
    selectedAgents.push('testing');
    reasoning.push('testing: implementation requires quality validation');
  }

  // Include security for auth-related tasks
  if ((taskLower.includes('user') || taskLower.includes('login') || taskLower.includes('auth'))
      && !selectedAgents.includes('security')) {
    selectedAgents.push('security');
    reasoning.push('security: user authentication requires security review');
  }

  return {
    selectedAgents: selectedAgents.length > 0 ? selectedAgents : ['coordinator'],
    reasoning: reasoning.join('; '),
    confidence: selectedAgents.length > 0 ? 0.85 : 0.5
  };
}

/**
 * Call Novita AI for advanced agent selection (optional enhancement)
 */
async function enhanceWithLLM(taskDescription, initialSelection) {
  if (!process.env.NOVITA_API_KEY) {
    return initialSelection;
  }

  try {
    const prompt = `Analyze this development task and suggest the most appropriate AI agents:

Task: "${taskDescription}"

Available agents:
${Object.entries(AGENTS).map(([name, agent]) =>
  `- ${name}: ${agent.capabilities.join(', ')}`
).join('\n')}

Initial selection: ${initialSelection.selectedAgents.join(', ')}

Respond with JSON:
{
  "agents": ["agent1", "agent2"],
  "reasoning": "explanation of selection",
  "confidence": 0.9
}`;

    const response = await axios.post('https://api.novita.ai/v3/openai/chat/completions', {
      model: 'meta-llama/llama-3.1-8b-instruct',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200,
      temperature: 0.1
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.NOVITA_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    const llmResult = JSON.parse(response.data.choices[0].message.content);

    return {
      selectedAgents: llmResult.agents || initialSelection.selectedAgents,
      reasoning: llmResult.reasoning || initialSelection.reasoning,
      confidence: llmResult.confidence || initialSelection.confidence,
      enhanced: true
    };
  } catch (error) {
    console.warn('LLM enhancement failed, using rule-based selection:', error.message);
    return initialSelection;
  }
}

/**
 * Main handler function
 */
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { task, context, screenshot_analysis } = req.body;

    if (!task || typeof task !== 'string') {
      return res.status(400).json({ error: 'Task description is required' });
    }

    // Assess complexity
    const complexity = assessComplexity(task);

    // Rule-based agent selection
    const initialSelection = selectAgents(task, complexity);

    // Enhance with LLM if available
    const finalSelection = await enhanceWithLLM(task, initialSelection);

    // Add context from screenshot analysis if available
    let enhancedReasoning = finalSelection.reasoning;
    if (screenshot_analysis && screenshot_analysis.detected_elements) {
      enhancedReasoning += ` | Screenshot context: ${screenshot_analysis.detected_elements.join(', ')}`;
    }

    const result = {
      selectedAgents: finalSelection.selectedAgents,
      reasoning: enhancedReasoning,
      confidence: finalSelection.confidence,
      complexity,
      taskId: `task_${Date.now()}`,
      availableAgents: Object.keys(AGENTS),
      enhanced: finalSelection.enhanced || false,
      timestamp: new Date().toISOString()
    };

    console.log(`Agent selection completed: ${finalSelection.selectedAgents.join(', ')} for task: "${task}"`);

    return res.status(200).json(result);

  } catch (error) {
    console.error('Agent selection error:', error);
    return res.status(500).json({
      error: 'Agent selection failed',
      details: error.message
    });
  }
}
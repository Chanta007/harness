/**
 * Digital Ocean Serverless Function: Screenshot Analysis
 * Analyzes screenshots for visual context in development tasks
 */

const axios = require('axios');

/**
 * Analyze screenshot with vision model
 */
async function analyzeWithVision(base64Image, taskContext) {
  if (!process.env.NOVITA_API_KEY) {
    throw new Error('NOVITA_API_KEY not configured');
  }

  const prompt = `Analyze this screenshot in the context of: ${taskContext}

Provide a structured analysis including:
1. UI elements detected (buttons, forms, navigation, etc.)
2. Technical context (framework indicators, error states, performance issues)
3. Development opportunities (improvements needed, bugs visible)
4. Agent recommendations for Harness Engineering system

Respond in JSON format:
{
  "detected_elements": ["element1", "element2"],
  "technical_context": "description of technical aspects",
  "development_opportunities": ["opportunity1", "opportunity2"],
  "suggested_agents": ["agent1", "agent2"],
  "confidence": 0.9
}`;

  try {
    const response = await axios.post('https://api.novita.ai/v3/openai/chat/completions', {
      model: 'meta-llama/llama-3.2-11b-vision-instruct',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 400,
      temperature: 0.1
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.NOVITA_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    const content = response.data.choices[0].message.content;

    // Try to parse JSON response
    try {
      return JSON.parse(content);
    } catch (parseError) {
      // Fallback if response isn't valid JSON
      return {
        detected_elements: ['UI elements detected'],
        technical_context: content.substring(0, 200),
        development_opportunities: ['Analysis available'],
        suggested_agents: ['frontend'],
        confidence: 0.7,
        raw_response: content
      };
    }
  } catch (error) {
    console.error('Vision API error:', error.message);
    throw error;
  }
}

/**
 * Fallback analysis for when vision API is unavailable
 */
function fallbackAnalysis(taskContext) {
  return {
    detected_elements: ['UI components', 'interface elements'],
    technical_context: `Visual context for task: ${taskContext}`,
    development_opportunities: ['UI improvements needed', 'user experience optimization'],
    suggested_agents: ['frontend', 'testing'],
    confidence: 0.5,
    fallback: true
  };
}

/**
 * Validate image format and size
 */
function validateImage(base64Image) {
  if (!base64Image || typeof base64Image !== 'string') {
    throw new Error('Invalid image data');
  }

  // Check if it looks like valid base64
  const base64Pattern = /^[A-Za-z0-9+/]*={0,2}$/;
  if (!base64Pattern.test(base64Image)) {
    throw new Error('Invalid base64 format');
  }

  // Check size (limit to 10MB)
  const sizeInBytes = (base64Image.length * 3) / 4;
  if (sizeInBytes > 10 * 1024 * 1024) {
    throw new Error('Image too large (max 10MB)');
  }

  return true;
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
    const { image_data, task_context } = req.body;

    if (!image_data) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    const context = task_context || 'Development task analysis';

    // Validate image
    validateImage(image_data);

    let analysis;
    try {
      // Try vision analysis first
      analysis = await analyzeWithVision(image_data, context);
    } catch (visionError) {
      console.warn('Vision analysis failed, using fallback:', visionError.message);
      // Use fallback analysis
      analysis = fallbackAnalysis(context);
    }

    // Enhance with metadata
    const result = {
      ...analysis,
      analyzed_at: new Date().toISOString(),
      task_context: context,
      image_size_estimate: Math.round((image_data.length * 3) / 4 / 1024) + 'KB'
    };

    console.log(`Screenshot analysis completed for task: ${context}`);

    return res.status(200).json(result);

  } catch (error) {
    console.error('Screenshot analysis error:', error);
    return res.status(500).json({
      error: 'Screenshot analysis failed',
      details: error.message
    });
  }
}
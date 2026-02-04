class LLMService {
  constructor(tier, apiKeys) {
    this.tier = tier;
    this.apiKeys = apiKeys;
    this.providers = {
      budget: { provider: 'openai', model: 'gpt-3.5-turbo' },
      standard: { provider: 'openai', model: 'gpt-4-turbo' },
      premium: { provider: 'anthropic', model: 'claude-3-opus-20240229' }
    };
  }

  async generateComments(postData, context = {}) {
    const config = this.providers[this.tier];
    
    if (config.provider === 'openai') {
      return await this.callOpenAI(postData, context);
    } else if (config.provider === 'anthropic') {
      return await this.callAnthropic(postData, context);
    }
    
    throw new Error('Invalid provider configuration');
  }

  async callOpenAI(postData, context) {
    const apiKey = this.apiKeys.openai;
    if (!apiKey) throw new Error('OpenAI API key not configured');

    const model = this.providers[this.tier].model;
    const prompt = this.buildPrompt(postData, context);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: 'You analyze LinkedIn posts and generate authentic comments.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return this.parseCommentVariants(data.choices[0].message.content);
  }

  async callAnthropic(postData, context) {
    const apiKey = this.apiKeys.anthropic;
    if (!apiKey) throw new Error('Anthropic API key not configured');

    const model = this.providers[this.tier].model;
    const prompt = this.buildPrompt(postData, context);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model,
        max_tokens: 1024,
        messages: [
          { role: 'user', content: prompt }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    const data = await response.json();
    return this.parseCommentVariants(data.content[0].text);
  }

  buildPrompt(postData, context) {
    return `Context:
- Post Type: ${postData.type}
- Author Role: ${postData.authorRole}
- Post Tone: ${postData.tone}
- Post Content: ${postData.content}

Task: Generate 3 comment variations for this LinkedIn post.

Format your response EXACTLY as follows:
[PROFESSIONAL]
Your professional comment here

[CASUAL]
Your casual comment here

[BOLD]
Your bold/opinionated comment here

Rules:
- Match the post's energy
- Add genuine value
- 2-4 sentences max
- No generic phrases ("great post!", "thanks for sharing")
- Sound human, not AI
- Each comment should be meaningfully different in tone`;
  }

  parseCommentVariants(content) {
    const professionalMatch = content.match(/\[PROFESSIONAL\]([\s\S]*?)(?=\[CASUAL\]|$)/);
    const casualMatch = content.match(/\[CASUAL\]([\s\S]*?)(?=\[BOLD\]|$)/);
    const boldMatch = content.match(/\[BOLD\]([\s\S]*?)$/);

    return {
      professional: professionalMatch ? professionalMatch[1].trim() : '',
      casual: casualMatch ? casualMatch[1].trim() : '',
      bold: boldMatch ? boldMatch[1].trim() : ''
    };
  }
}

export default LLMService;

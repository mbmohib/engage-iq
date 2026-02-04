import { describe, it, expect, beforeEach, vi } from 'vitest';
import LLMService from '../../chrome-extension/background/llm-service';

describe('LLMService', () => {
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFetch = vi.fn();
    global.fetch = mockFetch;
  });

  describe('constructor', () => {
    it('should initialize with tier and apiKeys', () => {
      const service = new LLMService('budget', { openai: 'test-key' });
      expect(service.tier).toBe('budget');
      expect(service.apiKeys).toEqual({ openai: 'test-key' });
    });
  });

  describe('buildPrompt', () => {
    it('should build prompt with post data', () => {
      const service = new LLMService('budget', { openai: 'test-key' });
      const postData = {
        type: 'thoughtLeadership',
        authorRole: 'founder',
        tone: 'serious',
        content: 'Test post content'
      };

      const prompt = service.buildPrompt(postData, {});
      
      expect(prompt).toContain('Post Type: thoughtLeadership');
      expect(prompt).toContain('Author Role: founder');
      expect(prompt).toContain('Post Tone: serious');
      expect(prompt).toContain('Post Content: Test post content');
      expect(prompt).toContain('[PROFESSIONAL]');
      expect(prompt).toContain('[CASUAL]');
      expect(prompt).toContain('[BOLD]');
    });

    it('should include context in prompt', () => {
      const service = new LLMService('budget', { openai: 'test-key' });
      const postData = {
        type: 'announcement',
        authorRole: 'engineer',
        tone: 'celebratory',
        content: 'We launched!'
      };
      const context = { customRule: 'Be concise' };

      const prompt = service.buildPrompt(postData, context);
      expect(prompt).toContain('Post Type: announcement');
    });
  });

  describe('parseCommentVariants', () => {
    it('should parse all three comment variants correctly', () => {
      const service = new LLMService('budget', { openai: 'test-key' });
      const content = `[PROFESSIONAL]
This is a professional comment with formal tone.

[CASUAL]
Hey, this is a casual comment!

[BOLD]
This is a bold, opinionated comment.`;

      const result = service.parseCommentVariants(content);

      expect(result.professional).toBe('This is a professional comment with formal tone.');
      expect(result.casual).toBe('Hey, this is a casual comment!');
      expect(result.bold).toBe('This is a bold, opinionated comment.');
    });

    it('should handle missing sections gracefully', () => {
      const service = new LLMService('budget', { openai: 'test-key' });
      const content = `[PROFESSIONAL]
Only professional comment here.`;

      const result = service.parseCommentVariants(content);

      expect(result.professional).toBe('Only professional comment here.');
      expect(result.casual).toBe('');
      expect(result.bold).toBe('');
    });

    it('should trim whitespace from comments', () => {
      const service = new LLMService('budget', { openai: 'test-key' });
      const content = `[PROFESSIONAL]
   Comment with spaces   
   
[CASUAL]
Another comment

[BOLD]
Bold comment`;

      const result = service.parseCommentVariants(content);

      expect(result.professional).toBe('Comment with spaces');
      expect(result.casual).toBe('Another comment');
      expect(result.bold).toBe('Bold comment');
    });

    it('should handle empty content', () => {
      const service = new LLMService('budget', { openai: 'test-key' });
      const result = service.parseCommentVariants('');

      expect(result.professional).toBe('');
      expect(result.casual).toBe('');
      expect(result.bold).toBe('');
    });
  });

  describe('callOpenAI', () => {
    it('should call OpenAI API with correct parameters', async () => {
      const service = new LLMService('budget', { openai: 'test-api-key' });
      const postData = {
        type: 'thoughtLeadership',
        authorRole: 'founder',
        tone: 'serious',
        content: 'Test content'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [{
            message: {
              content: `[PROFESSIONAL]\nProfessional comment\n\n[CASUAL]\nCasual comment\n\n[BOLD]\nBold comment`
            }
          }]
        })
      });

      await service.callOpenAI(postData, {});

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.openai.com/v1/chat/completions',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test-api-key'
          }),
          body: expect.stringContaining('gpt-3.5-turbo')
        })
      );
    });

    it('should use correct model for standard tier', async () => {
      const service = new LLMService('standard', { openai: 'test-key' });
      const postData = {
        type: 'announcement',
        authorRole: 'engineer',
        tone: 'celebratory',
        content: 'Test'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [{
            message: {
              content: `[PROFESSIONAL]\nComment\n\n[CASUAL]\nComment\n\n[BOLD]\nComment`
            }
          }]
        })
      });

      await service.callOpenAI(postData, {});

      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(callBody.model).toBe('gpt-4-turbo');
    });

    it('should throw error if API key is missing', async () => {
      const service = new LLMService('budget', {});
      const postData = {
        type: 'thoughtLeadership',
        authorRole: 'founder',
        tone: 'serious',
        content: 'Test'
      };

      await expect(service.callOpenAI(postData, {})).rejects.toThrow('OpenAI API key not configured');
    });

    it('should throw error on API failure', async () => {
      const service = new LLMService('budget', { openai: 'test-key' });
      const postData = {
        type: 'thoughtLeadership',
        authorRole: 'founder',
        tone: 'serious',
        content: 'Test'
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Unauthorized'
      });

      await expect(service.callOpenAI(postData, {})).rejects.toThrow('OpenAI API error: Unauthorized');
    });

    it('should return parsed comment variants', async () => {
      const service = new LLMService('budget', { openai: 'test-key' });
      const postData = {
        type: 'thoughtLeadership',
        authorRole: 'founder',
        tone: 'serious',
        content: 'Test'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [{
            message: {
              content: `[PROFESSIONAL]\nProfessional response\n\n[CASUAL]\nCasual response\n\n[BOLD]\nBold response`
            }
          }]
        })
      });

      const result = await service.callOpenAI(postData, {});

      expect(result).toEqual({
        professional: 'Professional response',
        casual: 'Casual response',
        bold: 'Bold response'
      });
    });
  });

  describe('callAnthropic', () => {
    it('should call Anthropic API with correct parameters', async () => {
      const service = new LLMService('premium', { anthropic: 'test-api-key' });
      const postData = {
        type: 'thoughtLeadership',
        authorRole: 'founder',
        tone: 'serious',
        content: 'Test content'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          content: [{
            text: `[PROFESSIONAL]\nProfessional comment\n\n[CASUAL]\nCasual comment\n\n[BOLD]\nBold comment`
          }]
        })
      });

      await service.callAnthropic(postData, {});

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.anthropic.com/v1/messages',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'x-api-key': 'test-api-key',
            'anthropic-version': '2023-06-01'
          }),
          body: expect.stringContaining('claude-3-opus-20240229')
        })
      );
    });

    it('should throw error if API key is missing', async () => {
      const service = new LLMService('premium', {});
      const postData = {
        type: 'thoughtLeadership',
        authorRole: 'founder',
        tone: 'serious',
        content: 'Test'
      };

      await expect(service.callAnthropic(postData, {})).rejects.toThrow('Anthropic API key not configured');
    });

    it('should throw error on API failure', async () => {
      const service = new LLMService('premium', { anthropic: 'test-key' });
      const postData = {
        type: 'thoughtLeadership',
        authorRole: 'founder',
        tone: 'serious',
        content: 'Test'
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Forbidden'
      });

      await expect(service.callAnthropic(postData, {})).rejects.toThrow('Anthropic API error: Forbidden');
    });

    it('should return parsed comment variants', async () => {
      const service = new LLMService('premium', { anthropic: 'test-key' });
      const postData = {
        type: 'thoughtLeadership',
        authorRole: 'founder',
        tone: 'serious',
        content: 'Test'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          content: [{
            text: `[PROFESSIONAL]\nProfessional response\n\n[CASUAL]\nCasual response\n\n[BOLD]\nBold response`
          }]
        })
      });

      const result = await service.callAnthropic(postData, {});

      expect(result).toEqual({
        professional: 'Professional response',
        casual: 'Casual response',
        bold: 'Bold response'
      });
    });
  });

  describe('generateComments', () => {
    it('should route to OpenAI for budget tier', async () => {
      const service = new LLMService('budget', { openai: 'test-key' });
      const postData = {
        type: 'thoughtLeadership',
        authorRole: 'founder',
        tone: 'serious',
        content: 'Test'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [{
            message: {
              content: `[PROFESSIONAL]\nComment\n\n[CASUAL]\nComment\n\n[BOLD]\nComment`
            }
          }]
        })
      });

      const result = await service.generateComments(postData);

      expect(result).toHaveProperty('professional');
      expect(result).toHaveProperty('casual');
      expect(result).toHaveProperty('bold');
    });

    it('should route to OpenAI for standard tier', async () => {
      const service = new LLMService('standard', { openai: 'test-key' });
      const postData = {
        type: 'announcement',
        authorRole: 'engineer',
        tone: 'celebratory',
        content: 'Test'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [{
            message: {
              content: `[PROFESSIONAL]\nComment\n\n[CASUAL]\nComment\n\n[BOLD]\nComment`
            }
          }]
        })
      });

      await service.generateComments(postData);

      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(callBody.model).toBe('gpt-4-turbo');
    });

    it('should route to Anthropic for premium tier', async () => {
      const service = new LLMService('premium', { anthropic: 'test-key' });
      const postData = {
        type: 'opinion',
        authorRole: 'founder',
        tone: 'controversial',
        content: 'Test'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          content: [{
            text: `[PROFESSIONAL]\nComment\n\n[CASUAL]\nComment\n\n[BOLD]\nComment`
          }]
        })
      });

      await service.generateComments(postData);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.anthropic.com/v1/messages',
        expect.anything()
      );
    });

    it('should throw error for invalid tier', async () => {
      const service = new LLMService('invalid' as any, { openai: 'test-key' });
      const postData = {
        type: 'thoughtLeadership',
        authorRole: 'founder',
        tone: 'serious',
        content: 'Test'
      };

      await expect(service.generateComments(postData)).rejects.toThrow('Invalid provider configuration');
    });

    it('should pass context to API calls', async () => {
      const service = new LLMService('budget', { openai: 'test-key' });
      const postData = {
        type: 'thoughtLeadership',
        authorRole: 'founder',
        tone: 'serious',
        content: 'Test'
      };
      const context = { customRule: 'Be concise' };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [{
            message: {
              content: `[PROFESSIONAL]\nComment\n\n[CASUAL]\nComment\n\n[BOLD]\nComment`
            }
          }]
        })
      });

      await service.generateComments(postData, context);

      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(callBody.messages[1].content).toContain('Post Type: thoughtLeadership');
    });
  });
});

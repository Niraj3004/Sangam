import Anthropic from '@anthropic-ai/sdk';
import { LLMProvider, LLMMessage, LLMOptions } from './LLMProvider';
import { aiConfig } from '../../config/ai';

export class AnthropicProvider implements LLMProvider {
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic({
      apiKey: aiConfig.anthropicApiKey,
    });
  }

  async chat(messages: LLMMessage[], opts?: LLMOptions): Promise<string> {
    const systemMessage = messages.find(m => m.role === 'system')?.content;
    const userMessages = messages.filter(m => m.role !== 'system').map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content
    }));

    const response = await this.client.messages.create({
      model: opts?.model || aiConfig.models.primary,
      max_tokens: opts?.maxTokens || 1024,
      temperature: opts?.temperature ?? 0.7,
      system: systemMessage,
      messages: userMessages,
    });

    const content = response.content[0];
    if (content.type === 'text') {
      return content.text;
    }
    return '';
  }

  async extract(schema: Record<string, any>, text: string, opts?: LLMOptions): Promise<any> {
    const systemPrompt = `You are a strict data extraction tool. Extract the requested information from the user's text and output ONLY valid JSON that matches this exact schema:\n${JSON.stringify(schema, null, 2)}\nDo not wrap the JSON in markdown blocks or include any conversational text. Just output the raw JSON object.`;
    
    const response = await this.client.messages.create({
      model: opts?.model || aiConfig.models.fast,
      max_tokens: opts?.maxTokens || 1024,
      temperature: opts?.temperature ?? 0.1,
      system: systemPrompt,
      messages: [
        { role: 'user', content: text }
      ]
    });

    const content = response.content[0];
    if (content.type === 'text') {
      try {
        return JSON.parse(content.text.trim());
      } catch (e) {
        throw new Error(`Failed to parse Claude output as JSON. Output: ${content.text}`);
      }
    }
    throw new Error('Unexpected response format from Claude');
  }

  async embed(texts: string[]): Promise<number[][]> {
    // Anthropic does not have a native embedding API currently.
    // We would route this to Voyage AI or OpenAI embeddings when A8 is needed.
    throw new Error('Embeddings not yet implemented for Anthropic provider');
  }
}

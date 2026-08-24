import { GoogleGenAI, Type, Schema as GeminiSchema } from '@google/genai';
import { LLMProvider, LLMMessage, LLMOptions } from './LLMProvider';
import { aiConfig } from '../../config/ai';

export class GeminiProvider implements LLMProvider {
  private apiKeys: string[];
  private currentKeyIndex: number = 0;

  constructor() {
    this.apiKeys = aiConfig.geminiApiKeys;
    if (this.apiKeys.length === 0) {
      console.warn('[GeminiProvider] No API keys configured!');
    }
  }

  private getClient(): GoogleGenAI {
    if (this.apiKeys.length === 0) {
      throw new Error('No Gemini API keys available');
    }
    return new GoogleGenAI({ apiKey: this.apiKeys[this.currentKeyIndex] });
  }

  private rotateKey() {
    if (this.apiKeys.length === 0) return;
    this.currentKeyIndex = (this.currentKeyIndex + 1) % this.apiKeys.length;
    console.log(`[GeminiProvider] Rotated to API key index ${this.currentKeyIndex}`);
  }

  private async executeWithFailover<T>(operation: (client: GoogleGenAI) => Promise<T>): Promise<T> {
    const maxAttempts = this.apiKeys.length > 0 ? this.apiKeys.length : 1;
    let lastError;

    for (let i = 0; i < maxAttempts; i++) {
      try {
        const client = this.getClient();
        return await operation(client);
      } catch (error: any) {
        lastError = error;
        const errorMessage = error?.message || (typeof error === 'object' ? JSON.stringify(error) : String(error));
        
        // Typical Gemini rate limit, overloaded, or quota errors
        const isOverloadedOrQuota = 
          errorMessage.includes('429') || 
          errorMessage.includes('503') || 
          errorMessage.includes('500') || 
          errorMessage.toLowerCase().includes('quota') || 
          errorMessage.toLowerCase().includes('exhausted') ||
          errorMessage.toLowerCase().includes('overloaded') ||
          errorMessage.toLowerCase().includes('intermittent');

        if (isOverloadedOrQuota) {
          console.warn(`[GeminiProvider] Key index ${this.currentKeyIndex} hit rate limit or failed (${errorMessage.substring(0, 50)}...). Rotating key...`);
          this.rotateKey();
          continue; // Try next key immediately
        }
        
        // If it's a 400 Bad Request (e.g. invalid schema), don't rotate, just fail
        throw error;
      }
    }

    throw new Error(`[GeminiProvider] All ${maxAttempts} API keys failed. Last error: ${lastError?.message}`);
  }

  async chat(messages: LLMMessage[], opts?: LLMOptions): Promise<string> {
    const systemMessage = messages.find(m => m.role === 'system')?.content;
    let combinedPrompt = '';
    
    if (systemMessage) {
      combinedPrompt += `System: ${systemMessage}\n\n`;
    }

    // Gemini simplified chat mapping for MVP
    const userMessages = messages.filter(m => m.role !== 'system');
    for (const m of userMessages) {
      combinedPrompt += `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}\n`;
    }

    return this.executeWithFailover(async (client) => {
      const response = await client.models.generateContent({
        model: opts?.model || aiConfig.models.primary,
        contents: combinedPrompt,
        config: {
          temperature: opts?.temperature ?? 0.7,
          maxOutputTokens: opts?.maxTokens || 1024,
        }
      });

      return response.text || '';
    });
  }

  async extract(schema: Record<string, any>, text: string, opts?: LLMOptions): Promise<any> {
    const systemPrompt = `You are a strict data extraction tool. Extract the requested information from the user's text and output ONLY valid JSON that matches the exact structure described below:\n${JSON.stringify(schema, null, 2)}\nDo not wrap the JSON in markdown blocks.`;
    const combinedContent = `System: ${systemPrompt}\n\nUser: ${text}`;

    return this.executeWithFailover(async (client) => {
      const response = await client.models.generateContent({
        model: opts?.model || aiConfig.models.fast,
        contents: combinedContent,
        config: {
          temperature: opts?.temperature ?? 0.1,
          maxOutputTokens: opts?.maxTokens || 1024,
          responseMimeType: 'application/json',
        }
      });

      const rawText = response.text || '';
      try {
        return JSON.parse(rawText.trim());
      } catch (e) {
        throw new Error(`Failed to parse Gemini output as JSON. Output: ${rawText}`);
      }
    });
  }

  async embed(texts: string[]): Promise<number[][]> {
    return this.executeWithFailover(async (client) => {
      // Very basic embedding support
      const results = await Promise.all(texts.map(text => 
        client.models.embedContent({
          model: 'text-embedding-004',
          contents: text
        })
      ));
      
      return results.map(r => r.embeddings?.[0]?.values || []);
    });
  }
}

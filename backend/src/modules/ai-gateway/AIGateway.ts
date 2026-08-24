import { LLMProvider, LLMMessage, LLMOptions } from './LLMProvider';
import crypto from 'crypto';

interface CacheEntry {
  result: any;
  timestamp: number;
}

export class AIGateway {
  private provider: LLMProvider;
  private cache: Map<string, CacheEntry>;
  private cacheTTL: number;

  constructor(provider: LLMProvider, cacheTTLMs: number = 1000 * 60 * 60 * 24) { // 24hr default cache
    this.provider = provider;
    this.cache = new Map();
    this.cacheTTL = cacheTTLMs;
  }

  private hashRequest(method: string, args: any[]): string {
    return crypto.createHash('sha256').update(JSON.stringify({ method, args })).digest('hex');
  }

  private async withRetry<T>(operation: () => Promise<T>, maxRetries = 3): Promise<T> {
    let lastError;
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await operation();
      } catch (error: any) {
        lastError = error;
        console.warn(`[AIGateway] Attempt ${i + 1} failed: ${error.message}`);
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
    throw new Error(`AIGateway operation failed after ${maxRetries} retries. Last error: ${lastError?.message}`);
  }

  async chat(messages: LLMMessage[], opts?: LLMOptions): Promise<string> {
    const hash = this.hashRequest('chat', [messages, opts]);
    
    if (this.cache.has(hash)) {
      const entry = this.cache.get(hash)!;
      if (Date.now() - entry.timestamp < this.cacheTTL) {
        console.log(`[AIGateway] Cache HIT for chat`);
        return entry.result;
      } else {
        this.cache.delete(hash);
      }
    }

    console.log(`[AIGateway] Cache MISS for chat. Calling provider...`);
    const result = await this.withRetry(() => this.provider.chat(messages, opts));
    
    this.cache.set(hash, { result, timestamp: Date.now() });
    
    // Future expansion: Record usage for cost visibility here
    
    return result;
  }

  async extract(schema: Record<string, any>, text: string, opts?: LLMOptions): Promise<any> {
    const hash = this.hashRequest('extract', [schema, text, opts]);
    
    if (this.cache.has(hash)) {
      const entry = this.cache.get(hash)!;
      if (Date.now() - entry.timestamp < this.cacheTTL) {
        console.log(`[AIGateway] Cache HIT for extract`);
        return entry.result;
      } else {
        this.cache.delete(hash);
      }
    }

    console.log(`[AIGateway] Cache MISS for extract. Calling provider...`);
    const result = await this.withRetry(() => this.provider.extract(schema, text, opts));
    
    this.cache.set(hash, { result, timestamp: Date.now() });
    return result;
  }

  async embed(texts: string[]): Promise<number[][]> {
    const hash = this.hashRequest('embed', [texts]);
    
    if (this.cache.has(hash)) {
      const entry = this.cache.get(hash)!;
      if (Date.now() - entry.timestamp < this.cacheTTL) {
        return entry.result;
      } else {
        this.cache.delete(hash);
      }
    }

    const result = await this.withRetry(() => this.provider.embed(texts));
    this.cache.set(hash, { result, timestamp: Date.now() });
    return result;
  }
}

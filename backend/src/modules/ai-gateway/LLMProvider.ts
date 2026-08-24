export interface LLMMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface LLMOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface LLMProvider {
  /**
   * Standard chat interface for conversational or explanation tasks.
   */
  chat(messages: LLMMessage[], opts?: LLMOptions): Promise<string>;

  /**
   * Extraction interface forcing a structured JSON output matching the schema.
   */
  extract(schema: Record<string, any>, text: string, opts?: LLMOptions): Promise<any>;

  /**
   * Embeddings interface (placeholder for future use).
   */
  embed(texts: string[]): Promise<number[][]>;
}

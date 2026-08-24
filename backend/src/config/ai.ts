import { env } from './env.config';

export const aiConfig = {
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
  
  // Default models for different tasks
  models: {
    primary: 'claude-3-5-sonnet-20240620',
    fast: 'claude-3-haiku-20240307', // Used for extraction/simple tasks
  },

  // Task profiles as defined in A2
  taskProfiles: {
    // Extraction: strict JSON, low temperature, fast model
    extract: {
      model: 'claude-3-haiku-20240307',
      temperature: 0.1,
      maxTokens: 1024,
    },
    // Explain/Chat: human-readable, creative but constrained
    explain: {
      model: 'claude-3-5-sonnet-20240620',
      temperature: 0.7,
      maxTokens: 500,
    },
    // Moderation: highly deterministic
    moderate: {
      model: 'claude-3-5-sonnet-20240620',
      temperature: 0.0,
      maxTokens: 200,
    }
  }
};

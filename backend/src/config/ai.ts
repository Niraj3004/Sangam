import { env } from './env.config';

export const aiConfig = {
  // Array of 7 Gemini API keys for round-robin usage
  geminiApiKeys: [
    process.env.GEMINI_API_KEY_1 || '',
    process.env.GEMINI_API_KEY_2 || '',
    process.env.GEMINI_API_KEY_3 || '',
    process.env.GEMINI_API_KEY_4 || '',
    process.env.GEMINI_API_KEY_5 || '',
    process.env.GEMINI_API_KEY_6 || '',
    process.env.GEMINI_API_KEY_7 || '',
  ].filter(key => key !== ''),
  
  // Default models for different tasks
  models: {
    primary: 'gemini-2.5-pro',
    fast: 'gemini-2.5-flash', // Used for extraction/simple tasks
  },

  // Task profiles as defined in A2
  taskProfiles: {
    // Extraction: strict JSON, low temperature, fast model
    extract: {
      model: 'gemini-2.5-flash',
      temperature: 0.1,
      maxTokens: 8192,
    },
    // Explain/Chat: human-readable, creative but constrained
    explain: {
      model: 'gemini-2.5-flash',
      temperature: 0.7,
      maxTokens: 8192
    },
    // Moderation: highly deterministic
    moderate: {
      model: 'gemini-2.5-flash',
      temperature: 0.0,
      maxTokens: 500
    }
  }
};

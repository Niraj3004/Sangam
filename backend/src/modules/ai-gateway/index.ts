import { AIGateway } from './AIGateway';
import { GeminiProvider } from './GeminiProvider';

// Singleton instance to be used across the application
export const gateway = new AIGateway(new GeminiProvider());

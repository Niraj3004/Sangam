import { AIGateway } from './AIGateway';
import { AnthropicProvider } from './AnthropicProvider';

// Singleton instance to be used across the application
export const gateway = new AIGateway(new AnthropicProvider());

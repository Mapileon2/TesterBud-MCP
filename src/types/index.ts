// Define common types used across the project

export interface LLMProvider {
  name: string;
  displayName?: string;
  apiEndpoint: string;
  apiKey?: string;
  modelName: string;
  maxTokens: number;
  supportsStreaming: boolean;
  supportsFunctionCalling: boolean;
  headers?: Record<string, string>;
  models?: string[];
  costTier?: 'free' | 'ultra_low' | 'low' | 'medium' | 'high';
  speed?: 'ultra_fast' | 'fastest' | 'very_fast' | 'fast' | 'medium' | 'slow';
  bestFor?: string[]; // Added bestFor
  reasoning_modes?: string[]; // Added reasoning_modes
  experimental?: boolean; // Added experimental
  legacy?: boolean; // Added legacy
  pricing?: { // Added pricing
    inputPer1M: number;
    outputPer1M: number;
  };
}

export interface ReasoningMode {
  id: 'high_reasoning' | 'balanced_reasoning' | 'minimal_reasoning';
  name: string;
  description: string;
  contextLayers: number[];
  maxTokens: number;
  strategy: 'chain_of_thought' | 'tree_of_thought';
  verbosity: 'short' | 'medium' | 'long';
  processingTime: 'fast' | 'standard' | 'extended';
}

export interface Context7Layer {
  id: number;
  name: string;
  description: string;
  dataSource: string;
  gatherer: (input: any) => Promise<any>;
  formatter: (data: any, mode: ReasoningMode) => string;
}

export interface Session {
  id: string;
  llmProvider: LLMProvider;
  currentMode: ReasoningMode;
  modeHistory: ModeTransition[];
  contextCache: Map<number, any>;
  conversationHistory: Message[];
  accumulatedInsights: Insight[];
  customConfig?: Record<string, any>;
  createdAt: Date;
  lastActivity: Date;
}

export interface ModeTransition {
  from_mode: string;
  to_mode: string;
  timestamp: Date;
  reason: 'user_request' | 'auto_escalation' | 'auto_optimization';
  trigger_context?: string;
}

export interface Message {
  input: string;
  context: Record<string, any>;
  mode: string;
  response: string;
  timestamp: string;
  processingTime?: number;
}

export interface Insight {
  category: string;
  summary: string;
  confidence: number;
  timestamp: Date;
}

export interface LLMResponse {
  content: string;
  finishReason?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  processingTime?: number;
  usedProvider?: string;
}

export interface GeminiModelConfig {
  name: string;
  displayName: string;
  maxTokens: number;
  outputTokens: number;
  supportsMultimodal: boolean;
  supportsFunctionCalling: boolean;
  supportsStreaming: boolean;
  costTier: 'free' | 'ultra_low' | 'low' | 'medium' | 'high';
  speed: 'ultra_fast' | 'fastest' | 'very_fast' | 'fast' | 'medium' | 'slow';
  bestFor: string[];
  reasoning_modes: string[];
  experimental?: boolean;
  legacy?: boolean;
  pricing?: {
    inputPer1M: number;
    outputPer1M: number;
  };
}

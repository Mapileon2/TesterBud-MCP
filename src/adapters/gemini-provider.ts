import { GoogleGenerativeAI, GenerativeModel, Part } from "@google/generative-ai";
import { UniversalLLMAdapter } from "./universal-llm-adapter";
import { logger } from '../utils/logger';
import { LLMProvider, ReasoningMode, LLMResponse, GeminiModelConfig } from '../types';
import dotenv from 'dotenv';

dotenv.config();

// Define Gemini-specific model configurations
const GEMINI_MODELS: Record<string, GeminiModelConfig> = {
  'gemini-pro': {
    name: 'gemini-pro',
    displayName: 'Gemini Pro',
    maxTokens: 30720,
    outputTokens: 2048,
    supportsMultimodal: false,
    supportsFunctionCalling: false,
    supportsStreaming: true,
    costTier: 'low',
    speed: 'fast',
    bestFor: ['general_chat', 'text_generation'],
    reasoning_modes: ['balanced_reasoning', 'minimal_reasoning'],
    pricing: { inputPer1M: 0.5, outputPer1M: 1.5 }
  },
  'gemini-1.5-flash': {
    name: 'gemini-1.5-flash',
    displayName: 'Gemini 1.5 Flash',
    maxTokens: 1048576,
    outputTokens: 8192,
    supportsMultimodal: true,
    supportsFunctionCalling: false,
    supportsStreaming: true,
    costTier: 'ultra_low',
    speed: 'ultra_fast',
    bestFor: ['fast_summarization', 'long_context_chat'],
    reasoning_modes: ['minimal_reasoning'],
    experimental: true
  },
  'gemini-1.5-pro': {
    name: 'gemini-1.5-pro',
    displayName: 'Gemini 1.5 Pro',
    maxTokens: 1048576,
    outputTokens: 8192,
    supportsMultimodal: true,
    supportsFunctionCalling: false,
    supportsStreaming: true,
    costTier: 'medium',
    speed: 'fast',
    bestFor: ['complex_reasoning', 'multimodal_analysis', 'long_context_tasks'],
    reasoning_modes: ['high_reasoning', 'balanced_reasoning'],
    experimental: true
  },
  'gemini-2.0-flash-exp': {
    name: 'gemini-2.0-flash-exp',
    displayName: 'Gemini 2.0 Flash (Experimental)',
    maxTokens: 1048576,
    outputTokens: 8192,
    supportsMultimodal: true,
    supportsFunctionCalling: false,
    supportsStreaming: true,
    costTier: 'ultra_low',
    speed: 'ultra_fast',
    bestFor: ['rapid_prototyping', 'experimental_use'],
    reasoning_modes: ['minimal_reasoning'],
    experimental: true
  }
};

export class GeminiProvider extends UniversalLLMAdapter {
  private genAI: GoogleGenerativeAI;
  private models: Map<string, GenerativeModel>;

  constructor() {
    super();
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      logger.warn("GEMINI_API_KEY is not set. Gemini provider might not function correctly.");
      this.genAI = new GoogleGenerativeAI(""); 
    } else {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
    this.models = new Map();
    this.initializeModels();
  }

  private initializeModels() {
    for (const modelName in GEMINI_MODELS) {
      try {
        this.models.set(modelName, this.genAI.getGenerativeModel({ model: modelName }));
      } catch (error) {
        logger.error(`Failed to initialize Gemini model ${modelName}: ${error}`);
      }
    }
  }

  // Implement abstract methods from UniversalLLMAdapter

  protected registerAllProviders(): void {
    const geminiVariants = this.getProviderVariants();
    geminiVariants.forEach((variant: LLMProvider) => this.registerProvider(variant));
  }

  protected registerProvider(provider: LLMProvider): void {
    this.providers.set(provider.name, provider);
  }

  public async generateResponse(
    providerName: string,
    prompt: string,
    mode: ReasoningMode,
    sessionId?: string
  ): Promise<LLMResponse> {
    const modelConfig = GEMINI_MODELS[providerName];
    if (!modelConfig) {
      throw new Error(`Gemini model configuration not found for: ${providerName}`);
    }

    const model = this.models.get(providerName);
    if (!model) {
      throw new Error(`Gemini model instance not found for: ${providerName}`);
    }

    const startTime = Date.now();
    const formattedPrompt = this.enhancePromptForProvider(this.providers.get(providerName)!, prompt, mode);

    try {
      const payload = this.buildProviderSpecificPayload(this.providers.get(providerName)!, formattedPrompt, mode);
      const response = await this.makeRequest(this.providers.get(providerName)!, payload);
      
      const processingTime = Date.now() - startTime;
      
      logger.info(`Gemini Response for ${providerName} - mode: ${mode.id}, processingTime: ${processingTime}, sessionId: ${sessionId}, finishReason: ${response.finishReason}`);

      return {
        ...response,
        processingTime,
        usedProvider: providerName
      };
    } catch (error: any) {
      logger.error(`Error generating response from Gemini (${providerName}): ${error}`);
      throw error;
    }
  }

  protected buildProviderSpecificPayload(
    provider: LLMProvider,
    prompt: string,
    mode: ReasoningMode
  ): any {
    const modelConfig = GEMINI_MODELS[provider.name];
    if (!modelConfig) {
      throw new Error(`Gemini model configuration not found for: ${provider.name}`);
    }

    return {
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: this.getTemperatureForMode(mode),
        maxOutputTokens: Math.min(mode.maxTokens, modelConfig.outputTokens),
        topK: 40,
        topP: 0.95,
      }
    };
  }

  protected async makeRequest(provider: LLMProvider, payload: any): Promise<LLMResponse> {
    const url = this.buildUrl(provider.modelName!);
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is required for Gemini models');
    }

    try {
      const response = await fetch(`${url}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return this.parseProviderResponse(provider, data);
    } catch (error) {
      logger.error(`Error making request to ${provider.name}: ${error}`);
      throw error;
    }
  }

  protected parseProviderResponse(provider: LLMProvider, data: any): LLMResponse {
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const usage = data.usageMetadata ? {
      promptTokens: data.usageMetadata.promptTokenCount || 0,
      completionTokens: data.usageMetadata.candidatesTokenCount || 0,
      totalTokens: data.usageMetadata.totalTokenCount || 0,
    } : undefined;

    return {
      content,
      usage,
      finishReason: data.candidates?.[0]?.finishReason,
    };
  }

  protected enhancePromptForProvider(
    provider: LLMProvider,
    prompt: string,
    mode: ReasoningMode
  ): string {
    const reasoningInstructions = this.getReasoningInstructions(mode);
    const providerOptimization = this.getProviderOptimization(provider);
    
    return `${reasoningInstructions}\n\n${prompt}\n\n${providerOptimization}`;
  }

  protected getReasoningInstructions(mode: ReasoningMode): string {
    switch (mode.id) {
      case 'high_reasoning':
        return "Provide detailed, step-by-step reasoning with thorough analysis.";
      case 'balanced_reasoning':
        return "Provide clear reasoning with appropriate detail.";
      case 'minimal_reasoning':
        return "Provide concise reasoning with key points only.";
      default:
        return "Provide appropriate reasoning based on the context.";
    }
  }

  protected getProviderOptimization(provider: LLMProvider): string {
    return `Optimize response for ${provider.displayName || provider.name} model capabilities.`;
  }

  protected getTemperatureForMode(mode: ReasoningMode): number {
    switch (mode.id) {
      case 'high_reasoning':
        return 0.3;
      case 'balanced_reasoning':
        return 0.7;
      case 'minimal_reasoning':
        return 0.9;
      default:
        return 0.7;
    }
  }

  private buildUrl(modelName: string): string {
    return `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`;
  }

  public getAllProviders(): string[] {
    return Array.from(this.providers.keys());
  }

  public getProvider(name: string): LLMProvider | undefined {
    return this.providers.get(name);
  }

  private getProviderVariants(): LLMProvider[] {
    return Object.keys(GEMINI_MODELS).map(modelName => {
      const config = GEMINI_MODELS[modelName];
      return {
        name: modelName,
        displayName: config.displayName,
        apiEndpoint: this.buildUrl(modelName),
        apiKey: process.env.GEMINI_API_KEY,
        modelName: modelName,
        maxTokens: config.maxTokens,
        supportsStreaming: config.supportsStreaming,
        supportsFunctionCalling: config.supportsFunctionCalling,
        costTier: config.costTier,
        speed: config.speed,
        bestFor: config.bestFor,
        reasoning_modes: config.reasoning_modes,
        experimental: config.experimental,
        pricing: config.pricing,
      };
    });
  }

  private mapSpeedToEnum(speed: string): 'ultra_fast' | 'fastest' | 'very_fast' | 'fast' | 'medium' | 'slow' {
    switch (speed) {
      case 'ultra_fast': return 'ultra_fast';
      case 'fastest': return 'fastest';
      case 'very_fast': return 'very_fast';
      case 'fast': return 'fast';
      case 'medium': return 'medium';
      case 'slow': return 'slow';
      default: return 'medium';
    }
  }
}

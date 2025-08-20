import fetch from 'node-fetch';
import { LLMProvider, ReasoningMode, LLMResponse } from '../types';
import { GeminiProvider } from './gemini-provider'; // Import GeminiProvider here for potential use
import { logger } from '../utils/logger';

export abstract class UniversalLLMAdapter {
  protected providers: Map<string, LLMProvider> = new Map();
  protected geminiProvider: GeminiProvider | null = null; // Make it nullable if not always initialized

  constructor() {
    this.registerAllProviders();
  }

  protected abstract registerAllProviders(): void;
  protected abstract registerProvider(provider: LLMProvider): void;
  public abstract generateResponse(
    providerName: string,
    prompt: string,
    mode: ReasoningMode,
    sessionId?: string
  ): Promise<LLMResponse>;

  protected abstract buildProviderSpecificPayload(
    provider: LLMProvider,
    prompt: string,
    mode: ReasoningMode
  ): any;

  protected abstract makeRequest(provider: LLMProvider, payload: any): Promise<LLMResponse>;

  protected abstract parseProviderResponse(provider: LLMProvider, data: any): LLMResponse;

  protected abstract enhancePromptForProvider(
    provider: LLMProvider,
    prompt: string,
    mode: ReasoningMode
  ): string;

  protected abstract getReasoningInstructions(mode: ReasoningMode): string;
  protected abstract getProviderOptimization(provider: LLMProvider): string;
  protected abstract getTemperatureForMode(mode: ReasoningMode): number;

  public abstract getAllProviders(): string[];
  public abstract getProvider(name: string): LLMProvider | undefined;
}

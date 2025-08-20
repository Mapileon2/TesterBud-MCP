import { LLMProvider, ReasoningMode, LLMResponse } from '../types';
import { GeminiProvider } from './gemini-provider';
export declare abstract class UniversalLLMAdapter {
    protected providers: Map<string, LLMProvider>;
    protected geminiProvider: GeminiProvider | null;
    constructor();
    protected abstract registerAllProviders(): void;
    protected abstract registerProvider(provider: LLMProvider): void;
    abstract generateResponse(providerName: string, prompt: string, mode: ReasoningMode, sessionId?: string): Promise<LLMResponse>;
    protected abstract buildProviderSpecificPayload(provider: LLMProvider, prompt: string, mode: ReasoningMode): any;
    protected abstract makeRequest(provider: LLMProvider, payload: any): Promise<LLMResponse>;
    protected abstract parseProviderResponse(provider: LLMProvider, data: any): LLMResponse;
    protected abstract enhancePromptForProvider(provider: LLMProvider, prompt: string, mode: ReasoningMode): string;
    protected abstract getReasoningInstructions(mode: ReasoningMode): string;
    protected abstract getProviderOptimization(provider: LLMProvider): string;
    protected abstract getTemperatureForMode(mode: ReasoningMode): number;
    abstract getAllProviders(): string[];
    abstract getProvider(name: string): LLMProvider | undefined;
}
//# sourceMappingURL=universal-llm-adapter.d.ts.map
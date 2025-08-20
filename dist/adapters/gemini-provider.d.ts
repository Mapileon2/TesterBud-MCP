import { UniversalLLMAdapter } from "./universal-llm-adapter";
import { LLMProvider, ReasoningMode, LLMResponse } from '../types';
export declare class GeminiProvider extends UniversalLLMAdapter {
    private genAI;
    private models;
    constructor();
    private initializeModels;
    protected registerAllProviders(): void;
    protected registerProvider(provider: LLMProvider): void;
    generateResponse(providerName: string, prompt: string, mode: ReasoningMode, sessionId?: string): Promise<LLMResponse>;
    protected buildProviderSpecificPayload(provider: LLMProvider, prompt: string, mode: ReasoningMode): any;
    protected makeRequest(provider: LLMProvider, payload: any): Promise<LLMResponse>;
    protected parseProviderResponse(provider: LLMProvider, data: any): LLMResponse;
    protected enhancePromptForProvider(provider: LLMProvider, prompt: string, mode: ReasoningMode): string;
    protected getReasoningInstructions(mode: ReasoningMode): string;
    protected getProviderOptimization(provider: LLMProvider): string;
    protected getTemperatureForMode(mode: ReasoningMode): number;
    private buildUrl;
    getAllProviders(): string[];
    getProvider(name: string): LLMProvider | undefined;
    private getProviderVariants;
    private mapSpeedToEnum;
}
//# sourceMappingURL=gemini-provider.d.ts.map
export interface ReasoningStrategy {
    execute(prompt: string, llmAdapter: any): Promise<string>;
}
export declare class SimpleReasoningStrategy implements ReasoningStrategy {
    execute(prompt: string, llmAdapter: any): Promise<string>;
}
export declare class CreativeReasoningStrategy implements ReasoningStrategy {
    execute(prompt: string, llmAdapter: any): Promise<string>;
}
export declare class ComplexReasoningStrategy implements ReasoningStrategy {
    execute(prompt: string, llmAdapter: any): Promise<string>;
}
//# sourceMappingURL=reasoning-strategies.d.ts.map
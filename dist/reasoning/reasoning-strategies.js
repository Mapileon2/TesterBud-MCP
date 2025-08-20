"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplexReasoningStrategy = exports.CreativeReasoningStrategy = exports.SimpleReasoningStrategy = void 0;
// Example: Simple reasoning strategy
class SimpleReasoningStrategy {
    async execute(prompt, llmAdapter) {
        console.log("Executing SimpleReasoningStrategy");
        return llmAdapter.generateResponse(prompt);
    }
}
exports.SimpleReasoningStrategy = SimpleReasoningStrategy;
// Example: Creative reasoning strategy
class CreativeReasoningStrategy {
    async execute(prompt, llmAdapter) {
        console.log("Executing CreativeReasoningStrategy");
        // In a real scenario, this might involve adding specific instructions to the prompt
        // or using a different LLM model/parameters.
        const creativePrompt = `${prompt}\n\nBe creative in your response.`;
        return llmAdapter.generateResponse(creativePrompt);
    }
}
exports.CreativeReasoningStrategy = CreativeReasoningStrategy;
// Example: Complex reasoning strategy
class ComplexReasoningStrategy {
    async execute(prompt, llmAdapter) {
        console.log("Executing ComplexReasoningStrategy");
        // In a real scenario, this might involve multi-step reasoning or more detailed context.
        const complexPrompt = `${prompt}\n\nProvide a detailed and structured response.`;
        return llmAdapter.generateResponse(complexPrompt);
    }
}
exports.ComplexReasoningStrategy = ComplexReasoningStrategy;
//# sourceMappingURL=reasoning-strategies.js.map
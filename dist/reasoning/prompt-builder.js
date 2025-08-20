"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptBuilder = void 0;
const context_formatter_1 = require("../context/context-formatter");
class PromptBuilder {
    constructor(modeManager, contextLayers) {
        this.contextFormatter = new context_formatter_1.ContextFormatter();
        this.modeManager = modeManager;
        this.contextLayers = contextLayers;
    }
    async buildPrompt(userQuery) {
        const currentMode = this.modeManager.getMode();
        let contextString = "";
        // Gather context based on the current mode and query
        // This is a simplified example; real logic would be more complex
        const gatheredContext = this.contextLayers.flatMap(layer => layer.getContext(userQuery));
        contextString = this.contextFormatter.formatForLLM(gatheredContext);
        let prompt = `User Query: ${userQuery}\n\n`;
        if (contextString) {
            prompt += `Context:\n${contextString}\n\n`;
        }
        // Add mode-specific instructions
        if (currentMode === "creative") {
            prompt += "Reasoning Strategy: Be creative and explore novel ideas.\n";
        }
        else if (currentMode === "complex") {
            prompt += "Reasoning Strategy: Provide a detailed and thorough analysis.\n";
        }
        else {
            prompt += "Reasoning Strategy: Provide a concise and direct answer.\n";
        }
        return prompt;
    }
}
exports.PromptBuilder = PromptBuilder;
//# sourceMappingURL=prompt-builder.js.map
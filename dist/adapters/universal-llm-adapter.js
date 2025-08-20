"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniversalLLMAdapter = void 0;
class UniversalLLMAdapter {
    constructor() {
        this.providers = new Map();
        this.geminiProvider = null; // Make it nullable if not always initialized
        this.registerAllProviders();
    }
}
exports.UniversalLLMAdapter = UniversalLLMAdapter;
//# sourceMappingURL=universal-llm-adapter.js.map
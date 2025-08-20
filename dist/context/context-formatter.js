"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextFormatter = void 0;
// Utility for formatting context data for LLM consumption
class ContextFormatter {
    formatForLLM(contextData) {
        // Logic to transform raw context data into a format suitable for LLM prompts.
        // This might involve serializing JSON, creating natural language descriptions, etc.
        return contextData.map(item => {
            if (item.type === "file_content") {
                return `File: ${item.source}\nContent: ${item.content}`;
            }
            else if (item.type === "database_content") {
                return `Database Query: ${item.query}\nResult: ${item.content}`;
            }
            // Add more formatting logic for other context types
            return JSON.stringify(item);
        }).join('\n\n');
    }
}
exports.ContextFormatter = ContextFormatter;
//# sourceMappingURL=context-formatter.js.map
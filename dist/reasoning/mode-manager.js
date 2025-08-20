"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModeManager = void 0;
// Manages different reasoning modes (e.g., simple, complex, creative)
class ModeManager {
    constructor(initialMode = "simple") {
        this.currentMode = initialMode;
    }
    setMode(mode) {
        // Add validation for allowed modes if necessary
        this.currentMode = mode;
        console.log(`Reasoning mode set to: ${this.currentMode}`);
    }
    getMode() {
        return this.currentMode;
    }
}
exports.ModeManager = ModeManager;
//# sourceMappingURL=mode-manager.js.map
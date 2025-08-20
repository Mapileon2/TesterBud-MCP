"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = handleError;
const logger_1 = require("./logger");
// Centralized error handling
function handleError(error, context = 'General') {
    logger_1.logger.error(`Error in ${context}: ${error.message}`);
    if (error.stack) {
        logger_1.logger.error(`Stack Trace: ${error.stack}`);
    }
    // Potentially send error to a monitoring service
}
//# sourceMappingURL=error-handler.js.map
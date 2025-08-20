"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformanceMonitor = void 0;
// Utility for monitoring performance
class PerformanceMonitor {
    constructor() {
        this.startTime = process.hrtime();
    }
    getElapsedTime() {
        const elapsed = process.hrtime(this.startTime);
        const seconds = elapsed[0];
        const nanoseconds = elapsed[1];
        return `${seconds}s ${nanoseconds / 1e6}ms`;
    }
    // Could add methods to measure specific function execution times
    async measureExecutionTime(fn) {
        const start = process.hrtime();
        const result = await fn();
        const end = process.hrtime(start);
        const duration = `${end[0]}s ${end[1] / 1e6}ms`;
        console.log(`Function executed in ${duration}`);
        return result;
    }
}
exports.PerformanceMonitor = PerformanceMonitor;
//# sourceMappingURL=performance-monitor.js.map
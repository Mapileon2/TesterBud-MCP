export declare class PerformanceMonitor {
    private startTime;
    constructor();
    getElapsedTime(): string;
    measureExecutionTime<T>(fn: () => Promise<T>): Promise<T>;
}
//# sourceMappingURL=performance-monitor.d.ts.map
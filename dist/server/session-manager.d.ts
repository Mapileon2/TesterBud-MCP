interface Session {
    sessionId: string;
    userId: string;
    context: any[];
    createdAt: Date;
    updatedAt: Date;
}
export declare class SessionManager {
    private sessions;
    constructor();
    createSession(userId: string): string;
    getSession(sessionId: string): Session | undefined;
    addContextToSession(sessionId: string, context: any): boolean;
}
export {};
//# sourceMappingURL=session-manager.d.ts.map
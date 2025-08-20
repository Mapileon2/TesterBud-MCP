"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionManager = void 0;
const uuid_1 = require("uuid");
class SessionManager {
    constructor() {
        this.sessions = new Map();
    }
    createSession(userId) {
        const sessionId = (0, uuid_1.v4)();
        const newSession = {
            sessionId,
            userId,
            context: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        this.sessions.set(sessionId, newSession);
        return sessionId;
    }
    getSession(sessionId) {
        return this.sessions.get(sessionId);
    }
    addContextToSession(sessionId, context) {
        const session = this.sessions.get(sessionId);
        if (!session) {
            return false;
        }
        session.context.push(context);
        session.updatedAt = new Date();
        return true;
    }
}
exports.SessionManager = SessionManager;
//# sourceMappingURL=session-manager.js.map
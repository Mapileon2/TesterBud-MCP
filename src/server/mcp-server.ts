import express from 'express';
import { SessionManager } from './session-manager';

export class McpServer {
  public router: express.Router;
  private sessionManager: SessionManager;

  constructor() {
    this.router = express.Router();
    this.sessionManager = new SessionManager();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.post('/create-session', (req, res) => {
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
      }
      const sessionId = this.sessionManager.createSession(userId);
      return res.status(201).json({ sessionId });
    });

    this.router.get('/session/:sessionId', (req, res) => {
      const { sessionId } = req.params;
      const session = this.sessionManager.getSession(sessionId);
      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }
      return res.json(session);
    });

    this.router.post('/session/:sessionId/add-context', (req, res) => {
      const { sessionId } = req.params;
      const { context } = req.body;
      if (!context) {
        return res.status(400).json({ error: 'Context is required' });
      }
      const success = this.sessionManager.addContextToSession(sessionId, context);
      if (!success) {
        return res.status(404).json({ error: 'Session not found' });
      }
      return res.status(200).json({ message: 'Context added successfully' });
    });

    // Add more routes for other MCP functionalities as needed
  }
}

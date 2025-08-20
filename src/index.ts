import express from 'express';
import dotenv from 'dotenv';
import { McpServer } from './server/mcp-server';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Add JSON body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mcpServer = new McpServer();

app.use('/mcp', mcpServer.router);

app.get('/', (req, res) => {
  res.send('Context7 MCP Server is running!');
});

// Health check endpoint for FastMCP Cloud
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'TesterBud-MCP'
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

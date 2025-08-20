# Context7 MCP Server

This is the Context7 MCP Server, designed to integrate with the Context7 system and provide LLM capabilities through the Model Context Protocol (MCP). This server enables seamless integration with popular IDEs and coding assistants.

## Features

- **MCP Protocol Support**: Full Model Context Protocol implementation for IDE integration
- **Multi-IDE Compatibility**: Works with Cursor, Claude Desktop, Windsurf, and more
- **Universal LLM Integration**: Supports multiple LLM providers (Gemini, OpenAI, etc.)
- **Code Analysis Tools**: Built-in tools for code analysis, generation, and debugging
- **Context Management**: Advanced context gathering and formatting
- **Reasoning Strategies**: Dynamic reasoning modes for different use cases

## IDE Integration

### Cursor IDE

1. **Install the server:**
   ```bash
   cd TesterBud
   npm install
   npm run build
   ```

2. **Configure in Cursor:**
   - Open Cursor Settings → MCP
   - Add new MCP server:
   ```json
   {
     "mcpServers": {
       "context7": {
         "command": "node",
         "args": ["/absolute/path/to/TesterBud/dist/mcp-server.js"],
         "env": {
           "GEMINI_API_KEY": "YOUR_GEMINI_API_KEY"
         }
       }
     }
   }
   ```

### Claude Desktop

1. **Copy configuration:**
   ```bash
   cp claude_desktop_config.json ~/Library/Application\ Support/Claude/claude_desktop_config.json
   # On Windows: copy to %APPDATA%/Claude/claude_desktop_config.json
   # On Linux: copy to ~/.config/Claude/claude_desktop_config.json
   ```

2. **Edit the configuration** with your actual paths and API key.

### Windsurf

1. **Add to Windsurf settings:**
   ```json
   {
     "mcp_servers": {
       "context7": {
         "command": "node",
         "args": ["/absolute/path/to/TesterBud/dist/mcp-server.js"],
         "env": {
           "GEMINI_API_KEY": "YOUR_GEMINI_API_KEY"
         }
       }
     }
   }
   ```

### Generic MCP Client

Use the `.mcp.json` configuration file provided in the root directory as a template for any MCP-compatible client.

## Available Tools

The server provides the following MCP tools:

- **`analyze_code`**: Analyze code for patterns, issues, and improvements
- **`generate_code`**: Generate code based on requirements
- **`debug_code`**: Debug code issues and provide solutions
- **`get_context`**: Get relevant context and documentation

## Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd TesterBud
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Copy `.env.example` to `.env` and fill in your API keys:
   ```bash
   cp .env.example .env
   ```
   Edit `.env`:
   ```
   GEMINI_API_KEY=YOUR_GEMINI_API_KEY
   ```

## Running the Server

### MCP Mode (for IDE integration)
```bash
# Development
npm run mcp:dev

# Production
npm run build
npm run mcp
```

### HTTP API Mode (for web applications)
```bash
# Development
npm run dev

# Production
npm run build
npm start
```

### Docker
```bash
docker-compose up --build
```

## Testing the MCP Server

### Test with MCP Inspector
```bash
npm install -g @modelcontextprotocol/inspector
mcp-inspector node dist/mcp-server.js
```

### Test with curl (HTTP mode)
```bash
curl -X POST http://localhost:3000/mcp/create-session \
  -H "Content-Type: application/json" \
  -d '{"userId": "test-user"}'
```

## Deployment

Refer to `render.yaml` for Render deployment configuration.
Deployment scripts for GCP and Docker are available in the `deploy/` directory.

## Configuration Files

- `.mcp.json`: Generic MCP configuration template
- `claude_desktop_config.json`: Claude Desktop specific configuration
- `render.yaml`: Render deployment configuration
- `docker-compose.yml`: Docker deployment configuration

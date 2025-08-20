# FastMCP Cloud Deployment Guide

## 🚀 Deploy TesterBud MCP to FastMCP Cloud

### Prerequisites
- FastMCP Cloud account (https://www.fastmcp.cloud/)
- GitHub repository with your TesterBud MCP code
- Gemini API key

### Step 1: Repository Setup

1. **Fork or clone the repository**:
   ```bash
   git clone https://github.com/Mapileon2/TesterBud-MCP.git
   cd TesterBud-MCP
   ```

2. **Update the fastmcp-manifest.json** (if needed):
   ```json
   {
     "name": "TesterBud-MCP",
     "version": "1.0.0",
     "description": "Advanced MCP server for code analysis and generation",
     "mcp_version": "1.0.0",
     "runtime": "node",
     "entry_point": "dist/index.js",
     "build_command": "npm run build",
     "start_command": "npm start",
     "required_env_vars": ["GEMINI_API_KEY"]
   }
   ```

### Step 2: FastMCP Cloud Configuration

1. **Login to FastMCP Cloud**:
   - Go to https://www.fastmcp.cloud/
   - Sign in with your GitHub account

2. **Create new MCP service**:
   - Click "Create MCP Service"
   - Select "Import from GitHub"
   - Choose your TesterBud-MCP repository

3. **Configure environment variables**:
   - Add `GEMINI_API_KEY` with your actual Gemini API key
   - Optionally add `NODE_ENV=production`

### Step 3: Deploy

1. **FastMCP will automatically**:
   - Detect the `fastmcp-manifest.json`
   - Install dependencies with `npm install`
   - Build with `npm run build`
   - Start with `npm start`

2. **Monitor deployment**:
   - Check deployment logs in FastMCP dashboard
   - Verify health check at `/health` endpoint

### Step 4: Testing

Once deployed, test your MCP service:

```bash
# Test health endpoint
curl https://your-service.fastmcp.app/health

# Test MCP tools
curl -X POST https://your-service.fastmcp.app/mcp/create-session \
  -H "Content-Type: application/json" \
  -d '{"userId":"test-user"}'
```

### Step 5: MCP Client Configuration

For Claude Desktop or other MCP clients:

```json
{
  "mcpServers": {
    "TesterBud-FastMCP": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-http", "https://your-service.fastmcp.app/mcp"]
    }
  }
}
```

## 🔧 Advanced Configuration

### Custom Build Settings

If you need custom build settings, create `.fastmcp.yml`:

```yaml
service:
  name: TesterBud-MCP
  runtime: node
  version: "18"
  build:
    command: npm run build
  start:
    command: npm start
  env:
    - name: GEMINI_API_KEY
      required: true
    - name: NODE_ENV
      value: production
  resources:
    memory: 512Mi
    cpu: 500m
```

### Scaling Configuration

FastMCP Cloud supports auto-scaling:
- **Min instances**: 1 (default)
- **Max instances**: 3 (default)
- **Auto-scaling triggers**: CPU > 70%, Memory > 80%

## 📋 Troubleshooting

### Common Issues

1. **Build fails**:
   - Check Node.js version compatibility
   - Verify all dependencies are in package.json

2. **Environment variables not set**:
   - Ensure `GEMINI_API_KEY` is properly configured
   - Check FastMCP dashboard Environment Variables section

3. **Service health check fails**:
   - Verify `/health` endpoint returns 200
   - Check application logs in FastMCP dashboard

### Debug Commands

```bash
# Check service status
fastmcp status TesterBud-MCP

# View logs
fastmcp logs TesterBud-MCP --tail 100

# Restart service
fastmcp restart TesterBud-MCP
```

## 🎯 Quick Deployment Checklist

- [ ] Repository cloned/forked
- [ ] `fastmcp-manifest.json` present
- [ ] `GEMINI_API_KEY` configured in FastMCP
- [ ] Service created in FastMCP dashboard
- [ ] Deployment successful
- [ ] Health check passing
- [ ] MCP client configured

## 📞 Support

- **FastMCP Documentation**: https://docs.fastmcp.cloud/
- **GitHub Issues**: https://github.com/Mapileon2/TesterBud-MCP/issues
- **FastMCP Support**: support@fastmcp.cloud
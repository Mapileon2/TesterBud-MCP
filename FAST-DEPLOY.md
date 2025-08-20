# Fast MCP Service Deployment Guide

## 🚀 One-Command Deployment Options

### Option 1: Docker (Fastest Local)
```bash
# From project root directory:
docker-compose up -d
```

### Option 2: Render (Fastest Cloud)
1. **One-Click Deploy to Render**
   [![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Mapileon2/TesterBud-MCP)

2. **Manual Render Setup** (30 seconds):
   ```bash
   # Push to GitHub first
   git add .
   git commit -m "Deploy to Render"
   git push origin main
   
   # Render will auto-deploy from render.yaml
   ```

### Option 3: Railway (Alternative Fast Cloud)
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/TesterBud-MCP)

## ⚡ Prerequisites

### For Docker (Local):
- Docker Desktop installed
- Set your `GEMINI_API_KEY` in `.env` file:
  ```bash
  echo "GEMINI_API_KEY=your_actual_key_here" > .env
  ```

### For Render (Cloud):
- GitHub repository connected to Render
- Set `GEMINI_API_KEY` in Render dashboard → Environment Variables

## 🔧 Quick Start Commands

### Docker (30 seconds):
```bash
# Clone and deploy
git clone https://github.com/Mapileon2/TesterBud-MCP.git
cd TesterBud-MCP
echo "GEMINI_API_KEY=your_key_here" > .env
docker-compose up -d
```

### Render (60 seconds):
```bash
# Already pushed to GitHub - just connect to Render
# Render will auto-build from render.yaml
```

## ✅ Verify Deployment

After deployment, test these endpoints:

```bash
# Health check
curl http://localhost:3000/health

# Create session
curl -X POST http://localhost:3000/mcp/create-session \
  -H "Content-Type: application/json" \
  -d '{"userId":"test-user"}'
```

## 📋 MCP Client Configuration

For Claude Desktop or other MCP clients, use:

```json
{
  "mcpServers": {
    "TesterBud": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-http", "http://localhost:3000/mcp"]
    }
  }
}
```

## 🛠 Troubleshooting

### Docker Issues:
```bash
# Check logs
docker-compose logs TesterBud

# Restart service
docker-compose restart TesterBud
```

### Render Issues:
- Check Render dashboard logs
- Verify `GEMINI_API_KEY` is set in Environment Variables
- Ensure Node.js version compatibility

## 📞 Support

- GitHub Issues: https://github.com/Mapileon2/TesterBud-MCP/issues
- Deployment Status: Check your chosen platform dashboard
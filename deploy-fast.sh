#!/bin/bash

# Fast MCP Service Deployment Script
# This script provides the fastest deployment options for TesterBud MCP

set -e

echo "🚀 TesterBud MCP - Fast Deployment Script"
echo "========================================"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to deploy with Docker
deploy_docker() {
    echo "📦 Deploying with Docker..."
    
    if ! command_exists docker; then
        echo "❌ Docker not found. Please install Docker Desktop."
        exit 1
    fi
    
    # Check if .env exists
    if [ ! -f .env ]; then
        echo "⚠️  .env file not found. Creating from .env.example..."
        if [ -f .env.example ]; then
            cp .env.example .env
            echo "🔧 Please edit .env file and add your GEMINI_API_KEY"
            read -p "Press Enter after adding your GEMINI_API_KEY..."
        else
            echo "❌ .env.example not found. Please create .env with GEMINI_API_KEY"
            exit 1
        fi
    fi
    
    echo "🏗️  Building and starting containers..."
    docker-compose up -d --build
    
    echo "✅ Docker deployment complete!"
    echo "🌐 Service running at: http://localhost:3000"
    echo "📊 View logs: docker-compose logs -f TesterBud"
}

# Function to deploy locally
deploy_local() {
    echo "💻 Deploying locally..."
    
    if ! command_exists node; then
        echo "❌ Node.js not found. Please install Node.js."
        exit 1
    fi
    
    # Check if .env exists
    if [ ! -f .env ]; then
        echo "⚠️  .env file not found. Creating from .env.example..."
        if [ -f .env.example ]; then
            cp .env.example .env
            echo "🔧 Please edit .env file and add your GEMINI_API_KEY"
            read -p "Press Enter after adding your GEMINI_API_KEY..."
        else
            echo "❌ .env.example not found. Please create .env with GEMINI_API_KEY"
            exit 1
        fi
    fi
    
    echo "📦 Installing dependencies..."
    npm install
    
    echo "🏗️  Building project..."
    npm run build
    
    echo "🚀 Starting server..."
    npm start &
    
    echo "✅ Local deployment complete!"
    echo "🌐 Service running at: http://localhost:3000"
    echo "📊 View logs: npm run logs (if available)"
}

# Main deployment logic
echo "Select deployment option:"
echo "1) Docker (Recommended - Fastest setup)"
echo "2) Local Node.js"
echo "3) Deploy to Render (Cloud)"
read -p "Enter choice (1-3): " choice

case $choice in
    1)
        deploy_docker
        ;;
    2)
        deploy_local
        ;;
    3)
        echo "🌐 Deploying to Render..."
        echo "📋 Steps:"
        echo "   1. Push code to GitHub"
        echo "   2. Connect GitHub repo to Render"
        echo "   3. Set GEMINI_API_KEY in Render dashboard"
        echo "   4. Render will auto-deploy from render.yaml"
        echo ""
        echo "🔗 One-click deploy: https://render.com/deploy?repo=https://github.com/Mapileon2/TesterBud-MCP"
        ;;
    *)
        echo "❌ Invalid choice. Please run script again."
        exit 1
        ;;
esac

echo ""
echo "🎯 Next Steps:"
echo "1. Test the service: curl http://localhost:3000"
echo "2. Create session: curl -X POST http://localhost:3000/mcp/create-session -H 'Content-Type: application/json' -d '{\"userId\":\"test-user\"}'"
echo "3. Configure MCP client with the provided configuration"
echo "4. Check deployment guide: cat FAST-DEPLOY.md"
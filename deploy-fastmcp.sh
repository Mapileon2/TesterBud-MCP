#!/bin/bash

# FastMCP Cloud Deployment Script for TesterBud MCP
set -e

echo "🚀 Deploying TesterBud MCP to FastMCP Cloud"
echo "=========================================="

# Check if fastmcp CLI is installed
if ! command -v fastmcp &> /dev/null; then
    echo "❌ FastMCP CLI not found. Please install it first:"
    echo "   npm install -g @fastmcp/cli"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "fastmcp-manifest.json" ]; then
    echo "❌ fastmcp-manifest.json not found. Please run this from the project root."
    exit 1
fi

# Check if .env.example exists and create .env if needed
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        echo "⚠️  .env not found, copying from .env.example"
        cp .env.example .env
        echo "🔧 Please edit .env and add your GEMINI_API_KEY"
        read -p "Press Enter after adding your GEMINI_API_KEY..."
    else
        echo "❌ .env.example not found. Please create .env with GEMINI_API_KEY"
        exit 1
    fi
fi

# Check if GEMINI_API_KEY is set
if [ -z "$GEMINI_API_KEY" ]; then
    echo "⚠️  GEMINI_API_KEY not set in environment"
    echo "🔧 You can set it during deployment or add it to .env"
fi

# Login to FastMCP (if not already logged in)
echo "🔐 Checking FastMCP authentication..."
fastmcp auth status || fastmcp auth login

# Deploy to FastMCP Cloud
echo "📦 Deploying to FastMCP Cloud..."
fastmcp deploy --manifest fastmcp-manifest.json --env-file .env

# Check deployment status
echo "✅ Deployment initiated!"
echo "📊 Checking deployment status..."
fastmcp status TesterBud-MCP

echo ""
echo "🎯 Next Steps:"
echo "1. Check deployment logs: fastmcp logs TesterBud-MCP"
echo "2. Test the service: fastmcp test TesterBud-MCP"
echo "3. Get service URL: fastmcp url TesterBud-MCP"
echo "4. Configure MCP client with the provided URL"
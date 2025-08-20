@echo off
setlocal enabledelayedexpansion

echo 🚀 Deploying TesterBud MCP to FastMCP Cloud
echo ==========================================

REM Check if fastmcp CLI is installed
where fastmcp >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ FastMCP CLI not found. Please install it first:
    echo    npm install -g @fastmcp/cli
    pause
    exit /b 1
)

REM Check if we're in the right directory
if not exist "fastmcp-manifest.json" (
    echo ❌ fastmcp-manifest.json not found. Please run this from the project root.
    pause
    exit /b 1
)

REM Check if .env.example exists and create .env if needed
if not exist ".env" (
    if exist ".env.example" (
        echo ⚠️  .env not found, copying from .env.example
        copy .env.example .env
        echo 🔧 Please edit .env and add your GEMINI_API_KEY
        pause
    ) else (
        echo ❌ .env.example not found. Please create .env with GEMINI_API_KEY
        pause
        exit /b 1
    )
)

REM Login to FastMCP (if not already logged in)
echo 🔐 Checking FastMCP authentication...
fastmcp auth status || fastmcp auth login

REM Deploy to FastMCP Cloud
echo 📦 Deploying to FastMCP Cloud...
fastmcp deploy --manifest fastmcp-manifest.json --env-file .env

REM Check deployment status
echo ✅ Deployment initiated!
echo 📊 Checking deployment status...
fastmcp status TesterBud-MCP

echo.
echo 🎯 Next Steps:
echo 1. Check deployment logs: fastmcp logs TesterBud-MCP
echo 2. Test the service: fastmcp test TesterBud-MCP
echo 3. Get service URL: fastmcp url TesterBud-MCP
echo 4. Configure MCP client with the provided URL
pause
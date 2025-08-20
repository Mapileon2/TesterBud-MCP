@echo off
setlocal enabledelayedexpansion

echo 🚀 TesterBud MCP - Fast Deployment Script (Windows)
echo ========================================

:menu
echo Select deployment option:
echo 1) Docker (Recommended - Fastest setup)
echo 2) Local Node.js
echo 3) Deploy to Render (Cloud)
set /p choice=Enter choice (1-3): 

if "%choice%"=="1" goto docker
goto local

:docker
echo 📦 Deploying with Docker...

where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Docker not found. Please install Docker Desktop.
    pause
    exit /b 1
)

if not exist .env (
    echo ⚠️  .env file not found. Creating from .env.example...
    if exist .env.example (
        copy .env.example .env
        echo 🔧 Please edit .env file and add your GEMINI_API_KEY
        pause
    ) else (
        echo ❌ .env.example not found. Please create .env with GEMINI_API_KEY
        pause
        exit /b 1
    )
)

echo 🏗️  Building and starting containers...
docker-compose up -d --build

echo ✅ Docker deployment complete!
echo 🌐 Service running at: http://localhost:3000
echo 📊 View logs: docker-compose logs -f TesterBud
goto end

:local
echo 💻 Deploying locally...

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js not found. Please install Node.js.
    pause
    exit /b 1
)

if not exist .env (
    echo ⚠️  .env file not found. Creating from .env.example...
    if exist .env.example (
        copy .env.example .env
        echo 🔧 Please edit .env file and add your GEMINI_API_KEY
        pause
    ) else (
        echo ❌ .env.example not found. Please create .env with GEMINI_API_KEY
        pause
        exit /b 1
    )
)

echo 📦 Installing dependencies...
npm install

echo 🏗️  Building project...
npm run build

echo 🚀 Starting server...
start cmd /k "npm start"

echo ✅ Local deployment complete!
echo 🌐 Service running at: http://localhost:3000
pause

:end
echo.
echo 🎯 Next Steps:
echo 1. Test the service: curl http://localhost:3000
echo 2. Create session: curl -X POST http://localhost:3000/mcp/create-session -H "Content-Type: application/json" -d "{\"userId\":\"test-user\"}"
echo 3. Configure MCP client with the provided configuration
echo 4. Check deployment guide: type FAST-DEPLOY.md
pause
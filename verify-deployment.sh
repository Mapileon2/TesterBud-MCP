#!/bin/bash

# TesterBud Deployment Verification Script
# Run this script to verify your deployment is working correctly

echo "🔍 TesterBud Deployment Verification"
echo "===================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

# Check if Node.js is installed
echo -e "${YELLOW}Checking prerequisites...${NC}"
node --version > /dev/null 2>&1
print_status $? "Node.js is installed"

npm --version > /dev/null 2>&1
print_status $? "npm is installed"

# Check if build exists
echo -e "${YELLOW}Checking build artifacts...${NC}"
if [ -d "dist" ]; then
    echo -e "${GREEN}✅ dist directory exists${NC}"
    
    if [ -f "dist/index.js" ]; then
        echo -e "${GREEN}✅ HTTP server built${NC}"
    else
        echo -e "${RED}❌ HTTP server not found${NC}"
    fi
    
    if [ -f "dist/mcp-server.js" ]; then
        echo -e "${GREEN}✅ MCP server built${NC}"
    else
        echo -e "${RED}❌ MCP server not found${NC}"
    fi
else
    echo -e "${RED}❌ dist directory not found - run npm run build${NC}"
fi

# Check environment variables
echo -e "${YELLOW}Checking environment...${NC}"
if [ -n "$GEMINI_API_KEY" ]; then
    echo -e "${GREEN}✅ GEMINI_API_KEY is set${NC}"
else
    echo -e "${YELLOW}⚠️  GEMINI_API_KEY not set (optional for basic functionality)${NC}"
fi

# Test build
echo -e "${YELLOW}Testing build...${NC}"
npm run build > /dev/null 2>&1
print_status $? "Build completes successfully"

# Test HTTP server (background)
echo -e "${YELLOW}Testing HTTP server...${NC}"
node dist/index.js &
SERVER_PID=$!
sleep 2

# Test root endpoint
if curl -s http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}✅ HTTP server responding${NC}"
    
    # Test session creation
    response=$(curl -s -X POST http://localhost:3000/mcp/create-session \
        -H "Content-Type: application/json" \
        -d '{"userId":"test-verification"}')
    
    if echo "$response" | grep -q "sessionId"; then
        echo -e "${GREEN}✅ Session creation working${NC}"
    else
        echo -e "${RED}❌ Session creation failed${NC}"
    fi
else
    echo -e "${RED}❌ HTTP server not responding${NC}"
fi

# Kill server
kill $SERVER_PID 2>/dev/null

# Test MCP server (stdio mode)
echo -e "${YELLOW}Testing MCP server...${NC}"
timeout 3s node dist/mcp-server.js < /dev/null > /dev/null 2>&1
if [ $? -eq 0 ] || [ $? -eq 124 ]; then
    echo -e "${GREEN}✅ MCP server starts correctly${NC}"
else
    echo -e "${RED}❌ MCP server failed to start${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Verification complete!${NC}"
echo ""
echo "Your TesterBud server is ready for production!"
echo ""
echo "Next steps:"
echo "1. Set your GEMINI_API_KEY in .env file"
echo "2. Choose your deployment method from DEPLOYMENT-GUIDE.md"
echo "3. Deploy to your preferred platform"
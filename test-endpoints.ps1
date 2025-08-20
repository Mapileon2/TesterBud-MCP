# Test script for TesterBud MCP Server endpoints

Write-Host "Testing TesterBud MCP Server..." -ForegroundColor Green

# Test 1: Root endpoint
Write-Host "`n1. Testing root endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000" -Method Get
    Write-Host "✅ Root endpoint: $response" -ForegroundColor Green
} catch {
    Write-Host "❌ Root endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Create session
Write-Host "`n2. Testing create session endpoint..." -ForegroundColor Yellow
try {
    $body = @{"userId"="test-user-123"} | ConvertTo-Json
    $response = Invoke-RestMethod -Uri "http://localhost:3000/mcp/create-session" -Method Post -Body $body -ContentType "application/json"
    Write-Host "✅ Create session: $($response | ConvertTo-Json -Depth 10)" -ForegroundColor Green
    $sessionId = $response.sessionId
} catch {
    Write-Host "❌ Create session failed: $($_.Exception.Message)" -ForegroundColor Red
    return
}

# Test 3: Get session
Write-Host "`n3. Testing get session endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/mcp/session/$sessionId" -Method Get
    Write-Host "✅ Get session: $($response | ConvertTo-Json -Depth 10)" -ForegroundColor Green
} catch {
    Write-Host "❌ Get session failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Add context to session
Write-Host "`n4. Testing add context endpoint..." -ForegroundColor Yellow
try {
    $body = @{"context"="This is a test context for debugging"} | ConvertTo-Json
    $response = Invoke-RestMethod -Uri "http://localhost:3000/mcp/session/$sessionId/add-context" -Method Post -Body $body -ContentType "application/json"
    Write-Host "✅ Add context: $($response | ConvertTo-Json -Depth 10)" -ForegroundColor Green
} catch {
    Write-Host "❌ Add context failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎉 All tests completed!" -ForegroundColor Green
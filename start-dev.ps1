# Alexandria Mobility Platform - Development Startup Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Alexandria Mobility Platform - Starting" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check prerequisites
$hasDotnet = Get-Command dotnet -ErrorAction SilentlyContinue
$hasNode = Get-Command node -ErrorAction SilentlyContinue

if (-not $hasDotnet) {
    Write-Host "ERROR: .NET SDK not found. Please install .NET 8 SDK." -ForegroundColor Red
    exit 1
}

if (-not $hasNode) {
    Write-Host "ERROR: Node.js not found. Please install Node.js 18+." -ForegroundColor Red
    exit 1
}

Write-Host "[1/3] Starting Backend API..." -ForegroundColor Yellow
$apiJob = Start-Job -ScriptBlock {
    Set-Location "$using:PWD\backend"
    dotnet run --project src\Alexandria.API --urls "http://localhost:5000"
}
Write-Host "  Backend starting on http://localhost:5000" -ForegroundColor Green
Write-Host "  Swagger UI: http://localhost:5000/swagger" -ForegroundColor Green
Start-Sleep -Seconds 10

Write-Host "[2/3] Installing Web Dependencies..." -ForegroundColor Yellow
Set-Location "$PWD\web"
npm install --silent
Write-Host "  Dependencies installed" -ForegroundColor Green

Write-Host "[3/3] Starting Web Application..." -ForegroundColor Yellow
$webJob = Start-Job -ScriptBlock {
    Set-Location "$using:PWD\web"
    npm run dev
}
Write-Host "  Web app starting on http://localhost:3000" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Platform is starting up!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host " Backend API:   http://localhost:5000" -ForegroundColor White
Write-Host " Swagger Docs:  http://localhost:5000/swagger" -ForegroundColor White
Write-Host " Web App:       http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host " Default Login:" -ForegroundColor Yellow
Write-Host "   Email:    admin@alexandria.com" -ForegroundColor White
Write-Host "   Password: Admin@123" -ForegroundColor White
Write-Host ""
Write-Host " Press Ctrl+C to stop all services" -ForegroundColor Red
Write-Host ""

# Wait for either job to complete
Wait-Job $apiJob, $webJob

# Cleanup
Stop-Job $apiJob, $webJob -ErrorAction SilentlyContinue
Remove-Job $apiJob, $webJob -ErrorAction SilentlyContinue

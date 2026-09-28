# Test script for KRYPTON wakeup
Write-Host "Testing KRYPTON wakeup command..." -ForegroundColor Cyan

# Test 1: Version
Write-Host "`n1. Testing --version..." -ForegroundColor Yellow
bun run src/index.ts --version

# Test 2: Help
Write-Host "`n2. Testing --help..." -ForegroundColor Yellow
bun run src/index.ts --help

# Test 3: Check environment
Write-Host "`n3. Checking .env file..." -ForegroundColor Yellow
if (Test-Path .env) {
    Write-Host "   OK .env file exists" -ForegroundColor Green
} else {
    Write-Host "   ERROR .env file not found" -ForegroundColor Red
}

Write-Host "`n4. To start KRYPTON interactively, run:" -ForegroundColor Cyan
Write-Host "   bun wakeup" -ForegroundColor White -NoNewline
Write-Host "  (recommended)" -ForegroundColor Gray
Write-Host "   bun start" -ForegroundColor White -NoNewline
Write-Host "   (also works)" -ForegroundColor Gray

Write-Host "`n5. Optional: Install globally to use 'wakeup-krypton' anywhere:" -ForegroundColor Cyan
Write-Host "   .\install-global.ps1" -ForegroundColor White

Write-Host "`nAll checks completed!" -ForegroundColor Green

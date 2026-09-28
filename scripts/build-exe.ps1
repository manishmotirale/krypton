# Build KRYPTON as a standalone executable
# This creates a single .exe file that can be distributed

Write-Host "`n🚀 Building KRYPTON executable..." -ForegroundColor Cyan

# Check if bun is installed
if (!(Get-Command bun -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Error: Bun is not installed" -ForegroundColor Red
    Write-Host "   Install from: https://bun.sh" -ForegroundColor Yellow
    exit 1
}

# Clean previous builds
Write-Host "`n🧹 Cleaning previous builds..." -ForegroundColor Yellow
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
}
New-Item -ItemType Directory -Path "dist" -Force | Out-Null

# Build the executable
Write-Host "`n📦 Building executable..." -ForegroundColor Yellow
Write-Host "   This may take a few minutes..." -ForegroundColor Gray

bun build src/index.ts --compile --outfile dist/krypton.exe

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Build successful!" -ForegroundColor Green
    
    # Get file size
    $exeSize = (Get-Item "dist/krypton.exe").Length / 1MB
    Write-Host "   File: dist/krypton.exe" -ForegroundColor White
    Write-Host "   Size: $([math]::Round($exeSize, 2)) MB" -ForegroundColor White
    
    Write-Host "`n⚠️  IMPORTANT NOTES:" -ForegroundColor Yellow
    Write-Host "   1. Users will need to create their own .env file" -ForegroundColor White
    Write-Host "   2. Place krypton.exe in a folder with .env file" -ForegroundColor White
    Write-Host "   3. The .env file is NOT included in the executable" -ForegroundColor White
    Write-Host "   4. Consider creating an installer or setup script" -ForegroundColor White
    
    Write-Host "`n📋 Next steps:" -ForegroundColor Cyan
    Write-Host "   1. Test: .\dist\krypton.exe wakeup" -ForegroundColor White
    Write-Host "   2. Create installer: .\scripts\create-installer.ps1" -ForegroundColor White
    Write-Host "   3. Or distribute with setup guide" -ForegroundColor White
} else {
    Write-Host "`n❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""

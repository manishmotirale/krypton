# Create a distributable package for KRYPTON
# This creates a ZIP file with the EXE and setup instructions

Write-Host "`n📦 Creating KRYPTON installer package..." -ForegroundColor Cyan

# Check if exe exists
if (!(Test-Path "dist/krypton.exe")) {
    Write-Host "❌ Error: krypton.exe not found!" -ForegroundColor Red
    Write-Host "   Run: .\scripts\build-exe.ps1 first" -ForegroundColor Yellow
    exit 1
}

# Create package directory
$packageDir = "dist/krypton-installer"
Write-Host "`n📁 Creating package directory..." -ForegroundColor Yellow
if (Test-Path $packageDir) {
    Remove-Item -Recurse -Force $packageDir
}
New-Item -ItemType Directory -Path $packageDir -Force | Out-Null

# Copy executable
Write-Host "   Copying executable..." -ForegroundColor Gray
Copy-Item "dist/krypton.exe" -Destination $packageDir

# Copy logo
Write-Host "   Copying logo..." -ForegroundColor Gray
if (Test-Path "krypton.png") {
    Copy-Item "krypton.png" -Destination $packageDir
}

# Create .env.example for users
Write-Host "   Creating .env.example..." -ForegroundColor Gray
Copy-Item ".env.example" -Destination $packageDir

# Create setup instructions
Write-Host "   Creating setup guide..." -ForegroundColor Gray
$setupGuide = @"
# 🚀 KRYPTON - Setup Guide

## Quick Setup (3 Steps)

### 1. Create Configuration File
Copy `.env.example` to `.env` and edit it:

``````
OPENROUTER_API_KEY=your-key-here
OPENROUTER_DEFAULT_MODEL=openrouter/auto
``````

### 2. Get Your API Key
Visit: https://openrouter.ai/
- Sign up for a free account
- Get your API key
- Paste it in the .env file

### 3. Run KRYPTON
Double-click `krypton.exe` or run in terminal:
``````
.\krypton.exe wakeup
``````

## Optional Setup

### Telegram Bot (Optional)
1. Message @BotFather on Telegram to create a bot
2. Message @userinfobot to get your user ID
3. Add to .env:
``````
TELEGRAM_BOT_TOKEN=your-token
TELEGRAM_OWNER_ID=your-id
``````

### Web Tools (Optional)
Get Firecrawl API key from: https://firecrawl.dev/
Add to .env:
``````
FIRECRAWL_API_KEY=your-key
``````

## Usage

Run in terminal:
``````
.\krypton.exe wakeup     # Start KRYPTON
.\krypton.exe --help     # Show help
.\krypton.exe --version  # Show version
``````

## Troubleshooting

### "OPENROUTER_API_KEY is required"
→ Make sure .env file exists in the same folder as krypton.exe
→ Check that OPENROUTER_API_KEY is set in .env

### Windows Defender Warning
→ Click "More info" → "Run anyway"
→ This is normal for unsigned executables

### Terminal closes immediately
→ Run from Command Prompt or PowerShell
→ Don't double-click the exe directly

## Need Help?

Full documentation: https://github.com/your-repo
Issues: https://github.com/your-repo/issues

---

**Made with ❤️ by the KRYPTON team**
"@

$setupGuide | Out-File -FilePath "$packageDir/SETUP.md" -Encoding UTF8

# Create quick start batch file
Write-Host "   Creating launcher..." -ForegroundColor Gray
$launcher = @"
@echo off
echo Starting KRYPTON...
echo.
krypton.exe wakeup
pause
"@
$launcher | Out-File -FilePath "$packageDir/Start-KRYPTON.bat" -Encoding ASCII

# Create README
Write-Host "   Creating README..." -ForegroundColor Gray
$readme = @"
# KRYPTON v1.0.0

## Quick Start

1. Read SETUP.md
2. Create .env file from .env.example
3. Add your OpenRouter API key
4. Double-click Start-KRYPTON.bat

## Files

- krypton.exe         - Main executable
- .env.example        - Configuration template
- SETUP.md           - Detailed setup guide
- Start-KRYPTON.bat  - Quick launcher
- krypton.png        - Logo

## Links

- Documentation: https://github.com/your-repo
- Get API Key: https://openrouter.ai/
- Support: https://github.com/your-repo/issues
"@
$readme | Out-File -FilePath "$packageDir/README.txt" -Encoding UTF8

# Create ZIP archive
Write-Host "`n📦 Creating ZIP archive..." -ForegroundColor Yellow
$zipPath = "dist/krypton-installer-v1.0.0.zip"
if (Test-Path $zipPath) {
    Remove-Item -Force $zipPath
}

Compress-Archive -Path "$packageDir/*" -DestinationPath $zipPath

$zipSize = (Get-Item $zipPath).Length / 1MB

Write-Host "`n✅ Installer package created!" -ForegroundColor Green
Write-Host "   File: $zipPath" -ForegroundColor White
Write-Host "   Size: $([math]::Round($zipSize, 2)) MB" -ForegroundColor White

Write-Host "`n📋 Package contents:" -ForegroundColor Cyan
Get-ChildItem $packageDir | ForEach-Object {
    $size = if ($_.PSIsContainer) { "DIR" } else { "$([math]::Round($_.Length / 1KB, 1)) KB" }
    Write-Host "   $($_.Name.PadRight(25)) $size" -ForegroundColor White
}

Write-Host "`n🌐 Distribution options:" -ForegroundColor Cyan
Write-Host "   1. Upload $zipPath to your website" -ForegroundColor White
Write-Host "   2. Create a GitHub release with this file" -ForegroundColor White
Write-Host "   3. Share via direct download link" -ForegroundColor White

Write-Host "`n⚠️  Important for users:" -ForegroundColor Yellow
Write-Host "   • They must create .env file with API key" -ForegroundColor White
Write-Host "   • Windows may show security warning (normal)" -ForegroundColor White
Write-Host "   • Antivirus might flag it (false positive)" -ForegroundColor White

Write-Host ""

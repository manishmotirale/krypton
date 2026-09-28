# Install KRYPTON globally so you can use "wakeup krypton" from anywhere

Write-Host "`n🚀 Installing KRYPTON globally..." -ForegroundColor Cyan

# Create a global script directory if it doesn't exist
$globalScriptDir = "$env:USERPROFILE\.krypton"
if (!(Test-Path $globalScriptDir)) {
    New-Item -ItemType Directory -Path $globalScriptDir -Force | Out-Null
    Write-Host "✓ Created directory: $globalScriptDir" -ForegroundColor Green
}

# Get the current project path
$projectPath = Get-Location

# Create the wakeup script
$wakeupScript = @"
#!/usr/bin/env pwsh
# KRYPTON Wakeup Script
Set-Location "$projectPath"
bun run src/index.ts wakeup
"@

# Save the script
$scriptPath = Join-Path $globalScriptDir "wakeup-krypton.ps1"
$wakeupScript | Out-File -FilePath $scriptPath -Encoding UTF8 -Force
Write-Host "✓ Created script: $scriptPath" -ForegroundColor Green

# Create a simple CMD wrapper for Windows
$cmdWrapper = @"
@echo off
powershell.exe -ExecutionPolicy Bypass -File "$scriptPath"
"@

$cmdPath = Join-Path $globalScriptDir "wakeup-krypton.cmd"
$cmdWrapper | Out-File -FilePath $cmdPath -Encoding ASCII -Force
Write-Host "✓ Created CMD wrapper: $cmdPath" -ForegroundColor Green

# Check if the directory is in PATH
$currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($currentPath -notlike "*$globalScriptDir*") {
    Write-Host "`n⚠️  Adding to PATH..." -ForegroundColor Yellow
    
    # Add to user PATH
    [Environment]::SetEnvironmentVariable(
        "Path",
        "$currentPath;$globalScriptDir",
        "User"
    )
    
    # Also update current session
    $env:Path = "$env:Path;$globalScriptDir"
    
    Write-Host "✓ Added $globalScriptDir to PATH" -ForegroundColor Green
    Write-Host "⚠️  You may need to restart your terminal for PATH changes to take effect" -ForegroundColor Yellow
} else {
    Write-Host "✓ Directory already in PATH" -ForegroundColor Green
}

Write-Host "`n✅ Installation complete!" -ForegroundColor Green
Write-Host "`nYou can now use:" -ForegroundColor Cyan
Write-Host "  wakeup-krypton      " -ForegroundColor White -NoNewline
Write-Host "(from anywhere)" -ForegroundColor Gray

Write-Host "`nOr from this directory:" -ForegroundColor Cyan
Write-Host "  bun wakeup          " -ForegroundColor White -NoNewline
Write-Host "(shorter)" -ForegroundColor Gray
Write-Host "  bun start           " -ForegroundColor White -NoNewline
Write-Host "(traditional)" -ForegroundColor Gray

Write-Host "`n💡 Tip: Restart your terminal if 'wakeup-krypton' doesn't work immediately`n" -ForegroundColor Yellow

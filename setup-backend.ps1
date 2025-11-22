# DocLite Backend Setup Script for Windows

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  DocLite Backend Server Setup" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js is NOT installed" -ForegroundColor Red
    Write-Host "Please install Node.js from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Installing npm dependencies..." -ForegroundColor Yellow
cd server
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Dependencies installed successfully!" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Optional System Tools:" -ForegroundColor Yellow
Write-Host "For full functionality, install these tools:" -ForegroundColor White
Write-Host ""
Write-Host "1. FFmpeg (Audio/Video processing)" -ForegroundColor Cyan
Write-Host "   Download: https://ffmpeg.org/download.html" -ForegroundColor White
Write-Host "   Or via Chocolatey: choco install ffmpeg" -ForegroundColor Gray
Write-Host ""
Write-Host "2. LibreOffice (Document conversion)" -ForegroundColor Cyan
Write-Host "   Download: https://www.libreoffice.org/download/" -ForegroundColor White
Write-Host ""
Write-Host "3. qpdf (PDF encryption)" -ForegroundColor Cyan
Write-Host "   Download: https://qpdf.sourceforge.io/" -ForegroundColor White
Write-Host "   Or via Chocolatey: choco install qpdf" -ForegroundColor Gray
Write-Host ""
Write-Host "4. ImageMagick (Image processing)" -ForegroundColor Cyan
Write-Host "   Download: https://imagemagick.org/script/download.php" -ForegroundColor White
Write-Host "   Or via Chocolatey: choco install imagemagick" -ForegroundColor Gray
Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "To start the server:" -ForegroundColor Yellow
Write-Host "  npm start" -ForegroundColor White
Write-Host ""
Write-Host "To start in development mode (auto-restart):" -ForegroundColor Yellow
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""

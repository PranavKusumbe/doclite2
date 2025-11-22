# PowerShell script to add back navigation arrow to all tool files

$toolsPath = "d:\doclite2\tools"
$oldNavbar = '<a href="../index.html" class="navbar-logo">DocLite</a>'
$newNavbar = '<a href="../index.html" class="navbar-logo">DocLite</a>'

# Get all HTML files in tools directory
$files = Get-ChildItem -Path $toolsPath -Filter "*.html"

$successCount = 0
$failCount = 0

foreach ($file in $files) {
    try {
        $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
        
        if ($content -match [regex]::Escape($oldNavbar)) {
            $newContent = $content -replace [regex]::Escape($oldNavbar), $newNavbar
            Set-Content -Path $file.FullName -Value $newContent -Encoding UTF8 -NoNewline
            Write-Host "Updated: $($file.Name)" -ForegroundColor Green
            $successCount++
        } else {
            Write-Host "Skipped (pattern not found): $($file.Name)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "Failed: $($file.Name)" -ForegroundColor Red
        $failCount++
    }
}

Write-Host ""
Write-Host "=== Summary ===" -ForegroundColor Cyan
Write-Host "Total files: $($files.Count)" -ForegroundColor White
Write-Host "Updated: $successCount" -ForegroundColor Green
Write-Host "Failed: $failCount" -ForegroundColor Red

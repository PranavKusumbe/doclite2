# PowerShell script to add results-grid class to all resultsGrid divs

$toolsPath = "d:\doclite2\tools"
$oldPattern = '<div id="resultsGrid">'
$newPattern = '<div id="resultsGrid" class="results-grid">'

# Get all HTML files in tools directory
$files = Get-ChildItem -Path $toolsPath -Filter "*.html"

$successCount = 0
$failCount = 0
$skippedCount = 0

foreach ($file in $files) {
    try {
        $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
        
        if ($content -match [regex]::Escape($oldPattern)) {
            $newContent = $content -replace [regex]::Escape($oldPattern), $newPattern
            Set-Content -Path $file.FullName -Value $newContent -Encoding UTF8 -NoNewline
            Write-Host "Updated: $($file.Name)" -ForegroundColor Green
            $successCount++
        } else {
            Write-Host "Skipped (no match): $($file.Name)" -ForegroundColor Yellow
            $skippedCount++
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
Write-Host "Skipped: $skippedCount" -ForegroundColor Yellow
Write-Host "Failed: $failCount" -ForegroundColor Red

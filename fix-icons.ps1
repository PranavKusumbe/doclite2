# PowerShell script to replace emoji icons with Tabler icons in all tools

$iconMapping = @{
    '🗜️' = '<i class="ti ti-file-zip"></i>'
    '📸' = '<i class="ti ti-camera"></i>'
    '📄' = '<i class="ti ti-file-type-pdf"></i>'
    '🖼️' = '<i class="ti ti-photo"></i>'
    '🔗' = '<i class="ti ti-link"></i>'
    '✂️' = '<i class="ti ti-cut"></i>'
    '📏' = '<i class="ti ti-ruler"></i>'
    '🔄' = '<i class="ti ti-transform"></i>'
    '💫' = '<i class="ti ti-sparkles"></i>'
    '✨' = '<i class="ti ti-sparkles"></i>'
    '🔢' = '<i class="ti ti-numbers"></i>'
    '⏱️' = '<i class="ti ti-clock"></i>'
    '🔠' = '<i class="ti ti-letter-case"></i>'
    '📊' = '<i class="ti ti-chart-bar"></i>'
    '🗑️' = '<i class="ti ti-trash"></i>'
    '↔️' = '<i class="ti ti-arrows-horizontal"></i>'
    '📝' = '<i class="ti ti-file-text"></i>'
    '🔐' = '<i class="ti ti-lock"></i>'
    '🔓' = '<i class="ti ti-lock-open"></i>'
    '{ }' = '<i class="ti ti-braces"></i>'
    '&lt;/&gt;' = '<i class="ti ti-code"></i>'
    '<>' = '<i class="ti ti-code"></i>'
    '🔍' = '<i class="ti ti-search"></i>'
    '🎨' = '<i class="ti ti-palette"></i>'
    '📱' = '<i class="ti ti-qrcode"></i>'
    '🎬' = '<i class="ti ti-movie"></i>'
    '🔊' = '<i class="ti ti-volume"></i>'
    '📋' = '<i class="ti ti-clipboard"></i>'
    '🧹' = '<i class="ti ti-eraser"></i>'
    '🔒' = '<i class="ti ti-lock"></i>'
}

$toolsPath = "d:\doclite2\tools"
$files = Get-ChildItem -Path $toolsPath -Filter "*.html"

$totalUpdates = 0

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    $originalContent = $content
    $fileUpdates = 0
    
    foreach ($emoji in $iconMapping.Keys) {
        $tabler = $iconMapping[$emoji]
        $pattern = '<div class="tool-header-icon">' + [regex]::Escape($emoji) + '</div>'
        $replacement = '<div class="tool-header-icon">' + $tabler + '</div>'
        
        if ($content -match [regex]::Escape($pattern)) {
            $content = $content -replace [regex]::Escape($pattern), $replacement
            $fileUpdates++
        }
    }
    
    if ($fileUpdates -gt 0) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
        Write-Host "Updated $($file.Name): $fileUpdates icon(s)" -ForegroundColor Green
        $totalUpdates += $fileUpdates
    }
}

Write-Host ""
Write-Host "=== Summary ===" -ForegroundColor Cyan
Write-Host "Total icons replaced: $totalUpdates" -ForegroundColor Green

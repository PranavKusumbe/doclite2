$files = Get-ChildItem -Recurse "d:\doclite2\*.html"

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Fix encoding issues using unicode escape sequences to avoid parser issues
    # Â° -> \u00C2\u00B0
    $content = $content -replace '\u00C2\u00B0', '&deg;'
    # â†’ -> \u00E2\u0086\u0092
    $content = $content -replace '\u00E2\u0086\u0092', '&rarr;'
    # â€“ -> \u00E2\u0080\u0093
    $content = $content -replace '\u00E2\u0080\u0093', '&ndash;'
    # â€” -> \u00E2\u0080\u0094
    $content = $content -replace '\u00E2\u0080\u0094', '&mdash;'
    # â€™ -> \u00E2\u0080\u0099
    $content = $content -replace '\u00E2\u0080\u0099', '&rsquo;'
    # â€œ -> \u00E2\u0080\u009C
    $content = $content -replace '\u00E2\u0080\u009C', '&ldquo;'
    # â€ -> \u00E2\u0080\u009D
    $content = $content -replace '\u00E2\u0080\u009D', '&rdquo;'
    
    Set-Content -Path $file.FullName -Value $content -Encoding UTF8
    Write-Host "Fixed encoding in $($file.Name)"
}

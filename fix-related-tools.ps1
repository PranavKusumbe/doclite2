$files = Get-ChildItem "d:\doclite2\tools\*.html"
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Fix the double nesting and invalid HTML created by previous script
    # We want to remove the outer div (which is wrongly named related-tools-grid now) and rename the inner tools-grid to related-tools-grid
    
    $content = $content -replace '<div class="related-tools-grid">\s*<h2 class="related-tools-title">(.+?)</h2>\s*<div class="tools-grid">', '<h2 class="related-tools-title">$1</h2><div class="related-tools-grid">'
    
    Set-Content -Path $file.FullName -Value $content -Encoding UTF8
    Write-Host "Fixed structure in $($file.Name)"
}

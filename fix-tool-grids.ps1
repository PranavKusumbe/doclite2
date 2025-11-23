$files = Get-ChildItem "d:\doclite2\tools\*.html"
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $newContent = $content -replace 'style="display:grid;grid-template-columns:1fr 1fr;gap:2rem;margin:2rem 0;"', 'class="tool-grid-2"'
    
    # Fix the weird one in remove-duplicates.html if it exists
    $newContent = $newContent -replace '@media\(max-width:768px\)\{grid-template-columns:1fr;\}', ''
    
    if ($content -ne $newContent) {
        Set-Content $file.FullName $newContent -Encoding UTF8
        Write-Host "Fixed grid in $($file.Name)"
    }
}
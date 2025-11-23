$files = Get-ChildItem -Path . -Recurse -Filter *.html

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw
    
    # Remove Monetag Meta Tag
    $content = $content -replace '<meta name="monetag" content="4a2962f9baaf16a605331cb28a99eacd">\s*', ''
    
    # Remove Multitag Script and comments
    $content = $content -replace '(?s)<!-- Multitag -->.*?tag\.min\.js.*?<\/script>\s*', ''
    
    # Remove any remaining Multitag script if comment is missing
    $content = $content -replace '(?s)<script src="https://fpyf8\.com/88/tag\.min\.js".*?<\/script>\s*', ''

    Set-Content -Path $file.FullName -Value $content -Encoding UTF8
    Write-Host "Cleaned $($file.Name)"
}

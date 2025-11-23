$files = Get-ChildItem "d:\doclite2\tools\*.html"

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Replace button text artifacts with icons
    $content = $content -replace '\?\? Copy', '<i class="ti ti-copy"></i> Copy'
    $content = $content -replace '\? Format', '<i class="ti ti-wand"></i> Format'
    $content = $content -replace '\?\?\? Minify', '<i class="ti ti-minimize"></i> Minify'
    $content = $content -replace '\? Validate', '<i class="ti ti-check"></i> Validate'
    $content = $content -replace '\?\? Clear', '<i class="ti ti-eraser"></i> Clear'
    $content = $content -replace '\?\? Download', '<i class="ti ti-download"></i> Download'
    $content = $content -replace '\?\? Convert', '<i class="ti ti-transform"></i> Convert'
    $content = $content -replace '\?\? Upload', '<i class="ti ti-upload"></i> Upload'
    
    # Fix any remaining double question marks in buttons
    $content = $content -replace '<button(.*?)>\?\? (.*?)</button>', '<button$1><i class="ti ti-click"></i> $2</button>'
    
    Set-Content -Path $file.FullName -Value $content -Encoding UTF8
    Write-Host "Fixed buttons in $($file.Name)"
}

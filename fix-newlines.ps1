$tools = Get-ChildItem -Path "d:\doclite2\tools" -Filter *.html

foreach ($tool in $tools) {
    $content = Get-Content $tool.FullName -Raw -Encoding UTF8
    
    # Fix the literal `n</body> issue
    if ($content -match '`n</body>') {
        $content = $content -replace '`n</body>', "`n</body>"
        [System.IO.File]::WriteAllText($tool.FullName, $content, [System.Text.Encoding]::UTF8)
        Write-Host "Fixed newline issue in $($tool.Name)"
    }
}

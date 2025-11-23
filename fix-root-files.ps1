$files = @("index.html", "about.html", "contact.html", "privacy.html", "terms.html")

foreach ($file in $files) {
    $path = "d:\doclite2\$file"
    if (Test-Path $path) {
        $content = Get-Content $path -Raw -Encoding UTF8
        if ($content -notmatch 'cookie-consent.js') {
            $content = $content -replace '</body>', '<script defer src="js/cookie-consent.js"></script>`n</body>'
            # Fix potential newline issue here too just in case
            $content = $content -replace '`n</body>', "`n</body>"
            [System.IO.File]::WriteAllText($path, $content, [System.Text.Encoding]::UTF8)
            Write-Host "Added cookie consent to $file"
        }
    }
}

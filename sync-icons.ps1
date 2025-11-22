# PowerShell script to sync tool header icons with homepage icons

$iconMappings = @{
    'compress-image.html' = 'ti-arrows-minimize'
    'compress-pdf.html' = 'ti-arrows-minimize'
    'pdf-to-jpg.html' = 'ti-camera'
    'pdf-to-png.html' = 'ti-photo'
    'merge-pdf.html' = 'ti-link'
    'split-pdf.html' = 'ti-scissors'
    'extract-pages.html' = 'ti-files'
    'rotate-pdf.html' = 'ti-rotate-clockwise'
    'rotate-image.html' = 'ti-rotate'
    'remove-watermark.html' = 'ti-eraser'
    'unlock-pdf.html' = 'ti-lock-open'
    'protect-pdf.html' = 'ti-lock'
    'resize-image.html' = 'ti-dimensions'
    'crop-image.html' = 'ti-crop'
    'blur-image.html' = 'ti-blur'
    'background-remover.html' = 'ti-eraser'
    'jpg-to-png.html' = 'ti-transform'
    'jpg-to-pdf.html' = 'ti-file-type-pdf'
    'jpg-to-webp.html' = 'ti-transform'
    'png-to-jpg.html' = 'ti-transform'
    'png-to-pdf.html' = 'ti-file-type-pdf'
    'webp-to-jpg.html' = 'ti-transform'
    'image-to-pdf.html' = 'ti-photo'
    'pdf-to-text.html' = 'ti-file-type-txt'
    'word-to-pdf.html' = 'ti-file-description'
    'image-to-base64.html' = 'ti-code'
    'base64-to-image.html' = 'ti-photo-code'
    'word-counter.html' = 'ti-calculator'
    'character-counter.html' = 'ti-alphabet-latin'
    'remove-duplicates.html' = 'ti-copy-off'
    'remove-line-breaks.html' = 'ti-arrows-horizontal'
    'case-converter.html' = 'ti-letter-case'
    'read-time.html' = 'ti-clock'
    'lorem-ipsum.html' = 'ti-file-text'
    'encrypt-decrypt.html' = 'ti-lock'
    'text-to-ascii.html' = 'ti-binary'
    'json-formatter.html' = 'ti-braces'
    'json-to-csv.html' = 'ti-table'
    'csv-to-json.html' = 'ti-braces'
    'xml-formatter.html' = 'ti-code'
    'html-minifier.html' = 'ti-code'
    'js-minifier.html' = 'ti-brand-javascript'
    'regex-tester.html' = 'ti-regex'
    'url-encoder.html' = 'ti-link'
    'qr-generator.html' = 'ti-qrcode'
    'file-renamer.html' = 'ti-file-text'
    'video-to-gif.html' = 'ti-movie'
    'audio-compressor.html' = 'ti-volume'
}

$toolsPath = "d:\doclite2\tools"
$totalFixed = 0

foreach ($filename in $iconMappings.Keys) {
    $filePath = Join-Path $toolsPath $filename
    
    if (Test-Path $filePath) {
        $content = Get-Content -Path $filePath -Raw -Encoding UTF8
        $icon = $iconMappings[$filename]
        
        # Match any icon in tool-header-icon div
        if ($content -match '<div class="tool-header-icon">.*?</div>') {
            $newIcon = "<div class=`"tool-header-icon`"><i class=`"ti $icon`"></i></div>"
            $content = $content -replace '<div class="tool-header-icon">.*?</div>', $newIcon
            Set-Content -Path $filePath -Value $content -Encoding UTF8 -NoNewline
            Write-Host "Fixed: $filename -> $icon" -ForegroundColor Green
            $totalFixed++
        }
    }
}

Write-Host ""
Write-Host "Total files fixed: $totalFixed" -ForegroundColor Cyan

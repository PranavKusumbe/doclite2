# PowerShell script to replace tool header icons with Tabler icons

$toolsPath = "d:\doclite2\tools"
$files = Get-ChildItem -Path $toolsPath -Filter "*.html"

$totalUpdates = 0

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    $updated = $false
    
    # Compress icons
    if ($content -match 'compress.*tool-header-icon[^>]*>([^<]+)<') {
        $content = $content -replace '(<div class="tool-header-icon">)[^<]+(</div>)', '$1<i class="ti ti-file-zip"></i>$2'
        $updated = $true
    }
    
    # Camera/Photo icons
    if ($content -match '(pdf-to-jpg|pdf-to-png)\.html' -and $content -match 'tool-header-icon') {
        $content = $content -replace '(<div class="tool-header-icon">)[^<]+(</div>)', '$1<i class="ti ti-camera"></i>$2'
        $updated = $true
    }
    
    # Resize/Dimension icons  
    if ($content -match 'resize.*tool-header-icon') {
        $content = $content -replace '(<div class="tool-header-icon">)[^<]+(</div>)', '$1<i class="ti ti-dimensions"></i>$2'
        $updated = $true
    }
    
    # Rotate icons
    if ($content -match 'rotate.*tool-header-icon') {
        $content = $content -replace '(<div class="tool-header-icon">)[^<]+(</div>)', '$1<i class="ti ti-rotate-clockwise"></i>$2'
        $updated = $true
    }
    
    # Word counter
    if ($content -match 'Word Counter.*tool-header-icon') {
        $content = $content -replace '(<div class="tool-header-icon">)[^<]+(</div>)', '$1<i class="ti ti-numbers"></i>$2'
        $updated = $true
    }
    
    # Read time
    if ($content -match 'Read Time.*tool-header-icon') {
        $content = $content -replace '(<div class="tool-header-icon">)[^<]+(</div>)', '$1<i class="ti ti-clock"></i>$2'
        $updated = $true
    }
    
    # Case converter
    if ($content -match 'Case Converter.*tool-header-icon') {
        $content = $content -replace '(<div class="tool-header-icon">)[^<]+(</div>)', '$1<i class="ti ti-letter-case"></i>$2'
        $updated = $true
    }
    
    # Character counter  
    if ($content -match 'Character Counter.*tool-header-icon') {
        $content = $content -replace '(<div class="tool-header-icon">)[^<]+(</div>)', '$1<i class="ti ti-123"></i>$2'
        $updated = $true
    }
    
    # JSON formatter
    if ($content -match 'JSON.*tool-header-icon') {
        $content = $content -replace '(<div class="tool-header-icon">)[^<]+(</div>)', '$1<i class="ti ti-braces"></i>$2'
        $updated = $true
    }
    
    # HTML/JS minifier  
    if ($content -match '(HTML|JS) Minifier.*tool-header-icon') {
        $content = $content -replace '(<div class="tool-header-icon">)[^<]+(</div>)', '$1<i class="ti ti-code"></i>$2'
        $updated = $true
    }
    
    # Regex tester
    if ($content -match 'Regex.*tool-header-icon') {
        $content = $content -replace '(<div class="tool-header-icon">)[^<]+(</div>)', '$1<i class="ti ti-search"></i>$2'
        $updated = $true
    }
    
    # Color picker
    if ($content -match 'Color Picker.*tool-header-icon') {
        $content = $content -replace '(<div class="tool-header-icon">)[^<]+(</div>)', '$1<i class="ti ti-palette"></i>$2'
        $updated = $true
    }
    
    # QR Generator
    if ($content -match 'QR.*tool-header-icon') {
        $content = $content -replace '(<div class="tool-header-icon">)[^<]+(</div>)', '$1<i class="ti ti-qrcode"></i>$2'
        $updated = $true
    }
    
    # Video to GIF
    if ($content -match 'Video to GIF.*tool-header-icon') {
        $content = $content -replace '(<div class="tool-header-icon">)[^<]+(</div>)', '$1<i class="ti ti-movie"></i>$2'
        $updated = $true
    }
    
    # Audio compressor
    if ($content -match 'Audio.*tool-header-icon') {
        $content = $content -replace '(<div class="tool-header-icon">)[^<]+(</div>)', '$1<i class="ti ti-volume"></i>$2'
        $updated = $true
    }
    
    # XML formatter  
    if ($content -match 'XML.*tool-header-icon') {
        $content = $content -replace '(<div class="tool-header-icon">)[^<]+(</div>)', '$1<i class="ti ti-xml"></i>$2'
        $updated = $true
    }
    
    # Encrypt/Decrypt  
    if ($content -match 'Encrypt.*tool-header-icon') {
        $content = $content -replace '(<div class="tool-header-icon">)[^<]+(</div>)', '$1<i class="ti ti-lock"></i>$2'
        $updated = $true
    }
    
    # URL Encoder
    if ($content -match 'URL.*tool-header-icon') {
        $content = $content -replace '(<div class="tool-header-icon">)[^<]+(</div>)', '$1<i class="ti ti-link"></i>$2'
        $updated = $true
    }
    
    # Blur image
    if ($content -match 'Blur.*tool-header-icon') {
        $content = $content -replace '(<div class="tool-header-icon">)[^<]+(</div>)', '$1<i class="ti ti-blur"></i>$2'
        $updated = $true
    }
    
    # Lorem Ipsum
    if ($content -match 'Lorem.*tool-header-icon') {
        $content = $content -replace '(<div class="tool-header-icon">)[^<]+(</div>)', '$1<i class="ti ti-file-text"></i>$2'
        $updated = $true
    }
    
    if ($updated) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
        Write-Host "Updated: $($file.Name)" -ForegroundColor Green
        $totalUpdates++
    }
}

Write-Host ""
Write-Host "Total files updated: $totalUpdates" -ForegroundColor Cyan

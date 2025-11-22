# Standard Footer Template
$footerHTML = @'
    <footer class="footer">
        <div class="footer-container">
            <div class="footer-column">
                <h3>DocLite</h3>
                <p class="footer-description">Free online document tools. Convert, compress, and optimize files directly in your browser.</p>
            </div>
            <div class="footer-column">
                <h3>Quick Links</h3>
                <ul class="footer-links">
                    <li><a href="../index.html" class="footer-link">Home</a></li>
                    <li><a href="../index.html#pdf-tools" class="footer-link">PDF Tools</a></li>
                    <li><a href="../index.html#image-tools" class="footer-link">Image Tools</a></li>
                    <li><a href="../index.html#text-tools" class="footer-link">Text Tools</a></li>
                </ul>
            </div>
            <div class="footer-column">
                <h3>Popular Tools</h3>
                <ul class="footer-links">
                    <li><a href="compress-pdf.html" class="footer-link">Compress PDF</a></li>
                    <li><a href="compress-image.html" class="footer-link">Compress Image</a></li>
                    <li><a href="pdf-to-jpg.html" class="footer-link">PDF to JPG</a></li>
                    <li><a href="merge-pdf.html" class="footer-link">Merge PDF</a></li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <h4>&copy; 2025 DocLite. All rights reserved.</h4>
        </div>
    </footer>
'@

# Standard Navbar Template  
$navbarHTML = @'
    <nav class="navbar">
        <div class="navbar-container">
            <a href="../index.html" class="navbar-logo">
                
                DocLite
            </a>
            <ul class="navbar-menu">
                <li><a href="../index.html" class="navbar-link">Home</a></li>
                <li><a href="../index.html#pdf-tools" class="navbar-link">PDF Tools</a></li>
                <li><a href="../index.html#image-tools" class="navbar-link">Image Tools</a></li>
                <li><a href="../index.html#text-tools" class="navbar-link">Text Tools</a></li>
                <li><a href="../index.html#dev-tools" class="navbar-link">Developer</a></li>
            </ul>
        </div>
    </nav>
'@

$toolsPath = "d:\doclite2\tools"
$files = Get-ChildItem -Path $toolsPath -Filter "*.html"

$updatedCount = 0

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    $updated = $false
    
    # Replace footer if it's the minimal version
    if ($content -match '<footer class="footer"><div class="footer-bottom"><p>&copy; 2025 DocLite</p></div></footer>') {
        $content = $content -replace '<footer class="footer"><div class="footer-bottom"><p>&copy; 2025 DocLite</p></div></footer>', $footerHTML
        $updated = $true
    }
    
    # Ensure navbar has full menu (update minimal navbars)
    if ($content -match '<nav class="navbar"><div class="navbar-container"><a href="../index.html" class="navbar-logo">DocLite</a></div></nav>') {
        $content = $content -replace '<nav class="navbar"><div class="navbar-container"><a href="../index.html" class="navbar-logo">DocLite</a></div></nav>', $navbarHTML
        $updated = $true
    }
    
    if ($updated) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
        Write-Host "Updated: $($file.Name)" -ForegroundColor Green
        $updatedCount++
    }
}

Write-Host ""
Write-Host "Total files updated: $updatedCount" -ForegroundColor Cyan

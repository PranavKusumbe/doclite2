$toolsFooter = @"
    <footer class="footer">
        <div class="footer-container">
            <div class="footer-column">
                <h3>DocLite</h3>
                <p class="footer-description">Free online document tools. Convert, compress, and optimize files directly in your browser.</p>
                <div class="footer-social">
                    <a href="https://github.com" target="_blank" class="social-link" aria-label="GitHub"><i class="ti ti-brand-github"></i></a>
                    <a href="https://instagram.com" target="_blank" class="social-link" aria-label="Instagram"><i class="ti ti-brand-instagram"></i></a>
                    <a href="https://facebook.com" target="_blank" class="social-link" aria-label="Facebook"><i class="ti ti-brand-facebook"></i></a>
                    <a href="https://linkedin.com" target="_blank" class="social-link" aria-label="LinkedIn"><i class="ti ti-brand-linkedin"></i></a>
                </div>
            </div>
            <div class="footer-column">
                <h3>Popular</h3>
                <ul class="footer-links">
                    <li><a href="compress-pdf.html" class="footer-link">Compress PDF</a></li>
                    <li><a href="pdf-to-jpg.html" class="footer-link">PDF to JPG</a></li>
                    <li><a href="compress-image.html" class="footer-link">Compress Image</a></li>
                    <li><a href="merge-pdf.html" class="footer-link">Merge PDF</a></li>
                    <li><a href="word-counter.html" class="footer-link">Word Counter</a></li>
                </ul>
            </div>
            <div class="footer-column">
                <h3>Company</h3>
                <ul class="footer-links">
                    <li><a href="../about.html" class="footer-link">About Us</a></li>
                    <li><a href="../contact.html" class="footer-link">Contact</a></li>
                    <li><a href="../terms.html" class="footer-link">Terms of Service</a></li>
                    <li><a href="../privacy.html" class="footer-link">Privacy Policy</a></li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <h4>&copy; 2025 DocLite. All rights reserved.</h4>
        </div>
    </footer>
"@

$rootFooter = @"
    <footer class="footer">
        <div class="footer-container">
            <div class="footer-column">
                <h3>DocLite</h3>
                <p class="footer-description">Free online document tools. Convert, compress, and optimize files directly in your browser.</p>
                <div class="footer-social">
                    <a href="https://github.com" target="_blank" class="social-link" aria-label="GitHub"><i class="ti ti-brand-github"></i></a>
                    <a href="https://instagram.com" target="_blank" class="social-link" aria-label="Instagram"><i class="ti ti-brand-instagram"></i></a>
                    <a href="https://facebook.com" target="_blank" class="social-link" aria-label="Facebook"><i class="ti ti-brand-facebook"></i></a>
                    <a href="https://linkedin.com" target="_blank" class="social-link" aria-label="LinkedIn"><i class="ti ti-brand-linkedin"></i></a>
                </div>
            </div>
            <div class="footer-column">
                <h3>Popular</h3>
                <ul class="footer-links">
                    <li><a href="tools/compress-pdf.html" class="footer-link">Compress PDF</a></li>
                    <li><a href="tools/pdf-to-jpg.html" class="footer-link">PDF to JPG</a></li>
                    <li><a href="tools/compress-image.html" class="footer-link">Compress Image</a></li>
                    <li><a href="tools/merge-pdf.html" class="footer-link">Merge PDF</a></li>
                    <li><a href="tools/word-counter.html" class="footer-link">Word Counter</a></li>
                </ul>
            </div>
            <div class="footer-column">
                <h3>Company</h3>
                <ul class="footer-links">
                    <li><a href="about.html" class="footer-link">About Us</a></li>
                    <li><a href="contact.html" class="footer-link">Contact</a></li>
                    <li><a href="terms.html" class="footer-link">Terms of Service</a></li>
                    <li><a href="privacy.html" class="footer-link">Privacy Policy</a></li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <h4>&copy; 2025 DocLite. All rights reserved.</h4>
        </div>
    </footer>
"@

# Update Tools
$toolFiles = Get-ChildItem "d:\doclite2\tools\*.html"
foreach ($file in $toolFiles) {
    $content = Get-Content $file.FullName -Raw
    # Regex to replace existing footer
    $newContent = $content -replace '(?s)<footer class="footer">.*?</footer>', $toolsFooter
    if ($content -ne $newContent) {
        Set-Content $file.FullName $newContent -Encoding UTF8
        Write-Host "Updated footer in $($file.Name)"
    }
}

# Update Root Files
$rootFiles = Get-ChildItem "d:\doclite2\*.html"
foreach ($file in $rootFiles) {
    $content = Get-Content $file.FullName -Raw
    $newContent = $content -replace '(?s)<footer class="footer">.*?</footer>', $rootFooter
    if ($content -ne $newContent) {
        Set-Content $file.FullName $newContent -Encoding UTF8
        Write-Host "Updated footer in $($file.Name)"
    }
}

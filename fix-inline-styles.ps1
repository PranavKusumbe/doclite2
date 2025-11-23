$files = Get-ChildItem "d:\doclite2\tools\*.html"

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Remove inline styles from sections
    $content = $content -replace 'class="how-to-use-section" style="[^"]*"', 'class="how-to-use-section"'
    $content = $content -replace 'class="related-tools-section" style="[^"]*"', 'class="related-tools-section"'
    
    # Remove inline styles from h2, h3, ol, ul, li inside these sections (simplified approach: remove all style attrs in the file? No, that might break specific tool logic)
    # Let's target the specific ones added by the previous script
    
    $content = $content -replace '<h2 style="margin-bottom: 1.5rem;">', '<h2>'
    $content = $content -replace '<ol style="margin-left: 1.5rem; margin-bottom: 2rem; line-height: 1.8;">', '<ol>'
    $content = $content -replace '<ul style="margin-left: 1.5rem; margin-bottom: 2rem; line-height: 1.8;">', '<ul>'
    $content = $content -replace '<div class="faq-item" style="[^"]*">', '<div class="faq-item">' # If any
    
    # Also clean up the related tools section title
    $content = $content -replace '<h2 class="section-title text-center mb-5">', '<h2 class="related-tools-title">'
    
    # Fix the container div in related tools
    $content = $content -replace '<div class="container">', '<div class="related-tools-grid">'
    
    # Remove the extra tools-grid div if it becomes redundant or fix nesting
    # The previous structure was:
    # <section ...>
    #   <div class="container">
    #     <h2 ...>...</h2>
    #     <div class="tools-grid">...</div>
    #   </div>
    # </section>
    
    # New structure desired:
    # <section class="related-tools-section">
    #   <h2 class="related-tools-title">...</h2>
    #   <div class="related-tools-grid">...</div>
    # </section>
    
    # Let's do a more robust replacement for the related tools structure
    $content = $content -replace '<div class="container">\s*<h2 class="section-title text-center mb-5">More ([^<]+)</h2>\s*<div class="tools-grid">', '<h2 class="related-tools-title">More $1</h2><div class="related-tools-grid">'
    
    # Close the extra div we removed (container)
    # The previous script closed </div> twice at the end of section.
    # We removed <div class="container"> so we need to remove one </div>
    $content = $content -replace '</a>\s*</div>\s*</div>\s*</section>', '</a></div></section>'
    
    Set-Content -Path $file.FullName -Value $content -Encoding UTF8
    Write-Host "Cleaned styles in $($file.Name)"
}

$tools = Get-ChildItem -Path "d:\doclite2\tools" -Filter *.html

# Helper function for Title Case
function Get-TitleCase {
    param([string]$str)
    $textInfo = (Get-Culture).TextInfo
    return $textInfo.ToTitleCase($str.ToLower())
}

foreach ($tool in $tools) {
    $content = Get-Content $tool.FullName -Raw -Encoding UTF8
    $originalContent = $content
    $toolName = $tool.BaseName -replace '-', ' '
    $toolTitle = Get-TitleCase $toolName

    # 1. Fix Script Loading (Wrap in DOMContentLoaded)
    # Look for the last script tag that contains the main logic (usually starts with (function() or let )
    if ($content -match '(?s)<script>\s*\(function\(\)\s*\{.*') {
        if ($content -notmatch 'document.addEventListener\(''DOMContentLoaded''') {
            $content = $content -replace '(?s)<script>\s*\(function\(\)\s*\{', "<script>`n    document.addEventListener('DOMContentLoaded', function() {`n        (function() {"
            # Find the closing of the IIFE and script tag
            # This is tricky with regex. A safer way might be to just wrap the whole content of the last script tag.
            
            # Let's try a different approach: Replace the specific IIFE start and end if possible, 
            # OR just wrap the whole block if we can identify it.
            
            # Actually, the safest way for these specific files (which seem to follow a pattern)
            # is to replace the start and append the closing brace before the closing script tag.
            
            # But wait, if I just wrap the whole thing, I need to find the end.
            # The end is usually `})();\s*</script>`.
            
            $content = $content -replace '\}\)\(\);\s*</script>', "})();`n    });`n    </script>"
            Write-Host "Fixed script loading in $($tool.Name)"
        }
    } elseif ($content -match '(?s)<script>\s*let\s+.*') {
         # For tools that might not use IIFE but just top-level code
         if ($content -notmatch 'document.addEventListener\(''DOMContentLoaded''') {
            $content = $content -replace '(?s)<script>\s*let', "<script>`n    document.addEventListener('DOMContentLoaded', function() {`n        let"
            $content = $content -replace '</script>\s*</body>', "    });`n    </script>`n</body>"
            Write-Host "Fixed script loading (let) in $($tool.Name)"
         }
    }

    # 2. Inject SEO Content (How to Use)
    if ($content -notmatch 'how-to-use-section') {
        $seoContent = @"
    <!-- SEO Content Section -->
    <section class="how-to-use-section" style="margin-top: 4rem; padding: 2rem; background: #fff; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
        <h2 style="margin-bottom: 1.5rem;">How to Use $toolTitle</h2>
        <ol style="margin-left: 1.5rem; margin-bottom: 2rem; line-height: 1.8;">
            <li>Upload your file by dragging it onto the drop zone or clicking the upload button.</li>
            <li>Adjust any available settings to your preference.</li>
            <li>Click the process button to start the $toolTitle operation.</li>
            <li>Download your processed file instantly.</li>
        </ol>

        <h2 style="margin-bottom: 1.5rem;">Why Use DocLite?</h2>
        <ul style="margin-left: 1.5rem; margin-bottom: 2rem; line-height: 1.8;">
            <li><strong>Fast & Secure:</strong> All processing happens directly in your browser. Your files never leave your device.</li>
            <li><strong>Free Forever:</strong> No hidden fees, no sign-up required, and no usage limits.</li>
            <li><strong>High Quality:</strong> We use advanced algorithms to ensure the best possible output quality.</li>
        </ul>

        <h2 style="margin-bottom: 1.5rem;">Frequently Asked Questions</h2>
        <div class="faq-item">
            <h3 class="faq-question">Is this $toolTitle tool free?</h3>
            <p class="faq-answer">Yes, DocLite provides this $toolTitle tool completely free of charge.</p>
        </div>
        <div class="faq-item">
            <h3 class="faq-question">Is it safe to use?</h3>
            <p class="faq-answer">Absolutely. Since DocLite runs entirely in your browser, your files are never uploaded to any server, ensuring 100% privacy.</p>
        </div>
    </section>
"@
        # Inject before footer
        if ($content -match '<footer') {
            $content = $content -replace '<footer', ($seoContent + "`n<footer")
            Write-Host "Added SEO content to $($tool.Name)"
        }
    }

    # 3. Inject Related Tools
    if ($content -notmatch 'related-tools-section') {
        # Determine category
        $category = "Popular Tools"
        if ($tool.Name -match "pdf") { $category = "PDF Tools" }
        elseif ($tool.Name -match "image|jpg|png|webp") { $category = "Image Tools" }
        elseif ($tool.Name -match "text|word|counter") { $category = "Text Tools" }
        
        # Get 4 random tools
        $related = $tools | Get-Random -Count 4
        
        $relatedHtml = @"
    <!-- Related Tools Section -->
    <section class="related-tools-section" style="padding: 4rem 2rem; background-color: #f7fafc;">
        <div class="container">
            <h2 class="section-title text-center mb-5">More $category</h2>
            <div class="tools-grid">
"@
        foreach ($r in $related) {
            $rTitle = Get-TitleCase ($r.BaseName -replace '-', ' ')
            $relatedHtml += @"
                <a href="$($r.Name)" class="tool-card">
                    <div class="tool-card-icon"><i class="ti ti-tool"></i></div>
                    <h4 class="tool-card-title">$rTitle</h4>
                    <p class="tool-card-description">Try our free $rTitle tool.</p>
                </a>
"@
        }
        $relatedHtml += @"
            </div>
        </div>
    </section>
"@
        
        if ($content -match '<footer') {
            $content = $content -replace '<footer', ($relatedHtml + "`n<footer")
            Write-Host "Added Related Tools to $($tool.Name)"
        }
    }

    # 4. Inject Cookie Consent
    if ($content -notmatch 'cookie-consent.js') {
        $content = $content -replace '</body>', '<script defer src="../js/cookie-consent.js"></script>`n</body>'
        Write-Host "Added Cookie Consent to $($tool.Name)"
    }

    if ($content -ne $originalContent) {
        [System.IO.File]::WriteAllText($tool.FullName, $content, [System.Text.Encoding]::UTF8)
    }
}

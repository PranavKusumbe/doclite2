$baseUrl = "https://doclite.me"
$toolsDir = "d:\doclite2\tools"
$sitemapPath = "d:\doclite2\sitemap.xml"

$header = '<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'

$footer = '</urlset>'

$staticPages = @(
    "index.html",
    "about.html",
    "contact.html",
    "privacy.html",
    "terms.html"
)

$sb = [System.Text.StringBuilder]::new()
$sb.AppendLine($header) | Out-Null

# Add static pages
foreach ($page in $staticPages) {
    $sb.AppendLine("  <url>") | Out-Null
    $sb.AppendLine("    <loc>$baseUrl/$page</loc>") | Out-Null
    $sb.AppendLine("    <lastmod>$(Get-Date -Format 'yyyy-MM-dd')</lastmod>") | Out-Null
    $sb.AppendLine("    <changefreq>weekly</changefreq>") | Out-Null
    $sb.AppendLine("    <priority>0.8</priority>") | Out-Null
    $sb.AppendLine("  </url>") | Out-Null
}

# Add tool pages
$files = Get-ChildItem $toolsDir -Filter "*.html"
foreach ($file in $files) {
    $sb.AppendLine("  <url>") | Out-Null
    $sb.AppendLine("    <loc>$baseUrl/tools/$($file.Name)</loc>") | Out-Null
    $sb.AppendLine("    <lastmod>$(Get-Date -Format 'yyyy-MM-dd')</lastmod>") | Out-Null
    $sb.AppendLine("    <changefreq>weekly</changefreq>") | Out-Null
    $sb.AppendLine("    <priority>0.9</priority>") | Out-Null
    $sb.AppendLine("  </url>") | Out-Null
}

$sb.AppendLine($footer) | Out-Null

$sb.ToString() | Set-Content $sitemapPath -Encoding UTF8
Write-Host "Sitemap updated with $($files.Count + $staticPages.Count) URLs."

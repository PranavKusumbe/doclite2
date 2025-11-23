$baseUrl = "https://doclite.me"
$tools = Get-ChildItem -Path "d:\doclite2\tools" -Filter *.html
$pages = @("index.html", "about.html", "contact.html", "privacy.html", "terms.html")

$xml = '<?xml version="1.0" encoding="UTF-8"?>' + "`n"
$xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + "`n"

# Add main pages
foreach ($page in $pages) {
    $xml += "  <url>`n"
    $xml += "    <loc>$baseUrl/$page</loc>`n"
    $xml += "    <lastmod>$(Get-Date -Format "yyyy-MM-dd")</lastmod>`n"
    $xml += "    <changefreq>weekly</changefreq>`n"
    $xml += "    <priority>0.8</priority>`n"
    $xml += "  </url>`n"
}

# Add tools
foreach ($tool in $tools) {
    $xml += "  <url>`n"
    $xml += "    <loc>$baseUrl/tools/$($tool.Name)</loc>`n"
    $xml += "    <lastmod>$(Get-Date -Format "yyyy-MM-dd")</lastmod>`n"
    $xml += "    <changefreq>weekly</changefreq>`n"
    $xml += "    <priority>0.9</priority>`n"
    $xml += "  </url>`n"
}

$xml += '</urlset>'

$xml | Out-File "d:\doclite2\sitemap.xml" -Encoding UTF8
Write-Host "Sitemap generated successfully."

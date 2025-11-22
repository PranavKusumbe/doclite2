# Script to replace all emojis with Tabler icons in index.html
$file = "d:\doclite2\index.html"
$content = Get-Content $file -Raw

# Icon mappings - emoji to Tabler icon class
$replacements = @{
    '<div class="tool-card-icon">📸</div>' = '<div class="tool-card-icon"><i class="ti ti-camera"></i></div>'
    '<div class="tool-card-icon">📄</div>' = '<div class="tool-card-icon"><i class="ti ti-file-text"></i></div>'
    '<div class="tool-card-icon">🔗</div>' = '<div class="tool-card-icon"><i class="ti ti-link"></i></div>'
    '<div class="tool-card-icon">✂️</div>' = '<div class="tool-card-icon"><i class="ti ti-scissors"></i></div>'
    '<div class="tool-card-icon">🗜️</div>' = '<div class="tool-card-icon"><i class="ti ti-arrows-minimize"></i></div>'
    '<div class="tool-card-icon">🖼️</div>' = '<div class="tool-card-icon"><i class="ti ti-photo"></i></div>'
    '<div class="tool-card-icon">📝</div>' = '<div class="tool-card-icon"><i class="ti ti-file-description"></i></div>'
    '<div class="tool-card-icon">📑</div>' = '<div class="tool-card-icon"><i class="ti ti-files"></i></div>'
    '<div class="tool-card-icon">🔄</div>' = '<div class="tool-card-icon"><i class="ti ti-refresh"></i></div>'
    '<div class="tool-card-icon">🧹</div>' = '<div class="tool-card-icon"><i class="ti ti-eraser"></i></div>'
    '<div class="tool-card-icon">🔓</div>' = '<div class="tool-card-icon"><i class="ti ti-lock-open"></i></div>'
    '<div class="tool-card-icon">🔒</div>' = '<div class="tool-card-icon"><i class="ti ti-lock"></i></div>'
    '<div class="tool-card-icon">📏</div>' = '<div class="tool-card-icon"><i class="ti ti-ruler"></i></div>'
    '<div class="tool-card-icon">🎨</div>' = '<div class="tool-card-icon"><i class="ti ti-palette"></i></div>'
    '<div class="tool-card-icon">💫</div>' = '<div class="tool-card-icon"><i class="ti ti-blur"></i></div>'
    '<div class="tool-card-icon">💻</div>' = '<div class="tool-card-icon"><i class="ti ti-code"></i></div>'
    '<div class="tool-card-icon">🔢</div>' = '<div class="tool-card-icon"><i class="ti ti-calculator"></i></div>'
    '<div class="tool-card-icon">🔤</div>' = '<div class="tool-card-icon"><i class="ti ti-alphabet-latin"></i></div>'
    '<div class="tool-card-icon">Aa</div>' = '<div class="tool-card-icon"><i class="ti ti-letter-case"></i></div>'
    '<div class="tool-card-icon">🔐</div>' = '<div class="tool-card-icon"><i class="ti ti-shield-lock"></i></div>'
    '<div class="tool-card-icon">⏱️</div>' = '<div class="tool-card-icon"><i class="ti ti-clock"></i></div>'
    '<div class="tool-card-icon">📱</div>' = '<div class="tool-card-icon"><i class="ti ti-qrcode"></i></div>'
    '<div class="tool-card-icon">{ }</div>' = '<div class="tool-card-icon"><i class="ti ti-braces"></i></div>'
    '<div class="tool-card-icon">📋</div>' = '<div class="tool-card-icon"><i class="ti ti-clipboard"></i></div>'
    '<div class="tool-card-icon">⚡</div>' = '<div class="tool-card-icon"><i class="ti ti-bolt"></i></div>'
    '<div class="tool-card-icon">🔍</div>' = '<div class="tool-card-icon"><i class="ti ti-search"></i></div>'
    '<div class="tool-card-icon">🎬</div>' = '<div class="tool-card-icon"><i class="ti ti-video"></i></div>'
    '<div class="tool-card-icon">🎵</div>' = '<div class="tool-card-icon"><i class="ti ti-music"></i></div>'
    '<div class="tool-card-icon">✏️</div>' = '<div class="tool-card-icon"><i class="ti ti-pencil"></i></div>'
    
    # Category icons
    '<span class="category-icon">🖼️</span>' = '<span class="category-icon"><i class="ti ti-photo"></i></span>'
    '<span class="category-icon">📝</span>' = '<span class="category-icon"><i class="ti ti-file-text"></i></span>'
    '<span class="category-icon">💻</span>' = '<span class="category-icon"><i class="ti ti-code"></i></span>'
    '<span class="category-icon">🛠️</span>' = '<span class="category-icon"><i class="ti ti-tools"></i></span>'
}

foreach ($key in $replacements.Keys) {
    $content = $content.Replace($key, $replacements[$key])
}

Set-Content $file $content -NoNewline
Write-Host "Icon replacement complete!" -ForegroundColor Green

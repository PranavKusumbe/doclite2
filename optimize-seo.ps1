$tools = @{
    "compress-pdf.html" = @{
        Title = "Compress PDF - Reduce PDF File Size Online Free | DocLite"
        Description = "Compress PDF files online for free. Reduce PDF file size to 100KB, 200KB, or less without losing quality. Secure client-side processing."
        Keywords = "compress pdf, reduce pdf size, shrink pdf, online pdf compressor, compress pdf to 100kb, free pdf compressor"
    }
    "merge-pdf.html" = @{
        Title = "Merge PDF - Combine Multiple PDFs Online Free | DocLite"
        Description = "Merge multiple PDF files into one document online for free. Combine PDFs in any order. No upload, 100% secure client-side processing."
        Keywords = "merge pdf, combine pdf, join pdf files, pdf merger online free, merge multiple pdfs"
    }
    "split-pdf.html" = @{
        Title = "Split PDF - Extract Pages from PDF Online Free | DocLite"
        Description = "Split PDF files online for free. Extract specific pages or split a PDF into multiple files. Fast, secure, and easy to use."
        Keywords = "split pdf, extract pdf pages, separate pdf pages, pdf splitter online, cut pdf pages"
    }
    "pdf-to-jpg.html" = @{
        Title = "PDF to JPG - Convert PDF to Images Online Free | DocLite"
        Description = "Convert PDF pages to high-quality JPG images online. Free PDF to JPG converter. No file limits, secure processing."
        Keywords = "pdf to jpg, convert pdf to image, pdf to image converter, save pdf as jpg, pdf to jpg high quality"
    }
    "jpg-to-pdf.html" = @{
        Title = "JPG to PDF - Convert Images to PDF Online Free | DocLite"
        Description = "Convert JPG images to PDF documents online. Combine multiple images into a single PDF. Free, fast, and secure."
        Keywords = "jpg to pdf, image to pdf, convert jpg to pdf, photos to pdf, combine images to pdf"
    }
    "word-counter.html" = @{
        Title = "Word Counter - Count Words & Characters Online | DocLite"
        Description = "Free online word counter tool. Count words, characters, sentences, and paragraphs in real-time. Perfect for writers and students."
        Keywords = "word counter, character count, word count tool, count words online, letter counter"
    }
    "compress-image.html" = @{
        Title = "Compress Image - Reduce Image Size Online Free | DocLite"
        Description = "Compress JPG, PNG, and WebP images online. Reduce image file size by up to 80% without quality loss. Free image optimizer."
        Keywords = "compress image, reduce image size, image compressor, shrink image, optimize images online"
    }
    "pdf-to-text.html" = @{
        Title = "PDF to Text - Extract Text from PDF Online | DocLite"
        Description = "Extract text from PDF files instantly. Convert PDF to editable text format. Free online OCR tool."
        Keywords = "pdf to text, extract text from pdf, convert pdf to txt, pdf text extractor, ocr pdf"
    }
    "png-to-pdf.html" = @{
        Title = "PNG to PDF - Convert PNG Images to PDF | DocLite"
        Description = "Convert PNG images to PDF format. Combine multiple PNGs into one PDF document. Free and secure online converter."
        Keywords = "png to pdf, convert png to pdf, image to pdf, combine png to pdf"
    }
    "remove-watermark.html" = @{
        Title = "Remove Watermark from PDF Online Free | DocLite"
        Description = "Attempt to remove watermarks from PDF files online. Free tool to clean up PDF documents."
        Keywords = "remove watermark pdf, delete watermark pdf, pdf watermark remover, clean pdf"
    }
    "rotate-pdf.html" = @{
        Title = "Rotate PDF - Rotate PDF Pages Online | DocLite"
        Description = "Rotate PDF pages 90, 180, or 270 degrees. Save the rotated PDF permanently. Free online tool."
        Keywords = "rotate pdf, turn pdf pages, rotate pdf online, save rotated pdf"
    }
    "extract-pages.html" = @{
        Title = "Extract PDF Pages - Select & Save Pages | DocLite"
        Description = "Extract specific pages from a PDF file. Create a new PDF with only the pages you need."
        Keywords = "extract pdf pages, save specific pdf pages, remove pdf pages, pdf page extractor"
    }
    "pdf-to-png.html" = @{
        Title = "PDF to PNG - Convert PDF to PNG Images | DocLite"
        Description = "Convert PDF pages to transparent PNG images. High quality conversion with no watermarks."
        Keywords = "pdf to png, convert pdf to image, pdf to png converter, save pdf as png"
    }
    "resize-image.html" = @{
        Title = "Resize Image - Change Image Dimensions Online | DocLite"
        Description = "Resize JPG, PNG, and WebP images online. Change width and height pixels or percentage. Free image resizer."
        Keywords = "resize image, change image size, image resizer, resize photo online"
    }
    "crop-image.html" = @{
        Title = "Crop Image - Crop Photos Online Free | DocLite"
        Description = "Crop images online easily. Select area and crop photos to exact dimensions. Free image cropper."
        Keywords = "crop image, crop photo, image cropper, cut image online"
    }
    "background-remover.html" = @{
        Title = "Remove Background from Image Online Free | DocLite"
        Description = "Remove image backgrounds automatically with AI. Create transparent backgrounds for products and portraits."
        Keywords = "remove background, background remover, transparent background, delete background"
    }
    "qr-generator.html" = @{
        Title = "QR Code Generator - Create Free QR Codes | DocLite"
        Description = "Generate custom QR codes for URLs, text, WiFi, and more. Download high-quality QR code images."
        Keywords = "qr code generator, create qr code, make qr code, free qr generator"
    }
    "json-formatter.html" = @{
        Title = "JSON Formatter - Validate & Beautify JSON | DocLite"
        Description = "Format, validate, and beautify JSON data online. Debug JSON code easily with this free developer tool."
        Keywords = "json formatter, json validator, beautify json, json viewer, format json online"
    }
}

$files = Get-ChildItem "d:\doclite2\tools\*.html"

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $filename = $file.Name
    
    if ($tools.ContainsKey($filename)) {
        $info = $tools[$filename]
        $title = $info.Title
        $desc = $info.Description
        $keywords = $info.Keywords
    } else {
        # Fallback for unmapped tools
        $name = $filename.Replace("-", " ").Replace(".html", "")
        $name = (Get-Culture).TextInfo.ToTitleCase($name)
        $title = "$name - Free Online Tool | DocLite"
        $desc = "Use our free online $name tool. Fast, secure, and easy to use. No download required."
        $keywords = "$name, online tool, free $name, doclite tools"
    }

    # Update Title
    if ($content -match "<title>.*?</title>") {
        $content = $content -replace "<title>.*?</title>", "<title>$title</title>"
    } else {
        $content = $content -replace "<head>", "<head>`n    <title>$title</title>"
    }

    # Update Description
    if ($content -match '<meta name="description" content=".*?">') {
        $content = $content -replace '<meta name="description" content=".*?">', "<meta name=`"description`" content=`"$desc`">"
    } else {
        $content = $content -replace "<title>.*?</title>", "<title>$title</title>`n    <meta name=`"description`" content=`"$desc`">"
    }

    # Update Keywords
    if ($content -match '<meta name="keywords" content=".*?">') {
        $content = $content -replace '<meta name="keywords" content=".*?">', "<meta name=`"keywords`" content=`"$keywords`">"
    } else {
        $content = $content -replace "<title>.*?</title>", "<title>$title</title>`n    <meta name=`"keywords`" content=`"$keywords`">"
    }

    # Add Schema if missing
    if (-not ($content -match "application/ld\+json")) {
        $schema = @"
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "$title",
      "operatingSystem": "Any",
      "applicationCategory": "UtilityApplication",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "description": "$desc"
    }
    </script>
"@
        $content = $content -replace "</head>", "$schema`n</head>"
    }

    Set-Content -Path $file.FullName -Value $content -Encoding UTF8
    Write-Host "Updated SEO for $filename"
}

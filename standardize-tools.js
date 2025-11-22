import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Define tool metadata with correct icons
const toolMetadata = {
  'pdf-to-jpg.html': { icon: 'ti-camera', title: 'PDF to JPG Converter' },
  'jpg-to-pdf.html': { icon: 'ti-file-text', title: 'JPG to PDF' },
  'merge-pdf.html': { icon: 'ti-link', title: 'Merge PDF' },
  'split-pdf.html': { icon: 'ti-scissors', title: 'Split PDF' },
  'compress-pdf.html': { icon: 'ti-arrows-minimize', title: 'Compress PDF' },
  'pdf-to-png.html': { icon: 'ti-photo', title: 'PDF to PNG' },
  'png-to-pdf.html': { icon: 'ti-file-type-pdf', title: 'PNG to PDF' },
  'word-to-pdf.html': { icon: 'ti-file-description', title: 'Word to PDF' },
  'pdf-to-word.html': { icon: 'ti-file-description', title: 'PDF to Word' },
  'pdf-to-text.html': { icon: 'ti-file-type-txt', title: 'PDF to Text' },
  'extract-pages.html': { icon: 'ti-files', title: 'Extract PDF Pages' },
  'rotate-pdf.html': { icon: 'ti-rotate-clockwise', title: 'Rotate PDF' },
  'remove-watermark.html': { icon: 'ti-eraser', title: 'Remove Watermark' },
  'unlock-pdf.html': { icon: 'ti-lock-open', title: 'Unlock PDF' },
  'protect-pdf.html': { icon: 'ti-lock', title: 'Protect PDF' },
  'compress-image.html': { icon: 'ti-arrows-minimize', title: 'Compress Image' },
  'resize-image.html': { icon: 'ti-dimensions', title: 'Resize Image' },
  'jpg-to-png.html': { icon: 'ti-transform', title: 'JPG to PNG' },
  'png-to-jpg.html': { icon: 'ti-transform', title: 'PNG to JPG' },
  'webp-to-jpg.html': { icon: 'ti-transform', title: 'WebP to JPG' },
  'jpg-to-webp.html': { icon: 'ti-transform', title: 'JPG to WebP' },
  'background-remover.html': { icon: 'ti-background', title: 'Remove Background' },
  'blur-image.html': { icon: 'ti-blur', title: 'Blur Image' },
  'crop-image.html': { icon: 'ti-crop', title: 'Crop Image' },
  'color-picker.html': { icon: 'png:ASSETS/eyedropper.png', title: 'Color Picker' },
  'rotate-image.html': { icon: 'ti-rotate', title: 'Rotate Image' },
  'image-to-base64.html': { icon: 'ti-code', title: 'Image to Base64' },
  'base64-to-image.html': { icon: 'ti-photo-code', title: 'Base64 to Image' },
  'word-counter.html': { icon: 'ti-calculator', title: 'Word Counter' },
  'character-counter.html': { icon: 'ti-alphabet-latin', title: 'Character Counter' },
  'remove-duplicates.html': { icon: 'ti-copy-off', title: 'Remove Duplicates' },
  'remove-line-breaks.html': { icon: 'ti-line-dashed', title: 'Remove Line Breaks' },
  'case-converter.html': { icon: 'ti-letter-case', title: 'Case Converter' },
  'text-to-ascii.html': { icon: 'ti-binary', title: 'Text to ASCII' },
  'encrypt-decrypt.html': { icon: 'ti-shield-lock', title: 'Encrypt/Decrypt Text' },
  'lorem-ipsum.html': { icon: 'ti-file-text', title: 'Lorem Ipsum Generator' },
  'read-time.html': { icon: 'ti-clock', title: 'Read Time Calculator' },
  'qr-generator.html': { icon: 'ti-qrcode', title: 'QR Code Generator' },
  'url-encoder.html': { icon: 'ti-link', title: 'URL Encoder/Decoder' },
  'json-formatter.html': { icon: 'ti-braces', title: 'JSON Formatter' },
  'xml-formatter.html': { icon: 'ti-code-dots', title: 'XML Formatter' },
  'csv-to-json.html': { icon: 'ti-table-import', title: 'CSV to JSON' },
  'json-to-csv.html': { icon: 'ti-table-export', title: 'JSON to CSV' },
  'html-minifier.html': { icon: 'ti-file-zip', title: 'HTML Minifier' },
  'js-minifier.html': { icon: 'ti-brand-javascript', title: 'JavaScript Minifier' },
  'regex-tester.html': { icon: 'ti-regex', title: 'Regex Tester' },
  'image-to-pdf.html': { icon: 'ti-file-type-pdf', title: 'Image to PDF' },
  'video-to-gif.html': { icon: 'ti-gif', title: 'Video to GIF' },
  'audio-compressor.html': { icon: 'ti-music', title: 'Audio Compressor' },
  'file-renamer.html': { icon: 'ti-edit', title: 'File Renamer' }
};

function updateToolFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const fileName = path.basename(filePath);
    const metadata = toolMetadata[fileName];

    if (!metadata) {
      console.log(`⚠️  No metadata for ${fileName}`);
      return;
    }

    // Update navbar back icon
    if (!content.includes('ti-arrow-left')) {
      content = content.replace(
        /<span class="navbar-back-icon"><\/span>/g,
        ''
      );
    }

    // Update tool-header-icon
    let iconHtml;
    if (metadata.icon.startsWith('png:')) {
      const pngPath = metadata.icon.replace('png:', '');
      iconHtml = `<i class="ti ti-dots"></i>`;
      // We'll handle PNG separately in a note
    } else {
      iconHtml = `<i class="ti ${metadata.icon}"></i>`;
    }

    // Update tool-header-icon with proper Tabler icon
    content = content.replace(
      /<div class="tool-header-icon"[^>]*>.*?<\/div>/s,
      `<div class="tool-header-icon">${iconHtml}</div>`
    );

    // Update title
    content = content.replace(
      /<h1[^>]*class="tool-header-title"[^>]*>.*?<\/h1>/,
      `<h1 class="tool-header-title">${metadata.title}</h1>`
    );

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ Updated ${fileName}`);
  } catch (err) {
    console.error(`❌ Error updating ${filePath}: ${err.message}`);
  }
}

// Process all tool files
const toolsDir = path.join(__dirname, 'tools');
const files = fs.readdirSync(toolsDir).filter(f => f.endsWith('.html'));

console.log(`🔄 Standardizing ${files.length} tool files...\n`);
files.forEach(file => {
  updateToolFile(path.join(toolsDir, file));
});

console.log(`\n✨ Standardization complete!`);

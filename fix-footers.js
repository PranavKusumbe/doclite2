import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const standardFooter = `<footer class="footer">
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
    </footer>`;

function fixToolFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const fileName = path.basename(filePath);

    // Fix navbar back icon - ensure it has the arrow icon
    content = content.replace(
      /<span class="navbar-back-icon"><\/span>/g,
      '<span class="navbar-back-icon"><i class="ti ti-arrow-left"></i></span>'
    );

    // Replace all footer sections with standardized footer
    content = content.replace(
      /<footer class="footer">[\s\S]*?<\/footer>/,
      standardFooter
    );

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ Fixed ${fileName}`);
  } catch (err) {
    console.error(`❌ Error fixing ${filePath}: ${err.message}`);
  }
}

// Process all tool files
const toolsDir = path.join(__dirname, 'tools');
const files = fs.readdirSync(toolsDir).filter(f => f.endsWith('.html'));

console.log(`🔄 Fixing ${files.length} tool files...\n`);
files.forEach(file => {
  fixToolFile(path.join(toolsDir, file));
});

console.log(`\n✨ Footer standardization complete!`);

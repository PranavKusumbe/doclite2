import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function fixNavbar(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const fileName = path.basename(filePath);

    // Fix navbar back icon - add the back icon with proper HTML
    content = content.replace(
      /<a href="..\/index\.html" class="navbar-logo">\s*<\/a>/g,
      ''
    );

    // Alternative pattern for when there's already some content in the logo
    content = content.replace(
      /<a href="..\/index\.html" class="navbar-logo">\s*\n\s*<\/a>/g,
      ''
    );

    // Handle cases where DocLite text is outside the anchor
    content = content.replace(
      /<a href="..\/index\.html" class="navbar-logo">\s*DocLite\s*<\/a>/g,
      ''
    );

    // Handle the specific pattern from split-pdf with empty lines
    content = content.replace(
      /<a href="..\/index\.html" class="navbar-logo">\s+<\/a>\s+<ul/g,
      '\n            <ul'
    );

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ Fixed navbar in ${fileName}`);
  } catch (err) {
    console.error(`❌ Error fixing ${filePath}: ${err.message}`);
  }
}

// Process all tool files
const toolsDir = path.join(__dirname, 'tools');
const files = fs.readdirSync(toolsDir).filter(f => f.endsWith('.html'));

console.log(`🔄 Fixing navbar in ${files.length} tool files...\n`);
files.forEach(file => {
  fixNavbar(path.join(toolsDir, file));
});

console.log(`\n✨ Navbar fix complete!`);

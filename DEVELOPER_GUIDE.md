# 🚀 Quick Start Guide for Adding New Tools

## 📝 Step-by-Step Tool Creation

### 1. Choose Your Tool Template

Based on tool type, copy the appropriate template:

**Image Tool** → Copy `tools/compress-image.html` + `js/compress-image.js`  
**PDF Tool** → Copy `tools/pdf-to-jpg.html` + `js/pdf-to-jpg.js`  
**Text Tool** → Copy `tools/word-counter.html` + `js/word-counter.js`  
**Developer Tool** → Copy `tools/json-formatter.html` + `js/json-formatter.js`

---

### 2. Create HTML File

**Example: Creating "Resize Image" tool**

```bash
# Copy template
cp tools/compress-image.html tools/resize-image.html
```

**Edit `tools/resize-image.html`:**

1. **Update meta tags** (lines 3-9):
```html
<title>Resize Image Online Free - Custom Dimensions | DocLite</title>
<meta name="description" content="Resize images to custom width and height. Maintain aspect ratio or crop to exact size. Perfect for social media, websites, and printing.">
<meta name="keywords" content="resize image, image resizer, change image size, scale image, crop image online">
```

2. **Update tool header** (lines 25-32):
```html
<div class="tool-header-icon">📏</div>
<h1 class="tool-header-title">Resize Image</h1>
<p class="tool-header-description">
    Change image dimensions to custom width and height. Maintain aspect ratio or set exact size.
</p>
```

3. **Customize controls** (if needed):
```html
<div class="control-group">
    <label class="control-label">Width (px)</label>
    <input type="number" class="control-input" id="widthInput" placeholder="800">
</div>
<div class="control-group">
    <label class="control-label">Height (px)</label>
    <input type="number" class="control-input" id="heightInput" placeholder="600">
</div>
<div class="control-group">
    <label class="control-label">
        <input type="checkbox" id="maintainAspect" checked> Maintain aspect ratio
    </label>
</div>
```

4. **Update FAQ section** with relevant Q&A

5. **Link JavaScript file**:
```html
<script src="../js/resize-image.js"></script>
```

---

### 3. Create JavaScript File

**Create `js/resize-image.js`:**

```javascript
(function() {
    'use strict';

    let selectedFiles = [];
    let processedResults = [];

    function init() {
        setupUploadArea();
        setupControls();
        setupRelatedTools();
    }

    function setupUploadArea() {
        const uploadArea = DocLiteComponents.createUploadArea({
            accept: 'image/*',
            multiple: true,
            onFileSelect: handleFileSelect
        });
        document.getElementById('uploadArea').appendChild(uploadArea);
    }

    function handleFileSelect(files) {
        selectedFiles = files.filter(f => f.type.startsWith('image/'));
        if (selectedFiles.length === 0) {
            alert('Please select valid image files');
            return;
        }
        displayFileList();
        document.getElementById('controlsSection').classList.remove('hidden');
    }

    function displayFileList() {
        const fileListSection = document.getElementById('fileListSection');
        fileListSection.innerHTML = '';
        
        const fileList = DocLiteComponents.createFileList(selectedFiles, {
            onRemove: (index) => {
                selectedFiles.splice(index, 1);
                if (selectedFiles.length === 0) {
                    fileListSection.classList.add('hidden');
                    document.getElementById('controlsSection').classList.add('hidden');
                } else {
                    displayFileList();
                }
            }
        });
        
        fileListSection.appendChild(fileList);
        fileListSection.classList.remove('hidden');
    }

    function setupControls() {
        // Get control elements
        const widthInput = document.getElementById('widthInput');
        const heightInput = document.getElementById('heightInput');
        const maintainAspect = document.getElementById('maintainAspect');

        // Auto-calculate height when width changes (if aspect ratio locked)
        widthInput.addEventListener('input', () => {
            if (maintainAspect.checked && selectedFiles.length > 0) {
                // Calculate based on first image
                // Implementation here
            }
        });

        // Process button
        document.getElementById('processBtn').addEventListener('click', processImages);
    }

    async function processImages() {
        if (selectedFiles.length === 0) return;

        DocLiteComponents.showLoading('Resizing images...');
        processedResults = [];

        const targetWidth = parseInt(document.getElementById('widthInput').value);
        const targetHeight = parseInt(document.getElementById('heightInput').value);
        const maintainAspect = document.getElementById('maintainAspect').checked;

        try {
            for (const file of selectedFiles) {
                const result = await resizeImage(file, {
                    width: targetWidth,
                    height: targetHeight,
                    maintainAspect
                });
                processedResults.push(result);
            }
            displayResults();
        } catch (error) {
            console.error('Processing error:', error);
            alert('Error processing images');
        } finally {
            DocLiteComponents.hideLoading();
        }
    }

    async function resizeImage(file, options) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    // Calculate dimensions
                    let width = options.width;
                    let height = options.height;

                    if (options.maintainAspect) {
                        const aspectRatio = img.width / img.height;
                        if (width && !height) {
                            height = Math.round(width / aspectRatio);
                        } else if (height && !width) {
                            width = Math.round(height * aspectRatio);
                        } else if (width && height) {
                            // Use width, calculate height
                            height = Math.round(width / aspectRatio);
                        }
                    }

                    // Create canvas
                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    
                    const ctx = canvas.getContext('2d');
                    ctx.imageSmoothingEnabled = true;
                    ctx.imageSmoothingQuality = 'high';
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob((blob) => {
                        const filename = file.name.replace(/\.[^.]+$/, '') + '_resized.png';
                        resolve({
                            blob,
                            filename,
                            thumbnail: URL.createObjectURL(blob),
                            size: blob.size,
                            dimensions: `${width}x${height}`
                        });
                    }, 'image/png');
                };
                img.onerror = reject;
                img.src = e.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    function displayResults() {
        const resultsSection = document.getElementById('resultsSection');
        const resultsGrid = document.getElementById('resultsGrid');
        
        resultsGrid.innerHTML = '';
        
        processedResults.forEach((result, index) => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            resultItem.innerHTML = `
                <img src="${result.thumbnail}" alt="${result.filename}" class="result-thumbnail">
                <div class="result-filename">${result.filename}</div>
                <div style="font-size: 0.85rem; color: var(--color-text-light);">
                    ${result.dimensions} • ${DocLiteComponents.formatFileSize(result.size)}
                </div>
                <button class="btn btn-primary btn-small" data-index="${index}">
                  <i class="ti ti-download"></i>Download
                </button>
            `;

            resultItem.querySelector('button').addEventListener('click', () => {
                DocLiteComponents.downloadFile(result.blob, result.filename);
            });

            resultsGrid.appendChild(resultItem);
        });

        resultsSection.classList.remove('hidden');

        document.getElementById('downloadAllBtn').addEventListener('click', () => {
            DocLiteComponents.downloadAsZip(processedResults, 'resized-images.zip');
        });
    }

    function setupRelatedTools() {
        const tools = [
            { icon: '🗜️', title: 'Compress Image', description: 'Reduce file size', url: 'compress-image.html' },
            { icon: '✂️', title: 'Crop Image', description: 'Cut to specific area', url: 'crop-image.html' },
            { icon: '🔄', title: 'Rotate Image', description: 'Rotate by any angle', url: 'rotate-image.html' },
            { icon: '🔄', title: 'Convert Format', description: 'JPG, PNG, WebP', url: 'jpg-to-png.html' }
        ];

        const relatedSection = DocLiteComponents.createRelatedTools(tools);
        document.getElementById('relatedTools').appendChild(relatedSection);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
```

---

### 4. Add Tool to Homepage

**Edit `index.html`** - Find the appropriate category and add:

```html
<a href="tools/resize-image.html" class="tool-card">
    <div class="tool-card-icon">📏</div>
    <h4 class="tool-card-title">Resize Image</h4>
    <p class="tool-card-description">Change image dimensions while maintaining quality</p>
</a>
```

---

### 5. Test Your Tool

1. **Start server**: `python -m http.server 8000`
2. **Open**: `http://localhost:8000/tools/resize-image.html`
3. **Test**:
   - Upload single image ✅
   - Upload multiple images ✅
   - Process with different settings ✅
   - Download individual file ✅
   - Download as ZIP ✅
   - Check mobile responsive ✅

---

## 🎨 Common Patterns

### Image Processing Template

```javascript
async function processImage(file, options) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                
                const ctx = canvas.getContext('2d');
                
                // YOUR PROCESSING HERE
                // ctx.filter = 'blur(5px)';
                // ctx.rotate(90 * Math.PI / 180);
                // etc.
                
                ctx.drawImage(img, 0, 0);

                canvas.toBlob((blob) => {
                    resolve({
                        blob,
                        filename: file.name,
                        thumbnail: URL.createObjectURL(blob)
                    });
                }, 'image/png');
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
}
```

### Text Processing Template

```javascript
function processText(text, options) {
    // Example: Remove duplicates
    const lines = text.split('\n');
    const unique = [...new Set(lines)];
    return unique.join('\n');
}
```

### PDF Processing Template (with pdf-lib)

```javascript
async function processPDF(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    // YOUR PROCESSING HERE
    // const pages = pdfDoc.getPages();
    // pages[0].setRotation(degrees(90));
    
    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes], { type: 'application/pdf' });
}
```

---

## 📚 Useful Code Snippets

### 1. Format Converter (JPG to PNG)

```javascript
canvas.toBlob((blob) => {
    resolve(blob);
}, 'image/png'); // Change to 'image/jpeg', 'image/webp', etc.
```

### 2. Apply Blur Filter

```javascript
ctx.filter = 'blur(5px)';
ctx.drawImage(img, 0, 0);
```

### 3. Rotate Image

```javascript
canvas.width = img.height;
canvas.height = img.width;
ctx.translate(canvas.width / 2, canvas.height / 2);
ctx.rotate(90 * Math.PI / 180);
ctx.drawImage(img, -img.width / 2, -img.height / 2);
```

### 4. Crop Image

```javascript
ctx.drawImage(
    img, 
    cropX, cropY, cropWidth, cropHeight, // Source rectangle
    0, 0, cropWidth, cropHeight           // Destination rectangle
);
```

### 5. Convert to Base64

```javascript
const base64 = canvas.toDataURL('image/png');
```

### 6. Add Watermark

```javascript
ctx.drawImage(img, 0, 0);
ctx.font = '30px Arial';
ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
ctx.fillText('WATERMARK', 50, 50);
```

---

## 🐛 Common Issues & Solutions

### Issue: Image appears pixelated
**Solution**: Use `imageSmoothingQuality = 'high'`

### Issue: Canvas is blank
**Solution**: Wait for image `onload` before drawing

### Issue: Large files freeze browser
**Solution**: Add `await` delays or use Web Workers

### Issue: Colors look washed out
**Solution**: Use `willReadFrequently: true` for getContext

### Issue: Download doesn't work
**Solution**: Check `canvas.toBlob()` callback is triggered

---

## 🎯 SEO Checklist for Each Tool

- [ ] Unique page title with main keyword
- [ ] Meta description 150-160 characters
- [ ] 5-10 relevant keywords
- [ ] H1 with tool name
- [ ] Schema.org SoftwareApplication markup
- [ ] Canonical URL
- [ ] At least 3 FAQ items
- [ ] Related tools section
- [ ] Alt text on images/icons

---

## 📦 Recommended Tool Order

### Start with easiest:

1. **Text tools** (no libraries needed):
   - Character Counter
   - Remove Duplicates
   - Remove Line Breaks
   - Case Converter
   - Lorem Ipsum Generator

2. **Simple image tools**:
   - Rotate Image
   - Image Format Converters
   - Image to Base64

3. **Advanced image tools**:
   - Blur Image
   - Crop Image
   - Resize Image

4. **PDF tools**:
   - Split PDF
   - Extract Pages
   - Rotate PDF
   - PNG to PDF

5. **Complex tools** (save for last):
   - Background Remover (needs ONNX)
   - Video to GIF (needs ffmpeg.wasm)
   - Audio Compressor

---

## 💡 Pro Tips

1. **Reuse code**: Copy-paste from similar tools
2. **Test incrementally**: One feature at a time
3. **Console.log everything**: Debug as you go
4. **Use placeholder images**: Test with small files first
5. **Mobile-first**: Test on phone simulator
6. **Error handling**: Wrap in try-catch
7. **User feedback**: Show loading states
8. **File validation**: Check file types early
9. **Memory management**: Revoke object URLs when done
10. **Performance**: Profile with Chrome DevTools

---

## 🚀 Deployment After Adding Tools

```bash
# Commit changes
git add .
git commit -m "Add: Resize Image tool"
git push

# If using Cloudflare Pages/Vercel/Netlify
# Auto-deploy will trigger on push
```

---

## 📞 Need Help?

- **Check existing tools** for reference
- **Read components.js** for helper functions
- **Console errors** often point to the issue
- **Test in incognito** to avoid cache issues

---

**Good luck building! 🎉**

Every tool you add makes DocLite more valuable.

// Image Compression Tool - Client-side processing
(function() {
    'use strict';

    let selectedFiles = [];
    let compressedResults = [];

    // Initialize
    function init() {
        setupUploadArea();
        setupControls();
        setupRelatedTools();
    }

    function setupUploadArea() {
        const uploadSection = document.getElementById('uploadSection');
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
            },
            onRemoveAll: () => {
                selectedFiles = [];
                fileListSection.classList.add('hidden');
                document.getElementById('controlsSection').classList.add('hidden');
            }
        });
        
        fileListSection.appendChild(fileList);
        fileListSection.classList.remove('hidden');
    }

    function setupControls() {
        // Target size dropdown
        const targetSize = document.getElementById('targetSize');
        const qualitySliderGroup = document.getElementById('qualitySliderGroup');
        
        targetSize.addEventListener('change', (e) => {
            if (e.target.value === 'custom') {
                qualitySliderGroup.style.display = 'block';
            } else {
                qualitySliderGroup.style.display = 'none';
            }
        });

        // Quality slider
        const qualitySlider = document.getElementById('qualitySlider');
        const qualityValue = document.getElementById('quality-value');
        
        qualitySlider.addEventListener('input', (e) => {
            qualityValue.textContent = e.target.value;
        });

        // Compress button
        document.getElementById('compressBtn').addEventListener('click', compressImages);
    }

    async function compressImages() {
        if (selectedFiles.length === 0) return;

        DocLiteComponents.showLoading('Compressing images...');
        compressedResults = [];

        const targetSize = document.getElementById('targetSize').value;
        const outputFormat = document.getElementById('outputFormat').value;
        const quality = parseInt(document.getElementById('qualitySlider').value);

        try {
            for (let i = 0; i < selectedFiles.length; i++) {
                const file = selectedFiles[i];
                const compressed = await compressImage(file, {
                    targetSizeKB: targetSize === 'custom' ? null : parseInt(targetSize),
                    quality: quality / 100,
                    format: outputFormat
                });
                
                compressedResults.push(compressed);
            }

            displayResults();
        } catch (error) {
            console.error('Compression error:', error);
            alert('Error compressing images. Please try again.');
        } finally {
            DocLiteComponents.hideLoading();
        }
    }

    async function compressImage(file, options) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = async (e) => {
                const img = new Image();
                
                img.onload = async () => {
                    try {
                        let result;
                        
                        if (options.targetSizeKB) {
                            // Target size compression with binary search
                            result = await compressToTargetSize(img, file.name, options);
                        } else {
                            // Quality-based compression
                            result = await compressWithQuality(img, file.name, options);
                        }
                        
                        resolve(result);
                    } catch (err) {
                        reject(err);
                    }
                };
                
                img.onerror = reject;
                img.src = e.target.result;
            };
            
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    async function compressToTargetSize(img, filename, options) {
        const targetBytes = options.targetSizeKB * 1024;
        const maxAttempts = 10;
        
        let minQuality = 0.1;
        let maxQuality = 0.95;
        let bestBlob = null;
        let bestSize = Infinity;
        let scale = 1.0;

        // First, try to scale down if image is large
        if (img.width > 1920 || img.height > 1920) {
            scale = 0.5;
        }

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const currentQuality = (minQuality + maxQuality) / 2;
            const blob = await renderImageToBlob(img, {
                quality: currentQuality,
                format: options.format,
                scale: scale
            });

            if (Math.abs(blob.size - targetBytes) < targetBytes * 0.1) {
                // Within 10% of target
                return createResult(blob, filename, img.width * scale, img.height * scale);
            }

            if (blob.size > targetBytes) {
                maxQuality = currentQuality;
                if (blob.size < bestSize) {
                    bestBlob = blob;
                    bestSize = blob.size;
                }
                
                // Try reducing scale if quality is already low
                if (currentQuality < 0.3 && scale > 0.3) {
                    scale *= 0.8;
                    minQuality = 0.1;
                    maxQuality = 0.95;
                }
            } else {
                minQuality = currentQuality;
            }
        }

        // If we couldn't get below target, return best attempt with aggressive scaling
        if (bestSize > targetBytes) {
            scale = Math.sqrt(targetBytes / bestSize) * scale * 0.9;
            bestBlob = await renderImageToBlob(img, {
                quality: 0.5,
                format: 'jpeg', // Force JPEG for maximum compression
                scale: Math.max(0.1, scale)
            });
        }

        return createResult(bestBlob || bestSize, filename, img.width * scale, img.height * scale);
    }

    async function compressWithQuality(img, filename, options) {
        const blob = await renderImageToBlob(img, options);
        return createResult(blob, filename, img.width, img.height);
    }

    async function renderImageToBlob(img, options) {
        const canvas = document.createElement('canvas');
        const scale = options.scale || 1.0;
        
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Determine MIME type
        let mimeType = 'image/jpeg';
        if (options.format === 'png') {
            mimeType = 'image/png';
        } else if (options.format === 'webp') {
            mimeType = 'image/webp';
        }

        return new Promise((resolve) => {
            canvas.toBlob(
                (blob) => resolve(blob),
                mimeType,
                options.quality
            );
        });
    }

    function createResult(blob, originalFilename, width, height) {
        const extension = blob.type.split('/')[1];
        const filename = originalFilename.replace(/\.[^.]+$/, '') + '_compressed.' + extension;
        const thumbnail = URL.createObjectURL(blob);

        return {
            blob,
            filename,
            thumbnail,
            size: blob.size,
            dimensions: `${Math.round(width)}x${Math.round(height)}`
        };
    }

    function displayResults() {
        const resultsSection = document.getElementById('resultsSection');
        const resultsGrid = document.getElementById('resultsGrid');
        
        resultsGrid.innerHTML = '';
        
        compressedResults.forEach((result, index) => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            resultItem.innerHTML = `
                <img src="${result.thumbnail}" alt="${result.filename}" class="result-thumbnail">
                <div class="result-filename">${result.filename}</div>
                <div style="font-size: 0.85rem; color: var(--color-text-light); margin: 0.5rem 0;">
                    ${DocLiteComponents.formatFileSize(result.size)}<br>
                    ${result.dimensions}
                </div>
                <button class="btn btn-primary btn-small download-btn" data-index="${index}">
                  <i class="ti ti-download"></i>Download
                </button>
            `;

            resultItem.querySelector('.download-btn').addEventListener('click', () => {
                DocLiteComponents.downloadFile(result.blob, result.filename);
            });

            resultsGrid.appendChild(resultItem);
        });

        resultsSection.classList.remove('hidden');

        // Download all button
        document.getElementById('downloadAllBtn').addEventListener('click', () => {
            DocLiteComponents.downloadAsZip(compressedResults, 'compressed-images.zip');
        });
    }

    function setupRelatedTools() {
        const relatedTools = [
            {
                icon: '📏',
                title: 'Resize Image',
                description: 'Change image dimensions',
                url: 'resize-image.html'
            },
            {
                icon: '🔄',
                title: 'Convert Image Format',
                description: 'JPG, PNG, WebP conversion',
                url: 'jpg-to-png.html'
            },
            {
                icon: '✂️',
                title: 'Crop Image',
                description: 'Crop images to custom size',
                url: 'crop-image.html'
            },
            {
                icon: '🗜️',
                title: 'Compress PDF',
                description: 'Reduce PDF file size',
                url: 'compress-pdf.html'
            }
        ];

        const relatedSection = DocLiteComponents.createRelatedTools(relatedTools);
        document.getElementById('relatedTools').appendChild(relatedSection);
    }

    // Initialize on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

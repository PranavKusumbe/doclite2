// PDF to JPG Converter - Client-side with PDF.js
(function() {
    'use strict';

    // Configure PDF.js worker
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    let selectedFiles = [];
    let convertedResults = [];

    function init() {
        setupUploadArea();
        setupControls();
        setupRelatedTools();
    }

    function setupUploadArea() {
        const uploadArea = DocLiteComponents.createUploadArea({
            accept: '.pdf,application/pdf',
            multiple: true,
            onFileSelect: handleFileSelect
        });
        document.getElementById('uploadArea').appendChild(uploadArea);
    }

    function handleFileSelect(files) {
        selectedFiles = files.filter(f => f.type === 'application/pdf' || f.name.endsWith('.pdf'));
        
        if (selectedFiles.length === 0) {
            alert('Please select valid PDF files');
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
        const qualitySlider = document.getElementById('qualitySlider');
        const qualityValue = document.getElementById('quality-value');
        
        qualitySlider.addEventListener('input', (e) => {
            qualityValue.textContent = e.target.value;
        });

        document.getElementById('convertBtn').addEventListener('click', convertPDFs);
    }

    async function convertPDFs() {
        if (selectedFiles.length === 0) return;

        DocLiteComponents.showLoading('Converting PDF to JPG...');
        convertedResults = [];

        const quality = parseInt(document.getElementById('qualitySlider').value) / 100;
        const dpi = parseInt(document.getElementById('dpiSelect').value);
        const scale = dpi / 72; // PDF.js uses 72 DPI as base

        try {
            for (const file of selectedFiles) {
                const images = await convertPDFToImages(file, quality, scale);
                convertedResults.push(...images);
            }

            displayResults();
        } catch (error) {
            console.error('Conversion error:', error);
            alert('Error converting PDF. Please try again.');
        } finally {
            DocLiteComponents.hideLoading();
        }
    }

    async function convertPDFToImages(file, quality, scale) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const images = [];

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({ scale });

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            await page.render({
                canvasContext: context,
                viewport: viewport
            }).promise;

            const blob = await new Promise(resolve => {
                canvas.toBlob(resolve, 'image/jpeg', quality);
            });

            const filename = `${file.name.replace('.pdf', '')}_page_${pageNum}.jpg`;
            const thumbnail = URL.createObjectURL(blob);

            images.push({
                blob,
                filename,
                thumbnail,
                size: blob.size,
                page: pageNum,
                totalPages: pdf.numPages
            });
        }

        return images;
    }

    function displayResults() {
        const resultsSection = document.getElementById('resultsSection');
        const resultsGrid = document.getElementById('resultsGrid');
        
        resultsGrid.innerHTML = '';
        
        convertedResults.forEach((result, index) => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            resultItem.innerHTML = `
                <img src="${result.thumbnail}" alt="${result.filename}" class="result-thumbnail">
                <div class="result-filename">${result.filename}</div>
                <div style="font-size: 0.85rem; color: var(--color-text-light); margin: 0.5rem 0;">
                    ${DocLiteComponents.formatFileSize(result.size)}
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
            DocLiteComponents.downloadAsZip(convertedResults, 'pdf-to-jpg.zip');
        });
    }

    function setupRelatedTools() {
        const tools = [
            { icon: '📄', title: 'JPG to PDF', description: 'Convert images to PDF', url: 'jpg-to-pdf.html' },
            { icon: '🗜️', title: 'Compress PDF', description: 'Reduce PDF size', url: 'compress-pdf.html' },
            { icon: '✂️', title: 'Split PDF', description: 'Extract specific pages', url: 'split-pdf.html' },
            { icon: '🖼️', title: 'PDF to PNG', description: 'Convert to PNG format', url: 'pdf-to-png.html' }
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

// Merge PDF Tool - Using pdf-lib
(function() {
    'use strict';

    const { PDFDocument } = PDFLib;
    
    let selectedFiles = [];
    let mergedPdfBlob = null;

    function init() {
        setupUploadArea();
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
        const pdfFiles = files.filter(f => f.type === 'application/pdf' || f.name.endsWith('.pdf'));
        
        if (pdfFiles.length === 0) {
            alert('Please select valid PDF files');
            return;
        }

        selectedFiles = [...selectedFiles, ...pdfFiles];
        displayFileList();
        document.getElementById('fileListSection').classList.remove('hidden');
    }

    function displayFileList() {
        const container = document.getElementById('sortableFiles');
        container.innerHTML = '';

        selectedFiles.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.draggable = true;
            fileItem.dataset.index = index;
            fileItem.style.cursor = 'move';
            
            fileItem.innerHTML = `
                <div style="display: flex; align-items: center; gap: var(--space-sm);">
                    <div style="font-size: 1.5rem;">☰</div>
                    <div class="file-icon">📄</div>
                    <div class="file-info" style="flex: 1;">
                        <div class="file-name">${file.name}</div>
                        <div class="file-size">${DocLiteComponents.formatFileSize(file.size)}</div>
                    </div>
                    <div class="file-actions">
                        <button class="btn btn-small btn-secondary remove-btn" data-index="${index}">
                            Remove
                        </button>
                    </div>
                </div>
            `;

            // Remove button
            fileItem.querySelector('.remove-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                selectedFiles.splice(index, 1);
                if (selectedFiles.length === 0) {
                    document.getElementById('fileListSection').classList.add('hidden');
                } else {
                    displayFileList();
                }
            });

            // Drag and drop for reordering
            fileItem.addEventListener('dragstart', handleDragStart);
            fileItem.addEventListener('dragover', handleDragOver);
            fileItem.addEventListener('drop', handleDrop);
            fileItem.addEventListener('dragend', handleDragEnd);

            container.appendChild(fileItem);
        });

        // Merge button
        const mergeBtn = document.getElementById('mergeBtn');
        mergeBtn.disabled = selectedFiles.length < 2;
        if (selectedFiles.length < 2) {
            mergeBtn.textContent = '🔗 Add at least 2 PDFs';
        } else {
            mergeBtn.textContent = `🔗 Merge ${selectedFiles.length} PDFs`;
            mergeBtn.onclick = mergePDFs;
        }
    }

    let draggedIndex = null;

    function handleDragStart(e) {
        draggedIndex = parseInt(e.currentTarget.dataset.index);
        e.currentTarget.style.opacity = '0.5';
    }

    function handleDragOver(e) {
        e.preventDefault();
        e.currentTarget.style.borderTop = '3px solid var(--color-primary)';
    }

    function handleDrop(e) {
        e.preventDefault();
        e.currentTarget.style.borderTop = '';
        
        const dropIndex = parseInt(e.currentTarget.dataset.index);
        if (draggedIndex !== null && draggedIndex !== dropIndex) {
            const [movedFile] = selectedFiles.splice(draggedIndex, 1);
            selectedFiles.splice(dropIndex, 0, movedFile);
            displayFileList();
        }
    }

    function handleDragEnd(e) {
        e.currentTarget.style.opacity = '';
        e.currentTarget.style.borderTop = '';
        draggedIndex = null;
    }

    async function mergePDFs() {
        if (selectedFiles.length < 2) {
            alert('Please select at least 2 PDF files to merge');
            return;
        }

        DocLiteComponents.showLoading('Merging PDFs...');

        try {
            // Create a new PDF document
            const mergedPdf = await PDFDocument.create();

            // Process each PDF file
            for (let i = 0; i < selectedFiles.length; i++) {
                const file = selectedFiles[i];
                const arrayBuffer = await file.arrayBuffer();
                
                try {
                    const pdf = await PDFDocument.load(arrayBuffer);
                    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                    copiedPages.forEach((page) => {
                        mergedPdf.addPage(page);
                    });
                } catch (error) {
                    console.error(`Error loading ${file.name}:`, error);
                    throw new Error(`Failed to load ${file.name}. It may be corrupted or password-protected.`);
                }
            }

            // Save the merged PDF
            const mergedPdfBytes = await mergedPdf.save();
            mergedPdfBlob = new Blob([mergedPdfBytes], { type: 'application/pdf' });

            // Show results
            displayResults();

        } catch (error) {
            console.error('Merge error:', error);
            alert(`Error merging PDFs: ${error.message}\n\nPlease ensure all PDFs are valid and not password-protected.`);
        } finally {
            DocLiteComponents.hideLoading();
        }
    }

    function displayResults() {
        const totalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);
        const totalPages = selectedFiles.length; // Approximation
        
        document.getElementById('resultFilename').textContent = 'merged-document.pdf';
        document.getElementById('resultInfo').textContent = 
            `${DocLiteComponents.formatFileSize(mergedPdfBlob.size)} • ${selectedFiles.length} files merged`;

        document.getElementById('resultsSection').classList.remove('hidden');

        // Download button
        document.getElementById('downloadBtn').onclick = () => {
            DocLiteComponents.downloadFile(mergedPdfBlob, 'merged-document.pdf');
        };

        // Reset button
        document.getElementById('resetBtn').onclick = () => {
            selectedFiles = [];
            mergedPdfBlob = null;
            document.getElementById('fileListSection').classList.add('hidden');
            document.getElementById('resultsSection').classList.add('hidden');
        };

        // Hide file list section
        document.getElementById('fileListSection').classList.add('hidden');
    }

    function setupRelatedTools() {
        const tools = [
            { icon: '✂️', title: 'Split PDF', description: 'Extract pages from PDF', url: 'split-pdf.html' },
            { icon: '🗜️', title: 'Compress PDF', description: 'Reduce PDF size', url: 'compress-pdf.html' },
            { icon: '📑', title: 'Extract Pages', description: 'Select specific pages', url: 'extract-pdf-pages.html' },
            { icon: '🔄', title: 'Rotate PDF', description: 'Rotate PDF pages', url: 'rotate-pdf.html' }
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

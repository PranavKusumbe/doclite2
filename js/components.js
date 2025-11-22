// DocLite Components Library
// Reusable UI components for tool pages

class DocLiteComponents {
    // Create Upload Area
    static createUploadArea(options = {}) {
        const {
            accept = '*',
            multiple = true,
            onFileSelect = () => {}
        } = options;

        const container = document.createElement('div');
        container.className = 'upload-area';
        container.innerHTML = `
            <input type="file" id="fileInput" accept="${accept}" ${multiple ? 'multiple' : ''} style="display: none;">
            <div class="upload-icon">📁</div>
            <div class="upload-text">Click or drag files here</div>
            <div class="upload-subtext">Supports ${accept === '*' ? 'all formats' : accept}</div>
        `;

        const input = container.querySelector('#fileInput');
        
        container.addEventListener('click', () => input.click());
        
        // Drag and drop
        container.addEventListener('dragover', (e) => {
            e.preventDefault();
            container.classList.add('dragover');
        });
        
        container.addEventListener('dragleave', () => {
            container.classList.remove('dragover');
        });
        
        container.addEventListener('drop', (e) => {
            e.preventDefault();
            container.classList.remove('dragover');
            const files = Array.from(e.dataTransfer.files);
            onFileSelect(files);
        });
        
        input.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            onFileSelect(files);
        });

        return container;
    }

    // Create File List
    static createFileList(files, options = {}) {
        const {
            onRemove = () => {},
            onRemoveAll = () => {},
            showSize = true
        } = options;

        const container = document.createElement('div');
        container.className = 'file-list';

        // Header with Remove All button
        const header = document.createElement('div');
        header.className = 'file-list-header';
        header.innerHTML = `
            <div class="file-list-title">${files.length} file${files.length > 1 ? 's' : ''} selected</div>
            <button class="btn btn-small btn-secondary remove-all-btn">
                🗑️ Remove All
            </button>
        `;

        header.querySelector('.remove-all-btn').addEventListener('click', () => {
            onRemoveAll();
        });

        container.appendChild(header);

        // File items in grid
        const grid = document.createElement('div');
        grid.className = 'file-items-grid';

        files.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <div class="file-icon">📄</div>
                <div class="file-info">
                    <div class="file-name">${file.name}</div>
                    ${showSize ? `<div class="file-size">${this.formatFileSize(file.size)}</div>` : ''}
                </div>
                <div class="file-actions">
                    <button class="btn btn-small btn-secondary remove-btn" data-index="${index}">
                        ✕
                    </button>
                </div>
            `;

            fileItem.querySelector('.remove-btn').addEventListener('click', () => {
                onRemove(index);
            });

            grid.appendChild(fileItem);
        });

        container.appendChild(grid);
        return container;
    }

    // Create Progress Bar
    static createProgressBar(initialProgress = 0) {
        const container = document.createElement('div');
        container.className = 'progress-container hidden';
        container.innerHTML = `
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${initialProgress}%"></div>
            </div>
            <div class="progress-text">Processing: ${initialProgress}%</div>
        `;

        const updateProgress = (progress, text = null) => {
            const fill = container.querySelector('.progress-fill');
            const progressText = container.querySelector('.progress-text');
            fill.style.width = `${progress}%`;
            progressText.textContent = text || `Processing: ${progress}%`;
            container.classList.remove('hidden');
        };

        container.updateProgress = updateProgress;
        return container;
    }

    // Create Results Grid
    static createResultsGrid(results, options = {}) {
        const {
            onDownload = () => {},
            showThumbnails = true
        } = options;

        const container = document.createElement('div');
        container.className = 'results-grid';

        results.forEach((result, index) => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            
            let thumbnailHTML = '';
            if (showThumbnails && result.thumbnail) {
                thumbnailHTML = `<img src="${result.thumbnail}" alt="${result.filename}" class="result-thumbnail">`;
            }

            resultItem.innerHTML = `
                ${thumbnailHTML}
                <div class="result-filename">${result.filename}</div>
                <button class="btn btn-primary btn-small download-btn" data-index="${index}">
                  <i class="ti ti-download"></i>Download
                </button>
            `;

            resultItem.querySelector('.download-btn').addEventListener('click', () => {
                onDownload(result, index);
            });

            container.appendChild(resultItem);
        });

        return container;
    }

    // Create Controls Panel
    static createControls(config) {
        const container = document.createElement('div');
        container.className = 'controls';

        config.forEach(control => {
            const group = document.createElement('div');
            group.className = 'control-group';

            if (control.type === 'select') {
                group.innerHTML = `
                    <label class="control-label">${control.label}</label>
                    <select class="control-select" id="${control.id}">
                        ${control.options.map(opt => 
                            `<option value="${opt.value}" ${opt.selected ? 'selected' : ''}>${opt.label}</option>`
                        ).join('')}
                    </select>
                `;
            } else if (control.type === 'slider') {
                group.innerHTML = `
                    <label class="control-label">${control.label}: <span id="${control.id}-value">${control.value}</span></label>
                    <input type="range" class="control-slider" id="${control.id}" 
                           min="${control.min}" max="${control.max}" value="${control.value}" step="${control.step || 1}">
                `;
                
                setTimeout(() => {
                    const slider = group.querySelector(`#${control.id}`);
                    const valueDisplay = group.querySelector(`#${control.id}-value`);
                    slider.addEventListener('input', (e) => {
                        valueDisplay.textContent = e.target.value;
                        if (control.onChange) control.onChange(e.target.value);
                    });
                }, 0);
            } else if (control.type === 'input') {
                group.innerHTML = `
                    <label class="control-label">${control.label}</label>
                    <input type="${control.inputType || 'text'}" class="control-input" id="${control.id}" 
                           value="${control.value || ''}" placeholder="${control.placeholder || ''}">
                `;
            }

            container.appendChild(group);
        });

        return container;
    }

    // Create FAQ Section
    static createFAQ(faqs) {
        const container = document.createElement('div');
        container.className = 'faq-section';
        container.innerHTML = '<h2 class="faq-title">Frequently Asked Questions</h2>';

        faqs.forEach(faq => {
            const faqItem = document.createElement('div');
            faqItem.className = 'faq-item';
            faqItem.innerHTML = `
                <h3 class="faq-question">${faq.question}</h3>
                <p class="faq-answer">${faq.answer}</p>
            `;
            container.appendChild(faqItem);
        });

        return container;
    }

    // Create Related Tools
    static createRelatedTools(tools) {
        const container = document.createElement('div');
        container.className = 'related-tools';
        container.innerHTML = '<h2 class="related-tools-title">Related Tools</h2>';

        const grid = document.createElement('div');
        grid.className = 'related-tools-grid';

        tools.forEach(tool => {
            const card = document.createElement('a');
            card.href = tool.url;
            card.className = 'tool-card';
            card.innerHTML = `
                <div class="tool-card-icon">${tool.icon}</div>
                <h4 class="tool-card-title">${tool.title}</h4>
                <p class="tool-card-description">${tool.description}</p>
            `;
            grid.appendChild(card);
        });

        container.appendChild(grid);
        return container;
    }

    // Loading Overlay
    static showLoading(text = 'Processing...') {
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.id = 'loadingOverlay';
        overlay.innerHTML = `
            <div class="spinner"></div>
            <div class="loading-text">${text}</div>
        `;
        document.body.appendChild(overlay);
    }

    static hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) overlay.remove();
    }

    // Utility: Format file size
    static formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    // Utility: Download file
    static downloadFile(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Utility: Download as ZIP
    static async downloadAsZip(files, zipName = 'files.zip') {
        // Import JSZip dynamically
        const JSZip = window.JSZip;
        if (!JSZip) {
            console.error('JSZip not loaded');
            return;
        }

        const zip = new JSZip();
        files.forEach(file => {
            zip.file(file.filename, file.blob);
        });

        const content = await zip.generateAsync({ type: 'blob' });
        this.downloadFile(content, zipName);
    }

    // SEO: Add meta tags
    static addSEOTags(config) {
        const { title, description, keywords, canonical } = config;
        
        document.title = title;
        
        const setMeta = (name, content) => {
            let meta = document.querySelector(`meta[name="${name}"]`);
            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute('name', name);
                document.head.appendChild(meta);
            }
            meta.setAttribute('content', content);
        };

        setMeta('description', description);
        setMeta('keywords', keywords);
        
        if (canonical) {
            let link = document.querySelector('link[rel="canonical"]');
            if (!link) {
                link = document.createElement('link');
                link.setAttribute('rel', 'canonical');
                document.head.appendChild(link);
            }
            link.setAttribute('href', canonical);
        }
    }

    // SEO: Add Schema markup
    static addSchema(schema) {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
    }
}

// Export for use in other scripts
window.DocLiteComponents = DocLiteComponents;

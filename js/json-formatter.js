// JSON Formatter Tool
(function() {
    'use strict';

    const jsonInput = document.getElementById('jsonInput');
    const jsonOutput = document.getElementById('jsonOutput');
    const statusMessage = document.getElementById('statusMessage');
    const indentSelect = document.getElementById('indentSelect');
    const sortKeysSelect = document.getElementById('sortKeys');

    function init() {
        setupEventListeners();
        setupRelatedTools();
        loadSampleJSON();
    }

    function setupEventListeners() {
        document.getElementById('formatBtn').addEventListener('click', formatJSON);
        document.getElementById('minifyBtn').addEventListener('click', minifyJSON);
        document.getElementById('validateBtn').addEventListener('click', validateJSON);
        document.getElementById('copyBtn').addEventListener('click', copyOutput);
        document.getElementById('clearBtn').addEventListener('click', clearAll);

        // Auto-format on input (debounced)
        let timeout;
        jsonInput.addEventListener('input', () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                formatJSON(true); // silent mode
            }, 1000);
        });
    }

    function formatJSON(silent = false) {
        try {
            const input = jsonInput.value.trim();
            if (!input) {
                showMessage('Please enter some JSON data', 'error');
                return;
            }

            const parsed = JSON.parse(input);
            
            // Sort keys if requested
            const sortKeys = sortKeysSelect.value === 'true';
            const processed = sortKeys ? sortObjectKeys(parsed) : parsed;

            // Get indentation
            const indent = getIndentation();
            
            const formatted = JSON.stringify(processed, null, indent);
            jsonOutput.value = formatted;

            if (!silent) {
                showMessage('✅ JSON formatted successfully!', 'success');
            }
        } catch (error) {
            jsonOutput.value = '';
            showMessage(`❌ Invalid JSON: ${error.message}`, 'error');
        }
    }

    function minifyJSON() {
        try {
            const input = jsonInput.value.trim();
            if (!input) {
                showMessage('Please enter some JSON data', 'error');
                return;
            }

            const parsed = JSON.parse(input);
            const minified = JSON.stringify(parsed);
            
            jsonOutput.value = minified;
            showMessage(`✅ JSON minified! Reduced to ${minified.length} characters`, 'success');
        } catch (error) {
            jsonOutput.value = '';
            showMessage(`❌ Invalid JSON: ${error.message}`, 'error');
        }
    }

    function validateJSON() {
        try {
            const input = jsonInput.value.trim();
            if (!input) {
                showMessage('Please enter some JSON data', 'error');
                return;
            }

            const parsed = JSON.parse(input);
            const info = analyzeJSON(parsed);
            
            showMessage(
                `✅ Valid JSON!\n` +
                `Type: ${info.type}\n` +
                `Keys: ${info.keys}\n` +
                `Size: ${input.length} characters`,
                'success'
            );
        } catch (error) {
            showMessage(`❌ Invalid JSON: ${error.message}`, 'error');
        }
    }

    function copyOutput() {
        if (!jsonOutput.value) {
            showMessage('Nothing to copy. Please format JSON first.', 'error');
            return;
        }

        jsonOutput.select();
        document.execCommand('copy');
        showMessage('📋 Copied to clipboard!', 'success');
    }

    function clearAll() {
        jsonInput.value = '';
        jsonOutput.value = '';
        hideMessage();
    }

    function sortObjectKeys(obj) {
        if (Array.isArray(obj)) {
            return obj.map(item => sortObjectKeys(item));
        } else if (obj !== null && typeof obj === 'object') {
            const sorted = {};
            Object.keys(obj).sort().forEach(key => {
                sorted[key] = sortObjectKeys(obj[key]);
            });
            return sorted;
        }
        return obj;
    }

    function analyzeJSON(data) {
        const type = Array.isArray(data) ? 'Array' : typeof data === 'object' ? 'Object' : typeof data;
        let keys = 0;

        if (typeof data === 'object' && data !== null) {
            if (Array.isArray(data)) {
                keys = data.length;
            } else {
                keys = Object.keys(data).length;
            }
        }

        return { type, keys };
    }

    function getIndentation() {
        const indent = indentSelect.value;
        if (indent === 'tab') return '\t';
        return parseInt(indent);
    }

    function showMessage(message, type) {
        statusMessage.textContent = message;
        statusMessage.style.display = 'block';
        statusMessage.style.whiteSpace = 'pre-line';
        
        if (type === 'success') {
            statusMessage.style.background = 'rgba(79, 172, 254, 0.1)';
            statusMessage.style.color = '#2c5aa0';
            statusMessage.style.border = '2px solid rgba(79, 172, 254, 0.3)';
        } else {
            statusMessage.style.background = 'rgba(245, 87, 108, 0.1)';
            statusMessage.style.color = '#c53030';
            statusMessage.style.border = '2px solid rgba(245, 87, 108, 0.3)';
        }
    }

    function hideMessage() {
        statusMessage.style.display = 'none';
    }

    function loadSampleJSON() {
        const sample = {
            "name": "DocLite",
            "description": "Next-generation online toolbox",
            "features": [
                "PDF Tools",
                "Image Compression",
                "Text Utilities",
                "Developer Tools"
            ],
            "stats": {
                "totalTools": 50,
                "processing": "client-side",
                "price": "free"
            },
            "active": true
        };

        jsonInput.value = JSON.stringify(sample, null, 2);
    }

    function setupRelatedTools() {
        const tools = [
            { icon: '📋', title: 'XML Formatter', description: 'Format and beautify XML', url: 'xml-formatter.html' },
            { icon: '🔄', title: 'CSV to JSON', description: 'Convert CSV to JSON', url: 'csv-to-json.html' },
            { icon: '🔄', title: 'JSON to CSV', description: 'Convert JSON to CSV', url: 'json-to-csv.html' },
            { icon: '🗜️', title: 'JS Minifier', description: 'Minify JavaScript code', url: 'js-minifier.html' }
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

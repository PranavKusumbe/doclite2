// Word Counter Tool
(function() {
    'use strict';

    const textInput = document.getElementById('textInput');
    const wordCountEl = document.getElementById('wordCount');
    const charCountEl = document.getElementById('charCount');
    const charNoSpaceCountEl = document.getElementById('charNoSpaceCount');
    const sentenceCountEl = document.getElementById('sentenceCount');
    const paragraphCountEl = document.getElementById('paragraphCount');
    const readTimeEl = document.getElementById('readTime');

    function init() {
        setupEventListeners();
        setupRelatedTools();
        updateCounts();
    }

    function setupEventListeners() {
        textInput.addEventListener('input', updateCounts);

        document.getElementById('clearBtn').addEventListener('click', () => {
            textInput.value = '';
            updateCounts();
        });

        document.getElementById('copyBtn').addEventListener('click', () => {
            textInput.select();
            document.execCommand('copy');
            alert('Text copied to clipboard!');
        });

        document.getElementById('uppercaseBtn').addEventListener('click', () => {
            textInput.value = textInput.value.toUpperCase();
            updateCounts();
        });

        document.getElementById('lowercaseBtn').addEventListener('click', () => {
            textInput.value = textInput.value.toLowerCase();
            updateCounts();
        });

        document.getElementById('titlecaseBtn').addEventListener('click', () => {
            textInput.value = toTitleCase(textInput.value);
            updateCounts();
        });
    }

    function updateCounts() {
        const text = textInput.value;

        // Word count
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        const wordCount = text.trim() === '' ? 0 : words.length;
        wordCountEl.textContent = wordCount.toLocaleString();

        // Character count
        const charCount = text.length;
        charCountEl.textContent = charCount.toLocaleString();

        // Character count (no spaces)
        const charNoSpaceCount = text.replace(/\s/g, '').length;
        charNoSpaceCountEl.textContent = charNoSpaceCount.toLocaleString();

        // Sentence count
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const sentenceCount = sentences.length;
        sentenceCountEl.textContent = sentenceCount.toLocaleString();

        // Paragraph count
        const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);
        const paragraphCount = text.trim() === '' ? 0 : paragraphs.length;
        paragraphCountEl.textContent = paragraphCount.toLocaleString();

        // Reading time (average 200 words per minute)
        const readTimeMinutes = Math.ceil(wordCount / 200);
        readTimeEl.textContent = readTimeMinutes;
    }

    function toTitleCase(str) {
        return str.replace(/\w\S*/g, txt => {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    function setupRelatedTools() {
        const tools = [
            { icon: '🔤', title: 'Character Counter', description: 'Count characters only', url: 'character-counter.html' },
            { icon: 'Aa', title: 'Case Converter', description: 'Change text case', url: 'case-converter.html' },
            { icon: '🧹', title: 'Remove Duplicates', description: 'Remove duplicate lines', url: 'remove-duplicates.html' },
            { icon: '⏱️', title: 'Read Time Calculator', description: 'Estimate reading time', url: 'read-time.html' }
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

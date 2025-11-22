// AI Background Remover Tool
(async function() {
    let files = [];
    let bodyPixNet = null;
    let modelReady = false;

    // Load TensorFlow.js BodyPix model
    async function loadModel() {
        try {
            const modelStatus = document.getElementById('modelStatus');
            const progressBar = document.getElementById('modelProgress');
            
            modelStatus.innerHTML = '<p style="margin:0;">🤖 Loading AI Model...</p><div class="progress-bar" style="margin-top:1rem;"><div id="modelProgress" class="progress-fill" style="width:30%;"></div></div>';
            
            console.log('Starting to load BodyPix model...');
            
            // Load BodyPix with optimized settings
            bodyPixNet = await bodyPix.load({
                architecture: 'MobileNetV1',
                outputStride: 16,
                multiplier: 0.75,
                quantBytes: 2
            });
            
            console.log('BodyPix model loaded successfully');
            
            document.getElementById('modelProgress').style.width = '100%';
            modelStatus.innerHTML = '<p style="margin:0;color:#4caf50;">✅ AI Model Ready!</p>';
            modelReady = true;
            
            // Enable remove button if files are already selected
            if (files.length > 0) {
                document.getElementById('removeBtn').disabled = false;
            }
            
            // Hide status after 3 seconds
            setTimeout(() => {
                modelStatus.style.display = 'none';
            }, 3000);
            
        } catch (error) {
            console.error('Failed to load model:', error);
            document.getElementById('modelStatus').innerHTML = 
                '<p style="margin:0;color:#f44336;">❌ Failed to load AI model. Please refresh the page.</p>';
        }
    }

    // Start loading model immediately
    loadModel();

    // Setup upload area
    const uploadArea = DocLiteComponents.createUploadArea({
        accept: 'image/*',
        multiple: true,
        onFileSelect: (selectedFiles) => {
            files = selectedFiles.filter(f => f.type.startsWith('image/'));
            if (files.length) {
                displayFileList();
                document.getElementById('controls').classList.remove('hidden');
                if (modelReady) {
                    document.getElementById('removeBtn').disabled = false;
                }
            }
        }
    });
    
    document.getElementById('uploadArea').appendChild(uploadArea);

    // Display selected files
    function displayFileList() {
        const section = document.getElementById('fileListSection');
        section.innerHTML = '';
        section.appendChild(DocLiteComponents.createFileList(files, {
            onRemove: (index) => {
                files.splice(index, 1);
                if (files.length) {
                    displayFileList();
                } else {
                    section.classList.add('hidden');
                    document.getElementById('controls').classList.add('hidden');
                }
            },
            onRemoveAll: () => {
                files = [];
                section.classList.add('hidden');
                document.getElementById('controls').classList.add('hidden');
            }
        }));
        section.classList.remove('hidden');
    }

    // Update blur label
    document.getElementById('edgeBlur').oninput = (e) => {
        document.getElementById('blurLabel').textContent = e.target.value;
    };

    // Show/hide custom color input
    document.getElementById('bgType').onchange = (e) => {
        const customColorGroup = document.getElementById('customColorGroup');
        if (e.target.value === 'custom') {
            customColorGroup.classList.remove('hidden');
        } else {
            customColorGroup.classList.add('hidden');
        }
    };

    // Process images to remove background
    document.getElementById('removeBtn').onclick = async () => {
        if (!modelReady) {
            alert('AI model is still loading. Please wait...');
            return;
        }

        const quality = document.getElementById('quality').value;
        const edgeBlur = parseInt(document.getElementById('edgeBlur').value);
        const bgType = document.getElementById('bgType').value;
        const customColor = document.getElementById('customColor').value;

        const segmentationConfig = {
            low: { internalResolution: 'low', segmentationThreshold: 0.7 },
            medium: { internalResolution: 'medium', segmentationThreshold: 0.7 },
            high: { internalResolution: 'high', segmentationThreshold: 0.7 }
        };

        DocLiteComponents.showLoading('Processing with AI...');
        const results = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            try {
                const result = await processImage(file, bodyPixNet, segmentationConfig[quality], bgType, customColor, edgeBlur);
                results.push(result);
            } catch (error) {
                console.error(`Failed to process ${file.name}:`, error);
            }
        }

        displayResults(results);
        DocLiteComponents.hideLoading();
    };

    // Process single image
    async function processImage(file, model, config, bgType, customColor, edgeBlur) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = async (e) => {
                try {
                    const img = new Image();
                    
                    img.onload = async () => {
                        // Perform segmentation
                        const segmentation = await model.segmentPerson(img, config);
                        
                        // Create canvas for output
                        const canvas = document.createElement('canvas');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const ctx = canvas.getContext('2d');

                        // Apply background removal based on type
                        if (bgType === 'transparent') {
                            ctx.drawImage(img, 0, 0);
                            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                            const pixel = imageData.data;
                            const mask = segmentation.data;

                            if (edgeBlur > 0) {
                                // Apply edge blur for smoother result
                                for (let i = 0; i < mask.length; i++) {
                                    pixel[i * 4 + 3] = mask[i] === 1 ? 255 : 0;
                                }
                                ctx.putImageData(imageData, 0, 0);
                                ctx.filter = `blur(${edgeBlur}px)`;
                                ctx.globalCompositeOperation = 'destination-in';
                                ctx.drawImage(canvas, 0, 0);
                                ctx.filter = 'none';
                                ctx.globalCompositeOperation = 'source-over';
                                ctx.drawImage(img, 0, 0);
                                
                                const finalData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                                const finalPixel = finalData.data;
                                for (let i = 0; i < mask.length; i++) {
                                    if (mask[i] === 0) finalPixel[i * 4 + 3] = 0;
                                }
                                ctx.putImageData(finalData, 0, 0);
                            } else {
                                for (let i = 0; i < mask.length; i++) {
                                    if (mask[i] === 0) pixel[i * 4 + 3] = 0;
                                }
                                ctx.putImageData(imageData, 0, 0);
                            }
                        } else if (bgType === 'white' || bgType === 'black' || bgType === 'custom') {
                            const bgColor = bgType === 'white' ? '#ffffff' : 
                                          bgType === 'black' ? '#000000' : customColor;
                            
                            ctx.fillStyle = bgColor;
                            ctx.fillRect(0, 0, canvas.width, canvas.height);
                            ctx.drawImage(img, 0, 0);
                            
                            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                            const pixel = imageData.data;
                            const mask = segmentation.data;
                            const [r, g, b] = bgColor.match(/\w\w/g).map(x => parseInt(x, 16));
                            
                            for (let i = 0; i < mask.length; i++) {
                                if (mask[i] === 0) {
                                    pixel[i * 4] = r;
                                    pixel[i * 4 + 1] = g;
                                    pixel[i * 4 + 2] = b;
                                }
                            }
                            ctx.putImageData(imageData, 0, 0);
                        } else if (bgType === 'blur') {
                            ctx.filter = 'blur(20px)';
                            ctx.drawImage(img, 0, 0);
                            ctx.filter = 'none';
                            
                            const tempCanvas = document.createElement('canvas');
                            tempCanvas.width = canvas.width;
                            tempCanvas.height = canvas.height;
                            const tempCtx = tempCanvas.getContext('2d');
                            tempCtx.drawImage(img, 0, 0);
                            
                            const imageData = tempCtx.getImageData(0, 0, canvas.width, canvas.height);
                            const pixel = imageData.data;
                            const mask = segmentation.data;
                            
                            for (let i = 0; i < mask.length; i++) {
                                if (mask[i] === 0) pixel[i * 4 + 3] = 0;
                            }
                            tempCtx.putImageData(imageData, 0, 0);
                            ctx.drawImage(tempCanvas, 0, 0);
                        }

                        // Convert to blob
                        canvas.toBlob((blob) => {
                            resolve({
                                blob: blob,
                                filename: file.name.replace(/\.[^.]+$/, '') + '_nobg.png',
                                thumbnail: URL.createObjectURL(blob),
                                size: blob.size
                            });
                        }, 'image/png');
                    };

                    img.onerror = () => reject(new Error('Failed to load image'));
                    img.src = e.target.result;
                    
                } catch (error) {
                    reject(error);
                }
            };

            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
        });
    }

    // Display processed results
    function displayResults(results) {
        const grid = document.getElementById('resultsGrid');
        grid.innerHTML = '';

        results.forEach(result => {
            const div = document.createElement('div');
            div.className = 'result-item';
            div.innerHTML = `
                <img src="${result.thumbnail}" class="result-thumbnail" 
                     style="background:repeating-conic-gradient(#ddd 0% 25%, #fff 0% 50%) 50%/20px 20px;">
                <div class="result-filename">${result.filename}</div>
                <div class="result-size">${DocLiteComponents.formatFileSize(result.size)}</div>
                <button class="btn btn-primary btn-small">
                    <i class="ti ti-download"></i>Download
                </button>
            `;
            
            div.querySelector('button').onclick = () => {
                DocLiteComponents.downloadFile(result.blob, result.filename);
            };
            
            grid.appendChild(div);
        });

        document.getElementById('resultsSection').classList.remove('hidden');

        // Setup download all button
        document.getElementById('downloadAllBtn').onclick = () => {
            DocLiteComponents.downloadAsZip(results, 'removed_backgrounds.zip');
        };
    }

})();

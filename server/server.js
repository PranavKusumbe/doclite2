const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');
const { exec, execFile } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const execFilePromise = util.promisify(execFile);

const app = express();

// Ensure uploads directory exists
if (!fsSync.existsSync('uploads')) {
    fsSync.mkdirSync('uploads');
}

const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

// Audio Compression endpoint
app.post('/api/compress-audio', upload.single('audio'), async (req, res) => {
    try {
        const inputPath = req.file.path;
        const outputPath = `uploads/compressed_${Date.now()}.mp3`;
        const bitrate = req.body.bitrate || '128k';
        
        // Use ffmpeg for audio compression
        await execPromise(`ffmpeg -i ${inputPath} -b:a ${bitrate} ${outputPath}`);
        
        const fileData = await fs.readFile(outputPath);
        const base64 = fileData.toString('base64');
        
        // Cleanup
        await fs.unlink(inputPath);
        await fs.unlink(outputPath);
        
        res.json({ success: true, data: base64, format: 'mp3' });
    } catch (error) {
        console.error('Audio compression error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Video to GIF conversion endpoint
app.post('/api/video-to-gif', upload.single('video'), async (req, res) => {
    try {
        const inputPath = req.file.path;
        const outputPath = `uploads/output_${Date.now()}.gif`;
        const { width = 480, fps = 10, startTime = 0, duration = 5 } = req.body;
        
        // Use ffmpeg for video to GIF conversion
        await execPromise(
            `ffmpeg -ss ${startTime} -t ${duration} -i ${inputPath} ` +
            `-vf "fps=${fps},scale=${width}:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" ` +
            `-loop 0 ${outputPath}`
        );
        
        const fileData = await fs.readFile(outputPath);
        const base64 = fileData.toString('base64');
        
        // Cleanup
        await fs.unlink(inputPath);
        await fs.unlink(outputPath);
        
        res.json({ success: true, data: base64 });
    } catch (error) {
        console.error('Video to GIF error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Watermark Removal endpoint (basic implementation)
app.post('/api/remove-watermark', upload.single('image'), async (req, res) => {
    try {
        const inputPath = req.file.path;
        const outputPath = `uploads/cleaned_${Date.now()}.png`;
        const { x = 0, y = 0, width = 100, height = 100 } = req.body;
        
        // Use ImageMagick to remove watermark area by inpainting
        await execPromise(
            `convert ${inputPath} -region ${width}x${height}+${x}+${y} -blur 0x8 ${outputPath}`
        );
        
        const fileData = await fs.readFile(outputPath);
        const base64 = fileData.toString('base64');
        
        // Cleanup
        await fs.unlink(inputPath);
        await fs.unlink(outputPath);
        
        res.json({ success: true, data: base64 });
    } catch (error) {
        console.error('Watermark removal error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'DocLite backend server is running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`DocLite backend server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
});

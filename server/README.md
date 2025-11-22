# DocLite Backend Server

Backend server for DocLite tools that require server-side processing.

## Features

- **Audio Compression**: FFmpeg-based audio compression with customizable bitrate
- **Video to GIF**: Convert video files to animated GIFs with quality control
- **Watermark Removal**: Basic watermark removal using ImageMagick

## Prerequisites

The following tools must be installed on your system:

1. **Node.js** (v14 or higher)
2. **FFmpeg** - for audio/video processing
   - Windows: `choco install ffmpeg` or download from https://ffmpeg.org/
3. **ImageMagick** - for watermark removal
   - Windows: `choco install imagemagick` or download from https://imagemagick.org/

## Installation

```bash
cd server
npm install
```

## Usage

### Development Mode (with auto-restart)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will run on `http://localhost:3000` by default.

## API Endpoints

### Audio Compression
- **POST** `/api/compress-audio`
- Body: FormData with `audio` file and optional `bitrate` (default: 128k)

### Video to GIF
- **POST** `/api/video-to-gif`
- Body: FormData with `video` file and optional `width`, `fps`, `startTime`, `duration`

### Watermark Removal
- **POST** `/api/remove-watermark`
- Body: FormData with `image` file and optional `x`, `y`, `width`, `height`

### Health Check
- **GET** `/api/health`

## Configuration

Set the `PORT` environment variable to change the server port:

```bash
PORT=5000 npm start
```

## Frontend Integration

Update the frontend tools to point to this backend:

```javascript
const API_URL = 'http://localhost:3000';

// Example: Audio compression
const formData = new FormData();
formData.append('audio', audioFile);
formData.append('bitrate', '192k');

const response = await fetch(`${API_URL}/api/compress-audio`, {
    method: 'POST',
    body: formData
});

const result = await response.json();
if (result.success) {
    const blob = base64ToBlob(result.data, 'audio/mp3');
    // Use the blob...
}
```

## Security Notes

- This server is designed for local/development use
- For production, add authentication, rate limiting, and file validation
- Consider using environment variables for sensitive configuration
- Implement proper error handling and logging

## License

MIT

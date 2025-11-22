# UI Consistency Fixes

## Overview
The Image Compressor and PDF Compressor tools have been updated to match the visual style of the Split PDF tool, ensuring consistency across the application.

## Changes Made

### 1. Compress Image Tool (`tools/compress-image.html`)
- **UI Reversion**: Reverted from the "modern" slider-based UI to a simpler, standard input-based UI.
- **Consistency**: Now uses standard HTML inputs and `control-group` styling consistent with `split-pdf.html`.
- **Functionality**:
    - Added specific "Target File Size (KB)" input (defaulting to 25KB as requested).
    - Added "Output Format" selector.
    - Implemented iterative compression algorithm to aggressively target the specified file size (e.g., for government forms).

### 2. Compress PDF Tool (`tools/compress-pdf.html`)
- **UI Reversion**: Reverted to the simpler, standard UI style.
- **Consistency**: Aligned visual elements (headers, inputs, buttons) with `split-pdf.html` and the new `compress-image.html`.
- **Functionality**:
    - Added specific "Target File Size (KB)" input.
    - Implemented iterative PDF compression (rendering pages to images and re-embedding) to meet target sizes.

## Verification
- Both tools now share the same visual language as the rest of the suite.
- The specific requirement for 25KB compression is directly supported via the input field.

import JSZip from 'jszip';
import pako from 'pako';
import { analyzeImage } from './imageAnalysis';

// Compression settings
const COMPRESSION_SETTINGS = {
  IMAGE: {
    quality: 0.7,  // 70% quality retention
    maxWidth: 2048,
    maxHeight: 2048,
    preserveMetadata: true
  },
  VIDEO: {
    bitrate: '1M',
    codec: 'h264'
  },
  DOCUMENT: {
    level: 7  // DEFLATE compression level (0-9)
  }
};

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function validateFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 2 * 1024 * 1024 * 1024; // 2GB
  
  if (file.size > maxSize) {
    return { valid: false, error: 'File size exceeds 2GB limit' };
  }

  const allowedTypes = [
    'image/',
    'video/',
    'audio/',
    'application/pdf',
    'application/zip',
    'application/x-zip-compressed',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ];

  if (!allowedTypes.some(type => file.type.startsWith(type))) {
    return { valid: false, error: 'File type not supported' };
  }

  return { valid: true };
}

async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      
      let { width, height } = img;
      const settings = COMPRESSION_SETTINGS.IMAGE;
      
      // Calculate aspect ratio preserving dimensions
      if (width > settings.maxWidth || height > settings.maxHeight) {
        const ratio = Math.min(settings.maxWidth / width, settings.maxHeight / height);
        width *= ratio;
        height *= ratio;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Apply high-quality image smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      // Draw image with proper dimensions
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        blob => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Image compression failed'));
          }
        },
        file.type,
        settings.quality
      );
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = url;
  });
}

async function compressDocument(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const compressed = pako.deflate(new Uint8Array(arrayBuffer), {
    level: COMPRESSION_SETTINGS.DOCUMENT.level
  });
  return new Blob([compressed], { type: file.type });
}

async function compressZip(file: File): Promise<Blob> {
  const zip = await JSZip.loadAsync(file);
  const newZip = new JSZip();
  
  for (const [path, zipEntry] of Object.entries(zip.files)) {
    if (!zipEntry.dir) {
      const content = await zipEntry.async('uint8array');
      const compressed = pako.deflate(content, {
        level: COMPRESSION_SETTINGS.DOCUMENT.level
      });
      newZip.file(path, compressed);
    }
  }
  
  return newZip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: {
      level: COMPRESSION_SETTINGS.DOCUMENT.level
    }
  });
}

export async function processFiles(files: File[]): Promise<{
  blob: Blob;
  tags?: string[];
  metadata?: any;
}[]> {
  return Promise.all(
    files.map(async (file) => {
      try {
        // Analyze file for metadata and tags first
        const analysis = file.type.startsWith('image/') 
          ? await analyzeImage(file)
          : { tags: [], metadata: {} };

        // Compress based on file type
        const compressedBlob = await (async () => {
          if (file.type.startsWith('image/')) {
            return compressImage(file);
          } else if (file.type.includes('zip')) {
            return compressZip(file);
          } else {
            return compressDocument(file);
          }
        })();

        return {
          blob: compressedBlob,
          ...analysis
        };
      } catch (error) {
        console.error('File processing error:', error);
        throw new Error(`Failed to process file: ${file.name}`);
      }
    })
  );
}

export function getCompressionRatio(originalSize: number, compressedSize: number): string {
  if (originalSize === 0 || isNaN(originalSize) || isNaN(compressedSize)) return '0%';
  const ratio = ((originalSize - compressedSize) / originalSize) * 100;
  return `${Math.round(ratio)}%`;
}
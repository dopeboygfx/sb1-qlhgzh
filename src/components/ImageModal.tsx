import { useEffect, useCallback } from 'react';
import { X, Download, ZoomIn, ZoomOut } from 'lucide-react';
import { useState } from 'react';

interface ImageModalProps {
  src: string;
  alt: string;
  onClose: () => void;
  onDownload?: () => void;
}

export default function ImageModal({ src, alt, onClose, onDownload }: ImageModalProps) {
  const [zoom, setZoom] = useState(1);
  const [loading, setLoading] = useState(true);
  
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [handleKeyDown]);

  const handleZoom = (factor: number) => {
    setZoom(prev => Math.max(0.5, Math.min(3, prev + factor)));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative z-10 max-w-7xl w-full mx-4">
        <div className="absolute top-4 right-4 flex items-center space-x-2 z-20">
          <button
            onClick={() => handleZoom(-0.5)}
            className="p-2 rounded-lg bg-dark-800/80 text-white hover:bg-dark-700/80"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleZoom(0.5)}
            className="p-2 rounded-lg bg-dark-800/80 text-white hover:bg-dark-700/80"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          {onDownload && (
            <button
              onClick={onDownload}
              className="p-2 rounded-lg bg-dark-800/80 text-white hover:bg-dark-700/80"
            >
              <Download className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-dark-800/80 text-white hover:bg-dark-700/80"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative overflow-hidden rounded-lg">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-dark-800">
              <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          <img
            src={src}
            alt={alt}
            className="max-h-[90vh] w-full object-contain transition-transform duration-200"
            style={{ transform: `scale(${zoom})` }}
            onLoad={() => setLoading(false)}
          />
        </div>
      </div>
    </div>
  );
}
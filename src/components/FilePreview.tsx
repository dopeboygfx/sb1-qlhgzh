import { useState } from 'react';
import { FileText, Image, Video, Music, File, Download, X, Tag } from 'lucide-react';
import { FileData } from '../types';
import { formatFileSize, getCompressionRatio } from '../utils/compression';
import TagsInput from './TagsInput';
import { useAuth } from '../context/AuthContext';
import ImageModal from './ImageModal';

interface PreviewProps {
  file: FileData;
  onClose?: () => void;
  onDownload?: (file: FileData, type: 'original' | 'compressed') => void;
}

export default function FilePreview({ file, onClose, onDownload }: PreviewProps) {
  const { updateFileTags } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);

  const handleTagsChange = (newTags: string[]) => {
    updateFileTags(file.id, newTags);
  };

  const getPreviewContent = () => {
    const type = file.type.split('/')[0];

    switch (type) {
      case 'image':
        return (
          <div className="relative aspect-video bg-dark-700 rounded-lg overflow-hidden">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-pulse">
                  <Image className="h-12 w-12 text-gray-500" />
                </div>
              </div>
            )}
            {error && (
              <div className="absolute inset-0 flex items-center justify-center text-red-500">
                <p>{error}</p>
              </div>
            )}
            <button
              onClick={() => setShowImageModal(true)}
              className="w-full h-full"
            >
              <img
                src={file.url}
                alt={file.name}
                className={`w-full h-full object-contain transition-opacity duration-200 hover:opacity-90 ${
                  isLoading ? 'opacity-0' : 'opacity-100'
                }`}
                onLoad={() => {
                  setIsLoading(false);
                  setError(null);
                }}
                onError={() => {
                  setIsLoading(false);
                  setError('Failed to load image');
                }}
              />
            </button>
          </div>
        );
      case 'video':
        return (
          <div className="relative w-full h-48 bg-dark-700 rounded-lg overflow-hidden">
            <video
              src={file.url}
              controls
              className="w-full h-full object-contain"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        );
      case 'audio':
        return (
          <div className="w-full bg-dark-700 rounded-lg p-4">
            <div className="flex items-center space-x-4">
              <Music className="h-8 w-8 text-primary-500" />
              <audio controls className="w-full">
                <source src={file.url} type={file.type} />
                Your browser does not support the audio element.
              </audio>
            </div>
          </div>
        );
      case 'application':
        if (file.type.includes('pdf')) {
          return (
            <div className="w-full h-48 bg-dark-700 rounded-lg p-4">
              <iframe
                src={file.url}
                className="w-full h-full"
                title={file.name}
              />
            </div>
          );
        }
        return (
          <div className="w-full bg-dark-700 rounded-lg p-4 flex items-center justify-center">
            <FileText className="h-16 w-16 text-primary-500" />
          </div>
        );
      default:
        return (
          <div className="w-full bg-dark-700 rounded-lg p-4 flex items-center justify-center">
            <File className="h-16 w-16 text-primary-500" />
          </div>
        );
    }
  };

  const ratio = getCompressionRatio(
    parseInt(file.originalSize),
    parseInt(file.compressedSize)
  );

  return (
    <>
      <div className="bg-dark-800 rounded-xl shadow-lg overflow-hidden">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white">{file.name}</h3>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1 text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          
          {getPreviewContent()}

          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Original Size</p>
                <p className="text-white">{file.originalSize}</p>
              </div>
              <div>
                <p className="text-gray-400">Compressed Size</p>
                <p className="text-white">{file.compressedSize}</p>
              </div>
              <div>
                <p className="text-gray-400">Reduction</p>
                <p className="text-primary-400">{ratio}</p>
              </div>
              <div>
                <p className="text-gray-400">Type</p>
                <p className="text-white">{file.type}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Tags
              </label>
              <TagsInput
                tags={file.tags || []}
                onTagsChange={handleTagsChange}
                suggestions={[
                  'important',
                  'work',
                  'personal',
                  'archive',
                  'favorite'
                ]}
              />
            </div>

            {onDownload && file.status === 'completed' && (
              <div className="space-y-2">
                <button
                  onClick={() => onDownload(file, 'compressed')}
                  className="w-full flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Download className="h-5 w-5" />
                  <span>Download Compressed File</span>
                </button>
                <button
                  onClick={() => onDownload(file, 'original')}
                  className="w-full flex items-center justify-center space-x-2 bg-dark-700 hover:bg-dark-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Download className="h-5 w-5" />
                  <span>Download Original File</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showImageModal && file.url && (
        <ImageModal
          src={file.url}
          alt={file.name}
          onClose={() => setShowImageModal(false)}
          onDownload={() => onDownload?.(file, 'compressed')}
        />
      )}
    </>
  );
}
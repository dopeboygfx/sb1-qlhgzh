import { FileType, Download, Trash2, Eye } from 'lucide-react';
import { FileData } from '../types';
import { getCompressionRatio } from '../utils/compression';

interface FileItemProps {
  file: FileData;
  onPreview: (file: FileData) => void;
  onDelete: (id: string) => void;
  onDownload: (file: FileData) => void;
}

export default function FileItem({ file, onPreview, onDelete, onDownload }: FileItemProps) {
  const originalSize = parseInt(file.originalSize);
  const compressedSize = parseInt(file.compressedSize);
  const ratio = !isNaN(originalSize) && !isNaN(compressedSize) 
    ? getCompressionRatio(originalSize, compressedSize)
    : '0%';

  return (
    <div className="bg-dark-700 rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="p-2 bg-dark-600 rounded-lg">
          <FileType className="h-6 w-6 text-primary-500" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-white">{file.name}</h3>
          <div className="text-xs space-y-1">
            <p className="text-gray-400">
              Original: {file.originalSize} • Compressed: {file.compressedSize}
            </p>
            {file.status === 'completed' && (
              <p className="text-primary-400">
                Reduced by {ratio}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        {file.status === 'processing' ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500"></div>
            <span className="ml-2 text-sm text-gray-400">Processing</span>
          </div>
        ) : (
          <>
            <button
              onClick={() => onPreview(file)}
              className="p-1 hover:text-primary-500 text-gray-400"
              title="Preview file"
            >
              <Eye className="h-5 w-5" />
            </button>
            <button
              onClick={() => onDownload(file)}
              className="p-1 hover:text-primary-500 text-gray-400"
              title="Download compressed file"
              disabled={file.status !== 'completed'}
            >
              <Download className="h-5 w-5" />
            </button>
            <button
              onClick={() => onDelete(file.id)}
              className="p-1 hover:text-red-500 text-gray-400"
              title="Delete file"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
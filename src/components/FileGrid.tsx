import { FileText, Image, Video, Music, File } from 'lucide-react';
import type { FileData } from '../types';

interface FileGridProps {
  files: FileData[];
  onSelect: (file: FileData) => void;
}

export default function FileGrid({ files, onSelect }: FileGridProps) {
  const getFileIcon = (type: string) => {
    const baseType = type.split('/')[0];
    switch (baseType) {
      case 'image':
        return Image;
      case 'video':
        return Video;
      case 'audio':
        return Music;
      case 'application':
        return FileText;
      default:
        return File;
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {files.map((file) => {
        const Icon = getFileIcon(file.type);
        const isImage = file.type.startsWith('image/');

        return (
          <button
            key={file.id}
            onClick={() => onSelect(file)}
            className="group bg-dark-800 rounded-lg p-4 hover:bg-dark-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <div className="aspect-square mb-2 rounded-lg overflow-hidden bg-dark-700 flex items-center justify-center">
              {isImage && file.url ? (
                <img
                  src={file.url}
                  alt={file.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <Icon className="h-12 w-12 text-primary-500" />
              )}
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-white truncate" title={file.name}>
                {file.name}
              </p>
              <p className="text-xs text-gray-400">{file.size}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
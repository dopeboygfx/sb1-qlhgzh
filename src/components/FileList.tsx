import { FileText, Image, Video, Music, File, ChevronRight } from 'lucide-react';
import type { FileData } from '../types';

interface FileListProps {
  files: FileData[];
  onSelect: (file: FileData) => void;
}

export default function FileList({ files, onSelect }: FileListProps) {
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
    <div className="bg-dark-800 rounded-lg overflow-hidden">
      {files.map((file, index) => {
        const Icon = getFileIcon(file.type);
        
        return (
          <button
            key={file.id}
            onClick={() => onSelect(file)}
            className={`w-full flex items-center space-x-4 p-4 hover:bg-dark-700 transition-colors focus:outline-none focus:bg-dark-700 ${
              index !== files.length - 1 ? 'border-b border-dark-600' : ''
            }`}
          >
            <div className="p-2 bg-dark-700 rounded-lg">
              <Icon className="h-6 w-6 text-primary-500" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium text-white truncate">
                {file.name}
              </p>
              <p className="text-xs text-gray-400">
                {file.size} • {file.type}
              </p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </button>
        );
      })}
    </div>
  );
}
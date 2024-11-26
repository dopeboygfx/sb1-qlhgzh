import { Image, Video, Music, FileText } from 'lucide-react';
import type { FileData } from '../types';
import { formatFileSize } from '../utils/compression';

interface FileStatsProps {
  files: FileData[];
}

export default function FileStats({ files }: FileStatsProps) {
  const stats = files.reduce((acc, file) => {
    const type = file.type.split('/')[0];
    acc.counts[type] = (acc.counts[type] || 0) + 1;
    acc.originalSize += parseInt(file.originalSize) || 0;
    acc.compressedSize += parseInt(file.compressedSize) || 0;
    return acc;
  }, {
    counts: {} as Record<string, number>,
    originalSize: 0,
    compressedSize: 0
  });

  const savedSpace = stats.originalSize - stats.compressedSize;
  const savingsPercentage = stats.originalSize ? 
    Math.round((savedSpace / stats.originalSize) * 100) : 0;

  const getIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="w-5 h-5" />;
      case 'video': return <Video className="w-5 h-5" />;
      case 'audio': return <Music className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-dark-800 rounded-lg p-6 space-y-6">
      <div>
        <h3 className="text-lg font-medium text-white mb-4">File Statistics</h3>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(stats.counts).map(([type, count]) => (
            <div key={type} className="flex items-center space-x-3 bg-dark-700 rounded-lg p-3">
              <div className="text-primary-500">
                {getIcon(type)}
              </div>
              <div>
                <p className="text-sm text-gray-400 capitalize">{type}s</p>
                <p className="text-lg font-semibold text-white">{count}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-dark-600 pt-6">
        <h3 className="text-lg font-medium text-white mb-4">Storage Savings</h3>
        <div className="space-y-4">
          <div className="bg-dark-700 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400">Original Size</span>
              <span className="text-white">{formatFileSize(stats.originalSize)}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400">Compressed Size</span>
              <span className="text-primary-400">{formatFileSize(stats.compressedSize)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Space Saved</span>
              <span className="text-green-400">{formatFileSize(savedSpace)} ({savingsPercentage}%)</span>
            </div>
          </div>

          <div className="bg-dark-700 rounded-lg p-3">
            <div className="h-2 bg-dark-600 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary-500 rounded-full transition-all duration-500"
                style={{ width: `${100 - savingsPercentage}%` }}
              />
            </div>
            <p className="text-center text-sm text-gray-400 mt-2">
              {savingsPercentage}% reduction in storage
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
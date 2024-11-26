import { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import FilePreview from '../components/FilePreview';
import FileItem from '../components/FileItem';
import { validateFile, formatFileSize, processFiles } from '../utils/compression';
import type { FileData } from '../types';

export default function Dashboard() {
  const { user, files, setFiles } = useAuth();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = async (file: File) => {
    const validation = validateFile(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    const url = URL.createObjectURL(file);
    
    const newFile: FileData = {
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type,
      status: 'processing',
      originalSize: formatFileSize(file.size),
      compressedSize: '- MB',
      url,
      originalBlob: file
    };

    setFiles(prev => [...prev, newFile]);

    try {
      const result = await processFiles([file]);
      const processedFile = result[0];
      
      setFiles(prev =>
        prev.map(f =>
          f.id === newFile.id
            ? {
                ...f,
                status: 'completed',
                compressedSize: formatFileSize(processedFile.blob.size),
                blob: processedFile.blob,
                tags: processedFile.tags,
                metadata: processedFile.metadata,
              }
            : f
        )
      );
    } catch (error) {
      console.error('Compression failed:', error);
      setFiles(prev =>
        prev.map(f =>
          f.id === newFile.id
            ? {
                ...f,
                status: 'failed',
                compressedSize: 'Failed',
              }
            : f
        )
      );
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles?.length) {
      Array.from(droppedFiles).forEach(processFile);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles?.length) {
      Array.from(selectedFiles).forEach(processFile);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleDelete = (id: string) => {
    setFiles(prev => {
      const updatedFiles = prev.filter(file => file.id !== id);
      if (selectedFile?.id === id) {
        setSelectedFile(null);
      }
      return updatedFiles;
    });
  };

  const handleDownload = (file: FileData, type: 'original' | 'compressed') => {
    const blob = type === 'original' ? file.originalBlob : file.blob;
    if (blob) {
      const prefix = type === 'original' ? 'original_' : 'compressed_';
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `${prefix}${file.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-dark-800 rounded-lg shadow-xl p-6">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold text-white">Upload Files</h1>
              <div className="text-sm text-gray-400">
                Storage used: {formatFileSize(files.reduce((acc, file) => acc + (file.blob?.size || 0), 0))} / 100 GB
              </div>
            </div>

            {/* Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center ${
                dragActive ? 'border-primary-500 bg-dark-700' : 'border-dark-600'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileInput}
                className="hidden"
                accept="image/*,video/*,audio/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip"
              />
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-4 text-lg text-gray-300">
                Drag and drop your files here, or{' '}
                <button
                  onClick={handleBrowseClick}
                  className="text-primary-500 hover:text-primary-400"
                >
                  browse
                </button>
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Support for images, videos, documents, and ZIP files up to 2GB
              </p>
            </div>

            {/* Files List */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-white mb-4">Recent Files</h2>
              <div className="space-y-4">
                {files.map((file) => (
                  <FileItem
                    key={file.id}
                    file={file}
                    onPreview={setSelectedFile}
                    onDelete={handleDelete}
                    onDownload={(file) => handleDownload(file, 'compressed')}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="lg:sticky lg:top-8">
          {selectedFile ? (
            <FilePreview
              file={selectedFile}
              onClose={() => setSelectedFile(null)}
              onDownload={handleDownload}
            />
          ) : (
            <div className="bg-dark-800 rounded-lg shadow-xl p-6 text-center">
              <Upload className="h-12 w-12 mx-auto mb-4 text-gray-500" />
              <p className="text-gray-400">Select a file to preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Upload, Grid, List, Search, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import FilePreview from '../components/FilePreview';
import FileGrid from '../components/FileGrid';
import FileList from '../components/FileList';
import FileStats from '../components/FileStats';
import type { FileData } from '../types';

export default function FileExplorer() {
  const { files } = useAuth();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || file.type.startsWith(filterType);
    return matchesSearch && matchesType;
  });

  const fileTypes = ['all', 'image', 'video', 'audio', 'application'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">File Explorer</h1>
        <Link
          to="/upload"
          className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Upload className="h-5 w-5" />
          <span>Upload Files</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Stats Panel */}
        <div className="lg:col-span-1">
          <FileStats files={files} />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Search and Filters */}
          <div className="mb-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-dark-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-dark-600 text-primary-500' : 'text-gray-400 hover:text-white'}`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-dark-600 text-primary-500' : 'text-gray-400 hover:text-white'}`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="pl-10 pr-8 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {fileTypes.map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Files Display */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {filteredFiles.length === 0 ? (
                <div className="bg-dark-800 rounded-lg p-8 text-center">
                  <p className="text-gray-400">No files found</p>
                </div>
              ) : viewMode === 'grid' ? (
                <FileGrid files={filteredFiles} onSelect={setSelectedFile} />
              ) : (
                <FileList files={filteredFiles} onSelect={setSelectedFile} />
              )}
            </div>

            {/* Preview Panel */}
            <div className="hidden lg:block">
              <div className="sticky top-8">
                {selectedFile ? (
                  <FilePreview
                    file={selectedFile}
                    onClose={() => setSelectedFile(null)}
                  />
                ) : (
                  <div className="bg-dark-800 rounded-lg shadow-xl p-6 text-center">
                    <Search className="h-12 w-12 text-gray-500 mx-auto mb-2" />
                    <p className="text-gray-400">Select a file to preview</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Preview Panel */}
      {selectedFile && (
        <div className="lg:hidden fixed inset-0 z-50 bg-dark-900 p-4">
          <FilePreview
            file={selectedFile}
            onClose={() => setSelectedFile(null)}
          />
        </div>
      )}
    </div>
  );
}
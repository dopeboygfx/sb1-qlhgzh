import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Database, FolderOpen, Upload } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-dark-800 border-b border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Database className="h-8 w-8 text-primary-500" />
              <span className="text-xl font-bold">CompressAI</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/files"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/files')
                  ? 'bg-dark-700 text-primary-500'
                  : 'text-gray-300 hover:text-white hover:bg-dark-700'
              }`}
            >
              <FolderOpen className="h-5 w-5" />
              <span>Files</span>
            </Link>
            <Link
              to="/upload"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/upload')
                  ? 'bg-dark-700 text-primary-500'
                  : 'text-gray-300 hover:text-white hover:bg-dark-700'
              }`}
            >
              <Upload className="h-5 w-5" />
              <span>Upload</span>
            </Link>
            {user ? (
              <button
                onClick={signOut}
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign Out
              </button>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-dark-700 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/files"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                isActive('/files')
                  ? 'bg-dark-700 text-primary-500'
                  : 'text-gray-300 hover:text-white hover:bg-dark-700'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <FolderOpen className="h-5 w-5" />
              <span>Files</span>
            </Link>
            <Link
              to="/upload"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                isActive('/upload')
                  ? 'bg-dark-700 text-primary-500'
                  : 'text-gray-300 hover:text-white hover:bg-dark-700'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <Upload className="h-5 w-5" />
              <span>Upload</span>
            </Link>
            {user ? (
              <button
                onClick={() => {
                  signOut();
                  setIsOpen(false);
                }}
                className="w-full text-left text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium"
              >
                Sign Out
              </button>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="block text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="block bg-primary-600 text-white px-3 py-2 rounded-md text-base font-medium hover:bg-primary-700"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
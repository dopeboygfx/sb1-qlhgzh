import { createContext, useContext, useState, ReactNode } from 'react';
import type { FileData } from '../types';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  files: FileData[];
  setFiles: (files: FileData[]) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => void;
  updateFileTags: (fileId: string, tags: string[]) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [files, setFiles] = useState<FileData[]>([]);

  const signIn = async (email: string, password: string) => {
    // Simulate authentication
    setUser({ id: '1', email, name: 'Demo User' });
  };

  const signUp = async (email: string, password: string, name: string) => {
    // Simulate registration
    setUser({ id: '1', email, name });
  };

  const signOut = () => {
    setUser(null);
    setFiles([]); // Clear files on sign out
  };

  const updateFileTags = (fileId: string, tags: string[]) => {
    setFiles(prev =>
      prev.map(file =>
        file.id === fileId
          ? { ...file, tags }
          : file
      )
    );
  };

  const value = {
    user,
    files,
    setFiles,
    signIn,
    signUp,
    signOut,
    updateFileTags
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
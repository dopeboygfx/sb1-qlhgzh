export interface FileData {
  id: string;
  name: string;
  size: string;
  type: string;
  status: 'processing' | 'completed' | 'failed';
  originalSize: string;
  compressedSize: string;
  url?: string;
  originalUrl?: string;  // URL for the original file
  compressedUrl?: string; // URL for the compressed file
  blob?: Blob;
  originalBlob?: Blob;
  tags?: string[];
  metadata?: {
    dateTime?: Date;
    location?: {
      latitude?: number;
      longitude?: number;
      altitude?: number;
    };
    camera?: {
      make?: string;
      model?: string;
    };
    description?: string;
  };
}
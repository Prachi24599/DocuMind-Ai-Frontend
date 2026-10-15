export type DocumentStatus = 'ready' | 'processing' | 'failed';

export interface DocumentRecord {
  id: string;
  name: string;
  sizeBytes: number;
  uploadedAt: string;
  status: DocumentStatus;
}
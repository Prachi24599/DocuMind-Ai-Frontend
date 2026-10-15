import type { DocumentRecord } from './types';

export const sampleDocuments: DocumentRecord[] = [
  { id: 'doc-01', name: 'Q3_Product_Strategy.pdf', sizeBytes: 2_480_000, uploadedAt: '2026-10-12T14:20:00Z', status: 'ready' },
  { id: 'doc-02', name: 'Customer_Interview_Notes.pdf', sizeBytes: 1_160_000, uploadedAt: '2026-10-11T09:45:00Z', status: 'ready' },
  { id: 'doc-03', name: 'Engineering_Handbook.pdf', sizeBytes: 8_720_000, uploadedAt: '2026-10-10T16:08:00Z', status: 'processing' },
  { id: 'doc-04', name: 'Market_Research_2026.pdf', sizeBytes: 4_390_000, uploadedAt: '2026-10-08T11:32:00Z', status: 'ready' },
  { id: 'doc-05', name: 'Design_System_Guidelines.pdf', sizeBytes: 3_050_000, uploadedAt: '2026-10-06T13:15:00Z', status: 'failed' },
  { id: 'doc-06', name: 'Platform_Migration_Plan.pdf', sizeBytes: 6_810_000, uploadedAt: '2026-10-03T10:05:00Z', status: 'ready' },
];
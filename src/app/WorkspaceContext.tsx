import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { sampleDocuments } from '../features/documents/mockData';
import type { DocumentRecord } from '../features/documents/types';

interface WorkspaceContextValue {
  documents: DocumentRecord[];
  removeDocument: (documentId: string) => void;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [documents, setDocuments] = useState(sampleDocuments);
  const value = useMemo(
    () => ({
      documents,
      removeDocument: (documentId: string) => {
        setDocuments((current) => current.filter((document) => document.id !== documentId));
      },
    }),
    [documents],
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within WorkspaceProvider');
  }
  return context;
}
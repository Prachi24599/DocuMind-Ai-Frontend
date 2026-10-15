import { useState } from 'react';
import { Plus } from 'lucide-react';
import UploadDialog from '../../../components/ui/UploadDialog';
import { useWorkspace } from '../../../app/WorkspaceContext';
import DocumentList from '../components/DocumentList';

export default function DocumentsPage() {
  const { documents, removeDocument } = useWorkspace();
  const [uploadOpen, setUploadOpen] = useState(false);

  return (
    <>
      <div className="page-heading flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Your library</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-[28px]">Documents</h1>
          <p className="mt-2 text-sm text-slate-500">Review your files and their current status.</p>
        </div>
        <button className="button-primary self-start sm:self-auto" onClick={() => setUploadOpen(true)}><Plus size={17} aria-hidden="true" />Add PDF</button>
      </div>
      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6" aria-label="All documents">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-ink">All documents</h2>
            <p className="mt-1 text-xs text-slate-500">{documents.length} sample {documents.length === 1 ? 'file' : 'files'}</p>
          </div>
        </div>
        <DocumentList documents={documents} onRemove={removeDocument} />
      </section>
      <UploadDialog open={uploadOpen} onClose={() => setUploadOpen(false)} />
    </>
  );
}
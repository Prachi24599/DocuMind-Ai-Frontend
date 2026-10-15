import { useMemo, useState } from 'react';
import { FileText, Search, Trash2, Upload } from 'lucide-react';
import StatusBadge from '../../../components/ui/StatusBadge';
import { formatDate, formatFileSize } from '../../../lib/format';
import type { DocumentRecord, DocumentStatus } from '../types';

interface DocumentListProps {
  documents: DocumentRecord[];
  onRemove: (documentId: string) => void;
  onUpload: () => void;
  compact?: boolean;
}

export default function DocumentList({ documents, onRemove, onUpload, compact = false }: DocumentListProps) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'all' | DocumentStatus>('all');
  const [message, setMessage] = useState('');

  const filteredDocuments = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return documents
      .filter((document) => status === 'all' || document.status === status)
      .filter((document) => document.name.toLowerCase().includes(normalizedQuery))
      .slice(0, compact ? 5 : undefined);
  }, [compact, documents, query, status]);

  function handleRemove(document: DocumentRecord) {
    onRemove(document.id);
    setMessage(`${document.name} was removed from this session. Sample data resets on reload.`);
  }

  function clearFilters() {
    setQuery('');
    setStatus('all');
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-[280px]">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <label htmlFor="document-search" className="sr-only">Search documents</label>
          <input id="document-search" className="input-control pl-9" type="search" placeholder="Search documents" value={query} onChange={(event) => setQuery(event.target.value)} />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="status-filter" className="text-xs font-medium text-slate-500">Status</label>
          <select id="status-filter" className="input-control w-full min-w-[142px] sm:w-auto" value={status} onChange={(event) => setStatus(event.target.value as 'all' | DocumentStatus)}>
            <option value="all">All statuses</option>
            <option value="ready">Ready</option>
            <option value="processing">Processing</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {message && <p className="mt-3 text-xs text-emerald-700" role="status">{message}</p>}
      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
        {documents.length === 0 ? (
          <div className="bg-white px-5 py-12 text-center">
            <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-slate-100 text-slate-500"><FileText size={19} aria-hidden="true" /></span>
            <h3 className="mt-3 text-sm font-semibold text-slate-800">Your library is empty</h3>
            <p className="mt-1 text-xs text-slate-500">Choose a PDF to get started. Uploading is not connected in this preview.</p>
            <button className="button-secondary mt-4" onClick={onUpload}><Upload size={15} aria-hidden="true" />Choose a PDF</button>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="bg-white px-5 py-12 text-center">
            <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-slate-100 text-slate-500"><Search size={19} aria-hidden="true" /></span>
            <h3 className="mt-3 text-sm font-semibold text-slate-800">No matching documents</h3>
            <p className="mt-1 text-xs text-slate-500">No files match your current search and status filters.</p>
            <button className="button-secondary mt-4" onClick={clearFilters}>Clear search and filters</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <caption className="sr-only">Documents with their file size, upload date, processing status, and available actions.</caption>
              <thead className="bg-slate-50">
                <tr className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                  <th scope="col" className="px-5 py-3">Document</th>
                  <th scope="col" className="px-4 py-3">File size</th>
                  <th scope="col" className="px-4 py-3">Uploaded</th>
                  <th scope="col" className="px-4 py-3">Status</th>
                  <th scope="col" className="px-4 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.map((document) => (
                  <tr key={document.id} className="border-t border-slate-100 bg-white">
                    <td className="px-5 py-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-rose-50 text-rose-600"><FileText size={17} aria-hidden="true" /></span>
                        <span className="block min-w-0 truncate text-sm font-medium text-slate-800" title={document.name}>{document.name}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">{formatFileSize(document.sizeBytes)}</td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">{formatDate(document.uploadedAt)}</td>
                    <td className="px-4 py-4"><StatusBadge status={document.status} /></td>
                    <td className="px-4 py-4">
                      <button className="icon-button h-8 w-8 text-slate-400 hover:text-rose-600" onClick={() => handleRemove(document)} aria-label={`Remove ${document.name} from this session`} title="Remove from this session">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {compact && filteredDocuments.length > 0 && <p className="mt-3 text-xs text-slate-500">Showing up to 5 recent documents.</p>}
    </div>
  );
}
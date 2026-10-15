import { useMemo, useState } from 'react';
import { FileText, Search, Trash2 } from 'lucide-react';
import StatusBadge from '../../../components/ui/StatusBadge';
import { formatDate, formatFileSize } from '../../../lib/format';
import type { DocumentRecord, DocumentStatus } from '../types';

interface DocumentListProps {
  documents: DocumentRecord[];
  onRemove: (documentId: string) => void;
  compact?: boolean;
}

export default function DocumentList({ documents, onRemove, compact = false }: DocumentListProps) {
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
        <div className="hidden grid-cols-[minmax(0,1fr)_110px_130px_125px_40px] items-center gap-4 bg-slate-50 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 md:grid">
          <span>Document</span><span>File size</span><span>Uploaded</span><span>Status</span><span className="sr-only">Actions</span>
        </div>
        {filteredDocuments.map((document) => (
          <div key={document.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-3 border-t border-slate-100 bg-white px-4 py-4 first:border-t-0 sm:px-5 md:grid-cols-[minmax(0,1fr)_110px_130px_125px_40px] md:gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-rose-50 text-rose-600"><FileText size={17} aria-hidden="true" /></span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-slate-800" title={document.name}>{document.name}</span>
                <span className="mt-1 block text-xs text-slate-500 md:hidden">{formatFileSize(document.sizeBytes)} · {formatDate(document.uploadedAt)}</span>
              </span>
            </div>
            <span className="hidden text-sm text-slate-600 md:block">{formatFileSize(document.sizeBytes)}</span>
            <span className="hidden text-sm text-slate-600 md:block">{formatDate(document.uploadedAt)}</span>
            <span className="justify-self-end md:justify-self-start"><StatusBadge status={document.status} /></span>
            <button className="icon-button h-8 w-8 justify-self-end text-slate-400 hover:text-rose-600" onClick={() => handleRemove(document)} aria-label={`Remove ${document.name} from this session`} title="Remove from this session">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {filteredDocuments.length === 0 && (
          <div className="bg-white px-5 py-12 text-center">
            <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-slate-100 text-slate-500"><Search size={19} aria-hidden="true" /></span>
            <h3 className="mt-3 text-sm font-semibold text-slate-800">No matching documents</h3>
            <p className="mt-1 text-xs text-slate-500">Try another search or status filter.</p>
          </div>
        )}
      </div>
      {compact && filteredDocuments.length > 0 && <p className="mt-3 text-xs text-slate-500">Showing up to 5 recent documents.</p>}
    </div>
  );
}
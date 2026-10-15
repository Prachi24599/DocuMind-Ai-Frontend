import { useState } from 'react';
import { ArrowRight, CheckCircle2, Clock3, FileText, Plus, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import UploadDialog from '../../../components/ui/UploadDialog';
import { useWorkspace } from '../../../app/WorkspaceContext';
import { formatToday } from '../../../lib/format';
import DocumentList from '../../documents/components/DocumentList';

export default function DashboardPage() {
  const { documents, removeDocument } = useWorkspace();
  const [uploadOpen, setUploadOpen] = useState(false);
  const readyCount = documents.filter((document) => document.status === 'ready').length;
  const processingCount = documents.filter((document) => document.status === 'processing').length;
  const summary = [
    { label: 'Total documents', value: documents.length, detail: 'Across your library', icon: FileText, iconStyle: 'bg-violet-50 text-violet-600' },
    { label: 'Ready to explore', value: readyCount, detail: 'Available for questions', icon: CheckCircle2, iconStyle: 'bg-emerald-50 text-emerald-600' },
    { label: 'Processing', value: processingCount, detail: 'Still being prepared', icon: Clock3, iconStyle: 'bg-amber-50 text-amber-600' },
  ];

  return (
    <>
      <div className="page-heading flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">{formatToday()}</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-[28px]">Good morning</h1>
          <p className="mt-2 text-sm text-slate-500">Pick up where you left off with your documents.</p>
        </div>
        <button className="button-primary self-start sm:self-auto" onClick={() => setUploadOpen(true)}><Plus size={17} aria-hidden="true" />Upload PDF</button>
      </div>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label="Document summary">
        {summary.map(({ label, value, detail, icon: Icon, iconStyle }) => (
          <article key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <p className="mt-3 text-[30px] font-semibold leading-none tracking-tight text-ink">{value}</p>
              </div>
              <span className={`grid h-10 w-10 place-items-center rounded-xl ${iconStyle}`}><Icon size={19} aria-hidden="true" /></span>
            </div>
            <p className="mt-4 text-xs text-slate-500">{detail}</p>
          </article>
        ))}
      </section>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6" aria-labelledby="recent-documents-title">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 id="recent-documents-title" className="text-base font-semibold text-ink">Recent documents</h2>
            <p className="mt-1 text-xs text-slate-500">Your latest files and their preparation status</p>
          </div>
          <Link to="/documents" className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-semibold text-violet-700 hover:bg-violet-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500">View all <ArrowRight size={14} aria-hidden="true" /></Link>
        </div>
        <DocumentList documents={documents} onRemove={removeDocument} compact />
      </section>

      <section className="mt-6 flex flex-col gap-4 rounded-2xl border border-violet-100 bg-[#f5f2ff] p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex gap-3.5">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-violet-600 shadow-sm"><Sparkles size={19} aria-hidden="true" /></span>
          <div>
            <h2 className="text-sm font-semibold text-ink">Answers grounded in your files</h2>
            <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-600">DocuMind is designed to help you ask questions across your PDFs and find answers with source context. AI answers are not connected in this preview.</p>
          </div>
        </div>
        <Link to="/conversations" className="button-secondary shrink-0 self-start bg-white sm:self-auto">Explore conversations <ArrowRight size={15} aria-hidden="true" /></Link>
      </section>
      <UploadDialog open={uploadOpen} onClose={() => setUploadOpen(false)} />
    </>
  );
}
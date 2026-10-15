import { useEffect, useRef, useState } from 'react';
import { AlertCircle, FileText, Upload, X } from 'lucide-react';
import { MAX_PDF_SIZE_BYTES, MAX_PDF_SIZE_MB } from '../../lib/config';
import { formatFileSize } from '../../lib/format';

interface UploadDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function UploadDialog({ open, onClose }: UploadDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', handleEscape);
    dialogRef.current?.querySelector<HTMLElement>('button:not([disabled])')?.focus();
    return () => {
      window.removeEventListener('keydown', handleEscape);
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setSelectedFile(null);
      setError('');
    }
  }, [open]);

  if (!open) return null;

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    setError('');
    setSelectedFile(null);
    if (!file) return;

    const hasPdfExtension = file.name.toLowerCase().endsWith('.pdf');
    const hasPdfMimeType = file.type === '' || file.type === 'application/pdf';
    if (!hasPdfExtension || !hasPdfMimeType) {
      setError('Choose a PDF file to continue.');
      event.currentTarget.value = '';
      return;
    }
    if (file.size > MAX_PDF_SIZE_BYTES) {
      setError(`This file is larger than the ${MAX_PDF_SIZE_MB} MB limit. Choose a smaller PDF.`);
      event.currentTarget.value = '';
      return;
    }
    setSelectedFile(file);
  }

  function clearFile() {
    setSelectedFile(null);
    setError('');
    if (inputRef.current) inputRef.current.value = '';
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/50 px-4 py-6" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section ref={dialogRef} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-7" role="dialog" aria-modal="true" aria-labelledby="upload-title">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-50 text-violet-600"><Upload size={19} aria-hidden="true" /></span>
            <h2 id="upload-title" className="mt-4 text-xl font-semibold text-ink">Add a PDF</h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">Choose a document to prepare it for your workspace.</p>
          </div>
          <button className="icon-button -mr-2 -mt-2" onClick={onClose} aria-label="Close upload dialog"><X size={19} /></button>
        </div>

        <label htmlFor="pdf-file" className="mt-6 flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/70 px-5 text-center transition hover:border-violet-400 hover:bg-violet-50/40 focus-within:outline focus-within:outline-2 focus-within:outline-violet-500">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-slate-500 shadow-sm"><FileText size={19} aria-hidden="true" /></span>
          <span className="mt-3 text-sm font-medium text-slate-700">Choose a PDF from your device</span>
          <span className="mt-1 text-xs text-slate-500">PDF only · up to {MAX_PDF_SIZE_MB} MB</span>
          <input ref={inputRef} id="pdf-file" type="file" accept="application/pdf,.pdf" className="sr-only" onChange={handleFileChange} />
        </label>

        {error && <p className="mt-3 flex items-start gap-2 text-sm text-rose-700" role="alert"><AlertCircle size={17} className="mt-0.5 shrink-0" />{error}</p>}
        {selectedFile && (
          <div className="mt-4 flex items-center gap-3 rounded-lg border border-slate-200 px-3.5 py-3">
            <FileText className="shrink-0 text-violet-600" size={19} aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-800">{selectedFile.name}</p>
              <p className="mt-0.5 text-xs text-slate-500">{formatFileSize(selectedFile.size)}</p>
            </div>
            <button className="icon-button h-8 w-8" onClick={clearFile} aria-label="Clear selected file"><X size={16} /></button>
          </div>
        )}

        <div className="mt-5 rounded-lg border border-violet-100 bg-violet-50/70 px-3.5 py-3">
          <p className="text-xs leading-5 text-violet-900"><span className="font-semibold">Preview only.</span> Uploading and AI processing are not connected. Your selected file stays in this browser and will not be sent or saved.</p>
        </div>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button className="button-secondary" onClick={onClose}>Cancel</button>
          <button className="button-primary cursor-not-allowed opacity-50" disabled title="Upload is not connected">Upload unavailable</button>
        </div>
      </section>
    </div>
  );
}
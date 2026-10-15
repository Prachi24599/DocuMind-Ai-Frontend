import type { DocumentStatus } from '../../features/documents/types';

const statusStyles: Record<DocumentStatus, string> = {
  ready: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  processing: 'bg-amber-50 text-amber-700 ring-amber-200',
  failed: 'bg-rose-50 text-rose-700 ring-rose-200',
};

const statusLabels: Record<DocumentStatus, string> = {
  ready: 'Ready',
  processing: 'Processing',
  failed: 'Failed',
};

export default function StatusBadge({ status }: { status: DocumentStatus }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${statusStyles[status]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {statusLabels[status]}
    </span>
  );
}
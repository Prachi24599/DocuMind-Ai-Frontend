import { MessageSquareText } from 'lucide-react';
import { sampleConversations } from '../mockData';
import { formatDate } from '../../../lib/format';
import { useWorkspace } from '../../../app/WorkspaceContext';

export default function ConversationsPage() {
  const { documents } = useWorkspace();

  return (
    <>
      <div className="page-heading">
        <p className="eyebrow">Your workspace</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-[28px]">Conversations</h1>
        <p className="mt-2 text-sm text-slate-500">Return to a question and the documents behind it.</p>
      </div>

      <div className="mt-7 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5 text-sm text-amber-900" role="note">
        <span className="font-semibold">Sample history.</span> These conversations are examples only; chat and AI responses are not connected yet.
      </div>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6" aria-label="Conversation history">
        <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-semibold text-ink">Recent conversations</h2>
            <p className="mt-1 text-xs text-slate-500">{sampleConversations.length} sample threads</p>
          </div>
        </div>
        <ul className="divide-y divide-slate-100">
          {sampleConversations.map((conversation) => {
            const relatedDocumentNames = conversation.documentIds.map((documentId) => (
              documents.find((document) => document.id === documentId)?.name ?? 'Document unavailable'
            ));

            return (
              <li key={conversation.id} className="flex flex-col gap-3 py-4 first:pt-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-start gap-3.5">
                  <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-violet-50 text-violet-600"><MessageSquareText size={17} aria-hidden="true" /></span>
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-medium text-slate-800">{conversation.title}</h3>
                    <p className="mt-1.5 truncate text-xs text-slate-500">{relatedDocumentNames.join(' · ')}</p>
                  </div>
                </div>
                <time className="pl-[50px] text-xs text-slate-500 sm:pl-0" dateTime={conversation.updatedAt}>Updated {formatDate(conversation.updatedAt)}</time>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
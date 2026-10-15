import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import ConversationsPage from '../features/conversations/pages/ConversationsPage';
import DashboardPage from '../features/dashboard/pages/DashboardPage';
import DocumentsPage from '../features/documents/pages/DocumentsPage';

function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-violet-600">404</p>
      <h1 className="mt-3 text-2xl font-semibold text-ink">Page not found</h1>
      <p className="mt-2 text-sm text-slate-500">That page is not part of this workspace.</p>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route element={<AppShell />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/documents" element={<DocumentsPage />} />
        <Route path="/conversations" element={<ConversationsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
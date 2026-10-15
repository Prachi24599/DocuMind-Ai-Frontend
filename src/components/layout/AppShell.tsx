import { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { BrainCircuit, FileText, Menu, MessageSquareText, X } from 'lucide-react';

const navigation = [
  { label: 'Dashboard', to: '/dashboard', icon: BrainCircuit },
  { label: 'Documents', to: '/documents', icon: FileText },
  { label: 'Conversations', to: '/conversations', icon: MessageSquareText },
];

interface SidebarContentProps {
  onNavigate?: () => void;
  onClose?: () => void;
}

function SidebarContent({ onNavigate, onClose }: SidebarContentProps) {
  return (
    <>
      <div className="flex items-center justify-between px-1">
        <NavLink to="/dashboard" onClick={onNavigate} className="flex items-center gap-3 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-300">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-500 text-white">
            <BrainCircuit size={22} aria-hidden="true" />
          </span>
          <span>
            <span className="block text-[15px] font-semibold tracking-tight">DocuMind</span>
            <span className="mt-0.5 block text-[11px] text-slate-400">AI WORKSPACE</span>
          </span>
        </NavLink>
        {onClose && (
          <button data-drawer-close className="icon-button text-slate-300 lg:hidden" onClick={onClose} aria-label="Close navigation">
            <X size={19} />
          </button>
        )}
      </div>

      <p className="mb-3 mt-11 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Workspace</p>
      <nav className="space-y-1" aria-label="Workspace">
        {navigation.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
          >
            <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-xl border border-white/10 bg-white/[0.04] p-4">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-200">
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          Preview workspace
        </div>
        <p className="mt-2 text-xs leading-5 text-slate-400">Sample data only. Files and conversations are not saved.</p>
      </div>
    </>
  );
}

export default function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false);
  const mobileDrawerRef = useRef<HTMLDialogElement>(null);
  const location = useLocation();

  useEffect(() => setMenuOpen(false), [location.pathname]);

  useEffect(() => {
    const dialog = mobileDrawerRef.current;
    if (!dialog) return;

    if (menuOpen) {
      if (!dialog.open) dialog.showModal();
      dialog.querySelector<HTMLButtonElement>('[data-drawer-close]')?.focus();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [menuOpen]);

  useEffect(() => {
    const desktopViewport = window.matchMedia('(min-width: 1024px)');
    const closeDrawerOnDesktop = () => {
      if (desktopViewport.matches) setMenuOpen(false);
    };
    desktopViewport.addEventListener('change', closeDrawerOnDesktop);
    return () => desktopViewport.removeEventListener('change', closeDrawerOnDesktop);
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f7fa] lg:flex">
      <aside className="hidden w-[264px] shrink-0 flex-col bg-[#19191f] px-5 py-6 text-white lg:flex lg:min-h-screen" aria-label="Main navigation">
        <SidebarContent />
      </aside>

      <dialog
        ref={mobileDrawerRef}
        id="mobile-navigation"
        className="fixed inset-y-0 left-0 z-40 m-0 h-full max-h-none w-[264px] max-w-[calc(100vw-2rem)] border-0 bg-transparent p-0 text-white backdrop:bg-black/40 lg:hidden"
        aria-label="Mobile navigation"
        onCancel={(event) => {
          event.preventDefault();
          setMenuOpen(false);
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) setMenuOpen(false);
        }}
      >
        <aside className="flex h-full w-full flex-col bg-[#19191f] px-5 py-6" aria-label="Main navigation">
          <SidebarContent onNavigate={() => setMenuOpen(false)} onClose={() => setMenuOpen(false)} />
        </aside>
      </dialog>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex h-[68px] items-center justify-between border-b border-slate-200/80 bg-white/95 px-5 backdrop-blur-sm sm:px-8 lg:px-10">
          <button
            className="icon-button -ml-2 lg:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation"
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            <Menu size={20} />
          </button>
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-xs font-semibold text-slate-700">Portfolio preview</p>
              <p className="mt-0.5 text-[11px] text-slate-400">Local sample workspace</p>
            </div>
            <div className="grid h-9 w-9 place-items-center rounded-full bg-violet-100 text-xs font-semibold text-violet-700" aria-label="Portfolio preview profile">DM</div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1440px] px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
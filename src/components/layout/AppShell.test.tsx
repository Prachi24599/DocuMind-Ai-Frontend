import { afterEach, describe, expect, it } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AppShell from './AppShell';

let removeEscapeBridge: (() => void) | undefined;

afterEach(() => {
  removeEscapeBridge?.();
  removeEscapeBridge = undefined;
});

describe('AppShell mobile navigation', () => {
  it('opens with focus in the drawer, handles Escape, and restores trigger focus', async () => {
    const user = userEvent.setup();
    renderAppShell();
    const trigger = screen.getByRole('button', { name: 'Open navigation' });
    installNativeEscapeBridge();

    await user.click(trigger);
    const dialog = screen.getByRole('dialog', { name: 'Mobile navigation' });
    expect(dialog).toHaveAttribute('open');
    expect(within(dialog).getByRole('button', { name: 'Close navigation' })).toHaveFocus();

    await user.tab();
    expect(dialog.contains(document.activeElement)).toBe(true);

    await user.keyboard('{Escape}');
    await waitFor(() => expect(dialog).not.toHaveAttribute('open'));
    expect(trigger).toHaveFocus();
  });

  it('keeps the closed drawer out of the dialog accessibility tree and tab order', async () => {
    const user = userEvent.setup();
    renderAppShell();
    const trigger = screen.getByRole('button', { name: 'Open navigation' });
    const dialog = document.getElementById('mobile-navigation');

    expect(dialog).not.toHaveAttribute('open');
    expect(screen.queryByRole('dialog', { name: 'Mobile navigation' })).not.toBeInTheDocument();
    trigger.focus();
    await user.tab({ shift: true });
    expect(dialog?.contains(document.activeElement)).toBe(false);
  });
});

function renderAppShell() {
  return render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<h1>Dashboard test route</h1>} />
          <Route path="/documents" element={<h1>Documents test route</h1>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

function installNativeEscapeBridge() {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Escape') return;
    const dialog = document.querySelector<HTMLDialogElement>('dialog[open]');
    if (!dialog) return;

    const cancelEvent = new Event('cancel', { bubbles: true, cancelable: true });
    if (dialog.dispatchEvent(cancelEvent)) dialog.close();
  };
  window.addEventListener('keydown', handleKeyDown);
  removeEscapeBridge = () => window.removeEventListener('keydown', handleKeyDown);
}
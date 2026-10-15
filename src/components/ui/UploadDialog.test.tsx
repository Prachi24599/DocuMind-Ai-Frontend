import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import UploadDialog from './UploadDialog';
import { MAX_PDF_SIZE_BYTES } from '../../lib/config';

describe('UploadDialog', () => {
  it('shows a valid selected PDF without enabling upload', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderDialog(onClose);

    const file = new File(['%PDF-1.4 sample'], 'research.pdf', { type: 'application/pdf' });
    await user.upload(screen.getByLabelText(/Choose a PDF from your device/), file);

    expect(screen.getByText('research.pdf')).toBeInTheDocument();
    expect(screen.getByText('1 KB')).toBeInTheDocument();
    expect(screen.getByText(/will not be sent or saved/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Upload unavailable' })).toBeDisabled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('reports invalid file types and files over the configured size limit', async () => {
    const user = userEvent.setup({ applyAccept: false });
    const { rerender } = renderDialog(vi.fn());

    await user.upload(
      screen.getByLabelText(/Choose a PDF from your device/),
      new File(['not a PDF'], 'notes.txt', { type: 'text/plain' }),
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Choose a PDF file to continue.');

    rerender(<UploadDialog open onClose={vi.fn()} />);
    await user.upload(
      screen.getByLabelText(/Choose a PDF from your device/),
      new File([new Uint8Array(MAX_PDF_SIZE_BYTES + 1)], 'oversized.pdf', { type: 'application/pdf' }),
    );
    expect(screen.getByRole('alert')).toHaveTextContent('20 MB limit');
    expect(screen.queryByText('oversized.pdf')).not.toBeInTheDocument();
  });

  it('clears a selected file and resets it after cancelling', async () => {
    const user = userEvent.setup();
    render(<ControlledUploadDialog />);
    const input = screen.getByLabelText(/Choose a PDF from your device/);

    await user.upload(input, new File(['%PDF'], 'draft.pdf', { type: 'application/pdf' }));
    await user.click(screen.getByRole('button', { name: 'Clear selected file' }));
    expect(screen.queryByText('draft.pdf')).not.toBeInTheDocument();

    await user.upload(input, new File(['%PDF'], 'draft.pdf', { type: 'application/pdf' }));
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByRole('dialog', { name: 'Add a PDF' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Open upload dialog' }));
    expect(screen.queryByText('draft.pdf')).not.toBeInTheDocument();
  });
});

function renderDialog(onClose: () => void) {
  return render(<UploadDialog open onClose={onClose} />);
}

function ControlledUploadDialog() {
  const [open, setOpen] = useState(true);
  return (
    <>
      <button onClick={() => setOpen(true)}>Open upload dialog</button>
      <UploadDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import DocumentsPage from '../pages/DocumentsPage';
import { renderWithWorkspace } from '../../../test/renderWithWorkspace';

describe('DocumentList on DocumentsPage', () => {
  it('exposes an accessible table and removal updates the visible list', async () => {
    const user = userEvent.setup();
    renderWithWorkspace(<DocumentsPage />);

    const table = screen.getByRole('table', { name: /Documents with their file size/ });
    expect(within(table).getByRole('columnheader', { name: 'Document' })).toBeInTheDocument();
    expect(within(table).getByRole('columnheader', { name: 'File size' })).toBeInTheDocument();
    expect(within(table).getByRole('columnheader', { name: 'Uploaded' })).toBeInTheDocument();
    expect(within(table).getByRole('columnheader', { name: 'Status' })).toBeInTheDocument();

    const documentRow = within(table).getByRole('row', { name: /Q3_Product_Strategy\.pdf/ });
    await user.click(within(documentRow).getByRole('button', { name: 'Remove Q3_Product_Strategy.pdf from this session' }));
    expect(screen.queryByRole('row', { name: /Q3_Product_Strategy\.pdf/ })).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent(/removed from this session/);
  });

  it('clears search and status filters when no documents match', async () => {
    const user = userEvent.setup();
    renderWithWorkspace(<DocumentsPage />);

    await user.type(screen.getByRole('searchbox', { name: 'Search documents' }), 'no-such-document');
    const statusFilter = screen.getByRole('combobox', { name: 'Status' });
    await user.selectOptions(statusFilter, 'failed');
    expect(screen.getByRole('heading', { name: 'No matching documents' })).toBeInTheDocument();
    expect(screen.getByText(/No files match your current search and status filters/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Clear search and filters' }));
    expect(statusFilter).toHaveValue('all');
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByRole('row', { name: /Q3_Product_Strategy\.pdf/ })).toBeInTheDocument();
  });

  it('shows an upload action instead of filter guidance when the library is empty', async () => {
    const user = userEvent.setup();
    renderWithWorkspace(<DocumentsPage />);

    let removeButtons = screen.queryAllByRole('button', { name: /^Remove .* from this session$/ });
    while (removeButtons.length > 0) {
      await user.click(removeButtons[0]);
      removeButtons = screen.queryAllByRole('button', { name: /^Remove .* from this session$/ });
    }

    expect(screen.getByRole('heading', { name: 'Your library is empty' })).toBeInTheDocument();
    expect(screen.queryByText(/Try another search or status filter/)).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Choose a PDF' }));
    expect(screen.getByRole('dialog', { name: 'Add a PDF' })).toBeInTheDocument();
  });
});
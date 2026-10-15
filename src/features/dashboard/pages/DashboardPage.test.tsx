import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import DashboardPage from './DashboardPage';
import { renderWithWorkspace } from '../../../test/renderWithWorkspace';
import { sampleDocuments } from '../../documents/mockData';

describe('DashboardPage', () => {
  it('derives summary counts from the sample documents', () => {
    renderWithWorkspace(<DashboardPage />);
    const summary = screen.getByRole('region', { name: 'Document summary' });
    const total = screen.getByText('Total documents', { selector: 'p' }).parentElement;
    const ready = screen.getByText('Ready to explore', { selector: 'p' }).parentElement;
    const processing = screen.getByText('Processing', { selector: 'p' }).parentElement;

    expect(total).toHaveTextContent(String(sampleDocuments.length));
    expect(ready).toHaveTextContent(String(sampleDocuments.filter((document) => document.status === 'ready').length));
    expect(processing).toHaveTextContent(String(sampleDocuments.filter((document) => document.status === 'processing').length));
    expect(summary).toBeInTheDocument();
  });

  it('filters recent documents by search text and status', async () => {
    const user = userEvent.setup();
    renderWithWorkspace(<DashboardPage />);

    const search = screen.getByRole('searchbox', { name: 'Search documents' });
    const status = screen.getByRole('combobox', { name: 'Status' });
    await user.type(search, 'Customer');
    expect(screen.getByRole('row', { name: /Customer_Interview_Notes\.pdf/ })).toBeInTheDocument();
    expect(screen.queryByRole('row', { name: /Engineering_Handbook\.pdf/ })).not.toBeInTheDocument();

    await user.clear(search);
    await user.selectOptions(status, 'processing');
    expect(screen.getByRole('row', { name: /Engineering_Handbook\.pdf/ })).toBeInTheDocument();
    expect(screen.queryByRole('row', { name: /Customer_Interview_Notes\.pdf/ })).not.toBeInTheDocument();
  });

  it('shows the empty-library action after all sample documents are removed', async () => {
    const user = userEvent.setup();
    renderWithWorkspace(<DashboardPage />);

    let removeButtons = screen.queryAllByRole('button', { name: /^Remove .* from this session$/ });
    while (removeButtons.length > 0) {
      await user.click(removeButtons[0]);
      removeButtons = screen.queryAllByRole('button', { name: /^Remove .* from this session$/ });
    }

    expect(screen.getByRole('heading', { name: 'Your library is empty' })).toBeInTheDocument();
    expect(screen.getByText('Total documents').parentElement).toHaveTextContent('0');
    await user.click(screen.getByRole('button', { name: 'Choose a PDF' }));
    expect(screen.getByRole('dialog', { name: 'Add a PDF' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Upload unavailable' })).toBeDisabled();
  });
});
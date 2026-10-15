import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import ConversationsPage from './ConversationsPage';
import { useWorkspace } from '../../../app/WorkspaceContext';
import { renderWithWorkspace } from '../../../test/renderWithWorkspace';

describe('ConversationsPage', () => {
  it('resolves associated document names from shared document data', () => {
    renderWithWorkspace(<ConversationsPage />);

    expect(screen.getByText('Q3_Product_Strategy.pdf')).toBeInTheDocument();
    expect(screen.getByText('Platform_Migration_Plan.pdf · Engineering_Handbook.pdf')).toBeInTheDocument();
  });

  it('shows a fallback when a referenced document is removed', async () => {
    const user = userEvent.setup();
    renderWithWorkspace(<ConversationsWithRemoval />);

    await user.click(screen.getByRole('button', { name: 'Remove linked sample document' }));
    expect(screen.getByText('Document unavailable')).toBeInTheDocument();
  });
});

function ConversationsWithRemoval() {
  const { removeDocument } = useWorkspace();
  return (
    <>
      <button onClick={() => removeDocument('doc-01')}>Remove linked sample document</button>
      <ConversationsPage />
    </>
  );
}
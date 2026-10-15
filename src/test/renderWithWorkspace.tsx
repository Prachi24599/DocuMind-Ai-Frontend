import type { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { WorkspaceProvider } from '../app/WorkspaceContext';

export function renderWithWorkspace(ui: ReactElement) {
  return render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <WorkspaceProvider>{ui}</WorkspaceProvider>
    </MemoryRouter>,
  );
}
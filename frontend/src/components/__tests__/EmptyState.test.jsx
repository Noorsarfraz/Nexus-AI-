import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmptyState } from '../EmptyState';

describe('EmptyState', () => {
  it('renders the empty-state heading and description', () => {
    render(<EmptyState onAction={() => {}} />);

    expect(screen.getByText(/No Active Server Nodes Deployed/i)).toBeInTheDocument();
    expect(screen.getByText(/Deploy your first cluster node/i)).toBeInTheDocument();
  });

  it('calls onAction when "Deploy First Node Now" is clicked', async () => {
    const onAction = vi.fn();
    const user = userEvent.setup();

    render(<EmptyState onAction={onAction} />);
    await user.click(screen.getByRole('button', { name: /deploy first node now/i }));

    expect(onAction).toHaveBeenCalledTimes(1);
  });
});

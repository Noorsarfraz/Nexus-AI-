import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '../Button';

describe('Button', () => {
  it('renders its label text', () => {
    render(<Button>Deploy Node</Button>);

    expect(screen.getByRole('button', { name: /deploy node/i })).toBeInTheDocument();
  });

  it('applies the secondary variant class when requested', () => {
    render(<Button variant="secondary">Cancel</Button>);

    const button = screen.getByRole('button', { name: /cancel/i });
    expect(button.className).toMatch(/bg-slate-900/);
  });

  it('calls onClick exactly once when clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click me</Button>);
    await user.click(screen.getByRole('button', { name: /click me/i }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

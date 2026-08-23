import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import SignupPage from '../SignupPage';

describe('SignupPage', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the email field, password field, and submit button', () => {
    render(
      <MemoryRouter>
        <SignupPage />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText(/user@nexus\.ai/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /signup/i })).toBeInTheDocument();
  });

  it('shows a success message after a successful signup', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'User registered successfully' }),
    });

    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <SignupPage />
      </MemoryRouter>
    );

    await user.type(screen.getByPlaceholderText(/user@nexus\.ai/i), 'new-user@nexus.ai');
    await user.type(screen.getByPlaceholderText('••••••••'), 'Password123!');
    await user.click(screen.getByRole('button', { name: /signup/i }));

    expect(
      await screen.findByText(/Account created successfully/i)
    ).toBeInTheDocument();
  });

  it('shows the backend error message when signup fails (e.g. duplicate email)', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'User already exists with this email' }),
    });

    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <SignupPage />
      </MemoryRouter>
    );

    await user.type(screen.getByPlaceholderText(/user@nexus\.ai/i), 'dup@nexus.ai');
    await user.type(screen.getByPlaceholderText('••••••••'), 'Password123!');
    await user.click(screen.getByRole('button', { name: /signup/i }));

    await waitFor(() => {
      expect(screen.getByText(/User already exists with this email/i)).toBeInTheDocument();
    });
  });
});

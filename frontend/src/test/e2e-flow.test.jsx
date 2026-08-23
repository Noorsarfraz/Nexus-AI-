/**
 * End-to-end style user flow test
 * -------------------------------------------------------------------------
 * Flow covered: Login -> Dashboard loads -> Create an AI node -> node
 * appears in the list.
 *
 * This runs the REAL LoginPage, DashboardPage, and Zustand store logic
 * together inside React Testing Library + a MemoryRouter, with only the
 * network layer (global.fetch) mocked — the same pattern Playwright/Cypress
 * would use with request interception, but self-contained so it runs in CI
 * without needing live frontend/backend servers or a real database.
 *
 * A true browser-level Cypress E2E spec (hitting the real running app) is
 * also included at frontend/cypress/e2e/user-flow.cy.js — see README
 * "Testing" section for how to run that one against live dev servers.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import { safeLocalStorage, safeSessionStorage } from '../utils/safeStorage';
import { useNexusStore } from '../store/nexusStore';

function renderApp() {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('E2E flow: login -> create node -> see it appear', () => {
  beforeEach(() => {
    safeSessionStorage.clear();
    safeLocalStorage.clear();
    useNexusStore.setState({
      token: null,
      isAuthenticated: false,
      nodes: [],
      isLoading: false,
    });

    // Fake backend: mirrors the real /api/login, GET /api/nodes and
    // POST /api/nodes contracts closely enough to drive the real store.
    global.fetch = vi.fn((url, options = {}) => {
      const method = options.method || 'GET';

      if (url.endsWith('/login') && method === 'POST') {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            message: 'Login successful',
            token: 'fake-jwt-token',
            plan: 'Developer',
          }),
        });
      }

      if (url.endsWith('/uploads') && method === 'GET') {
        return Promise.resolve({ ok: true, json: async () => [] });
      }

      if (url.endsWith('/nodes') && method === 'GET') {
        return Promise.resolve({
          ok: true,
          json: async () => useNexusStore.getState().nodes,
        });
      }

      if (url.endsWith('/nodes') && method === 'POST') {
        const body = JSON.parse(options.body);
        const created = {
          _id: 'e2e-node-1',
          title: body.title,
          status: body.status || 'Active',
          userEmail: 'e2e@nexus.ai',
        };
        useNexusStore.setState((state) => ({ nodes: [...state.nodes, created] }));
        return Promise.resolve({ ok: true, status: 201, json: async () => created });
      }

      return Promise.resolve({ ok: true, json: async () => ({}) });
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('logs the user in, creates a node, and shows it in the dashboard list', async () => {
    const user = userEvent.setup();
    renderApp();

    // ---------------- STEP 1: LOGIN ----------------
    await user.type(screen.getByPlaceholderText(/user@nexus\.ai/i), 'e2e@nexus.ai');
    await user.type(screen.getByPlaceholderText('••••••••'), 'Password123!');
    await user.click(screen.getByRole('button', { name: /^login$/i }));

    // ---------------- STEP 2: DASHBOARD LOADS ----------------
    await waitFor(() => {
      expect(screen.getByText(/Live AI Server Nodes Monitor/i)).toBeInTheDocument();
    });
    expect(useNexusStore.getState().isAuthenticated).toBe(true);

    // ---------------- STEP 3: CREATE A NODE ----------------
    const nodeInput = screen.getByPlaceholderText(/Enter AI Node designation/i);
    await user.type(nodeInput, 'E2E Test Node{enter}');

    // ---------------- STEP 4: NODE APPEARS IN THE LIST ----------------
    await waitFor(() => {
      expect(screen.getByText('E2E Test Node')).toBeInTheDocument();
    });
  });
});
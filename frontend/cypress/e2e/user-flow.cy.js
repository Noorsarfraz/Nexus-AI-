/**
 * Real browser E2E test (Cypress)
 * -------------------------------------------------------------------------
 * Exercises the actual running app end-to-end: signup -> login ->
 * deploy an AI node -> see it appear on the dashboard.
 *
 * Requires BOTH dev servers running against a real (or disposable test)
 * MongoDB before this spec is run:
 *   Terminal 1: cd backend  && npm start     (http://localhost:5001)
 *   Terminal 2: cd frontend && npm run dev   (http://localhost:5173)
 *
 * Run with:
 *   cd frontend && npx cypress open   (interactive)
 *   cd frontend && npx cypress run    (headless)
 */

describe('User flow: signup -> login -> deploy node -> see it appear', () => {
  const email = `cypress-${Date.now()}@nexus.ai`;
  const password = 'Password123!';

  it('creates an account, logs in, deploys a node, and sees it on the dashboard', () => {
    // ---------------- SIGNUP ----------------
    cy.visit('/signup');
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(password);
    cy.contains('button', 'Signup').click();
    cy.contains(/Account created successfully/i, { timeout: 10000 }).should('be.visible');

    // ---------------- LOGIN (auto-redirected here after signup) ----------------
    cy.location('pathname', { timeout: 10000 }).should('eq', '/login');
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(password);
    cy.contains('button', 'Login').click();

    // ---------------- DASHBOARD ----------------
    cy.location('pathname', { timeout: 10000 }).should('eq', '/dashboard');
    cy.contains('Live AI Server Nodes Monitor').should('be.visible');

    // ---------------- CREATE A NODE (quick-add form) ----------------
    const nodeName = `Cypress Node ${Date.now()}`;
    cy.get('input[placeholder*="Enter AI Node designation"]').type(`${nodeName}{enter}`);

    // ---------------- NODE APPEARS IN THE LIST ----------------
    cy.contains(nodeName, { timeout: 10000 }).should('be.visible');
  });
});

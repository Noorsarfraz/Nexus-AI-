import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import DeployNodeForm from '../DeployNodeForm';

function renderForm() {
  return render(
    <MemoryRouter>
      <DeployNodeForm />
    </MemoryRouter>
  );
}

describe('DeployNodeForm', () => {
  it('renders the deployment form with its required fields', () => {
    renderForm();

    expect(screen.getByText(/Deploy New AI Cluster Node/i)).toBeInTheDocument();
    expect(screen.getByText(/Node Designation Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Cluster Access Key/i)).toBeInTheDocument();
  });

  it('shows all validation errors when submitting a completely empty form', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole('button', { name: /execute secure deployment/i }));

    expect(
      await screen.findByText(/Node designation name is required\./i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Please select a valid scheduled deployment date\./i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Secure API access key must be at least 8 characters\./i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/A configuration setup file \(\.json or \.yaml\) is required\./i)
    ).toBeInTheDocument();
  });

  it('rejects a node name shorter than 3 characters', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(
      screen.getByPlaceholderText(/node-cluster-us-west-01/i),
      'ab'
    );
    await user.click(screen.getByRole('button', { name: /execute secure deployment/i }));

    expect(
      await screen.findByText(/must be at least 3 characters long/i)
    ).toBeInTheDocument();
  });

  it('clears the node-name error once a valid name is entered', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole('button', { name: /execute secure deployment/i }));
    expect(
      await screen.findByText(/Node designation name is required\./i)
    ).toBeInTheDocument();

    await user.type(
      screen.getByPlaceholderText(/node-cluster-us-west-01/i),
      'node-cluster-01'
    );

    expect(
      screen.queryByText(/Node designation name is required\./i)
    ).not.toBeInTheDocument();
  });
});

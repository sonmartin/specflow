import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatusBadge from './StatusBadge';

describe('StatusBadge', () => {
  it('renders the status text', () => {
    render(<StatusBadge status="Draft" />);
    expect(screen.getByText('Draft')).toBeInTheDocument();
  });

  it('applies gray classes for Draft status', () => {
    render(<StatusBadge status="Draft" />);
    const badge = screen.getByText('Draft');
    expect(badge).toHaveClass('bg-gray-200', 'text-gray-800');
  });

  it('applies yellow classes for In Progress status', () => {
    render(<StatusBadge status="In Progress" />);
    const badge = screen.getByText('In Progress');
    expect(badge).toHaveClass('bg-yellow-200', 'text-yellow-800');
  });

  it('applies green classes for Completed status', () => {
    render(<StatusBadge status="Completed" />);
    const badge = screen.getByText('Completed');
    expect(badge).toHaveClass('bg-green-200', 'text-green-800');
  });

  it('applies default gray classes for unknown status', () => {
    render(<StatusBadge status="Unknown" />);
    const badge = screen.getByText('Unknown');
    expect(badge).toHaveClass('bg-gray-200', 'text-gray-800');
  });
});


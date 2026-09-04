import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskList from '../src/components/TaskList';

describe('TaskList Component', () => {
  const mockTasks = [
    {
      id: 1,
      title: 'Design Database Schema',
      description: 'Create PostgreSQL tables',
      status: 'done',
      priority: 'high',
      due_date: '2026-09-10',
    },
    {
      id: 2,
      title: 'Build Express Backend',
      description: 'Implement API routes',
      status: 'in_progress',
      priority: 'medium',
      due_date: null,
    },
  ];

  it('renders a list of mock tasks correctly', () => {
    render(<TaskList tasks={mockTasks} onEdit={jest.fn()} onDelete={jest.fn()} />);

    expect(screen.getByText('Design Database Schema')).toBeInTheDocument();
    expect(screen.getByText('Build Express Backend')).toBeInTheDocument();
    expect(screen.getByText('Create PostgreSQL tables')).toBeInTheDocument();
  });

  it('calls onDelete with task id when delete button is clicked', () => {
    const handleDelete = jest.fn();
    render(<TaskList tasks={mockTasks} onEdit={jest.fn()} onDelete={handleDelete} />);

    const deleteButton = screen.getByTestId('delete-button-1');
    fireEvent.click(deleteButton);

    expect(handleDelete).toHaveBeenCalledTimes(1);
    expect(handleDelete).toHaveBeenCalledWith(1);
  });
});

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskForm from '../src/components/TaskForm';

describe('TaskForm Component', () => {
  it('shows validation error if title is empty on submit', () => {
    const handleSubmit = jest.fn();
    render(<TaskForm onSubmit={handleSubmit} />);

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    expect(screen.getByTestId('form-error')).toHaveTextContent('Title is required');
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('submits with correct values when title and fields are filled', () => {
    const handleSubmit = jest.fn();
    render(<TaskForm onSubmit={handleSubmit} />);

    const titleInput = screen.getByLabelText(/Title \*/i);
    const descInput = screen.getByLabelText(/Description/i);
    const statusSelect = screen.getByLabelText(/Status/i);
    const prioritySelect = screen.getByLabelText(/Priority/i);
    const dueDateInput = screen.getByLabelText(/Due Date/i);
    const submitButton = screen.getByTestId('submit-button');

    fireEvent.change(titleInput, { target: { value: 'Buy Groceries' } });
    fireEvent.change(descInput, { target: { value: 'Milk, Eggs, Bread' } });
    fireEvent.change(statusSelect, { target: { value: 'in_progress' } });
    fireEvent.change(prioritySelect, { target: { value: 'high' } });
    fireEvent.change(dueDateInput, { target: { value: '2026-10-15' } });

    fireEvent.click(submitButton);

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith({
      title: 'Buy Groceries',
      description: 'Milk, Eggs, Bread',
      status: 'in_progress',
      priority: 'high',
      due_date: '2026-10-15',
    });
  });
});

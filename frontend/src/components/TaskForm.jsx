import React, { useState, useEffect } from 'react';

const TaskForm = ({ onSubmit, initialData = null, onCancel = null }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setStatus(initialData.status || 'todo');
      setPriority(initialData.priority || 'medium');
      // Format date if needed (YYYY-MM-DD)
      const formattedDate = initialData.due_date
        ? new Date(initialData.due_date).toISOString().split('T')[0]
        : '';
      setDueDate(formattedDate);
    } else {
      resetForm();
    }
  }, [initialData]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStatus('todo');
    setPriority('medium');
    setDueDate('');
    setErrorMessage('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage('Title is required');
      return;
    }

    setErrorMessage('');
    onSubmit({
      title: title.trim(),
      description,
      status,
      priority,
      due_date: dueDate || null,
    });

    if (!initialData) {
      resetForm();
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit} data-testid="task-form">
      <h3>{initialData ? 'Edit Task' : 'Create New Task'}</h3>
      
      {errorMessage && (
        <div className="form-error" data-testid="form-error" role="alert">
          {errorMessage}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="title-input">Title *</label>
        <input
          id="title-input"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (e.target.value.trim()) setErrorMessage('');
          }}
          placeholder="Task title"
        />
      </div>

      <div className="form-group">
        <label htmlFor="desc-input">Description</label>
        <textarea
          id="desc-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task description (optional)"
          rows="3"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="status-select">Status</label>
          <select
            id="status-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="priority-select">Priority</label>
          <select
            id="priority-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="due-date-input">Due Date</label>
          <input
            id="due-date-input"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" data-testid="submit-button">
          {initialData ? 'Update Task' : 'Add Task'}
        </button>
        {initialData && onCancel && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            data-testid="cancel-button"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;

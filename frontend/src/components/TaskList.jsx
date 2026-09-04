import React from 'react';

const TaskList = ({ tasks = [], onEdit, onDelete, filterStatus = 'all', onFilterChange }) => {
  const filteredTasks = tasks.filter((task) => {
    if (filterStatus === 'all') return true;
    return task.status === filterStatus;
  });

  const getStatusLabel = (status) => {
    switch (status) {
      case 'todo':
        return 'To Do';
      case 'in_progress':
        return 'In Progress';
      case 'done':
        return 'Done';
      default:
        return status;
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  return (
    <div className="task-list-container" data-testid="task-list-container">
      <div className="task-list-header">
        <h2>Tasks</h2>
        <div className="filter-controls" data-testid="filter-controls">
          <label htmlFor="filter-select">Filter by Status:</label>
          <select
            id="filter-select"
            value={filterStatus}
            onChange={(e) => onFilterChange && onFilterChange(e.target.value)}
            data-testid="filter-select"
          >
            <option value="all">All Tasks</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="empty-state" data-testid="empty-state">
          <p>No tasks found.</p>
        </div>
      ) : (
        <div className="task-cards-grid" data-testid="task-list">
          {filteredTasks.map((task) => (
            <div key={task.id} className={`task-card status-${task.status}`} data-testid={`task-item-${task.id}`}>
              <div className="task-card-header">
                <h3 className="task-title" data-testid="task-title">{task.title}</h3>
                <span className={`badge badge-priority priority-${task.priority}`}>
                  {task.priority}
                </span>
              </div>

              {task.description && (
                <p className="task-description" data-testid="task-description">{task.description}</p>
              )}

              <div className="task-meta">
                <span className={`badge badge-status status-${task.status}`} data-testid="task-status-badge">
                  {getStatusLabel(task.status)}
                </span>
                {task.due_date && (
                  <span className="due-date">Due: {formatDate(task.due_date)}</span>
                )}
              </div>

              <div className="task-actions">
                <button
                  type="button"
                  className="btn btn-sm btn-outline"
                  onClick={() => onEdit && onEdit(task)}
                  data-testid={`edit-button-${task.id}`}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() => onDelete && onDelete(task.id)}
                  data-testid={`delete-button-${task.id}`}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;

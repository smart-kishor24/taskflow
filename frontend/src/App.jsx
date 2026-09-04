import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import './App.css';

const API_BASE_URL = 'https://taskflow-3vgm.onrender.com';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_BASE_URL}/tasks`);
      setTasks(response.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to fetch tasks. Please check your backend connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (taskData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/tasks`, taskData);
      setTasks((prevTasks) => [response.data, ...prevTasks]);
    } catch (err) {
      console.error('Error creating task:', err);
      setError('Failed to create task.');
    }
  };

  const handleUpdateTask = async (taskData) => {
    if (!editingTask) return;
    try {
      const response = await axios.put(`${API_BASE_URL}/tasks/${editingTask.id}`, taskData);
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === editingTask.id ? response.data : t))
      );
      setEditingTask(null);
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task.');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/tasks/${id}`);
      setTasks((prevTasks) => prevTasks.filter((t) => t.id !== id));
      if (editingTask && editingTask.id === id) {
        setEditingTask(null);
      }
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task.');
    }
  };

  return (
    <div className="app-container" data-testid="app-container">
      <header className="app-header">
        <h1 className="app-title">TaskFlow</h1>
        <p className="app-subtitle">Organize and track your tasks effortlessly</p>
      </header>

      {error && (
        <div className="alert-error" role="alert" data-testid="app-error">
          {error}
        </div>
      )}

      <main className="app-content">
        <aside className="form-section">
          <TaskForm
            onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
            initialData={editingTask}
            onCancel={() => setEditingTask(null)}
          />
        </aside>

        <section className="list-section">
          {loading ? (
            <div className="loading-spinner" data-testid="loading-state">
              Loading tasks...
            </div>
          ) : (
            <TaskList
              tasks={tasks}
              onEdit={(task) => setEditingTask(task)}
              onDelete={handleDeleteTask}
              filterStatus={filterStatus}
              onFilterChange={setFilterStatus}
            />
          )}
        </section>
      </main>
    </div>
  );
}

export default App;

const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /tasks - List all tasks (support optional ?status= filter)
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    let queryText = 'SELECT * FROM tasks ORDER BY id DESC';
    let queryParams = [];

    if (status) {
      queryText = 'SELECT * FROM tasks WHERE status = $1 ORDER BY id DESC';
      queryParams = [status];
    }

    const result = await pool.query(queryText, queryParams);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /tasks - Create a new task (validates title is required)
router.post('/', async (req, res) => {
  try {
    const { title, description, status, priority, due_date } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }

    const taskStatus = status || 'todo';
    const taskPriority = priority || 'medium';
    const taskDueDate = due_date || null;
    const taskDescription = description || null;

    const queryText = `
      INSERT INTO tasks (title, description, status, priority, due_date)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const queryParams = [title.trim(), taskDescription, taskStatus, taskPriority, taskDueDate];

    const result = await pool.query(queryText, queryParams);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /tasks/:id - Update task by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, due_date } = req.body;

    // Check if task exists
    const checkResult = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const existing = checkResult.rows[0];

    const updatedTitle = title !== undefined ? title : existing.title;
    const updatedDescription = description !== undefined ? description : existing.description;
    const updatedStatus = status !== undefined ? status : existing.status;
    const updatedPriority = priority !== undefined ? priority : existing.priority;
    const updatedDueDate = due_date !== undefined ? due_date : existing.due_date;

    if (title !== undefined && (!title || typeof title !== 'string' || title.trim() === '')) {
      return res.status(400).json({ error: 'Title cannot be empty' });
    }

    const queryText = `
      UPDATE tasks
      SET title = $1, description = $2, status = $3, priority = $4, due_date = $5
      WHERE id = $6
      RETURNING *
    `;
    const queryParams = [
      typeof updatedTitle === 'string' ? updatedTitle.trim() : updatedTitle,
      updatedDescription,
      updatedStatus,
      updatedPriority,
      updatedDueDate,
      id,
    ];

    const result = await pool.query(queryText, queryParams);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /tasks/:id - Delete task by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully', task: result.rows[0] });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

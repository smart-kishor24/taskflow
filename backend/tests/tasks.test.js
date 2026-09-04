const request = require('supertest');
const app = require('../src/app');
const pool = require('../src/db');

jest.mock('../src/db', () => ({
  query: jest.fn(),
}));

describe('Task API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /tasks', () => {
    it('should successfully create a new task', async () => {
      const newTask = {
        title: 'Test Task',
        description: 'Test Description',
        status: 'todo',
        priority: 'high',
        due_date: '2026-12-31',
      };

      pool.query.mockResolvedValueOnce({
        rows: [{ id: 1, ...newTask, created_at: new Date().toISOString() }],
      });

      const response = await request(app)
        .post('/tasks')
        .send(newTask);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id', 1);
      expect(response.body.title).toBe('Test Task');
      expect(pool.query).toHaveBeenCalledTimes(1);
    });

    it('should return 400 validation error if title is missing', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({ description: 'No title task' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Title is required');
      expect(pool.query).not.toHaveBeenCalled();
    });

    it('should return 400 validation error if title is empty string', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({ title: '   ' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Title is required');
    });
  });

  describe('GET /tasks', () => {
    it('should successfully list all tasks', async () => {
      const mockTasks = [
        { id: 1, title: 'Task 1', status: 'todo' },
        { id: 2, title: 'Task 2', status: 'done' },
      ];

      pool.query.mockResolvedValueOnce({ rows: mockTasks });

      const response = await request(app).get('/tasks');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(pool.query).toHaveBeenCalledWith(
        'SELECT * FROM tasks ORDER BY id DESC',
        []
      );
    });

    it('should filter tasks by status when ?status query param is provided', async () => {
      const mockFilteredTasks = [{ id: 1, title: 'Task 1', status: 'todo' }];

      pool.query.mockResolvedValueOnce({ rows: mockFilteredTasks });

      const response = await request(app).get('/tasks?status=todo');

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(pool.query).toHaveBeenCalledWith(
        'SELECT * FROM tasks WHERE status = $1 ORDER BY id DESC',
        ['todo']
      );
    });
  });

  describe('PUT /tasks/:id', () => {
    it('should successfully update a task', async () => {
      const existingTask = {
        id: 1,
        title: 'Old Title',
        description: 'Old Desc',
        status: 'todo',
        priority: 'medium',
        due_date: null,
      };

      const updatedTask = {
        id: 1,
        title: 'New Title',
        description: 'Updated Desc',
        status: 'in_progress',
        priority: 'high',
        due_date: '2026-10-01',
      };

      pool.query
        .mockResolvedValueOnce({ rows: [existingTask] })
        .mockResolvedValueOnce({ rows: [updatedTask] });

      const response = await request(app)
        .put('/tasks/1')
        .send({
          title: 'New Title',
          description: 'Updated Desc',
          status: 'in_progress',
          priority: 'high',
          due_date: '2026-10-01',
        });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('New Title');
      expect(response.body.status).toBe('in_progress');
    });

    it('should return 404 if updating non-existent task', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .put('/tasks/999')
        .send({ title: 'New Title' });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Task not found');
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('should successfully delete a task', async () => {
      const deletedTask = { id: 1, title: 'Task to Delete' };

      pool.query.mockResolvedValueOnce({ rows: [deletedTask] });

      const response = await request(app).delete('/tasks/1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Task deleted successfully');
      expect(response.body.task.id).toBe(1);
    });

    it('should return 404 error when deleting a non-existent id', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] });

      const response = await request(app).delete('/tasks/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Task not found');
    });
  });
});

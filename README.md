# TaskFlow - Full-Stack Task Tracker

TaskFlow is a modern, responsive full-stack task management application designed to help users track, organize, and manage daily tasks efficiently.

---

## Tech Stack

- **Frontend**: React (Vite), Axios, Plain CSS
- **Backend**: Node.js, Express.js, PostgreSQL client (`pg`), CORS, dotenv
- **Database**: PostgreSQL
- **Backend Testing**: Jest + Supertest (Integration tests)
- **Frontend Testing**: Jest + React Testing Library (Component unit/integration tests)
- **E2E Testing**: Playwright (Full end-to-end browser lifecycle testing)

---

## Folder Structure

```
taskflow/
├── backend/
│   ├── src/
│   │   ├── routes/tasks.js
│   │   ├── db.js
│   │   ├── app.js
│   │   └── server.js
│   ├── tests/tasks.test.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/TaskForm.jsx
│   │   ├── components/TaskList.jsx
│   │   ├── App.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── tests/
│   │   ├── TaskForm.test.jsx
│   │   └── TaskList.test.jsx
│   ├── package.json
│   ├── index.html
│   └── vite.config.js
├── e2e/
│   └── tasks.spec.js
├── playwright.config.js
└── README.md
```

---

## Database Setup (PostgreSQL)

1. Ensure PostgreSQL is installed and running on your system.
2. Create a PostgreSQL database named `taskflow`:
   ```sql
   CREATE DATABASE taskflow;
   ```
3. Connect to the `taskflow` database and execute the table schema SQL script:
   ```sql
   CREATE TABLE tasks (
     id SERIAL PRIMARY KEY,
     title VARCHAR(255) NOT NULL,
     description TEXT,
     status VARCHAR(20) DEFAULT 'todo',
     priority VARCHAR(10) DEFAULT 'medium',
     due_date DATE,
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

---

## Environment Configuration

1. In `backend/`, copy `.env.example` to `.env`:
   ```bash
   cp backend/.env.example backend/.env
   ```
2. Update `.env` credentials with your local PostgreSQL database credentials:
   ```env
   PGHOST=localhost
   PGUSER=postgres
   PGPASSWORD=your_password
   PGDATABASE=taskflow
   PGPORT=5432
   PORT=5000
   ```

---

## Running Locally

### 1. Start the Backend API
```bash
cd backend
npm install
npm run dev
```
The API server will run at `http://localhost:5000`.

### 2. Start the Frontend Application
In a new terminal:
```bash
cd frontend
npm install
npm run dev
```
The React Vite frontend will run at `http://localhost:3000`.

---

## Running Test Suites

### 1. Backend Integration Tests (Jest + Supertest)
```bash
cd backend
npm test
```
Runs integration tests for REST API endpoints (`GET /tasks`, `POST /tasks`, `PUT /tasks/:id`, `DELETE /tasks/:id`), including error handling and status filtering.

### 2. Frontend Component Unit Tests (Jest + React Testing Library)
```bash
cd frontend
npm test
```
Runs unit/component tests verifying:
- `TaskForm`: Submits correct form payload when valid and displays validation error when `title` is missing.
- `TaskList`: Renders mock task cards with correct status/priority badges and triggers `onDelete` callback.

### 3. End-to-End Tests (Playwright)
```bash
npm install -D @playwright/test
npx playwright test
```
Or run in headful interactive mode:
```bash
npx playwright test --headed
```
Automates complete user workflow:
1. Loads the React application at `http://localhost:3000`
2. Creates a new task via `TaskForm`
3. Asserts the new task appears in `TaskList`
4. Edits the task status to `in_progress`
5. Asserts the status badge change is updated
6. Deletes the task
7. Asserts the task is removed from the list

---

## Testing Approach

The TaskFlow application follows a balanced testing pyramid:

- **Frontend Unit & Component Testing (Jest + React Testing Library)**:
  Focuses on individual component behavior, accessibility attributes, user interactions, and state validation without requiring backend connectivity.

- **Backend Integration Testing (Jest + Supertest)**:
  Tests Express middleware, routing logic, validation, response statuses, and database interface queries. Database calls are cleanly mocked during automated runs to guarantee fast, deterministic execution across all CI environments.

- **End-to-End Testing (Playwright)**:
  Simulates genuine user interactions across the full web app lifecycle in a real Chromium browser, validating full system integration from UI controls to API network traffic.

### AI-Assisted Test Generation & Review
AI-assisted test generation was utilized to rapidly scaffold edge case coverage, including validation handling for blank string inputs, optional field parsing, and non-existent record lookups (404 handling). All AI-generated specs were manually reviewed and validated to guarantee clean assertions, semantic test selectors, and zero false positives.

# Quickstart Guide - Todo Full-Stack Multi-User Web Application

This guide will help you quickly set up and run the Todo application with Next.js frontend and FastAPI backend.

## Prerequisites

- Node.js 18+
- Python 3.11+
- Docker and Docker Compose (optional, for containerized deployment)
- A Neon PostgreSQL account (for database)

## Setup Instructions

### 1. Clone and Navigate to Project

```bash
git clone <your-repo-url>
cd TodoAPP
```

### 2. Set up Environment Variables

Create `.env` file in the `backend/` directory:

```env
DATABASE_URL="your_neon_postgres_connection_string"
BETTER_AUTH_SECRET="your_unique_secret_key_here"
JWT_ALGORITHM="HS256"
JWT_EXPIRE_DAYS=7
```

Create `.env.local` file in the `frontend/` directory:

```env
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:8000"
BETTER_AUTH_SECRET="your_unique_secret_key_here"
```

> **Note**: The `BETTER_AUTH_SECRET` must be identical in both files.

### 3. Install Dependencies

#### Backend (FastAPI)
```bash
cd backend
pip install -r requirements.txt
```

#### Frontend (Next.js)
```bash
cd frontend
npm install
```

### 4. Run the Application

#### Option A: Using Docker Compose (Recommended)
```bash
docker-compose up --build
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Backend docs: http://localhost:8000/docs

#### Option B: Run Separately
Backend:
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Frontend:
```bash
cd frontend
npm run dev
```

### 5. Initial Setup

1. Open your browser and navigate to http://localhost:3000
2. Register a new account using the registration form
3. Log in with your credentials
4. Start adding and managing your tasks!

## Project Structure

```
TodoAPP/
├── backend/              # FastAPI backend
│   ├── main.py           # Application entry point
│   ├── models.py         # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Authentication middleware
│   ├── database/         # Database connection
│   └── requirements.txt  # Python dependencies
├── frontend/             # Next.js frontend
│   ├── app/             # App Router pages
│   ├── components/      # React components
│   ├── lib/             # Utilities and API client
│   └── package.json     # Node.js dependencies
├── docker-compose.yml   # Docker configuration
└── .env*                # Environment files
```

## Key Features

- **User Authentication**: Secure login and registration with Better Auth
- **Task Management**: Create, read, update, and delete tasks
- **Multi-User Isolation**: Each user sees only their own tasks
- **Responsive UI**: Works on desktop and mobile devices
- **Real-time Updates**: Changes reflect immediately in the UI

## Troubleshooting

### Common Issues

1. **Environment Variables Not Set**: Ensure both `.env` and `.env.local` files have the same `BETTER_AUTH_SECRET`
2. **Database Connection**: Verify your Neon PostgreSQL connection string is correct
3. **Port Conflicts**: Make sure ports 3000 and 8000 are available

### API Endpoints

- `GET /api/tasks` - Get all tasks for authenticated user
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/{id}` - Update a task
- `PATCH /api/tasks/{id}` - Toggle task completion
- `DELETE /api/tasks/{id}` - Delete a task

## Next Steps

- Explore the API documentation at http://localhost:8000/docs
- Customize the UI by modifying components in `frontend/components/`
- Extend functionality by adding new routes in `backend/routes/`
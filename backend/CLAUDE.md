# Backend for Todo Full-Stack Multi-User Web Application

This is the backend component of the Todo application built with FastAPI, SQLModel, and Neon PostgreSQL.

## Tech Stack

- **Framework**: FastAPI (Python 3.11)
- **ORM**: SQLModel
- **Database**: Neon Serverless PostgreSQL
- **Authentication**: JWT token verification using Better Auth shared secret
- **API Design**: RESTful endpoints with proper authentication

## Project Structure

```
backend/
├── main.py              # FastAPI application entry point
├── models.py            # SQLModel database models
├── routes/
│   └── tasks.py         # Task-related API endpoints
├── middleware/
│   └── jwt_auth.py      # JWT authentication middleware
├── database/
│   └── connection.py    # Database connection setup
├── requirements.txt     # Python dependencies
└── .env                 # Environment variables
```

## Environment Variables

- `DATABASE_URL` - Neon PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Shared secret with frontend (must match)
- `JWT_ALGORITHM` - Algorithm for JWT (default: HS256)
- `JWT_EXPIRE_DAYS` - Token expiration in days (default: 7)

## Implementation Guidelines

1. All API endpoints must require JWT authentication
2. Task ownership must be validated server-side using user ID from JWT
3. Database models should use SQLModel with proper relationships
4. Error handling should follow API contract specifications
5. All implementation should follow the specs referenced as @specs/...

## Key Features

- JWT token verification middleware
- Task CRUD operations with user ownership validation
- SQLModel database models
- RESTful API endpoints under /api/tasks
- Proper error responses (401, 404, etc.)
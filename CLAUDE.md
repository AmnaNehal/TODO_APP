# Todo Full-Stack Multi-User Web Application

This project implements a complete, locally runnable multi-user todo web application with secure authentication, task CRUD operations, and persistent storage using Next.js, FastAPI, and Neon PostgreSQL.

## Project Overview

- **Frontend**: Next.js 16+ with App Router, TypeScript, Tailwind CSS
- **Backend**: FastAPI (Python), SQLModel ORM
- **Database**: Neon Serverless PostgreSQL
- **Authentication**: Better Auth with JWT plugin

## Spec-Driven Development

This project follows spec-driven development using the Spec-Kit Plus methodology. All implementation should reference specifications using the @specs/... format:

- `@specs/1-todo-app.md` - Main feature specification
- `@specs/1-todo-app/plan.md` - Implementation plan
- `@specs/1-todo-app/data-model.md` - Data models and relationships
- `@specs/1-todo-app/contracts/` - API contracts

## Development Workflow

1. All implementation must follow the spec-driven methodology using Claude Code prompts referencing @specs/...
2. No manual coding is allowed - all changes through Claude Code prompts
3. Strict multi-user data isolation enforced server-side
4. JWT tokens from Better Auth used for all API calls
5. All task endpoints under /api/tasks with JWT authentication

## Environment Variables

### Frontend (.env.local)
- `BETTER_AUTH_SECRET` - Shared secret with backend
- `BETTER_AUTH_URL` - Frontend URL for Better Auth
- `NEXT_PUBLIC_API_URL` - Backend API URL

### Backend (.env)
- `DATABASE_URL` - Neon PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Shared secret with frontend
- `JWT_ALGORITHM` - Algorithm for JWT (default: HS256)
- `JWT_EXPIRE_DAYS` - Token expiration in days (default: 7)

## Commands

- `/sp.specify` - Create/update feature specifications
- `/sp.plan` - Generate implementation plan
- `/sp.tasks` - Generate task breakdown
- `/sp.implement` - Execute implementation tasks
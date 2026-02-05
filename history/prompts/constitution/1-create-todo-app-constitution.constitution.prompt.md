---
id: 1
title: Create Todo App Constitution
stage: constitution
date: 2026-01-07
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: master
user: acer
command: /sp.constitution
labels: [constitution, spec-driven-development, todo-app]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - none
---

## Prompt

```text
/sp.constitution

Project: Phase II Todo Full-Stack Multi-User Web Application (Next.js + FastAPI + Neon Postgres)

Directory Structure: Monorepo as specified
hackathon-todo/
├── .spec-kit/config.yaml
├── specs/
│   ├── overview.md
│   ├── architecture.md
│   ├── features/
│   │   ├── task-crud.md
│   │   └── authentication.md
│   ├── api/rest-endpoints.md
│   ├── database/schema.md
│   └── ui/
│       ├── components.md
│       └── pages.md
├── CLAUDE.md (root)
├── frontend/
│   ├── CLAUDE.md
│   ├── .env.local                  # Must contain the fields below (values are examples only)
│   └── ... (Next.js 16+ App Router project)
├── backend/
│   ├── CLAUDE.md
│   ├── .env                        # Must contain the fields below (values are examples only)
│   └── ... (FastAPI with SQLModel project)
├── docker-compose.yml
└── README.md

Core principles:
- Fully spec-driven development using Spec-Kit Plus with structured references (@specs/...)
- All implementation exclusively via Claude Code prompts (no manual coding)
- Strict multi-user data isolation: Users can only access/modify their own tasks
- Secure stateless authentication using Better Auth JWT tokens shared between separate Next.js frontend and FastAPI backend
- Persistent storage in Neon Serverless PostgreSQL with reliable connection handling

Key standards:
- Exact technology stack:
  - Frontend: Next.js 16+ (App Router), TypeScript, Tailwind CSS
  - Backend: FastAPI (Python), SQLModel ORM
  - Database: Neon Serverless PostgreSQL
  - Authentication: Better Auth with JWT plugin enabled
- Environment variables (fields are mandatory; values shown are examples only):
  frontend/.env.local must contain exactly these keys:
  ```
  BETTER_AUTH_SECRET=generated-secret-here
  BETTER_AUTH_URL=http://localhost:3000
  NEXT_PUBLIC_API_URL=http://localhost:8000
  ```

  backend/.env must contain exactly these keys:
  ```
  DATABASE_URL=postgresql+psycopg://user:password@your-project.neon.tech/dbname?sslmode=require
  BETTER_AUTH_SECRET=generated-secret-here                # Must match frontend exactly
  JWT_ALGORITHM=HS256
  JWT_EXPIRE_DAYS=7
  ```
- REST API endpoints: All under /api/tasks (no user_id in path); authentication via JWT, user filtering from decoded token
- Database schema:
  - users table managed by Better Auth
  - tasks table with user_id foreign key, title, description, completed (boolean), created_at, updated_at

Constraints:
- Implementation only through Claude Code referencing specs (e.g., "Implement @specs/features/task-crud.md")
- All API endpoints require valid JWT in Authorization: Bearer <token> header → return 401 if missing/invalid
- Server-side enforcement of task ownership on every operation
- Local development: Frontend on port 3000, Backend on port 8000 (optional docker-compose)
- Feature scope strictly limited to 5 basic operations: Add, View, Update, Delete, Mark as Complete
- Responsive UI using Tailwind CSS

Success criteria:
- Full multi-user support: Multiple users can sign up/login and manage independent task lists
- Secure authentication: JWT verification succeeds, user data fully isolated, tokens expire after 7 days
- Reliable data persistence: All CRUD operations correctly reflect in Neon database
- Clean, responsive frontend with proper auth flows and task management UI
- No environment/connection issues: Both services start successfully with correct .env configuration
- Complete adherence to Spec-Kit monorepo structure, CLAUDE.md guidelines, and environment variable requirements
```

## Response snapshot

Created a new constitution file at `.specify/memory/constitution.md` that defines the core principles and constraints for the Todo Full-Stack Multi-User Web Application. The constitution includes six core principles covering spec-driven development, Claude Code implementation only, multi-user data isolation, secure authentication, full-stack architecture standards, and REST API design. It also includes additional constraints, development workflow, and governance sections.

## Outcome

- ✅ Impact: Created new constitution file with all required principles
- 🧪 Tests: none
- 📁 Files: 1 file created (.specify/memory/constitution.md)
- 🔁 Next prompts: Can proceed with spec creation using /sp.specify
- 🧠 Reflection: Constitution properly captures all requirements from the user input

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
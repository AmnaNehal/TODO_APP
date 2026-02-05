---
id: 2
title: Create Todo App Spec
stage: spec
date: 2026-01-07
surface: agent
model: claude-sonnet-4-5-20250929
feature: todo-app
branch: 1-todo-app
user: acer
command: /sp.specify
labels: [specification, todo-app, full-stack, authentication]
links:
  spec: specs/1-todo-app.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/1-todo-app.md
  - specs/overview.md
  - specs/architecture.md
  - specs/features/task-crud.md
  - specs/features/authentication.md
  - specs/api/rest-endpoints.md
  - specs/database/schema.md
  - specs/ui/components.md
  - specs/ui/pages.md
  - specs/checklists/requirements.md
tests:
  - none
---

## Prompt

```text
    Todo Full-Stack Multi-User Web Application
Target audience: Developers learning modern full-stack development and users needing a secure, multi-user personal task management application
Focus: Deliver a complete, locally runnable multi-user todo web app with authentication, task CRUD operations, and persistent storage using Next.js, FastAPI, and Neon PostgreSQL
Directory Structure: Monorepo (strictly follow this layout)
hackathon-todo/
├── .spec-kit/
│   └── config.yaml
├── specs/
│   ├── overview.md
│   ├── architecture.md
│   ├── features/
│   │   ├── task-crud.md
│   │   └── authentication.md
│   ├── api/
│   │   └── rest-endpoints.md
│   ├── database/
│   │   └── schema.md
│   └── ui/
│       ├── components.md
│       └── pages.md
├── CLAUDE.md                  # Root-level instructions for Claude Code
├── frontend/
│   ├── CLAUDE.md              # Frontend-specific guidelines
│   ├── .env.local             # Must contain mandatory fields (values are examples only)
│   └── ...                    # Next.js 16+ App Router project files
├── backend/
│   ├── CLAUDE.md              # Backend-specific guidelines
│   ├── .env                   # Must contain mandatory fields (values are examples only)
│   └── ...                    # FastAPI with SQLModel project files
├── docker-compose.yml         # For running both services together
└── README.md
Success criteria:

Full local development environment runs reliably using docker-compose up --build (preferred) or manually
Frontend (Next.js) and backend (FastAPI) start successfully without port conflicts or connection errors
All 5 basic task operations (Add, View, Update, Delete, Mark as Complete) work end-to-end for multiple registered users
Strict data isolation: Each logged-in user sees and modifies only their own tasks
Better Auth handles signup/signin correctly and issues valid JWT tokens that FastAPI backend successfully verifies
All tasks persist reliably in Neon Serverless PostgreSQL across service restarts
Environment variables are correctly loaded and shared (especially BETTER_AUTH_SECRET) to ensure seamless auth and API communication

Constraints:

Development workflow: Strictly spec-driven using Spec-Kit Plus and Claude Code (no manual coding allowed)
Exact technology stack:
Frontend: Next.js 16+ (App Router), TypeScript, Tailwind CSS
Backend: FastAPI (Python), SQLModel ORM
Database: Neon Serverless PostgreSQL (external, no local container needed)
Authentication: Better Auth with JWT plugin enabled

Environment variables (mandatory fields only; values and ports shown below are examples only – actual ports can be changed if needed):
frontend/.env.local must contain:textBETTER_AUTH_SECRET=any-strong-generated-secret
BETTER_AUTH_URL=http://localhost:3000    # Example base URL; adjustable
NEXT_PUBLIC_API_URL=http://localhost:8000 # Example API URL; adjustablebackend/.env must contain:textDATABASE_URL=postgresql+psycopg://user:password@your-project.neon.tech/dbname?sslmode=require
BETTER_AUTH_SECRET=any-strong-generated-secret          # Must exactly match frontend value
JWT_ALGORITHM=HS256
JWT_EXPIRE_DAYS=7
Docker usage: Provide a complete, working docker-compose.yml that:
Builds and runs both frontend and backend services
Mounts source code for live reload during development
Loads environment variables from respective .env files using env_file
Exposes frontend and backend on configurable ports (defaults: 3000 and 8000 as examples)
No database service needed (Neon is external)

API security: All /api/tasks endpoints require Authorization: Bearer <JWT> header; return 401 if missing/invalid; enforce task ownership server-side
Scope limited to Phase II basic functionality only

Not building:

Production-grade deployment configurations (e.g., Nginx, SSL, CI/CD, custom domains)
Advanced task features (filtering, sorting, due dates, tags, sharing, notifications)
Local database container (use external Neon only)
Custom port hardening or reverse proxy setups
Mobile app, PWA, or additional auth providers
Later phase features (chatbot, MCP tools, etc.)
```

## Response snapshot

Created comprehensive specifications for the Todo Full-Stack Multi-User Web Application, including:
- Main feature specification (specs/1-todo-app.md)
- Overview specification (specs/overview.md)
- Architecture specification (specs/architecture.md)
- Task CRUD feature specification (specs/features/task-crud.md)
- Authentication feature specification (specs/features/authentication.md)
- API endpoints specification (specs/api/rest-endpoints.md)
- Database schema specification (specs/database/schema.md)
- UI components specification (specs/ui/components.md)
- UI pages specification (specs/ui/pages.md)
- Quality checklist (specs/checklists/requirements.md)

The specifications cover all required aspects including user scenarios, functional requirements, success criteria, constraints, and architecture while maintaining focus on user value and business needs without implementation details.

## Outcome

- ✅ Impact: Complete specification set created for todo app
- 🧪 Tests: none
- 📁 Files: 10 files created in specs directory
- 🔁 Next prompts: Can proceed with planning using /sp.plan
- 🧠 Reflection: All specifications follow the required structure and cover necessary aspects

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): All checklist items passed
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
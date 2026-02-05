---
id: 3
title: Create Todo App Plan
stage: plan
date: 2026-01-07
surface: agent
model: claude-sonnet-4-5-20250929
feature: todo-app
branch: 1-todo-app
user: acer
command: /sp.plan
labels: [planning, architecture, todo-app, full-stack]
links:
  spec: specs/1-todo-app.md
  plan: specs/1-todo-app/plan.md
  adr: null
  pr: null
files:
  - specs/1-todo-app/plan.md
  - specs/1-todo-app/research.md
  - specs/1-todo-app/data-model.md
  - specs/1-todo-app/quickstart.md
  - specs/1-todo-app/contracts/tasks-api.yaml
  - .specify/memory/agent-context.md
tests:
  - none
---

## Prompt

```text
       # /sp.plan - Implementation Plan for Phase II: Todo Full-Stack Multi-User Web Application

## Project Overview
Deliver a complete, locally runnable multi-user todo web app with secure authentication, task CRUD operations, strict data isolation, and persistent storage using Next.js 16+, FastAPI, Neon PostgreSQL, and Better Auth with JWT.

Target: Fully spec-driven development using Spec-Kit Plus and Claude Code only (no manual coding).

## Architecture Sketch (Text Diagram)

Monorepo Root (hackathon-todo/)
├── specs/                  ← All specifications (Spec-Kit managed)
│   ├── overview.md
│   ├── architecture.md
│   ├── features/task-crud.md, authentication.md
│   ├── api/rest-endpoints.md
│   ├── database/schema.md
│   └── ui/components.md, pages.md
├── frontend/               ← shboard/tasks page

## Implementation Roadmap (Phased Tasks)

Phase 0: Setup Foundation
- Create monorepo directory structure
- Initialize Next.js app in /frontend
- Initialize FastAPI project in /backend
- Create .spec-kit/config.yaml
- Write root, frontend, and backend CLAUDE.md files
- Add placehNext.js 16+ App Router, TypeScript, Tailwind
│   ├── app/ (pages & layouts)
│   ├── components/
│   ├── lib/api.ts (API client with JWT attachment)
│   └── .env.local
├── backend/                ← FastAPI + SQLModel
│   ├── main.py
│   ├── models.py
│   ├── routes/tasks.py
│   ├── middleware/jwt_auth.py
│   └── .env
├── docker-compose.yml      ← Runs both services with live reload
└── CLAUDE.md files (root, frontend, backend)

Data Flow:
User → Next.js Frontend (Better Auth signup/login → JWT) → API calls with Bearer token → FastAPI (verify JWT → extract user_id → filter tasks by user_id) → Neon Postgres

## Spec File Outlines (to be created/updated)

1. specs/overview.md            → Project purpose, phase, stack summary
2. specs/architecture.md        → High-level diagram, auth flow, data isolation explanation
3. specs/features/task-crud.md  → User stories & AC for 5 operations (Add, List, Updatolder .env and .env.local files with mandatory keys
- Create basic docker-compose.yml (builds both, env_file, ports 3000 & 8000)

Phase 1: Specification
- Draft all spec files listed above with detailed requirements and acceptance criteria
- Ensure references use @specs/... format

Phase 2: Backend Implementation (via Claude Code only)
- Implement database models & connection (@specs/database/schema.md)
- Implement JWT verification middleware using shared BETTER_AUTH_SECRET
- Implement task routes with ownership enforcement on every operation
- Implement full CRUD + mark complete under /api/tasks
- Add proper error handling (401, 404, etc.)

Phase 3: Frontend Implementation (via Claude Code only)
- Set up Better Auth with JWT plugin enabled
- Implement auth pages (signup, login, protected layout)
- Create API client that automatically attaches JWT to requests
- Implement task dashboard with list, add, edit, delete, toggle complete
- Use Tailwind for responsive, clean UI

Phase 4: Integration & Environment
- Finalize docker-compose.yml for seamless local dev
- Verify environment variable loading and secret sharing
- Test cross-service communication (frontend → backend → Neon)

Phase 5: Testing & Refinement
- Manual multi-user testing
- Verify data isolation, token expiry, persistence across restarts
- Iterate via spec updates if needed

## Key Decisions & Tradeoffs

1. Authentication: Better Auth + JWT plugin
   - Chosen: Self-hosted, full control, seamless Next.js integration
   - Alternatives rejected: Auth0/Supabase Auth (adds external dependency, overkill for hackathon)

2. Database: Neon Serverless Postgres (external)
   - Chosen: Matches production-like setup, no local container maintenance
   - Tradeoff vs local Postgres: Slightly slower cold starts but easier scaling and matches constraints

3. Monorepo vs Separate Repos
   - Chosen: Monorepo for unified Claude Code context and easier cross-stack changes
   - Tradeoff: Larger repo size vs clearer separation

4. API Design: user_id from JWT only (no user_id in paths)
   - Chosen: More secure, stateless, follows constitution
   - Rejected: user_id in URL (potential for ID enumeration attacks)

5. Environment Variables: Strict .env requirement, no defaults
   - Chosen: Security best practice
   - Tradeoff: Slightly more setup effort vs convenience

## Testing & Quality Validation Strategy

- End-to-end manual flows:
  - Register/login two separate users → confirm independent task lists
  - Perform all 5 operations → verify persistence in Neon
  - Attempt cross-user access → must fail with 401/404
  - Wait 7+ days or force expiry → confirm token rejection

- Backend unit validation:
  - Test each endpoint with valid/invalid/missing tokens
  - Test ownership enforcement (try updating foreign task)

- Frontend validation:
  - Protected routes redirect unauthenticated users
  - API client correctly attaches Bearer token
  - UI responsive on mobile/desktop (Tailwind)

- Docker & Environment checks:
  - docker-compose up --build starts both services without errors
  - Connections to Neon succeed, no SSL/credential issues

- Success Criteria Checklist:
  [ ] Multi-user isolation enforced
  [ ] JWT auth works end-to-end with 7-day expiry
  [ ] All CRUD operations persist reliably
  [ ] Clean, responsive Tailwind UI
  [ ] Exact .env keys present and shared secret matches
  [ ] Full adherence to spec structure and CLAUDE.md guidelines

## Development Constraints Reminder
- NO manual coding – all implementation via Claude Code prompts referencing specs
- Exact stack only – no deviations
- Scope strictly limited to Phase II basic 5 operations
- Use concurrent research/validation: implement small pieces, test, refine specs as needed

Plan approved for execution starting with Phase 0 & 1 (setup + full spec writing).
```

## Response snapshot

Created a comprehensive implementation plan for the Todo Full-Stack Multi-User Web Application, including:

- Implementation plan document (specs/1-todo-app/plan.md)
- Research findings document (specs/1-todo-app/research.md)
- Data model specification (specs/1-todo-app/data-model.md)
- Quickstart guide (specs/1-todo-app/quickstart.md)
- API contract (specs/1-todo-app/contracts/tasks-api.yaml)
- Agent context file (.specify/memory/agent-context.md)

The plan covers all required aspects of the application including technology stack decisions, architecture patterns, data models, API contracts, and setup instructions. The implementation follows the spec-driven development approach required by the constitution.

## Outcome

- ✅ Impact: Complete implementation plan created for todo app
- 🧪 Tests: none
- 📁 Files: 6 files created in specs/1-todo-app/ and .specify/memory/
- 🔁 Next prompts: Can proceed with task creation using /sp.tasks
- 🧠 Reflection: Plan addresses all architectural requirements and constraints

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): All planning artifacts created successfully
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
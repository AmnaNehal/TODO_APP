# Frontend for Todo Full-Stack Multi-User Web Application

This is the frontend component of the Todo application built with Next.js 16+, TypeScript, and Tailwind CSS.

## Tech Stack

- **Framework**: Next.js 16+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Better Auth with JWT plugin
- **API Client**: Custom API client with JWT token handling

## Project Structure

```
frontend/
├── app/                 # Next.js App Router pages
│   ├── layout.tsx
│   ├── page.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── register/
│   │   └── page.tsx
│   └── dashboard/
│       └── page.tsx
├── components/         # Reusable React components
│   ├── TaskList.tsx
│   ├── TaskItem.tsx
│   ├── AddTaskForm.tsx
│   └── AuthProvider.tsx
├── lib/               # Utility functions and API client
│   ├── api.ts
│   └── auth.ts
├── styles/            # Global styles
│   └── globals.css
├── package.json
└── .env.local
```

## Environment Variables

- `BETTER_AUTH_SECRET` - Shared secret with backend (must match)
- `BETTER_AUTH_URL` - Frontend URL for Better Auth (e.g., http://localhost:3000)
- `NEXT_PUBLIC_API_URL` - Backend API URL (e.g., http://localhost:8000)

## Implementation Guidelines

1. All pages should use the App Router structure
2. Components should be reusable and follow Tailwind CSS best practices
3. API calls must include JWT tokens via the API client
4. Authentication state should be managed properly with Better Auth
5. All implementation should follow the specs referenced as @specs/...

## Key Features

- User registration and login pages
- Task dashboard with CRUD operations
- Responsive UI with Tailwind CSS
- Proper authentication flow and redirects
- JWT token handling for API calls
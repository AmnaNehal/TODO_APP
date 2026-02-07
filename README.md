# Todo Full-Stack Multi-User Web Application

A complete, locally runnable multi-user todo web application with secure authentication, task CRUD operations, and persistent storage using Next.js, FastAPI, and Neon PostgreSQL.

## Features

- Multi-user support with strict data isolation
- Secure authentication using Better Auth with JWT tokens
- Full task CRUD operations (Create, Read, Update, Delete, Mark Complete)
- Responsive UI with Tailwind CSS
- Persistent storage in Neon Serverless PostgreSQL

## Tech Stack

- **Frontend**: Next.js 16+ with App Router, TypeScript, Tailwind CSS
- **Backend**: FastAPI (Python), SQLModel ORM
- **Database**: Neon Serverless PostgreSQL
- **Authentication**: Better Auth with JWT plugin

## Setup

1. Clone the repository
2. Install dependencies for both frontend and backend
3. Set up environment variables (see .env files)
4. Start the services using docker-compose

## Running Locally

```bash
docker-compose up --build
```

Frontend will be available at http://localhost:3000
Backend API will be available at http://127.0.0.1:8000

# Phase IV: Local Kubernetes Deployment (Minikube + Helm)

## Objective
Deploy the Phase III Cloud Native Todo Chatbot (Frontend + Backend + PostgreSQL) on a local Kubernetes cluster using Minikube and Helm.

## What is running
- Frontend: Next.js (Service: `todo-frontend`, Port: `3000`)
- Backend: FastAPI (Service: `todo-backend`, Port: `8002`)
- Database: PostgreSQL (Service: `todo-db`, Port: `5432`)

## Helm Chart
A Helm chart was created and used to manage the deployment.

Folder:
- `helm/todo-chatbot`

Helm release:
- Release name: `todo`
- Namespace: `default`

Commands used:
```bash
cd helm
helm lint todo-chatbot
helm upgrade --install todo todo-chatbot
helm list
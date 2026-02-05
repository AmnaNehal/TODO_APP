# REST API Endpoints Specification

## Overview

The REST API provides endpoints for task management operations, with all endpoints requiring authentication via JWT tokens. The API follows standard REST conventions and enforces user data isolation on all operations.

## Authentication Requirements

All task-related API endpoints require a valid JWT token in the Authorization header:
- Header: `Authorization: Bearer <JWT_TOKEN>`
- Response: 401 Unauthorized if token is missing, invalid, or expired
- Backend validates JWT using shared secret with Better Auth

## Base URL

- Development: `http://localhost:8000/api`
- Production: To be configured via environment variables

## Task Endpoints

### GET /tasks
- **Description**: Retrieve all tasks for the authenticated user
- **Authentication**: Required
- **Request**: No request body
- **Response**:
  - 200: Array of task objects
  - 401: Unauthorized
- **Response Body**: `[{id, title, description, completed, created_at, updated_at}, ...]`

### POST /tasks
- **Description**: Create a new task for the authenticated user
- **Authentication**: Required
- **Request Body**: `{title: string, description: string, completed: boolean}`
- **Response**:
  - 201: Created task object
  - 400: Invalid request data
  - 401: Unauthorized
- **Response Body**: `{id, title, description, completed, created_at, updated_at}`

### GET /tasks/{task_id}
- **Description**: Retrieve a specific task for the authenticated user
- **Authentication**: Required
- **Parameters**: `task_id` (path parameter)
- **Response**:
  - 200: Task object
  - 401: Unauthorized
  - 404: Task not found
- **Response Body**: `{id, title, description, completed, created_at, updated_at}`

### PUT /tasks/{task_id}
- **Description**: Update a specific task for the authenticated user
- **Authentication**: Required
- **Parameters**: `task_id` (path parameter)
- **Request Body**: `{title?: string, description?: string, completed?: boolean}`
- **Response**:
  - 200: Updated task object
  - 400: Invalid request data
  - 401: Unauthorized
  - 404: Task not found
- **Response Body**: `{id, title, description, completed, created_at, updated_at}`

### PATCH /tasks/{task_id}
- **Description**: Partially update a specific task for the authenticated user (e.g., toggle completion)
- **Authentication**: Required
- **Parameters**: `task_id` (path parameter)
- **Request Body**: `{completed?: boolean}`
- **Response**:
  - 200: Updated task object
  - 400: Invalid request data
  - 401: Unauthorized
  - 404: Task not found
- **Response Body**: `{id, title, description, completed, created_at, updated_at}`

### DELETE /tasks/{task_id}
- **Description**: Delete a specific task for the authenticated user
- **Authentication**: Required
- **Parameters**: `task_id` (path parameter)
- **Response**:
  - 204: Successfully deleted
  - 401: Unauthorized
  - 404: Task not found
- **Response Body**: Empty

## Success Criteria

- All endpoints properly authenticate requests using JWT tokens
- All endpoints enforce user data isolation (users can only access their own tasks)
- Proper HTTP status codes are returned for all scenarios
- API responses follow consistent format
- Error handling provides meaningful feedback
- Endpoints support all required CRUD operations for tasks
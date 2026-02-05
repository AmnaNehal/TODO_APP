# Data Model: Todo Full-Stack Multi-User Web Application

## Overview
This document defines the data structures and relationships for the Todo Full-Stack Multi-User Web Application.

## Entity Definitions

### User Entity
**Source**: Managed by Better Auth
- **id**: UUID/String (Primary Key) - Unique identifier for the user
- **email**: String (Unique) - User's email address for authentication
- **name**: String - User's display name
- **created_at**: DateTime - Account creation timestamp
- **updated_at**: DateTime - Last account update timestamp
- **verified**: Boolean - Whether the user's email is verified

**Relationships**:
- One User to Many Tasks (user.tasks)

### Task Entity
**Source**: Application-defined table
- **id**: Integer (Primary Key, Auto-increment) - Unique identifier for the task
- **user_id**: UUID/String (Foreign Key) - Reference to the owning user
- **title**: String (255 chars max, Not Null) - Task title
- **description**: Text (Nullable) - Detailed task description
- **completed**: Boolean (Default: false) - Completion status
- **created_at**: DateTime (Default: current timestamp) - Creation timestamp
- **updated_at**: DateTime (Default: current timestamp) - Last update timestamp

**Relationships**:
- Many Tasks to One User (task.user)

## Data Validation Rules

### User Validation (via Better Auth)
- Email must be unique and follow standard email format
- Password must meet security requirements (minimum length, complexity)
- User cannot be created without valid credentials

### Task Validation
- Title is required and must be between 1 and 255 characters
- User_id must reference an existing user
- Completed status defaults to false if not specified
- Creation and update timestamps are automatically managed

## State Transitions

### Task State Transitions
- **Pending → Completed**: When user marks task as complete
- **Completed → Pending**: When user unmarks task as complete

**Transition Rules**:
- Only the task owner can change the completion status
- Task ownership cannot be transferred
- Task cannot be modified by users other than the owner

## Database Schema

### Tasks Table
```sql
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,  -- References Better Auth user ID
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_completed ON tasks(completed);
```

**Notes**:
- user_id references the user identifier managed by Better Auth
- Indexes created for efficient querying by user_id and completion status
- updated_at column should be automatically updated on row changes

## API Data Models

### Task Request Model
```typescript
interface CreateTaskRequest {
    title: string;
    description?: string;
    completed?: boolean;
}

interface UpdateTaskRequest {
    title?: string;
    description?: string;
    completed?: boolean;
}
```

### Task Response Model
```typescript
interface TaskResponse {
    id: number;
    user_id: string; // UUID from Better Auth
    title: string;
    description: string | null;
    completed: boolean;
    created_at: Date;
    updated_at: Date;
}
```

## Security Considerations

### Data Isolation
- All queries must filter by authenticated user's ID
- Direct access to tasks of other users must be prevented
- API endpoints must validate user ownership before operations

### Data Protection
- User passwords handled by Better Auth (never stored in application)
- Task data encrypted at rest in Neon PostgreSQL
- JWT tokens used for authentication (no session storage required)
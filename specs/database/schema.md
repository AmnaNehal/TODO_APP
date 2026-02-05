# Database Schema Specification

## Overview

The database schema defines the structure for storing user accounts and task data. The schema leverages Better Auth for user management while implementing custom tables for task data with proper relationships and constraints.

## Database Technology

- **Database**: Neon Serverless PostgreSQL
- **ORM**: SQLModel (for FastAPI backend)
- **External Service**: Better Auth manages user accounts separately

## Tables

### Users Table (Managed by Better Auth)

Better Auth automatically manages the users table with:
- User identification and authentication data
- Account creation and modification timestamps
- Security-related fields (password hashes, verification status)

### Tasks Table

**Table Name**: `tasks`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for each task |
| user_id | UUID or VARCHAR | FOREIGN KEY (references Better Auth user) | ID of the user who owns this task |
| title | VARCHAR(255) | NOT NULL | Title of the task |
| description | TEXT | NULL | Detailed description of the task |
| completed | BOOLEAN | NOT NULL, DEFAULT FALSE | Completion status of the task |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | When the task was created |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP, ON UPDATE CURRENT_TIMESTAMP | When the task was last modified |

**Indexes**:
- Primary key index on `id`
- Index on `user_id` for efficient user-based queries
- Index on `completed` for filtering completed tasks

**Foreign Key Constraints**:
- `user_id` references the user identifier in Better Auth's user management system

## Relationships

- Each task belongs to exactly one user (many-to-one relationship)
- Users can own multiple tasks
- Task ownership is enforced at the application level by filtering based on authenticated user ID

## Security Considerations

- All tasks are associated with a specific user ID
- Application layer enforces that users can only access tasks they own
- No direct foreign key constraint to Better Auth's user table (as it's managed separately)

## Success Criteria

- Database schema supports efficient task storage and retrieval
- Proper relationships exist between users and tasks
- Indexes enable fast query performance
- Schema enforces data integrity constraints
- Security model prevents cross-user data access at the application level
- Schema is compatible with SQLModel ORM requirements
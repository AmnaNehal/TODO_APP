# Task CRUD Operations Feature Specification

## Overview

The Task CRUD (Create, Read, Update, Delete) feature enables authenticated users to manage their personal tasks with full lifecycle operations. Each user can only access and modify their own tasks, ensuring data isolation.

## User Scenarios

### Scenario 1: Create a New Task
- **Actor**: Authenticated user
- **Precondition**: User is logged in and has valid JWT token
- **Flow**: User enters task details → Submits form → Task is saved to database → Task appears in user's task list
- **Postcondition**: New task is created and associated with the authenticated user

### Scenario 2: View User's Tasks
- **Actor**: Authenticated user
- **Precondition**: User is logged in and has valid JWT token
- **Flow**: User navigates to task list → Frontend requests tasks → Backend filters by user ID → Tasks displayed to user
- **Postcondition**: User sees only their own tasks

### Scenario 3: Update an Existing Task
- **Actor**: Authenticated user
- **Precondition**: User is logged in and owns the task to be updated
- **Flow**: User selects task → Edits task details → Submits changes → Backend validates ownership → Task is updated
- **Postcondition**: Task details are updated in the database

### Scenario 4: Mark Task as Complete/Incomplete
- **Actor**: Authenticated user
- **Precondition**: User is logged in and owns the task to be updated
- **Flow**: User toggles completion status → Backend validates ownership → Task completion status is updated
- **Postcondition**: Task completion status is updated in the database

### Scenario 5: Delete a Task
- **Actor**: Authenticated user
- **Precondition**: User is logged in and owns the task to be deleted
- **Flow**: User selects delete option → Confirms deletion → Backend validates ownership → Task is removed
- **Postcondition**: Task is permanently removed from the database

## Functional Requirements

### FR-1: Task Creation
- The system shall allow authenticated users to create new tasks
- Each task must be associated with the authenticated user ID
- The system shall validate required task fields before creation
- The system shall return success/error response appropriately

### FR-2: Task Retrieval
- The system shall return only tasks owned by the authenticated user
- The system shall filter tasks by the user ID extracted from the JWT token
- The system shall support retrieving all tasks for a user
- The system shall return tasks with all relevant properties (title, description, completion status, timestamps)

### FR-3: Task Update
- The system shall only allow users to update tasks they own
- The system shall validate task ownership using JWT token information
- The system shall update only the specified task properties
- The system shall maintain the original user ownership during updates

### FR-4: Task Completion Toggle
- The system shall allow users to mark tasks as complete or incomplete
- The system shall validate that the user owns the task being updated
- The system shall update only the completion status field
- The system shall preserve all other task properties during completion updates

### FR-5: Task Deletion
- The system shall only allow users to delete tasks they own
- The system shall validate task ownership before deletion
- The system shall permanently remove the task from the database
- The system shall return appropriate confirmation upon successful deletion

## Success Criteria

- Users can create tasks that persist across sessions
- Users can only see and modify their own tasks
- Task operations complete within acceptable timeframes
- All CRUD operations properly enforce user ownership
- Task data remains consistent and accurate across operations
- Error conditions are handled gracefully with appropriate user feedback
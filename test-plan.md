# End-to-End Test Plan for Todo Application

This document outlines the end-to-end tests for the Todo application to verify all 5 basic operations work correctly for multiple users with proper data isolation.

## Test Environment Setup

1. Start the application (backend and frontend)
2. Prepare test accounts for multiple users
   - User 1: user1@example.com
   - User 2: user2@example.com
   - User 3: user3@example.com

## Test Cases

### Test 1: User Registration and Authentication
**Objective**: Verify users can register and authenticate properly

**Steps**:
1. Navigate to registration page
2. Register with User 1 credentials
3. Verify successful registration and redirect to dashboard
4. Log out
5. Repeat for User 2 and User 3

**Expected Results**:
- All users can register without errors
- Authentication works for all users
- Session management works correctly

### Test 2: Task Creation (Create Operation)
**Objective**: Verify users can create tasks

**Steps**:
1. Log in as User 1
2. Create multiple tasks (e.g., "Task 1", "Task 2", "Task 3")
3. Verify tasks appear in User 1's task list
4. Log out
5. Log in as User 2
6. Create multiple tasks (e.g., "User 2 Task 1", "User 2 Task 2")
7. Verify User 2's tasks appear in their list
8. Log out and log in as User 1
9. Verify User 1 only sees their own tasks, not User 2's tasks

**Expected Results**:
- Each user can create tasks successfully
- Tasks appear in the correct user's list
- Users cannot see other users' tasks

### Test 3: Task Viewing (Read Operation)
**Objective**: Verify users can view their tasks

**Steps**:
1. Log in as User 1
2. Verify all User 1's tasks are displayed
3. Log out
4. Log in as User 2
5. Verify all User 2's tasks are displayed
6. Verify User 2 cannot see User 1's tasks
7. Log out
8. Log in as User 3
9. Verify User 3 sees no tasks initially

**Expected Results**:
- Each user sees only their own tasks
- Task details display correctly
- No cross-user data leakage

### Test 4: Task Update (Update Operation)
**Objective**: Verify users can update their tasks

**Steps**:
1. Log in as User 1
2. Update "Task 1" to "Updated Task 1"
3. Verify the change is reflected in the UI
4. Log out
5. Log in as User 2
6. Verify User 2's tasks are unchanged
7. Try to access User 1's task directly via API (if possible)
8. Verify this fails with 404/403 error

**Expected Results**:
- Users can update their own tasks
- Changes persist correctly
- Users cannot update other users' tasks
- Appropriate error responses when attempting unauthorized access

### Test 5: Task Deletion (Delete Operation)
**Objective**: Verify users can delete their tasks

**Steps**:
1. Log in as User 1
2. Delete "Task 2"
3. Verify the task disappears from the list
4. Log out
5. Log in as User 2
6. Verify User 2's tasks are unchanged
7. Verify User 1's deleted task does not reappear
8. Log out and log in as User 1
9. Verify the task remains deleted

**Expected Results**:
- Users can delete their own tasks
- Deletion is permanent
- Users cannot delete other users' tasks
- Task lists update correctly after deletion

### Test 6: Task Completion Toggle
**Objective**: Verify users can toggle task completion status

**Steps**:
1. Log in as User 1
2. Create a new task "Test Completion"
3. Toggle the completion status
4. Verify visual indicator changes (strikethrough)
5. Log out
6. Log in as User 2
7. Verify User 2's tasks completion status is unchanged
8. Verify User 1's task remains in correct completion state

**Expected Results**:
- Completion toggle works for user's own tasks
- Visual indicators update correctly
- Other users' tasks remain unaffected
- State persists correctly

### Test 7: Multi-User Data Isolation
**Objective**: Verify strict data isolation between users

**Steps**:
1. Log in as User 1
2. Create 5 tasks
3. Update 2 tasks
4. Complete 1 task
5. Delete 1 task
6. Log out
7. Log in as User 2
8. Create 3 tasks
9. Update 1 task
10. Complete all tasks
11. Log out
12. Log in as User 1
13. Verify User 1's data is unchanged
14. Log in as User 3
15. Verify User 3 has no tasks
16. Try direct API access to other users' tasks (if possible)
17. Verify unauthorized access attempts fail

**Expected Results**:
- Each user's data remains completely isolated
- No user can access, modify, or delete other users' tasks
- All operations affect only the authenticated user's data
- Appropriate error responses for unauthorized access attempts

## Test Results Template

| Test Case | Status | Notes |
|-----------|--------|-------|
| User Registration | [PASS/FAIL] | |
| Task Creation | [PASS/FAIL] | |
| Task Viewing | [PASS/FAIL] | |
| Task Update | [PASS/FAIL] | |
| Task Deletion | [PASS/FAIL] | |
| Task Completion | [PASS/FAIL] | |
| Data Isolation | [PASS/FAIL] | |

## Additional Validation Points

- API endpoints return correct HTTP status codes
- Error messages are user-friendly
- Loading states display properly during operations
- Authentication tokens are handled securely
- Database transactions are atomic
- Logging works correctly for all operations
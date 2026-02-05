import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List, Dict
from database.connection import get_async_session
from models import Task, TaskCreate, TaskResponse
from middleware.jwt_auth import get_current_user
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import insert, select as sql_select, update, delete, func
from datetime import datetime

# Set up logger
logger = logging.getLogger(__name__)

router = APIRouter()

import html
import re

def sanitize_input(text: str) -> str:
    """Sanitize user input by escaping HTML and removing dangerous characters"""
    if not text:
        return text

    # Escape HTML characters
    sanitized = html.escape(text)

    # Remove any potentially dangerous patterns
    # Remove javascript:, vbscript:, etc. protocols
    sanitized = re.sub(r'(?i)(javascript:|vbscript:|data:|file:)', '', sanitized)

    # Remove any script tags that might have slipped through
    sanitized = re.sub(r'<script[^>]*>.*?</script>', '', sanitized, flags=re.IGNORECASE)

    return sanitized.strip()

@router.post("/tasks", response_model=TaskResponse)
async def create_task(
    task_data: TaskCreate,
    current_user: dict = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session)
):
    """
    Create a new task for the authenticated user
    """
    user_id = current_user.get("id")
    logger.info(f"Creating task for user {user_id}")

    try:
        # Validate and sanitize inputs
        if not task_data.title or len(task_data.title.strip()) == 0:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Title is required"
            )

        if len(task_data.title) > 255:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Title is too long (max 255 characters)"
            )

        if task_data.description and len(task_data.description) > 1000:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Description is too long (max 1000 characters)"
            )

        # Sanitize inputs
        sanitized_title = sanitize_input(task_data.title)
        sanitized_description = sanitize_input(task_data.description) if task_data.description else None

        # Create a new task instance with the current user's ID
        task = Task(
            title=sanitized_title,
            description=sanitized_description,
            completed=task_data.completed,
            user_id=user_id  # Get user ID from JWT token
        )

        # Add the task to the session and commit
        session.add(task)
        await session.commit()
        await session.refresh(task)

        logger.info(f"Task {task.id} created successfully for user {user_id}")
        return task
    except HTTPException:
        raise
    except Exception as e:
        await session.rollback()
        logger.error(f"Error creating task for user {user_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating task: {str(e)}"
        )


@router.get("/tasks", response_model=List[TaskResponse])
async def get_tasks(
    current_user: dict = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session)
):
    """
    Get all tasks for the authenticated user
    """
    user_id = current_user.get("id")
    logger.info(f"Retrieving tasks for user {user_id}")

    try:
        # Query tasks for the current user only
        statement = sql_select(Task).where(Task.user_id == user_id)
        result = await session.execute(statement)
        tasks = result.scalars().all()

        logger.info(f"Retrieved {len(tasks)} tasks for user {user_id}")
        return tasks
    except Exception as e:
        logger.error(f"Error retrieving tasks for user {user_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving tasks: {str(e)}"
        )


@router.get("/tasks/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: int,
    current_user: dict = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session)
):
    """
    Get a specific task by ID for the authenticated user
    """
    user_id = current_user.get("id")
    logger.info(f"Retrieving task {task_id} for user {user_id}")

    try:
        # Query the task for the current user only
        statement = sql_select(Task).where(
            Task.id == task_id,
            Task.user_id == user_id
        )
        result = await session.execute(statement)
        task = result.scalar_one_or_none()

        if not task:
            logger.warning(f"Task {task_id} not found or access denied for user {user_id}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found or access denied"
            )

        logger.info(f"Task {task_id} retrieved successfully for user {user_id}")
        return task
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving task {task_id} for user {user_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving task: {str(e)}"
        )


@router.put("/tasks/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: int,
    task_data: TaskCreate,
    current_user: dict = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session)
):
    """
    Update an existing task for the authenticated user
    """
    user_id = current_user.get("id")
    logger.info(f"Updating task {task_id} for user {user_id}")

    try:
        # First, verify the task belongs to the current user
        statement = sql_select(Task).where(
            Task.id == task_id,
            Task.user_id == user_id
        )
        result = await session.execute(statement)
        task = result.scalar_one_or_none()

        if not task:
            logger.warning(f"Attempt to update non-existent or unauthorized task {task_id} by user {user_id}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found or access denied"
            )

        # Validate and sanitize inputs
        if task_data.title is not None:
            if len(task_data.title.strip()) == 0:
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail="Title cannot be empty"
                )

            if len(task_data.title) > 255:
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail="Title is too long (max 255 characters)"
                )

        if task_data.description and len(task_data.description) > 1000:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Description is too long (max 1000 characters)"
            )

        # Sanitize inputs
        sanitized_title = task_data.title
        sanitized_description = task_data.description
        if sanitized_title is not None:
            sanitized_title = sanitize_input(sanitized_title)
        if sanitized_description is not None:
            sanitized_description = sanitize_input(sanitized_description)

        # Update the task with new data
        original_title = task.title
        task.title = sanitized_title if sanitized_title is not None else task.title
        task.description = sanitized_description if sanitized_description is not None else task.description
        task.completed = task_data.completed if task_data.completed is not None else task.completed
        task.updated_at = datetime.utcnow()

        await session.commit()
        await session.refresh(task)

        logger.info(f"Task {task_id} updated successfully for user {user_id}")
        return task
    except HTTPException:
        raise
    except Exception as e:
        await session.rollback()
        logger.error(f"Error updating task {task_id} for user {user_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating task: {str(e)}"
        )


@router.patch("/tasks/{task_id}", response_model=TaskResponse)
async def toggle_task_completion(
    task_id: int,
    completed: bool,
    current_user: dict = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session)
):
    """
    Toggle the completion status of a task
    """
    user_id = current_user.get("id")
    logger.info(f"Toggling completion status for task {task_id} (completed: {completed}) for user {user_id}")

    try:
        # Validate inputs
        if task_id <= 0:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Invalid task ID"
            )

        # First, verify the task belongs to the current user
        statement = sql_select(Task).where(
            Task.id == task_id,
            Task.user_id == user_id
        )
        result = await session.execute(statement)
        task = result.scalar_one_or_none()

        if not task:
            logger.warning(f"Attempt to toggle completion for non-existent or unauthorized task {task_id} by user {user_id}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found or access denied"
            )

        # Update only the completion status
        task.completed = completed
        task.updated_at = datetime.utcnow()

        await session.commit()
        await session.refresh(task)

        logger.info(f"Task {task_id} completion status updated to {completed} for user {user_id}")
        return task
    except HTTPException:
        raise
    except Exception as e:
        await session.rollback()
        logger.error(f"Error updating task completion for task {task_id} by user {user_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating task completion: {str(e)}"
        )


@router.get("/tasks/stats", response_model=Dict[str, int])
async def get_task_stats(
    current_user: dict = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session)
):
    """
    Get task statistics for the authenticated user
    """
    user_id = current_user.get("id")
    logger.info(f"Retrieving task statistics for user {user_id}")

    try:
        # Count total tasks for the user
        total_stmt = sql_select(func.count(Task.id)).where(Task.user_id == user_id)
        total_result = await session.execute(total_stmt)
        total_tasks = total_result.scalar_one()

        # Count completed tasks for the user
        completed_stmt = sql_select(func.count(Task.id)).where(
            Task.user_id == user_id,
            Task.completed == True
        )
        completed_result = await session.execute(completed_stmt)
        completed_tasks = completed_result.scalar_one()

        # Calculate pending tasks
        pending_tasks = total_tasks - completed_tasks

        logger.info(f"Retrieved stats for user {user_id}: total={total_tasks}, completed={completed_tasks}, pending={pending_tasks}")

        return {
            "total_tasks": total_tasks,
            "completed_tasks": completed_tasks,
            "pending_tasks": pending_tasks
        }
    except Exception as e:
        logger.error(f"Error retrieving task statistics for user {user_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving task statistics: {str(e)}"
        )


@router.delete("/tasks/{task_id}")
async def delete_task(
    task_id: int,
    current_user: dict = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session)
):
    """
    Delete a task for the authenticated user
    """
    user_id = current_user.get("id")
    logger.info(f"Deleting task {task_id} for user {user_id}")

    try:
        # Validate inputs
        if task_id <= 0:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Invalid task ID"
            )

        # First, verify the task belongs to the current user
        statement = sql_select(Task).where(
            Task.id == task_id,
            Task.user_id == user_id
        )
        result = await session.execute(statement)
        task = result.scalar_one_or_none()

        if not task:
            logger.warning(f"Attempt to delete non-existent or unauthorized task {task_id} by user {user_id}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found or access denied"
            )

        # Delete the task
        await session.delete(task)
        await session.commit()

        logger.info(f"Task {task_id} deleted successfully for user {user_id}")
        return {"message": "Task deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        await session.rollback()
        logger.error(f"Error deleting task {task_id} for user {user_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting task: {str(e)}"
        )
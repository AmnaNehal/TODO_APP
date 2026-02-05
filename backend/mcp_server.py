from typing import Optional, List, Dict, Any, Literal

from mcp.server.fastmcp import FastMCP
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession

from database.connection import get_async_session
from models import Task

mcp = FastMCP("todo-mcp")


async def _get_session() -> AsyncSession:
    async for session in get_async_session():
        return session


@mcp.tool()
async def add_task(
    user_id: str,
    title: str,
    description: Optional[str] = None,
) -> Dict[str, Any]:
    async with await _get_session() as session:
        task = Task(
            user_id=user_id,
            title=title,
            description=description or "",
            completed=False,
        )
        session.add(task)
        await session.commit()
        await session.refresh(task)

        return {
            "task_id": task.id,
            "status": "created",
            "title": task.title,
        }


@mcp.tool()
async def list_tasks(
    user_id: str,
    status: Optional[Literal["all", "pending", "completed"]] = "all",
) -> List[Dict[str, Any]]:
    async with await _get_session() as session:
        stmt = select(Task).where(Task.user_id == user_id)

        if status == "pending":
            stmt = stmt.where(Task.completed == False)  # noqa
        elif status == "completed":
            stmt = stmt.where(Task.completed == True)  # noqa

        result = await session.exec(stmt)
        tasks = result.all()

        return [
            {
                "id": t.id,
                "title": t.title,
                "description": t.description,
                "completed": t.completed,
            }
            for t in tasks
        ]


@mcp.tool()
async def complete_task(
    user_id: str,
    task_id: int,
) -> Dict[str, Any]:
    async with await _get_session() as session:
        task = await session.get(Task, task_id)

        if not task or task.user_id != user_id:
            return {
                "task_id": task_id,
                "status": "not_found",
                "title": None,
            }

        task.completed = True
        session.add(task)
        await session.commit()

        return {
            "task_id": task.id,
            "status": "completed",
            "title": task.title,
        }


@mcp.tool()
async def delete_task(
    user_id: str,
    task_id: int,
) -> Dict[str, Any]:
    async with await _get_session() as session:
        task = await session.get(Task, task_id)

        if not task or task.user_id != user_id:
            return {
                "task_id": task_id,
                "status": "not_found",
                "title": None,
            }

        title = task.title
        await session.delete(task)
        await session.commit()

        return {
            "task_id": task_id,
            "status": "deleted",
            "title": title,
        }


@mcp.tool()
async def update_task(
    user_id: str,
    task_id: int,
    title: Optional[str] = None,
    description: Optional[str] = None,
) -> Dict[str, Any]:
    async with await _get_session() as session:
        task = await session.get(Task, task_id)

        if not task or task.user_id != user_id:
            return {
                "task_id": task_id,
                "status": "not_found",
                "title": None,
            }

        if title is not None and title.strip():
            task.title = title.strip()
        if description is not None:
            task.description = description

        session.add(task)
        await session.commit()

        return {
            "task_id": task.id,
            "status": "updated",
            "title": task.title,
        }


if __name__ == "__main__":
    # MCP uses stdio by default (perfect for local agent usage)
    mcp.run()

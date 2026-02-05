import re
from typing import Any, Dict, List, Optional, Tuple
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from models import Task


def _normalize(s: str) -> str:
    return re.sub(r"\s+", " ", s.strip().lower())


def _extract_task_id(text: str) -> Optional[int]:
    # matches "task 3", "#3", "id 3"
    m = re.search(r"(?:task\s*#?\s*|#|id\s*)(\d+)", text, re.IGNORECASE)
    if m:
        return int(m.group(1))
    return None


def _extract_after_keywords(text: str, keywords: List[str]) -> Optional[str]:
    # returns everything after a matched keyword phrase
    lowered = text.lower()
    for kw in keywords:
        idx = lowered.find(kw)
        if idx != -1:
            return text[idx + len(kw):].strip(" :.-")
    return None


async def _find_tasks_by_title(session: AsyncSession, user_id: str, title_query: str) -> List[Task]:
    # Pull tasks for user and do a lightweight "contains" match in python.
    # (Good enough for DEV. Later you’ll do proper DB search or embeddings.)
    result = await session.execute(select(Task).where(Task.user_id == user_id))
    tasks = result.scalars().all()

    q = _normalize(title_query)
    matches = []
    for t in tasks:
        if q and q in _normalize(t.title):
            matches.append(t)
    return matches


def _format_task_line(t: Task) -> str:
    status = "✅" if t.completed else "⏳"
    return f"- #{t.id}: {t.title} {status}"


async def dev_run(message: str, user_id: str, session: AsyncSession) -> Dict[str, Any]:
    """
    DEV MODE agent:
    - Stateless per request
    - Reads/writes Task table via provided AsyncSession
    - Returns tool_calls for debugging/visibility
    """

    text = message.strip()
    lower = text.lower()

    # ---------------------------------------------------
    # 1) ADD TASK
    # Examples:
    #   "Add a task to buy groceries"
    #   "Remember to pay bills"
    # ---------------------------------------------------
    add_phrases = ["add a task to", "add task to", "create a task to", "remember to", "add ", "create "]
    if any(p in lower for p in ["add a task", "add task", "create a task", "remember to"]) and not any(
        x in lower for x in ["update", "change", "rename", "delete", "remove", "cancel", "complete", "done", "finish"]
    ):
        title = _extract_after_keywords(text, ["add a task to", "add task to", "create a task to", "remember to"])
        if not title:
            # fallback: "add buy milk" -> title is after "add "
            title = _extract_after_keywords(text, ["add ", "create "])

        if not title:
            return {"response": "What should I add as the task?", "tool_calls": []}

        task = Task(user_id=user_id, title=title, description="", completed=False)
        session.add(task)
        await session.commit()
        await session.refresh(task)

        return {
            "response": f"✅ Task added: {task.title} (#{task.id})",
            "tool_calls": [{"tool": "add_task", "task_id": task.id, "title": task.title}]
        }

    # ---------------------------------------------------
    # 2) LIST TASKS
    # Examples:
    #   "show my tasks"
    #   "what's pending?"
    #   "what have I completed?"
    # ---------------------------------------------------
    if any(k in lower for k in ["show", "list", "tasks", "pending", "completed", "done"]) and not any(
        k in lower for k in ["delete", "remove", "cancel", "update", "change", "rename", "complete task", "mark task"]
    ):
        status = "all"
        if "pending" in lower:
            status = "pending"
        elif "completed" in lower or "done" in lower:
            status = "completed"

        result = await session.execute(select(Task).where(Task.user_id == user_id))
        tasks = result.scalars().all()

        if status == "pending":
            tasks = [t for t in tasks if not t.completed]
        elif status == "completed":
            tasks = [t for t in tasks if t.completed]

        if not tasks:
            return {
                "response": f"You have no {status} tasks." if status != "all" else "You have no tasks yet.",
                "tool_calls": [{"tool": "list_tasks", "status": status}]
            }

        lines = "\n".join(_format_task_line(t) for t in tasks)
        return {
            "response": f"Here are your {status} tasks:\n{lines}",
            "tool_calls": [{"tool": "list_tasks", "status": status}]
        }

    # ---------------------------------------------------
    # Helpers for ID or Title resolution (for delete/update/complete)
    # ---------------------------------------------------
    async def resolve_task(target_text: str) -> Tuple[Optional[Task], str, List[Task]]:
        """
        Return (task_or_none, resolution_mode, matches)
        resolution_mode: "id" | "title" | "none" | "ambiguous"
        """
        task_id = _extract_task_id(target_text)
        if task_id is not None:
            t = await session.get(Task, task_id)
            if t and t.user_id == user_id:
                return (t, "id", [])
            return (None, "none", [])

        # Otherwise try title
        title_query = target_text.strip(" :.-")
        if not title_query:
            return (None, "none", [])

        matches = await _find_tasks_by_title(session, user_id, title_query)
        if len(matches) == 1:
            return (matches[0], "title", matches)
        if len(matches) > 1:
            return (None, "ambiguous", matches)

        return (None, "none", [])

    # ---------------------------------------------------
    # 3) COMPLETE TASK (by id or title)
    # Examples:
    #   "mark task 3 complete"
    #   "complete groceries"
    # ---------------------------------------------------
    if any(k in lower for k in ["complete", "done", "finished", "mark"]) and "delete" not in lower and "update" not in lower:
        # Try to capture target after keywords
        target = _extract_after_keywords(text, ["complete", "mark", "done", "finished"])
        if not target:
            target = text  # fallback: allow "task 3 complete"

        task, mode, matches = await resolve_task(target)

        if mode == "ambiguous":
            lines = "\n".join(_format_task_line(t) for t in matches)
            return {
                "response": f"I found multiple matches. Which one should I complete?\n{lines}\nReply like: 'Complete task #ID'",
                "tool_calls": [{"tool": "complete_task", "status": "needs_clarification"}]
            }

        if not task:
            return {
                "response": "I couldn’t find that task. Try 'Complete task #3' or 'Complete <exact title>'.",
                "tool_calls": [{"tool": "complete_task", "status": "not_found"}]
            }

        task.completed = True
        session.add(task)
        await session.commit()

        return {
            "response": f"✅ Task completed: {task.title} (#{task.id})",
            "tool_calls": [{"tool": "complete_task", "task_id": task.id, "title": task.title}]
        }

    # ---------------------------------------------------
    # 4) DELETE TASK (by id or title)
    # Examples:
    #   "delete task 3"
    #   "remove groceries"
    # ---------------------------------------------------
    if any(k in lower for k in ["delete", "remove", "cancel"]):
        target = _extract_after_keywords(text, ["delete", "remove", "cancel"])
        if not target:
            target = text

        task, mode, matches = await resolve_task(target)

        if mode == "ambiguous":
            lines = "\n".join(_format_task_line(t) for t in matches)
            return {
                "response": f"I found multiple matches. Which one should I delete?\n{lines}\nReply like: 'Delete task #ID'",
                "tool_calls": [{"tool": "delete_task", "status": "needs_clarification"}]
            }

        if not task:
            return {
                "response": "I couldn’t find that task. Try 'Delete task #3' or 'Delete <exact title>'.",
                "tool_calls": [{"tool": "delete_task", "status": "not_found"}]
            }

        await session.delete(task)
        await session.commit()

        return {
            "response": f"🗑️ Task deleted: {task.title} (#{task.id})",
            "tool_calls": [{"tool": "delete_task", "task_id": task.id, "title": task.title}]
        }

    # ---------------------------------------------------
    # 5) UPDATE TASK (by id or title)
    # Examples:
    #   "update task 3 to buy fruits"
    #   "change groceries to buy groceries and fruits"
    # ---------------------------------------------------
    if any(k in lower for k in ["update", "change", "rename"]):
        # Parse something like:
        # "update task 3 to NEW TITLE"
        # "change groceries to NEW TITLE"
        parts = re.split(r"\bto\b", text, maxsplit=1, flags=re.IGNORECASE)
        if len(parts) < 2:
            return {
                "response": "Tell me what to change it to. Example: 'Update task #3 to Buy fruits'.",
                "tool_calls": [{"tool": "update_task", "status": "needs_new_title"}]
            }

        left = parts[0]
        new_title = parts[1].strip(" :.-")
        if not new_title:
            return {
                "response": "What should the new title be?",
                "tool_calls": [{"tool": "update_task", "status": "needs_new_title"}]
            }

        # Determine target from left side after keywords
        target = _extract_after_keywords(left, ["update", "change", "rename"])
        if not target:
            target = left

        task, mode, matches = await resolve_task(target)

        if mode == "ambiguous":
            lines = "\n".join(_format_task_line(t) for t in matches)
            return {
                "response": f"I found multiple matches. Which one should I update?\n{lines}\nReply like: 'Update task #ID to {new_title}'",
                "tool_calls": [{"tool": "update_task", "status": "needs_clarification"}]
            }

        if not task:
            return {
                "response": "I couldn’t find that task to update. Try 'Update task #3 to ...' or 'Update <exact title> to ...'.",
                "tool_calls": [{"tool": "update_task", "status": "not_found"}]
            }

        old_title = task.title
        task.title = new_title
        session.add(task)
        await session.commit()

        return {
            "response": f"✏️ Updated task (#{task.id}): '{old_title}' → '{task.title}'",
            "tool_calls": [{"tool": "update_task", "task_id": task.id, "old_title": old_title, "title": task.title}]
        }

    # ---------------------------------------------------
    # FALLBACK
    # ---------------------------------------------------
    return {
        "response": "I can manage your tasks. Try:\n- Add a task to buy milk\n- Show my pending tasks\n- Complete task #3\n- Delete task #3\n- Update task #3 to Call mom",
        "tool_calls": []
    }

import sys
print("✅✅ ACTIVE FILE: backend/routes/chat.py LOADED ✅✅", file=sys.stderr, flush=True)

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession
from database.connection import get_async_session
from models import Conversation, Message
from ai_agents.dev_runner import dev_run

router = APIRouter(prefix="/api")


class ChatPayload(BaseModel):
    message: str
    conversation_id: Optional[int] = None  # ✅ must be int in DB


@router.post("/{user_id}/chat")
async def chat(
    user_id: str,
    payload: ChatPayload,  # ✅ IMPORTANT: not dict
    session: AsyncSession = Depends(get_async_session),
):
    # Debug proof (you should see this in backend console)
    print(
        "✅ chat() HIT | conversation_id:",
        payload.conversation_id,
        "| type:",
        type(payload.conversation_id),
        flush=True,
    )

    message_text = payload.message

    # ✅ Get or create conversation
    if payload.conversation_id is not None:
        conversation = await session.get(Conversation, payload.conversation_id)
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
    else:
        conversation = Conversation(user_id=user_id)
        session.add(conversation)
        await session.commit()
        await session.refresh(conversation)

    # ✅ Save user message
    user_msg = Message(
        user_id=user_id,
        conversation_id=conversation.id,
        role="user",
        content=message_text,
    )
    session.add(user_msg)
    await session.commit()

    # ✅ Run agent
    result = await dev_run(message_text, user_id, session)

    # ✅ Save assistant message
    assistant_msg = Message(
        user_id=user_id,
        conversation_id=conversation.id,
        role="assistant",
        content=result["response"],
    )
    session.add(assistant_msg)
    await session.commit()

    return {
        "conversation_id": conversation.id,   # int
        "response": result["response"],
        "tool_calls": result.get("tool_calls", []),
    }
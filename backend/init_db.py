from sqlmodel import SQLModel
from database.connection import async_engine
from models import Task, User, Conversation, Message

import asyncio

async def create_tables():
    print("Creating database tables...")
    async with async_engine.begin() as conn:
        # For SQLite, we need to use the sync method differently
        await conn.run_sync(lambda sync_conn: SQLModel.metadata.create_all(sync_conn))
    print("Tables created successfully!")

if __name__ == "__main__":
    asyncio.run(create_tables())
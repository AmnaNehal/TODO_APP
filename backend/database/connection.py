from sqlmodel import create_engine, Session
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from typing import AsyncGenerator
import os
from dotenv import load_dotenv
from urllib.parse import urlparse, parse_qs, urlencode, urlunparse

# Load environment variables
load_dotenv()

# Database URL from environment - reload to ensure it gets the updated value
DATABASE_URL = os.getenv("DATABASE_URL")
print(f"Using database URL: {DATABASE_URL}")  # Debugging line

# Create async engine
# Handle different database types and clean up unsupported parameters for asyncpg
if DATABASE_URL:
    if DATABASE_URL.startswith("sqlite:///"):
        # For SQLite, use the aiosqlite driver
        DATABASE_URL = DATABASE_URL.replace("sqlite:///", "sqlite+aiosqlite:///", 1)
        print(f"Converted to: {DATABASE_URL}")  # Debugging line
    elif not DATABASE_URL.startswith("postgresql+asyncpg"):
        # For PostgreSQL, ensure it uses asyncpg driver
        if DATABASE_URL.startswith("postgresql://"):
            # Parse the URL to remove unsupported parameters for asyncpg
            parsed = urlparse(DATABASE_URL)

            # Parse query parameters
            query_params = parse_qs(parsed.query)

            # Remove parameters not supported by asyncpg
            query_params.pop('channel_binding', None)
            query_params.pop('sslmode', None)

            # Reconstruct the query string without unsupported parameters
            new_query = urlencode(query_params, doseq=True)

            # Reconstruct the URL
            cleaned_url = urlunparse((
                parsed.scheme,
                parsed.netloc,
                parsed.path,
                parsed.params,
                new_query,
                parsed.fragment
            ))

            # Replace with asyncpg driver
            DATABASE_URL = cleaned_url.replace("postgresql://", "postgresql+asyncpg://", 1)
            print(f"Cleaned and converted to: {DATABASE_URL}")  # Debugging line
        elif DATABASE_URL.startswith("postgres://"):
            DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+asyncpg://", 1)

async_engine = create_async_engine(DATABASE_URL)

# Create async session maker
AsyncSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False,   # ✅ ADD THIS
)


# Dependency for getting async session
async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session
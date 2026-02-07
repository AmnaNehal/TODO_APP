from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel
from passlib.context import CryptContext
import re
import uuid

from middleware.jwt_auth import create_access_token
from models import User
from database.connection import get_async_session
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

# Password hashing (bcrypt)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

router = APIRouter()

# -------------------------
# Helpers
# -------------------------

def normalize_password(password: str) -> str:
    """
    bcrypt supports max 72 BYTES (not chars).
    We ENFORCE this consistently for both register & login.
    """
    password = password.strip()
    password_bytes = password.encode("utf-8")

    if len(password_bytes) > 72:
        raise HTTPException(
            status_code=400,
            detail="Password too long (max 72 bytes)"
        )

    return password


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def validate_email(email: str) -> bool:
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


# -------------------------
# Schemas
# -------------------------

class UserCreate(BaseModel):
    email: str
    password: str
    name: str


class UserLogin(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: str
    email: str
    name: str


class AuthResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


# -------------------------
# Routes
# -------------------------

@router.post("/auth/register", response_model=AuthResponse)
async def register(
    user_data: UserCreate,
    session: AsyncSession = Depends(get_async_session)
):
    # Email validation
    if not validate_email(user_data.email):
        raise HTTPException(
            status_code=422,
            detail="Invalid email format"
        )

    # Password length validation (characters)
    if len(user_data.password.strip()) < 6:
        raise HTTPException(
            status_code=422,
            detail="Password must be at least 6 characters long"
        )

    # Normalize password (bcrypt-safe)
    password = normalize_password(user_data.password)

    # Check existing user
    result = await session.execute(
        select(User).where(User.email == user_data.email)
    )
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=409,
            detail="User with this email already exists"
        )

    # Create user
    user = User(
        id=str(uuid.uuid4()),
        email=user_data.email,
        name=user_data.name,
        password_hash=get_password_hash(password)
    )

    session.add(user)
    await session.commit()
    await session.refresh(user)

    # JWT
    access_token = create_access_token(
        data={"id": user.id, "email": user.email}
    )

    return AuthResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(
            id=user.id,
            email=user.email,
            name=user.name
        )
    )


@router.post("/auth/login", response_model=AuthResponse)
async def login(
    user_data: UserLogin,
    session: AsyncSession = Depends(get_async_session)
):
    # Normalize password (same logic as register)
    password = normalize_password(user_data.password)

    # Fetch user
    result = await session.execute(
        select(User).where(User.email == user_data.email)
    )
    user = result.scalar_one_or_none()

    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(
        data={"id": user.id, "email": user.email}
    )

    return AuthResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(
            id=user.id,
            email=user.email,
            name=user.name
        )
    )


@router.post("/auth/logout")
async def logout():
    return {"message": "Successfully logged out"}
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
from typing import Optional

# Set up password hashing with bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

router = APIRouter()

# Pydantic models for request/response
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

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    # Truncate password to 72 bytes to comply with bcrypt limits
    # Ensure we're counting bytes, not characters (for Unicode safety)
    password_bytes = password.encode('utf-8')
    if len(password_bytes) > 72:
        # Truncate to 72 bytes and decode back to string
        truncated_bytes = password_bytes[:72]
        truncated_password = truncated_bytes.decode('utf-8', errors='ignore')
    else:
        truncated_password = password

    return pwd_context.hash(truncated_password)

def validate_email(email: str) -> bool:
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

@router.post("/auth/register", response_model=AuthResponse)
async def register(user_data: UserCreate, session: AsyncSession = Depends(get_async_session)):
    # Validate email format
    if not validate_email(user_data.email):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Invalid email format"
        )

    # Validate password strength (at least 6 characters)
    if len(user_data.password) < 6:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Password must be at least 6 characters long"
        )

    # Check if user already exists in the database
    existing_user = await session.execute(select(User).where(User.email == user_data.email))
    existing_user = existing_user.scalar_one_or_none()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User with this email already exists"
        )

    # Hash the password
    password_hash = get_password_hash(user_data.password)

    # Create new user in the database
    user = User(
        id=str(uuid.uuid4()),
        email=user_data.email,
        name=user_data.name,
        password_hash=password_hash
    )

    session.add(user)
    await session.commit()
    await session.refresh(user)

    # Create access token
    access_token = create_access_token(data={"id": user.id, "email": user.email})

    return AuthResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(id=user.id, email=user.email, name=user.name)
    )

@router.post("/auth/login", response_model=AuthResponse)
async def login(user_data: UserLogin, session: AsyncSession = Depends(get_async_session)):
    # Check if user exists in the database
    user_result = await session.execute(select(User).where(User.email == user_data.email))
    user = user_result.scalar_one_or_none()

    if not user or not verify_password(user_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create access token
    access_token = create_access_token(data={"id": user.id, "email": user.email})

    return AuthResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(id=user.id, email=user.email, name=user.name)
    )

@router.post("/auth/logout")
async def logout():
    # In a real application, you might add the token to a blacklist
    return {"message": "Successfully logged out"}



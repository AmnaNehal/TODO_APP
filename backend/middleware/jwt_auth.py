from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Dict, Any
import os
from dotenv import load_dotenv
from jose import JWTError, jwt
from datetime import datetime, timedelta
import uuid

# Load environment variables
load_dotenv()

# Get the secret key from environment
SECRET_KEY = os.getenv("JWT_SECRET") or os.getenv("BETTER_AUTH_SECRET")
if not SECRET_KEY:
    raise RuntimeError("Missing JWT secret: set JWT_SECRET (K8s) or BETTER_AUTH_SECRET (.env)")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_DAYS", 7)) * 24 * 60  # Convert days to minutes

security = HTTPBearer()

def verify_token(token: str) -> Dict[str, Any]:
    """
    Verify the JWT token and return the payload if valid
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("id")
        if user_id is None:
            raise credentials_exception
        return payload
    except JWTError:
        raise credentials_exception

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
    """
    Get the current user from the JWT token
    """
    token = credentials.credentials
    user = verify_token(token)
    return user

def create_access_token(data: dict, expires_delta: timedelta = None):
    """
    Create a new access token
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
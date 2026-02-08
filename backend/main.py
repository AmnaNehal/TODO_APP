from routes.chat import router as chat_router
from routes.tasks import router as tasks_router
from routes.auth import router as auth_router
import logging
import sys
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Ensure project root is on path (Windows safe)
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

app = FastAPI(title="Todo API", version="1.0.0")




# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://todo-taskmate.vercel.app",
        "http://127.0.0.1:3000", "http://localhost:3000",
        "http://127.0.0.1:57382", 
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Include routes

app.include_router(auth_router)               # Auth routes at root level
app.include_router(tasks_router, prefix="/api")  # Task routes under /api
# Chat routes already include /api prefix internally
app.include_router(chat_router)


@app.get("/")
def read_root():
    return {"message": "Todo API is running!"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}

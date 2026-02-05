# Quickstart Guide: Todo Full-Stack Multi-User Web Application

## Prerequisites

- Node.js 18+ installed
- Python 3.11+ installed
- Docker and Docker Compose installed
- Access to Neon PostgreSQL account

## Initial Setup

### 1. Clone and Initialize Repository

```bash
# Create the project directory structure
mkdir hackathon-todo
cd hackathon-todo

# Initialize the project with the required structure
mkdir -p backend frontend
```

### 2. Environment Configuration

Create the required environment files:

**frontend/.env.local**:
```env
BETTER_AUTH_SECRET=your-generated-secret-here
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**backend/.env**:
```env
DATABASE_URL=postgresql+psycopg://username:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require
BETTER_AUTH_SECRET=your-generated-secret-here
JWT_ALGORITHM=HS256
JWT_EXPIRE_DAYS=7
```

**Note**: The `BETTER_AUTH_SECRET` value must be identical in both files.

### 3. Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a Python virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Create requirements.txt:
```txt
fastapi==0.104.1
uvicorn==0.24.0
sqlmodel==0.0.16
pydantic==2.5.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
neon==0.1.0
asyncpg==0.29.0
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

### 4. Frontend Setup

1. Navigate to the frontend directory:
```bash
cd ../frontend
```

2. Initialize Next.js project:
```bash
npm create next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

3. Install additional dependencies:
```bash
npm install @better-auth/react @better-auth/client better-auth
```

## Running the Application

### Option 1: Using Docker Compose (Recommended)

1. Create docker-compose.yml in the project root:
```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    env_file:
      - ./backend/.env
    volumes:
      - ./backend:/app
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}
      - JWT_ALGORITHM=${JWT_ALGORITHM}
      - JWT_EXPIRE_DAYS=${JWT_EXPIRE_DAYS}

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    env_file:
      - ./frontend/.env.local
    volumes:
      - ./frontend:/app
      - /app/node_modules
    environment:
      - NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
      - BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}
      - BETTER_AUTH_URL=${BETTER_AUTH_URL}
    depends_on:
      - backend
```

2. Create Dockerfiles for each service:

**backend/Dockerfile**:
```Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
```

**frontend/Dockerfile**:
```Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
```

3. Start the services:
```bash
docker-compose up --build
```

### Option 2: Manual Startup

1. Terminal 1 - Start Backend:
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
uvicorn main:app --reload --port 8000
```

2. Terminal 2 - Start Frontend:
```bash
cd frontend
npm run dev
```

## API Endpoints

Once running, the backend API will be available at http://localhost:8000 with the following endpoints:

- `GET /api/tasks` - Get all tasks for authenticated user
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/{task_id}` - Get a specific task
- `PUT /api/tasks/{task_id}` - Update a task
- `PATCH /api/tasks/{task_id}` - Toggle task completion
- `DELETE /api/tasks/{task_id}` - Delete a task

The Swagger documentation will be available at http://localhost:8000/docs

## Authentication Flow

1. User registers at `/register` or logs in at `/login`
2. Better Auth generates JWT token
3. Frontend stores token and includes it in Authorization header for API calls
4. Backend verifies JWT and extracts user ID
5. Backend filters tasks by authenticated user ID

## Troubleshooting

- **Port conflicts**: Change ports in docker-compose.yml or startup commands
- **Environment variables**: Ensure both .env files have matching BETTER_AUTH_SECRET
- **Database connection**: Verify Neon PostgreSQL connection string is correct
- **Dependency issues**: Check that all required packages are installed in both frontend and backend
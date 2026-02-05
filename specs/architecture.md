# Architecture Specification - Todo Full-Stack Multi-User Web Application

## System Architecture

The application follows a modern three-tier architecture:

### Frontend Tier
- **Technology**: Next.js 16+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Better Auth integration
- **API Communication**: REST API calls to backend

### Backend Tier
- **Technology**: FastAPI
- **Language**: Python
- **Database ORM**: SQLModel
- **Authentication**: JWT token verification using Better Auth shared secret
- **API Design**: RESTful endpoints

### Data Tier
- **Database**: Neon Serverless PostgreSQL
- **Authentication Data**: User accounts managed by Better Auth
- **Application Data**: Tasks with user ownership

## Component Interactions

1. **Frontend-Backend Communication**:
   - Frontend makes authenticated API calls to backend
   - All API requests include JWT in Authorization header
   - Backend validates JWT and enforces user permissions

2. **Authentication Flow**:
   - Better Auth handles user registration/login
   - JWT tokens issued to authenticated users
   - Backend verifies JWT tokens using shared secret

3. **Data Access**:
   - Backend enforces user data isolation
   - Tasks are filtered by authenticated user ID
   - All database operations use SQLModel ORM

## Deployment Architecture

- Local development environment with separate frontend (port 3000) and backend (port 8000)
- External Neon PostgreSQL database (not containerized locally)
- Environment variables for configuration management
- Docker Compose for simplified local development setup
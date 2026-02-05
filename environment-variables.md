# Environment Variables Configuration

This document details all environment variables used in the Todo application and how to properly configure them.

## Overview

The Todo application uses environment variables to manage configuration, secrets, and deployment-specific settings. These are stored in separate files for frontend and backend to maintain security and flexibility.

## Required Environment Variables

### Backend (.env file)
Located in `backend/.env`:

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `DATABASE_URL` | PostgreSQL database connection string | `postgresql://user:pass@host:5432/dbname` | Yes |
| `BETTER_AUTH_SECRET` | Secret key for JWT signing and authentication | `your-super-secret-key-here` | Yes |
| `JWT_ALGORITHM` | Algorithm for JWT signing | `HS256` | Yes |
| `JWT_EXPIRE_DAYS` | Number of days before JWT tokens expire | `7` | Yes |

### Frontend (.env.local file)
Located in `frontend/.env.local`:

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `BETTER_AUTH_URL` | Frontend URL for Better Auth | `http://localhost:3000` | Yes |
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:8000` | Yes |
| `BETTER_AUTH_SECRET` | **Must match backend secret** | `your-super-secret-key-here` | Yes |

## Critical Security Notes

### Shared Secret Requirements
- `BETTER_AUTH_SECRET` **must be identical** in both frontend and backend
- Use a strong, randomly generated secret (at least 32 characters)
- Never commit secrets to version control
- Use different secrets for development, staging, and production

### Example Secret Generation
```bash
# Generate a secure secret
openssl rand -base64 32
```

## Configuration Validation

### Validation Checklist
- [ ] `BETTER_AUTH_SECRET` is identical in both `.env` and `.env.local`
- [ ] `DATABASE_URL` is properly formatted and accessible
- [ ] `NEXT_PUBLIC_API_URL` matches the backend server address
- [ ] `BETTER_AUTH_URL` matches the frontend server address
- [ ] No secrets are exposed in client-side code
- [ ] Environment variables are loaded correctly in both environments

### Testing Configuration
1. Start the backend server
2. Verify it can connect to the database
3. Start the frontend server
4. Test user registration/login functionality
5. Verify API calls work with proper authentication
6. Confirm data isolation between users

## Common Configuration Issues

### Issue: Authentication Fails
**Cause**: `BETTER_AUTH_SECRET` mismatch between frontend and backend
**Solution**: Ensure both environment files have the same secret value

### Issue: Database Connection Fails
**Cause**: Incorrect `DATABASE_URL` format or database not accessible
**Solution**: Verify connection string format and database accessibility

### Issue: API Calls Fail
**Cause**: `NEXT_PUBLIC_API_URL` incorrect or backend not running
**Solution**: Check backend URL and ensure server is running

## Environment-Specific Configurations

### Development
```env
# backend/.env
DATABASE_URL=postgresql://localhost:5432/todoapp_dev
BETTER_AUTH_SECRET=dev-super-secret-key-change-in-production
JWT_ALGORITHM=HS256
JWT_EXPIRE_DAYS=7

# frontend/.env.local
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000
BETTER_AUTH_SECRET=dev-super-secret-key-change-in-production
```

### Production
```env
# backend/.env
DATABASE_URL=your_production_database_url
BETTER_AUTH_SECRET=your_production_secret
JWT_ALGORITHM=HS256
JWT_EXPIRE_DAYS=7

# frontend/.env.local
BETTER_AUTH_URL=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
BETTER_AUTH_SECRET=your_production_secret
```

## Docker Configuration

When using Docker Compose, environment variables are loaded from the root `.env` file:

```env
# Root .env file for Docker
DATABASE_URL=postgresql://user:password@neon-db-host:5432/todoapp
BETTER_AUTH_SECRET=your-super-secret-key-here
JWT_ALGORITHM=HS256
JWT_EXPIRE_DAYS=7
NEXT_PUBLIC_API_URL=http://localhost:8000
BETTER_AUTH_URL=http://localhost:3000
```

## Security Best Practices

1. **Never commit secrets** to version control
2. Use `.gitignore` to exclude `.env` files:
   ```
   # .gitignore
   **/.env
   **/.env.local
   ```
3. Use different secrets for each environment
4. Regularly rotate secrets in production
5. Use environment variable managers in production deployments
6. Validate environment variables on application startup

## Troubleshooting

### How to Verify Configuration
1. Check that all required environment variables are set
2. Verify the application starts without configuration errors
3. Test authentication and API functionality
4. Confirm data isolation works properly between users

### Debug Environment Variables
Add temporary logging in development only to verify variables are loaded:
```python
# In backend (NEVER in production!)
import os
print(f"Database URL loaded: {bool(os.getenv('DATABASE_URL'))}")
print(f"Auth secret loaded: {bool(os.getenv('BETTER_AUTH_SECRET'))}")
```

**Important**: Remove any debug logging of secrets before deploying to production.
# Developer Guide

## Environment Setup

1. Copy `.env.example` to `.env` and configure your environment variables
2. Change the `JWT_SECRET` to a strong, random secret for production
3. Update Supabase credentials with your project details

## Security Best Practices

- Never commit sensitive information like JWT secrets or API keys to version control
- Always use strong, randomly generated secrets for JWT tokens in production
- Regularly rotate secrets and API keys
- Use environment-specific configuration files

## Code Structure

- Controllers handle business logic and error handling
- Middleware handles authentication and authorization
- Routes define API endpoints and middleware chains
- Models define data structures and validation schemas
- Utils contain helper functions and error handlers
- Docs contain API documentation schemas

## Error Handling

- All controllers should use the `asyncHandler` wrapper
- Errors should be logged with sufficient context for debugging
- User-facing error messages should be clear but not expose sensitive information
- Supabase errors should be handled specifically when possible

## API Documentation

- Documentation is split into modular schema files for maintainability
- Each route file contains Swagger annotations for endpoints
- Schema definitions are organized by entity type

## Development Workflow

1. Create feature branches for new functionality
2. Write tests for new features
3. Follow the existing code style and patterns
4. Update documentation when making API changes
5. Run linting and formatting checks before committing

## Testing

- Unit tests should be written for critical business logic
- Integration tests should cover API endpoints
- Test coverage should be maintained above 80%

## Deployment

- Ensure all environment variables are properly configured
- Run database migrations before deploying new versions
- Monitor logs for errors after deployment
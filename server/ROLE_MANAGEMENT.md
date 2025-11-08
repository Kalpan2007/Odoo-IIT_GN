# Role Management System Implementation

## Overview
This document describes the implementation of a role management system that allows users to request role changes and administrators to approve or reject these requests.

## Features Implemented

### 1. Default Role Assignment
- All new users are automatically assigned the `team_member` role
- Users cannot select their role during signup
- Only administrators can change user roles

### 2. Role Change Requests
- Users can request to change their role to `project_manager`
- Requests include a reason for the change
- Users can only have one pending request at a time
- Users cannot request a role they already have

### 3. Administrator Approval
- Administrators can view all role requests
- Administrators can approve or reject requests
- When a request is approved, the user's role is automatically updated
- Request status tracking (pending, approved, rejected)

### 4. Database Schema
- Added `role_requests` table to track role change requests
- Added proper foreign key relationships
- Added indexes for better query performance

## API Endpoints

### Create Role Request
```
POST /api/role-requests
Authorization: Bearer <token>
Content-Type: application/json

{
  "requested_role": "project_manager",
  "reason": "Need project management access"
}
```

### Get All Role Requests (Admin Only)
```
GET /api/role-requests
Authorization: Bearer <token>
```

### Get User's Role Requests
```
GET /api/role-requests/my
Authorization: Bearer <token>
```

### Update Role Request Status (Admin Only)
```
PUT /api/role-requests/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "approved"  // or "rejected"
}
```

## Frontend Integration

### Settings Page
- Users can view their current role
- Users can request role changes through a form
- Form includes role selection and reason field
- Success/error feedback for submissions

### Role Display
- Roles are displayed in a user-friendly format
- Proper capitalization and spacing

## Security Considerations

### Authentication
- All endpoints require valid JWT authentication
- Role-based access control for administrative functions
- Proper error handling for unauthorized access

### Data Validation
- Input validation for all request parameters
- Role validation to prevent invalid role assignments
- Status validation for request updates

### Error Handling
- Comprehensive error handling for all operations
- User-friendly error messages
- Proper logging for debugging

## Testing

### Database Testing
- SQL scripts provided for testing role request functionality
- Sample data included for verification
- Cleanup scripts for test data

### API Testing
- All endpoints tested with proper error handling
- Edge cases covered (duplicate requests, invalid roles, etc.)

## Future Enhancements

### Additional Roles
- Support for requesting `admin` role (with additional approval steps)
- Custom role definitions

### Notification System
- Email notifications for request submissions
- Email notifications for approval/rejection
- In-app notifications

### Request Management
- Request history with timestamps
- Ability to cancel pending requests
- Comments on requests for communication

### Audit Trail
- Detailed logging of all role changes
- Reason tracking for all changes
- User activity monitoring
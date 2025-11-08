-- Test script for role requests functionality

-- Create a test user
INSERT INTO users (id, email, password) 
VALUES ('11111111-1111-1111-1111-111111111111', 'test-role-request@example.com', 'Test#1234')
ON CONFLICT (email) DO NOTHING;

-- Create a test profile
INSERT INTO profiles (id, email, full_name, role) 
VALUES ('11111111-1111-1111-1111-111111111111', 'test-role-request@example.com', 'Test User', 'team_member')
ON CONFLICT (id) DO NOTHING;

-- Create a test role request
INSERT INTO role_requests (id, user_id, current_role, requested_role, reason, status)
VALUES ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'team_member', 'project_manager', 'Need project management access for new project', 'pending')
ON CONFLICT (id) DO NOTHING;

-- Verify the role request was created
SELECT * FROM role_requests WHERE user_id = '11111111-1111-1111-1111-111111111111';

-- Update the role request status to approved
UPDATE role_requests 
SET status = 'approved', updated_at = NOW() 
WHERE id = '22222222-2222-2222-2222-222222222222';

-- Update the user's role
UPDATE profiles 
SET role = 'project_manager' 
WHERE id = '11111111-1111-1111-1111-111111111111';

-- Verify the updates
SELECT p.full_name, p.role, rr.status, rr.requested_role 
FROM profiles p 
JOIN role_requests rr ON p.id = rr.user_id 
WHERE p.id = '11111111-1111-1111-1111-111111111111';

-- Cleanup test data
-- DELETE FROM role_requests WHERE user_id = '11111111-1111-1111-1111-111111111111';
-- DELETE FROM profiles WHERE id = '11111111-1111-1111-1111-111111111111';
-- DELETE FROM users WHERE id = '11111111-1111-1111-1111-111111111111';
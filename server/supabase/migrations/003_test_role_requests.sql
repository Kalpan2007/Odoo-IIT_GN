-- Test script for role requests functionality

-- Test data for role requests functionality
-- This data is used for testing the role request feature

-- Insert a test role request
-- Note: This requires a valid user ID from the profiles table
INSERT INTO role_requests (id, user_id, current_user_role, requested_role, reason, status)
VALUES 
  ('11111111-1111-1111-1111-111111111111', '550e8400-e29b-41d4-a716-446655440003', 'team_member', 'project_manager', 'Requesting project manager access for new project', 'pending');

-- Verify the insertion
SELECT * FROM role_requests WHERE id = '11111111-1111-1111-1111-111111111111';

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
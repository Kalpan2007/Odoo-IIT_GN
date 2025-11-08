-- Add missing role_requests table
-- This migration adds the role_requests table that was missing from the latest schema

-- Create role_requests table
CREATE TABLE role_requests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    current_role text NOT NULL CHECK (current_role IN ('admin', 'project_manager', 'team_member')),
    requested_role text NOT NULL CHECK (requested_role IN ('admin', 'project_manager', 'team_member')),
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    reason text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX idx_role_requests_user_id ON role_requests(user_id);
CREATE INDEX idx_role_requests_status ON role_requests(status);
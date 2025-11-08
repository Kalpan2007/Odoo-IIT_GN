-- ==========================================
-- SAMPLE DATA
-- ==========================================

-- Insert sample users
INSERT INTO users (id, email, password) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'admin@example.com', crypt('Admin#1234', gen_salt('bf'))),
('550e8400-e29b-41d4-a716-446655440002', 'pm@example.com', crypt('Manager#1234', gen_salt('bf'))),
('550e8400-e29b-41d4-a716-446655440003', 'dev@example.com', crypt('Dev#1234', gen_salt('bf')))
ON CONFLICT (email) DO NOTHING;

-- Insert sample profiles
INSERT INTO profiles (id, email, full_name, role) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'admin@example.com', 'John Admin', 'admin'),
('550e8400-e29b-41d4-a716-446655440002', 'pm@example.com', 'Sarah Manager', 'project_manager'),
('550e8400-e29b-41d4-a716-446655440003', 'dev@example.com', 'Mike Developer', 'team_member')
ON CONFLICT (id) DO NOTHING;

-- Insert sample projects
INSERT INTO projects (id, name, client, start_date, end_date, budget, status, description, created_by) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'Website Redesign', 'Acme Corp', '2024-01-01', '2024-06-30', 50000.00, 'in_progress', 'Complete redesign of company website', '550e8400-e29b-41d4-a716-446655440002'),
('650e8400-e29b-41d4-a716-446655440002', 'Mobile App Development', 'Beta LLC', '2024-02-01', '2024-08-31', 75000.00, 'planning', 'Develop iOS and Android mobile application', '550e8400-e29b-41d4-a716-446655440002')
ON CONFLICT (id) DO NOTHING;

-- Insert sample tasks
INSERT INTO tasks (id, title, description, project_id, assigned_to, status, priority, estimated_hours, due_date, created_by) VALUES
('750e8400-e29b-41d4-a716-446655440001', 'Design Homepage', 'Create wireframes and mockups for homepage', '650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'in_progress', 'high', 20.00, '2024-01-15', '550e8400-e29b-41d4-a716-446655440002'),
('750e8400-e29b-41d4-a716-446655440002', 'Setup Development Environment', 'Configure local development environment', '650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'completed', 'medium', 8.00, '2024-01-05', '550e8400-e29b-41d4-a716-446655440002')
ON CONFLICT (id) DO NOTHING;

-- Insert sample timesheets
INSERT INTO timesheets (id, user_id, project_id, task_id, description, hours, rate, date, billable, approved) VALUES
('850e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', 'Worked on homepage design', 4.50, 50.00, '2024-01-10', true, true),
('850e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', 'Homepage design revisions', 3.25, 50.00, '2024-01-11', true, true)
ON CONFLICT (id) DO NOTHING;

-- Insert sample sales orders
INSERT INTO sales_orders (id, order_number, client, project_id, amount, status, order_date, delivery_date, description, created_by) VALUES
('950e8400-e29b-41d4-a716-446655440001', 'SO-001', 'Acme Corp', '650e8400-e29b-41d4-a716-446655440001', 50000.00, 'accepted', '2024-01-01', '2024-06-30', 'Website redesign project', '550e8400-e29b-41d4-a716-446655440002')
ON CONFLICT (id) DO NOTHING;

-- Insert sample purchases
INSERT INTO purchases (id, purchase_number, vendor, project_id, amount, status, order_date, delivery_date, description, created_by) VALUES
('a50e8400-e29b-41d4-a716-446655440001', 'PO-001', 'Design Software Inc', '650e8400-e29b-41d4-a716-446655440001', 2500.00, 'paid', '2024-01-02', '2024-01-10', 'Software licenses for design team', '550e8400-e29b-41d4-a716-446655440002')
ON CONFLICT (id) DO NOTHING;

-- Insert sample expenses
INSERT INTO expenses (id, title, amount, category, project_id, description, expense_date, approved, created_by) VALUES
('b50e8400-e29b-41d4-a716-446655440001', 'Office Supplies', 150.00, 'Office', '650e8400-e29b-41d4-a716-446655440001', 'Printer ink and paper', '2024-01-03', true, '550e8400-e29b-41d4-a716-446655440002')
ON CONFLICT (id) DO NOTHING;

-- Insert sample invoices
INSERT INTO invoices (id, invoice_number, client, project_id, amount, tax_amount, total_amount, status, issue_date, due_date, description, created_by) VALUES
('c50e8400-e29b-41d4-a716-446655440001', 'INV-001', 'Acme Corp', '650e8400-e29b-41d4-a716-446655440001', 10000.00, 1000.00, 11000.00, 'sent', '2024-01-15', '2024-02-15', 'First milestone payment', '550e8400-e29b-41d4-a716-446655440002')
ON CONFLICT (id) DO NOTHING;
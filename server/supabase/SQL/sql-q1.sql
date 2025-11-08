-- OneFlow (Plan-to-Bill) Database Schema (Fixed Version)
-- Compatible with Supabase or Local PostgreSQL

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- USERS & PROFILES
-- ==========================================

-- Local replacement for Supabase auth.users (for testing/dev)
CREATE TABLE users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text UNIQUE NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- User profiles table
CREATE TABLE profiles (
    id uuid REFERENCES users(id) PRIMARY KEY,
    email text UNIQUE NOT NULL,
    full_name text,
    role text DEFAULT 'team_member' CHECK (role IN ('admin', 'project_manager', 'team_member')),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- ==========================================
-- PROJECTS
-- ==========================================
CREATE TABLE projects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    client text NOT NULL,
    start_date date NOT NULL,
    end_date date,
    budget numeric(12,2) NOT NULL,
    status text DEFAULT 'planning' CHECK (status IN ('planning', 'in_progress', 'completed', 'on_hold', 'cancelled')),
    description text,
    revenue numeric(12,2) DEFAULT 0,
    cost numeric(12,2) DEFAULT 0,
    profit numeric(12,2) DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    created_by uuid REFERENCES users(id) NOT NULL
);

-- ==========================================
-- TASKS
-- ==========================================
CREATE TABLE tasks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text,
    project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
    assigned_to uuid REFERENCES users(id),
    status text DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'review', 'completed')),
    priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    estimated_hours numeric(8,2),
    actual_hours numeric(8,2),
    due_date date,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    created_by uuid REFERENCES users(id) NOT NULL
);

-- ==========================================
-- TIMESHEETS
-- ==========================================
CREATE TABLE timesheets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES users(id) NOT NULL,
    project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
    task_id uuid REFERENCES tasks(id) ON DELETE SET NULL,
    description text NOT NULL,
    hours numeric(8,2) NOT NULL,
    rate numeric(8,2),
    date date NOT NULL,
    billable boolean DEFAULT true,
    approved boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- ==========================================
-- SALES ORDERS
-- ==========================================
CREATE TABLE sales_orders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number text UNIQUE NOT NULL,
    client text NOT NULL,
    project_id uuid REFERENCES projects(id),
    amount numeric(12,2) NOT NULL,
    status text DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'completed', 'cancelled')),
    order_date date NOT NULL,
    delivery_date date,
    description text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    created_by uuid REFERENCES users(id) NOT NULL
);

CREATE TABLE sales_order_lines (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    sales_order_id uuid REFERENCES sales_orders(id) ON DELETE CASCADE,
    item_name text NOT NULL,
    description text,
    quantity numeric(10,2) NOT NULL DEFAULT 1,
    unit_price numeric(10,2) NOT NULL,
    total_price numeric(12,2) NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- ==========================================
-- PURCHASES
-- ==========================================
CREATE TABLE purchases (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    purchase_number text UNIQUE NOT NULL,
    vendor text NOT NULL,
    project_id uuid REFERENCES projects(id),
    amount numeric(12,2) NOT NULL,
    status text DEFAULT 'draft' CHECK (status IN ('draft', 'ordered', 'received', 'paid', 'cancelled')),
    order_date date NOT NULL,
    delivery_date date,
    description text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    created_by uuid REFERENCES users(id) NOT NULL
);

CREATE TABLE purchase_lines (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    purchase_id uuid REFERENCES purchases(id) ON DELETE CASCADE,
    item_name text NOT NULL,
    description text,
    quantity numeric(10,2) NOT NULL DEFAULT 1,
    unit_price numeric(10,2) NOT NULL,
    total_price numeric(12,2) NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- ==========================================
-- EXPENSES
-- ==========================================
CREATE TABLE expenses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    amount numeric(10,2) NOT NULL,
    category text NOT NULL,
    project_id uuid REFERENCES projects(id),
    description text,
    receipt_url text,
    expense_date date NOT NULL,
    approved boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    created_by uuid REFERENCES users(id) NOT NULL
);

-- ==========================================
-- INVOICES
-- ==========================================
CREATE TABLE invoices (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number text UNIQUE NOT NULL,
    client text NOT NULL,
    project_id uuid REFERENCES projects(id),
    amount numeric(12,2) NOT NULL,
    tax_amount numeric(10,2) DEFAULT 0,
    total_amount numeric(12,2) NOT NULL,
    status text DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
    issue_date date NOT NULL,
    due_date date NOT NULL,
    description text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    created_by uuid REFERENCES users(id) NOT NULL
);

CREATE TABLE invoice_lines (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id uuid REFERENCES invoices(id) ON DELETE CASCADE,
    item_name text NOT NULL,
    description text,
    quantity numeric(10,2) NOT NULL DEFAULT 1,
    unit_price numeric(10,2) NOT NULL,
    total_price numeric(12,2) NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- ==========================================
-- SAMPLE DATA
-- ==========================================

INSERT INTO users (id, email) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'admin@oneflow.com'),
('550e8400-e29b-41d4-a716-446655440002', 'pm@oneflow.com'),
('550e8400-e29b-41d4-a716-446655440003', 'dev@oneflow.com');

INSERT INTO profiles (id, email, full_name, role) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'admin@oneflow.com', 'John Admin', 'admin'),
('550e8400-e29b-41d4-a716-446655440002', 'pm@oneflow.com', 'Sarah Manager', 'project_manager'),
('550e8400-e29b-41d4-a716-446655440003', 'dev@oneflow.com', 'Mike Developer', 'team_member');

INSERT INTO projects (id, name, client, start_date, end_date, budget, status, description, created_by) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'E-commerce Website', 'TechCorp Inc', '2024-01-15', '2024-04-15', 75000.00, 'in_progress', 'Complete e-commerce platform with payment integration', '550e8400-e29b-41d4-a716-446655440002'),
('650e8400-e29b-41d4-a716-446655440002', 'Mobile App Development', 'StartupXYZ', '2024-02-01', '2024-06-30', 120000.00, 'planning', 'Cross-platform mobile application for food delivery', '550e8400-e29b-41d4-a716-446655440002');

INSERT INTO tasks (title, description, project_id, assigned_to, status, priority, estimated_hours, due_date, created_by) VALUES
('Database Design', 'Design and implement database schema', '650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'completed', 'high', 40.0, '2024-02-01', '550e8400-e29b-41d4-a716-446655440002'),
('Frontend Development', 'Develop React frontend components', '650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'in_progress', 'high', 80.0, '2024-03-15', '550e8400-e29b-41d4-a716-446655440002'),
('API Integration', 'Integrate payment gateway APIs', '650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'todo', 'medium', 30.0, '2024-03-30', '550e8400-e29b-41d4-a716-446655440002');

INSERT INTO sales_orders (id, order_number, client, project_id, amount, status, order_date, delivery_date, description, created_by) VALUES
('750e8400-e29b-41d4-a716-446655440001', 'SO-2024-001', 'TechCorp Inc', '650e8400-e29b-41d4-a716-446655440001', 75000.00, 'accepted', '2024-01-10', '2024-04-15', 'E-commerce website development project', '550e8400-e29b-41d4-a716-446655440002');

INSERT INTO sales_order_lines (sales_order_id, item_name, description, quantity, unit_price, total_price) VALUES
('750e8400-e29b-41d4-a716-446655440001', 'Frontend Development', 'React.js frontend development', 1, 35000.00, 35000.00),
('750e8400-e29b-41d4-a716-446655440001', 'Backend Development', 'Node.js API development', 1, 25000.00, 25000.00),
('750e8400-e29b-41d4-a716-446655440001', 'Database Setup', 'PostgreSQL database design and setup', 1, 15000.00, 15000.00);

INSERT INTO purchases (id, purchase_number, vendor, project_id, amount, status, order_date, description, created_by) VALUES
('850e8400-e29b-41d4-a716-446655440001', 'PO-2024-001', 'AWS Services', '650e8400-e29b-41d4-a716-446655440001', 2500.00, 'received', '2024-01-20', 'Cloud hosting and services for 6 months', '550e8400-e29b-41d4-a716-446655440002');

INSERT INTO purchase_lines (purchase_id, item_name, description, quantity, unit_price, total_price) VALUES
('850e8400-e29b-41d4-a716-446655440001', 'EC2 Instances', 'Virtual servers for hosting', 6, 300.00, 1800.00),
('850e8400-e29b-41d4-a716-446655440001', 'RDS Database', 'Managed database service', 6, 116.67, 700.00);

INSERT INTO expenses (title, amount, category, project_id, description, expense_date, approved, created_by) VALUES
('Software Licenses', 450.00, 'Software', '650e8400-e29b-41d4-a716-446655440001', 'Development tools and licenses', '2024-01-25', true, '550e8400-e29b-41d4-a716-446655440003'),
('Client Meeting Travel', 320.00, 'Travel', '650e8400-e29b-41d4-a716-446655440001', 'Travel expenses for client meeting', '2024-02-05', true, '550e8400-e29b-41d4-a716-446655440002');

INSERT INTO timesheets (user_id, project_id, task_id, description, hours, rate, date, billable, approved) VALUES
('550e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440001', (SELECT id FROM tasks WHERE title = 'Database Design' LIMIT 1), 'Designed user authentication schema', 8.0, 75.00, '2024-01-22', true, true),
('550e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440001', (SELECT id FROM tasks WHERE title = 'Frontend Development' LIMIT 1), 'Implemented user registration component', 6.5, 75.00, '2024-02-15', true, true),
('550e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440001', (SELECT id FROM tasks WHERE title = 'Frontend Development' LIMIT 1), 'Created product catalog interface', 7.0, 75.00, '2024-02-16', true, false);

INSERT INTO invoices (id, invoice_number, client, project_id, amount, tax_amount, total_amount, status, issue_date, due_date, description, created_by) VALUES
('950e8400-e29b-41d4-a716-446655440001', 'INV-2024-001', 'TechCorp Inc', '650e8400-e29b-41d4-a716-446655440001', 25000.00, 2500.00, 27500.00, 'paid', '2024-02-01', '2024-03-01', 'First milestone payment - Database and initial setup', '550e8400-e29b-41d4-a716-446655440002'),
('950e8400-e29b-41d4-a716-446655440002', 'INV-2024-002', 'TechCorp Inc', '650e8400-e29b-41d4-a716-446655440001', 30000.00, 3000.00, 33000.00, 'sent', '2024-03-01', '2024-04-01', 'Second milestone payment - Frontend development', '550e8400-e29b-41d4-a716-446655440002');

INSERT INTO invoice_lines (invoice_id, item_name, description, quantity, unit_price, total_price) VALUES
('950e8400-e29b-41d4-a716-446655440001', 'Database Development', 'PostgreSQL schema design and implementation', 1, 15000.00, 15000.00),
('950e8400-e29b-41d4-a716-446655440001', 'Project Setup', 'Initial project setup and configuration', 1, 10000.00, 10000.00),
('950e8400-e29b-41d4-a716-446655440002', 'Frontend Components', 'React.js component development', 1, 20000.00, 20000.00),
('950e8400-e29b-41d4-a716-446655440002', 'UI/UX Implementation', 'User interface design implementation', 1, 10000.00, 10000.00);

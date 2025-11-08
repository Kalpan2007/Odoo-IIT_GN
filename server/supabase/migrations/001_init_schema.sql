-- ==========================================
-- OneFlow (Plan-to-Bill) Database Schema
-- Compatible with Supabase or Local PostgreSQL
-- ==========================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ==========================================
-- USERS & PROFILES
-- ==========================================

-- Local replacement for Supabase auth.users (for testing/dev)
CREATE TABLE users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text UNIQUE NOT NULL,
    password text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- User profiles table
CREATE TABLE profiles (
    id uuid REFERENCES users(id) ON DELETE CASCADE PRIMARY KEY,
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
-- INDEXES
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_projects_created_by ON projects(created_by);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_created_by ON tasks(created_by);
CREATE INDEX IF NOT EXISTS idx_timesheets_user_id ON timesheets(user_id);
CREATE INDEX IF NOT EXISTS idx_timesheets_project_id ON timesheets(project_id);
CREATE INDEX IF NOT EXISTS idx_timesheets_task_id ON timesheets(task_id);
CREATE INDEX IF NOT EXISTS idx_sales_orders_created_by ON sales_orders(created_by);
CREATE INDEX IF NOT EXISTS idx_purchases_created_by ON purchases(created_by);
CREATE INDEX IF NOT EXISTS idx_expenses_created_by ON expenses(created_by);
CREATE INDEX IF NOT EXISTS idx_invoices_created_by ON invoices(created_by);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- ==========================================
-- RLS POLICIES (DISABLED FOR DEVELOPMENT)
-- ==========================================
-- Note: Row Level Security should be enabled in production with proper policies
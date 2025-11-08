// Test script to verify projects and tasks API is working
const dotenv = require('dotenv');
dotenv.config();

// Supabase client
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testProjectsTasksAPI() {
  try {
    console.log('Testing projects and tasks API...');
    
    // First, let's get a valid user ID from the database
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    if (usersError) {
      console.error('Error fetching users:', usersError);
      return;
    }
    
    if (!users || users.length === 0) {
      console.error('No users found in database');
      return;
    }
    
    const userId = users[0].id;
    console.log('Using user ID:', userId);
    
    // Test creating a project
    const projectData = {
      name: 'Test Project',
      client: 'Test Client',
      start_date: '2025-01-01',
      end_date: '2025-12-31',
      budget: 10000,
      status: 'planning',
      description: 'Test project for API testing',
      created_by: userId
    };
    
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert(projectData)
      .select()
      .single();
    
    if (projectError) {
      console.error('Error creating project:', projectError);
      return;
    }
    
    console.log('Project created successfully:', project);
    
    // Test creating a task
    const taskData = {
      title: 'Test Task',
      description: 'Test task for API testing',
      project_id: project.id,
      status: 'todo',
      priority: 'medium',
      created_by: userId
    };
    
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .insert(taskData)
      .select()
      .single();
    
    if (taskError) {
      console.error('Error creating task:', taskError);
      return;
    }
    
    console.log('Task created successfully:', task);
    
    // Test fetching projects
    const { data: projects, error: fetchProjectsError } = await supabase
      .from('projects')
      .select('*');
    
    if (fetchProjectsError) {
      console.error('Error fetching projects:', fetchProjectsError);
    } else {
      console.log('Projects fetched successfully:', projects.length, 'projects found');
    }
    
    // Test fetching tasks
    const { data: tasks, error: fetchTasksError } = await supabase
      .from('tasks')
      .select('*');
    
    if (fetchTasksError) {
      console.error('Error fetching tasks:', fetchTasksError);
    } else {
      console.log('Tasks fetched successfully:', tasks.length, 'tasks found');
    }
    
  } catch (err) {
    console.error('Test failed with error:', err);
  }
}

testProjectsTasksAPI();
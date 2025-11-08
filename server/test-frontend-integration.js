// Test script to verify frontend integration with backend
const dotenv = require('dotenv');
dotenv.config();

// Supabase client
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testFrontendIntegration() {
  try {
    console.log('Testing frontend integration with backend...');
    
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
    
    // Test creating a project with the exact data structure that frontend sends
    const frontendProjectData = {
      name: 'Frontend Integration Test Project',
      client: 'Test Client',
      start_date: '2025-01-01',
      end_date: '2025-12-31',
      budget: 10000,
      status: 'planning',
      description: 'Test project for frontend integration'
    };
    
    // Add the required created_by field
    const backendProjectData = {
      ...frontendProjectData,
      created_by: userId
    };
    
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert(backendProjectData)
      .select()
      .single();
    
    if (projectError) {
      console.error('Error creating project:', projectError);
      return;
    }
    
    console.log('Project created successfully:', project);
    
    // Test creating a task with the exact data structure that frontend sends
    const frontendTaskData = {
      title: 'Frontend Integration Test Task',
      description: 'Test task for frontend integration',
      project_id: project.id,
      status: 'todo',
      priority: 'medium'
    };
    
    // Add the required created_by field
    const backendTaskData = {
      ...frontendTaskData,
      created_by: userId
    };
    
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .insert(backendTaskData)
      .select()
      .single();
    
    if (taskError) {
      console.error('Error creating task:', taskError);
      return;
    }
    
    console.log('Task created successfully:', task);
    
    // Test updating a project
    const updateProjectData = {
      name: 'Updated Frontend Integration Test Project',
      description: 'Updated test project for frontend integration'
    };
    
    const { data: updatedProject, error: updateProjectError } = await supabase
      .from('projects')
      .update(updateProjectData)
      .eq('id', project.id)
      .select()
      .single();
    
    if (updateProjectError) {
      console.error('Error updating project:', updateProjectError);
      return;
    }
    
    console.log('Project updated successfully:', updatedProject);
    
    // Test updating a task
    const updateTaskData = {
      title: 'Updated Frontend Integration Test Task',
      status: 'in_progress'
    };
    
    const { data: updatedTask, error: updateTaskError } = await supabase
      .from('tasks')
      .update(updateTaskData)
      .eq('id', task.id)
      .select()
      .single();
    
    if (updateTaskError) {
      console.error('Error updating task:', updateTaskError);
      return;
    }
    
    console.log('Task updated successfully:', updatedTask);
    
    console.log('All tests passed! Frontend integration is working correctly.');
    
  } catch (err) {
    console.error('Test failed with error:', err);
  }
}

testFrontendIntegration();
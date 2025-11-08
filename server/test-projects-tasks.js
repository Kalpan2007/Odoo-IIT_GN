const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function testProjectsAndTasks() {
  console.log('Testing Projects and Tasks functionality...');
  
  // Create a test user and profile
  const testUserId = '22222222-2222-2222-2222-222222222222';
  const testUserEmail = 'test-projects@example.com';
  
  try {
    // Create test user
    const { data: userData, error: userError } = await supabase
      .from('users')
      .upsert({
        id: testUserId,
        email: testUserEmail,
        password: 'Test#1234'
      }, { onConflict: 'id' });
    
    if (userError) {
      console.log('User creation error:', userError.message);
    } else {
      console.log('User created/updated');
    }
    
    // Create test profile with project_manager role
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: testUserId,
        email: testUserEmail,
        full_name: 'Test Project Manager',
        role: 'project_manager'
      }, { onConflict: 'id' });
    
    if (profileError) {
      console.log('Profile creation error:', profileError.message);
    } else {
      console.log('Profile created/updated');
    }
    
    // Test project creation
    console.log('\n--- Testing Project Creation ---');
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        name: 'Test Project',
        client: 'Test Client',
        start_date: '2024-01-01',
        end_date: '2024-12-31',
        budget: 100000.00,
        status: 'planning',
        description: 'Test project for functionality verification',
        created_by: testUserId
      })
      .select()
      .single();
    
    if (projectError) {
      console.log('Project creation error:', projectError.message);
      return;
    } else {
      console.log('Project created successfully:', project.name);
    }
    
    // Test project retrieval
    console.log('\n--- Testing Project Retrieval ---');
    const { data: retrievedProject, error: retrieveError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', project.id)
      .single();
    
    if (retrieveError) {
      console.log('Project retrieval error:', retrieveError.message);
    } else {
      console.log('Project retrieved successfully:', retrievedProject.name);
    }
    
    // Test task creation
    console.log('\n--- Testing Task Creation ---');
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .insert({
        title: 'Test Task',
        description: 'Test task for functionality verification',
        project_id: project.id,
        assigned_to: testUserId,
        status: 'todo',
        priority: 'medium',
        estimated_hours: 10.0,
        due_date: '2024-06-30',
        created_by: testUserId
      })
      .select()
      .single();
    
    if (taskError) {
      console.log('Task creation error:', taskError.message);
      return;
    } else {
      console.log('Task created successfully:', task.title);
    }
    
    // Test task retrieval
    console.log('\n--- Testing Task Retrieval ---');
    const { data: retrievedTask, error: taskRetrieveError } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', task.id)
      .single();
    
    if (taskRetrieveError) {
      console.log('Task retrieval error:', taskRetrieveError.message);
    } else {
      console.log('Task retrieved successfully:', retrievedTask.title);
    }
    
    // Test task update
    console.log('\n--- Testing Task Update ---');
    const { data: updatedTask, error: taskUpdateError } = await supabase
      .from('tasks')
      .update({
        status: 'in_progress',
        actual_hours: 5.0
      })
      .eq('id', task.id)
      .select()
      .single();
    
    if (taskUpdateError) {
      console.log('Task update error:', taskUpdateError.message);
    } else {
      console.log('Task updated successfully:', updatedTask.status);
    }
    
    // Clean up
    console.log('\n--- Cleaning Up ---');
    await supabase.from('tasks').delete().eq('id', task.id);
    await supabase.from('projects').delete().eq('id', project.id);
    await supabase.from('profiles').delete().eq('id', testUserId);
    await supabase.from('users').delete().eq('id', testUserId);
    
    console.log('Test cleanup completed');
    console.log('\n✅ Projects and Tasks functionality test completed successfully!');
    
  } catch (err) {
    console.log('Test error:', err.message);
  }
}

testProjectsAndTasks();
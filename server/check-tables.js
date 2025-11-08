const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function checkTables() {
  console.log('Checking if tables exist...');
  
  // Check users table
  try {
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    if (usersError) {
      console.log('Users table error:', usersError.message);
    } else {
      console.log('Users table: OK');
    }
  } catch (err) {
    console.log('Users table check failed:', err.message);
  }
  
  // Check profiles table
  try {
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    
    if (profilesError) {
      console.log('Profiles table error:', profilesError.message);
    } else {
      console.log('Profiles table: OK');
    }
  } catch (err) {
    console.log('Profiles table check failed:', err.message);
  }
  
  // Check role_requests table
  try {
    const { data: roleRequests, error: roleRequestsError } = await supabase
      .from('role_requests')
      .select('id')
      .limit(1);
    
    if (roleRequestsError) {
      console.log('Role requests table error:', roleRequestsError.message);
    } else {
      console.log('Role requests table: OK');
    }
  } catch (err) {
    console.log('Role requests table check failed:', err.message);
  }
  
  // Check projects table
  try {
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('id')
      .limit(1);
    
    if (projectsError) {
      console.log('Projects table error:', projectsError.message);
    } else {
      console.log('Projects table: OK');
    }
  } catch (err) {
    console.log('Projects table check failed:', err.message);
  }
  
  // Check tasks table
  try {
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('id')
      .limit(1);
    
    if (tasksError) {
      console.log('Tasks table error:', tasksError.message);
    } else {
      console.log('Tasks table: OK');
    }
  } catch (err) {
    console.log('Tasks table check failed:', err.message);
  }
}

checkTables();
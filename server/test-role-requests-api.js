// Test script to verify role requests API is working
const dotenv = require('dotenv');
dotenv.config();

// Supabase client
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testRoleRequestsAPI() {
  try {
    console.log('Testing role requests API...');
    
    // Test fetching all role requests
    const { data: roleRequests, error } = await supabase
      .from('role_requests')
      .select('*');
    
    if (error) {
      console.error('Error fetching role requests:', error);
      return;
    }
    
    console.log('Role requests found:', roleRequests);
    
    // Test creating a role request
    const newRequest = {
      user_id: '550e8400-e29b-41d4-a716-446655440003', // Test user ID
      current_user_role: 'team_member',
      requested_role: 'project_manager',
      reason: 'Requesting project manager access for new project',
      status: 'pending'
    };
    
    const { data: createdRequest, error: createError } = await supabase
      .from('role_requests')
      .insert(newRequest)
      .select();
    
    if (createError) {
      console.error('Error creating role request:', createError);
    } else {
      console.log('Role request created successfully:', createdRequest);
    }
    
  } catch (err) {
    console.error('Test failed with error:', err);
  }
}

testRoleRequestsAPI();
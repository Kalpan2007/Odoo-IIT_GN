const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function testRoleRequestFix() {
  console.log('Testing role request fix...');
  
  // Use an existing user ID that we know exists
  const testUserId = '550e8400-e29b-41d4-a716-446655440003'; // This is from the sample data
  
  try {
    // First, check if the user exists
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', testUserId)
      .single();
    
    if (userError) {
      console.log('User not found, creating test user...');
      
      // Create test user and profile
      await supabase.from('users').upsert({
        id: testUserId,
        email: 'test-role-fix@example.com',
        password: 'Test#1234'
      }, { onConflict: 'id' });
      
      await supabase.from('profiles').upsert({
        id: testUserId,
        email: 'test-role-fix@example.com',
        full_name: 'Test User for Role Request',
        role: 'team_member'
      }, { onConflict: 'id' });
      
      console.log('Test user created');
    } else {
      console.log('Using existing user with role:', userData.role);
    }
    
    // Now try to create a role request with the correct column name
    const { data: roleRequest, error: requestError } = await supabase
      .from('role_requests')
      .insert({
        user_id: testUserId,
        current_user_role: 'team_member', // Use the correct column name
        requested_role: 'project_manager',
        reason: 'Need project management access',
        status: 'pending'
      })
      .select()
      .single();
    
    if (requestError) {
      console.log('Role request creation error:', requestError.message);
      return;
    } else {
      console.log('Role request created successfully with ID:', roleRequest.id);
      
      // Try to fetch it
      const { data: fetchedRequest, error: fetchError } = await supabase
        .from('role_requests')
        .select('*')
        .eq('id', roleRequest.id)
        .single();
      
      if (fetchError) {
        console.log('Role request fetch error:', fetchError.message);
      } else {
        console.log('Role request fetched successfully');
        console.log('Current user role:', fetchedRequest.current_user_role);
        console.log('Requested role:', fetchedRequest.requested_role);
        console.log('Status:', fetchedRequest.status);
      }
      
      // Clean up
      await supabase.from('role_requests').delete().eq('id', roleRequest.id);
      console.log('Test role request cleaned up');
    }
    
    console.log('\n✅ Role request fix test completed successfully!');
    
  } catch (err) {
    console.log('Test error:', err.message);
  }
}

testRoleRequestFix();
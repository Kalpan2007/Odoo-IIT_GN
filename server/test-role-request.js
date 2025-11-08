const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function testRoleRequest() {
  console.log('Testing role request creation...');
  
  // First, let's create a test user and profile if they don't exist
  const testUserId = '11111111-1111-1111-1111-111111111111';
  const testUserEmail = 'test-role-request@example.com';
  
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
    
    // Create test profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: testUserId,
        email: testUserEmail,
        full_name: 'Test User',
        role: 'team_member'
      }, { onConflict: 'id' });
    
    if (profileError) {
      console.log('Profile creation error:', profileError.message);
    } else {
      console.log('Profile created/updated');
    }
    
    // Now try to create a role request
    const { data: roleRequest, error: requestError } = await supabase
      .from('role_requests')
      .insert({
        user_id: testUserId,
        current_user_role: 'team_member', // Changed from current_role to current_user_role
        requested_role: 'project_manager',
        reason: 'Need project management access for new project',
        status: 'pending'
      })
      .select()
      .single();
    
    if (requestError) {
      console.log('Role request creation error:', requestError.message);
    } else {
      console.log('Role request created successfully:', roleRequest.id);
      
      // Now try to fetch it
      const { data: fetchedRequest, error: fetchError } = await supabase
        .from('role_requests')
        .select('*')
        .eq('id', roleRequest.id)
        .single();
      
      if (fetchError) {
        console.log('Role request fetch error:', fetchError.message);
      } else {
        console.log('Role request fetched successfully:', fetchedRequest);
      }
    }
    
    // Clean up
    await supabase.from('role_requests').delete().eq('user_id', testUserId);
    await supabase.from('profiles').delete().eq('id', testUserId);
    await supabase.from('users').delete().eq('id', testUserId);
    
    console.log('Test cleanup completed');
  } catch (err) {
    console.log('Test error:', err.message);
  }
}

testRoleRequest();
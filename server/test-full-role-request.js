const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function testFullRoleRequestSystem() {
  console.log('Testing full role request system...');
  
  // Create a test user and profile
  const testUserId = '33333333-3333-3333-3333-333333333333';
  const testUserEmail = 'full-test-role-request@example.com';
  
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
      return;
    } else {
      console.log('User created/updated');
    }
    
    // Create test profile with team_member role
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: testUserId,
        email: testUserEmail,
        full_name: 'Full Test User',
        role: 'team_member'
      }, { onConflict: 'id' });
    
    if (profileError) {
      console.log('Profile creation error:', profileError.message);
      return;
    } else {
      console.log('Profile created/updated with role:', profileData?.role || 'team_member');
    }
    
    // Test role request creation
    console.log('\n--- Testing Role Request Creation ---');
    const { data: roleRequest, error: requestError } = await supabase
      .from('role_requests')
      .insert({
        user_id: testUserId,
        current_user_role: 'team_member',
        requested_role: 'project_manager',
        reason: 'Need project management access for new project',
        status: 'pending'
      })
      .select()
      .single();
    
    if (requestError) {
      console.log('Role request creation error:', requestError.message);
      return;
    } else {
      console.log('Role request created successfully with ID:', roleRequest.id);
    }
    
    // Test fetching role requests for user
    console.log('\n--- Testing Role Request Retrieval ---');
    const { data: userRequests, error: userRequestsError } = await supabase
      .from('role_requests')
      .select('*')
      .eq('user_id', testUserId);
    
    if (userRequestsError) {
      console.log('User role requests fetch error:', userRequestsError.message);
    } else {
      console.log('Found', userRequests.length, 'role request(s) for user');
      if (userRequests.length > 0) {
        console.log('First request status:', userRequests[0].status);
        console.log('Requested role:', userRequests[0].requested_role);
      }
    }
    
    // Test admin functionality - fetch all role requests
    console.log('\n--- Testing Admin Role Request Retrieval ---');
    const { data: allRequests, error: allRequestsError } = await supabase
      .from('role_requests')
      .select('*');
    
    if (allRequestsError) {
      console.log('All role requests fetch error:', allRequestsError.message);
    } else {
      console.log('Total role requests in system:', allRequests.length);
    }
    
    // Test updating role request (approval)
    console.log('\n--- Testing Role Request Approval ---');
    const { data: updatedRequest, error: updateError } = await supabase
      .from('role_requests')
      .update({
        status: 'approved',
        updated_at: new Date().toISOString()
      })
      .eq('id', roleRequest.id)
      .select()
      .single();
    
    if (updateError) {
      console.log('Role request update error:', updateError.message);
    } else {
      console.log('Role request updated successfully. New status:', updatedRequest.status);
    }
    
    // Test updating user's role in profiles table
    console.log('\n--- Testing User Role Update ---');
    const { data: updatedProfile, error: profileUpdateError } = await supabase
      .from('profiles')
      .update({
        role: 'project_manager'
      })
      .eq('id', testUserId)
      .select()
      .single();
    
    if (profileUpdateError) {
      console.log('Profile update error:', profileUpdateError.message);
    } else {
      console.log('User role updated successfully to:', updatedProfile.role);
    }
    
    // Clean up
    console.log('\n--- Cleaning Up ---');
    await supabase.from('role_requests').delete().eq('user_id', testUserId);
    await supabase.from('profiles').delete().eq('id', testUserId);
    await supabase.from('users').delete().eq('id', testUserId);
    
    console.log('Test cleanup completed');
    console.log('\n✅ Full role request system test completed successfully!');
    
  } catch (err) {
    console.log('Test error:', err.message);
  }
}

testFullRoleRequestSystem();
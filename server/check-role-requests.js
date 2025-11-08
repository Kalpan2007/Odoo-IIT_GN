const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function checkRoleRequestsTable() {
  console.log('Checking role_requests table structure...');
  
  try {
    // Try to get table info through a different approach
    const { data, error } = await supabase
      .from('role_requests')
      .select('id,user_id,current_role,requested_role,status,reason,created_at,updated_at')
      .limit(1);
    
    if (error) {
      console.log('Detailed column check error:', error.message);
      
      // Try with fewer columns
      const { data: simpleData, error: simpleError } = await supabase
        .from('role_requests')
        .select('id,user_id')
        .limit(1);
      
      if (simpleError) {
        console.log('Simple column check error:', simpleError.message);
      } else {
        console.log('Simple columns work:', Object.keys(simpleData[0] || {}));
      }
    } else {
      console.log('All columns work:', Object.keys(data[0]));
    }
  } catch (err) {
    console.log('Error:', err.message);
  }
}

checkRoleRequestsTable();
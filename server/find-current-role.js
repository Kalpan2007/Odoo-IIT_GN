const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function findCurrentRoleColumn() {
  const possibleNames = ['current_role', 'currentRole', 'currentrole', 'role', 'from_role', 'old_role', 'previous_role'];
  
  for (const name of possibleNames) {
    try {
      const { data, error } = await supabase.from('role_requests').select(name).limit(1);
      if (!error) {
        console.log('Found current role column:', name);
        return name;
      }
    } catch (err) {
      // Column doesn't exist
    }
  }
  
  console.log('Could not find current role column');
  return null;
}

findCurrentRoleColumn();
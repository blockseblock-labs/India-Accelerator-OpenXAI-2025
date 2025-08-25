const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function generateTestToken() {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    // Sign in as device (you'll need to create this auth user in Supabase)
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'device@smartbin.test',
      password: 'device-password'
    });

    if (error) throw error;

    console.log('Access Token:', data.session.access_token);
    process.exit(0);
  } catch (error) {
    console.error('Error generating token:', error);
    process.exit(1);
  }
}

generateTestToken();
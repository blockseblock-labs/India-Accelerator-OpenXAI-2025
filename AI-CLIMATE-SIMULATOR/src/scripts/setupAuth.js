const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const logger = require('../utils/logger');

async function setupAuth() {
  try {
    logger.info('Starting auth setup...');

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Create device user if doesn't exist
    const { data: user, error: signUpError } = await supabase.auth.admin.createUser({
      email: 'device@smartbin.test',
      password: 'device-password',
      email_confirm: true,
      user_metadata: {
        role: 'device'
      }
    });

    if (signUpError) {
      if (signUpError.message.includes('already exists')) {
        logger.info('Device user already exists, proceeding to login');
      } else {
        throw signUpError;
      }
    } else {
      logger.info('Device user created:', user);
    }

    // Sign in to get access token
    const { data: session, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'device@smartbin.test',
      password: 'device-password'
    });

    if (signInError) throw signInError;

    logger.info('Auth setup completed');
    logger.info('=== TEST CREDENTIALS ===');
    logger.info('Email: device@smartbin.test');
    logger.info('Password: device-password');
    logger.info('Access Token:', session.session.access_token);
    logger.info('=====================');

    process.exit(0);
  } catch (error) {
    logger.error('Error in auth setup:', error);
    process.exit(1);
  }
}

setupAuth();
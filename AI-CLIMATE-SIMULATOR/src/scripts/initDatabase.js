const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');
require('dotenv').config();

async function initDatabase() {
  try {
    logger.info('Starting database initialization...');

    // Read the SQL file
    const sqlContent = fs.readFileSync(
      path.join(__dirname, '../config/init.sql'),
      'utf8'
    );

    // Split the SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    // Create Supabase client with FULL access
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Execute each statement
    for (const statement of statements) {
      try {
        const { error } = await supabase.rpc('exec_sql', {
          query: statement + ';'
        });
        
        if (error) {
          logger.error('Error executing SQL:', {
            error,
            statement: statement.substring(0, 100) + '...'
          });
        }
      } catch (err) {
        logger.error('Failed to execute statement:', {
          error: err,
          statement: statement.substring(0, 100) + '...'
        });
      }
    }

    logger.info('Database initialization completed');
    process.exit(0);
  } catch (error) {
    logger.error('Database initialization failed:', error);
    process.exit(1);
  }
}

initDatabase();
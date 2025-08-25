const supabase = require('../config/supabase');
const logger = require('../utils/logger');

async function setupDatabase() {
  try {
    logger.info('Starting database setup...');

    // Create test operator profile
    const operatorId = '00000000-0000-0000-0000-000000000001'; // Fixed UUID for testing
    const { data: operator, error: operatorError } = await supabase
      .from('profiles')
      .upsert({
        user_id: operatorId,
        display_name: 'Test Operator',
        role: 'operator'
      })
      .select()
      .single();

    if (operatorError) throw operatorError;
    logger.info('Test operator created:', operator);

    // Create test host profile
    const hostId = '00000000-0000-0000-0000-000000000002'; // Fixed UUID for testing
    const { data: host, error: hostError } = await supabase
      .from('profiles')
      .upsert({
        user_id: hostId,
        display_name: 'Test Host',
        role: 'host',
        wallet_address: '0x1234567890123456789012345678901234567890' // Example wallet
      })
      .select()
      .single();

    if (hostError) throw hostError;
    logger.info('Test host created:', host);

    // Create initial test data
    const testData = {
      bin: {
        bin_code: 'BIN-001',
        location: 'Chandigarh',
        owner_user_id: hostId
      },
      price_tables: [
        {
          location: 'Chandigarh',
          stream: 'HV',
          price_per_unit: 1.0,
          unit: 'count',
          effective_date: new Date().toISOString().split('T')[0],
          version: 1
        },
        {
          location: 'Chandigarh',
          stream: 'LV',
          price_per_unit: 0.3,
          unit: 'count',
          effective_date: new Date().toISOString().split('T')[0],
          version: 1
        },
        {
          location: 'Chandigarh',
          stream: 'ORG',
          price_per_unit: 0.0,
          unit: 'count',
          effective_date: new Date().toISOString().split('T')[0],
          version: 1
        }
      ]
    };

    // Insert test bin
    const { data: bin, error: binError } = await supabase
      .from('bins')
      .insert(testData.bin)
      .select()
      .single();

    if (binError) throw binError;
    logger.info('Test bin created:', bin);

    // Insert price tables
    const { data: prices, error: priceError } = await supabase
      .from('price_tables')
      .insert(testData.price_tables)
      .select();

    if (priceError) throw priceError;
    logger.info('Price tables created:', prices);

    logger.info('Database setup completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase();
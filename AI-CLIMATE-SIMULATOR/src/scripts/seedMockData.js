const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const logger = require('../utils/logger');

function nowIso(offsetMinutes = 0) {
  const d = new Date(Date.now() + offsetMinutes * 60 * 1000);
  return d.toISOString();
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  const admin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

  try {
    logger.info('Seeding mock data...');

    // 1) Create auth users (operator + two hosts)
    const usersToCreate = [
      { email: 'operator@smartbin.test', password: 'operator-password', metadata: { role: 'operator' } },
      { email: 'host1@smartbin.test', password: 'host1-password', metadata: { role: 'host' } },
      { email: 'host2@smartbin.test', password: 'host2-password', metadata: { role: 'host' } }
    ];

    const created = [];
    for (const u of usersToCreate) {
      let id;
      const createdRes = await admin.auth.admin.createUser({
        email: u.email,
        password: u.password,
        email_confirm: true,
        user_metadata: u.metadata
      });
      if (createdRes.error && createdRes.error.status !== 422) throw createdRes.error;
      id = createdRes.data?.user?.id;
      if (!id) {
        // fetch existing
        const list = await admin.auth.admin.listUsers();
        const existing = list.data.users.find(us => us.email === u.email);
        id = existing?.id;
      }
      created.push({ email: u.email, id, role: u.metadata.role });
    }

    // Fetch existing users if they already exist
    // ensure IDs found
    if (!operator?.id || !host1?.id || !host2?.id) {
      throw new Error('Missing auth user IDs after creation/listing');
    }

    const operator = created.find(x => x.role === 'operator');
    const host1 = created.find(x => x.email === 'host1@smartbin.test');
    const host2 = created.find(x => x.email === 'host2@smartbin.test');

    logger.info('Auth users ready', { operator: operator?.id, host1: host1?.id, host2: host2?.id });

    // 2) Upsert profiles
    const { error: profilesErr } = await admin.from('profiles').upsert([
      { user_id: operator.id, display_name: 'Operator One', role: 'operator' },
      { user_id: host1.id, display_name: 'Host One', role: 'host' },
      { user_id: host2.id, display_name: 'Host Two', role: 'host' }
    ]);
    if (profilesErr) throw profilesErr;

    // 3) Create bins for hosts
    const bins = [
      { bin_code: 'BIN-001', location: 'Chandigarh', owner_user_id: host1.id },
      { bin_code: 'BIN-002', location: 'Chandigarh', owner_user_id: host1.id },
      { bin_code: 'BIN-101', location: 'Pune', owner_user_id: host2.id }
    ];
    const { data: binsCreated, error: binsErr } = await admin
      .from('bins')
      .upsert(bins, { onConflict: 'bin_code' })
      .select();
    if (binsErr) throw binsErr;

    // Map bin_code to id
    const binMap = {};
    for (const b of binsCreated) binMap[b.bin_code] = b.id;

    // 4) Insert sample bin_events
    const sampleEvents = [];
    const makeEvent = (bin_code, offsetMin, hv, lv, org, loc) => ({
      bin_id: binMap[bin_code],
      bin_code,
      location: loc,
      timestamp_utc: nowIso(offsetMin),
      fill_level_pct: Math.min(hv + lv + org + randInt(10, 30), 100),
      weight_kg_total: Number((hv * 0.2 + lv * 0.1 + org * 0.3).toFixed(2)),
      weight_kg_delta: Number((randInt(0, 5) * 0.1).toFixed(2)),
      battery_pct: randInt(60, 100),
      ai_model_id: 'model-v1.0',
      ai_confidence_avg: Number((0.85 + Math.random() * 0.15).toFixed(2)),
      hv_count: hv,
      lv_count: lv,
      org_count: org,
      payload_json: {
        bin_id: binMap[bin_code],
        bin_code,
        location: loc,
        timestamp_utc: nowIso(offsetMin),
        metrics: {
          fill_level_pct: Math.min(hv + lv + org + randInt(10, 30), 100),
          weight_kg_total: Number((hv * 0.2 + lv * 0.1 + org * 0.3).toFixed(2)),
          weight_kg_delta: Number((randInt(0, 5) * 0.1).toFixed(2)),
          battery_pct: randInt(60, 100)
        },
        ai: { model_id: 'model-v1.0', confidence_avg: Number((0.85 + Math.random() * 0.15).toFixed(2)) },
        categories: {
          high_value_recyclables: { items: [{ id: 1, name: 'PET', quantity: hv }] },
          low_value_mixed_recyclables: { items: [{ id: 10, name: 'Mixed Plastic', quantity: lv }] },
          organics_residuals: { items: [{ id: 20, name: 'Food Waste', quantity: org }] }
        }
      }
    });

    sampleEvents.push(
      makeEvent('BIN-001', -120, 5, 3, 2, 'Chandigarh'),
      makeEvent('BIN-001', -60, 6, 2, 1, 'Chandigarh'),
      makeEvent('BIN-002', -90, 3, 4, 2, 'Chandigarh'),
      makeEvent('BIN-101', -30, 4, 1, 5, 'Pune'),
      makeEvent('BIN-101', -5, 7, 2, 1, 'Pune')
    );

    const { error: eventsErr } = await admin.from('bin_events').insert(sampleEvents, { ignoreDuplicates: true });
    if (eventsErr) throw eventsErr;

    logger.info('Mock data seeded successfully');
    process.exit(0);
  } catch (err) {
    logger.error('Seeding failed', { error: err });
    process.exit(1);
  }
}

main();


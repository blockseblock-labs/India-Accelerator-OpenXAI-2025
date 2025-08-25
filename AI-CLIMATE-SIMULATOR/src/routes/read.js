const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const logger = require('../utils/logger');

// GET /bins/:bin_id/events?limit=50
router.get('/bins/:bin_id/events', async (req, res) => {
  const { bin_id } = req.params;
  const limit = Math.min(parseInt(req.query.limit || '50', 10), 200);

  try {
    const { data: events, error } = await supabase
      .from('bin_events')
      .select('id, bin_id, bin_code, location, timestamp_utc, fill_level_pct, weight_kg_total, battery_pct, ai_model_id, ai_confidence_avg, hv_count, lv_count, org_count, created_at')
      .eq('bin_id', bin_id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return res.status(200).json({ ok: true, events });
  } catch (error) {
    logger.error('Error fetching bin events', { bin_id, error });
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /bins?owner_user_id=...
router.get('/bins', async (req, res) => {
  const { owner_user_id } = req.query;
  try {
    const query = supabase
      .from('bins')
      .select('id, bin_code, location, owner_user_id, created_at')
      .order('created_at', { ascending: false });

    if (owner_user_id) query.eq('owner_user_id', owner_user_id);

    const { data: bins, error } = await query;
    if (error) throw error;
    return res.status(200).json({ ok: true, bins });
  } catch (error) {
    logger.error('Error fetching bins', { owner_user_id, error });
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;


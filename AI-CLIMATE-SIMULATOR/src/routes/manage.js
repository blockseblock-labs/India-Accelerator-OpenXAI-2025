const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const logger = require('../utils/logger');
const { binCreateSchema, binUpdateSchema } = require('../utils/validators');

// Create a bin (operator only)
router.post('/bins', async (req, res) => {
  try {
    if (!req.auth || !req.auth.user_metadata || req.auth.user_metadata.role !== 'operator') {
      return res.status(403).json({ error: 'Forbidden: Operator role required' });
    }

    const payload = binCreateSchema.parse(req.body);
    const { data, error } = await supabase
      .from('bins')
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return res.status(201).json({ ok: true, bin: data });
  } catch (error) {
    logger.error('Create bin failed', { error });
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Assign/Update bin (operator only)
router.patch('/bins/:bin_id', async (req, res) => {
  try {
    if (!req.auth || !req.auth.user_metadata || req.auth.user_metadata.role !== 'operator') {
      return res.status(403).json({ error: 'Forbidden: Operator role required' });
    }

    const updates = binUpdateSchema.parse(req.body);
    const { data, error } = await supabase
      .from('bins')
      .update(updates)
      .eq('id', req.params.bin_id)
      .select()
      .single();

    if (error) throw error;
    return res.status(200).json({ ok: true, bin: data });
  } catch (error) {
    logger.error('Update bin failed', { error });
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// List bins by owner (host self or operator)
router.get('/bins', async (req, res) => {
  try {
    const role = (req.auth && req.auth.user_metadata && req.auth.user_metadata.role) || req.auth?.role;
    const ownerUserId = req.query.owner_user_id;

    if (role === 'host') {
      // Force to self
      const selfId = req.auth.sub;
      const { data, error } = await supabase
        .from('bins')
        .select('id, bin_code, location, owner_user_id, created_at')
        .eq('owner_user_id', selfId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return res.status(200).json({ ok: true, bins: data });
    }

    if (role === 'operator') {
      const query = supabase
        .from('bins')
        .select('id, bin_code, location, owner_user_id, created_at')
        .order('created_at', { ascending: false });
      if (ownerUserId) query.eq('owner_user_id', ownerUserId);
      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json({ ok: true, bins: data });
    }

    return res.status(403).json({ error: 'Forbidden' });
  } catch (error) {
    logger.error('List bins failed', { error });
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;


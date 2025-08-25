const supabase = require('../config/supabase');
const logger = require('../utils/logger');

class BinService {
  static async createOrGetBin(binCode, location) {
    try {
      // Check if bin exists
      let { data: bin } = await supabase
        .from('bins')
        .select('id')
        .eq('bin_code', binCode)
        .single();

      // Create if doesn't exist
      if (!bin) {
        const { data, error } = await supabase
          .from('bins')
          .insert({ bin_code: binCode, location })
          .select()
          .single();

        if (error) throw error;
        bin = data;
      }

      return bin;
    } catch (error) {
      logger.error('Error in createOrGetBin', { binCode, error });
      throw error;
    }
  }

  static calculateCounts(categories) {
    const hv_count = categories.high_value_recyclables.items
      .reduce((sum, item) => sum + (item.quantity || 0), 0);
    
    const lv_count = categories.low_value_mixed_recyclables.items
      .reduce((sum, item) => sum + (item.quantity || 0), 0);
    
    const org_count = categories.organics_residuals.items
      .reduce((sum, item) => sum + (item.quantity || 0), 0);

    return { hv_count, lv_count, org_count };
  }

  static async insertEvent(binId, eventData, counts) {
    try {
      // Clamp values to ensure they're within valid ranges
      const clampedMetrics = {
        fill_level_pct: Math.min(Math.max(eventData.metrics.fill_level_pct, 0), 100),
        weight_kg_total: Math.max(eventData.metrics.weight_kg_total, 0),
        weight_kg_delta: eventData.metrics.weight_kg_delta,
        battery_pct: Math.min(Math.max(eventData.metrics.battery_pct, 0), 100)
      };

      const { data, error } = await supabase
        .from('bin_events')
        .insert({
          bin_id: binId,
          bin_code: eventData.bin_code || eventData.bin_id,
          location: eventData.location,
          timestamp_utc: eventData.timestamp_utc,
          fill_level_pct: clampedMetrics.fill_level_pct,
          weight_kg_total: clampedMetrics.weight_kg_total,
          weight_kg_delta: clampedMetrics.weight_kg_delta,
          battery_pct: clampedMetrics.battery_pct,
          ai_model_id: eventData.ai?.model_id,
          ai_confidence_avg: eventData.ai?.confidence_avg,
          ...counts,
          payload_json: eventData
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error in insertEvent', { binId, error });
      throw error;
    }
  }
}

module.exports = BinService;
const { z } = require('zod');

const binEventSchema = z.object({
  // Either bin_id or bin_code must be present
  bin_id: z.string().optional(),
  bin_code: z.string().optional(),
  location: z.string().min(1).max(100),
  timestamp_utc: z.string().datetime(),
  metrics: z.object({
    fill_level_pct: z.number().min(0).max(100),
    weight_kg_total: z.number().min(0).max(1000), // Reasonable max weight
    weight_kg_delta: z.number().optional(),
    battery_pct: z.number().min(0).max(100)
  }),
  ai: z.object({
    model_id: z.string(),
    confidence_avg: z.number().min(0).max(1)
  }).optional(),
  ops: z.object({
    session_id: z.string().optional(),
    door_open: z.boolean().optional(),
    jam_flag: z.boolean().optional()
  }).optional(),
  categories: z.object({
    high_value_recyclables: z.object({
      items: z.array(z.object({
        id: z.number(),
        name: z.string(),
        quantity: z.number().min(0).int()
      }))
    }),
    low_value_mixed_recyclables: z.object({
      items: z.array(z.object({
        id: z.number(),
        name: z.string(),
        quantity: z.number().min(0).int()
      }))
    }),
    organics_residuals: z.object({
      items: z.array(z.object({
        id: z.number(),
        name: z.string(),
        quantity: z.number().min(0).int()
      }))
    })
  })
}).refine(data => data.bin_id || data.bin_code, {
  message: "Either bin_id or bin_code must be provided"
});

const binCreateSchema = z.object({
  bin_code: z.string().min(1),
  location: z.string().min(1),
  owner_user_id: z.string().uuid().optional()
});

const binUpdateSchema = z.object({
  location: z.string().min(1).optional(),
  owner_user_id: z.string().uuid().optional()
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided'
});

module.exports = { binEventSchema, binCreateSchema, binUpdateSchema };
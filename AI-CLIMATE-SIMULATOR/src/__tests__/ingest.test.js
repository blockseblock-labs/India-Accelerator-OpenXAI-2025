const request = require('supertest');
const app = require('../server');
const supabase = require('../config/supabase');

// Mock Supabase client
jest.mock('../config/supabase', () => ({
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn(() => ({ data: null }))
      }))
    })),
    insert: jest.fn(() => ({
      select: jest.fn(() => ({
        single: jest.fn(() => ({ 
          data: { 
            id: 'test-bin-id',
            bin_code: 'BIN-001',
            location: 'Chandigarh'
          }
        }))
      }))
    }))
  }))
}));

describe('POST /ingest', () => {
  const validPayload = {
    bin_id: 'BIN-001',
    location: 'Chandigarh',
    timestamp_utc: new Date().toISOString(),
    metrics: {
      fill_level_pct: 75,
      weight_kg_total: 50,
      weight_kg_delta: 2,
      battery_pct: 85
    },
    ai: {
      model_id: 'v1.0',
      confidence_avg: 0.95
    },
    categories: {
      high_value_recyclables: {
        items: [
          { id: 1, name: 'PET', quantity: 5 }
        ]
      },
      low_value_mixed_recyclables: {
        items: [
          { id: 2, name: 'Mixed Plastic', quantity: 3 }
        ]
      },
      organics_residuals: {
        items: [
          { id: 3, name: 'Food Waste', quantity: 2 }
        ]
      }
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should accept valid payload and return success', async () => {
    const response = await request(app)
      .post('/ingest?bin_code=BIN-001')
      .set('Authorization', 'Bearer test-token')
      .send(validPayload);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('event_id');
    expect(response.body).toHaveProperty('counts');
    expect(response.body.counts).toEqual({
      hv_count: 5,
      lv_count: 3,
      org_count: 2
    });
  });

  it('should reject payload without bin_code', async () => {
    const response = await request(app)
      .post('/ingest')
      .set('Authorization', 'Bearer test-token')
      .send(validPayload);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Missing required parameter: bin_code');
  });

  it('should validate metrics ranges', async () => {
    const invalidPayload = {
      ...validPayload,
      metrics: {
        ...validPayload.metrics,
        fill_level_pct: 150, // Invalid: > 100
        battery_pct: -10 // Invalid: < 0
      }
    };

    const response = await request(app)
      .post('/ingest?bin_code=BIN-001')
      .set('Authorization', 'Bearer test-token')
      .send(invalidPayload);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Validation failed');
  });

  it('should enforce rate limiting', async () => {
    // Make 61 requests (exceeding the 60/minute limit)
    const requests = Array(61).fill().map(() => 
      request(app)
        .post('/ingest?bin_code=BIN-001')
        .set('Authorization', 'Bearer test-token')
        .send(validPayload)
    );

    const responses = await Promise.all(requests);
    const tooManyRequests = responses.filter(r => r.status === 429);
    
    expect(tooManyRequests.length).toBeGreaterThan(0);
    expect(tooManyRequests[0].body).toHaveProperty('error', 'Too many requests');
    expect(tooManyRequests[0].body).toHaveProperty('retryAfter');
  });

  it('should require authentication', async () => {
    const response = await request(app)
      .post('/ingest?bin_code=BIN-001')
      .send(validPayload);

    expect(response.status).toBe(401);
  });
});
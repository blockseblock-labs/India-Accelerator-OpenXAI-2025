const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { binEventSchema } = require('../utils/validators');
const BinService = require('../services/binService');
const logger = require('../utils/logger');

// Rate limiting: 60 requests per minute per bin_code
const binRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 requests per window
  keyGenerator: (req) => req.query.bin_code || 'unknown_bin',
  handler: (req, res) => {
    logger.warn('Rate limit exceeded', { 
      binCode: req.query.bin_code,
      requestId: req.headers['x-request-id']
    });
    res.status(429).json({
      error: 'Too many requests',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
});

router.post('/', binRateLimiter, async (req, res) => {
  const requestId = req.headers['x-request-id'] || Date.now().toString();
  
  try {
    // Validate bin_code in query params
    if (!req.query.bin_code) {
      throw new Error('bin_code is required in query parameters');
    }

    logger.info('Received ingest request', { 
      requestId, 
      binCode: req.query.bin_code,
      contentLength: req.get('content-length')
    });

    // Validate payload
    const eventData = binEventSchema.parse(req.body);
    
    // Get or create bin
    const bin = await BinService.createOrGetBin(
      req.query.bin_code, 
      eventData.location
    );
    
    // Calculate counts
    const counts = BinService.calculateCounts(eventData.categories);
    
    // Insert event
    const event = await BinService.insertEvent(bin.id, eventData, counts);

    logger.info('Successfully processed ingest', { 
      requestId, 
      binCode: req.query.bin_code,
      eventId: event.id,
      location: eventData.location,
      counts
    });

    res.status(200).json({
      success: true,
      event_id: event.id,
      counts,
      timestamp_utc: eventData.timestamp_utc
    });

  } catch (error) {
    logger.error('Error processing ingest', { 
      requestId,
      binCode: req.query.bin_code,
      error: error.message,
      stack: error.stack
    });
    
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.errors,
        requestId
      });
    }

    if (error.message === 'bin_code is required in query parameters') {
      return res.status(400).json({
        error: 'Missing required parameter: bin_code',
        requestId
      });
    }

    if (error.code === 'PGRST301') {
      return res.status(403).json({
        error: 'Access denied',
        requestId
      });
    }

    res.status(500).json({ 
      error: 'Internal server error',
      requestId
    });
  }
});

module.exports = router;
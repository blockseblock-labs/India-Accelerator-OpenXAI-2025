const { expressjwt: jwt } = require('express-jwt');
const logger = require('../utils/logger');

// For development, we'll use a simpler JWT verification
const jwtCheck = jwt({
  secret: process.env.SUPABASE_JWT_SECRET,
  algorithms: ['HS256'],
  // Custom function to extract role from Supabase JWT claims
  credentialsRequired: true,
  requestProperty: 'auth',
  getToken: function fromHeaderOrQuerystring(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    }
    return null;
  }
});

function getEffectiveRole(auth) {
  if (!auth) return undefined;
  if (auth.user_metadata && auth.user_metadata.role) {
    return String(auth.user_metadata.role).toLowerCase();
  }
  if (auth.role) {
    return String(auth.role).toLowerCase();
  }
  return undefined;
}

const requireDeviceRole = (req, res, next) => {
  try {
    const role = getEffectiveRole(req.auth);
    if (role !== 'device') {
      logger.error('Invalid role access attempt', { role, path: req.path });
      return res.status(403).json({ error: 'Forbidden: Device role required' });
    }
    next();
  } catch (error) {
    logger.error('Auth middleware error', { error });
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const requireHostOrOperator = (req, res, next) => {
  try {
    const role = getEffectiveRole(req.auth);
    if (role !== 'host' && role !== 'operator') {
      logger.error('Invalid role access attempt', { role, path: req.path });
      return res.status(403).json({ error: 'Forbidden: Host or Operator role required' });
    }
    next();
  } catch (error) {
    logger.error('Auth middleware error', { error });
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const requireOperator = (req, res, next) => {
  try {
    const role = getEffectiveRole(req.auth);
    if (role !== 'operator') {
      logger.error('Invalid role access attempt', { role, path: req.path });
      return res.status(403).json({ error: 'Forbidden: Operator role required' });
    }
    next();
  } catch (error) {
    logger.error('Auth middleware error', { error });
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { jwtCheck, requireDeviceRole, requireHostOrOperator, requireOperator };
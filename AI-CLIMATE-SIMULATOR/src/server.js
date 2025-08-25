const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const { jwtCheck, requireDeviceRole, requireHostOrOperator } = require('./middleware/auth');
const ingestRoutes = require('./routes/ingest');
const manageRoutes = require('./routes/manage');
const readRoutes = require('./routes/read');
const logger = require('./utils/logger');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Protected routes
app.use('/ingest', jwtCheck, requireDeviceRole, ingestRoutes);
app.use('/', jwtCheck, manageRoutes);
app.use('/', jwtCheck, requireHostOrOperator, readRoutes);

// Error handling
app.use((err, req, res, next) => {
  logger.error('Unhandled error', { error: err });
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

module.exports = app;
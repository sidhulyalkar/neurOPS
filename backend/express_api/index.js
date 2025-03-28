const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

// Create fallback utils implementation
const fallbackUtils = {
  loadTrace: (sessionId, neuronId) => [0.1, 0.2, 0.3, 0.4],
  applyFilter: (trace, filter) => {
    if (filter === 'zscore') {
      const mean = trace.reduce((a, b) => a + b, 0) / trace.length;
      const std = Math.sqrt(trace.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / trace.length);
      return trace.map(x => (x - mean) / std);
    }
    return trace;
  }
};

// Use fallback utils - this will always work
const utils = fallbackUtils;
console.log("Using fallback utils implementation");

const API_KEY = 'demo-token';

function requireAuth(req, res, next) {
  const auth = req.headers['authorization'];
  if (!auth || auth !== `Bearer ${API_KEY}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// Add root route
app.get('/', (req, res) => {
  res.json({
    name: "NeuroOps Express API",
    version: "1.0.0",
    endpoints: [
      "/sessions",
      "/sessions/:sessionId/neurons/:neuronId"
    ]
  });
});

app.get('/sessions', requireAuth, (req, res) => {
  res.json(['session_1', 'session_2']);
});

app.get('/sessions/:sessionId/neurons/:neuronId', requireAuth, (req, res) => {
  const { sessionId, neuronId } = req.params;
  const filter = req.query.filter;
  let trace = utils.loadTrace(sessionId, neuronId);
  if (filter) {
    trace = utils.applyFilter(trace, filter);
  }
  res.json({ trace });
});

// Listen on all interfaces
app.listen(5001, '0.0.0.0', () => console.log('Express server running on http://0.0.0.0:5001'));
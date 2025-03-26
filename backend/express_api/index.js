const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

const utils = require('../shared/utils_node');
const API_KEY = 'demo-token';

function requireAuth(req, res, next) {
  const auth = req.headers['authorization'];
  if (!auth || auth !== `Bearer ${API_KEY}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

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

app.listen(5001, () => console.log('Express server running on http://localhost:5001'));

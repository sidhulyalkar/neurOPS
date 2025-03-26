function loadTrace(sessionId, neuronId) {
  return [0.2, 0.4, 0.5, 0.6];
}

function applyFilter(trace, filterName) {
  if (filterName === 'zscore') {
    const mean = trace.reduce((a, b) => a + b, 0) / trace.length;
    const std = Math.sqrt(trace.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / trace.length);
    return trace.map(x => (x - mean) / std);
  }
  return trace;
}

module.exports = { loadTrace, applyFilter };

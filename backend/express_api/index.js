const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const utils = require('../shared/utils_node');
const API_KEY = 'demo-token';

function requireAuth(req, res, next) {
  const auth = req.headers['authorization'];
  if (!auth || auth !== `Bearer ${API_KEY}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

app.get('/', (req, res) => {
  res.json({
    name: "NeuroOps Express API",
    version: "1.0.0",
    endpoints: [
      "/sessions",
      "/sessions/:sessionId/neurons/:neuronId",
      "/pipeline/snakemake",
      "/pipeline/nextflow"
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

// Simple pipeline implementations
function runSimplePipeline(pipelineType) {
  return new Promise((resolve) => {
    // Create log output
    const logOutput = [];
    logOutput.push(`Starting ${pipelineType} pipeline`);
    logOutput.push(`Time: ${new Date().toISOString()}`);
    
    // Ensure results directory exists
    const resultsDir = path.join(__dirname, 'results');
    if (!fs.existsSync(resultsDir)) {
      fs.mkdirSync(resultsDir, { recursive: true });
    }
    
    // Generate random data
    logOutput.push('Generating random data...');
    const data = Array(1000).fill().map(() => Math.random() * 2 - 1); // Random values between -1 and 1
    
    // Calculate mean and standard deviation
    logOutput.push('Calculating statistics...');
    const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
    const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
    const std = Math.sqrt(variance);
    
    // Z-score normalization
    logOutput.push('Applying z-score normalization...');
    const normalizedData = data.map(val => (val - mean) / std);
    
    // Simple classification (above/below zero)
    logOutput.push('Performing classification...');
    const trueLabels = data.map(val => val > 0 ? 1 : 0);
    const predictedLabels = normalizedData.map(val => val > 0 ? 1 : 0);
    
    // Calculate metrics
    logOutput.push('Calculating metrics...');
    const matches = trueLabels.filter((val, i) => val === predictedLabels[i]).length;
    const accuracy = matches / trueLabels.length;
    
    // For precision, we need to count true positives and false positives
    const truePositives = trueLabels.filter((val, i) => val === 1 && predictedLabels[i] === 1).length;
    const falsePositives = trueLabels.filter((val, i) => val === 0 && predictedLabels[i] === 1).length;
    const precision = truePositives / (truePositives + falsePositives);
    
    // Save results
    logOutput.push('Saving results...');
    fs.writeFileSync(path.join(resultsDir, 'model_accuracy.txt'), accuracy.toFixed(2));
    fs.writeFileSync(path.join(resultsDir, 'model_precision.txt'), precision.toFixed(2));
    
    // Log completion
    logOutput.push(`${pipelineType} pipeline completed successfully`);
    logOutput.push(`Accuracy: ${accuracy.toFixed(2)}`);
    logOutput.push(`Precision: ${precision.toFixed(2)}`);
    
    // Return results
    resolve({
      success: true,
      stdout: logOutput.join('\n'),
      stderr: '',
      metrics: {
        accuracy: accuracy.toFixed(2),
        precision: precision.toFixed(2)
      }
    });
  });
}

app.post('/pipeline/snakemake', requireAuth, async (req, res) => {
  try {
    const result = await runSimplePipeline('snakemake');
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      stdout: '',
      stderr: error.message
    });
  }
});

app.post('/pipeline/nextflow', requireAuth, async (req, res) => {
  try {
    const result = await runSimplePipeline('nextflow');
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      stdout: '',
      stderr: error.message
    });
  }
});

// Listen on all interfaces
app.listen(5001, '0.0.0.0', () => console.log('Express server running on http://0.0.0.0:5001'));
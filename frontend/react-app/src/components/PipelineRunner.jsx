import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function PipelineRunner() {
  const [selectedPipeline, setSelectedPipeline] = useState('snakemake');
  const [status, setStatus] = useState('idle');
  const [metrics, setMetrics] = useState(null);
  const [logs, setLogs] = useState('');
  const [selectedApi, setSelectedApi] = useState('express'); // 'flask' or 'express'

  const runPipeline = async () => {
    setStatus('running');
    setMetrics(null);
    setLogs('');

    const baseUrl = selectedApi === 'flask' ? 'http://localhost:5050' : 'http://localhost:5001';
    
    try {
      const response = await fetch(`${baseUrl}/pipeline/${selectedPipeline}`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer demo-token',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Pipeline execution failed: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setStatus('complete');
        setLogs(result.stdout || 'No logs available');
        
        if (result.metrics) {
          setMetrics([
            { name: 'Accuracy', value: parseFloat(result.metrics.accuracy) },
            { name: 'Precision', value: parseFloat(result.metrics.precision) }
          ]);
        }
      } else {
        setStatus('error');
        setLogs(result.stderr || 'Pipeline execution failed with no error details');
      }
    } catch (err) {
      console.error('Pipeline execution error:', err);
      setStatus('error');
      setLogs(`Error: ${err.message}`);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">ML Pipeline Runner</h2>
      
      <div className="mb-4">
        <label className="block text-sm mb-1">Pipeline Type</label>
        <select 
          value={selectedPipeline}
          onChange={(e) => setSelectedPipeline(e.target.value)}
          className="w-full px-3 py-2 bg-blue-900 bg-opacity-50 rounded"
        >
          <option value="snakemake">Snakemake</option>
          <option value="nextflow">Nextflow</option>
        </select>
      </div>
      
      <div className="flex justify-between mb-4">
        <div className="flex space-x-2">
          <button 
            className={`px-3 py-1 rounded ${selectedApi === 'flask' ? 'bg-blue-600' : 'bg-blue-900'}`}
            onClick={() => setSelectedApi('flask')}
          >
            Flask API
          </button>
          <button 
            className={`px-3 py-1 rounded ${selectedApi === 'express' ? 'bg-blue-600' : 'bg-blue-900'}`}
            onClick={() => setSelectedApi('express')}
          >
            Express API
          </button>
        </div>
        <button 
          className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={runPipeline}
          disabled={status === 'running'}
        >
          {status === 'running' ? 'Running...' : 'Run Pipeline'}
        </button>
      </div>
      
      <div className="mb-4">
        <div className={`px-3 py-2 rounded-full inline-block text-sm
          ${status === 'idle' ? 'bg-gray-700' : 
            status === 'running' ? 'bg-yellow-600' :
            status === 'complete' ? 'bg-green-600' : 'bg-red-600'}`
        }>
          Status: {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
      </div>
      
      {metrics && (
        <div className="bg-blue-900 bg-opacity-30 p-4 rounded-lg mb-4">
          <h3 className="text-lg mb-2">Pipeline Metrics</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a365d" />
                <XAxis dataKey="name" stroke="#a3bffa" />
                <YAxis domain={[0, 1]} stroke="#a3bffa" />
                <Tooltip />
                <Bar dataKey="value" fill="#38b2ac" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {metrics.map((metric) => (
              <div key={metric.name} className="bg-blue-800 bg-opacity-40 p-2 rounded-lg">
                <div className="text-sm text-blue-300">{metric.name}</div>
                <div className="text-xl font-semibold">{(metric.value * 100).toFixed(1)}%</div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="bg-blue-900 bg-opacity-30 p-4 rounded-lg">
        <h3 className="text-lg mb-2">Pipeline Logs</h3>
        <div className="bg-gray-900 p-3 rounded font-mono text-xs overflow-auto max-h-40">
          {logs ? logs.split('\n').map((line, i) => (
            <div key={i} className="whitespace-pre-wrap">{line}</div>
          )) : (
            <div className="text-gray-500">Run a pipeline to see logs</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PipelineRunner;
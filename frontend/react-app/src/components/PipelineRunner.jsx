import React, { useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

function PipelineRunner() {
  const [selectedPipeline, setSelectedPipeline] = useState('snakemake');
  const [status, setStatus] = useState('idle');
  const [metrics, setMetrics] = useState({ accuracy: null, precision: null });
  const [log, setLog] = useState('');

  const runPipeline = async () => {
    setStatus('running');
    setMetrics({ accuracy: null, precision: null });
    setLog('');

    try {
      const endpoint = `http://localhost:5000/pipeline/${selectedPipeline}`;
      const res = await axios.post(endpoint, {}, {
        headers: { Authorization: 'Bearer demo-token' }
      });

      setLog(res.data.stdout || res.data.stderr || 'No logs');

      const acc = await axios.get('/results/model_accuracy.txt');
      const prec = await axios.get('/results/model_precision.txt');

      setMetrics({
        accuracy: parseFloat(acc.data).toFixed(2),
        precision: parseFloat(prec.data).toFixed(2)
      });

      setStatus('complete');
    } catch (err) {
      console.error(err);
      setStatus('error');
      setLog('Error running pipeline');
    }
  };

  const chartData = {
    labels: ['Accuracy', 'Precision'],
    datasets: [
      {
        label: 'Model Metrics',
        data: [metrics.accuracy, metrics.precision],
        backgroundColor: ['#38bdf8', '#34d399']
      }
    ]
  };

  return (
    <div className="p-4 mt-6 text-white">
      <h2 className="text-2xl mb-4">Run ML Pipeline</h2>
      <div className="mb-4">
        <label className="mr-2">Pipeline:</label>
        <select value={selectedPipeline} onChange={(e) => setSelectedPipeline(e.target.value)} className="text-black">
          <option value="snakemake">Snakemake</option>
          <option value="nextflow">Nextflow</option>
        </select>
        <button onClick={runPipeline} className="ml-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">
          Run
        </button>
      </div>
      <p>Status: <strong>{status}</strong></p>
      {metrics.accuracy && metrics.precision && (
        <div className="my-4">
          <Bar data={chartData} />
        </div>
      )}
      <div className="mt-4 bg-gray-900 p-4 rounded text-sm whitespace-pre-wrap">
        <h3 className="font-bold mb-2">Pipeline Log</h3>
        {log}
      </div>
    </div>
  );
}

export default PipelineRunner;
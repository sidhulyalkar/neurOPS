import React, { useState, useEffect } from 'react';
import SessionViewer from './components/SessionViewer';
import PipelineRunner from './components/PipelineRunner';
import NeuronTraceViewer from './components/NeuronTraceViewer';

function App() {
  const [apiStatus, setApiStatus] = useState({
    flask: 'checking...',
    express: 'checking...'
  });

  useEffect(() => {
    // Check Flask API status
    fetch('http://localhost:5050/')
      .then(response => {
        if (response.ok) {
          setApiStatus(prev => ({ ...prev, flask: 'online' }));
        } else {
          setApiStatus(prev => ({ ...prev, flask: 'error' }));
        }
      })
      .catch(() => setApiStatus(prev => ({ ...prev, flask: 'offline' })));

    // Check Express API status
    fetch('http://localhost:5001/')
      .then(response => {
        if (response.ok) {
          setApiStatus(prev => ({ ...prev, express: 'online' }));
        } else {
          setApiStatus(prev => ({ ...prev, express: 'error' }));
        }
      })
      .catch(() => setApiStatus(prev => ({ ...prev, express: 'offline' })));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white">
      <header className="p-6 text-center">
        <h1 className="text-4xl font-bold">🧠 NeuroOps Platform</h1>
        <p className="mt-2 text-blue-300">RESTful Neuroscience API</p>
        
        <div className="flex justify-center gap-4 mt-4">
          <div className={`px-3 py-1 rounded-full text-sm ${
            apiStatus.flask === 'online' ? 'bg-green-500' : 
            apiStatus.flask === 'offline' ? 'bg-red-500' : 
            'bg-yellow-500'
          }`}>
            Flask API: {apiStatus.flask}
          </div>
          <div className={`px-3 py-1 rounded-full text-sm ${
            apiStatus.express === 'online' ? 'bg-green-500' : 
            apiStatus.express === 'offline' ? 'bg-red-500' : 
            'bg-yellow-500'
          }`}>
            Express API: {apiStatus.express}
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2 bg-blue-800 bg-opacity-20 rounded-lg p-6 shadow-lg">
          <SessionViewer />
        </div>
        
        <div className="bg-blue-800 bg-opacity-20 rounded-lg p-6 shadow-lg">
          <NeuronTraceViewer />
        </div>
        
        <div className="bg-blue-800 bg-opacity-20 rounded-lg p-6 shadow-lg">
          <PipelineRunner />
        </div>
      </main>
      
      <footer className="text-center p-4 text-blue-300 text-sm">
        NeuroOps Platform &copy; 2025 - RESTful Neuroscience
      </footer>
    </div>
  );
}

export default App;
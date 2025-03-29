import React, { useState, useEffect } from 'react';

function SessionViewer() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApi, setSelectedApi] = useState('flask'); // 'flask' or 'express'

  useEffect(() => {
    fetchSessions();
  }, [selectedApi]);

  const fetchSessions = async () => {
    setLoading(true);
    setError(null);
    
    const baseUrl = selectedApi === 'flask' ? 'http://localhost:5050' : 'http://localhost:5001';
    
    try {
      const response = await fetch(`${baseUrl}/sessions`, {
        headers: {
          'Authorization': 'Bearer demo-token'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching sessions: ${response.statusText}`);
      }
      
      const data = await response.json();
      setSessions(data);
    } catch (err) {
      console.error('Failed to fetch sessions:', err);
      setError(`Failed to fetch sessions: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Session Explorer</h2>
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
          <button 
            className="px-3 py-1 rounded bg-blue-700"
            onClick={fetchSessions}
          >
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500 border-r-2 mx-auto"></div>
          <p className="mt-2">Loading sessions...</p>
        </div>
      ) : error ? (
        <div className="bg-red-500 bg-opacity-20 p-4 rounded-lg">
          <p className="text-red-300">{error}</p>
          <button 
            className="mt-2 px-3 py-1 rounded bg-red-700 hover:bg-red-600"
            onClick={fetchSessions}
          >
            Try Again
          </button>
        </div>
      ) : (
        <div>
          <p className="mb-2">Available sessions from {selectedApi.toUpperCase()} API:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sessions.map((session, index) => (
              <div 
                key={index} 
                className="bg-blue-700 bg-opacity-30 p-4 rounded-lg cursor-pointer hover:bg-opacity-40 transition-all"
              >
                <h3 className="font-semibold text-lg">{session}</h3>
                <p className="text-sm text-blue-300">10 neurons</p>
                <div className="mt-2 text-xs text-blue-400">Last updated: Today</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SessionViewer;
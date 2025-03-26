import React from 'react';
import SessionViewer from './components/SessionViewer';
import PipelineRunner from './components/PipelineRunner';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white">
      <header className="p-4 text-center text-3xl font-bold">Neuro RESTful API Demo</header>
      <main className="p-4">
        <SessionViewer />
        <PipelineRunner />
      </main>
    </div>
  );
}

export default App;
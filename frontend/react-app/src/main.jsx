import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

function App() {
  return (
    <div className="text-center p-8">
      <h1 className="text-3xl font-bold text-white">🧠 NeuroOps Frontend</h1>
      <p className="text-white/80">React + Tailwind + Vite</p>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)

import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';

function App(): JSX.Element {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span>⚡</span>
            <span>EngageIQ</span>
          </h1>
          <p className="text-sm text-gray-600 mt-1">Smart LinkedIn comment generation</p>
        </header>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-500 text-center py-8">
            Select a LinkedIn post to get started
          </p>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);

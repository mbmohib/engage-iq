import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import type { LLMTier } from '../types';
import './styles.css';

function Settings(): JSX.Element {
  const [tier, setTier] = useState<LLMTier>('standard');

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <header className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">⚡ EngageIQ Settings</h1>
      </header>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            LLM Tier
          </label>
          <select
            value={tier}
            onChange={(e) => setTier(e.target.value as LLMTier)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-linkedin-blue"
          >
            <option value="budget">Budget (GPT-3.5)</option>
            <option value="standard">Standard (GPT-4)</option>
            <option value="premium">Premium (Claude Opus)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            OpenAI API Key
          </label>
          <input
            type="password"
            placeholder="sk-..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-linkedin-blue"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Anthropic API Key
          </label>
          <input
            type="password"
            placeholder="sk-ant-..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-linkedin-blue"
          />
        </div>

        <button className="w-full bg-linkedin-blue text-white py-2 px-4 rounded-md hover:bg-linkedin-dark transition">
          Save Settings
        </button>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<Settings />);

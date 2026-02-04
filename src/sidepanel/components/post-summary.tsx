import React from 'react';
import type { PostAnalysis } from '../../types';

interface PostSummaryCardProps {
  analysis?: PostAnalysis;
}

export function PostSummaryCard({ analysis }: PostSummaryCardProps): JSX.Element {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
      <h3 className="font-semibold text-gray-900 mb-3">Post Analysis</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Type:</span>
          <span className="font-medium text-gray-900">{analysis?.type || 'N/A'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Author Role:</span>
          <span className="font-medium text-gray-900">{analysis?.authorRole || 'N/A'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Tone:</span>
          <span className="font-medium text-gray-900">{analysis?.tone || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
}

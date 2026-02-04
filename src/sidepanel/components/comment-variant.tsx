import React from 'react';
import type { CommentTone } from '../../types';

interface CommentVariantProps {
  comment: string;
  tone: CommentTone;
  onCopy: () => void;
  onInsert: () => void;
}

export function CommentVariant({ comment, tone, onCopy, onInsert }: CommentVariantProps): JSX.Element {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-linkedin-blue uppercase tracking-wide">
          {tone}
        </span>
      </div>
      <p className="text-gray-800 text-sm mb-3 leading-relaxed">
        {comment}
      </p>
      <div className="flex gap-2">
        <button
          onClick={onCopy}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition"
        >
          Copy
        </button>
        <button
          onClick={onInsert}
          className="px-3 py-1.5 text-sm bg-linkedin-blue text-white rounded-md hover:bg-linkedin-dark transition"
        >
          Insert
        </button>
      </div>
    </div>
  );
}

// src/components/EmptyState.jsx
import React from 'react';

export function EmptyState({ onAction }) {
  return (
    <div className="col-span-full py-16 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-950/40 p-8 space-y-4">
      <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-full flex items-center justify-center mx-auto text-indigo-400 text-xl font-bold">
        📭
      </div>
      <div>
        <h3 className="text-base font-bold text-white">No Active Server Nodes Deployed</h3>
        <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
          Your cluster infrastructure currently has zero nodes. Deploy your first cluster node to start monitoring telemetry.
        </p>
      </div>
      <button
        onClick={onAction}
        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition cursor-pointer text-sm shadow-lg shadow-indigo-600/25 inline-flex items-center gap-2"
      >
        <span>⚡</span> Deploy First Node Now
      </button>
    </div>
  );
}
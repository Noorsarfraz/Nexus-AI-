// src/components/SkeletonLoader.jsx
import React from 'react';

export function SkeletonLoader() {
  return (
    <div className="bg-slate-950/80 border border-slate-800/80 p-5 rounded-xl flex flex-col justify-between gap-4 animate-pulse">
      <div className="space-y-2">
        <div className="h-5 bg-slate-800 rounded w-3/4"></div>
        <div className="h-3 bg-slate-800/60 rounded w-1/2"></div>
      </div>
      <div className="flex justify-end gap-2 pt-2 border-t border-slate-900">
        <div className="h-7 w-12 bg-slate-800 rounded-lg"></div>
        <div className="h-7 w-16 bg-slate-800 rounded-lg"></div>
      </div>
    </div>
  );
}
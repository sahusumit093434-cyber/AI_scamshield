import React from 'react';

const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  const renderSkeleton = (index) => {
    if (type === 'card') {
      return (
        <div key={index} className="cyber-glass rounded-xl p-6 cyber-panel-glow border border-cyberdark-border/40 animate-pulse">
          <div className="h-6 w-1/3 bg-cyberdark-border rounded mb-4"></div>
          <div className="h-4 w-full bg-cyberdark-border rounded mb-2"></div>
          <div className="h-4 w-5/6 bg-cyberdark-border rounded mb-2"></div>
          <div className="h-4 w-2/3 bg-cyberdark-border rounded"></div>
        </div>
      );
    }

    if (type === 'list') {
      return (
        <div key={index} className="flex items-center gap-4 py-3 border-b border-cyberdark-border/20 animate-pulse">
          <div className="h-10 w-10 bg-cyberdark-border rounded-full shrink-0"></div>
          <div className="flex-1">
            <div className="h-4 w-1/4 bg-cyberdark-border rounded mb-2"></div>
            <div className="h-3 w-3/4 bg-cyberdark-border rounded"></div>
          </div>
          <div className="h-6 w-16 bg-cyberdark-border rounded"></div>
        </div>
      );
    }

    if (type === 'stat') {
      return (
        <div key={index} className="cyber-glass rounded-xl p-5 border border-cyberdark-border/40 animate-pulse flex items-center justify-between">
          <div>
            <div className="h-3 w-16 bg-cyberdark-border rounded mb-2"></div>
            <div className="h-8 w-12 bg-cyberdark-border rounded"></div>
          </div>
          <div className="h-12 w-12 bg-cyberdark-border rounded-lg"></div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => renderSkeleton(i))}
    </div>
  );
};

export default SkeletonLoader;

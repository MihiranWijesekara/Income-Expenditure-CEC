import React from 'react';

export const SkeletonLoader = ({ height = "40px", count = 1 }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          style={{
            height,
            backgroundColor: 'var(--bg-surface-hover)',
            borderRadius: 'var(--radius-md)',
            animation: 'pulse 1.5s infinite ease-in-out'
          }}
        />
      ))}
    </div>
  );
};

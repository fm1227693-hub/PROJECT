import React, { useState } from 'react';

export default function OptimizedImage({
  src,
  alt,
  className = '',
  aspectRatio = '16/9',
  objectFit = 'cover',
  priority = false,
  fallback = null,
  ...props
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div
      className={`relative overflow-hidden bg-slate-100 dark:bg-slate-900/60 ${className}`}
      style={{ aspectRatio }}
    >
      {/* Loading Skeleton */}
      {!loaded && !error && (
        <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-700/50 dark:to-slate-800 animate-pulse" />
      )}

      {error ? (
        fallback || (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-slate-100 dark:bg-slate-900 text-slate-400">
            <svg className="w-8 h-8 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs font-medium">{alt || 'Image'}</span>
          </div>
        )
      ) : (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`w-full h-full transition-all duration-500 ${
            loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
          style={{ objectFit }}
          {...props}
        />
      )}
    </div>
  );
}

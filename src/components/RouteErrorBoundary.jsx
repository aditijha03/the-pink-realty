import React, { useEffect } from 'react';
import { useRouteError, Link } from 'react-router-dom';

export default function RouteErrorBoundary() {
  const error = useRouteError();
  const errorMessage = error?.message || error?.statusText || String(error || '');

  // Detect stale version / deployment mismatch errors
  const isChunkOrManifestError =
    errorMessage.includes('Unexpected token') ||
    errorMessage.includes('is not valid JSON') ||
    errorMessage.includes('Failed to fetch dynamically imported module') ||
    errorMessage.includes('Importing a module script failed');

  useEffect(() => {
    if (typeof window !== 'undefined' && isChunkOrManifestError) {
      // Auto-reload once to fetch the latest deployment files
      const reloadKey = 'app_auto_reload_attempt';
      const lastAttempt = sessionStorage.getItem(reloadKey);
      if (!lastAttempt || Date.now() - Number(lastAttempt) > 10000) {
        sessionStorage.setItem(reloadKey, String(Date.now()));
        window.location.reload();
      }
    }
  }, [isChunkOrManifestError]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-text px-4 py-12 text-center">
      <div className="max-w-md w-full bg-surface p-8 rounded-2xl border border-border shadow-soft">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-pink-light/20 flex items-center justify-center text-pink">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold font-heading mb-2">Update Available</h2>
        <p className="text-text-muted text-sm mb-6">
          The application was updated in the background. Please refresh the page to load the latest version.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="bg-pink-button hover:bg-pink-button-hover text-white px-6 py-2.5 rounded-full font-medium transition-colors shadow-soft text-sm"
          >
            Refresh Page
          </button>
          <a
            href="/"
            className="border border-border hover:bg-surface-2 text-text px-6 py-2.5 rounded-full font-medium transition-colors text-sm"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}

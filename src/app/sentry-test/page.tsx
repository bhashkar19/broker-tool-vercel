'use client';

import { useState } from 'react';

export default function SentryTestPage() {
  const [testResult, setTestResult] = useState<string>('');

  const triggerClientError = () => {
    setTestResult('Triggering client-side error...');
    // This will be caught by Sentry
    throw new Error('🧪 Sentry Test Error - Client Side');
  };

  const triggerServerError = async () => {
    setTestResult('Triggering server-side error...');
    try {
      const response = await fetch('/api/sentry-test-error');
      const data = await response.json();
      setTestResult(data.message || 'Error triggered');
    } catch (error) {
      setTestResult('Error triggered on server');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🔍 Sentry Test Page
          </h1>
          <p className="text-gray-600 mb-8">
            Test if Sentry error monitoring is working correctly
          </p>

          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h2 className="font-semibold text-blue-900 mb-2">
                Test Client-Side Error
              </h2>
              <p className="text-sm text-blue-700 mb-3">
                This will trigger an error in the browser that Sentry should capture.
              </p>
              <button
                onClick={triggerClientError}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition"
              >
                Trigger Client Error
              </button>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h2 className="font-semibold text-green-900 mb-2">
                Test Server-Side Error
              </h2>
              <p className="text-sm text-green-700 mb-3">
                This will trigger an error on the server that Sentry should capture.
              </p>
              <button
                onClick={triggerServerError}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition"
              >
                Trigger Server Error
              </button>
            </div>

            {testResult && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Status:</strong> {testResult}
                </p>
                <p className="text-xs text-yellow-600 mt-2">
                  Check your Sentry dashboard at{' '}
                  <a
                    href="https://sentry.io/organizations/paisowala/issues/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    sentry.io
                  </a>
                </p>
              </div>
            )}

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                ✅ What to Check:
              </h3>
              <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                <li>Error appears in Sentry dashboard within 60 seconds</li>
                <li>Error includes stack trace</li>
                <li>Environment is set to &quot;production&quot;</li>
                <li>User context is captured (session ID)</li>
              </ul>
            </div>

            <div className="text-center pt-4">
              <button
                onClick={() => window.location.href = '/'}
                className="text-blue-600 hover:text-blue-800 underline text-sm cursor-pointer bg-transparent border-none"
              >
                ← Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

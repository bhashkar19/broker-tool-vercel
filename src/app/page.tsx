'use client';

import { Suspense } from 'react';
import ModularBrokerTool from '@/components/ModularBrokerTool';

function LoadingFallback() {
  return (
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-8 text-center">
        <div className="animate-pulse space-y-3">
          <div className="h-8 bg-white/20 rounded w-48 mx-auto"></div>
          <div className="h-4 bg-white/10 rounded w-32 mx-auto"></div>
        </div>
      </div>
      <div className="px-6 py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="h-4 bg-gray-100 rounded w-1/2 mx-auto"></div>
          <div className="space-y-3 mt-6">
            <div className="h-16 bg-gray-100 rounded-xl"></div>
            <div className="h-16 bg-gray-100 rounded-xl"></div>
            <div className="h-16 bg-gray-100 rounded-xl"></div>
          </div>
        </div>
        <p className="text-center text-sm text-gray-500 mt-6">Loading your quiz...</p>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <Suspense fallback={<LoadingFallback />}>
        <ModularBrokerTool />
      </Suspense>
    </main>
  );
}
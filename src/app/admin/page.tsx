'use client';

import React, { useState, useEffect } from 'react';

interface Submission {
  id: number;
  name: string;
  mobile: string;
  current_broker: string;
  execution_issues: string;
  tools_satisfaction: string;
  support_experience: string;
  charges_concern: string;
  recommended_broker: string;
  created_at: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

interface Analytics {
  totalSubmissions: number;
  recentSubmissions: number;
  brokerRecommendations: { recommended_broker: string; count: number }[];
  topCurrentBrokers: { current_broker: string; count: number }[];
}

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedBroker, setSelectedBroker] = useState<string>('');
  const [view, setView] = useState<'submissions' | 'analytics'>('analytics');

  useEffect(() => {
    fetchAnalytics();
    fetchSubmissions();
  }, [selectedBroker]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/submissions?analytics=true');
      const data = await response.json();
      if (data.success) {
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const url = selectedBroker
        ? `/api/admin/submissions?broker=${selectedBroker}`
        : '/api/admin/submissions?limit=50';

      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setSubmissions(data.submissions || []);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading && !analytics) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Broker Tool Admin Dashboard
          </h1>

          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setView('analytics')}
              className={`px-4 py-2 rounded ${
                view === 'analytics'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setView('submissions')}
              className={`px-4 py-2 rounded ${
                view === 'submissions'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border'
              }`}
            >
              Submissions
            </button>
          </div>
        </div>

        {view === 'analytics' && analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Total Submissions
              </h3>
              <p className="text-3xl font-bold text-blue-600">
                {analytics.totalSubmissions}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Last 24 Hours
              </h3>
              <p className="text-3xl font-bold text-green-600">
                {analytics.recentSubmissions}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6 md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Top Recommended Brokers
              </h3>
              <div className="space-y-2">
                {analytics.brokerRecommendations.slice(0, 5).map((broker, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="capitalize">{broker.recommended_broker}</span>
                    <span className="font-semibold">{broker.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Users' Current Brokers
              </h3>
              <div className="space-y-2">
                {analytics.topCurrentBrokers.map((broker, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="capitalize">{broker.current_broker}</span>
                    <span className="font-semibold">{broker.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {view === 'submissions' && (
          <>
            <div className="mb-6 flex space-x-4">
              <select
                value={selectedBroker}
                onChange={(e) => setSelectedBroker(e.target.value)}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="">All Brokers</option>
                <option value="zerodha">Zerodha</option>
                <option value="upstox">Upstox</option>
                <option value="groww">Groww</option>
                <option value="angel_one">Angel One</option>
                <option value="fyers">Fyers</option>
                <option value="5paisa">5paisa</option>
              </select>

              <button
                onClick={fetchSubmissions}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Refresh
              </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  User Submissions ({submissions.length})
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User Info
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Current Broker
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Recommended
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Satisfaction
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {submissions.map((submission) => (
                      <tr key={submission.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="font-medium text-gray-900">
                              {submission.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {submission.mobile}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                          {submission.current_broker}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full capitalize">
                            {submission.recommended_broker}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="space-y-1">
                            <div>Tools: {submission.tools_satisfaction}</div>
                            <div>Support: {submission.support_experience}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(submission.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {submissions.length === 0 && !loading && (
                  <div className="text-center py-12 text-gray-500">
                    No submissions found
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
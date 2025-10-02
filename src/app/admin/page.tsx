'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Upload, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';

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
  conversion_status?: string;
  fb_sync_status?: string;
}

interface Analytics {
  totalSubmissions: number;
  recentSubmissions: number;
  brokerRecommendations: { recommended_broker: string; count: number }[];
  topCurrentBrokers: { current_broker: string; count: number }[];
  totalConversions?: number;
  pendingReview?: number;
  syncedToFacebook?: number;
}

interface ReviewItem {
  id: number;
  broker_name: string;
  broker_client_id?: string;
  broker_conversion_date?: string;
  potential_matches?: Array<{
    submission_id: number;
    name: string;
    mobile: string;
    confidence: number;
    created_at: string;
  }>;
}

interface UploadResult {
  success: boolean;
  importId?: number;
  summary?: {
    totalRows: number;
    autoMatched: number;
    needsReview: number;
    noMatch: number;
  };
  error?: string;
}

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedBroker, setSelectedBroker] = useState<string>('');
  const [view, setView] = useState<'analytics' | 'submissions' | 'upload' | 'review'>('analytics');

  // CSV Upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadBrokerId, setUploadBrokerId] = useState('zerodha');
  const [fileType, setFileType] = useState<'conversions' | 'leads'>('conversions');
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);

  // Review queue state
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>([]);
  const [loadingReview, setLoadingReview] = useState(false);

  // Facebook sync state
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{ success: boolean; message: string; synced?: number; failed?: number } | null>(null);

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

  const fetchSubmissions = useCallback(async () => {
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
  }, [selectedBroker]);

  const loadReviewQueue = async () => {
    setLoadingReview(true);
    try {
      const response = await fetch('/api/admin/review-queue');
      if (response.ok) {
        const data = await response.json();
        setReviewItems(data.items || []);
      }
    } catch (error) {
      console.error('Failed to load review queue:', error);
    } finally {
      setLoadingReview(false);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('brokerId', uploadBrokerId);
      formData.append('fileType', fileType);

      const response = await fetch('/api/admin/upload-csv', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setUploadResult({ success: true, ...data });
        setSelectedFile(null);
        loadReviewQueue();
        fetchAnalytics();
      } else {
        setUploadResult({ success: false, error: data.error || 'Upload failed' });
      }
    } catch (error) {
      setUploadResult({
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleApprove = async (reviewId: number, submissionId: number) => {
    try {
      const response = await fetch('/api/admin/approve-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId, submissionId }),
      });

      if (response.ok) {
        loadReviewQueue();
        fetchAnalytics();
      }
    } catch (error) {
      console.error('Failed to approve match:', error);
    }
  };

  const handleReject = async (reviewId: number) => {
    try {
      const response = await fetch('/api/admin/reject-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId }),
      });

      if (response.ok) {
        loadReviewQueue();
        fetchAnalytics();
      }
    } catch (error) {
      console.error('Failed to reject match:', error);
    }
  };

  const handleSyncToFacebook = async () => {
    setSyncing(true);
    setSyncResult(null);

    try {
      const response = await fetch('/api/admin/sync-facebook', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        setSyncResult({
          success: true,
          message: `Successfully synced ${data.synced} conversion(s) to Facebook!`,
          synced: data.synced,
          failed: data.failed,
        });
        // Refresh analytics to update sync status
        fetchAnalytics();
      } else {
        setSyncResult({
          success: false,
          message: data.error || 'Failed to sync conversions',
        });
      }
    } catch (error) {
      console.error('Sync error:', error);
      setSyncResult({
        success: false,
        message: 'Network error. Please try again.',
      });
    } finally {
      setSyncing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    fetchSubmissions();
    loadReviewQueue();
  }, [selectedBroker, fetchSubmissions]);

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
              className={`px-4 py-2 rounded flex items-center gap-2 ${
                view === 'analytics'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Analytics
            </button>
            <button
              onClick={() => setView('upload')}
              className={`px-4 py-2 rounded flex items-center gap-2 ${
                view === 'upload'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border'
              }`}
            >
              <Upload className="w-4 h-4" />
              Upload CSV
            </button>
            <button
              onClick={() => setView('review')}
              className={`px-4 py-2 rounded flex items-center gap-2 relative ${
                view === 'review'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border'
              }`}
            >
              <Clock className="w-4 h-4" />
              Review Queue
              {reviewItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {reviewItems.length}
                </span>
              )}
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

        {/* Upload CSV Section */}
        {view === 'upload' && (
          <div className="bg-white rounded-lg shadow p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Upload Broker CSV</h2>

            {/* File Upload Area */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 transition-colors cursor-pointer"
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              {selectedFile ? (
                <div>
                  <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-600">Drag and drop CSV file here, or click to browse</p>
                  <p className="text-xs text-gray-500 mt-2">Supports .csv files only</p>
                </div>
              )}
              <input
                id="file-input"
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
            </div>

            {/* Configuration */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Broker
                </label>
                <select
                  value={uploadBrokerId}
                  onChange={(e) => setUploadBrokerId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="zerodha">Zerodha</option>
                  <option value="angel_one">Angel One</option>
                  <option value="upstox">Upstox</option>
                  <option value="groww">Groww</option>
                  <option value="icici_direct">ICICI Direct</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  File Type
                </label>
                <select
                  value={fileType}
                  onChange={(e) => setFileType(e.target.value as 'conversions' | 'leads')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="conversions">Conversions</option>
                  <option value="leads">Leads</option>
                </select>
              </div>
            </div>

            {/* Upload Button */}
            <button
              onClick={handleFileUpload}
              disabled={!selectedFile || uploading}
              className="w-full mt-6 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {uploading ? 'Uploading...' : 'Upload and Process'}
            </button>

            {/* Upload Result */}
            {uploadResult && (
              <div className={`mt-6 p-4 rounded-lg ${uploadResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                {uploadResult.success ? (
                  <div>
                    <h3 className="font-semibold text-green-900 mb-2">Upload Successful!</h3>
                    {uploadResult.summary && (
                      <div className="text-sm text-green-800 space-y-1">
                        <p>✅ Total rows: {uploadResult.summary.totalRows}</p>
                        <p>✅ Auto-matched: {uploadResult.summary.autoMatched}</p>
                        <p>⚠️ Needs review: {uploadResult.summary.needsReview}</p>
                        <p>❌ No match: {uploadResult.summary.noMatch}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <h3 className="font-semibold text-red-900 mb-2">Upload Failed</h3>
                    <p className="text-sm text-red-800">{uploadResult.error}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Review Queue Section */}
        {view === 'review' && (
          <div className="bg-white rounded-lg shadow p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Manual Review Queue</h2>

            {loadingReview ? (
              <p className="text-gray-600 text-center py-12">Loading...</p>
            ) : reviewItems.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <p className="text-gray-600">No items pending review</p>
                <p className="text-sm text-gray-500 mt-2">All conversions have been auto-matched!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviewItems.map((item) => {
                  const bestMatch = item.potential_matches?.[0];

                  return (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="grid grid-cols-2 gap-6">
                        {/* Broker Data */}
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">Broker Data</h4>
                          <div className="bg-gray-50 rounded p-4 space-y-2">
                            <p className="text-lg font-bold text-gray-900">{item.broker_name}</p>
                            {item.broker_client_id && (
                              <p className="text-sm text-gray-600">Client ID: {item.broker_client_id}</p>
                            )}
                            {item.broker_conversion_date && (
                              <p className="text-sm text-gray-600">
                                Date: {new Date(item.broker_conversion_date).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Best Match */}
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">Best Match</h4>
                          {bestMatch ? (
                            <div className="bg-blue-50 rounded p-4 space-y-2">
                              <div className="flex items-center justify-between">
                                <p className="text-lg font-bold text-gray-900">{bestMatch.name}</p>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  bestMatch.confidence >= 85
                                    ? 'bg-green-100 text-green-800'
                                    : bestMatch.confidence >= 70
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-orange-100 text-orange-800'
                                }`}>
                                  {bestMatch.confidence.toFixed(0)}% match
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">Mobile: ****{bestMatch.mobile.slice(-4)}</p>
                              <p className="text-sm text-gray-600">
                                Submitted: {new Date(bestMatch.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          ) : (
                            <div className="bg-gray-50 rounded p-4">
                              <p className="text-sm text-gray-500">No potential matches found</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 mt-6">
                        <button
                          onClick={() => bestMatch && handleApprove(item.id, bestMatch.submission_id)}
                          disabled={!bestMatch}
                          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve Match
                        </button>
                        <button
                          onClick={() => handleReject(item.id)}
                          className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {view === 'analytics' && analytics && (
          <>
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

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Total Conversions
                </h3>
                <p className="text-3xl font-bold text-purple-600">
                  {analytics.totalConversions || 0}
                </p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Pending Review
                </h3>
                <p className="text-3xl font-bold text-orange-600">
                  {analytics.pendingReview || 0}
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
                Users&apos; Current Brokers
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

          {/* Facebook Sync Section */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Facebook Conversions Sync</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Sync approved conversions to Facebook for better ad targeting
                </p>
              </div>
              <button
                onClick={handleSyncToFacebook}
                disabled={syncing}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {syncing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Syncing...
                  </>
                ) : (
                  <>
                    🔄 Sync to Facebook
                  </>
                )}
              </button>
            </div>

            {syncResult && (
              <div className={`p-4 rounded-lg ${
                syncResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <p className={`text-sm font-medium ${
                  syncResult.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {syncResult.success ? '✅ ' : '❌ '}
                  {syncResult.message}
                </p>
                {syncResult.success && syncResult.synced !== undefined && (
                  <p className="text-xs text-green-700 mt-1">
                    {syncResult.synced} conversions synced successfully
                    {syncResult.failed && syncResult.failed > 0 && `, ${syncResult.failed} failed`}
                  </p>
                )}
              </div>
            )}

            {analytics.syncedToFacebook !== undefined && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">Synced to Facebook</p>
                  <p className="text-2xl font-bold text-blue-700 mt-1">{analytics.syncedToFacebook}</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <p className="text-sm text-orange-600 font-medium">Pending Sync</p>
                  <p className="text-2xl font-bold text-orange-700 mt-1">
                    {(analytics.totalConversions || 0) - (analytics.syncedToFacebook || 0)}
                  </p>
                </div>
              </div>
            )}
          </div>
          </>
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
'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Layout } from '@/components/Layout';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

interface Vendor {
  _id: string;
  name: string;
  upi_id?: string;
  bank_account?: string;
  ifsc?: string;
}

interface AuditEntry {
  _id: string;
  action: 'CREATED' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  performed_by_email: string;
  timestamp: string;
}

interface Payout {
  _id: string;
  vendor_id: Vendor;
  amount: number;
  mode: 'UPI' | 'IMPS' | 'NEFT';
  note?: string;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected';
  decision_reason?: string;
  createdAt: string;
  auditTrail: AuditEntry[];
}

const statusColors: Record<string, { bg: string; text: string }> = {
  Draft: { bg: 'bg-gray-100', text: 'text-gray-800' },
  Submitted: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  Approved: { bg: 'bg-green-100', text: 'text-green-800' },
  Rejected: { bg: 'bg-red-100', text: 'text-red-800' },
};

const actionIcons: Record<string, string> = {
  CREATED: '📝',
  SUBMITTED: '📤',
  APPROVED: '✅',
  REJECTED: '❌',
};

export default function PayoutDetailPage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const router = useRouter();
  const [payout, setPayout] = useState<Payout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    fetchPayout();
  }, [params.id]);

  const fetchPayout = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await api.get(`/payouts/${params.id}`);
      setPayout(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch payout');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setActionLoading(true);
      await api.post(`/payouts/${params.id}/submit`);
      fetchPayout();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit payout');
    } finally {
      setActionLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      setActionLoading(true);
      await api.post(`/payouts/${params.id}/approve`);
      fetchPayout();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to approve payout');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      setError('Please provide a reason for rejection');
      return;
    }

    try {
      setActionLoading(true);
      await api.post(`/payouts/${params.id}/reject`, {
        decision_reason: rejectReason,
      });
      setShowRejectModal(false);
      setRejectReason('');
      fetchPayout();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to reject payout');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (!payout) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error || 'Payout not found'}
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  const canSubmit = user?.role === 'OPS' && payout.status === 'Draft';
  const canApprove = user?.role === 'FINANCE' && payout.status === 'Submitted';
  const canReject = user?.role === 'FINANCE' && payout.status === 'Submitted';

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Payout Details</h1>
              <p className="text-gray-600 mt-1">ID: {payout._id}</p>
            </div>
            <Link
              href="/payouts"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to Payouts
            </Link>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Payout Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Status Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Status</h2>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        statusColors[payout.status].bg
                      } ${statusColors[payout.status].text}`}
                    >
                      {payout.status}
                    </span>
                  </div>
                </div>

                {payout.decision_reason && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm font-medium text-red-900 mb-1">Rejection Reason:</p>
                    <p className="text-sm text-red-800">{payout.decision_reason}</p>
                  </div>
                )}
              </div>

              {/* Payout Details */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Payout Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Vendor</p>
                    <p className="text-lg font-semibold text-gray-900">{payout.vendor_id.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Amount</p>
                    <p className="text-lg font-semibold text-gray-900">
                      ₹{payout.amount.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment Mode</p>
                    <p className="text-lg font-semibold text-gray-900">{payout.mode}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Created</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatDate(payout.createdAt)}
                    </p>
                  </div>
                </div>

                {payout.note && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">Note</p>
                    <p className="text-gray-900">{payout.note}</p>
                  </div>
                )}
              </div>

              {/* Vendor Details */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Vendor Payment Details</h2>
                <div className="space-y-3">
                  {payout.vendor_id.upi_id && (
                    <div>
                      <p className="text-sm text-gray-600">UPI ID</p>
                      <p className="text-gray-900 font-mono">{payout.vendor_id.upi_id}</p>
                    </div>
                  )}
                  {payout.vendor_id.bank_account && (
                    <div>
                      <p className="text-sm text-gray-600">Bank Account</p>
                      <p className="text-gray-900 font-mono">
                        ****{payout.vendor_id.bank_account.slice(-4)}
                      </p>
                    </div>
                  )}
                  {payout.vendor_id.ifsc && (
                    <div>
                      <p className="text-sm text-gray-600">IFSC Code</p>
                      <p className="text-gray-900 font-mono">{payout.vendor_id.ifsc}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Action Buttons */}
              {(canSubmit || canApprove || canReject) && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
                  <div className="space-y-3">
                    {canSubmit && (
                      <button
                        onClick={handleSubmit}
                        disabled={actionLoading}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                      >
                        {actionLoading ? 'Submitting...' : 'Submit Payout'}
                      </button>
                    )}
                    {canApprove && (
                      <button
                        onClick={handleApprove}
                        disabled={actionLoading}
                        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                      >
                        {actionLoading ? 'Approving...' : 'Approve Payout'}
                      </button>
                    )}
                    {canReject && (
                      <button
                        onClick={() => setShowRejectModal(true)}
                        disabled={actionLoading}
                        className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                      >
                        Reject Payout
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Audit Trail */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Audit Trail</h2>
                <div className="space-y-4">
                  {payout.auditTrail.map((entry, index) => (
                    <div key={entry._id} className="flex gap-4">
                      <div className="text-2xl">{actionIcons[entry.action]}</div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">{entry.action}</p>
                        <p className="text-xs text-gray-600">{entry.performed_by_email}</p>
                        <p className="text-xs text-gray-500">{formatDate(entry.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Reject Modal */}
          {showRejectModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Reject Payout</h3>
                <p className="text-gray-600 mb-4">
                  Please provide a reason for rejecting this payout request.
                </p>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Enter rejection reason"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleReject}
                    disabled={actionLoading || !rejectReason.trim()}
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {actionLoading ? 'Rejecting...' : 'Reject'}
                  </button>
                  <button
                    onClick={() => {
                      setShowRejectModal(false);
                      setRejectReason('');
                    }}
                    disabled={actionLoading}
                    className="flex-1 bg-gray-200 text-gray-900 py-2 rounded-lg hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}

'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-8 text-white">
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, {user?.email.split('@')[0]}! 👋
            </h1>
            <p className="text-blue-100 text-lg">
              You are logged in as <span className="font-semibold bg-white/20 px-3 py-1 rounded-full">{user?.role}</span>
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Your Role</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{user?.role}</p>
                </div>
                <div className="text-4xl">👤</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Email</p>
                  <p className="text-lg font-bold text-gray-900 mt-1 truncate">{user?.email}</p>
                </div>
                <div className="text-4xl">📧</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Status</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">Active</p>
                </div>
                <div className="text-4xl">✅</div>
              </div>
            </div>
          </div>

          {/* Main Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vendors Card */}
            <Link href="/vendors">
              <div className="bg-white rounded-2xl shadow-md p-8 hover:shadow-xl transition cursor-pointer group">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-5xl group-hover:scale-110 transition">🏢</div>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                    Manage
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Vendors</h2>
                <p className="text-gray-600 mb-4">
                  Manage vendor information and payment methods
                </p>
                <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition">
                  View Vendors →
                </div>
              </div>
            </Link>

            {/* Payouts Card */}
            <Link href="/payouts">
              <div className="bg-white rounded-2xl shadow-md p-8 hover:shadow-xl transition cursor-pointer group">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-5xl group-hover:scale-110 transition">💰</div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    user?.role === 'OPS'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-purple-100 text-purple-700'
                  }`}>
                    {user?.role === 'OPS' ? 'Create' : 'Review'}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Payouts</h2>
                <p className="text-gray-600 mb-4">
                  {user?.role === 'OPS'
                    ? 'Create and submit payout requests'
                    : 'Review and approve payout requests'}
                </p>
                <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition">
                  View Payouts →
                </div>
              </div>
            </Link>
          </div>

          {/* Role-Based Info */}
          <div className={`rounded-2xl p-8 ${
            user?.role === 'OPS'
              ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200'
              : 'bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200'
          }`}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {user?.role === 'OPS' ? '📝 OPS Responsibilities' : '✅ FINANCE Responsibilities'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user?.role === 'OPS' ? (
                <>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">✏️</span>
                    <div>
                      <p className="font-semibold text-gray-900">Create Payouts</p>
                      <p className="text-sm text-gray-600">Create new payout requests in Draft status</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📤</span>
                    <div>
                      <p className="font-semibold text-gray-900">Submit for Approval</p>
                      <p className="text-sm text-gray-600">Submit Draft payouts for FINANCE review</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">👥</span>
                    <div>
                      <p className="font-semibold text-gray-900">Manage Vendors</p>
                      <p className="text-sm text-gray-600">Add and view vendor information</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📊</span>
                    <div>
                      <p className="font-semibold text-gray-900">Track Status</p>
                      <p className="text-sm text-gray-600">Monitor payout status and audit trail</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">✅</span>
                    <div>
                      <p className="font-semibold text-gray-900">Approve Payouts</p>
                      <p className="text-sm text-gray-600">Review and approve submitted payouts</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">❌</span>
                    <div>
                      <p className="font-semibold text-gray-900">Reject Payouts</p>
                      <p className="text-sm text-gray-600">Reject payouts with detailed reasons</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🔍</span>
                    <div>
                      <p className="font-semibold text-gray-900">Review Details</p>
                      <p className="text-sm text-gray-600">View vendor and payout information</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📋</span>
                    <div>
                      <p className="font-semibold text-gray-900">Audit Trail</p>
                      <p className="text-sm text-gray-600">Track all actions and decisions</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}

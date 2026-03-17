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
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome, {user?.email}!
            </h1>
            <p className="text-gray-600">
              You are logged in as <span className="font-semibold">{user?.role}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vendors Card */}
            <Link href="/vendors">
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer">
                <div className="text-4xl mb-4">🏢</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Vendors</h2>
                <p className="text-gray-600">Manage vendor information and payment methods</p>
              </div>
            </Link>

            {/* Payouts Card */}
            <Link href="/payouts">
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer">
                <div className="text-4xl mb-4">💰</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Payouts</h2>
                <p className="text-gray-600">
                  {user?.role === 'OPS'
                    ? 'Create and submit payout requests'
                    : 'Review and approve payout requests'}
                </p>
              </div>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Your Role</p>
                <p className="text-2xl font-bold text-blue-600">{user?.role}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-lg font-semibold text-gray-900">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="text-lg font-semibold text-green-600">Active</p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}

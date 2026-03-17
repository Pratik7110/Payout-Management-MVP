'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Layout } from '@/components/Layout';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

interface Vendor {
  _id: string;
  name: string;
}

export default function NewPayoutPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [formData, setFormData] = useState({
    vendor_id: '',
    amount: '',
    mode: 'UPI',
    note: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingVendors, setIsLoadingVendors] = useState(true);

  useEffect(() => {
    // Only OPS can create payouts
    if (user?.role !== 'OPS') {
      router.push('/payouts');
      return;
    }
    fetchVendors();
  }, [user, router]);

  const fetchVendors = async () => {
    try {
      const response = await api.get('/vendors');
      setVendors(response.data);
    } catch (err) {
      setError('Failed to fetch vendors');
    } finally {
      setIsLoadingVendors(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.vendor_id) {
      setError('Please select a vendor');
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    if (!formData.mode) {
      setError('Please select a payment mode');
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.post('/payouts', {
        vendor_id: formData.vendor_id,
        amount: parseFloat(formData.amount),
        mode: formData.mode,
        note: formData.note.trim() || undefined,
      });

      router.push(`/payouts/${response.data._id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create payout');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingVendors) {
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

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create Payout Request</h1>
            <p className="text-gray-600 mt-1">Create a new payout request in Draft status</p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg shadow p-8 max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Vendor */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Vendor <span className="text-red-600">*</span>
                </label>
                <select
                  name="vendor_id"
                  value={formData.vendor_id}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a vendor</option>
                  {vendors.map((vendor) => (
                    <option key={vendor._id} value={vendor._id}>
                      {vendor.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Amount (₹) <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Enter amount"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Must be greater than 0</p>
              </div>

              {/* Mode */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Payment Mode <span className="text-red-600">*</span>
                </label>
                <select
                  name="mode"
                  value={formData.mode}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="UPI">UPI</option>
                  <option value="IMPS">IMPS</option>
                  <option value="NEFT">NEFT</option>
                </select>
              </div>

              {/* Note */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Note (Optional)
                </label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  placeholder="Add any notes about this payout"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>Note:</strong> This payout will be created in Draft status. You can submit it for approval after creation.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Creating...' : 'Create Payout'}
                </button>
                <Link
                  href="/payouts"
                  className="flex-1 bg-gray-200 text-gray-900 py-2 rounded-lg font-medium hover:bg-gray-300 transition text-center"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}

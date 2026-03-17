'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Layout } from '@/components/Layout';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

export default function NewVendorPage() {
  const [formData, setFormData] = useState({
    name: '',
    upi_id: '',
    bank_account: '',
    ifsc: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    if (!formData.name.trim()) {
      setError('Vendor name is required');
      return;
    }

    if (formData.name.trim().length < 2 || formData.name.trim().length > 100) {
      setError('Vendor name must be between 2 and 100 characters');
      return;
    }

    if (!/^[a-zA-Z0-9\s\-&.,()]+$/.test(formData.name)) {
      setError('Vendor name contains invalid characters');
      return;
    }

    if (!formData.upi_id.trim() && !formData.bank_account.trim()) {
      setError('At least one payment method (UPI ID or Bank Account) is required');
      return;
    }

    if (formData.upi_id.trim() && !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/.test(formData.upi_id)) {
      setError('UPI ID must be in format: username@bank (e.g., vendor@upi)');
      return;
    }

    if (formData.bank_account.trim() && !/^\d{10,18}$/.test(formData.bank_account)) {
      setError('Bank account must be 10-18 digits');
      return;
    }

    if (formData.ifsc.trim() && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifsc)) {
      setError('IFSC code must be 11 characters (e.g., HDFC0001234)');
      return;
    }

    try {
      setIsLoading(true);
      await api.post('/vendors', {
        name: formData.name.trim(),
        upi_id: formData.upi_id.trim() || undefined,
        bank_account: formData.bank_account.trim() || undefined,
        ifsc: formData.ifsc.trim() || undefined,
      });

      router.push('/vendors');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create vendor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Add New Vendor</h1>
            <p className="text-gray-600 mt-1">Create a new vendor in the system</p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg shadow p-8 max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Vendor Name */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Vendor Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter vendor name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">2-100 characters, alphanumeric and basic punctuation only</p>
              </div>

              {/* UPI ID */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  UPI ID
                </label>
                <input
                  type="text"
                  name="upi_id"
                  value={formData.upi_id}
                  onChange={handleChange}
                  placeholder="e.g., vendor@upi"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Format: username@bank (e.g., vendor@upi)</p>
              </div>

              {/* Bank Account */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Bank Account Number
                </label>
                <input
                  type="text"
                  name="bank_account"
                  value={formData.bank_account}
                  onChange={handleChange}
                  placeholder="e.g., 1234567890"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">10-18 digits only</p>
              </div>

              {/* IFSC */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  IFSC Code
                </label>
                <input
                  type="text"
                  name="ifsc"
                  value={formData.ifsc}
                  onChange={handleChange}
                  placeholder="e.g., HDFC0001234"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">11 characters: 4 letters, 0, then 6 alphanumeric (e.g., HDFC0001234)</p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Note */}
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>Note:</strong> At least one payment method (UPI ID or Bank Account) is required.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Creating...' : 'Create Vendor'}
                </button>
                <Link
                  href="/vendors"
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

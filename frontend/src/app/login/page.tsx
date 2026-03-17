'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const fillOpsCredentials = () => {
    setEmail('ops@demo.com');
    setPassword('ops123');
  };

  const fillFinanceCredentials = () => {
    setEmail('finance@demo.com');
    setPassword('fin123');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">💰</div>
          <h1 className="text-3xl font-bold text-gray-900">Payout Management</h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Quick Login Buttons */}
        <div className="space-y-3 mb-6">
          <p className="text-center text-sm text-gray-600 font-medium">Quick Login</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={fillOpsCredentials}
              className="bg-blue-50 border-2 border-blue-200 text-blue-700 py-3 rounded-lg font-semibold hover:bg-blue-100 transition"
            >
              👤 OPS User
            </button>
            <button
              onClick={fillFinanceCredentials}
              className="bg-purple-50 border-2 border-purple-200 text-purple-700 py-3 rounded-lg font-semibold hover:bg-purple-100 transition"
            >
              💼 FINANCE User
            </button>
          </div>
        </div>

        {/* Test Credentials Info */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
          <p className="text-sm font-semibold text-gray-900 mb-4">📋 Test Credentials</p>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-blue-700 mb-1">OPS User</p>
              <p className="text-xs text-gray-700 font-mono">ops@demo.com / ops123</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-purple-700 mb-1">FINANCE User</p>
              <p className="text-xs text-gray-700 font-mono">finance@demo.com / fin123</p>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

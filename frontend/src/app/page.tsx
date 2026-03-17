export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              💰 Payout Management
            </div>
            <a
              href="/login"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Sign In
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Streamlined Payout Management
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A complete solution for managing vendor payouts with role-based access control, audit trails, and seamless workflows.
          </p>
          <a
            href="/login"
            className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-lg hover:shadow-lg transition font-semibold text-lg"
          >
            Get Started →
          </a>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition">
            <div className="text-4xl mb-4">🔐</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Secure Authentication</h3>
            <p className="text-gray-600">JWT-based authentication with role-based access control for OPS and FINANCE teams.</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Workflows</h3>
            <p className="text-gray-600">Streamlined payout workflows with status transitions and approval processes.</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Audit Trail</h3>
            <p className="text-gray-600">Complete audit history tracking all actions with timestamps and user information.</p>
          </div>
        </div>

        {/* Test Credentials */}
        <div className="mt-20 bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Test Credentials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-blue-600 font-semibold mb-2">OPS User</p>
              <p className="text-gray-900 font-mono text-sm">ops@demo.com</p>
              <p className="text-gray-900 font-mono text-sm">ops123</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <p className="text-sm text-purple-600 font-semibold mb-2">FINANCE User</p>
              <p className="text-gray-900 font-mono text-sm">finance@demo.com</p>
              <p className="text-gray-900 font-mono text-sm">fin123</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>© 2026 Payout Management System. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Payout Management System</h1>
        <p className="text-gray-600 mb-8">
          Role-based payout management for OPS and FINANCE teams
        </p>
        <div className="space-x-4">
          <a
            href="/login"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </a>
        </div>
      </div>
    </main>
  )
}

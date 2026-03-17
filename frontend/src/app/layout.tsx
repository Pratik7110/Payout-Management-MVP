import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Payout Management System',
  description: 'Manage vendor payouts with role-based access control',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

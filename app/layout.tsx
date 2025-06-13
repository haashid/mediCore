import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'clinic Booking',
  description: 'Created by Haashid',
  generator: 'haashid-dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

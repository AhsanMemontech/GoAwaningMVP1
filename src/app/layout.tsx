import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NYC Awning Cleaners - Professional Results Showcase',
  description: 'Transform your business appearance with our premium awning cleaning services. Showcase the dramatic difference we make for restaurants, retail stores, and businesses across NYC.',
  keywords: 'awning cleaning, NYC, before after, professional cleaning, restaurant cleaning, business cleaning',
  authors: [{ name: 'NYC Awning Cleaners' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#667eea',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
} 
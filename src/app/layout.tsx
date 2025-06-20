import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NYC Awning Cleaners - Professional Results Showcase',
  description: 'Transform your business appearance with our premium awning cleaning services. Showcase the dramatic difference we make for restaurants, retail stores, and businesses across NYC.',
  keywords: 'awning cleaning, NYC, before after, professional cleaning, restaurant cleaning, business cleaning',
  authors: [{ name: 'NYC Awning Cleaners' }],
  openGraph: {
    title: 'NYC Awning Cleaners - Professional Results Showcase',
    description: 'Transform your business appearance with our premium awning cleaning services.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NYC Awning Cleaners - Professional Results Showcase',
    description: 'Transform your business appearance with our premium awning cleaning services.',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#667eea',
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="NYC Awning Cleaners" />
        <meta name="msapplication-TileColor" content="#667eea" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
} 
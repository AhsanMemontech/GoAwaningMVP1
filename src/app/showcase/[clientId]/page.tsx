'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

interface ClientData {
  id: string
  name: string
  type: string
  beforeImage: string
  afterImage: string
  date: string
}

export default function ClientShowcase() {
  const params = useParams()
  const router = useRouter()
  const clientId = params.clientId as string
  const [clientData, setClientData] = useState<ClientData | null>(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    // Get client data from localStorage
    const storedData = localStorage.getItem(`client_${clientId}`)
    if (storedData) {
      try {
        const data = JSON.parse(storedData)
        setClientData(data)
      } catch (error) {
        console.error('Error parsing client data:', error)
        router.push('/')
      }
    } else {
      // No data found, redirect to home
      router.push('/')
    }
    setLoading(false)
  }, [clientId, router])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy link:', err)
    }
  }

  const downloadImages = async () => {
    if (!clientData) return

    setDownloading(true)
    
    try {
      // Convert data URLs to Blobs
      const beforeResponse = await fetch(clientData.beforeImage)
      const beforeBlob = await beforeResponse.blob()
      
      const afterResponse = await fetch(clientData.afterImage)
      const afterBlob = await afterResponse.blob()

      // Create download links for each image
      const beforeLink = document.createElement('a')
      beforeLink.href = URL.createObjectURL(beforeBlob)
      beforeLink.download = `${clientData.name}_before_cleaning.jpg`
      document.body.appendChild(beforeLink)
      beforeLink.click()
      document.body.removeChild(beforeLink)

      // Small delay to ensure first download starts
      setTimeout(() => {
        const afterLink = document.createElement('a')
        afterLink.href = URL.createObjectURL(afterBlob)
        afterLink.download = `${clientData.name}_after_cleaning.jpg`
        document.body.appendChild(afterLink)
        afterLink.click()
        document.body.removeChild(afterLink)
        
        // Clean up object URLs
        URL.revokeObjectURL(beforeLink.href)
        URL.revokeObjectURL(afterLink.href)
        
        setDownloading(false)
      }, 500)

    } catch (error) {
      console.error('Error downloading images:', error)
      alert('Error downloading images. Please try again.')
      setDownloading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center safe-area-padding">
        <div className="text-center">
          <div className="animate-spin rounded-full h-24 w-24 md:h-32 md:w-32 border-b-2 border-blue-500 mx-auto mb-6 md:mb-8"></div>
          <p className="text-white mobile-text-lg md:text-xl">Loading showcase...</p>
        </div>
      </div>
    )
  }

  if (!clientData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center safe-area-padding">
        <div className="text-center">
          <p className="text-white mobile-text-lg md:text-xl mb-4">Showcase not found</p>
          <button 
            onClick={() => router.push('/')}
            className="btn btn-primary touch-target"
          >
            Create New Showcase
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden safe-area-padding">
      {/* Modern Background Pattern */}
      <div className="absolute inset-0 bg-pattern"></div>
      
      {/* Floating Elements - Hidden on mobile for better performance */}
      <div className="hidden md:block absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="hidden md:block absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="hidden md:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="container mx-auto mobile-px relative z-10 mobile-py">
        {/* Hero Section */}
        <div className="text-center mb-8 md:mb-16 mobile-slide-in">
          {/* Logo/Brand */}
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl md:rounded-3xl mb-6 md:mb-8 shadow-2xl transform hover:scale-105 transition-all duration-500 touch-target">
            <svg className="w-8 h-8 md:w-12 md:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>

          {/* Main Heading */}
          <h1 className="mobile-text-2xl md:text-3xl font-bold text-white mb-4 md:mb-6 leading-tight">
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-blue-600 bg-clip-text text-transparent">
              NYC Awning Cleaners
            </span>
            <span className="block mobile-text-lg md:text-3xl font-medium text-gray-300 mt-2 md:mt-4">
              Professional Results Showcase
            </span>
          </h1>

          {/* Client Info Card */}
          <div className="card p-6 md:p-8 max-w-2xl mx-auto mobile-slide-in">
            <h2 className="mobile-text-2xl md:text-3xl font-bold text-white mb-3 md:mb-4">{clientData.name}</h2>
            <p className="text-gray-300 capitalize mobile-text-lg">{clientData.type} • {clientData.date}</p>
            <div className="mt-4 md:mt-6 flex flex-wrap justify-center mobile-gap">
              <span className="px-3 py-2 md:px-4 md:py-2 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">Before & After</span>
              <span className="px-3 py-2 md:px-4 md:py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">Professional Results</span>
              <span className="px-3 py-2 md:px-4 md:py-2 bg-purple-500/20 text-purple-400 rounded-full text-sm font-medium">NYC Service</span>
            </div>
          </div>
        </div>

        {/* Image Display Area */}
        <div className="max-w-7xl mx-auto mb-12 md:mb-16">
          <div className="card overflow-hidden mobile-slide-in">
            <div className="p-6 md:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 mobile-gap">
                <div className="text-center space-y-4 md:space-y-6">
                  <div className="bg-red-500 text-white px-4 py-2 md:px-6 md:py-3 rounded-full mobile-text-lg md:text-lg font-bold inline-block shadow-lg">
                    BEFORE CLEANING
                  </div>
                  <div className="card p-4 md:p-6">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={clientData.beforeImage}
                      alt="Before awning cleaning"
                      className="w-full rounded-2xl shadow-2xl"
                    />
                  </div>
                  <div className="space-y-2 md:space-y-3">
                    <h4 className="mobile-text-lg md:text-xl font-bold text-white">Dirty, Stained Awning</h4>
                    <p className="text-gray-400 leading-relaxed mobile-text-sm">
                      The awning was covered in dirt, grime, and environmental stains, 
                      significantly affecting the business&apos;s professional appearance and curb appeal.
                    </p>
                  </div>
                </div>
                <div className="text-center space-y-4 md:space-y-6">
                  <div className="bg-green-500 text-white px-4 py-2 md:px-6 md:py-3 rounded-full mobile-text-lg md:text-lg font-bold inline-block shadow-lg">
                    AFTER CLEANING
                  </div>
                  <div className="card p-4 md:p-6">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={clientData.afterImage}
                      alt="After awning cleaning"
                      className="w-full rounded-2xl shadow-2xl"
                    />
                  </div>
                  <div className="space-y-2 md:space-y-3">
                    <h4 className="mobile-text-lg md:text-xl font-bold text-white">Professional, Clean Awning</h4>
                    <p className="text-gray-400 leading-relaxed mobile-text-sm">
                      After our professional cleaning service, the awning is now pristine, 
                      vibrant, and enhances the business&apos;s professional image and customer appeal.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 md:space-x-8 mb-12 md:mb-16">
          <button
            onClick={copyToClipboard}
            className="btn btn-primary mobile-text-lg px-6 md:px-8 py-4 touch-target w-full sm:w-auto"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            Share Results
          </button>
          <button
            onClick={downloadImages}
            disabled={downloading}
            className="btn btn-secondary mobile-text-lg px-6 md:px-8 py-4 touch-target w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {downloading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 md:h-6 md:w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Downloading...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 md:w-6 md:h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Images
              </>
            )}
          </button>
        </div>

        {/* Features Section */}
        <div className="text-center mb-12 md:mb-16">
          <h3 className="mobile-text-2xl md:text-3xl font-bold text-white mb-8 md:mb-12">Transform Your Business Appearance</h3>
          <div className="mobile-grid mobile-gap">
            <div className="card p-4 md:p-6 text-center">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-3 md:mb-4">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h4 className="mobile-text-lg font-bold text-white mb-2 md:mb-3">Professional Cleaning</h4>
              <p className="text-gray-400 mobile-text-sm">Advanced cleaning techniques that restore your awning to like-new condition.</p>
            </div>
            <div className="card p-4 md:p-6 text-center">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-3 md:mb-4">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="mobile-text-lg font-bold text-white mb-2 md:mb-3">Quick Service</h4>
              <p className="text-gray-400 mobile-text-sm">Fast, efficient service that minimizes disruption to your business operations.</p>
            </div>
            <div className="card p-4 md:p-6 text-center">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-3 md:mb-4">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="mobile-text-lg font-bold text-white mb-2 md:mb-3">Guaranteed Results</h4>
              <p className="text-gray-400 mobile-text-sm">Satisfaction guaranteed with every cleaning service we provide.</p>
            </div>
            {/* <div className="card p-4 md:p-6 text-center">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center mx-auto mb-3 md:mb-4">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h4 className="mobile-text-lg font-bold text-white mb-2 md:mb-3">Local Service</h4>
              <p className="text-gray-400 mobile-text-sm">Serving all of NYC with local expertise and reliable service.</p>
            </div> */}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <div className="glass rounded-2xl p-6 md:p-8 max-w-2xl mx-auto">
            <p className="text-gray-400 mobile-text-sm">
              Professional awning cleaning services for NYC businesses • 
              <span className="text-blue-400 ml-1">Contact us for a free quote</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 
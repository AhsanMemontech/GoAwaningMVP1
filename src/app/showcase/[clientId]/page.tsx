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

  const downloadImages = () => {
    // In a real app, this would trigger a download of the images
    alert('Download feature would be implemented here')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-8"></div>
          <p className="text-white text-xl">Loading showcase...</p>
        </div>
      </div>
    )
  }

  if (!clientData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Showcase not found</p>
          <button 
            onClick={() => router.push('/')}
            className="btn btn-primary"
          >
            Create New Showcase
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Modern Background Pattern */}
      <div className="absolute inset-0 bg-pattern"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="container mx-auto px-4 relative z-10 py-20">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          {/* Logo/Brand */}
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl mb-8 shadow-2xl transform hover:scale-105 transition-all duration-500">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl md:text-3xl font-bold text-white mb-6 leading-tight">
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-blue-600 bg-clip-text text-transparent">
              NYC Awning Cleaners
            </span>
            <span className="block text-2xl md:text-3xl font-medium text-gray-300 mt-4">
              Professional Results Showcase
            </span>
          </h1>

          {/* Client Info Card */}
          <div className="card p-8 max-w-2xl mx-auto animate-slide-in">
            <h2 className="text-3xl font-bold text-white mb-4">{clientData.name}</h2>
            <p className="text-gray-300 capitalize text-lg">{clientData.type} • {clientData.date}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <span className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">Before & After</span>
              <span className="px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">Professional Results</span>
              <span className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-full text-sm font-medium">NYC Service</span>
            </div>
          </div>
        </div>

        {/* Image Display Area */}
        <div className="max-w-7xl mx-auto mb-16">
          <div className="card overflow-hidden animate-fade-in">
            <div className="p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="text-center space-y-6">
                  <div className="bg-red-500 text-white px-6 py-3 rounded-full text-lg font-bold inline-block shadow-lg">
                    BEFORE CLEANING
                  </div>
                  <div className="card p-6">
                    <img
                      src={clientData.beforeImage}
                      alt="Before awning cleaning"
                      className="w-full rounded-2xl shadow-2xl"
                    />
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-xl font-bold text-white">Dirty, Stained Awning</h4>
                    <p className="text-gray-400 leading-relaxed">
                      The awning was covered in dirt, grime, and environmental stains, 
                      significantly affecting the business&apos;s professional appearance and curb appeal.
                    </p>
                  </div>
                </div>
                <div className="text-center space-y-6">
                  <div className="bg-green-500 text-white px-6 py-3 rounded-full text-lg font-bold inline-block shadow-lg">
                    AFTER CLEANING
                  </div>
                  <div className="card p-6">
                    <img
                      src={clientData.afterImage}
                      alt="After awning cleaning"
                      className="w-full rounded-2xl shadow-2xl"
                    />
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-xl font-bold text-white">Professional, Clean Awning</h4>
                    <p className="text-gray-400 leading-relaxed">
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
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 mb-16">
          <button
            onClick={copyToClipboard}
            className="btn btn-primary text-lg px-8 py-4"
          >
            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            Share Results
          </button>
          <button
            onClick={downloadImages}
            className="btn btn-secondary text-lg px-8 py-4"
          >
            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download Images
          </button>
        </div>

        {/* Features Section */}
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-white mb-12">Transform Your Business Appearance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card p-6 text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Restaurant Awnings</h4>
              <p className="text-gray-400 text-sm">Professional cleaning for food service businesses</p>
            </div>
            <div className="card p-6 text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Retail Store Awnings</h4>
              <p className="text-gray-400 text-sm">Enhance your store&apos;s curb appeal</p>
            </div>
            <div className="card p-6 text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Fashion Boutique Awnings</h4>
              <p className="text-gray-400 text-sm">Maintain luxury brand standards</p>
            </div>
            <div className="card p-6 text-center">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Medical Office Awnings</h4>
              <p className="text-gray-400 text-sm">Professional healthcare environment</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <div className="glass rounded-2xl p-8 max-w-2xl mx-auto">
            <p className="text-gray-400 text-sm">
              Professional awning cleaning services for NYC businesses • 
              <span className="text-blue-400 ml-1">Contact us for a free quote</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 
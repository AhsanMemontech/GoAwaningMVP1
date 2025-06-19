'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [clientName, setClientName] = useState('')
  const [businessType, setBusinessType] = useState('')
  const [beforeImage, setBeforeImage] = useState<File | null>(null)
  const [afterImage, setAfterImage] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [dragActive, setDragActive] = useState({ before: false, after: false })
  const router = useRouter()

  const handleDrag = (e: React.DragEvent, type: 'before' | 'after') => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(prev => ({ ...prev, [type]: true }))
    } else if (e.type === 'dragleave') {
      setDragActive(prev => ({ ...prev, [type]: false }))
    }
  }

  const handleDrop = (e: React.DragEvent, type: 'before' | 'after') => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(prev => ({ ...prev, [type]: false }))
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (type === 'before') {
        setBeforeImage(file)
      } else {
        setAfterImage(file)
      }
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (type === 'before') {
        setBeforeImage(file)
      } else {
        setAfterImage(file)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!clientName || !businessType || !beforeImage || !afterImage) {
      alert('Please fill in all fields and upload both images')
      return
    }

    setIsLoading(true)
    
    try {
      // Convert images to data URLs
      const beforeImageUrl = await convertFileToDataURL(beforeImage)
      const afterImageUrl = await convertFileToDataURL(afterImage)
      
      // Create client data
      const clientData = {
        id: generateClientId(),
        name: clientName,
        type: businessType,
        beforeImage: beforeImageUrl,
        afterImage: afterImageUrl,
        date: new Date().toLocaleDateString()
      }
      
      // Store in localStorage for the showcase page
      localStorage.setItem(`client_${clientData.id}`, JSON.stringify(clientData))
      
      // Simulate processing time
      setTimeout(() => {
        router.push(`/showcase/${clientData.id}`)
      }, 2000)
    } catch (error) {
      console.error('Error processing images:', error)
      alert('Error processing images. Please try again.')
      setIsLoading(false)
    }
  }

  const convertFileToDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const generateClientId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
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
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-blue-600 bg-clip-text text-transparent">
              NYC Awning Cleaners
            </span>
            <span className="block text-2xl md:text-3xl font-medium text-gray-300 mt-4">
              Professional Results Showcase
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed mb-12 mx-auto">
            Transform your business appearance with our premium awning cleaning services. 
            Showcase the dramatic difference we make for restaurants, retail stores, and businesses across NYC.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">500+</div>
              <div className="text-gray-400">Businesses Cleaned</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">98%</div>
              <div className="text-gray-400">Satisfaction Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">24hr</div>
              <div className="text-gray-400">Response Time</div>
            </div>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="max-w-5xl mx-auto">
          <div className="card p-8 md:p-12 animate-slide-in">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Create Your Before & After Showcase
              </h2>
              <p className="text-gray-400 text-lg">
                Upload your photos and generate a professional showcase in minutes
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Business Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-white uppercase tracking-wide">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="input"
                    placeholder="Enter your business name"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-white uppercase tracking-wide">
                    Business Type
                  </label>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="select"
                    required
                  >
                    <option value="">Select business type</option>
                    <option value="restaurant">Restaurant & Food Service</option>
                    <option value="retail">Retail Store</option>
                    <option value="fashion">Fashion Boutique</option>
                    <option value="beauty">Beauty Salon & Spa</option>
                    <option value="fitness">Fitness Center</option>
                    <option value="medical">Medical Office</option>
                    <option value="hotel">Hotel & Hospitality</option>
                    <option value="other">Other Business</option>
                  </select>
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="space-y-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">Upload Your Photos</h3>
                  <p className="text-gray-400">Show the transformation with before and after images</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Before Image Upload */}
                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-white uppercase tracking-wide text-center">
                      Before Cleaning
                    </label>
                    <div
                      className={`upload-area ${dragActive.before ? 'drag-active' : ''}`}
                      onDragEnter={(e) => handleDrag(e, 'before')}
                      onDragLeave={(e) => handleDrag(e, 'before')}
                      onDragOver={(e) => handleDrag(e, 'before')}
                      onDrop={(e) => handleDrop(e, 'before')}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileSelect(e, 'before')}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="space-y-6">
                        <div className="w-20 h-20 mx-auto bg-red-500/20 rounded-2xl flex items-center justify-center">
                          <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-white font-semibold text-lg">Upload Before Photo</p>
                          <p className="text-gray-400 mt-2">Drag & drop or click to browse</p>
                          <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                        </div>
                        {beforeImage && (
                          <div className="mt-4 p-3 bg-green-500/20 rounded-lg border border-green-500/30">
                            <p className="text-green-400 text-sm font-medium">✓ {beforeImage.name}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* After Image Upload */}
                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-white uppercase tracking-wide text-center">
                      After Cleaning
                    </label>
                    <div
                      className={`upload-area ${dragActive.after ? 'drag-active' : ''}`}
                      onDragEnter={(e) => handleDrag(e, 'after')}
                      onDragLeave={(e) => handleDrag(e, 'after')}
                      onDragOver={(e) => handleDrag(e, 'after')}
                      onDrop={(e) => handleDrop(e, 'after')}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileSelect(e, 'after')}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="space-y-6">
                        <div className="w-20 h-20 mx-auto bg-green-500/20 rounded-2xl flex items-center justify-center">
                          <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-white font-semibold text-lg">Upload After Photo</p>
                          <p className="text-gray-400 mt-2">Drag & drop or click to browse</p>
                          <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                        </div>
                        {afterImage && (
                          <div className="mt-4 p-3 bg-green-500/20 rounded-lg border border-green-500/30">
                            <p className="text-green-400 text-sm font-medium">✓ {afterImage.name}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center pt-8">
                <button
                  type="submit"
                  disabled={isLoading || !clientName || !businessType || !beforeImage || !afterImage}
                  className="btn btn-primary text-lg px-12 py-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Your Showcase...
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Generate Professional Showcase
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24 text-center">
          <h3 className="text-3xl font-bold text-white mb-12">Why Choose NYC Awning Cleaners?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-white mb-4">Professional Results</h4>
              <p className="text-gray-400">Transform dirty awnings into pristine, professional displays that enhance your business image.</p>
            </div>
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-white mb-4">Quick Service</h4>
              <p className="text-gray-400">Fast, efficient cleaning that minimizes disruption to your business operations.</p>
            </div>
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-white mb-4">Trusted by NYC</h4>
              <p className="text-gray-400">Serving hundreds of businesses across New York City with proven results and satisfied customers.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-24">
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
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
      
      // Validate the file
      const validation = validateImageFile(file)
      if (!validation.valid) {
        alert(validation.error)
        return
      }

      // Set the image
      if (type === 'before') {
        setBeforeImage(file)
      } else {
        setAfterImage(file)
      }
    }
  }

  const validateImageFile = (file: File): { valid: boolean; error?: string } => {
    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      return { valid: false, error: 'Please select a valid image file' }
    }

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return { valid: false, error: 'Image file is too large. Please use an image smaller than 10MB.' }
    }

    // Check for supported formats
    const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/heic', 'image/heif', 'image/webp']
    if (!supportedTypes.includes(file.type.toLowerCase())) {
      return { valid: false, error: 'Unsupported image format. Please use JPG, PNG, HEIC, or WebP.' }
    }

    return { valid: true }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      
      // Validate the file
      const validation = validateImageFile(file)
      if (!validation.valid) {
        alert(validation.error)
        // Reset the input
        e.target.value = ''
        return
      }

      // Set the image
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
      console.log('Processing before image:', beforeImage.name, 'Size:', beforeImage.size, 'Type:', beforeImage.type)
      console.log('Processing after image:', afterImage.name, 'Size:', afterImage.size, 'Type:', afterImage.type)
      
      // Convert images to data URLs
      const beforeImageUrl = await convertFileToDataURL(beforeImage)
      const afterImageUrl = await convertFileToDataURL(afterImage)
      
      console.log('Successfully converted images to data URLs')
      
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
      
      console.log('Client data stored successfully')
      
      // Simulate processing time
      setTimeout(() => {
        router.push(`/showcase/${clientData.id}`)
      }, 2000)
    } catch (error) {
      console.error('Error processing images:', error)
      
      // Provide more specific error messages
      let errorMessage = 'Error processing images. Please try again.'
      
      if (error instanceof Error) {
        if (error.message.includes('too large')) {
          errorMessage = 'Image file is too large. Please use images smaller than 10MB.'
        } else if (error.message.includes('timed out')) {
          errorMessage = 'Image processing took too long. Please try smaller images or check your connection.'
        } else if (error.message.includes('Failed to read')) {
          errorMessage = 'Unable to read image file. Please try a different image or format (JPG, PNG).'
        } else if (error.message.includes('File must be an image')) {
          errorMessage = 'Please select valid image files only.'
        } else {
          errorMessage = `Image processing error: ${error.message}`
        }
      }
      
      alert(errorMessage)
      setIsLoading(false)
    }
  }

  const convertFileToDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        reject(new Error('File must be an image'))
        return
      }

      // Check file size (10MB limit)
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        reject(new Error('Image file is too large. Please use an image smaller than 10MB.'))
        return
      }

      const reader = new FileReader()
      
      reader.onload = () => {
        try {
          const result = reader.result as string
          if (!result || result.length === 0) {
            reject(new Error('Failed to read image file'))
            return
          }
          resolve(result)
        } catch (error) {
          reject(new Error('Error processing image file'))
        }
      }
      
      reader.onerror = () => {
        reject(new Error('Failed to read image file. Please try a different image.'))
      }
      
      reader.onabort = () => {
        reject(new Error('Image reading was cancelled'))
      }

      // Add timeout for large files
      const timeout = setTimeout(() => {
        reader.abort()
        reject(new Error('Image processing timed out. Please try a smaller image.'))
      }, 30000) // 30 second timeout

      reader.onloadend = () => {
        clearTimeout(timeout)
      }

      try {
        reader.readAsDataURL(file)
      } catch (error) {
        clearTimeout(timeout)
        reject(new Error('Failed to start image processing'))
      }
    })
  }

  const generateClientId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
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
          <h1 className="mobile-text-4xl md:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight">
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-blue-600 bg-clip-text text-transparent">
              NYC Awning Cleaners
            </span>
            <span className="block mobile-text-lg md:text-3xl font-medium text-gray-300 mt-2 md:mt-4">
              Professional Results Showcase
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mobile-text-lg text-gray-400 max-w-4xl mx-auto leading-relaxed mb-8 md:mb-12">
            Transform your business appearance with our premium awning cleaning services. 
            Showcase the dramatic difference we make for restaurants, retail stores, and businesses across NYC.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center mobile-gap mb-12 md:mb-16">
            <div className="text-center">
              <div className="mobile-text-2xl md:text-3xl font-bold text-blue-400 mb-1 md:mb-2">500+</div>
              <div className="text-gray-400 mobile-text-sm">Businesses Cleaned</div>
            </div>
            <div className="text-center">
              <div className="mobile-text-2xl md:text-3xl font-bold text-purple-400 mb-1 md:mb-2">98%</div>
              <div className="text-gray-400 mobile-text-sm">Satisfaction Rate</div>
            </div>
            <div className="text-center">
              <div className="mobile-text-2xl md:text-3xl font-bold text-green-400 mb-1 md:mb-2">24hr</div>
              <div className="text-gray-400 mobile-text-sm">Response Time</div>
            </div>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="max-w-5xl mx-auto">
          <div className="card p-6 md:p-12 mobile-slide-in">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="mobile-text-2xl md:text-4xl font-bold text-white mb-3 md:mb-4">
                Create Your Before & After Showcase
              </h2>
              <p className="text-gray-400 mobile-text-lg">
                Upload your photos and generate a professional showcase in minutes
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 md:space-y-10">
              {/* Business Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 mobile-gap">
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-white uppercase tracking-wide">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="input touch-target"
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
                    className="select touch-target"
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
              <div className="space-y-6 md:space-y-8">
                <div className="text-center">
                  <h3 className="mobile-text-xl md:text-2xl font-bold text-white mb-2">Upload Your Photos</h3>
                  <p className="text-gray-400 mobile-text-sm">Show the transformation with before and after images</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
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
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer touch-target"
                      />
                      <div className="space-y-4 md:space-y-6 p-4 md:p-6">
                        <div className="w-16 h-16 md:w-20 md:h-20 mx-auto bg-red-500/20 rounded-2xl flex items-center justify-center">
                          <svg className="w-8 h-8 md:w-10 md:h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-white font-semibold mobile-text-lg">Upload Before Photo</p>
                          <p className="text-gray-400 mt-2 mobile-text-sm">Click to browse files or take photo</p>
                          <p className="text-xs text-gray-500 mt-1">JPG, PNG, HEIC up to 10MB • iPhone: Use "Most Compatible" format</p>
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
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer touch-target"
                      />
                      <div className="space-y-4 md:space-y-6 p-4 md:p-6">
                        <div className="w-16 h-16 md:w-20 md:h-20 mx-auto bg-green-500/20 rounded-2xl flex items-center justify-center">
                          <svg className="w-8 h-8 md:w-10 md:h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-white font-semibold mobile-text-lg">Upload After Photo</p>
                          <p className="text-gray-400 mt-2 mobile-text-sm">Click to browse files or take photo</p>
                          <p className="text-xs text-gray-500 mt-1">JPG, PNG, HEIC up to 10MB • iPhone: Use "Most Compatible" format</p>
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

                {/* Device-Specific Tips */}
                <div className="text-center">
                  <div className="glass rounded-xl p-4 md:p-6 max-w-3xl mx-auto">
                    <div className="flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h4 className="text-white font-semibold mobile-text-lg">📸 Photo Upload Guide</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                      {/* Mobile Tips */}
                      <div className="space-y-2">
                        <h5 className="text-blue-400 font-semibold text-sm">📱 Mobile Devices</h5>
                        <div className="space-y-1">
                          <div className="flex items-start">
                            <span className="text-blue-400 mr-2 text-xs">•</span>
                            <p className="text-gray-300 text-xs">Tap upload area to open camera</p>
                          </div>
                          <div className="flex items-start">
                            <span className="text-blue-400 mr-2 text-xs">•</span>
                            <p className="text-gray-300 text-xs">Choose camera or gallery</p>
                          </div>
                          <div className="flex items-start">
                            <span className="text-blue-400 mr-2 text-xs">•</span>
                            <p className="text-gray-300 text-xs">Ensure good lighting</p>
                          </div>
                          <div className="flex items-start">
                            <span className="text-blue-400 mr-2 text-xs">•</span>
                            <p className="text-gray-300 text-xs">iPhone: Use "Most Compatible" format in Settings</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Desktop Tips */}
                      <div className="space-y-2">
                        <h5 className="text-purple-400 font-semibold text-sm">💻 Desktop/Laptop</h5>
                        <div className="space-y-1">
                          <div className="flex items-start">
                            <span className="text-purple-400 mr-2 text-xs">•</span>
                            <p className="text-gray-300 text-xs">Click to browse files</p>
                          </div>
                          <div className="flex items-start">
                            <span className="text-purple-400 mr-2 text-xs">•</span>
                            <p className="text-gray-300 text-xs">Drag & drop images</p>
                          </div>
                          {/* <div className="flex items-start">
                            <span className="text-purple-400 mr-2 text-xs">•</span>
                            <p className="text-gray-300 text-xs">Use webcam if available</p>
                          </div> */}
                        </div>
                      </div>
                      
                      {/* General Tips */}
                      <div className="space-y-2">
                        <h5 className="text-green-400 font-semibold text-sm">✨ Best Practices</h5>
                        <div className="space-y-1">
                          <div className="flex items-start">
                            <span className="text-green-400 mr-2 text-xs">•</span>
                            <p className="text-gray-300 text-xs">Same angle for comparison</p>
                          </div>
                          <div className="flex items-start">
                            <span className="text-green-400 mr-2 text-xs">•</span>
                            <p className="text-gray-300 text-xs">High resolution images</p>
                          </div>
                          <div className="flex items-start">
                            <span className="text-green-400 mr-2 text-xs">•</span>
                            <p className="text-gray-300 text-xs">Clear, well-lit photos</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center pt-6 md:pt-8">
                <button
                  type="submit"
                  disabled={isLoading || !clientName || !businessType || !beforeImage || !afterImage}
                  className="btn btn-primary mobile-text-lg px-8 md:px-12 py-4 touch-target disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none w-full md:w-auto"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 md:h-6 md:w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Your Showcase...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 md:w-6 md:h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className="mt-16 md:mt-24 text-center">
          <h3 className="mobile-text-2xl md:text-3xl font-bold text-white mb-8 md:mb-12">Why Choose NYC Awning Cleaners?</h3>
          <div className="mobile-grid mobile-gap">
            <div className="card p-6 md:p-8 text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6">
                <svg className="w-6 h-6 md:w-8 md:h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="mobile-text-lg md:text-xl font-bold text-white mb-3 md:mb-4">Professional Results</h4>
              <p className="text-gray-400 mobile-text-sm">Transform dirty awnings into pristine, professional displays that enhance your business image.</p>
            </div>
            <div className="card p-6 md:p-8 text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6">
                <svg className="w-6 h-6 md:w-8 md:h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="mobile-text-lg md:text-xl font-bold text-white mb-3 md:mb-4">Quick Service</h4>
              <p className="text-gray-400 mobile-text-sm">Fast, efficient cleaning that minimizes disruption to your business operations.</p>
            </div>
            <div className="card p-6 md:p-8 text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6">
                <svg className="w-6 h-6 md:w-8 md:h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h4 className="mobile-text-lg md:text-xl font-bold text-white mb-3 md:mb-4">Trusted by NYC</h4>
              <p className="text-gray-400 mobile-text-sm">Serving hundreds of businesses across New York City with proven results and satisfied customers.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 md:mt-24">
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
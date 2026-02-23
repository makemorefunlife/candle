'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function CalibrateProfilePage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [formData, setFormData] = useState({
    gender: '',
    birthDate: '',
    birthTime: '',
    birthLocation: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-lg text-slate-600">Loading...</div>
      </div>
    )
  }

  if (!user) {
    router.push('/sign-in')
    return null
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.gender) {
      newErrors.gender = 'Please select your gender'
    }
    if (!formData.birthDate) {
      newErrors.birthDate = 'Please enter your date of birth'
    }
    if (!formData.birthTime) {
      newErrors.birthTime = 'Birth time is required for high-resolution analysis'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      // Step 1: Calculate Bazi (B data)
      const baziResponse = await fetch('/api/analyze/bazi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!baziResponse.ok) {
        throw new Error('Failed to calculate chronological data')
      }

      const { bazi } = await baziResponse.json()

      // Step 2: Generate B1 Cards
      const cardsResponse = await fetch('/api/analyze/b1-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bazi,
          nickname: user.firstName || user.emailAddresses[0]?.emailAddress || 'Professional'
        })
      })

      if (!cardsResponse.ok) {
        const errorData = await cardsResponse.json().catch(() => ({}))
        const errorMessage = errorData.error || `Server error: ${cardsResponse.status}`
        throw new Error(`Failed to generate career intelligence cards: ${errorMessage}`)
      }

      const cardsData = await cardsResponse.json()
      
      if (!cardsData.success) {
        throw new Error(cardsData.error || 'Failed to generate career intelligence cards')
      }

      // Store results in sessionStorage for blueprint page
      sessionStorage.setItem('baziData', JSON.stringify(bazi))
      sessionStorage.setItem('b1Cards', JSON.stringify(cardsData))

      // Navigate to blueprint
      router.push('/blueprint')
    } catch (error: any) {
      console.error('Error:', error)
      alert(`Error: ${error.message}. Please try again.`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Calibrate Your Profile
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Complete your high-resolution profile by providing chronological baseline data. 
            This information serves as the control variable in ancient empirical systems to generate your 20-year career roadmap.
          </p>
        </div>

        {/* Explanation Card */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 mb-8 border-2 border-blue-200">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Why Chronological Data Matters
          </h2>
          <div className="space-y-3 text-slate-700">
            <p>
              Your behavioral survey captured your <strong>conscious adaptation patterns</strong>—how you operate in your current environment.
            </p>
            <p>
              Chronological data (birth timestamp) reveals your <strong>innate baseline</strong>—your default operating system under high pressure.
            </p>
            <p className="font-semibold text-blue-700">
              By synchronizing these two data points, we identify your Performance Gap and Strategic Edge, enabling a precise 20-year career trajectory.
            </p>
            <p className="text-sm text-slate-600 italic">
              This methodology is based on Myeongri (命理), an ancient empirical system that uses temporal data as control variables for predictive modeling.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
          {/* Gender */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-900 mb-3">
              Gender
            </label>
            <div className="grid grid-cols-3 gap-4">
              {['Male', 'Female', 'Non-binary'].map((option) => (
                <label
                  key={option}
                  className={`flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.gender === option
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="gender"
                    value={option}
                    checked={formData.gender === option}
                    onChange={(e) => handleChange('gender', e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-slate-700">{option}</span>
                </label>
              ))}
            </div>
            {errors.gender && (
              <p className="mt-2 text-sm text-red-600">{errors.gender}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div className="mb-6">
            <label htmlFor="birthDate" className="block text-sm font-semibold text-slate-900 mb-3">
              Date of Birth
            </label>
            <input
              type="date"
              id="birthDate"
              value={formData.birthDate}
              onChange={(e) => handleChange('birthDate', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-blue-500 focus:outline-none text-slate-900"
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.birthDate && (
              <p className="mt-2 text-sm text-red-600">{errors.birthDate}</p>
            )}
          </div>

          {/* Time of Birth - Emphasized */}
          <div className="mb-6">
            <label htmlFor="birthTime" className="block text-sm font-semibold text-slate-900 mb-3">
              Time of Birth <span className="text-blue-600">*</span>
            </label>
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-sm font-semibold text-yellow-900 mb-1">
                High-Resolution Data Required
              </p>
              <p className="text-sm text-yellow-800">
                Birth time provides critical temporal precision. If unknown, use your best estimate or select "Unknown" for approximate analysis.
              </p>
            </div>
            <input
              type="time"
              id="birthTime"
              value={formData.birthTime}
              onChange={(e) => handleChange('birthTime', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-blue-500 focus:outline-none text-slate-900"
            />
            {errors.birthTime && (
              <p className="mt-2 text-sm text-red-600">{errors.birthTime}</p>
            )}
            <p className="mt-2 text-xs text-slate-500">
              Format: HH:MM (24-hour format). This timestamp enables high-resolution chronological mapping.
            </p>
          </div>

          {/* Birth Location (Optional) */}
          <div className="mb-8">
            <label htmlFor="birthLocation" className="block text-sm font-semibold text-slate-900 mb-3">
              Birth Location <span className="text-slate-400 text-xs">(Optional)</span>
            </label>
            <input
              type="text"
              id="birthLocation"
              value={formData.birthLocation}
              onChange={(e) => handleChange('birthLocation', e.target.value)}
              placeholder="City, Country (e.g., San Francisco, USA)"
              className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-blue-500 focus:outline-none text-slate-900"
            />
            <p className="mt-2 text-xs text-slate-500">
              Used for timezone calculation and geographical context analysis.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-6 py-4 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold text-lg hover:from-blue-600 hover:to-purple-600 transition-colors shadow-lg"
          >
            Generate Executive Career Blueprint
          </button>
        </form>
      </div>
    </div>
  )
}


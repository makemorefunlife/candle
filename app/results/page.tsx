'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface SurveyResult {
  summary_id: string
  identity_tag: string
  strategic_guidance: string[]
}

export default function ResultsPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [result, setResult] = useState<SurveyResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoaded) return

    if (!user) {
      router.push('/sign-in')
      return
    }

    // TODO: Fetch actual results from API
    // For now, using mock data
    const mockResult: SurveyResult = {
      summary_id: "fast_mover_01",
      identity_tag: "High-Velocity Catalyst",
      strategic_guidance: [
        "Your profile identifies you as a high-velocity driver, optimized for rapid execution and early-stage project scaling.",
        "To maximize your professional ROI, prioritize high-leverage tasks in the first 90 minutes of your day to capitalize on your peak neural output.",
        "Potential bottlenecks may arise in long-term project closure; mitigate this by implementing automated tracking systems or delegating the final 10% of precision-heavy tasks.",
        "You will achieve exponential growth in agile environments that value rapid iteration over rigid, legacy-driven processes.",
        "Aligning your career trajectory with roles that require 'zero-to-one' initiation will ensure long-term fulfillment and prevent the cognitive burnout associated with maintenance-heavy positions."
      ]
    }

    setResult(mockResult)
    setLoading(false)
  }, [user, isLoaded, router])

  if (!isLoaded || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-lg text-slate-600">Loading your results...</div>
      </div>
    )
  }

  if (!result) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            Your Performance Architecture
          </h1>
          <p className="text-xl text-slate-600">
            Strategic career intelligence based on your behavioral analysis
          </p>
        </div>

        {/* Identity Card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-slate-300 mb-2">Professional Identity</p>
              <h2 className="text-3xl font-bold">{result.identity_tag}</h2>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-300 mb-2">Profile ID</p>
              <p className="text-lg font-mono text-slate-400">{result.summary_id}</p>
            </div>
          </div>
        </div>

        {/* Strategic Guidance */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              Strategic Career Guidance
            </h3>
            <p className="text-slate-600 text-sm">
              Evidence-based recommendations for optimizing your professional trajectory
            </p>
          </div>

          <div className="space-y-6">
            {result.strategic_guidance.map((guidance, index) => (
              <div
                key={index}
                className="flex gap-4 p-6 rounded-lg bg-gradient-to-r from-slate-50 to-white border-l-4 border-blue-500 hover:shadow-md transition-shadow"
              >
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">{index + 1}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-slate-800 leading-relaxed text-lg">
                    {guidance}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Completion Status & CTA */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-lg p-8 border-2 border-amber-200">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-100 mb-4">
              <span className="text-3xl font-bold text-amber-700">60%</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              Incomplete Profile Analysis
            </h3>
            <p className="text-slate-700 text-lg mb-4">
              You're currently viewing <strong>60% of your full career intelligence picture</strong>.
            </p>
            <p className="text-slate-600 mb-6">
              The behavioral analysis above captures your conscious adaptation patterns. 
              To unlock the remaining 40% and access your complete <strong>Executive Career Blueprint</strong>, 
              we need to synchronize this data with your chronological baseline.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 mb-6 border border-amber-200">
            <h4 className="font-semibold text-slate-900 mb-3">What You'll Get:</h4>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start">
                <span className="text-amber-600 mr-2">✓</span>
                <span>20-year strategic career roadmap</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-600 mr-2">✓</span>
                <span>Performance gap identification</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-600 mr-2">✓</span>
                <span>Optimal timing windows for career transitions</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-600 mr-2">✓</span>
                <span>Complete alignment between behavioral and innate patterns</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => router.push('/calibrate-profile')}
            className="w-full px-8 py-5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xl hover:from-amber-600 hover:to-orange-600 transition-colors shadow-xl transform hover:scale-[1.02] transition-transform"
          >
            Complete Your Profile Analysis →
          </button>
          
          <p className="text-center text-xs text-slate-500 mt-4">
            Takes less than 2 minutes • Your data is encrypted and secure
          </p>
        </div>
      </div>
    </div>
  )
}


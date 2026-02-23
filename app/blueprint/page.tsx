'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import EmailModal from '../components/EmailModal'

interface BentoGridItem {
  id: string
  label: string
  value: string
  size: string
}

interface ExecutiveCard {
  id: string
  category: string
  title: string
  coreInsight: string
  strategicInterpretation: string
  tacticalEdge: string
  confidence: number
}

export default function BlueprintPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [baziData, setBaziData] = useState<any>(null)
  const [bentoGrid, setBentoGrid] = useState<BentoGridItem[]>([])
  const [executiveCards, setExecutiveCards] = useState<ExecutiveCard[]>([])
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!isLoaded) return

    if (!user) {
      router.push('/sign-in')
      return
    }

    // Load data from sessionStorage
    const storedBazi = sessionStorage.getItem('baziData')
    const storedCards = sessionStorage.getItem('b1Cards')

    if (storedBazi && storedCards) {
      setBaziData(JSON.parse(storedBazi))
      const cardsData = JSON.parse(storedCards)
      setBentoGrid(cardsData.bentoGrid || [])
      setExecutiveCards(cardsData.executiveCards || [])
      setLoading(false)
    } else {
      // No data found, redirect to calibrate-profile
      router.push('/calibrate-profile')
    }
  }, [user, isLoaded, router])

  if (!isLoaded || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="text-lg text-slate-600 mb-4">Generating your Executive Career Blueprint...</div>
          <div className="w-64 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse" style={{ width: '60%' }} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            Executive Career Blueprint
          </h1>
          <p className="text-xl text-slate-600">
            Complete strategic intelligence synchronized from behavioral and chronological data
          </p>
        </div>

        {/* Bento Grid */}
        {bentoGrid.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Performance Architecture Snapshot</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {bentoGrid.map((item) => (
                <div
                  key={item.id}
                  className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${
                    item.size === 'large' ? 'md:col-span-2' : ''
                  } ${
                    item.id === 'core_identity' ? 'border-blue-500' :
                    item.id === 'wealth_pattern' ? 'border-purple-500' :
                    'border-slate-300'
                  }`}
                >
                  <p className="text-sm font-semibold text-slate-500 mb-2">{item.label}</p>
                  <p className="text-xl font-bold text-slate-900">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Executive Cards */}
        {executiveCards.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Career Intelligence Cards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {executiveCards.map((card) => (
                <div
                  key={card.id}
                  className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-xs font-semibold text-blue-600 mb-1">{card.category}</p>
                      <h3 className="text-xl font-bold text-slate-900">{card.title}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Confidence</p>
                      <p className="text-sm font-bold text-slate-700">
                        {(card.confidence * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-700 mb-1">Core Insight</p>
                      <p className="text-slate-600">{card.coreInsight}</p>
                    </div>
                    
                    {card.strategicInterpretation && (
                      <div>
                        <p className="text-sm font-semibold text-slate-700 mb-1">Strategic Interpretation</p>
                        <p className="text-slate-600">{card.strategicInterpretation}</p>
                      </div>
                    )}
                    
                    {card.tacticalEdge && (
                      <div>
                        <p className="text-sm font-semibold text-slate-700 mb-1">Tactical Edge</p>
                        <p className="text-slate-600">{card.tacticalEdge}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Day Master Info */}
        {baziData?.dayMaster && (
          <div className="mt-12 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl p-8 text-white">
            <h3 className="text-xl font-bold mb-4">Chronological Baseline Data</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-slate-300 mb-1">Day Master</p>
                <p className="text-2xl font-bold">{baziData.dayMaster.ganzi}</p>
              </div>
              <div>
                <p className="text-sm text-slate-300 mb-1">Stem</p>
                <p className="text-lg font-semibold">{baziData.dayMaster.stem}</p>
              </div>
              <div>
                <p className="text-sm text-slate-300 mb-1">Branch</p>
                <p className="text-lg font-semibold">{baziData.dayMaster.branch}</p>
              </div>
              <div>
                <p className="text-sm text-slate-300 mb-1">Unseong</p>
                <p className="text-lg font-semibold">{baziData.dayMaster.unseong || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 mb-8">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-2xl shadow-2xl p-8 md:p-12 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                프리미엄 리포트 받기
              </h2>
              <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                완전한 경력 인텔리전스 리포트를 PDF로 받아보세요.<br />
                10개 섹션의 심층 분석이 포함된 전문 리포트입니다.
              </p>
              <button
                onClick={() => setIsEmailModalOpen(true)}
                disabled={isSubmitting}
                className="px-8 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? '처리 중...' : '지금 받기'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Email Modal */}
      <EmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        onSubmit={async (email) => {
          setIsSubmitting(true)
          try {
            // Get user data from sessionStorage
            const storedBazi = sessionStorage.getItem('baziData')
            const storedCards = sessionStorage.getItem('b1Cards')
            
            if (!storedBazi) {
              throw new Error('분석 데이터를 찾을 수 없습니다.')
            }

            const baziAnalysis = JSON.parse(storedBazi)
            const userMeta = {
              name: user?.firstName || user?.fullName || 'User',
              email: email,
            }

            // Call API to generate and send report
            const response = await fetch('/api/generate-and-send-report', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email,
                baziAnalysis,
                userMeta,
              }),
            })

            const data = await response.json()

            if (!response.ok) {
              throw new Error(data.error || '리포트 생성에 실패했습니다.')
            }
          } finally {
            setIsSubmitting(false)
          }
        }}
      />
    </div>
  )
}

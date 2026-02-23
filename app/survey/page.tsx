'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { SyncUserOnMount } from '@/app/components/SyncUserOnMount'

interface SurveyAnswers {
  [key: string]: string
}

export default function SurveyPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [answers, setAnswers] = useState<SurveyAnswers>({})
  const [currentPart, setCurrentPart] = useState(1)

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!user) {
    router.push('/sign-in')
    return null
  }

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  const handleSubmit = async () => {
    // TODO: Submit answers to backend
    console.log('Survey answers:', answers)
    router.push('/results')
  }

  const questions = [
    // PART 1: Initiation
    {
      id: 'q1',
      part: 1,
      question: 'When a new project is assigned, what is your first action?',
      options: [
        { value: 'wood', label: 'I jump in and start executing immediately' },
        { value: 'metal_earth', label: 'I create a perfect plan before starting' },
        { value: 'water', label: 'I gather all relevant materials first to feel secure' }
      ]
    },
    {
      id: 'q2',
      part: 1,
      question: 'Before starting work in the morning, what is your desk condition?',
      options: [
        { value: 'wood_fire', label: 'As I left it yesterday, ready to start immediately' },
        { value: 'metal', label: 'Neatly organized - I need this to focus' }
      ]
    },
    {
      id: 'q3',
      part: 1,
      question: 'When sending an important email, you:',
      options: [
        { value: 'wood_fire', label: 'Write the essentials and send it right away' },
        { value: 'metal', label: 'Review multiple times for typos and wording' }
      ]
    },
    {
      id: 'q4',
      part: 1,
      question: 'Why do you procrastinate on tasks you dislike?',
      options: [
        { value: 'fire_wood_lack', label: 'I just lack motivation' },
        { value: 'metal_earth', label: 'I feel burdened by the fear of not doing it perfectly' }
      ]
    },
    // PART 2: Sustain
    {
      id: 'q5',
      part: 2,
      question: 'When deeply focused on work, your style is:',
      options: [
        { value: 'fire', label: 'Short, intense bursts of explosive focus' },
        { value: 'earth', label: 'Slow but steady, maintaining consistent pace' }
      ]
    },
    {
      id: 'q6',
      part: 2,
      question: 'When your focus breaks, how long to regain it?',
      options: [
        { value: 'earth_water', label: 'I quickly regain focus' },
        { value: 'wood_fire', label: 'It takes a while to warm up again' }
      ]
    },
    {
      id: 'q7',
      part: 2,
      question: 'Around 3-4 PM, your energy state is:',
      options: [
        { value: 'fire_consumption', label: 'Drastically drained, desperately need coffee or sugar' },
        { value: 'earth', label: 'Similar energy level as the morning' }
      ]
    },
    {
      id: 'q8',
      part: 2,
      question: 'When performing complex, repetitive tasks:',
      options: [
        { value: 'fire_wood', label: 'I get bored quickly and start doing other things' },
        { value: 'earth_metal', label: 'I quietly complete them to the end' }
      ]
    },
    // PART 3: Switching
    {
      id: 'q9',
      part: 3,
      question: 'When an unexpected meeting or call interrupts your work:',
      options: [
        { value: 'water', label: 'I adapt flexibly and return to my work' },
        { value: 'metal_earth', label: 'My rhythm breaks and it\'s very hard to refocus' }
      ]
    },
    {
      id: 'q10',
      part: 3,
      question: 'How do you feel about multitasking?',
      options: [
        { value: 'water_fire', label: 'I feel more energized when handling multiple tasks' },
        { value: 'metal', label: 'I feel comfortable focusing on one thing at a time' }
      ]
    },
    {
      id: 'q11',
      part: 3,
      question: 'When your work environment or tools change:',
      options: [
        { value: 'water_wood', label: 'I adapt quickly and enjoy the new approach' },
        { value: 'earth_metal', label: 'It takes time to get used to and causes stress' }
      ]
    },
    // PART 4: Closure
    {
      id: 'q12',
      part: 4,
      question: 'When 10% of work remains:',
      options: [
        { value: 'fire_wood', label: 'I lose focus thinking it\'s almost done' },
        { value: 'metal', label: 'I need to finish cleanly to feel satisfied' }
      ]
    },
    {
      id: 'q13',
      part: 4,
      question: 'After submitting a report, your mood is:',
      options: [
        { value: 'fire_water', label: 'Relieved and I forget about it immediately' },
        { value: 'metal_earth', label: 'I keep wondering if I made any mistakes' }
      ]
    },
    {
      id: 'q14',
      part: 4,
      question: 'About handing over work with uncertain closure:',
      options: [
        { value: 'water_wood', label: 'I think it\'s acceptable depending on the situation' },
        { value: 'metal', label: 'It feels unbearably uncomfortable' }
      ]
    },
    // PART 5: Bio-Physical
    {
      id: 'q15',
      part: 5,
      question: 'How is your usual digestion?',
      options: [
        { value: 'earth_wood', label: 'I digest well regardless of what I eat' },
        { value: 'water_metal', label: 'I frequently have gas or sensitive digestion' }
      ]
    },
    {
      id: 'q16',
      part: 5,
      question: 'Your reaction to coffee (caffeine):',
      options: [
        { value: 'wood', label: 'I just sleep well, no major reaction' },
        { value: 'water_metal_fire', label: 'My heart races or I can\'t sleep at night' }
      ]
    },
    {
      id: 'q17',
      part: 5,
      question: 'After sweating, how do you feel?',
      options: [
        { value: 'wood', label: 'Refreshed and lighter' },
        { value: 'water', label: 'Drained and more tired' }
      ]
    },
    {
      id: 'q18',
      part: 5,
      question: 'Which can you tolerate less?',
      options: [
        { value: 'fire', label: 'Heat (fire energy strong / hot constitution)' },
        { value: 'water', label: 'Cold (water energy strong / cold constitution)' }
      ]
    }
  ]

  const currentQuestions = questions.filter(q => q.part === currentPart)
  const allAnswered = questions.every(q => answers[q.id])
  const currentPartAnswered = currentQuestions.every(q => answers[q.id])

  const partNames = [
    'Initiation',
    'Sustain',
    'Switching',
    'Closure',
    'Bio-Physical'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <SyncUserOnMount />
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Your Personal Energy Blueprint
          </h1>
          <p className="text-lg text-slate-600">
            Your work efficiency isn't about willpower—it's about understanding your inherent energy engine. 
            Complete this 4-minute diagnostic to discover your operating manual.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-slate-600 mb-2">
            <span>Part {currentPart} of 5: {partNames[currentPart - 1]}</span>
            <span>{questions.filter(q => answers[q.id]).length} / {questions.length} answered</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(questions.filter(q => answers[q.id]).length / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Questions */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          {currentQuestions.map((q) => (
            <div key={q.id} className="mb-8 last:mb-0">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                {q.question}
              </h3>
              <div className="space-y-3">
                {q.options.map((option, idx) => (
                  <label
                    key={idx}
                    className={`flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      answers[q.id] === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name={q.id}
                      value={option.value}
                      checked={answers[q.id] === option.value}
                      onChange={() => handleAnswer(q.id, option.value)}
                      className="mt-1 mr-3"
                    />
                    <span className="text-slate-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentPart(prev => Math.max(1, prev - 1))}
            disabled={currentPart === 1}
            className="px-6 py-3 rounded-lg bg-slate-200 text-slate-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-300 transition-colors"
          >
            Previous
          </button>
          
          {currentPart < 5 ? (
            <button
              onClick={() => setCurrentPart(prev => prev + 1)}
              disabled={!currentPartAnswered}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-600 hover:to-purple-600 transition-colors"
            >
              Next Part
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!allAnswered}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-600 hover:to-purple-600 transition-colors"
            >
              Complete Survey
            </button>
          )}
        </div>
      </div>
    </div>
  )
}


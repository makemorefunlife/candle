import { AuthButton } from './components/AuthButton'

export default function Home() {

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative max-w-7xl mx-auto px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Your Personal
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Operating Manual
              </span>
            </h1>
            <p className="mt-6 text-xl leading-8 text-slate-300 max-w-2xl mx-auto">
              A data-driven career intelligence platform that synchronizes behavioral patterns with chronological baseline data to optimize decision-making for high-performing professionals.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <AuthButton variant="primary" />
              <a
                href="#how-it-works"
                className="text-base font-semibold leading-6 text-white hover:text-slate-300 transition-colors"
              >
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Service Flow Section */}
      <section id="how-it-works" className="py-24 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              How It Works
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              A simple, data-driven process to unlock your career intelligence
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-5xl">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
              {/* Step 1 */}
              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white text-2xl font-bold shadow-lg">
                    1
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-slate-900">Login</h3>
                  <p className="mt-2 text-sm text-slate-600">Secure authentication via Clerk</p>
                </div>
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transform translate-x-4" />
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white text-2xl font-bold shadow-lg">
                    2
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-slate-900">Behavioral Survey</h3>
                  <p className="mt-2 text-sm text-slate-600">18 questions to map your conscious adaptation patterns</p>
                </div>
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transform translate-x-4" />
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-pink-600 text-white text-2xl font-bold shadow-lg">
                    3
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-slate-900">Chronological Data</h3>
                  <p className="mt-2 text-sm text-slate-600">Birth timestamp to reveal your innate baseline</p>
                </div>
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-pink-500 to-orange-500 transform translate-x-4" />
              </div>

              {/* Step 4 */}
              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white text-2xl font-bold shadow-lg">
                    4
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-slate-900">Free Results</h3>
                  <p className="mt-2 text-sm text-slate-600">B-0 Snapshot + B-1 Career Intelligence Cards</p>
                </div>
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-orange-500 to-red-500 transform translate-x-4" />
              </div>

              {/* Step 5 */}
              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white text-2xl font-bold shadow-lg">
                    5
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-slate-900">Premium Report</h3>
                  <p className="mt-2 text-sm text-slate-600">B-2 Executive Report delivered as PDF via email</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 sm:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Evidence-Based Intelligence
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Not mysticism. Not fortune telling. Pure data-driven analysis.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            <div className="flex flex-col justify-between rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">Behavioral Analysis</h3>
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  Map your conscious adaptation patterns through 18 strategic questions across 5 core dimensions.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-x-4">
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">A Logic</div>
                  <div className="text-xs text-slate-500">Performance Identity</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">Chronological Mapping</h3>
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  Reveal your innate baseline using Four Pillars, Ziwei Doushu, and Western Astrology calculations.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-x-4">
                <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                  <span className="text-2xl">🔮</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">B Logic</div>
                  <div className="text-xs text-slate-500">Innate Blueprint</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">Strategic Alignment</h3>
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  Synchronize both data points to identify Performance Gaps and Strategic Edges.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-x-4">
                <div className="h-12 w-12 rounded-lg bg-pink-100 flex items-center justify-center">
                  <span className="text-2xl">⚡</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">Synergy</div>
                  <div className="text-xs text-slate-500">Maximum Leverage</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 sm:py-32 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Ready to unlock your career intelligence?
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              Join top 1% professionals in Tech and Finance who use data-driven insights to optimize their career decisions.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <AuthButton variant="secondary" />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

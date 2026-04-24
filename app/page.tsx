import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
      {/* Header */}
      <header className="border-b border-slate-300/50 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-semibold tracking-tight" style={{ fontFamily: 'Crimson Pro, serif' }}>
            Aletheia
          </div>
          <Link href="/auth/login">
            <Button variant="outline" className="font-medium">
              Sign In
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-24 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1
            className="text-6xl md:text-7xl font-bold mb-6 text-slate-900 leading-tight"
            style={{ fontFamily: 'Crimson Pro, serif' }}
          >
            Turn board authority into executable AI governance
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 mb-10 font-light leading-relaxed">
            Aletheia bridges accountability and execution. Policy becomes code.
            Every AI action generates defensible evidence.
          </p>
          <Link href="/auth/login">
            <Button
              size="lg"
              className="bg-slate-800 hover:bg-slate-900 text-white px-8 py-6 text-lg font-medium shadow-lg"
            >
              Sign In
            </Button>
          </Link>
        </div>
      </section>

      {/* Three Pillars */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {/* Pillar 1 */}
          <div className="bg-white border border-slate-200 p-8 rounded-sm shadow-sm">
            <div className="w-12 h-1 bg-slate-900 mb-6"></div>
            <h3
              className="text-2xl font-semibold mb-4 text-slate-900"
              style={{ fontFamily: 'Crimson Pro, serif' }}
            >
              The Problem
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Boards own accountability. Operations own execution. Evidence lives nowhere.
              AI is widening the gap.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white border border-slate-200 p-8 rounded-sm shadow-sm">
            <div className="w-12 h-1 bg-amber-500 mb-6"></div>
            <h3
              className="text-2xl font-semibold mb-4 text-slate-900"
              style={{ fontFamily: 'Crimson Pro, serif' }}
            >
              What Aletheia Does
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Turns policy into executable rules. Governs every AI action.
              Produces defensible evidence.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white border border-slate-200 p-8 rounded-sm shadow-sm">
            <div className="w-12 h-1 bg-slate-900 mb-6"></div>
            <h3
              className="text-2xl font-semibold mb-4 text-slate-900"
              style={{ fontFamily: 'Crimson Pro, serif' }}
            >
              Who It&apos;s For
            </h3>
            <p className="text-slate-600 leading-relaxed">
              General Counsel, Chief Risk Officer, Company Secretary — regulated
              enterprises in the UK and EU.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-300/50 bg-white/80 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-500 font-mono">
              Aletheia — Confidential
            </div>
            <div className="text-sm text-slate-500">
              © 2026 Aletheia Systems
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

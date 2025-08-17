import type { ReactNode } from 'react'
import Navbar from './Navbar'

interface AppShellProps {
  children: ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
      {/* Background Pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Subtle grid pattern - responsive sizing */}
        <div className="absolute inset-0 opacity-5">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgb(14 165 233 / 0.1) 1px, transparent 0)`,
              backgroundSize: 'clamp(16px, 4vw, 24px) clamp(16px, 4vw, 24px)'
            }}
          />
        </div>
        
        {/* Floating elements - responsive positioning and sizing */}
        <div className="absolute top-4 left-4 w-32 h-32 sm:top-20 sm:left-20 sm:w-64 sm:h-64 bg-brand-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-8 right-4 w-40 h-40 sm:top-40 sm:right-20 sm:w-80 sm:h-80 bg-brand-400/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-4 left-1/2 w-36 h-36 sm:bottom-20 sm:w-72 sm:h-72 bg-brand-600/5 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        
        {/* Main Content with responsive grid system */}
        <main className="relative mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-12 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            {children}
          </div>
        </main>
      </div>
      
      {/* Bottom fade - responsive height */}
      <div className="fixed bottom-0 left-0 right-0 h-16 sm:h-20 lg:h-24 bg-gradient-to-t from-neutral-950 to-transparent pointer-events-none" />
    </div>
  )
}

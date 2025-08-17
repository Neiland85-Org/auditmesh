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
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgb(14 165 233 / 0.1) 1px, transparent 0)`,
              backgroundSize: '24px 24px'
            }}
          />
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-80 h-80 bg-brand-400/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-brand-600/5 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        
        {/* Main Content with 12-col grid */}
        <main className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-12 gap-6 lg:gap-8">
            {children}
          </div>
        </main>
      </div>
      
      {/* Bottom fade */}
      <div className="fixed bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-neutral-950 to-transparent pointer-events-none" />
    </div>
  )
}

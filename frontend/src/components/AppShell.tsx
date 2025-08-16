import type { ReactNode } from 'react'
import Navbar from './Navbar'

interface AppShellProps {
  children: ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Subtle background elements - calm-tech approach */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Very subtle floating elements - reduced ornamentation */}
        <div className="absolute top-32 left-32 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-48 right-32 w-80 h-80 bg-brand-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Minimal grid pattern - forensic precision */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(14, 165, 233, 0.1) 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}></div>
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        
        <main className="relative mx-auto max-w-7xl px-6 py-8">
          {children}
        </main>
      </div>
      
      {/* Subtle bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-950 to-transparent"></div>
    </div>
  )
}

import type { ReactNode } from 'react'
import Navbar from './Navbar'

interface AppShellProps {
  children: ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-neutral-950 text-neutral-100">
      {/* Dynamic grid background */}
      <div className="pointer-events-none absolute inset-0 bg-grid bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"></div>
      
      <Navbar />
      
      <main className="relative mx-auto max-w-7xl px-4 py-8">
        {children}
      </main>
    </div>
  )
}

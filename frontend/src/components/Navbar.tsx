import { motion } from 'framer-motion'
import { Shield, Activity, Search, Database, ExternalLink, Zap, Moon, Sun } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [isDark])

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="sticky top-0 z-50 border-b border-neutral-800/50"
    >
      {/* Backdrop blur */}
      <div className="absolute inset-0 bg-neutral-900/80 backdrop-blur-xl" />
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 p-0.5">
                <div className="w-full h-full rounded-xl bg-neutral-950 flex items-center justify-center">
                  <Shield size={20} className="text-white" />
                </div>
              </div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 blur-lg opacity-30 -z-10" />
            </div>
            
            <div>
              <h1 className="text-lg font-semibold bg-gradient-to-r from-brand-400 to-brand-500 bg-clip-text text-transparent">
                AuditMesh
              </h1>
              <p className="text-xs text-neutral-400 font-medium">Forensic Console</p>
            </div>
          </motion.div>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-4">
            <motion.a 
              href="http://localhost:8080" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative px-3 py-2 rounded-lg bg-neutral-800/50 hover:bg-neutral-700/50 border border-neutral-700/50 hover:border-neutral-600/50 transition-all duration-200"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-2">
                <Activity size={14} className="text-brand-400 group-hover:text-brand-300 transition-colors"/>
                <span className="text-sm text-neutral-300 group-hover:text-white transition-colors">Redpanda</span>
                <ExternalLink size={12} className="text-neutral-500 group-hover:text-neutral-400 transition-colors"/>
              </div>
            </motion.a>
            
            <motion.a 
              href="http://localhost:16686" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative px-3 py-2 rounded-lg bg-neutral-800/50 hover:bg-neutral-700/50 border border-neutral-700/50 hover:border-neutral-600/50 transition-all duration-200"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-2">
                <Search size={14} className="text-brand-400 group-hover:text-brand-300 transition-colors"/>
                <span className="text-sm text-neutral-300 group-hover:text-white transition-colors">Jaeger</span>
                <ExternalLink size={12} className="text-neutral-500 group-hover:text-neutral-400 transition-colors"/>
              </div>
            </motion.a>
            
            <motion.a 
              href="http://localhost:9001" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative px-3 py-2 rounded-lg bg-neutral-800/50 hover:bg-neutral-700/50 border border-neutral-700/50 hover:border-neutral-600/50 transition-all duration-200"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-2">
                <Database size={14} className="text-brand-400 group-hover:text-brand-300 transition-colors"/>
                <span className="text-sm text-neutral-300 group-hover:text-white transition-colors">MinIO</span>
                <ExternalLink size={12} className="text-neutral-500 group-hover:text-neutral-400 transition-colors"/>
              </div>
            </motion.a>
          </div>
          
          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Live Indicator */}
            <motion.div
              className="px-3 py-1.5 rounded-lg bg-brand-500/10 border border-brand-500/20"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-2">
                <Zap size={12} className="text-brand-400" />
                <span className="text-xs font-medium text-brand-300">Live</span>
              </div>
            </motion.div>
            
            {/* Theme Toggle */}
            <motion.button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg bg-neutral-800/50 hover:bg-neutral-700/50 border border-neutral-700/50 hover:border-neutral-600/50 transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            >
              <motion.div
                initial={false}
                animate={{ rotate: isDark ? 0 : 180 }}
                transition={{ duration: 0.3 }}
              >
                {isDark ? (
                  <Sun size={16} className="text-neutral-300" />
                ) : (
                  <Moon size={16} className="text-neutral-300" />
                )}
              </motion.div>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

import { motion } from 'framer-motion'
import { Shield, Activity, Search, Database, ExternalLink, Zap, Moon, Sun, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const [isDark, setIsDark] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [isDark])

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

  const navigationLinks = [
    {
      href: "http://localhost:8080",
      icon: Activity,
      label: "Redpanda",
      description: "Message Broker"
    },
    {
      href: "http://localhost:16686",
      icon: Search,
      label: "Jaeger",
      description: "Tracing"
    },
    {
      href: "http://localhost:9001",
      icon: Database,
      label: "MinIO",
      description: "Object Storage"
    }
  ]

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="sticky top-0 z-50 border-b border-neutral-800/50"
    >
      {/* Backdrop blur */}
      <div className="absolute inset-0 bg-neutral-900/80 backdrop-blur-xl" />
      
      <div className="relative z-10 mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          {/* Logo Section */}
          <motion.div 
            className="flex items-center gap-2 sm:gap-3"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 p-0.5">
                <div className="w-full h-full rounded-xl bg-neutral-950 flex items-center justify-center">
                  <Shield size={16} className="sm:w-5 sm:h-5 text-white" />
                </div>
              </div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 blur-lg opacity-30 -z-10" />
            </div>
            
            <div>
              <h1 className="text-base sm:text-lg font-semibold bg-gradient-to-r from-brand-400 to-brand-500 bg-clip-text text-transparent">
                AuditMesh
              </h1>
              <p className="text-xs text-neutral-400 font-medium hidden sm:block">Forensic Console</p>
            </div>
          </motion.div>
          
          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-4">
            {navigationLinks.map((link) => (
              <motion.a 
                key={link.href}
                href={link.href} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative px-3 py-2 rounded-lg bg-neutral-800/50 hover:bg-neutral-700/50 border border-neutral-700/50 hover:border-neutral-600/50 transition-all duration-200"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-2">
                  <link.icon size={14} className="text-brand-400 group-hover:text-brand-300 transition-colors"/>
                  <span className="text-sm text-neutral-300 group-hover:text-white transition-colors">{link.label}</span>
                  <ExternalLink size={12} className="text-neutral-500 group-hover:text-neutral-400 transition-colors"/>
                </div>
              </motion.a>
            ))}
          </div>
          
          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Indicator - hidden on very small screens */}
            <motion.div
              className="hidden sm:flex px-3 py-1.5 rounded-lg bg-brand-500/10 border border-brand-500/20"
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
              className="p-1.5 sm:p-2 rounded-lg bg-neutral-800/50 hover:bg-neutral-700/50 border border-neutral-700/50 hover:border-neutral-600/50 transition-all duration-200"
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
                  <Sun size={14} className="sm:w-4 sm:h-4 text-neutral-300" />
                ) : (
                  <Moon size={14} className="sm:w-4 sm:h-4 text-neutral-300" />
                )}
              </motion.div>
            </motion.button>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={toggleMobileMenu}
              className="lg:hidden p-1.5 sm:p-2 rounded-lg bg-neutral-800/50 hover:bg-neutral-700/50 border border-neutral-700/50 hover:border-neutral-600/50 transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X size={16} className="text-neutral-300" />
              ) : (
                <Menu size={16} className="text-neutral-300" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={{ 
            height: isMobileMenuOpen ? 'auto' : 0,
            opacity: isMobileMenuOpen ? 1 : 0
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="lg:hidden overflow-hidden border-t border-neutral-800/50"
        >
          <div className="py-4 space-y-3">
            {/* Mobile Navigation Links */}
            {navigationLinks.map((link) => (
              <motion.a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-neutral-800/30 hover:bg-neutral-700/30 border border-neutral-700/30 hover:border-neutral-600/30 transition-all duration-200"
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <link.icon size={18} className="text-brand-400" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">{link.label}</div>
                  <div className="text-xs text-neutral-400">{link.description}</div>
                </div>
                <ExternalLink size={14} className="text-neutral-500" />
              </motion.a>
            ))}
            
            {/* Mobile Live Indicator */}
            <div className="px-4 py-3">
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-brand-500/10 border border-brand-500/20">
                <Zap size={16} className="text-brand-400" />
                <span className="text-sm font-medium text-brand-300">Live Monitoring Active</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  )
}

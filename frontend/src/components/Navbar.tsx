import { motion } from 'framer-motion'
import { ShieldCheck, Activity, ExternalLink, Zap, Database, Search } from 'lucide-react'
import DarkToggle from './DarkToggle'

export default function Navbar() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50"
    >
      <div className="relative">
        {/* Subtle backdrop blur - forensic clarity */}
        <div className="absolute inset-0 bg-white/3 backdrop-blur-lg border-b border-white/8"></div>
        
        {/* Minimal gradient overlay - brand blue */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-500/5 via-brand-400/5 to-brand-500/5"></div>
        
        <div className="relative z-10 mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo section - forensic identity */}
            <motion.div 
              className="flex items-center gap-4"
              whileHover={{ scale: 1.01 }}
            >
              <motion.div 
                className="relative"
                whileHover={{ rotate: 2 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 p-0.5">
                  <div className="w-full h-full rounded-xl bg-slate-950 flex items-center justify-center">
                    <ShieldCheck size={20} className="text-white" />
                  </div>
                </div>
                {/* Subtle glow - forensic precision */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 blur-lg opacity-30 -z-10"></div>
              </motion.div>
              
              <div>
                <div className="text-lg font-semibold bg-gradient-to-r from-brand-400 to-brand-500 bg-clip-text text-transparent">
                  AuditMesh
                </div>
                <div className="text-xs text-slate-400 font-medium">Forensic Console</div>
              </div>
            </motion.div>
            
            {/* Navigation links - calm-tech approach */}
            <div className="hidden md:flex items-center gap-4">
              <motion.a 
                href="http://localhost:8080" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative px-3 py-2 rounded-lg bg-white/3 hover:bg-white/5 border border-white/8 hover:border-white/12 transition-all duration-200"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-2">
                  <Activity size={14} className="text-brand-400 group-hover:text-brand-300 transition-colors"/>
                  <span className="text-slate-300 group-hover:text-white transition-colors text-sm">Redpanda</span>
                  <ExternalLink size={12} className="text-slate-500 group-hover:text-slate-400 transition-colors"/>
                </div>
              </motion.a>
              
              <motion.a 
                href="http://localhost:16686" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative px-3 py-2 rounded-lg bg-white/3 hover:bg-white/5 border border-white/8 hover:border-white/12 transition-all duration-200"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-2">
                  <Search size={14} className="text-brand-400 group-hover:text-brand-300 transition-colors"/>
                  <span className="text-slate-300 group-hover:text-white transition-colors text-sm">Jaeger</span>
                  <ExternalLink size={12} className="text-slate-500 group-hover:text-slate-400 transition-colors"/>
                </div>
              </motion.a>
              
              <motion.a 
                href="http://localhost:9001" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative px-3 py-2 rounded-lg bg-white/3 hover:bg-white/5 border border-white/8 hover:border-white/12 transition-all duration-200"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-2">
                  <Database size={14} className="text-brand-400 group-hover:text-brand-300 transition-colors"/>
                  <span className="text-slate-300 group-hover:text-white transition-colors text-sm">MinIO</span>
                  <ExternalLink size={12} className="text-slate-500 group-hover:text-slate-400 transition-colors"/>
                </div>
              </motion.a>
            </div>
            
            {/* Right side - minimal indicators */}
            <div className="flex items-center gap-3">
              <motion.div
                className="px-2 py-1 rounded-lg bg-brand-500/10 border border-brand-500/20"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-1">
                  <Zap size={12} className="text-brand-400" />
                  <span className="text-xs font-medium text-brand-300">Live</span>
                </div>
              </motion.div>
              
              <DarkToggle />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

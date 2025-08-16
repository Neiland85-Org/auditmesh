import { motion } from 'framer-motion'
import { ShieldCheck, Activity, ExternalLink, Zap, Database, Search } from 'lucide-react'
import DarkToggle from './DarkToggle'

export default function Navbar() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="sticky top-0 z-50"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-xl border-b border-white/10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10"></div>
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-4"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div 
                className="relative"
                whileHover={{ rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 p-0.5">
                  <div className="w-full h-full rounded-2xl bg-slate-900 flex items-center justify-center">
                    <ShieldCheck size={24} className="text-white" />
                  </div>
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 blur-xl opacity-50 -z-10"></div>
              </motion.div>
              
              <div>
                <div className="text-xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  AuditMesh
                </div>
                <div className="text-xs text-slate-400 font-medium">Enterprise Console</div>
              </div>
            </motion.div>
            
            <div className="hidden md:flex items-center gap-6">
              <motion.a 
                href="http://localhost:8080" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center gap-2">
                  <Activity size={16} className="text-purple-400 group-hover:text-purple-300 transition-colors"/>
                  <span className="text-slate-300 group-hover:text-white transition-colors">Redpanda</span>
                  <ExternalLink size={14} className="text-slate-500 group-hover:text-slate-400 transition-colors"/>
                </div>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.a>
              
              <motion.a 
                href="http://localhost:16686" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center gap-2">
                  <Search size={16} className="text-blue-400 group-hover:text-blue-300 transition-colors"/>
                  <span className="text-slate-300 group-hover:text-white transition-colors">Jaeger</span>
                  <ExternalLink size={14} className="text-slate-500 group-hover:text-slate-400 transition-colors"/>
                </div>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.a>
              
              <motion.a 
                href="http://localhost:9001" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center gap-2">
                  <Database size={16} className="text-cyan-400 group-hover:text-cyan-300 transition-colors"/>
                  <span className="text-slate-300 group-hover:text-white transition-colors">MinIO</span>
                  <ExternalLink size={14} className="text-slate-500 group-hover:text-slate-400 transition-colors"/>
                </div>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.a>
            </div>
            
            <div className="flex items-center gap-3">
              <motion.div
                className="px-3 py-2 rounded-xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center gap-2">
                  <Zap size={16} className="text-purple-400" />
                  <span className="text-xs font-medium text-purple-300">Live</span>
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

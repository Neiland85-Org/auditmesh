import { motion } from 'framer-motion'
import { ShieldCheck, Activity, ExternalLink } from 'lucide-react'
import DarkToggle from './DarkToggle'

export default function Navbar() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-neutral-900/60 border-b border-neutral-800"
    >
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-700 grid place-items-center shadow-glow"
          >
            <ShieldCheck size={18} />
          </motion.div>
          <div className="font-semibold tracking-wide">AuditMesh Console</div>
        </div>
        
        <div className="flex items-center gap-3">
          <a 
            href="http://localhost:8080" 
            target="_blank" 
            rel="noopener noreferrer"
            className="focus-ring rounded-xl border border-neutral-800 px-3 py-2 text-sm hover:bg-neutral-900 inline-flex items-center gap-2 transition-colors"
          >
            <Activity size={16}/> Redpanda
            <ExternalLink size={14} className="opacity-60" />
          </a>
          
          <a 
            href="http://localhost:16686" 
            target="_blank" 
            rel="noopener noreferrer"
            className="focus-ring rounded-xl border border-neutral-800 px-3 py-2 text-sm hover:bg-neutral-900 inline-flex items-center gap-2 transition-colors"
          >
            Jaeger
            <ExternalLink size={14} className="opacity-60" />
          </a>
          
          <a 
            href="http://localhost:9001" 
            target="_blank" 
            rel="noopener noreferrer"
            className="focus-ring rounded-xl border border-neutral-800 px-3 py-2 text-sm hover:bg-neutral-900 inline-flex items-center gap-2 transition-colors"
          >
            MinIO
            <ExternalLink size={14} className="opacity-60" />
          </a>
          
          <DarkToggle />
        </div>
      </div>
    </motion.div>
  )
}

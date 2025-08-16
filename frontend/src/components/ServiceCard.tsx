import { motion } from 'framer-motion'
import { Activity, CheckCircle2, CircleAlert, AlertTriangle } from 'lucide-react'
import { cn } from '../lib/utils'

type ServiceStatus = 'ok' | 'down' | 'unknown' | 'warning'

interface ServiceCardProps {
  name: string
  status: ServiceStatus
  subtitle?: string
  kpi?: string
  onClick?: () => void
  className?: string
}

export default function ServiceCard({ 
  name, 
  status, 
  subtitle, 
  kpi, 
  onClick, 
  className 
}: ServiceCardProps) {
  const statusConfig = {
    ok: {
      color: 'text-emerald-400',
      bgColor: 'from-emerald-500/20 to-emerald-600/10',
      icon: CheckCircle2,
      glow: 'shadow-emerald-500/25'
    },
    down: {
      color: 'text-rose-400',
      bgColor: 'from-rose-500/20 to-rose-600/10',
      icon: CircleAlert,
      glow: 'shadow-rose-500/25'
    },
    warning: {
      color: 'text-amber-400',
      bgColor: 'from-amber-500/20 to-amber-600/10',
      icon: AlertTriangle,
      glow: 'shadow-amber-500/25'
    },
    unknown: {
      color: 'text-neutral-400',
      bgColor: 'from-neutral-500/20 to-neutral-600/10',
      icon: Activity,
      glow: 'shadow-neutral-500/25'
    }
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <motion.button
      whileHover={{ 
        y: -8, 
        rotateX: 5, 
        rotateY: -5,
        scale: 1.02
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "tilt group relative w-full rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 text-left transition-all duration-300",
        "hover:border-neutral-700 hover:bg-neutral-900/80",
        className
      )}
    >
      {/* Glow effect */}
      <div className={cn(
        "absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300",
        config.bgColor
      )} />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm text-neutral-400 mb-1">{subtitle || 'Service'}</div>
            <div className="text-xl font-semibold text-neutral-100">{name}</div>
          </div>
          <motion.div 
            className={cn('flex items-center gap-2 text-sm', config.color)}
            whileHover={{ scale: 1.1 }}
          >
            <Icon size={20} />
            <span className="uppercase tracking-wide font-medium">{status}</span>
          </motion.div>
        </div>
        
        {kpi && (
          <div className="text-neutral-300 text-sm bg-neutral-800/50 rounded-lg px-3 py-2">
            {kpi}
          </div>
        )}
      </div>

      {/* Hover glow */}
      <div className={cn(
        "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300",
        config.glow
      )} />
    </motion.button>
  )
}

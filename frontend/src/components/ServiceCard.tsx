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
      borderColor: 'border-emerald-500/30',
      icon: CheckCircle2,
      glow: 'shadow-emerald-500/25',
      gradient: 'from-emerald-500/20 via-emerald-400/10 to-emerald-600/20'
    },
    down: {
      color: 'text-rose-400',
      bgColor: 'from-rose-500/20 to-rose-600/10',
      borderColor: 'border-rose-500/30',
      icon: CircleAlert,
      glow: 'shadow-rose-500/25',
      gradient: 'from-rose-500/20 via-rose-400/10 to-rose-600/20'
    },
    warning: {
      color: 'text-amber-400',
      bgColor: 'from-amber-500/20 to-amber-600/10',
      borderColor: 'border-amber-500/30',
      icon: AlertTriangle,
      glow: 'shadow-amber-500/25',
      gradient: 'from-amber-500/20 via-amber-400/10 to-amber-600/20'
    },
    unknown: {
      color: 'text-slate-400',
      bgColor: 'from-slate-500/20 to-slate-600/10',
      borderColor: 'border-slate-500/30',
      icon: Activity,
      glow: 'shadow-slate-500/25',
      gradient: 'from-slate-500/20 via-slate-400/10 to-slate-600/20'
    }
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <motion.div
      whileHover={{ 
        y: -12, 
        rotateX: 8, 
        rotateY: -8,
        scale: 1.03
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "group relative w-full rounded-3xl p-6 cursor-pointer overflow-hidden",
        "bg-white/5 backdrop-blur-xl border border-white/10",
        "hover:border-white/20 transition-all duration-500",
        className
      )}
    >
      {/* Animated background gradient */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500",
        config.gradient
      )} />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-4 right-4 w-2 h-2 bg-white/20 rounded-full"
          animate={{ 
            y: [0, -10, 0],
            opacity: [0.2, 0.8, 0.2]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            delay: 0 
          }}
        />
        <motion.div 
          className="absolute bottom-6 left-6 w-1.5 h-1.5 bg-white/30 rounded-full"
          animate={{ 
            y: [0, -8, 0],
            opacity: [0.3, 0.9, 0.3]
          }}
          transition={{ 
            duration: 2.5, 
            repeat: Infinity, 
            delay: 1 
          }}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="text-sm text-slate-400 mb-2 font-medium tracking-wide uppercase">
              {subtitle || 'Service'}
            </div>
            <div className="text-2xl font-bold text-white mb-2">{name}</div>
            {kpi && (
              <div className="text-slate-300 text-sm bg-white/5 rounded-lg px-3 py-2 border border-white/10">
                {kpi}
              </div>
            )}
          </div>
          
          <motion.div 
            className={cn('flex items-center gap-3', config.color)}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <div className="relative">
              <Icon size={24} />
              {/* Pulse effect for active services */}
              {status === 'ok' && (
                <motion.div 
                  className="absolute inset-0 rounded-full bg-emerald-400/30"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold uppercase tracking-wider">
                {status}
              </div>
              <div className="text-xs opacity-75">
                {status === 'ok' ? 'Healthy' : status === 'down' ? 'Offline' : status === 'warning' ? 'Degraded' : 'Unknown'}
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Status indicator bar */}
        <div className="relative h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className={cn(
              "h-full rounded-full",
              status === 'ok' ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' :
              status === 'down' ? 'bg-gradient-to-r from-rose-400 to-rose-500' :
              status === 'warning' ? 'bg-gradient-to-r from-amber-400 to-amber-500' :
              'bg-gradient-to-r from-slate-400 to-slate-500'
            )}
            initial={{ width: 0 }}
            animate={{ width: status === 'ok' ? '100%' : status === 'down' ? '0%' : status === 'warning' ? '60%' : '30%' }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
      </div>

      {/* Hover glow effect */}
      <div className={cn(
        "absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500",
        config.glow
      )} />
      
      {/* Top accent line */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-1 rounded-t-3xl",
        status === 'ok' ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' :
        status === 'down' ? 'bg-gradient-to-r from-rose-400 to-rose-500' :
        status === 'warning' ? 'bg-gradient-to-r from-amber-400 to-amber-500' :
        'bg-gradient-to-r from-slate-400 to-slate-500'
      )} />
    </motion.div>
  )
}

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
      bgColor: 'from-emerald-500/10 to-emerald-600/5',
      borderColor: 'border-emerald-500/20',
      icon: CheckCircle2,
      glow: 'shadow-emerald-500/15',
      gradient: 'from-emerald-500/10 via-emerald-400/5 to-emerald-600/10'
    },
    down: {
      color: 'text-rose-400',
      bgColor: 'from-rose-500/10 to-rose-600/5',
      borderColor: 'border-rose-500/20',
      icon: CircleAlert,
      glow: 'shadow-rose-500/15',
      gradient: 'from-rose-500/10 via-rose-400/5 to-rose-600/10'
    },
    warning: {
      color: 'text-amber-400',
      bgColor: 'from-amber-500/10 to-amber-600/5',
      borderColor: 'border-amber-500/20',
      icon: AlertTriangle,
      glow: 'shadow-amber-500/15',
      gradient: 'from-amber-500/10 via-amber-400/5 to-amber-600/10'
    },
    unknown: {
      color: 'text-slate-400',
      bgColor: 'from-slate-500/10 to-slate-600/5',
      borderColor: 'border-slate-500/20',
      icon: Activity,
      glow: 'shadow-slate-500/15',
      gradient: 'from-slate-500/10 via-slate-400/5 to-slate-600/10'
    }
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <motion.div
      whileHover={{ 
        y: -4, 
        rotateX: 2, 
        rotateY: -2,
        scale: 1.01
      }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={cn(
        "group relative w-full rounded-2xl p-6 cursor-pointer overflow-hidden",
        "bg-white/3 backdrop-blur-sm border border-white/8",
        "hover:border-white/12 transition-all duration-300",
        className
      )}
    >
      {/* Subtle background gradient - calm-tech */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300",
        config.gradient
      )} />
      
      {/* Minimal floating elements - forensic precision */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-4 right-4 w-1.5 h-1.5 bg-white/15 rounded-full"
          animate={{ 
            y: [0, -6, 0],
            opacity: [0.15, 0.6, 0.15]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            delay: 0 
          }}
        />
        <motion.div 
          className="absolute bottom-6 left-6 w-1 h-1 bg-white/20 rounded-full"
          animate={{ 
            y: [0, -4, 0],
            opacity: [0.2, 0.7, 0.2]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            delay: 1 
          }}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-5">
          <div className="flex-1">
            <div className="text-sm text-slate-400 mb-2 font-medium tracking-wide uppercase">
              {subtitle || 'Service'}
            </div>
            <div className="text-xl font-semibold text-white mb-2">{name}</div>
            {kpi && (
              <div className="text-slate-300 text-sm bg-white/3 rounded-lg px-3 py-2 border border-white/6">
                {kpi}
              </div>
            )}
          </div>
          
          <motion.div 
            className={cn('flex items-center gap-3', config.color)}
            whileHover={{ scale: 1.05, rotate: 2 }}
          >
            <div className="relative">
              <Icon size={20} />
              {/* Subtle pulse effect for active services */}
              {status === 'ok' && (
                <motion.div 
                  className="absolute inset-0 rounded-full bg-emerald-400/20"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0, 0.2] }}
                  transition={{ duration: 3, repeat: Infinity }}
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
        
        {/* Status indicator bar - forensic precision */}
        <div className="relative h-0.5 bg-white/8 rounded-full overflow-hidden">
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
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </div>
      </div>

      {/* Subtle hover glow - calm-tech */}
      <div className={cn(
        "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300",
        config.glow
      )} />
      
      {/* Top accent line - forensic precision */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl",
        status === 'ok' ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' :
        status === 'down' ? 'bg-gradient-to-r from-rose-400 to-rose-500' :
        status === 'warning' ? 'bg-gradient-to-r from-amber-400 to-amber-500' :
        'bg-gradient-to-r from-slate-400 to-slate-500'
      )} />
    </motion.div>
  )
}

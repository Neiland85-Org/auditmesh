import { motion } from 'framer-motion'
import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react'
import type { ReactNode } from 'react'

type ServiceStatus = 'ok' | 'down' | 'unknown'
type ServiceCardVariant = 'default' | 'dense' | 'compact'

interface ServiceCardProps {
  name: string
  status: ServiceStatus
  subtitle?: string
  kpi?: string | ReactNode
  variant?: ServiceCardVariant
  onClick?: () => void
  className?: string
}

export default function ServiceCard({ 
  name, 
  status, 
  subtitle, 
  kpi, 
  variant = 'default',
  onClick,
  className = ''
}: ServiceCardProps) {
  // Status configuration
  const statusConfig = {
    ok: {
      color: 'text-status-ok',
      bgColor: 'bg-status-ok/10',
      borderColor: 'border-status-ok/20',
      icon: CheckCircle2,
      label: 'Healthy',
      description: 'Service is running normally'
    },
    down: {
      color: 'text-status-down',
      bgColor: 'bg-status-down/10',
      borderColor: 'border-status-down/20',
      icon: XCircle,
      label: 'Offline',
      description: 'Service is not responding'
    },
    unknown: {
      color: 'text-status-unknown',
      bgColor: 'bg-status-unknown/10',
      borderColor: 'border-status-unknown/20',
      icon: HelpCircle,
      label: 'Unknown',
      description: 'Service status unclear'
    }
  }

  const config = statusConfig[status]
  const Icon = config.icon

  // Variant-based sizing
  const variantClasses = {
    default: 'p-6 rounded-2xl',
    dense: 'p-4 rounded-xl',
    compact: 'p-3 rounded-lg'
  }

  const iconSizes = {
    default: 20,
    dense: 18,
    compact: 16
  }

  const textSizes = {
    default: 'text-xl',
    dense: 'text-lg',
    compact: 'text-base'
  }

  return (
    <motion.div
      role="button"
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          onClick()
        }
      }}
      className={`
        group relative cursor-pointer overflow-hidden
        bg-neutral-800/50 backdrop-blur-sm border border-neutral-700/50
        hover:border-neutral-600/50 transition-all duration-200
        ${variantClasses[variant]}
        ${className}
      `}
      whileHover={{ 
        y: variant === 'compact' ? -2 : -4,
        rotateX: variant === 'compact' ? 1 : 2,
        rotateY: variant === 'compact' ? -1 : -2,
        scale: 1.01
      }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.2 }}
      aria-label={`${name} service - ${config.label}`}
      aria-describedby={`${name}-status ${name}-description`}
    >
      {/* Subtle background gradient */}
      <div className={`
        absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 
        transition-opacity duration-200 ${config.bgColor}
      `} />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {subtitle && (
              <p className="text-sm text-neutral-400 mb-1 font-medium tracking-wide uppercase">
                {subtitle}
              </p>
            )}
            <h3 className={`font-semibold text-white mb-2 ${textSizes[variant]}`}>
              {name}
            </h3>
            {kpi && (
              <div className="text-sm text-neutral-300 bg-neutral-800/50 rounded-lg px-3 py-2 border border-neutral-700/50">
                {kpi}
              </div>
            )}
          </div>
          
          <motion.div 
            className={`flex items-center gap-2 ${config.color}`}
            whileHover={{ scale: 1.05, rotate: 2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative">
              <Icon size={iconSizes[variant]} />
              {/* Pulse effect for active services */}
              {status === 'ok' && (
                <motion.div 
                  className="absolute inset-0 rounded-full bg-status-ok/20"
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
                {config.label}
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Status indicator bar */}
        <div className="relative h-0.5 bg-neutral-700/50 rounded-full overflow-hidden">
          <motion.div 
            className={`
              h-full rounded-full transition-all duration-300
              ${status === 'ok' ? 'bg-status-ok' : 
                status === 'down' ? 'bg-status-down' : 
                'bg-status-unknown'}
            `}
            initial={{ width: 0 }}
            animate={{ 
              width: status === 'ok' ? '100%' : 
                     status === 'down' ? '0%' : '30%' 
            }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
        </div>
      </div>

      {/* Hover glow effect */}
      <div className={`
        absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 
        transition-opacity duration-200 shadow-glow-md
      `} />
      
      {/* Top accent line */}
      <div className={`
        absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl
        ${status === 'ok' ? 'bg-status-ok' : 
          status === 'down' ? 'bg-status-down' : 
          'bg-status-unknown'}
      `} />

      {/* Accessibility elements */}
      <div id={`${name}-status`} className="sr-only">
        {config.label}
      </div>
      <div id={`${name}-description`} className="sr-only">
        {config.description}
      </div>
    </motion.div>
  )
}

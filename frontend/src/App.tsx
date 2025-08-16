import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import AppShell from './components/AppShell'
import ServiceCard from './components/ServiceCard'
import EventPublisher from './components/EventPublisher'
import LiveMetrics from './components/LiveMetrics'
import { getAllServicesHealth, getServiceStatus } from './lib/api'

type ServiceStatus = 'ok' | 'down' | 'warning' | 'unknown'

interface ServiceState {
  gateway: ServiceStatus
  detector: ServiceStatus
  auditor: ServiceStatus
}

function useServiceStatuses() {
  const [services, setServices] = useState<ServiceState>({
    gateway: 'unknown',
    detector: 'unknown',
    auditor: 'unknown'
  })

  useEffect(() => {
    let active = true
    
    const pollServices = async () => {
      try {
        const health = await getAllServicesHealth()
        
        if (active) {
          setServices({
            gateway: getServiceStatus(health.gateway),
            detector: getServiceStatus(health.detector),
            auditor: getServiceStatus(health.auditor)
          })
        }
      } catch (error) {
        console.warn('Failed to poll services:', error)
        if (active) {
          setServices({
            gateway: 'down',
            detector: 'down',
            auditor: 'down'
          })
        }
      }
    }

    // Initial poll
    pollServices()
    
    // Poll every 4 seconds
    const interval = setInterval(pollServices, 4000)
    
    return () => {
      active = false
      clearInterval(interval)
    }
  }, [])

  return services
}

export default function App() {
  const { gateway, detector, auditor } = useServiceStatuses()

  return (
    <AppShell>
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-16"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="inline-block mb-6"
        >
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 p-1">
            <div className="w-full h-full rounded-3xl bg-slate-900 flex items-center justify-center">
              <div className="text-3xl">🛡️</div>
            </div>
          </div>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-5xl sm:text-6xl font-bold mb-6"
        >
          <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Realtime Audit
          </span>
          <br />
          <span className="text-white">& Proofs</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-3xl mx-auto text-xl text-slate-300 leading-relaxed"
        >
          Dispara eventos, observa el pipeline EDA y verifica la cadena Merkle en vivo. 
          <br />
          <span className="text-slate-400">Integrado con Redpanda, OpenTelemetry y Jaeger.</span>
        </motion.p>
        
        {/* Stats badges */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex items-center justify-center gap-6 mt-8"
        >
          <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-2xl font-bold text-white">3</div>
            <div className="text-sm text-slate-400">Microservicios</div>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-2xl font-bold text-white">∞</div>
            <div className="text-sm text-slate-400">Eventos</div>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-2xl font-bold text-white">🔒</div>
            <div className="text-sm text-slate-400">Seguro</div>
          </div>
        </motion.div>
      </motion.section>

      {/* Service Status Cards */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.0 }}
        className="mb-16"
      >
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-2">Estado de Servicios</h2>
          <p className="text-slate-400">Monitoreo en tiempo real de la infraestructura</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
          >
            <ServiceCard 
              name="Gateway" 
              status={gateway} 
              subtitle="ms-gateway"
              kpi="API Gateway Service"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.6 }}
          >
            <ServiceCard 
              name="Lie Detector" 
              status={detector} 
              subtitle="ms-lie-detector"
              kpi="Event Processing Service"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.8 }}
          >
            <ServiceCard 
              name="Auditor" 
              status={auditor} 
              subtitle="ms-auditor"
              kpi="Proof Generation Service"
            />
          </motion.div>
        </div>
      </motion.section>

      {/* Live Metrics */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 2.0 }}
        className="mb-16"
      >
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.2 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-2">Métricas en Vivo</h2>
          <p className="text-slate-400">Throughput y rendimiento del sistema</p>
        </motion.div>
        
        <LiveMetrics />
      </motion.section>

      {/* Event Publisher */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 2.4 }}
        className="mb-16"
      >
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-2">Publicador de Eventos</h2>
          <p className="text-slate-400">Envía eventos al pipeline EDA</p>
        </motion.div>
        
        <EventPublisher />
      </motion.section>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 2.8 }}
        className="mt-20 text-center"
      >
        <div className="py-8 border-t border-white/10">
          <div className="text-slate-400 mb-4">
            © {new Date().getFullYear()} AuditMesh - Enterprise Audit & Proof Management
          </div>
          <div className="flex items-center justify-center gap-6 text-sm">
            <a 
              href="http://localhost:8080" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-purple-400 transition-colors"
            >
              Redpanda Console
            </a>
            <a 
              href="http://localhost:16686" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-blue-400 transition-colors"
            >
              Jaeger
            </a>
            <a 
              href="http://localhost:9001" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-cyan-400 transition-colors"
            >
              MinIO
            </a>
          </div>
        </div>
      </motion.footer>
    </AppShell>
  )
}

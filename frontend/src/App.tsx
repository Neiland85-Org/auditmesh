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
      {/* Header Section */}
      <motion.header 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-100 mb-4"
        >
          Realtime Audit & Proofs
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-2xl text-neutral-400 text-lg"
        >
          Dispara eventos, observa el pipeline EDA y verifica la cadena Merkle en vivo. 
          Integrado con Redpanda, OpenTelemetry y Jaeger.
        </motion.p>
      </motion.header>

      {/* Service Status Cards */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      >
        <ServiceCard 
          name="Gateway" 
          status={gateway} 
          subtitle="ms-gateway"
          kpi="API Gateway Service"
        />
        <ServiceCard 
          name="Lie Detector" 
          status={detector} 
          subtitle="ms-lie-detector"
          kpi="Event Processing Service"
        />
        <ServiceCard 
          name="Auditor" 
          status={auditor} 
          subtitle="ms-auditor"
          kpi="Proof Generation Service"
        />
      </motion.section>

      {/* Live Metrics */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mb-8"
      >
        <LiveMetrics />
      </motion.section>

      {/* Event Publisher */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        className="mb-8"
      >
        <EventPublisher />
      </motion.section>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="mt-16 flex items-center justify-between border-t border-neutral-800 pt-6 text-sm text-neutral-500"
      >
        <div>© {new Date().getFullYear()} AuditMesh</div>
        <div className="flex items-center gap-6">
          <a 
            href="http://localhost:8080" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-neutral-300 transition-colors"
          >
            Redpanda Console
          </a>
          <a 
            href="http://localhost:16686" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-neutral-300 transition-colors"
          >
            Jaeger
          </a>
          <a 
            href="http://localhost:9001" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-neutral-300 transition-colors"
          >
            MinIO
          </a>
        </div>
      </motion.footer>
    </AppShell>
  )
}

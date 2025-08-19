import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import AppShell from './components/AppShell'
import EventConsole from './components/EventConsole'
import LiveMetrics from './components/LiveMetrics'
import ServiceCard from './components/ServiceCard'

type ServiceStatus = 'ok' | 'down' | 'unknown'

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
        await new Promise(resolve => setTimeout(resolve, 1000))
        if (active) {
          setServices({
            gateway: Math.random() > 0.3 ? 'ok' : 'down',
            detector: Math.random() > 0.2 ? 'ok' : 'down',
            auditor: Math.random() > 0.25 ? 'ok' : 'down'
          })
        }
      } catch (error) {
        if (active) {
          setServices({ gateway: 'down', detector: 'down', auditor: 'down' })
        }
      }
    }
    pollServices()
    const interval = setInterval(pollServices, 5000)
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
        className="col-span-12 text-center mb-16"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="inline-block mb-6"
        >
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-brand-500 to-brand-600 p-1">
            <div className="w-full h-full rounded-3xl bg-neutral-950 flex items-center justify-center">
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
          <span className="bg-gradient-to-r from-brand-400 to-brand-500 bg-clip-text text-transparent">
            Realtime Audit
          </span>
          <br />
          <span className="text-white">& Proofs</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-3xl mx-auto text-xl text-neutral-300 leading-relaxed"
        >
          Dispara eventos, observa el pipeline EDA y verifica la cadena Merkle en vivo.
          <br />
          <span className="text-neutral-400">Integrado con Redpanda, OpenTelemetry y Jaeger.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex items-center justify-center gap-6 mt-8"
        >
          <div className="px-4 py-2 rounded-2xl bg-neutral-800/50 border border-neutral-700/50">
            <div className="text-2xl font-bold text-white">3</div>
            <div className="text-sm text-neutral-400">Microservicios</div>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-neutral-800/50 border border-neutral-700/50">
            <div className="text-2xl font-bold text-white">∞</div>
            <div className="text-sm text-neutral-400">Eventos</div>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-neutral-800/50 border border-neutral-700/50">
            <div className="text-2xl font-bold text-white">🔒</div>
            <div className="text-sm text-neutral-400">Seguro</div>
          </div>
        </motion.div>
      </motion.section>

      {/* Service Status Cards */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.0 }}
        className="col-span-12 mb-16"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-2">Estado de Servicios</h2>
          <p className="text-neutral-400">Monitoreo en tiempo real de la infraestructura</p>
        </motion.div>

        <div className="grid grid-cols-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="col-span-12 md:col-span-4"
          >
            <ServiceCard
              name="Gateway"
              status={gateway}
              subtitle="ms-gateway"
              kpi="API Gateway Service"
              variant="default"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.6 }}
            className="col-span-12 md:col-span-4"
          >
            <ServiceCard
              name="Lie Detector"
              status={detector}
              subtitle="ms-lie-detector"
              kpi="Event Processing Service"
              variant="default"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.8 }}
            className="col-span-12 md:col-span-4"
          >
            <ServiceCard
              name="Auditor"
              status={auditor}
              subtitle="ms-auditor"
              kpi="Proof Generation Service"
              variant="default"
            />
          </motion.div>
        </div>
      </motion.section>

      {/* Main Content Area */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 2.0 }}
        className="col-span-12"
      >
        <div className="grid grid-cols-12 gap-6">
          <EventConsole />
          <LiveMetrics />
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 2.8 }}
        className="col-span-12 mt-20 text-center"
      >
        <div className="py-8 border-t border-neutral-800/50">
          <div className="text-neutral-400 mb-4">
            © {new Date().getFullYear()} AuditMesh - Enterprise Audit & Proof Management
          </div>
          <div className="flex items-center justify-center gap-6 text-sm">
            <a
              href="http://localhost:8080"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-brand-400 transition-colors"
            >
              Redpanda Console
            </a>
            <a
              href="http://localhost:16686"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-brand-400 transition-colors"
            >
              Jaeger
            </a>
            <a
              href="http://localhost:9001"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-brand-400 transition-colors"
            >
              MinIO
            </a>
          </div>
        </div>
      </motion.footer>
    </AppShell>
  );
}

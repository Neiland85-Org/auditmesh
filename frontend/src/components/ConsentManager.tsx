import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, Settings, Shield, Database, BarChart3 } from 'lucide-react'

interface ConsentPreferences {
  essential: boolean
  analytics: boolean
  marketing: boolean
  thirdParty: boolean
}

interface ConsentManagerProps {
  onConsentChange?: (preferences: ConsentPreferences) => void
  className?: string
}

export function ConsentManager({ onConsentChange, className = '' }: ConsentManagerProps) {
  const [showBanner, setShowBanner] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    essential: true, // Siempre requerido
    analytics: false,
    marketing: false,
    thirdParty: false
  })

  useEffect(() => {
    // Verificar si ya se ha dado consentimiento
    const savedConsent = localStorage.getItem('auditmesh-consent')
    if (!savedConsent) {
      setShowBanner(true)
    } else {
      try {
        const parsed = JSON.parse(savedConsent)
        setPreferences(parsed)
      } catch (error) {
        console.error('Error parsing saved consent:', error)
        setShowBanner(true)
      }
    }
  }, [])

  const handleConsentChange = (type: keyof ConsentPreferences, value: boolean) => {
    const newPreferences = { ...preferences, [type]: value }
    setPreferences(newPreferences)
    
    // Guardar en localStorage
    localStorage.setItem('auditmesh-consent', JSON.stringify(newPreferences))
    
    // Notificar al componente padre
    onConsentChange?.(newPreferences)
  }

  const acceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      marketing: true,
      thirdParty: true
    }
    setPreferences(allAccepted)
    localStorage.setItem('auditmesh-consent', JSON.stringify(allAccepted))
    setShowBanner(false)
    onConsentChange?.(allAccepted)
  }

  const acceptEssential = () => {
    const essentialOnly = {
      essential: true,
      analytics: false,
      marketing: false,
      thirdParty: false
    }
    setPreferences(essentialOnly)
    localStorage.setItem('auditmesh-consent', JSON.stringify(essentialOnly))
    setShowBanner(false)
    onConsentChange?.(essentialOnly)
  }

  const openSettings = () => {
    setShowModal(true)
  }

  return (
    <>
      {/* Banner de Consentimiento */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-900 border-t border-neutral-700 p-4"
          >
            <div className="max-w-6xl mx-auto">
              <div className="flex items-start gap-4">
                <Shield className="text-brand-400 mt-1 flex-shrink-0" size={24} />
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Configuración de Privacidad
                  </h3>
                  <p className="text-neutral-300 text-sm mb-4">
                    Utilizamos cookies y tecnologías similares para mejorar tu experiencia, 
                    analizar el tráfico y personalizar el contenido. 
                    <a href="/privacy" className="text-brand-400 hover:underline ml-1">
                      Más información
                    </a>
                  </p>
                  
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={acceptEssential}
                      className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Solo Esenciales
                    </button>
                    
                    <button
                      onClick={acceptAll}
                      className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Aceptar Todo
                    </button>
                    
                    <button
                      onClick={openSettings}
                      className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      <Settings size={16} />
                      Configurar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Configuración */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Configuración de Privacidad</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Cookies Esenciales */}
                <div className="bg-neutral-800/50 rounded-xl p-4 border border-neutral-700">
                  <div className="flex items-center gap-3 mb-3">
                    <Shield className="text-green-400" size={20} />
                    <div>
                      <h3 className="font-semibold text-white">Cookies Esenciales</h3>
                      <p className="text-sm text-neutral-400">Necesarias para el funcionamiento básico</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-300">
                      Sesión, autenticación, preferencias básicas
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-green-400 text-sm">Siempre activas</span>
                      <input
                        type="checkbox"
                        checked={preferences.essential}
                        disabled
                        className="rounded border-neutral-600 bg-neutral-700 text-green-400 focus:ring-green-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Cookies de Analytics */}
                <div className="bg-neutral-800/50 rounded-xl p-4 border border-neutral-700">
                  <div className="flex items-center gap-3 mb-3">
                    <BarChart3 className="text-blue-400" size={20} />
                    <div>
                      <h3 className="font-semibold text-white">Cookies de Analytics</h3>
                      <p className="text-sm text-neutral-400">Nos ayudan a mejorar la experiencia</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-300">
                      Métricas de uso, rendimiento, errores
                    </span>
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) => handleConsentChange('analytics', e.target.checked)}
                      className="rounded border-neutral-600 bg-neutral-700 text-blue-400 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Cookies de Marketing */}
                <div className="bg-neutral-800/50 rounded-xl p-4 border border-neutral-700">
                  <div className="flex items-center gap-3 mb-3">
                    <Database className="text-purple-400" size={20} />
                    <div>
                      <h3 className="font-semibold text-white">Cookies de Marketing</h3>
                      <p className="text-sm text-neutral-400">Personalización de contenido</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-300">
                      Recomendaciones, contenido personalizado
                    </span>
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={(e) => handleConsentChange('marketing', e.target.checked)}
                      className="rounded border-neutral-600 bg-neutral-700 text-purple-400 focus:ring-purple-500"
                    />
                  </div>
                </div>

                {/* Cookies de Terceros */}
                <div className="bg-neutral-800/50 rounded-xl p-4 border border-neutral-700">
                  <div className="flex items-center gap-3 mb-3">
                    <AlertCircle className="text-orange-400" size={20} />
                    <div>
                      <h3 className="font-semibold text-white">Cookies de Terceros</h3>
                      <p className="text-sm text-neutral-400">Servicios externos integrados</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-300">
                      Redes sociales, mapas, videos
                    </span>
                    <input
                      type="checkbox"
                      checked={preferences.thirdParty}
                      onChange={(e) => handleConsentChange('thirdParty', e.target.checked)}
                      className="rounded border-neutral-600 bg-neutral-700 text-orange-400 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-neutral-700">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    setShowModal(false)
                    setShowBanner(false)
                  }}
                  className="px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium transition-colors"
                >
                  Guardar Preferencias
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón de Configuración (siempre visible) */}
      <button
        onClick={openSettings}
        className={`fixed bottom-4 right-4 z-40 p-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 rounded-full text-neutral-300 hover:text-white transition-all ${className}`}
        title="Configurar Privacidad"
      >
        <Settings size={20} />
      </button>
    </>
  )
}

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, CheckCircle2, AlertCircle, Loader2, ExternalLink } from 'lucide-react'

interface EventData {
  actor: string
  subject: string
  payload: string
  action: string
}

interface EventResult {
  event_id: string
  trace_id?: string
  root?: string
}

export default function EventConsole() {
  const [eventData, setEventData] = useState<EventData>({
    actor: '{"id": "user:demo", "type": "user"}',
    subject: '{"type": "document", "id": "doc-123"}',
    payload: '{"message": "hello world"}',
    action: 'created'
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<EventResult | null>(null)
  const [errors, setErrors] = useState<string[]>([])

  const validateJSON = (jsonString: string): boolean => {
    try {
      JSON.parse(jsonString)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = async () => {
    const newErrors: string[] = []
    
    if (!validateJSON(eventData.actor)) newErrors.push('Invalid Actor JSON')
    if (!validateJSON(eventData.subject)) newErrors.push('Invalid Subject JSON')
    if (!validateJSON(eventData.payload)) newErrors.push('Invalid Payload JSON')
    if (!eventData.action.trim()) newErrors.push('Action is required')
    
    setErrors(newErrors)
    if (newErrors.length > 0) return
    
    setIsLoading(true)
    setResult(null)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setResult({
        event_id: `evt_${Math.random().toString(36).substr(2, 9)}`,
        trace_id: `trace_${Math.random().toString(36).substr(2, 9)}`,
        root: `root_${Math.random().toString(36).substr(2, 16)}`
      })
        } catch (error) {
      setErrors(['Failed to send event'])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="col-span-12 lg:col-span-8 xl:col-span-9"
    >
      <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700/50 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Event Console</h2>
            <p className="text-neutral-400">Publish events to the EDA pipeline</p>
          </div>
          <div className="text-xs text-neutral-500 bg-neutral-700/50 px-3 py-1 rounded-lg">
            Gateway → Detector → Auditor
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-neutral-300">Actor</label>
            <textarea
              value={eventData.actor}
              onChange={(e) => setEventData(prev => ({ ...prev, actor: e.target.value }))}
              className="w-full h-32 p-3 rounded-lg border border-neutral-600 bg-neutral-900/50 text-sm font-mono resize-none"
              placeholder='{"id": "user:demo", "type": "user"}'
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-neutral-300">Subject</label>
            <textarea
              value={eventData.subject}
              onChange={(e) => setEventData(prev => ({ ...prev, subject: e.target.value }))}
              className="w-full h-32 p-3 rounded-lg border border-neutral-600 bg-neutral-900/50 text-sm font-mono resize-none"
              placeholder='{"type": "document", "id": "doc-123"}'
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-neutral-300">Payload</label>
            <textarea
              value={eventData.payload}
              onChange={(e) => setEventData(prev => ({ ...prev, payload: e.target.value }))}
              className="w-full h-32 p-3 rounded-lg border border-neutral-600 bg-neutral-900/50 text-sm font-mono resize-none"
              placeholder='{"message": "hello world"}'
            />
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 max-w-xs">
            <label className="block text-sm font-medium text-neutral-300 mb-2">Action</label>
            <input
              type="text"
              value={eventData.action}
              onChange={(e) => setEventData(prev => ({ ...prev, action: e.target.value }))}
              className="w-full p-3 rounded-lg border border-neutral-600 bg-neutral-900/50 text-white"
              placeholder="created, updated, deleted..."
            />
          </div>
          
          <motion.button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-6 py-3 rounded-lg font-semibold bg-brand-600 hover:bg-brand-700 text-white disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send size={16} />
                Send Event
              </>
            )}
          </motion.button>
        </div>

        <div aria-live="polite" aria-atomic="true" className="min-h-[120px]">
          <AnimatePresence mode="wait">
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-neutral-700/50 border border-neutral-600/50 rounded-xl p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 size={18} className="text-status-ok" />
                  <h3 className="text-lg font-semibold text-white">Event Published Successfully</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-400">Event ID</label>
                    <code className="block w-full bg-neutral-800/50 px-3 py-2 rounded-lg text-sm font-mono text-white">
                      {result.event_id}
                    </code>
                  </div>

                  {result.trace_id && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-neutral-400">Trace ID</label>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 bg-neutral-800/50 px-3 py-2 rounded-lg text-sm font-mono text-white">
                          {result.trace_id}
                        </code>
                        <a
                          href={`http://localhost:16686/trace/${result.trace_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-brand-600/20 hover:bg-brand-600/30 border border-brand-500/30"
                        >
                          <ExternalLink size={14} className="text-brand-400" />
                        </a>
                      </div>
                    </div>
                  )}

                  {result.root && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-neutral-400">Merkle Root</label>
                      <code className="block w-full bg-neutral-800/50 px-3 py-2 rounded-lg text-sm font-mono text-white">
                        {result.root}
                      </code>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {errors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-status-down/10 border border-status-down/20 rounded-xl p-4"
              >
                {errors.map((error, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <AlertCircle size={18} className="text-status-down" />
                    <p className="text-status-down">{error}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

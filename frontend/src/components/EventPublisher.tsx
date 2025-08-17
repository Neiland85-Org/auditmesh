import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, CheckCircle2, ExternalLink, AlertCircle, Loader2 } from 'lucide-react'
import { postEvent, getProof, jaegerTraceLink } from '../lib/api'

interface EventResult {
  event_id: string
  trace_id?: string
  root?: string
}

export default function EventPublisher() {
  const [payload, setPayload] = useState('{"message":"hello world"}')
  const [subject, setSubject] = useState('{"type":"document","id":"doc-123"}')
  const [actor, setActor] = useState('{"id":"user:demo","type":"user"}')
  const [action, setAction] = useState('created')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<EventResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const validateJSON = (jsonString: string): boolean => {
    try {
      JSON.parse(jsonString)
      return true
    } catch {
      return false
    }
  }

  const submit = async () => {
    if (!validateJSON(payload) || !validateJSON(subject) || !validateJSON(actor)) {
      setError('Invalid JSON format in one or more fields')
      return
    }

    setSending(true)
    setError(null)
    setResult(null)

    try {
      const body = {
        payload: JSON.parse(payload || '{}'),
        subject: JSON.parse(subject || '{}'),
        actor: JSON.parse(actor || '{}'),
        action
      }

      const res = await postEvent(body)
      
      // Try to get proof if available
      let proof = null
      try {
        proof = await getProof(res.event_id)
      } catch {
        // Proof not available yet
      }

      setResult({ 
        event_id: res.event_id, 
        trace_id: res.trace_id, 
        root: proof?.root 
      })
    } catch (e: any) {
      setError(e.message || 'Error sending event')
    } finally {
      setSending(false)
    }
  }

  const isFormValid = validateJSON(payload) && validateJSON(subject) && validateJSON(actor) && action.trim()

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-neutral-100">Publish Event</h3>
        <div className="text-xs text-neutral-400 bg-neutral-800/50 px-3 py-1 rounded-lg">
          Gateway → Detector → Auditor
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm text-neutral-400 font-medium">Actor</label>
          <textarea 
            className={cn(
              "focus-ring rounded-xl border bg-neutral-950 p-3 text-sm font-mono min-h-[96px] resize-none transition-colors",
              validateJSON(actor) ? "border-neutral-700" : "border-rose-500/50"
            )}
            value={actor} 
            onChange={e => setActor(e.target.value)}
            placeholder='{"id":"user:demo","type":"user"}'
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-sm text-neutral-400 font-medium">Subject</label>
          <textarea 
            className={cn(
              "focus-ring rounded-xl border bg-neutral-950 p-3 text-sm font-mono min-h-[96px] resize-none transition-colors",
              validateJSON(subject) ? "border-neutral-700" : "border-rose-500/50"
            )}
            value={subject} 
            onChange={e => setSubject(e.target.value)}
            placeholder='{"type":"document","id":"doc-123"}'
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-sm text-neutral-400 font-medium">Payload</label>
          <textarea 
            className={cn(
              "focus-ring rounded-xl border bg-neutral-950 p-3 text-sm font-mono min-h-[96px] resize-none transition-colors",
              validateJSON(payload) ? "border-neutral-700" : "border-rose-500/50"
            )}
            value={payload} 
            onChange={e => setPayload(e.target.value)}
            placeholder='{"message":"hello world"}'
          />
        </div>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <input 
          className="focus-ring w-48 rounded-xl border border-neutral-700 bg-neutral-950 p-2 text-sm"
          value={action} 
          onChange={e => setAction(e.target.value)}
          placeholder="Action (e.g., created, updated, deleted)"
        />
        
        <motion.button 
          whileTap={{ scale: 0.98 }} 
          disabled={sending || !isFormValid}
          onClick={submit} 
          className={cn(
            "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all",
            "bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed",
            "focus-ring"
          )}
        >
          {sending ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send size={16}/> 
              Send Event
            </>
          )}
        </motion.button>
      </div>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="inline-flex items-center gap-3 rounded-xl border border-emerald-700 bg-emerald-900/30 px-4 py-3 text-emerald-300 text-sm"
          >
            <CheckCircle2 size={18} className="text-emerald-400" />
            
            <code className="font-mono bg-emerald-800/50 px-2 py-1 rounded">
              event_id={result.event_id.slice(0,8)}…
            </code>
            
            {result.trace_id && (
              <a 
                className="inline-flex items-center gap-1 underline-offset-4 hover:underline transition-colors"
                href={jaegerTraceLink(result.trace_id)} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Trace <ExternalLink size={14}/>
              </a>
            )}
            
            {typeof result.root === 'string' && (
              <span className="ml-2 opacity-80">
                root={result.root.slice(0,10)}…
              </span>
            )}
          </motion.div>
        )}
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="inline-flex items-center gap-2 text-rose-400 text-sm bg-rose-900/20 px-3 py-2 rounded-lg"
          >
            <AlertCircle size={16} />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ')

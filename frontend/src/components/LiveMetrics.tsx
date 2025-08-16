import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { getDetectorHealth, getAuditorHealth } from '../lib/api'

interface MetricRow {
  t: number
  processed: number
  consumed: number
}

export default function LiveMetrics() {
  const [data, setData] = useState<MetricRow[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true
    
    const fetchMetrics = async () => {
      try {
        const [detector, auditor] = await Promise.all([
          getDetectorHealth(),
          getAuditorHealth()
        ])
        
        const row: MetricRow = {
          t: Date.now(),
          processed: detector.processed || 0,
          consumed: auditor.consumed || 0
        }
        
        if (active) {
          setData(prev => [...prev.slice(-60), row]) // Keep last 60 data points
          setIsLoading(false)
        }
      } catch (error) {
        console.warn('Failed to fetch metrics:', error)
        if (active) setIsLoading(false)
      }
    }

    // Initial fetch
    fetchMetrics()
    
    // Poll every 2 seconds
    const interval = setInterval(fetchMetrics, 2000)
    
    return () => {
      active = false
      clearInterval(interval)
    }
  }, [])

  const chartData = useMemo(() => 
    data.map(d => ({
      time: new Date(d.t).toLocaleTimeString(),
      processed: d.processed,
      consumed: d.consumed
    })), 
    [data]
  )

  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 h-[320px] flex items-center justify-center"
      >
        <div className="text-neutral-400">Loading metrics...</div>
      </motion.div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 h-[320px]"
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-neutral-100 mb-2">Live Metrics</h3>
        <p className="text-sm text-neutral-400">
          Throughput (events per health snapshot) - Updates every 2s
        </p>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="processedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2d8fff" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#2d8fff" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="consumedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#34d399" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
            </linearGradient>
          </defs>
          
          <XAxis 
            dataKey="time" 
            hide 
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            hide 
            axisLine={false}
            tickLine={false}
          />
          
          <Tooltip 
            contentStyle={{ 
              background: '#0a0a0a', 
              border: '1px solid #27272a',
              borderRadius: '8px',
              color: '#fafafa'
            }}
            labelStyle={{ color: '#a3a3a3' }}
          />
          
          <Area 
            type="monotone" 
            dataKey="processed" 
            stroke="#2d8fff" 
            strokeWidth={2}
            fill="url(#processedGradient)"
            fillOpacity={0.8}
            name="Processed (Detector)"
          />
          
          <Area 
            type="monotone" 
            dataKey="consumed" 
            stroke="#34d399" 
            strokeWidth={2}
            fill="url(#consumedGradient)"
            fillOpacity={0.8}
            name="Consumed (Auditor)"
          />
        </AreaChart>
      </ResponsiveContainer>
      
      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-brand-500"></div>
          <span className="text-neutral-300">Processed (Detector)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span className="text-neutral-300">Consumed (Auditor)</span>
        </div>
      </div>
    </motion.div>
  )
}

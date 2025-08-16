import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface MetricData {
  time: string
  throughput: number
  latency: number
  events: number
}

export default function LiveMetrics() {
  const [metrics, setMetrics] = useState<MetricData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate real-time data
    const generateData = () => {
      const now = new Date()
      const newData: MetricData = {
        time: now.toLocaleTimeString(),
        throughput: Math.floor(Math.random() * 1000) + 100,
        latency: Math.floor(Math.random() * 50) + 10,
        events: Math.floor(Math.random() * 10000) + 1000
      }
      
      setMetrics(prev => {
        const updated = [...prev, newData]
        if (updated.length > 20) {
          return updated.slice(-20)
        }
        return updated
      })
    }

    // Initial data
    generateData()
    setIsLoading(false)

    // Update every 2 seconds
    const interval = setInterval(generateData, 2000)
    
    return () => clearInterval(interval)
  }, [])

  const currentMetrics = metrics[metrics.length - 1] || { throughput: 0, latency: 0, events: 0 }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="col-span-12 lg:col-span-4 xl:col-span-3"
    >
      <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700/50 rounded-2xl p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Live Metrics</h2>
          <p className="text-neutral-400">Real-time system performance</p>
        </div>

        {/* Current Stats */}
        <div className="grid grid-cols-1 gap-4 mb-6">
          <div className="bg-neutral-700/50 rounded-xl p-4 border border-neutral-600/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-400">Throughput</p>
                <p className="text-2xl font-bold text-white">{currentMetrics.throughput}</p>
                <p className="text-xs text-neutral-500">events/sec</p>
              </div>
              <div className="w-3 h-3 bg-status-ok rounded-full animate-pulse" />
            </div>
          </div>

          <div className="bg-neutral-700/50 rounded-xl p-4 border border-neutral-600/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-400">Latency</p>
                <p className="text-2xl font-bold text-white">{currentMetrics.latency}</p>
                <p className="text-xs text-neutral-500">ms</p>
              </div>
              <div className="w-3 h-3 bg-status-ok rounded-full animate-pulse" />
            </div>
          </div>

          <div className="bg-neutral-700/50 rounded-xl p-4 border border-neutral-600/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-400">Total Events</p>
                <p className="text-2xl font-bold text-white">{currentMetrics.events.toLocaleString()}</p>
                <p className="text-xs text-neutral-500">processed</p>
              </div>
              <div className="w-3 h-3 bg-status-ok rounded-full animate-pulse" />
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-64">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-neutral-400">Loading metrics...</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics}>
                <defs>
                  <linearGradient id="throughputGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="time" 
                  stroke="#9ca3af" 
                  fontSize={10}
                  tick={{ fill: '#9ca3af' }}
                />
                <YAxis 
                  stroke="#9ca3af" 
                  fontSize={10}
                  tick={{ fill: '#9ca3af' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#f9fafb'
                  }}
                />
                
                <Area
                  type="monotone"
                  dataKey="throughput"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  fill="url(#throughputGradient)"
                  name="Throughput"
                />
                <Area
                  type="monotone"
                  dataKey="latency"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#latencyGradient)"
                  name="Latency"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </motion.div>
  )
}

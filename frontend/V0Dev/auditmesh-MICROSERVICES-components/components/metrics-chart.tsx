"use client"

import { useMemo } from "react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { cn } from "@/lib/utils"
import type { MetricsChartProps } from "@/types/components"

const timeRangeLabels = {
  "1h": "Last Hour",
  "24h": "Last 24 Hours",
  "7d": "Last 7 Days",
  "30d": "Last 30 Days",
}

export function MetricsChart({
  series,
  title = "Metrics",
  height = 400,
  timeRange = "24h",
  onTimeRangeChange,
  showLegend = true,
  className,
}: MetricsChartProps) {
  const chartData = useMemo(() => {
    if (!series.length) return []

    // Combinar todos los timestamps únicos
    const allTimestamps = new Set<number>()
    series.forEach((s) => {
      s.data.forEach((point) => {
        allTimestamps.add(point.timestamp.getTime())
      })
    })

    // Crear datos combinados para el gráfico
    const sortedTimestamps = Array.from(allTimestamps).sort()

    return sortedTimestamps.map((timestamp) => {
      const dataPoint: any = {
        timestamp: new Date(timestamp),
        formattedTime: new Date(timestamp).toLocaleTimeString(),
      }

      series.forEach((s) => {
        const point = s.data.find((p) => p.timestamp.getTime() === timestamp)
        dataPoint[s.id] = point?.value || null
      })

      return dataPoint
    })
  }, [series])

  const chartConfig = useMemo(() => {
    const config: any = {}
    series.forEach((s, index) => {
      config[s.id] = {
        label: s.name,
        color: s.color || `hsl(var(--chart-${(index % 5) + 1}))`,
      }
    })
    return config
  }, [series])

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        {onTimeRangeChange && (
          <div className="flex gap-1">
            {Object.entries(timeRangeLabels).map(([value, label]) => (
              <Button
                key={value}
                variant={timeRange === value ? "default" : "outline"}
                size="sm"
                onClick={() => onTimeRangeChange(value)}
              >
                {label}
              </Button>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className={`h-[${height}px]`}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="formattedTime" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 12 }} />
              <ChartTooltip content={<ChartTooltipContent />} labelFormatter={(value) => `Time: ${value}`} />
              {showLegend && <Legend />}
              {series.map((s) => (
                <Line
                  key={s.id}
                  type="monotone"
                  dataKey={s.id}
                  stroke={`var(--color-${s.id})`}
                  name={s.name}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  connectNulls={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        {series.length > 0 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {series.map((s) => {
              const latestValue = s.data[s.data.length - 1]?.value
              return (
                <div key={s.id} className="text-center">
                  <div className="text-2xl font-bold">
                    {latestValue?.toFixed(2) || "N/A"}
                    {s.unit && <span className="text-sm text-muted-foreground ml-1">{s.unit}</span>}
                  </div>
                  <div className="text-sm text-muted-foreground">{s.name}</div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

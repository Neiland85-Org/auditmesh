"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { NetworkTopology, LayoutSectionProps } from "@/types/auditmesh"
import { Network, Zap, Database, MessageSquare, HardDrive } from "lucide-react"

interface NetworkTopologySectionProps extends LayoutSectionProps {
  data: NetworkTopology
  selectedService?: string | null
}

export default function NetworkTopologySection({
  data,
  selectedService,
  onDataUpdate,
  className = "",
}: NetworkTopologySectionProps) {
  const [highlightedConnection, setHighlightedConnection] = useState<string | null>(null)

  const getConnectionIcon = (type: string) => {
    switch (type) {
      case "api":
        return <Zap className="w-3 h-3" />
      case "database":
        return <Database className="w-3 h-3" />
      case "message_queue":
        return <MessageSquare className="w-3 h-3" />
      case "cache":
        return <HardDrive className="w-3 h-3" />
      default:
        return <Network className="w-3 h-3" />
    }
  }

  const getConnectionColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "inactive":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
      case "error":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
    }
  }

  const filteredConnections = selectedService
    ? data.connections.filter((conn) => conn.from === selectedService || conn.to === selectedService)
    : data.connections

  return (
    <Card className={`bg-card/90 backdrop-blur-sm border-border/50 w-96 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Network className="w-5 h-5" />
          Network Topology
          {selectedService && (
            <Badge variant="outline" className="ml-2">
              {data.services.find((s) => s.id === selectedService)?.name}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {filteredConnections.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              <Network className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No connections found</p>
            </div>
          ) : (
            filteredConnections.map((connection) => (
              <div
                key={`${connection.from}-${connection.to}`}
                className={`p-3 rounded-lg border transition-all cursor-pointer hover:bg-muted/50 ${
                  highlightedConnection === `${connection.from}-${connection.to}`
                    ? "border-primary bg-primary/10"
                    : "border-border/30"
                }`}
                onClick={() =>
                  setHighlightedConnection(
                    highlightedConnection === `${connection.from}-${connection.to}`
                      ? null
                      : `${connection.from}-${connection.to}`,
                  )
                }
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getConnectionIcon(connection.type)}
                    <span className="text-sm font-medium">{connection.type}</span>
                  </div>
                  <Badge className={getConnectionColor(connection.status)}>{connection.status}</Badge>
                </div>

                <div className="text-xs text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>
                      {data.services.find((s) => s.id === connection.from)?.name} →{" "}
                      {data.services.find((s) => s.id === connection.to)?.name}
                    </span>
                    {connection.latency && <span className="font-mono">{connection.latency}ms</span>}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-border/30">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Total Connections: {data.connections.length}</span>
            <span>Active: {data.connections.filter((c) => c.status === "active").length}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

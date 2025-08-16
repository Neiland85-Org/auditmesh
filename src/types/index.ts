// Event types for AuditMesh
export interface AuditEvent {
  actor: string;
  subject: string;
  payload: Record<string, any>;
  action: string;
  timestamp?: string;
  event_id?: string;
  trace_id?: string;
  merkle_root?: string;
}

// Service status types
export interface ServiceStatus {
  name: string;
  status: 'online' | 'offline' | 'warning';
  uptime: number;
  lastSeen: string;
  metrics: {
    processed: number;
    errors: number;
    latency: number;
  };
}

// Live metrics data
export interface LiveMetrics {
  timestamp: string;
  detector: {
    processed: number;
    consumed: number;
  };
  auditor: {
    processed: number;
    consumed: number;
  };
  gateway: {
    requests: number;
    responses: number;
  };
}

// Service card data
export interface ServiceCard {
  id: string;
  name: string;
  description: string;
  status: ServiceStatus['status'];
  color: 'gateway' | 'detector' | 'auditor';
  icon: string;
  metrics: {
    current: number;
    total: number;
    unit: string;
  };
}

// Theme configuration
export interface ThemeConfig {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
}

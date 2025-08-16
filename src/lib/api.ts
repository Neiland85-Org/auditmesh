import { AuditEvent } from '@/types';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// API endpoints
const ENDPOINTS = {
  events: `${API_BASE_URL}/events`,
  metrics: `${API_BASE_URL}/metrics`,
  services: `${API_BASE_URL}/services`,
  health: `${API_BASE_URL}/health`,
} as const;

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

// Event API functions
export const eventAPI = {
  // Send a new audit event
  async publishEvent(event: Omit<AuditEvent, 'event_id' | 'timestamp'>): Promise<AuditEvent> {
    return apiRequest<AuditEvent>(ENDPOINTS.events, {
      method: 'POST',
      body: JSON.stringify({
        ...event,
        timestamp: new Date().toISOString(),
      }),
    });
  },

  // Get recent events
  async getRecentEvents(limit: number = 100): Promise<AuditEvent[]> {
    return apiRequest<AuditEvent[]>(`${ENDPOINTS.events}?limit=${limit}`);
  },

  // Get event by ID
  async getEventById(eventId: string): Promise<AuditEvent> {
    return apiRequest<AuditEvent>(`${ENDPOINTS.events}/${eventId}`);
  },
};

// Metrics API functions
export const metricsAPI = {
  // Get live metrics
  async getLiveMetrics(): Promise<any> {
    return apiRequest(ENDPOINTS.metrics);
  },

  // Get metrics history
  async getMetricsHistory(
    startTime: string,
    endTime: string,
    interval: string = '1m'
  ): Promise<any> {
    return apiRequest(
      `${ENDPOINTS.metrics}/history?start=${startTime}&end=${endTime}&interval=${interval}`
    );
  },
};

// Services API functions
export const servicesAPI = {
  // Get all services status
  async getServicesStatus(): Promise<any> {
    return apiRequest(ENDPOINTS.services);
  },

  // Get specific service status
  async getServiceStatus(serviceName: string): Promise<any> {
    return apiRequest(`${ENDPOINTS.services}/${serviceName}`);
  },

  // Health check
  async healthCheck(): Promise<any> {
    return apiRequest(ENDPOINTS.health);
  },
};

// WebSocket connection for real-time updates
export class MetricsWebSocket {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor(private url: string, private onMessage: (data: any) => void) {}

  connect() {
    try {
      this.ws = new WebSocket(this.url);
      
      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.onMessage(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      
      setTimeout(() => {
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.connect();
      }, delay);
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  send(data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }
}

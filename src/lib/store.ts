import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LiveMetrics, ServiceStatus, AuditEvent } from '@/types';

interface AppState {
  // Theme
  isDarkMode: boolean;
  toggleTheme: () => void;
  
  // Services
  services: ServiceStatus[];
  updateServiceStatus: (service: ServiceStatus) => void;
  
  // Metrics
  metrics: LiveMetrics[];
  addMetric: (metric: LiveMetrics) => void;
  clearMetrics: () => void;
  
  // Events
  events: AuditEvent[];
  addEvent: (event: AuditEvent) => void;
  clearEvents: () => void;
  
  // UI State
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Theme
      isDarkMode: true,
      toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      
      // Services
      services: [
        {
          name: 'Gateway',
          status: 'online',
          uptime: 99.9,
          lastSeen: new Date().toISOString(),
          metrics: { processed: 0, errors: 0, latency: 45 }
        },
        {
          name: 'Detector',
          status: 'online',
          uptime: 99.8,
          lastSeen: new Date().toISOString(),
          metrics: { processed: 0, errors: 0, latency: 120 }
        },
        {
          name: 'Auditor',
          status: 'online',
          uptime: 99.7,
          lastSeen: new Date().toISOString(),
          metrics: { processed: 0, errors: 0, latency: 200 }
        }
      ],
      updateServiceStatus: (service) => set((state) => ({
        services: state.services.map(s => 
          s.name === service.name ? service : s
        )
      })),
      
      // Metrics
      metrics: [],
      addMetric: (metric) => set((state) => ({
        metrics: [...state.metrics.slice(-50), metric] // Keep last 50
      })),
      clearMetrics: () => set({ metrics: [] }),
      
      // Events
      events: [],
      addEvent: (event) => set((state) => ({
        events: [event, ...state.events.slice(0, 99)] // Keep last 100
      })),
      clearEvents: () => set({ events: [] }),
      
      // UI State
      isLoading: false,
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'auditmesh-storage',
      partialize: (state) => ({ 
        isDarkMode: state.isDarkMode,
        services: state.services 
      }),
    }
  )
);

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility function for merging Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format timestamp to readable format
export function formatTimestamp(timestamp: string): string {
  return new Date(timestamp).toLocaleString();
}

// Format uptime percentage
export function formatUptime(uptime: number): string {
  return `${uptime.toFixed(2)}%`;
}

// Format latency in milliseconds
export function formatLatency(latency: number): string {
  if (latency < 1000) {
    return `${latency}ms`;
  }
  return `${(latency / 1000).toFixed(2)}s`;
}

// Get status color for service cards
export function getStatusColor(status: 'online' | 'offline' | 'warning'): string {
  switch (status) {
    case 'online':
      return 'text-green-500';
    case 'offline':
      return 'text-red-500';
    case 'warning':
      return 'text-yellow-500';
    default:
      return 'text-gray-500';
  }
}

// Get service color for cards
export function getServiceColor(color: 'gateway' | 'detector' | 'auditor'): string {
  switch (color) {
    case 'gateway':
      return 'from-gateway-500 to-gateway-600';
    case 'detector':
      return 'from-detector-500 to-detector-600';
    case 'auditor':
      return 'from-auditor-500 to-auditor-600';
    default:
      return 'from-primary-500 to-primary-600';
  }
}

// Generate random metrics for demo
export function generateRandomMetrics() {
  return {
    detector: {
      processed: Math.floor(Math.random() * 1000) + 100,
      consumed: Math.floor(Math.random() * 1000) + 100,
    },
    auditor: {
      processed: Math.floor(Math.random() * 500) + 50,
      consumed: Math.floor(Math.random() * 500) + 50,
    },
    gateway: {
      requests: Math.floor(Math.random() * 2000) + 200,
      responses: Math.floor(Math.random() * 2000) + 200,
    },
  };
}

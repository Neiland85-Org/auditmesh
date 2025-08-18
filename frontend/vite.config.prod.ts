import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Optimizaciones de producción
    target: 'es2020',
    minify: 'esbuild', // Cambiado de terser a esbuild
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['framer-motion', 'lucide-react'],
          charts: ['recharts'],
          utils: ['zustand', 'clsx']
        }
      }
    }
  },
  // Configuración del servidor de preview (para testing de producción)
  preview: {
    port: 4173,
    headers: {
      // Headers de Seguridad Críticos
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      
      // Content Security Policy Estricto
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https:",
        "font-src 'self'",
        "connect-src 'self' https:",
        "frame-src 'none'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "upgrade-insecure-requests"
      ].join('; '),
      
      // Headers de Privacidad
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Resource-Policy': 'same-origin',
      
      // Headers de Rendimiento
      'Cache-Control': 'public, max-age=31536000, immutable',
      'ETag': 'W/"etag"',
      'Vary': 'Accept-Encoding'
    }
  }
})

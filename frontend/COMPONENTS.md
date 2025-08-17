# AuditMesh Frontend Components

## Overview
Componentes React autónomos, tipados y accesibles para la consola forensic de AuditMesh.

## Design Principles
- **Forensic Identity**: Azules fríos, precisión visual
- **Calm-Tech**: Claridad > Ornamentación
- **Accessibility**: WCAG AA mínimo, contraste ≥ 4.5:1
- **Performance**: < 120KB JS inicial, < 2s FCP

## Core Components

### AppShell
**Purpose**: Contenedor principal con background y layout
**Props**: `children: ReactNode`
**Features**:
- Background gradiente sutil (slate-950 → slate-900)
- Orbes flotantes minimalistas
- Grid pattern forensic
- Fade inferior sutil

### Navbar
**Purpose**: Navegación principal con glassmorphism
**Features**:
- Logo AuditMesh con gradiente brand
- Enlaces a servicios externos (Redpanda, Jaeger, MinIO)
- Toggle modo oscuro
- Indicador "Live" con badge

### ServiceCard
**Purpose**: Tarjeta de estado de servicio con efectos 3D
**Props**:
- `name: string` - Nombre del servicio
- `status: 'ok' | 'down' | 'warning' | 'unknown'`
- `subtitle?: string` - Subtítulo del servicio
- `kpi?: string` - Indicador clave de rendimiento
- `onClick?: () => void` - Función de click

**Features**:
- Hover 3D sutil (y: -4, rotateX: 2)
- Partículas flotantes minimalistas
- Barra de estado animada
- Glow adaptativo por estado

### EventPublisher
**Purpose**: Formulario para publicar eventos JSON
**Features**:
- Validación JSON en cliente
- Campos: actor, subject, payload, action
- Feedback visual: event_id, trace_id, Merkle root
- Integración con Jaeger

### LiveMetrics
**Purpose**: Gráficas de métricas en tiempo real
**Features**:
- Polling cada 2s desde /health endpoints
- Gráficas de área con Recharts
- Series temporales con degradados
- Responsive total

## UI Components

### LoadingSpinner
**Purpose**: Indicador de carga accesible
**Props**: `size?: 'sm' | 'md' | 'lg'`

### EmptyState
**Purpose**: Estado vacío con icono y descripción
**Props**: `icon`, `title`, `description`, `action?`

## Accessibility Features
- **Focus Visible**: Outline 2px con ring color
- **ARIA Labels**: Roles y estados apropiados
- **High Contrast**: Soporte para modo alto contraste
- **Keyboard Navigation**: Navegación completa por teclado

## Performance Optimizations
- **Code Splitting**: Chunks manuales por funcionalidad
- **Tree Shaking**: Eliminación de código no utilizado
- **Lazy Loading**: Carga diferida de componentes pesados
- **Bundle Analysis**: Monitoreo de tamaño de chunks

## Usage Examples

```tsx
// ServiceCard básico
<ServiceCard 
  name="Gateway" 
  status="ok" 
  subtitle="ms-gateway"
  kpi="API Gateway Service"
/>

// Con click handler
<ServiceCard 
  name="Detector" 
  status="warning" 
  onClick={() => handleServiceClick('detector')}
/>

// Loading state
<LoadingSpinner size="lg" className="text-brand-400" />

// Empty state
<EmptyState 
  icon={Database}
  title="No hay datos"
  description="No se encontraron métricas para mostrar"
  action={<button>Recargar</button>}
/>
```

## Testing Strategy
- **Unit Tests**: Lógica de componentes
- **Visual Tests**: Smoke tests para regresiones
- **Accessibility Tests**: Validación WCAG
- **Performance Tests**: Lighthouse CI

## Future Enhancements
- [ ] Componente de notificaciones toast
- [ ] Modal de confirmación
- [ ] Tooltip contextual
- [ ] Skeleton loaders
- [ ] Error boundaries

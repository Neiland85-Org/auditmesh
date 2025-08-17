# 📦 V0Dev - Dependencias Requeridas

## 📋 **Resumen**
Este documento lista todas las dependencias necesarias para que los componentes V0Dev migrados funcionen correctamente.

---

## 🚀 **Dependencias Principales**

### **React y Next.js**
```json
{
  "react": "^18.0.0",
  "react-dom": "^18.0.0",
  "next": "^14.0.0"
}
```

### **UI Components y Styling**
```json
{
  "@radix-ui/react-slot": "^1.0.0",
  "@radix-ui/react-label": "^2.0.0",
  "@radix-ui/react-select": "^2.0.0",
  "class-variance-authority": "^0.7.0",
  "clsx": "^2.0.0",
  "tailwind-merge": "^2.0.0"
}
```

### **Charts y Visualización**
```json
{
  "recharts": "^2.8.0"
}
```

### **Iconos**
```json
{
  "lucide-react": "^0.294.0"
}
```

---

## 🔧 **Instalación de Dependencias**

### **Comando de Instalación**
```bash
npm install @radix-ui/react-slot @radix-ui/react-label @radix-ui/react-select class-variance-authority clsx tailwind-merge recharts lucide-react
```

### **Dependencias de Desarrollo**
```bash
npm install -D @types/react @types/react-dom
```

---

## 📁 **Estructura de Archivos Requerida**

### **Utils (lib/utils.ts)**
```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### **CSS Variables (globals.css)**
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96%;
  --secondary-foreground: 222.2 84% 4.9%;
  --muted: 210 40% 96%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96%;
  --accent-foreground: 222.2 84% 4.9%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
  --chart-1: 12 76% 61%;
  --chart-2: 173 58% 39%;
  --chart-3: 197 37% 24%;
  --chart-4: 43 74% 66%;
  --chart-5: 27 87% 67%;
}
```

---

## ⚠️ **Conflictos Potenciales**

### **Versiones de React**
- Asegúrate de que todas las dependencias sean compatibles con React 18+
- Evita versiones duplicadas de React

### **Tailwind CSS**
- Los componentes usan clases de Tailwind CSS
- Asegúrate de que Tailwind esté configurado correctamente

### **TypeScript**
- Todos los componentes están escritos en TypeScript
- Configura `tsconfig.json` para incluir los directorios V0Dev

---

## 🧪 **Testing de Dependencias**

### **Verificación de Instalación**
```bash
# Verificar que las dependencias estén instaladas
npm list @radix-ui/react-slot
npm list recharts
npm list lucide-react
```

### **Test de Importación**
```typescript
// Test básico de importación
import { ServiceStatusIndicator } from "@/components/v0dev"
import { Badge } from "@/components/v0dev/ui"
import type { ServiceStatus } from "@/types/v0dev"

// Si no hay errores, las dependencias están correctamente configuradas
```

---

## 📚 **Recursos Adicionales**

### **Documentación Oficial**
- [Radix UI](https://www.radix-ui.com/)
- [Recharts](https://recharts.org/)
- [Lucide Icons](https://lucide.dev/)
- [Class Variance Authority](https://cva.style/docs)

### **Ejemplos de Uso**
- Revisa el componente `V0DevDemo.tsx` para ejemplos completos
- Consulta la documentación de cada componente individual

---

## 🚧 **Solución de Problemas**

### **Error: Cannot resolve module**
1. Verifica que las dependencias estén instaladas
2. Revisa la configuración de TypeScript
3. Asegúrate de que los paths estén correctamente configurados

### **Error: Component not found**
1. Verifica las exportaciones en `index.ts`
2. Revisa la estructura de directorios
3. Asegúrate de que los imports sean correctos

### **Error: CSS not loading**
1. Verifica la configuración de Tailwind CSS
2. Asegúrate de que `globals.css` esté importado
3. Revisa que las variables CSS estén definidas

---

*Última actualización: $(date)*

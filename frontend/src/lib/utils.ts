import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Función utilitaria para combinar clases CSS de manera eficiente
 * Combina clsx para la lógica condicional y tailwind-merge para optimizar clases de Tailwind
 * 
 * @param inputs - Clases CSS a combinar
 * @returns String con las clases CSS optimizadas
 * 
 * @example
 * cn("px-2 py-1", "bg-red-500", "hover:bg-red-600")
 * // Resultado: "px-2 py-1 bg-red-500 hover:bg-red-600"
 * 
 * @example
 * cn("px-2", "px-4") // tailwind-merge optimiza px-2 px-4 a px-4
 * // Resultado: "px-4"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Función utilitaria para crear variantes de componentes
 * Útil para crear sistemas de diseño consistentes
 * 
 * @param base - Clases base del componente
 * @param variants - Objeto con variantes y sus clases correspondientes
 * @param defaultVariants - Variantes por defecto
 * @returns Función que genera clases basadas en las variantes
 * 
 * @example
 * const buttonVariants = createVariants(
 *   "px-4 py-2 rounded-md font-medium",
 *   {
 *     variant: {
 *       default: "bg-blue-500 text-white hover:bg-blue-600",
 *       outline: "border border-blue-500 text-blue-500 hover:bg-blue-50"
 *     },
 *     size: {
 *       sm: "px-3 py-1 text-sm",
 *       lg: "px-6 py-3 text-lg"
 *     }
 *   },
 *   {
 *     variant: "default",
 *     size: "sm"
 *   }
 * )
 */
export function createVariants<T extends Record<string, Record<string, string>>>(
  base: string,
  variants: T,
  defaultVariants?: Partial<Record<keyof T, keyof T[keyof T]>>
) {
  return (props: Partial<Record<keyof T, keyof T[keyof T]>> = {}) => {
    const finalProps = { ...defaultVariants, ...props }
    const variantClasses = Object.entries(finalProps)
      .map(([key, value]) => variants[key]?.[value as string])
      .filter(Boolean)
    
    return cn(base, ...variantClasses)
  }
}

/**
 * Función utilitaria para generar IDs únicos
 * Útil para componentes que necesitan IDs únicos
 * 
 * @param prefix - Prefijo para el ID
 * @returns ID único con el prefijo especificado
 * 
 * @example
 * generateId("button") // Resultado: "button-12345"
 */
export function generateId(prefix: string = "component"): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Función utilitaria para formatear fechas
 * Formatea fechas de manera consistente en toda la aplicación
 * 
 * @param date - Fecha a formatear
 * @param options - Opciones de formato
 * @returns String con la fecha formateada
 * 
 * @example
 * formatDate(new Date()) // Resultado: "2024-01-15 14:30:00"
 * formatDate(new Date(), { dateStyle: "short" }) // Resultado: "1/15/24"
 */
export function formatDate(
  date: Date,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }
): string {
  return new Intl.DateTimeFormat("es-ES", options).format(date)
}

/**
 * Función utilitaria para formatear números
 * Formatea números de manera consistente en toda la aplicación
 * 
 * @param value - Número a formatear
 * @param options - Opciones de formato
 * @returns String con el número formateado
 * 
 * @example
 * formatNumber(1234.56) // Resultado: "1.234,56"
 * formatNumber(1234.56, { style: "currency", currency: "EUR" }) // Resultado: "1.234,56 €"
 */
export function formatNumber(
  value: number,
  options: Intl.NumberFormatOptions = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }
): string {
  return new Intl.NumberFormat("es-ES", options).format(value)
}

/**
 * Función utilitaria para validar emails
 * Valida el formato de email de manera simple
 * 
 * @param email - Email a validar
 * @returns Boolean indicando si el email es válido
 * 
 * @example
 * isValidEmail("user@example.com") // Resultado: true
 * isValidEmail("invalid-email") // Resultado: false
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Función utilitaria para debounce
 * Retrasa la ejecución de una función hasta que no se llame por un tiempo
 * 
 * @param func - Función a ejecutar
 * @param wait - Tiempo de espera en milisegundos
 * @returns Función con debounce aplicado
 * 
 * @example
 * const debouncedSearch = debounce(searchFunction, 300)
 * debouncedSearch("query") // Solo se ejecuta después de 300ms sin llamadas
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Función utilitaria para throttle
 * Limita la frecuencia de ejecución de una función
 * 
 * @param func - Función a ejecutar
 * @param limit - Límite de tiempo en milisegundos
 * @returns Función con throttle aplicado
 * 
 * @example
 * const throttledScroll = throttle(scrollHandler, 100)
 * throttledScroll() // Solo se ejecuta cada 100ms máximo
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

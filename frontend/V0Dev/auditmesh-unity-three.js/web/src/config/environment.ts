// Environment configuration management
interface EnvironmentConfig {
  apiBase: string
  apiTimeout: number
  appName: string
  appVersion: string
  nodeEnv: string
  features: {
    enable3DVisualization: boolean
    enableRealTimeUpdates: boolean
    enableDebugMode: boolean
  }
  auth: {
    enabled: boolean
    provider: string
    redirectUrl: string
  }
}

const getEnvironmentConfig = (): EnvironmentConfig => {
  return {
    apiBase: import.meta.env.VITE_API_BASE || "http://localhost:3000",
    apiTimeout: Number.parseInt(import.meta.env.VITE_API_TIMEOUT || "10000"),
    appName: import.meta.env.VITE_APP_NAME || "AuditMesh",
    appVersion: import.meta.env.VITE_APP_VERSION || "1.0.0",
    nodeEnv: import.meta.env.VITE_NODE_ENV || "development",
    features: {
      enable3DVisualization: import.meta.env.VITE_ENABLE_3D_VISUALIZATION === "true",
      enableRealTimeUpdates: import.meta.env.VITE_ENABLE_REAL_TIME_UPDATES === "true",
      enableDebugMode: import.meta.env.VITE_ENABLE_DEBUG_MODE === "true",
    },
    auth: {
      enabled: import.meta.env.VITE_AUTH_ENABLED === "true",
      provider: import.meta.env.VITE_AUTH_PROVIDER || "local",
      redirectUrl: import.meta.env.VITE_AUTH_REDIRECT_URL || window.location.origin + "/auth/callback",
    },
  }
}

export const config = getEnvironmentConfig()

// Environment validation
export const validateEnvironment = (): void => {
  const requiredVars = ["VITE_API_BASE", "VITE_APP_NAME", "VITE_APP_VERSION"]

  const missingVars = requiredVars.filter((varName) => !import.meta.env[varName])

  if (missingVars.length > 0) {
    console.error("Missing required environment variables:", missingVars)
    if (config.nodeEnv === "production") {
      throw new Error(`Missing required environment variables: ${missingVars.join(", ")}`)
    }
  }

  // Validate API base URL format
  try {
    new URL(config.apiBase)
  } catch (error) {
    console.error("Invalid API base URL:", config.apiBase)
    if (config.nodeEnv === "production") {
      throw new Error("Invalid API base URL format")
    }
  }
}

// Initialize validation on import
validateEnvironment()

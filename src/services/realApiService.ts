// Servicios API Reales - Sin Mockups
import { googleService, openaiService, type GoogleReview } from './apiService'

export interface BackendConfig {
  REDIS_URL: string
  FLASK_HOST: string
  FLASK_PORT: number
  CELERY_BROKER_URL: string
}

export interface CeleryTask {
  task_id: string
  status: 'PENDING' | 'STARTED' | 'SUCCESS' | 'FAILURE' | 'RETRY' | 'REVOKED'
  result: any
  traceback?: string
  created_at: string
  updated_at: string
}

export interface ScheduledResponse {
  id: string
  review_id: string
  response_text: string
  scheduled_time: string
  status: 'pending' | 'sent' | 'failed'
  platform: 'google' | 'facebook' | 'yelp'
}

// Servicio para el Backend Flask/Python
export class FlaskBackendService {
  private baseUrl: string
  
  constructor() {
    this.baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
  }

  // Verificar conexión con el backend
  async checkConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`)
      return response.ok
    } catch {
      return false
    }
  }

  // Obtener configuración del backend
  async getBackendConfig(): Promise<BackendConfig> {
    const response = await fetch(`${this.baseUrl}/api/config`)
    if (!response.ok) {
      throw new Error('Backend no disponible')
    }
    return response.json()
  }

  // Sincronizar reseñas con el backend
  async syncReviews(reviews: GoogleReview[]): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/reviews/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reviews })
    })

    if (!response.ok) {
      throw new Error('Error al sincronizar reseñas con el backend')
    }
  }

  // Obtener tareas de Celery
  async getCeleryTasks(): Promise<CeleryTask[]> {
    const response = await fetch(`${this.baseUrl}/api/celery/tasks`)
    if (!response.ok) {
      throw new Error('Error al obtener tareas de Celery')
    }
    return response.json()
  }

  // Programar respuesta automática
  async scheduleResponse(reviewId: string, responseText: string, scheduledTime: Date): Promise<string> {
    const response = await fetch(`${this.baseUrl}/api/responses/schedule`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        review_id: reviewId,
        response_text: responseText,
        scheduled_time: scheduledTime.toISOString()
      })
    })

    if (!response.ok) {
      throw new Error('Error al programar respuesta')
    }

    const result = await response.json()
    return result.task_id
  }

  // Obtener respuestas programadas
  async getScheduledResponses(): Promise<ScheduledResponse[]> {
    const response = await fetch(`${this.baseUrl}/api/responses/scheduled`)
    if (!response.ok) {
      throw new Error('Error al obtener respuestas programadas')
    }
    return response.json()
  }

  // Enviar respuesta directamente a Google
  async sendResponseToGoogle(reviewId: string, responseText: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/reviews/${reviewId}/respond`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        response: responseText
      })
    })

    if (!response.ok) {
      throw new Error('Error al enviar respuesta a Google')
    }
  }
}

// Servicio para OAuth con manejo completo
export class OAuthService {
  private readonly STORAGE_KEY = 'google_oauth_state'

  // Iniciar OAuth con estado y validación
  async initiateOAuth(): Promise<string> {
    const state = this.generateState()
    localStorage.setItem(this.STORAGE_KEY, state)

    const params = new URLSearchParams({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
      redirect_uri: `${window.location.origin}/auth/callback`,
      response_type: 'code',
      scope: [
        'https://www.googleapis.com/auth/business.manage',
        'https://www.googleapis.com/auth/business.readonly'
      ].join(' '),
      access_type: 'offline',
      prompt: 'consent',
      state
    })

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  }

  // Procesar callback de OAuth
  async handleOAuthCallback(code: string, state: string): Promise<string> {
    const storedState = localStorage.getItem(this.STORAGE_KEY)
    if (state !== storedState) {
      throw new Error('Estado OAuth inválido - posible ataque CSRF')
    }

    localStorage.removeItem(this.STORAGE_KEY)

    // Intercambiar código por token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
        client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET || '',
        code,
        grant_type: 'authorization_code',
        redirect_uri: `${window.location.origin}/auth/callback`
      })
    })

    if (!tokenResponse.ok) {
      const error = await tokenResponse.json()
      throw new Error(`Error de OAuth: ${error.error_description || error.error}`)
    }

    const tokens = await tokenResponse.json()
    
    // Guardar tokens de forma segura
    if (tokens.access_token) {
      googleService.setAccessToken(tokens.access_token)
    }

    if (tokens.refresh_token) {
      localStorage.setItem('google_refresh_token', tokens.refresh_token)
    }

    return tokens.access_token
  }

  // Renovar token usando refresh token
  async refreshAccessToken(): Promise<string> {
    const refreshToken = localStorage.getItem('google_refresh_token')
    if (!refreshToken) {
      throw new Error('No hay refresh token disponible')
    }

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
        client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET || '',
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
      })
    })

    if (!response.ok) {
      throw new Error('Error al renovar token de acceso')
    }

    const tokens = await response.json()
    googleService.setAccessToken(tokens.access_token)
    return tokens.access_token
  }

  private generateState(): string {
    const array = new Uint32Array(4)
    crypto.getRandomValues(array)
    return Array.from(array, dec => dec.toString(16)).join('')
  }
}

// Servicio de Analytics y Métricas
export class AnalyticsService {
  private flaskService: FlaskBackendService

  constructor() {
    this.flaskService = new FlaskBackendService()
  }

  // Análisis de sentimientos de reseñas
  async analyzeSentiment(reviews: GoogleReview[]): Promise<{
    positive: number
    negative: number
    neutral: number
    trends: Array<{ date: string; sentiment: number }>
  }> {
    const response = await fetch(`${this.flaskService['baseUrl']}/api/analytics/sentiment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reviews })
    })

    if (!response.ok) {
      throw new Error('Error al analizar sentimientos')
    }

    return response.json()
  }

  // Métricas de rendimiento de respuestas
  async getResponseMetrics(): Promise<{
    total_responses: number
    avg_response_time: number
    response_rate: number
    improvement_trends: Array<{ month: string; score: number }>
  }> {
    const response = await fetch(`${this.flaskService['baseUrl']}/api/analytics/responses`)
    if (!response.ok) {
      throw new Error('Error al obtener métricas de respuestas')
    }
    return response.json()
  }

  // Análisis de palabras clave
  async getKeywordAnalysis(reviews: GoogleReview[]): Promise<{
    positive_keywords: Array<{ word: string; frequency: number }>
    negative_keywords: Array<{ word: string; frequency: number }>
    trending_topics: Array<{ topic: string; mentions: number }>
  }> {
    const response = await fetch(`${this.flaskService['baseUrl']}/api/analytics/keywords`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reviews })
    })

    if (!response.ok) {
      throw new Error('Error al analizar palabras clave')
    }

    return response.json()
  }
}

// Servicio de Configuración Unificada
export class ConfigurationService {
  // Verificar configuración completa del sistema
  static getSystemStatus() {
    const google = googleService.getConfigurationStatus()
    const openai = openaiService.getConfigurationStatus()
    
    const hasBackendUrl = !!import.meta.env.VITE_BACKEND_URL
    const hasRedisConfig = !!import.meta.env.VITE_REDIS_URL
    
    return {
      frontend: {
        configured: true,
        version: '2.0.0',
        build_tool: 'Vite',
        framework: 'React + TypeScript'
      },
      apis: {
        google,
        openai,
        isFullyConfigured: google.isFullyConfigured && openai.isConfigured
      },
      backend: {
        hasUrl: hasBackendUrl,
        hasRedis: hasRedisConfig,
        isConfigured: hasBackendUrl && hasRedisConfig
      },
      features: {
        real_time_reviews: google.isFullyConfigured,
        ai_responses: openai.isConfigured,
        scheduled_responses: hasBackendUrl && hasRedisConfig,
        analytics: hasBackendUrl,
        oauth_flow: google.hasClientId && google.hasClientSecret
      },
      missingConfiguration: [
        ...(!google.hasApiKey ? ['VITE_GOOGLE_API_KEY'] : []),
        ...(!google.hasClientId ? ['VITE_GOOGLE_CLIENT_ID'] : []),
        ...(!google.hasClientSecret ? ['VITE_GOOGLE_CLIENT_SECRET'] : []),
        ...(!openai.hasApiKey ? ['VITE_OPENAI_API_KEY'] : []),
        ...(!hasBackendUrl ? ['VITE_BACKEND_URL'] : []),
        ...(!hasRedisConfig ? ['VITE_REDIS_URL'] : [])
      ]
    }
  }

  // Configuración guiada paso a paso
  static getSetupSteps() {
    const status = this.getSystemStatus()
    
    return [
      {
        title: 'Configurar Google My Business API',
        completed: status.apis.google.isFullyConfigured,
        steps: [
          {
            text: 'Obtener API Key de Google Cloud Console',
            completed: status.apis.google.hasApiKey,
            url: 'https://console.cloud.google.com/apis/credentials'
          },
          {
            text: 'Configurar OAuth 2.0 Client ID',
            completed: status.apis.google.hasClientId,
            url: 'https://console.cloud.google.com/apis/credentials'
          },
          {
            text: 'Completar autenticación OAuth',
            completed: status.apis.google.hasAccessToken
          }
        ]
      },
      {
        title: 'Configurar OpenAI API',
        completed: status.apis.openai.isConfigured,
        steps: [
          {
            text: 'Obtener API Key de OpenAI',
            completed: status.apis.openai.hasApiKey,
            url: 'https://platform.openai.com/api-keys'
          }
        ]
      },
      {
        title: 'Configurar Backend (Opcional)',
        completed: status.backend.isConfigured,
        steps: [
          {
            text: 'Configurar URL del servidor Flask',
            completed: status.backend.hasUrl
          },
          {
            text: 'Configurar Redis para Celery',
            completed: status.backend.hasRedis
          }
        ]
      }
    ]
  }
}

// Exportar instancias de servicios
export const flaskBackend = new FlaskBackendService()
export const oauthService = new OAuthService()
export const analyticsService = new AnalyticsService()

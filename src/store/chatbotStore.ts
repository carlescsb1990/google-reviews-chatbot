import { create } from 'zustand'
import { googleService, openaiService, type GoogleReview } from '../services/apiService'
import { flaskBackend, ConfigurationService } from '../services/realApiService'

export interface Review {
  id: string
  reviewer: string
  rating: number
  text: string
  date: string
  originalData?: GoogleReview // Datos originales de Google
}

export interface AIResponse {
  response: string
  status: 'ai_generated' | 'mock' | 'error'
  timestamp: string
  note?: string
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export interface ConfigurationStatus {
  google: {
    hasApiKey: boolean
    hasClientId: boolean
    hasClientSecret: boolean
    hasAccessToken: boolean
    isFullyConfigured: boolean
  }
  openai: {
    hasApiKey: boolean
    isConfigured: boolean
  }
  missingSteps: string[]
}

interface ChatbotState {
  // Estado de la aplicación
  loading: boolean
  error: string | null

  // Reseñas
  reviews: Review[]
  isUsingRealData: boolean

  // Configuración
  config: ConfigurationStatus
  
  // Acciones
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setReviews: (reviews: Review[]) => void
  refreshConfig: () => void
  generateResponse: (userInput: string, useRealAPI?: boolean) => Promise<AIResponse>
  fetchReviews: (useRealAPI?: boolean) => Promise<Review[]>
  checkHealth: () => Promise<any>
  getApiStatus: () => Promise<any>
  initiateGoogleAuth: () => Promise<string>
  setGoogleToken: (token: string) => void
  signOutGoogle: () => void
}



export const useChatbotStore = create<ChatbotState>((set, get) => ({
  // Estado inicial
  loading: false,
  error: null,
  reviews: [],
  isUsingRealData: false,
  config: ConfigurationService.getSystemStatus(),
  
  // Acciones
  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  setReviews: (reviews) => set({ reviews }),

  refreshConfig: () => {
    const config = ConfigurationService.getSystemStatus()
    set({ config })
  },
  
  generateResponse: async (userInput: string, useRealAPI: boolean = true): Promise<AIResponse> => {
    set({ loading: true, error: null })

    try {
      const config = get().config

      // Solo usar API real - sin fallbacks mock
      const openaiConfig = config.apis?.openai || config.openai
      if (!openaiConfig?.isConfigured) {
        throw new Error('OpenAI API no configurada. Configure VITE_OPENAI_API_KEY para usar IA real.')
      }

      const response = await openaiService.generateResponse(userInput)

      const aiResponse: AIResponse = {
        response,
        status: 'ai_generated',
        timestamp: new Date().toISOString(),
        note: 'Respuesta generada por OpenAI GPT-3.5'
      }

      set({ loading: false })
      return aiResponse

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      set({ error: errorMessage, loading: false })
      throw error
    }
  },
  
  fetchReviews: async (useRealAPI: boolean = true): Promise<Review[]> => {
    set({ loading: true, error: null })

    try {
      const config = get().config

      // Solo usar API real - sin fallbacks mock
      const googleConfig = config.apis?.google || config.google
      if (!googleConfig?.isFullyConfigured) {
        throw new Error('Google My Business API no configurada completamente. Configure las credenciales y complete la autenticación OAuth.')
      }

      const googleReviews = await googleService.getReviews()

      // Sincronizar con backend si está disponible
      if (config.backend.isConfigured) {
        try {
          await flaskBackend.syncReviews(googleReviews)
        } catch (backendError) {
          console.warn('Backend sync failed:', backendError)
          // Continuar sin sincronización backend
        }
      }

      // Convertir formato de Google a formato interno
      const reviews: Review[] = googleReviews.map((review, index) => ({
        id: review.reviewId || `google_${index}`,
        reviewer: review.reviewer.displayName || 'Usuario Anónimo',
        rating: convertGoogleRating(review.starRating),
        text: review.comment || 'Sin comentario',
        date: formatDate(review.createTime),
        originalData: review
      }))

      set({ reviews, loading: false, isUsingRealData: true })
      return reviews

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al obtener reseñas'
      set({ error: errorMessage, loading: false })
      throw error
    }
  },
  
  checkHealth: async () => {
    try {
      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        dependencies: {
          react: true,
          vite: true,
          typescript: true,
          zustand: true
        },
        configuration: {
          web_app: true,
          mock_data: true
        },
        mode: 'web_application'
      }
    } catch (error) {
      throw error
    }
  },
  
  getApiStatus: async () => {
    try {
      const config = get().config
      return {
        application: 'Google Reviews Chatbot',
        version: '2.0.0 (Web)',
        technology: 'React + Vite + TypeScript',
        configuration: config,
        features: {
          web_interface: true,
          responsive_design: true,
          real_api_integration: (config.apis?.google?.isFullyConfigured || config.google?.isFullyConfigured) && (config.apis?.openai?.isConfigured || config.openai?.isConfigured),
          backend_integration: config.backend?.isConfigured || false,
          real_time_ui: true,
          modern_architecture: true
        },
        endpoints: [
          { path: '/', method: 'GET', description: 'Dashboard principal' },
          { path: '/reviews', method: 'GET', description: 'Página de reseñas' },
          { path: '/docs', method: 'GET', description: 'Documentación' },
          { path: '/health', method: 'GET', description: 'Estado del sistema' },
          { path: '/api/status', method: 'GET', description: 'Estado de la API' }
        ]
      }
    } catch (error) {
      throw error
    }
  },

  initiateGoogleAuth: async (): Promise<string> => {
    try {
      return await googleService.initiateAuth()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al iniciar autenticación'
      set({ error: errorMessage })
      throw error
    }
  },

  setGoogleToken: (token: string) => {
    googleService.setAccessToken(token)
    const config = ConfigurationService.getSystemStatus()
    set({ config })
  },

  signOutGoogle: () => {
    googleService.signOut()
    const config = ConfigurationService.getSystemStatus()
    set({ config, reviews: [], isUsingRealData: false })
  }
}))

// Funciones auxiliares
function convertGoogleRating(starRating: string): number {
  const ratingMap: { [key: string]: number } = {
    'ONE': 1,
    'TWO': 2,
    'THREE': 3,
    'FOUR': 4,
    'FIVE': 5
  }
  return ratingMap[starRating] || 0
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES')
  } catch {
    return 'Fecha no disponible'
  }
}

import { create } from 'zustand'
import { googleService, openaiService, MockDataService, type GoogleReview } from '../services/apiService'

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

// Simulación de la API
const mockReviews: Review[] = [
  {
    id: "1",
    reviewer: "María García",
    rating: 5,
    text: "Excelente servicio! El personal fue muy profesional y amable. Definitivamente volveré y lo recomendaré a mis amigos.",
    date: "2025-07-30"
  },
  {
    id: "2", 
    reviewer: "Carlos López",
    rating: 4,
    text: "Buena experiencia en general. El servicio fue rápido y eficiente, aunque el precio podría ser un poco mejor.",
    date: "2025-07-29"
  },
  {
    id: "3",
    reviewer: "John Smith",
    rating: 5,
    text: "Outstanding service! The team went above and beyond my expectations. Highly professional and friendly staff.",
    date: "2025-07-28"
  },
  {
    id: "4",
    reviewer: "Ana Martínez",
    rating: 3,
    text: "El servicio estuvo bien, pero tuvieron algunos problemas con mi pedido. Al final lo resolvieron correctamente.",
    date: "2025-07-27"
  },
  {
    id: "5",
    reviewer: "Sarah Johnson",
    rating: 5,
    text: "Amazing experience! Everything was perfect from start to finish. Will definitely be back!",
    date: "2025-07-26"
  }
]

// Función para generar respuestas mock inteligentes
const generateMockResponse = (userInput: string): string => {
  const input = userInput.toLowerCase()
  
  // Respuestas en español
  if (input.includes('excelente') || input.includes('fantástico') || input.includes('increíble') || input.includes('maravilloso')) {
    return "¡Muchísimas gracias por su excelente reseña! Nos emociona saber que tuvo una experiencia tan positiva con nosotros. Su satisfacción es nuestra mayor recompensa."
  }
  
  if (input.includes('malo') || input.includes('terrible') || input.includes('pésimo') || input.includes('horrible')) {
    return "Lamentamos profundamente que su experiencia no haya sido satisfactoria. Por favor contáctenos directamente para resolver cualquier inconveniente. Su feedback es muy valioso para mejorar."
  }
  
  if (input.includes('bueno') || input.includes('bien') || input.includes('correcto') || input.includes('aceptable')) {
    return "Gracias por su reseña. Nos complace saber que tuvo una buena experiencia y valoramos mucho su feedback para seguir mejorando."
  }
  
  // Respuestas en inglés
  if (input.includes('excellent') || input.includes('amazing') || input.includes('fantastic') || input.includes('wonderful')) {
    return "Thank you so much for your excellent review! We're thrilled to hear about your positive experience with us. Your satisfaction means everything to our team."
  }
  
  if (input.includes('bad') || input.includes('terrible') || input.includes('awful') || input.includes('horrible')) {
    return "We sincerely apologize for your disappointing experience. Please contact us directly so we can make this right. Your feedback helps us improve our services."
  }
  
  if (input.includes('good') || input.includes('nice') || input.includes('okay') || input.includes('decent')) {
    return "Thank you for your review. We're glad you had a good experience and appreciate your feedback to help us continue improving."
  }
  
  // Respuesta por defecto multiidioma
  return "Gracias por su reseña. Valoramos todos los comentarios de nuestros clientes. // Thank you for your review! We value all feedback from our customers."
}

export const useChatbotStore = create<ChatbotState>((set, get) => ({
  // Estado inicial
  loading: false,
  error: null,
  reviews: [],
  config: {
    googleConfigured: false,
    openaiConfigured: false,
    celeryAvailable: false,
    flaskAvailable: true // Como es una app web, siempre está disponible
  },
  
  // Acciones
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
  
  setReviews: (reviews) => set({ reviews }),
  
  generateResponse: async (userInput: string): Promise<AIResponse> => {
    set({ loading: true, error: null })
    
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const response = generateMockResponse(userInput)
      
      const aiResponse: AIResponse = {
        response,
        status: 'mock',
        timestamp: new Date().toISOString(),
        note: 'Esto es una respuesta simulada. La IA real requiere configuración de OpenAI.'
      }
      
      set({ loading: false })
      return aiResponse
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      set({ error: errorMessage, loading: false })
      throw error
    }
  },
  
  fetchReviews: async (): Promise<Review[]> => {
    set({ loading: true, error: null })
    
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // En una app real, aquí harías la llamada a la API
      const reviews = mockReviews
      set({ reviews, loading: false })
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
      return {
        application: 'Google Reviews Chatbot',
        version: '2.0.0 (Web)',
        technology: 'React + Vite + TypeScript',
        features: {
          web_interface: true,
          responsive_design: true,
          mock_responses: true,
          real_time_ui: true,
          modern_architecture: true
        },
        endpoints: [
          { path: '/', method: 'GET', description: 'Dashboard principal' },
          { path: '/reviews', method: 'GET', description: 'Página de reseñas' },
          { path: '/health', method: 'GET', description: 'Estado del sistema' },
          { path: '/api/status', method: 'GET', description: 'Estado de la API' }
        ]
      }
    } catch (error) {
      throw error
    }
  }
}))

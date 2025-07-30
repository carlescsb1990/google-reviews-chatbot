// Configuración de APIs
export const API_CONFIG = {
  // URLs base para diferentes entornos
  GOOGLE_MY_BUSINESS_BASE_URL: 'https://mybusiness.googleapis.com/v4',
  OPENAI_BASE_URL: 'https://api.openai.com/v1',
  
  // Claves de API desde variables de entorno
  GOOGLE_API_KEY: import.meta.env.VITE_GOOGLE_API_KEY || '',
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET: import.meta.env.VITE_GOOGLE_CLIENT_SECRET || '',
  OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY || '',
  
  // Backend personalizado (si tienes uno)
  BACKEND_BASE_URL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000',
}

export interface GoogleReview {
  reviewId: string
  reviewer: {
    displayName: string
    profilePhotoUrl?: string
  }
  starRating: 'ONE' | 'TWO' | 'THREE' | 'FOUR' | 'FIVE'
  comment?: string
  createTime: string
  updateTime: string
  reviewReply?: {
    comment: string
    updateTime: string
  }
}

export interface OpenAIResponse {
  id: string
  object: string
  created: number
  model: string
  choices: Array<{
    index: number
    message: {
      role: string
      content: string
    }
    finish_reason: string
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

// Servicio para Google My Business API
export class GoogleMyBusinessService {
  private accessToken: string | null = null

  constructor() {
    // Inicializar autenticación si está disponible
    this.accessToken = localStorage.getItem('google_access_token')
  }

  // Verificar si las credenciales están configuradas
  isConfigured(): boolean {
    return !!(API_CONFIG.GOOGLE_API_KEY && API_CONFIG.GOOGLE_CLIENT_ID)
  }

  // Obtener estado de configuración
  getConfigurationStatus() {
    return {
      hasApiKey: !!API_CONFIG.GOOGLE_API_KEY,
      hasClientId: !!API_CONFIG.GOOGLE_CLIENT_ID,
      hasClientSecret: !!API_CONFIG.GOOGLE_CLIENT_SECRET,
      hasAccessToken: !!this.accessToken,
      isFullyConfigured: this.isConfigured() && !!this.accessToken
    }
  }

  // Iniciar flujo de autenticación OAuth2
  async initiateAuth(): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('Google API credentials not configured')
    }

    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
    authUrl.searchParams.set('client_id', API_CONFIG.GOOGLE_CLIENT_ID)
    authUrl.searchParams.set('redirect_uri', window.location.origin + '/auth/callback')
    authUrl.searchParams.set('response_type', 'code')
    authUrl.searchParams.set('scope', 'https://www.googleapis.com/auth/business.manage')
    authUrl.searchParams.set('access_type', 'offline')

    return authUrl.toString()
  }

  // Obtener reseñas de una ubicación
  async getReviews(accountId?: string, locationId?: string): Promise<GoogleReview[]> {
    if (!this.isConfigured()) {
      throw new Error('Google My Business API not configured')
    }

    if (!this.accessToken) {
      throw new Error('Not authenticated. Please sign in with Google.')
    }

    try {
      // Si no se proporcionan IDs, obtener el primer account y location
      let finalAccountId = accountId
      let finalLocationId = locationId

      if (!finalAccountId) {
        const accounts = await this.getAccounts()
        if (accounts.length === 0) {
          throw new Error('No Google My Business accounts found')
        }
        finalAccountId = accounts[0].name
      }

      if (!finalLocationId) {
        const locations = await this.getLocations(finalAccountId)
        if (locations.length === 0) {
          throw new Error('No locations found in the account')
        }
        finalLocationId = locations[0].name
      }

      const response = await fetch(
        `${API_CONFIG.GOOGLE_MY_BUSINESS_BASE_URL}/${finalLocationId}/reviews`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (!response.ok) {
        if (response.status === 401) {
          this.accessToken = null
          localStorage.removeItem('google_access_token')
          throw new Error('Authentication expired. Please sign in again.')
        }
        throw new Error(`Failed to fetch reviews: ${response.statusText}`)
      }

      const data = await response.json()
      return data.reviews || []

    } catch (error) {
      console.error('Error fetching Google reviews:', error)
      throw error
    }
  }

  // Obtener cuentas de Google My Business
  async getAccounts() {
    const response = await fetch(
      `${API_CONFIG.GOOGLE_MY_BUSINESS_BASE_URL}/accounts`,
      {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch accounts: ${response.statusText}`)
    }

    const data = await response.json()
    return data.accounts || []
  }

  // Obtener ubicaciones de una cuenta
  async getLocations(accountId: string) {
    const response = await fetch(
      `${API_CONFIG.GOOGLE_MY_BUSINESS_BASE_URL}/${accountId}/locations`,
      {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch locations: ${response.statusText}`)
    }

    const data = await response.json()
    return data.locations || []
  }

  // Establecer token de acceso
  setAccessToken(token: string) {
    this.accessToken = token
    localStorage.setItem('google_access_token', token)
  }

  // Limpiar autenticación
  signOut() {
    this.accessToken = null
    localStorage.removeItem('google_access_token')
  }
}

// Servicio para OpenAI API
export class OpenAIService {
  // Verificar si está configurado
  isConfigured(): boolean {
    return !!API_CONFIG.OPENAI_API_KEY
  }

  // Obtener estado de configuración
  getConfigurationStatus() {
    return {
      hasApiKey: !!API_CONFIG.OPENAI_API_KEY,
      isConfigured: this.isConfigured()
    }
  }

  // Generar respuesta para una reseña
  async generateResponse(reviewText: string, rating?: number): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('OpenAI API key not configured')
    }

    try {
      const systemPrompt = `Eres un representante profesional de atención al cliente que responde a reseñas de Google My Business. 
Tus respuestas deben ser:
- Profesionales y corteses
- Apropiadas al sentimiento de la reseña (positiva, negativa, neutral)
- Breves pero significativas (2-3 frases máximo)
- Que fomenten futuros negocios cuando sea apropiado
- Que ofrezcan resolver problemas para reseñas negativas
- Responder en el mismo idioma que la reseña cuando sea posible`

      const userPrompt = `Genera una respuesta profesional para esta reseña${rating ? ` (${rating}/5 estrellas)` : ''}:

"${reviewText}"`

      const response = await fetch(`${API_CONFIG.OPENAI_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_CONFIG.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.7,
          max_tokens: 150
        })
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid OpenAI API key')
        }
        throw new Error(`OpenAI API error: ${response.statusText}`)
      }

      const data: OpenAIResponse = await response.json()
      return data.choices[0]?.message?.content?.trim() || 'No se pudo generar respuesta'

    } catch (error) {
      console.error('Error generating OpenAI response:', error)
      throw error
    }
  }
}

// Servicios de mock para desarrollo/demo
export class MockDataService {
  static getConfigurationGaps() {
    const google = new GoogleMyBusinessService()
    const openai = new OpenAIService()
    
    const googleStatus = google.getConfigurationStatus()
    const openaiStatus = openai.getConfigurationStatus()

    return {
      google: googleStatus,
      openai: openaiStatus,
      missingSteps: [
        ...(!googleStatus.hasApiKey ? ['Configure VITE_GOOGLE_API_KEY'] : []),
        ...(!googleStatus.hasClientId ? ['Configure VITE_GOOGLE_CLIENT_ID'] : []),
        ...(!googleStatus.hasClientSecret ? ['Configure VITE_GOOGLE_CLIENT_SECRET'] : []),
        ...(!googleStatus.hasAccessToken ? ['Complete Google OAuth2 authentication'] : []),
        ...(!openaiStatus.hasApiKey ? ['Configure VITE_OPENAI_API_KEY'] : []),
      ]
    }
  }

  static getMockReviews(): GoogleReview[] {
    return [
      {
        reviewId: 'mock_1',
        reviewer: { displayName: 'María García' },
        starRating: 'FIVE',
        comment: 'Excelente servicio! El personal fue muy profesional y amable. Definitivamente volveré y lo recomendaré a mis amigos.',
        createTime: '2025-07-30T10:30:00Z',
        updateTime: '2025-07-30T10:30:00Z'
      },
      {
        reviewId: 'mock_2',
        reviewer: { displayName: 'Carlos López' },
        starRating: 'FOUR',
        comment: 'Buena experiencia en general. El servicio fue rápido y eficiente, aunque el precio podría ser un poco mejor.',
        createTime: '2025-07-29T15:45:00Z',
        updateTime: '2025-07-29T15:45:00Z'
      },
      {
        reviewId: 'mock_3',
        reviewer: { displayName: 'John Smith' },
        starRating: 'FIVE',
        comment: 'Outstanding service! The team went above and beyond my expectations. Highly professional and friendly staff.',
        createTime: '2025-07-28T09:15:00Z',
        updateTime: '2025-07-28T09:15:00Z'
      },
      {
        reviewId: 'mock_4',
        reviewer: { displayName: 'Ana Martínez' },
        starRating: 'TWO',
        comment: 'El servicio estuvo mal. Tuvieron muchos problemas con mi pedido y tardaron demasiado en resolverlo. No estoy satisfecha.',
        createTime: '2025-07-27T14:20:00Z',
        updateTime: '2025-07-27T14:20:00Z'
      },
      {
        reviewId: 'mock_5',
        reviewer: { displayName: 'Sarah Johnson' },
        starRating: 'FIVE',
        comment: 'Amazing experience! Everything was perfect from start to finish. Will definitely be back!',
        createTime: '2025-07-26T11:00:00Z',
        updateTime: '2025-07-26T11:00:00Z'
      }
    ]
  }
}

// Exportar instancias de los servicios
export const googleService = new GoogleMyBusinessService()
export const openaiService = new OpenAIService()

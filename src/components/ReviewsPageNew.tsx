import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useChatbotStore, Review, ConfigurationStatus } from '../store/chatbotStore'
import { oauthService } from '../services/realApiService'

const ReviewsPageNew: React.FC = () => {
  const { 
    fetchReviews, 
    generateResponse, 
    loading, 
    error, 
    config, 
    isUsingRealData,
    initiateGoogleAuth,
    refreshConfig 
  } = useChatbotStore()
  
  const [reviews, setReviews] = useState<Review[]>([])
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [generatedResponse, setGeneratedResponse] = useState<string>('')
  const [responseLoading, setResponseLoading] = useState(false)
  const [showConfigHelp, setShowConfigHelp] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  useEffect(() => {
    refreshConfig()
    // Don't automatically load reviews - let user click the button when ready
  }, [])

  const loadReviews = async () => {
    if (!canUseGoogleAPI) {
      setLocalError('Google My Business API no está configurada. Configure las credenciales primero.')
      return
    }

    try {
      const data = await fetchReviews(true)
      setReviews(data)
      setLocalError(null) // Clear any previous errors
    } catch (error) {
      console.error('Error loading reviews:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar reseñas'
      setLocalError(errorMessage)
    }
  }

  const handleGenerateResponse = async (review: Review) => {
    if (!canUseOpenAI) {
      setGeneratedResponse('OpenAI API no configurada. Configure VITE_OPENAI_API_KEY.')
      return
    }

    setSelectedReview(review)
    setResponseLoading(true)

    try {
      const response = await generateResponse(review.text, true)
      setGeneratedResponse(response.response)
    } catch (error) {
      console.error('Error generating response:', error)
      setGeneratedResponse(error instanceof Error ? error.message : 'Error al generar respuesta')
    } finally {
      setResponseLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    try {
      const authUrl = await oauthService.initiateOAuth()
      window.location.href = authUrl
    } catch (error) {
      console.error('Error initiating Google auth:', error)
    }
  }

  const renderStars = (rating: number) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating)
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return '#00b894'
    if (rating >= 3) return '#fdcb6e'
    return '#e17055'
  }

  const canUseGoogleAPI = config.apis.google.isFullyConfigured
  const canUseOpenAI = config.apis.openai.isConfigured
  const canUseRealAPIs = canUseGoogleAPI && canUseOpenAI

  return (
    <div className="app">
      <div className="background-animation"></div>
      
      <div className="container">
        <div className="header">
          <h1>
            <i className="fas fa-star"></i> Reseñas de Clientes
          </h1>
          <p>Gestión y análisis de reseñas de Google My Business</p>
          
          {/* Indicador de modo */}
          <div className="mode-indicator">
            <span className={`mode-badge ${isUsingRealData ? 'real' : 'demo'}`}>
              <i className={`fas ${isUsingRealData ? 'fa-cloud' : 'fa-flask'}`}></i>
              {isUsingRealData ? 'Datos Reales' : 'Modo Demo'}
            </span>
          </div>
        </div>

        {/* Panel de configuración */}
        {config.missingConfiguration.length > 0 && (
          <div className="config-panel">
            <div className="config-header">
              <div className="config-title">
                <i className="fas fa-cog"></i>
                <span>Configuración Requerida</span>
                <button 
                  className="toggle-help"
                  onClick={() => setShowConfigHelp(!showConfigHelp)}
                >
                  <i className={`fas ${showConfigHelp ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                </button>
              </div>
              <p>Faltan {config.missingConfiguration.length} pasos para usar APIs reales</p>
            </div>

            {showConfigHelp && (
              <div className="config-content">
                <div className="config-status">
                  <div className="config-section">
                    <h4>
                      <i className="fab fa-google"></i>
                      Google My Business API
                    </h4>
                    <div className="config-items">
                      <div className={`config-item ${config.apis.google.hasApiKey ? 'configured' : 'missing'}`}>
                        <i className={`fas ${config.apis.google.hasApiKey ? 'fa-check' : 'fa-times'}`}></i>
                        <span>API Key</span>
                        {!config.apis.google.hasApiKey && (
                          <small>Configure VITE_GOOGLE_API_KEY</small>
                        )}
                      </div>
                      <div className={`config-item ${config.apis.google.hasClientId ? 'configured' : 'missing'}`}>
                        <i className={`fas ${config.apis.google.hasClientId ? 'fa-check' : 'fa-times'}`}></i>
                        <span>Client ID</span>
                        {!config.apis.google.hasClientId && (
                          <small>Configure VITE_GOOGLE_CLIENT_ID</small>
                        )}
                      </div>
                      <div className={`config-item ${config.apis.google.hasAccessToken ? 'configured' : 'missing'}`}>
                        <i className={`fas ${config.apis.google.hasAccessToken ? 'fa-check' : 'fa-times'}`}></i>
                        <span>Authentication</span>
                        {!config.apis.google.hasAccessToken && config.apis.google.hasClientId && (
                          <button className="auth-button" onClick={handleGoogleAuth}>
                            <i className="fab fa-google"></i>
                            Autenticar con Google
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="config-section">
                    <h4>
                      <i className="fas fa-brain"></i>
                      OpenAI API
                    </h4>
                    <div className="config-items">
                      <div className={`config-item ${config.apis.openai.hasApiKey ? 'configured' : 'missing'}`}>
                        <i className={`fas ${config.apis.openai.hasApiKey ? 'fa-check' : 'fa-times'}`}></i>
                        <span>API Key</span>
                        {!config.apis.openai.hasApiKey && (
                          <small>Configure VITE_OPENAI_API_KEY</small>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="config-help">
                  <h4>
                    <i className="fas fa-question-circle"></i>
                    ¿Necesitas ayuda?
                  </h4>
                  <p>
                    Consulta la <Link to="/docs">documentación completa</Link> para 
                    obtener instrucciones detalladas sobre cómo configurar las APIs.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {localError && (
          <div className="card error-card">
            <div className="error-header">
              <i className="fas fa-exclamation-triangle"></i>
              <h3>Error</h3>
            </div>
            <p>{localError}</p>
            <button
              className="btn btn-secondary"
              onClick={() => setLocalError(null)}
            >
              <i className="fas fa-times"></i>
              Cerrar
            </button>
          </div>
        )}

        {loading ? (
          <div className="loading-container">
            <div className="loading" style={{ margin: '0 auto' }}></div>
            <p>Cargando reseñas...</p>
          </div>
        ) : (
          <div className="main-content">
            {/* Estadísticas */}
            <div className="card stats-card">
              <div className="card-title">
                <i className="fas fa-chart-bar"></i>
                Estadísticas de Reseñas
              </div>
              
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-value">{reviews.length}</div>
                  <div className="stat-label">Total Reseñas</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">
                    {reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : '0'}
                  </div>
                  <div className="stat-label">Promedio</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{reviews.filter(r => r.rating >= 4).length}</div>
                  <div className="stat-label">Positivas</div>
                </div>
              </div>
            </div>

            {/* Controles */}
            <div className="card controls-card">
              <div className="card-title">
                <i className="fas fa-sliders-h"></i>
                Controles
              </div>
              
              <div className="controls-content">
                {canUseGoogleAPI ? (
                  <button
                    className="btn"
                    onClick={loadReviews}
                    disabled={loading}
                  >
                    <i className="fas fa-cloud"></i>
                    Cargar Reseñas de Google
                  </button>
                ) : (
                  <div className="disabled-notice">
                    <i className="fas fa-info-circle"></i>
                    <span>Configure Google My Business API para cargar reseñas</span>
                  </div>
                )}
              </div>
            </div>

            {/* Lista de reseñas */}
            <div className="reviews-section">
              <div className="card">
                <div className="card-title">
                  <i className="fas fa-comments"></i>
                  Lista de Reseñas ({reviews.length})
                  {isUsingRealData && (
                    <span className="real-data-badge">
                      <i className="fas fa-cloud"></i>
                      Datos Reales
                    </span>
                  )}
                </div>
                
                <div className="reviews-list">
                  {reviews.map((review) => (
                    <div key={review.id} className="review-item">
                      <div className="review-header">
                        <div className="reviewer-info">
                          <strong className="reviewer-name">{review.reviewer}</strong>
                          <div className="review-date">
                            <i className="fas fa-calendar"></i> {review.date}
                          </div>
                        </div>
                        <div className="rating-info">
                          <div 
                            className="stars-display"
                            style={{ color: getRatingColor(review.rating) }}
                          >
                            {renderStars(review.rating)}
                          </div>
                          <div className="rating-text">
                            {review.rating}/5 estrellas
                          </div>
                        </div>
                      </div>
                      
                      <div className="review-content">
                        <p className="review-text">"{review.text}"</p>
                      </div>
                      
                      <div className="review-actions">
                        {canUseOpenAI ? (
                          <button
                            className="btn btn-small btn-premium"
                            onClick={() => handleGenerateResponse(review)}
                            disabled={responseLoading}
                          >
                            {responseLoading && selectedReview?.id === review.id ? (
                              <>
                                <div className="loading"></div>
                                Generando...
                              </>
                            ) : (
                              <>
                                <i className="fas fa-brain"></i>
                                Generar Respuesta IA
                              </>
                            )}
                          </button>
                        ) : (
                          <div className="disabled-notice">
                            <i className="fas fa-info-circle"></i>
                            <span>Configure OpenAI API para generar respuestas</span>
                          </div>
                        )}
                      </div>
                      
                      {selectedReview?.id === review.id && generatedResponse && (
                        <div className="generated-response">
                          <div className="response-header">
                            <i className="fas fa-robot"></i>
                            <strong>Respuesta Generada:</strong>
                          </div>
                          <div className="response-content">
                            {generatedResponse}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="page-footer">
          <Link to="/" className="btn">
            <i className="fas fa-home"></i>
            Volver al Dashboard
          </Link>
        </div>

        <style>{`
          .mode-indicator {
            margin-top: 15px;
          }

          .mode-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 600;
          }

          .mode-badge.real {
            background: rgba(0, 184, 148, 0.2);
            color: #00b894;
            border: 1px solid rgba(0, 184, 148, 0.3);
          }

          .mode-badge.demo {
            background: rgba(255, 193, 7, 0.2);
            color: #ffc107;
            border: 1px solid rgba(255, 193, 7, 0.3);
          }

          .config-panel {
            background: rgba(255, 107, 107, 0.1);
            border: 1px solid rgba(255, 107, 107, 0.3);
            border-radius: 12px;
            margin-bottom: 30px;
            overflow: hidden;
          }

          .config-header {
            padding: 20px;
            background: rgba(255, 107, 107, 0.05);
          }

          .config-title {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 8px;
            color: #e74c3c;
            font-weight: 600;
            font-size: 1.1rem;
          }

          .toggle-help {
            background: none;
            border: none;
            color: #e74c3c;
            cursor: pointer;
            margin-left: auto;
            padding: 5px;
            border-radius: 4px;
            transition: all 0.3s;
          }

          .toggle-help:hover {
            background: rgba(255, 107, 107, 0.1);
          }

          .config-content {
            padding: 20px;
            border-top: 1px solid rgba(255, 107, 107, 0.2);
          }

          .config-status {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
          }

          .config-section h4 {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 15px;
            color: var(--text-primary);
          }

          .config-items {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }

          .config-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px;
            border-radius: 8px;
            background: rgba(255,255,255,0.05);
          }

          .config-item.configured {
            background: rgba(0, 184, 148, 0.1);
            color: #00b894;
          }

          .config-item.missing {
            background: rgba(255, 107, 107, 0.1);
            color: #e74c3c;
          }

          .config-item small {
            margin-left: auto;
            opacity: 0.8;
            font-size: 0.8rem;
          }

          .auth-button {
            background: #4285f4;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 0.8rem;
            cursor: pointer;
            margin-left: auto;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: all 0.3s;
          }

          .auth-button:hover {
            background: #3367d6;
          }

          .config-help {
            background: rgba(102, 126, 234, 0.1);
            padding: 15px;
            border-radius: 8px;
            border: 1px solid rgba(102, 126, 234, 0.2);
          }

          .config-help h4 {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
            color: #667eea;
          }

          .config-help a {
            color: #667eea;
            text-decoration: none;
            font-weight: 600;
          }

          .config-help a:hover {
            text-decoration: underline;
          }

          .loading-container {
            text-align: center;
            color: white;
            margin-top: 50px;
          }

          .stats-card {
            grid-column: 1 / -1;
          }

          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 20px;
          }

          .stat-item {
            text-align: center;
            padding: 15px;
            background: rgba(255,255,255,0.1);
            border-radius: 8px;
            backdrop-filter: blur(10px);
          }

          .stat-value {
            font-size: 2rem;
            font-weight: bold;
            color: #2d3436;
            margin-bottom: 5px;
          }

          .stat-label {
            color: var(--text-secondary);
            font-size: 0.9rem;
          }

          .controls-card {
            grid-column: 1 / -1;
          }

          .controls-content {
            display: flex;
            gap: 15px;
            align-items: center;
            flex-wrap: wrap;
          }

          .disabled-notice {
            display: flex;
            align-items: center;
            gap: 8px;
            color: var(--text-secondary);
            font-size: 0.9rem;
            font-style: italic;
          }

          .reviews-section {
            grid-column: 1 / -1;
          }

          .real-data-badge {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            background: rgba(0, 184, 148, 0.2);
            color: #00b894;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 0.8rem;
            margin-left: 10px;
          }

          .reviews-list {
            display: flex;
            flex-direction: column;
            gap: 20px;
          }

          .review-item {
            background: rgba(255,255,255,0.95);
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            border-left: 4px solid #667eea;
            transition: all 0.3s;
          }

          .review-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
          }

          .review-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
          }

          .reviewer-name {
            color: #2d3748;
            font-size: 1.1rem;
            margin-bottom: 5px;
            display: block;
          }

          .review-date {
            color: #718096;
            font-size: 0.9rem;
            display: flex;
            align-items: center;
            gap: 5px;
          }

          .rating-info {
            text-align: right;
          }

          .stars-display {
            font-size: 1.3rem;
            margin-bottom: 5px;
          }

          .rating-text {
            font-size: 0.9rem;
            color: #718096;
          }

          .review-content {
            margin: 15px 0;
          }

          .review-text {
            font-size: 1rem;
            line-height: 1.6;
            color: #2d3748;
            font-style: italic;
            margin: 0;
          }

          .review-actions {
            display: flex;
            gap: 10px;
            margin-top: 15px;
          }

          .btn-small {
            padding: 8px 16px;
            font-size: 0.9rem;
          }

          .btn-premium {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            position: relative;
            overflow: hidden;
          }

          .btn-premium::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.5s;
          }

          .btn-premium:hover::before {
            left: 100%;
          }

          .generated-response {
            margin-top: 20px;
            padding: 20px;
            background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
            border-radius: 8px;
            border-left: 4px solid #00b894;
            animation: slideIn 0.5s ease-out;
          }

          .response-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 10px;
            color: #2d3748;
            font-weight: 600;
          }

          .response-content {
            color: #2d3748;
            line-height: 1.5;
            font-style: italic;
          }

          .page-footer {
            text-align: center;
            margin-top: 30px;
          }

          .error-card {
            background: rgba(231, 76, 60, 0.1);
            border: 1px solid rgba(231, 76, 60, 0.3);
            color: #e74c3c;
            margin-bottom: 20px;
          }

          .error-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 15px;
          }

          .error-header h3 {
            margin: 0;
            color: #e74c3c;
          }

          .error-header i {
            font-size: 1.2rem;
          }

          @media (max-width: 768px) {
            .review-header {
              flex-direction: column;
              align-items: flex-start;
              gap: 10px;
            }

            .rating-info {
              text-align: left;
            }

            .stats-grid {
              grid-template-columns: 1fr;
            }

            .controls-content {
              flex-direction: column;
              align-items: stretch;
            }

            .config-status {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </div>
    </div>
  )
}

export default ReviewsPageNew

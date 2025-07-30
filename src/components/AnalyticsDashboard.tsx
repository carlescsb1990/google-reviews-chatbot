import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { analyticsService, ConfigurationService } from '../services/realApiService'
import { useChatbotStore } from '../store/chatbotStore'

interface SentimentAnalysis {
  positive: number
  negative: number
  neutral: number
  trends: Array<{ date: string; sentiment: number }>
}

interface ResponseMetrics {
  total_responses: number
  avg_response_time: number
  response_rate: number
  improvement_trends: Array<{ month: string; score: number }>
}

interface KeywordAnalysis {
  positive_keywords: Array<{ word: string; frequency: number }>
  negative_keywords: Array<{ word: string; frequency: number }>
  trending_topics: Array<{ topic: string; mentions: number }>
}

const AnalyticsDashboard: React.FC = () => {
  const { fetchReviews, loading } = useChatbotStore()
  const [sentimentData, setSentimentData] = useState<SentimentAnalysis | null>(null)
  const [responseMetrics, setResponseMetrics] = useState<ResponseMetrics | null>(null)
  const [keywordData, setKeywordData] = useState<KeywordAnalysis | null>(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const systemStatus = ConfigurationService.getSystemStatus()
  const canUseAnalytics = systemStatus.backend.isConfigured

  useEffect(() => {
    if (canUseAnalytics) {
      loadAnalytics()
    }
  }, [canUseAnalytics])

  const loadAnalytics = async () => {
    setAnalyticsLoading(true)
    setError(null)

    try {
      // Obtener reseñas primero
      const reviews = await fetchReviews(true)
      
      if (reviews.length === 0) {
        setError('No hay reseñas disponibles para analizar')
        return
      }

      // Convertir a formato Google para análisis
      const googleReviews = reviews
        .filter(r => r.originalData)
        .map(r => r.originalData!)

      // Cargar todos los análisis en paralelo
      const [sentiment, metrics, keywords] = await Promise.all([
        analyticsService.analyzeSentiment(googleReviews),
        analyticsService.getResponseMetrics(),
        analyticsService.getKeywordAnalysis(googleReviews)
      ])

      setSentimentData(sentiment)
      setResponseMetrics(metrics)
      setKeywordData(keywords)

    } catch (err) {
      console.error('Error loading analytics:', err)
      setError(err instanceof Error ? err.message : 'Error al cargar análisis')
    } finally {
      setAnalyticsLoading(false)
    }
  }

  const renderSentimentChart = () => {
    if (!sentimentData) return null

    const total = sentimentData.positive + sentimentData.negative + sentimentData.neutral
    const positivePercent = (sentimentData.positive / total) * 100
    const negativePercent = (sentimentData.negative / total) * 100
    const neutralPercent = (sentimentData.neutral / total) * 100

    return (
      <div className="sentiment-chart">
        <div className="chart-bar">
          <div 
            className="bar-segment positive" 
            style={{ width: `${positivePercent}%` }}
            title={`Positivas: ${sentimentData.positive} (${positivePercent.toFixed(1)}%)`}
          ></div>
          <div 
            className="bar-segment neutral" 
            style={{ width: `${neutralPercent}%` }}
            title={`Neutrales: ${sentimentData.neutral} (${neutralPercent.toFixed(1)}%)`}
          ></div>
          <div 
            className="bar-segment negative" 
            style={{ width: `${negativePercent}%` }}
            title={`Negativas: ${sentimentData.negative} (${negativePercent.toFixed(1)}%)`}
          ></div>
        </div>
        
        <div className="chart-legend">
          <div className="legend-item">
            <span className="legend-color positive"></span>
            <span>Positivas: {sentimentData.positive}</span>
          </div>
          <div className="legend-item">
            <span className="legend-color neutral"></span>
            <span>Neutrales: {sentimentData.neutral}</span>
          </div>
          <div className="legend-item">
            <span className="legend-color negative"></span>
            <span>Negativas: {sentimentData.negative}</span>
          </div>
        </div>
      </div>
    )
  }

  const renderKeywordCloud = (keywords: Array<{ word: string; frequency: number }>, type: 'positive' | 'negative') => {
    const maxFrequency = Math.max(...keywords.map(k => k.frequency))
    
    return (
      <div className="keyword-cloud">
        {keywords.slice(0, 10).map((keyword, index) => {
          const size = 0.8 + (keyword.frequency / maxFrequency) * 1.2
          return (
            <span
              key={index}
              className={`keyword-tag ${type}`}
              style={{ fontSize: `${size}rem` }}
              title={`Menciones: ${keyword.frequency}`}
            >
              {keyword.word}
            </span>
          )
        })}
      </div>
    )
  }

  if (!canUseAnalytics) {
    return (
      <div className="app">
        <div className="background-animation"></div>
        
        <div className="container">
          <div className="header">
            <h1>
              <i className="fas fa-chart-line"></i> Análisis y Métricas
            </h1>
            <p>Análisis avanzado de reseñas y rendimiento</p>
          </div>

          <div className="card config-required-card">
            <div className="config-icon">
              <i className="fas fa-server"></i>
            </div>
            <h3>Backend Requerido</h3>
            <p>
              Para usar el análisis avanzado, necesitas configurar el backend Flask con Redis.
              El análisis incluye:
            </p>
            
            <div className="features-list">
              <div className="feature-item">
                <i className="fas fa-heart"></i>
                <span>Análisis de sentimientos con IA</span>
              </div>
              <div className="feature-item">
                <i className="fas fa-clock"></i>
                <span>Métricas de tiempo de respuesta</span>
              </div>
              <div className="feature-item">
                <i className="fas fa-tags"></i>
                <span>Análisis de palabras clave</span>
              </div>
              <div className="feature-item">
                <i className="fas fa-chart-line"></i>
                <span>Tendencias temporales</span>
              </div>
            </div>

            <div className="config-actions">
              <Link to="/docs" className="btn">
                <i className="fas fa-book"></i>
                Ver Documentación
              </Link>
              <Link to="/reviews" className="btn btn-secondary">
                <i className="fas fa-arrow-left"></i>
                Volver a Reseñas
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <div className="background-animation"></div>
      
      <div className="container">
        <div className="header">
          <h1>
            <i className="fas fa-chart-line"></i> Análisis y Métricas
          </h1>
          <p>Análisis avanzado de reseñas y rendimiento</p>
          
          <div className="header-actions">
            <button 
              className="btn btn-secondary"
              onClick={loadAnalytics}
              disabled={analyticsLoading}
            >
              {analyticsLoading ? (
                <>
                  <div className="loading small"></div>
                  Analizando...
                </>
              ) : (
                <>
                  <i className="fas fa-sync"></i>
                  Actualizar Análisis
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="card error-card">
            <i className="fas fa-exclamation-triangle"></i>
            <h3>Error en Análisis</h3>
            <p>{error}</p>
            <button className="btn" onClick={loadAnalytics}>
              <i className="fas fa-redo"></i>
              Reintentar
            </button>
          </div>
        )}

        {analyticsLoading && (
          <div className="loading-container">
            <div className="loading large"></div>
            <p>Analizando datos con IA...</p>
          </div>
        )}

        {!analyticsLoading && !error && (
          <div className="analytics-grid">
            {/* Análisis de Sentimientos */}
            {sentimentData && (
              <div className="card analytics-card">
                <div className="card-title">
                  <i className="fas fa-heart"></i>
                  Análisis de Sentimientos
                </div>
                {renderSentimentChart()}
                
                {sentimentData.trends.length > 0 && (
                  <div className="trends-section">
                    <h4>Tendencia Reciente</h4>
                    <div className="trend-items">
                      {sentimentData.trends.slice(-5).map((trend, index) => (
                        <div key={index} className="trend-item">
                          <span className="trend-date">{trend.date}</span>
                          <div className="trend-bar">
                            <div 
                              className="trend-fill"
                              style={{ 
                                width: `${(trend.sentiment + 1) * 50}%`,
                                backgroundColor: trend.sentiment > 0 ? '#00b894' : '#e74c3c'
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Métricas de Respuestas */}
            {responseMetrics && (
              <div className="card analytics-card">
                <div className="card-title">
                  <i className="fas fa-reply"></i>
                  Métricas de Respuestas
                </div>
                
                <div className="metrics-grid">
                  <div className="metric-item">
                    <div className="metric-value">{responseMetrics.total_responses}</div>
                    <div className="metric-label">Total Respuestas</div>
                  </div>
                  <div className="metric-item">
                    <div className="metric-value">{responseMetrics.avg_response_time}h</div>
                    <div className="metric-label">Tiempo Promedio</div>
                  </div>
                  <div className="metric-item">
                    <div className="metric-value">{(responseMetrics.response_rate * 100).toFixed(1)}%</div>
                    <div className="metric-label">Tasa de Respuesta</div>
                  </div>
                </div>

                {responseMetrics.improvement_trends.length > 0 && (
                  <div className="improvement-chart">
                    <h4>Mejora en el Tiempo</h4>
                    <div className="improvement-items">
                      {responseMetrics.improvement_trends.map((item, index) => (
                        <div key={index} className="improvement-item">
                          <span className="improvement-month">{item.month}</span>
                          <div className="improvement-score">
                            <span className="score-value">{item.score.toFixed(1)}</span>
                            <span className="score-stars">
                              {'⭐'.repeat(Math.round(item.score))}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Análisis de Palabras Clave */}
            {keywordData && (
              <div className="card analytics-card keywords-card">
                <div className="card-title">
                  <i className="fas fa-tags"></i>
                  Análisis de Palabras Clave
                </div>
                
                <div className="keywords-section">
                  <div className="keyword-category">
                    <h4 className="positive-title">
                      <i className="fas fa-thumbs-up"></i>
                      Palabras Positivas
                    </h4>
                    {renderKeywordCloud(keywordData.positive_keywords, 'positive')}
                  </div>

                  <div className="keyword-category">
                    <h4 className="negative-title">
                      <i className="fas fa-thumbs-down"></i>
                      Palabras de Preocupación
                    </h4>
                    {renderKeywordCloud(keywordData.negative_keywords, 'negative')}
                  </div>
                </div>

                {keywordData.trending_topics.length > 0 && (
                  <div className="trending-topics">
                    <h4>
                      <i className="fas fa-fire"></i>
                      Temas Trending
                    </h4>
                    <div className="topics-list">
                      {keywordData.trending_topics.slice(0, 5).map((topic, index) => (
                        <div key={index} className="topic-item">
                          <span className="topic-name">{topic.topic}</span>
                          <span className="topic-mentions">{topic.mentions} menciones</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="page-footer">
          <Link to="/" className="btn">
            <i className="fas fa-home"></i>
            Dashboard Principal
          </Link>
          <Link to="/reviews" className="btn btn-secondary">
            <i className="fas fa-comments"></i>
            Ver Reseñas
          </Link>
        </div>
      </div>

      <style>{`
        .analytics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 30px;
          margin-bottom: 30px;
        }

        .analytics-card {
          min-height: 300px;
        }

        .keywords-card {
          grid-column: 1 / -1;
        }

        .config-required-card {
          text-align: center;
          padding: 60px 40px;
          max-width: 600px;
          margin: 0 auto;
        }

        .config-icon {
          font-size: 4rem;
          color: #667eea;
          margin-bottom: 20px;
        }

        .features-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 15px;
          margin: 30px 0;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 15px;
          background: rgba(255,255,255,0.1);
          border-radius: 8px;
          backdrop-filter: blur(10px);
        }

        .feature-item i {
          color: #667eea;
          font-size: 1.2rem;
        }

        .config-actions {
          display: flex;
          gap: 15px;
          justify-content: center;
          margin-top: 30px;
        }

        .header-actions {
          margin-top: 15px;
        }

        .sentiment-chart {
          margin: 20px 0;
        }

        .chart-bar {
          height: 30px;
          border-radius: 15px;
          overflow: hidden;
          display: flex;
          margin-bottom: 15px;
          box-shadow: inset 0 2px 5px rgba(0,0,0,0.1);
        }

        .bar-segment {
          transition: all 0.3s ease;
        }

        .bar-segment.positive {
          background: linear-gradient(135deg, #00b894 0%, #00cec9 100%);
        }

        .bar-segment.neutral {
          background: linear-gradient(135deg, #fdcb6e 0%, #f39c12 100%);
        }

        .bar-segment.negative {
          background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
        }

        .chart-legend {
          display: flex;
          justify-content: space-around;
          flex-wrap: wrap;
          gap: 10px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
        }

        .legend-color {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .legend-color.positive {
          background: #00b894;
        }

        .legend-color.neutral {
          background: #fdcb6e;
        }

        .legend-color.negative {
          background: #e74c3c;
        }

        .trends-section, .improvement-chart, .trending-topics {
          margin-top: 25px;
          padding-top: 20px;
          border-top: 1px solid rgba(255,255,255,0.1);
        }

        .trends-section h4, .improvement-chart h4, .trending-topics h4 {
          color: var(--text-primary);
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .trend-items, .improvement-items {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .trend-item, .improvement-item {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .trend-date, .improvement-month {
          min-width: 80px;
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .trend-bar {
          flex: 1;
          height: 8px;
          background: rgba(255,255,255,0.1);
          border-radius: 4px;
          overflow: hidden;
        }

        .trend-fill {
          height: 100%;
          transition: all 0.3s ease;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 20px;
          margin: 20px 0;
        }

        .metric-item {
          text-align: center;
          padding: 20px;
          background: rgba(255,255,255,0.1);
          border-radius: 12px;
          backdrop-filter: blur(10px);
        }

        .metric-value {
          font-size: 2rem;
          font-weight: bold;
          color: var(--text-primary);
          margin-bottom: 5px;
        }

        .metric-label {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .improvement-score {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .score-value {
          font-weight: bold;
          color: var(--text-primary);
        }

        .score-stars {
          font-size: 0.8rem;
        }

        .keywords-section {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
          margin: 20px 0;
        }

        .keyword-category h4 {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 15px;
        }

        .positive-title {
          color: #00b894;
        }

        .negative-title {
          color: #e74c3c;
        }

        .keyword-cloud {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          min-height: 100px;
          align-content: flex-start;
        }

        .keyword-tag {
          padding: 6px 12px;
          border-radius: 20px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .keyword-tag.positive {
          background: rgba(0, 184, 148, 0.2);
          color: #00b894;
          border: 1px solid rgba(0, 184, 148, 0.3);
        }

        .keyword-tag.negative {
          background: rgba(231, 76, 60, 0.2);
          color: #e74c3c;
          border: 1px solid rgba(231, 76, 60, 0.3);
        }

        .keyword-tag:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .topics-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .topic-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: rgba(255,255,255,0.1);
          border-radius: 8px;
          backdrop-filter: blur(10px);
        }

        .topic-name {
          font-weight: 500;
          color: var(--text-primary);
        }

        .topic-mentions {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .error-card {
          text-align: center;
          color: #e74c3c;
          background: rgba(231, 76, 60, 0.1);
          border: 1px solid rgba(231, 76, 60, 0.3);
        }

        .error-card i {
          font-size: 3rem;
          margin-bottom: 15px;
        }

        .loading-container {
          text-align: center;
          color: white;
          margin: 50px 0;
        }

        .loading.large {
          width: 60px;
          height: 60px;
          border-width: 4px;
          margin: 0 auto 20px;
        }

        .loading.small {
          width: 16px;
          height: 16px;
          border-width: 2px;
        }

        .page-footer {
          display: flex;
          justify-content: center;
          gap: 15px;
          margin-top: 40px;
          flex-wrap: wrap;
        }

        @media (max-width: 768px) {
          .analytics-grid {
            grid-template-columns: 1fr;
          }

          .keywords-section {
            grid-template-columns: 1fr;
          }

          .metrics-grid {
            grid-template-columns: 1fr;
          }

          .config-required-card {
            padding: 40px 20px;
          }

          .features-list {
            grid-template-columns: 1fr;
          }

          .config-actions {
            flex-direction: column;
          }

          .page-footer {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}

export default AnalyticsDashboard

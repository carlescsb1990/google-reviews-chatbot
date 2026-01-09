import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useChatbotStore, Review } from '../store/chatbotStore'

const ReviewsPage: React.FC = () => {
  const { fetchReviews, generateResponse, loading } = useChatbotStore()
  const [reviews, setReviews] = useState<Review[]>([])
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [generatedResponse, setGeneratedResponse] = useState<string>('')
  const [responseLoading, setResponseLoading] = useState(false)

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await fetchReviews()
        setReviews(data)
      } catch (error) {
        console.error('Error loading reviews:', error)
      }
    }

    loadReviews()
  }, [fetchReviews])

  const handleGenerateResponse = async (review: Review) => {
    setSelectedReview(review)
    setResponseLoading(true)
    
    try {
      const response = await generateResponse(review.text)
      setGeneratedResponse(response.response)
    } catch (error) {
      console.error('Error generating response:', error)
      setGeneratedResponse('Error al generar respuesta')
    } finally {
      setResponseLoading(false)
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

  return (
    <div className="app">
      <div className="background-animation"></div>
      
      <div className="container">
        <div className="header">
          <h1>
            <i className="fas fa-star"></i> Reseñas de Clientes
          </h1>
          <p>Gestión y análisis de reseñas de Google My Business</p>
        </div>
        
        {loading ? (
          <div style={{ textAlign: 'center', color: 'white', marginTop: '50px' }}>
            <div className="loading" style={{ margin: '0 auto' }}></div>
            <p>Cargando reseñas...</p>
          </div>
        ) : (
          <div className="main-content">
            <div className="card status-card">
              <div className="card-title">
                <i className="fas fa-chart-bar"></i>
                Estadísticas de Reseñas
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2d3436' }}>
                    {reviews.length}
                  </div>
                  <div>Total Reseñas</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2d3436' }}>
                    {reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : '0'}
                  </div>
                  <div>Promedio</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2d3436' }}>
                    {reviews.filter(r => r.rating >= 4).length}
                  </div>
                  <div>Positivas</div>
                </div>
              </div>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <div className="card">
                <div className="card-title">
                  <i className="fas fa-comments"></i>
                  Lista de Reseñas ({reviews.length})
                </div>
                
                <div style={{ display: 'grid', gap: '20px' }}>
                  {reviews.map((review) => (
                    <div 
                      key={review.id}
                      style={{ 
                        background: 'rgba(255,255,255,0.1)', 
                        padding: '25px', 
                        borderRadius: '12px', 
                        borderLeft: `4px solid ${getRatingColor(review.rating)}`,
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        marginBottom: '15px' 
                      }}>
                        <div>
                          <strong style={{ color: '#2d3748', fontSize: '1.1rem' }}>
                            {review.reviewer}
                          </strong>
                          <div style={{ color: '#718096', fontSize: '0.9rem' }}>
                            <i className="fas fa-calendar"></i> {review.date}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ color: getRatingColor(review.rating), fontSize: '1.3rem', marginBottom: '5px' }}>
                            {renderStars(review.rating)}
                          </div>
                          <div style={{ fontSize: '0.9rem', color: '#718096' }}>
                            {review.rating}/5 estrellas
                          </div>
                        </div>
                      </div>
                      
                      <p style={{ 
                        margin: '15px 0', 
                        lineHeight: '1.6',
                        fontSize: '1rem',
                        fontStyle: 'italic'
                      }}>
                        "{review.text}"
                      </p>
                      
                      <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                        <button 
                          className="btn"
                          onClick={() => handleGenerateResponse(review)}
                          disabled={responseLoading}
                          style={{ fontSize: '0.9rem', padding: '10px 20px' }}
                        >
                          {responseLoading && selectedReview?.id === review.id ? (
                            <>
                              <div className="loading"></div>
                              Generando...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-robot"></i>
                              Generar Respuesta
                            </>
                          )}
                        </button>
                      </div>
                      
                      {selectedReview?.id === review.id && generatedResponse && (
                        <div style={{ 
                          marginTop: '20px', 
                          padding: '20px', 
                          background: 'rgba(0, 184, 148, 0.1)', 
                          borderRadius: '8px',
                          border: '1px solid rgba(0, 184, 148, 0.3)'
                        }}>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '10px', 
                            marginBottom: '10px' 
                          }}>
                            <i className="fas fa-robot" style={{ color: '#00b894' }}></i>
                            <strong>Respuesta Generada:</strong>
                          </div>
                          <div style={{ 
                            fontStyle: 'italic', 
                            lineHeight: '1.5',
                            color: '#2d3748'
                          }}>
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

        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <Link to="/" className="btn">
            <i className="fas fa-home"></i>
            Volver al Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ReviewsPage

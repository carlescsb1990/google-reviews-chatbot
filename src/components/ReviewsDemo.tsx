import React, { useState } from 'react'
import { useChatbotStore, Review } from '../store/chatbotStore'

const ReviewsDemo: React.FC = () => {
  const { fetchReviews, loading, error } = useChatbotStore()
  const [reviews, setReviews] = useState<Review[]>([])
  const [showReviews, setShowReviews] = useState(false)

  const handleFetchReviews = async () => {
    try {
      const fetchedReviews = await fetchReviews()
      setReviews(fetchedReviews)
      setShowReviews(true)
    } catch (err) {
      console.error('Error fetching reviews:', err)
      setShowReviews(true)
    }
  }

  const renderStars = (rating: number) => {
    const stars = '⭐'.repeat(rating)
    const emptyStars = '☆'.repeat(5 - rating)
    return stars + emptyStars
  }

  return (
    <div className="card">
      <div className="card-title">
        <i className="fas fa-star"></i>
        Ver Reseñas Demo
      </div>
      
      <p style={{ 
        marginBottom: '20px', 
        color: 'var(--text-secondary)' 
      }}>
        Explora las reseñas de ejemplo que el sistema puede procesar.
      </p>
      
      <button 
        className="btn btn-secondary" 
        onClick={handleFetchReviews}
        disabled={loading}
      >
        {loading ? (
          <>
            <div className="loading"></div>
            Cargando...
          </>
        ) : (
          <>
            <i className="fas fa-download"></i>
            Cargar Reseñas
          </>
        )}
      </button>
      
      {showReviews && (
        <div className={`response-area visible ${error ? 'error' : ''}`}>
          {error ? (
            <>
              <i className="fas fa-exclamation-triangle"></i> Error: {error}
            </>
          ) : (
            <div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px', 
                marginBottom: '20px' 
              }}>
                <i className="fas fa-star" style={{ fontSize: '1.5rem', color: '#f39c12' }}></i>
                <strong style={{ fontSize: '1.1rem' }}>
                  Reseñas Encontradas ({reviews.length}):
                </strong>
              </div>
              
              {reviews.map((review) => (
                <div 
                  key={review.id}
                  style={{ 
                    background: 'rgba(255,255,255,0.3)', 
                    padding: '20px', 
                    borderRadius: '12px', 
                    margin: '15px 0', 
                    borderLeft: '4px solid #f39c12' 
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: '10px' 
                  }}>
                    <strong style={{ color: '#2d3748' }}>
                      {review.reviewer}
                    </strong>
                    <span style={{ color: '#f39c12', fontSize: '1.2rem' }}>
                      {renderStars(review.rating)}
                    </span>
                  </div>
                  <p style={{ 
                    margin: '10px 0', 
                    fontStyle: 'italic', 
                    lineHeight: '1.4' 
                  }}>
                    "{review.text}"
                  </p>
                  <small style={{ color: '#718096' }}>
                    <i className="fas fa-calendar"></i> {review.date}
                  </small>
                </div>
              ))}
              
              <div style={{ 
                marginTop: '15px', 
                padding: '10px', 
                background: 'rgba(255,255,255,0.2)', 
                borderRadius: '6px', 
                fontSize: '0.9rem' 
              }}>
                <i className="fas fa-info-circle"></i> 
                <em> Fuente: Datos de demostración simulados</em>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ReviewsDemo

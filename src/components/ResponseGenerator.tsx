import React, { useState, useEffect } from 'react'
import { useChatbotStore } from '../store/chatbotStore'

const ResponseGenerator: React.FC = () => {
  const { generateResponse, loading, error } = useChatbotStore()
  const [userInput, setUserInput] = useState('')
  const [response, setResponse] = useState<any>(null)
  const [showResponse, setShowResponse] = useState(false)

  // Ejemplos de reseñas para rotar
  const exampleReviews = [
    "El servicio fue excelente y el personal muy amable. Definitivamente lo recomendaría a otros.",
    "The service was outstanding! Professional staff and great attention to detail.",
    "Muy decepcionado con la atención. El personal no fue nada amable y tardaron mucho.",
    "Amazing experience! Will definitely come back. Highly recommended!",
    "El producto llegó en perfectas condiciones y muy rápido. Gracias!"
  ]

  const [currentExampleIndex, setCurrentExampleIndex] = useState(0)

  // Rotar ejemplos cada 10 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentExampleIndex((prev) => (prev + 1) % exampleReviews.length)
      setUserInput(exampleReviews[currentExampleIndex])
    }, 10000)

    // Establecer ejemplo inicial
    setUserInput(exampleReviews[0])

    return () => clearInterval(interval)
  }, [currentExampleIndex, exampleReviews])

  const handleGenerateResponse = async () => {
    if (!userInput.trim()) {
      setResponse({ error: 'Por favor, escribe una reseña para generar una respuesta.' })
      setShowResponse(true)
      return
    }

    try {
      const result = await generateResponse(userInput)
      setResponse(result)
      setShowResponse(true)
    } catch (err) {
      setResponse({ error: err instanceof Error ? err.message : 'Error desconocido' })
      setShowResponse(true)
    }
  }

  return (
    <div className="card">
      <div className="card-title">
        <i className="fas fa-magic"></i>
        Probar Generación de Respuestas
      </div>
      
      <div className="form-group">
        <label htmlFor="userInput">Escribe una reseña de cliente:</label>
        <textarea 
          id="userInput"
          className="form-control" 
          rows={4} 
          placeholder="Ejemplo: El servicio fue excelente y el personal muy amable. Definitivamente lo recomendaría..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
      </div>
      
      <button 
        className="btn" 
        onClick={handleGenerateResponse}
        disabled={loading}
      >
        {loading ? (
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
      
      {showResponse && (
        <div className={`response-area visible ${response?.error ? 'error' : ''}`}>
          {response?.error ? (
            <>
              <i className="fas fa-exclamation-triangle"></i> Error: {response.error}
            </>
          ) : (
            <div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px', 
                marginBottom: '15px' 
              }}>
                <i className="fas fa-robot" style={{ fontSize: '1.5rem', color: '#00b894' }}></i>
                <strong style={{ fontSize: '1.1rem' }}>Respuesta Generada por IA:</strong>
              </div>
              <div style={{ 
                background: 'rgba(255,255,255,0.3)', 
                padding: '15px', 
                borderRadius: '8px', 
                fontSize: '1rem', 
                lineHeight: '1.5' 
              }}>
                {response?.response}
              </div>
              {response?.note && (
                <div style={{ 
                  marginTop: '10px', 
                  fontSize: '0.9rem', 
                  opacity: 0.7 
                }}>
                  <i className="fas fa-info-circle"></i> {response.note}
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {error && (
        <div className="response-area visible error">
          <i className="fas fa-exclamation-triangle"></i> Error: {error}
        </div>
      )}
    </div>
  )
}

export default ResponseGenerator

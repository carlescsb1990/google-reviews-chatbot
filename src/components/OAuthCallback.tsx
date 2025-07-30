import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { oauthService } from '../services/realApiService'
import { useChatbotStore } from '../store/chatbotStore'

const OAuthCallback: React.FC = () => {
  const navigate = useNavigate()
  const { setGoogleToken, refreshConfig } = useChatbotStore()
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing')
  const [message, setMessage] = useState('Procesando autenticación...')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search)
        const code = urlParams.get('code')
        const state = urlParams.get('state')
        const error = urlParams.get('error')

        if (error) {
          throw new Error(`Error de autenticación: ${error}`)
        }

        if (!code) {
          throw new Error('Código de autorización no encontrado')
        }

        if (!state) {
          throw new Error('Estado de OAuth no encontrado')
        }

        setMessage('Intercambiando código por token de acceso...')
        const accessToken = await oauthService.handleOAuthCallback(code, state)

        setMessage('Configurando autenticación...')
        setGoogleToken(accessToken)
        refreshConfig()

        setStatus('success')
        setMessage('¡Autenticación exitosa! Redirigiendo...')

        // Redirigir después de 2 segundos
        setTimeout(() => {
          navigate('/reviews')
        }, 2000)

      } catch (error) {
        console.error('Error en OAuth callback:', error)
        setStatus('error')
        setMessage(error instanceof Error ? error.message : 'Error desconocido')

        // Redirigir a la página de reseñas después de 5 segundos
        setTimeout(() => {
          navigate('/reviews')
        }, 5000)
      }
    }

    handleCallback()
  }, [navigate, setGoogleToken, refreshConfig])

  return (
    <div className="oauth-callback">
      <div className="background-animation"></div>
      
      <div className="callback-container">
        <div className="callback-card">
          <div className="callback-header">
            <div className={`status-icon ${status}`}>
              {status === 'processing' && (
                <div className="loading"></div>
              )}
              {status === 'success' && (
                <i className="fas fa-check-circle"></i>
              )}
              {status === 'error' && (
                <i className="fas fa-exclamation-triangle"></i>
              )}
            </div>
            
            <h1>
              {status === 'processing' && 'Autenticando...'}
              {status === 'success' && '¡Éxito!'}
              {status === 'error' && 'Error'}
            </h1>
          </div>

          <div className="callback-content">
            <p className="status-message">{message}</p>
            
            {status === 'success' && (
              <div className="success-details">
                <div className="success-item">
                  <i className="fas fa-check text-success"></i>
                  <span>Token de acceso obtenido</span>
                </div>
                <div className="success-item">
                  <i className="fas fa-check text-success"></i>
                  <span>Autenticación configurada</span>
                </div>
                <div className="success-item">
                  <i className="fas fa-check text-success"></i>
                  <span>Acceso a Google My Business habilitado</span>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="error-actions">
                <button 
                  className="btn btn-secondary"
                  onClick={() => navigate('/reviews')}
                >
                  <i className="fas fa-arrow-left"></i>
                  Volver a Reseñas
                </button>
                <button 
                  className="btn"
                  onClick={() => window.location.reload()}
                >
                  <i className="fas fa-redo"></i>
                  Intentar de Nuevo
                </button>
              </div>
            )}

            {status === 'processing' && (
              <div className="processing-info">
                <p className="small-text">
                  Este proceso puede tomar unos segundos. 
                  No cierres esta ventana.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .oauth-callback {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .callback-container {
          max-width: 500px;
          width: 90%;
          margin: 0 auto;
          z-index: 10;
        }

        .callback-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 40px;
          text-align: center;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .callback-header {
          margin-bottom: 30px;
        }

        .status-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
        }

        .status-icon.processing {
          background: rgba(102, 126, 234, 0.1);
          border: 3px solid rgba(102, 126, 234, 0.3);
        }

        .status-icon.success {
          background: rgba(0, 184, 148, 0.1);
          border: 3px solid rgba(0, 184, 148, 0.3);
          color: #00b894;
        }

        .status-icon.error {
          background: rgba(255, 107, 107, 0.1);
          border: 3px solid rgba(255, 107, 107, 0.3);
          color: #e74c3c;
        }

        .callback-header h1 {
          color: #2d3436;
          margin: 0;
          font-size: 1.8rem;
          font-weight: 700;
        }

        .callback-content {
          color: #636e72;
        }

        .status-message {
          font-size: 1.1rem;
          margin-bottom: 20px;
          line-height: 1.5;
        }

        .success-details {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin: 20px 0;
          text-align: left;
        }

        .success-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 0;
        }

        .text-success {
          color: #00b894;
        }

        .error-actions {
          display: flex;
          gap: 15px;
          justify-content: center;
          margin-top: 20px;
        }

        .processing-info {
          margin-top: 20px;
        }

        .small-text {
          font-size: 0.9rem;
          color: #95a5a6;
          margin: 0;
        }

        .btn {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }

        .btn-secondary {
          background: #95a5a6;
        }

        .btn-secondary:hover {
          background: #7f8c8d;
          box-shadow: 0 5px 15px rgba(149, 165, 166, 0.4);
        }

        .loading {
          width: 30px;
          height: 30px;
          border: 3px solid rgba(102, 126, 234, 0.3);
          border-radius: 50%;
          border-top-color: #667eea;
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 768px) {
          .callback-card {
            padding: 30px 20px;
          }

          .status-icon {
            width: 60px;
            height: 60px;
            font-size: 1.5rem;
          }

          .callback-header h1 {
            font-size: 1.5rem;
          }

          .error-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}

export default OAuthCallback

import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useChatbotStore } from '../store/chatbotStore'

const HealthCheck: React.FC = () => {
  const { checkHealth } = useChatbotStore()
  const [healthData, setHealthData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const data = await checkHealth()
        setHealthData(data)
      } catch (error) {
        console.error('Error checking health:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHealth()
  }, [checkHealth])

  if (loading) {
    return (
      <div className="app">
        <div className="background-animation"></div>
        <div className="container">
          <div style={{ textAlign: 'center', color: 'white', marginTop: '50px' }}>
            <div className="loading" style={{ margin: '0 auto' }}></div>
            <p>Verificando estado del sistema...</p>
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
            <i className="fas fa-heartbeat"></i> Estado del Sistema
          </h1>
          <p>Monitoreo de salud y diagnóstico</p>
        </div>
        
        <div className="main-content">
          <div className="card status-card">
            <div className="card-title">
              <i className="fas fa-check-circle"></i>
              Sistema Saludable
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <p><strong>Estado:</strong> {healthData?.status}</p>
              <p><strong>Modo:</strong> {healthData?.mode}</p>
              <p><strong>Timestamp:</strong> {new Date(healthData?.timestamp).toLocaleString()}</p>
            </div>

            <h4 style={{ marginBottom: '15px' }}>Dependencias:</h4>
            <div className="dependency-list">
              {Object.entries(healthData?.dependencies || {}).map(([key, value]) => (
                <div key={key} className="dependency-item">
                  <i className={`fas ${value ? 'fa-check' : 'fa-times'}`} 
                     style={{ color: value ? '#00b894' : '#e17055' }}></i>
                  <div>{key}</div>
                  <small>{value ? 'Disponible' : 'No disponible'}</small>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-title">
              <i className="fas fa-cog"></i>
              Configuración
            </div>
            
            <ul className="endpoint-list">
              {Object.entries(healthData?.configuration || {}).map(([key, value]) => (
                <li key={key}>
                  <span className={`endpoint-method ${value ? '' : 'error'}`}
                        style={{ backgroundColor: value ? '#00b894' : '#e17055' }}>
                    {value ? 'OK' : 'NO'}
                  </span>
                  <strong>{key.replace('_', ' ')}</strong>
                </li>
              ))}
            </ul>
          </div>
        </div>

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

export default HealthCheck

import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useChatbotStore } from '../store/chatbotStore'

const ApiStatus: React.FC = () => {
  const { getApiStatus } = useChatbotStore()
  const [apiData, setApiData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApiStatus = async () => {
      try {
        const data = await getApiStatus()
        setApiData(data)
      } catch (error) {
        console.error('Error fetching API status:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchApiStatus()
  }, [getApiStatus])

  if (loading) {
    return (
      <div className="app">
        <div className="background-animation"></div>
        <div className="container">
          <div style={{ textAlign: 'center', color: 'white', marginTop: '50px' }}>
            <div className="loading" style={{ margin: '0 auto' }}></div>
            <p>Obteniendo estado de la API...</p>
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
            <i className="fas fa-server"></i> Estado de la API
          </h1>
          <p>Información detallada del sistema y API</p>
        </div>
        
        <div className="main-content">
          <div className="card status-card">
            <div className="card-title">
              <i className="fas fa-info-circle"></i>
              Información de la Aplicación
            </div>
            
            <div style={{ display: 'grid', gap: '15px' }}>
              <div>
                <strong>Aplicación:</strong> {apiData?.application}
              </div>
              <div>
                <strong>Versión:</strong> {apiData?.version}
              </div>
              <div>
                <strong>Tecnología:</strong> {apiData?.technology}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-title">
              <i className="fas fa-rocket"></i>
              Características
            </div>
            
            <div className="dependency-list">
              {Object.entries(apiData?.features || {}).map(([key, value]) => (
                <div key={key} className="dependency-item">
                  <i className={`fas ${value ? 'fa-check' : 'fa-times'}`} 
                     style={{ color: value ? '#00b894' : '#e17055' }}></i>
                  <div>{key.replace(/_/g, ' ')}</div>
                  <small>{value ? 'Activo' : 'Inactivo'}</small>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ gridColumn: '1 / -1' }}>
            <div className="card-title">
              <i className="fas fa-route"></i>
              Endpoints Disponibles
            </div>
            
            <div style={{ display: 'grid', gap: '15px' }}>
              {apiData?.endpoints?.map((endpoint: any, index: number) => (
                <div 
                  key={index}
                  style={{ 
                    background: 'rgba(255,255,255,0.1)', 
                    padding: '20px', 
                    borderRadius: '8px',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span 
                      className="endpoint-method"
                      style={{ 
                        backgroundColor: endpoint.method === 'GET' ? '#00b894' : '#0984e3',
                        minWidth: '50px',
                        textAlign: 'center'
                      }}
                    >
                      {endpoint.method}
                    </span>
                    <div>
                      <Link 
                        to={endpoint.path}
                        style={{ 
                          color: '#2d3748', 
                          textDecoration: 'none',
                          fontWeight: 'bold',
                          fontSize: '1.1rem'
                        }}
                      >
                        {endpoint.path}
                      </Link>
                      <div style={{ color: '#718096', fontSize: '0.9rem', marginTop: '5px' }}>
                        {endpoint.description}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ gridColumn: '1 / -1' }}>
            <div className="card-title">
              <i className="fas fa-code"></i>
              Información Técnica
            </div>
            
            <div style={{ 
              background: 'rgba(0,0,0,0.1)', 
              padding: '20px', 
              borderRadius: '8px',
              fontFamily: 'monospace'
            }}>
              <pre style={{ margin: 0, overflow: 'auto' }}>
                {JSON.stringify(apiData, null, 2)}
              </pre>
            </div>
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

export default ApiStatus

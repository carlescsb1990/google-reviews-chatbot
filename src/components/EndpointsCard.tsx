import React from 'react'
import { Link } from 'react-router-dom'

const EndpointsCard: React.FC = () => {
  const endpoints = [
    { path: '/', method: 'GET', description: 'Dashboard principal', color: '#00b894' },
    { path: '/reviews', method: 'GET', description: 'Página de reseñas', color: '#0984e3' },
    { path: '/health', method: 'GET', description: 'Estado del sistema', color: '#00b894' },
    { path: '/api/status', method: 'GET', description: 'Estado de la API', color: '#00b894' }
  ]

  return (
    <div className="card">
      <div className="card-title">
        <i className="fas fa-route"></i>
        Rutas Disponibles
      </div>
      
      <ul className="endpoint-list">
        {endpoints.map((endpoint, index) => (
          <li key={index}>
            <span 
              className="endpoint-method" 
              style={{ backgroundColor: endpoint.color }}
            >
              {endpoint.method}
            </span>
            <Link 
              to={endpoint.path}
              style={{ 
                color: 'inherit', 
                textDecoration: 'none',
                fontWeight: 'bold'
              }}
            >
              {endpoint.path}
            </Link>
            <span style={{ marginLeft: '10px', opacity: 0.8 }}>
              - {endpoint.description}
            </span>
          </li>
        ))}
      </ul>
      
      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        background: 'rgba(102, 126, 234, 0.1)', 
        borderRadius: '8px',
        border: '1px solid rgba(102, 126, 234, 0.2)'
      }}>
        <strong>
          <i className="fas fa-rocket"></i> Navegación SPA:
        </strong>
        <br />
        <small style={{ opacity: 0.8 }}>
          Aplicación de página única con enrutamiento del lado del cliente
        </small>
      </div>
    </div>
  )
}

export default EndpointsCard

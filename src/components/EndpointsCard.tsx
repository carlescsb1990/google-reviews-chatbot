import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const EndpointsCard: React.FC = () => {
  const navigate = useNavigate()

  const endpoints = [
    {
      path: '/',
      method: 'GET',
      description: 'Dashboard principal',
      color: '#00b894',
      icon: 'fas fa-home',
      buttonStyle: 'primary'
    },
    {
      path: '/reviews',
      method: 'GET',
      description: 'Página de reseñas',
      color: '#0984e3',
      icon: 'fas fa-star',
      buttonStyle: 'secondary'
    },
    {
      path: '/docs',
      method: 'GET',
      description: 'Documentación completa',
      color: '#e17055',
      icon: 'fas fa-book',
      buttonStyle: 'docs'
    },
    {
      path: '/health',
      method: 'GET',
      description: 'Estado del sistema',
      color: '#00b894',
      icon: 'fas fa-heartbeat',
      buttonStyle: 'success'
    },
    {
      path: '/api/status',
      method: 'GET',
      description: 'Estado de la API',
      color: '#6c5ce7',
      icon: 'fas fa-server',
      buttonStyle: 'info'
    }
  ]

  const getButtonClass = (style: string) => {
    const baseClass = 'navigation-btn'
    switch (style) {
      case 'primary': return `${baseClass} btn-nav-primary`
      case 'secondary': return `${baseClass} btn-nav-secondary`
      case 'success': return `${baseClass} btn-nav-success`
      case 'info': return `${baseClass} btn-nav-info`
      default: return baseClass
    }
  }

  return (
    <div className="card">
      <div className="card-title">
        <i className="fas fa-route"></i>
        Navegación Rápida
      </div>

      <div style={{ marginBottom: '25px' }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
          Explora todas las funcionalidades de la aplicación:
        </p>

        <div className="navigation-grid">
          {endpoints.map((endpoint, index) => (
            <button
              key={index}
              className={getButtonClass(endpoint.buttonStyle)}
              onClick={() => navigate(endpoint.path)}
              style={{
                background: `linear-gradient(135deg, ${endpoint.color}, ${endpoint.color}dd)`,
              }}
            >
              <div className="btn-nav-content">
                <i className={endpoint.icon}></i>
                <div className="btn-nav-text">
                  <div className="btn-nav-title">{endpoint.path}</div>
                  <div className="btn-nav-desc">{endpoint.description}</div>
                </div>
                <span className="endpoint-method-small">{endpoint.method}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="endpoint-list-detailed">
        <h4 style={{ marginBottom: '15px', color: 'var(--text-primary)' }}>
          <i className="fas fa-list"></i> Endpoints Técnicos:
        </h4>
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
      </div>

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

      <style>{`
        .navigation-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
        }

        .navigation-btn {
          border: none;
          border-radius: 12px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          color: white;
          text-align: left;
          position: relative;
          overflow: hidden;
        }

        .navigation-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.2);
        }

        .navigation-btn:active {
          transform: translateY(-1px);
        }

        .btn-nav-content {
          display: flex;
          align-items: center;
          gap: 15px;
          position: relative;
          z-index: 1;
        }

        .btn-nav-content i {
          font-size: 1.5rem;
          min-width: 30px;
        }

        .btn-nav-text {
          flex: 1;
        }

        .btn-nav-title {
          font-weight: 700;
          font-size: 1.1rem;
          margin-bottom: 4px;
        }

        .btn-nav-desc {
          font-size: 0.9rem;
          opacity: 0.9;
        }

        .endpoint-method-small {
          background: rgba(255,255,255,0.2);
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .navigation-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255,255,255,0.1);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .navigation-btn:hover::before {
          opacity: 1;
        }

        .endpoint-list-detailed {
          border-top: 1px solid rgba(0,0,0,0.1);
          padding-top: 20px;
          margin-top: 20px;
        }

        @media (max-width: 768px) {
          .navigation-grid {
            grid-template-columns: 1fr;
          }

          .btn-nav-content {
            gap: 10px;
          }

          .btn-nav-content i {
            font-size: 1.3rem;
          }
        }
      `}</style>
    </div>
  )
}

export default EndpointsCard

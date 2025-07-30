import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const GlobalNavigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Dashboard', icon: 'fas fa-home' },
    { path: '/reviews', label: 'Reseñas', icon: 'fas fa-star' },
    { path: '/docs', label: 'Docs', icon: 'fas fa-book' },
    { path: '/health', label: 'Estado', icon: 'fas fa-heartbeat' },
    { path: '/api/status', label: 'API', icon: 'fas fa-server' }
  ]

  return (
    <>
      {/* Botón flotante de navegación */}
      <button 
        className="nav-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle navigation"
      >
        <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'}`}></i>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="nav-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Panel de navegación */}
      <nav className={`global-nav ${isOpen ? 'open' : ''}`}>
        <div className="nav-header">
          <i className="fas fa-robot"></i>
          <h3>Reviews Chatbot</h3>
        </div>

        <ul className="nav-menu">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link 
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                <i className={item.icon}></i>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="nav-footer">
          <div className="version-info">
            <small>v2.0.0 - Web</small>
          </div>
          <a 
            href="https://github.com/shamspias/google-review-chatbot-dashboard" 
            target="_blank" 
            rel="noopener noreferrer"
            className="github-link"
          >
            <i className="fab fa-github"></i>
            <span>GitHub</span>
          </a>
        </div>
      </nav>

      <style>{`
        .nav-toggle {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 1001;
          background: var(--success-gradient);
          border: none;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          color: white;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 15px rgba(79, 172, 254, 0.3);
        }

        .nav-toggle:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(79, 172, 254, 0.4);
        }

        .nav-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          z-index: 999;
          backdrop-filter: blur(5px);
        }

        .global-nav {
          position: fixed;
          top: 0;
          right: -300px;
          width: 300px;
          height: 100vh;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(20px);
          z-index: 1000;
          transition: right 0.3s ease-in-out;
          box-shadow: -5px 0 20px rgba(0,0,0,0.1);
          display: flex;
          flex-direction: column;
          border-left: 1px solid rgba(255,255,255,0.2);
        }

        .global-nav.open {
          right: 0;
        }

        .nav-header {
          padding: 30px 20px 20px;
          border-bottom: 1px solid rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--primary-gradient);
          color: white;
        }

        .nav-header i {
          font-size: 1.5rem;
        }

        .nav-header h3 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .nav-menu {
          flex: 1;
          list-style: none;
          padding: 20px 0;
          margin: 0;
        }

        .nav-menu li {
          margin-bottom: 5px;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px 20px;
          color: var(--text-primary);
          text-decoration: none;
          transition: all 0.3s;
          border-right: 3px solid transparent;
        }

        .nav-link:hover {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
        }

        .nav-link.active {
          background: rgba(102, 126, 234, 0.2);
          color: #667eea;
          border-right-color: #667eea;
          font-weight: 600;
        }

        .nav-link i {
          width: 20px;
          text-align: center;
        }

        .nav-footer {
          padding: 20px;
          border-top: 1px solid rgba(0,0,0,0.1);
          background: rgba(0,0,0,0.02);
        }

        .version-info {
          text-align: center;
          margin-bottom: 15px;
          color: var(--text-secondary);
        }

        .github-link {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px;
          background: #24292e;
          color: white;
          text-decoration: none;
          border-radius: 8px;
          transition: all 0.3s;
        }

        .github-link:hover {
          background: #1a1e22;
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .global-nav {
            width: 250px;
          }
          
          .nav-toggle {
            width: 45px;
            height: 45px;
            font-size: 1.1rem;
          }
        }

        @media (max-width: 480px) {
          .global-nav {
            width: 100vw;
            right: -100vw;
          }
          
          .global-nav.open {
            right: 0;
          }
        }
      `}</style>
    </>
  )
}

export default GlobalNavigation

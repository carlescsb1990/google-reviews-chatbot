import React from 'react'
import { useChatbotStore } from '../store/chatbotStore'

const StatusCard: React.FC = () => {
  const { config } = useChatbotStore()

  const isFullFunctionality = config.googleConfigured && config.openaiConfigured

  return (
    <div className="card status-card">
      <div className="card-title">
        <i className={`fas ${isFullFunctionality ? 'fa-check-circle' : 'fa-exclamation-triangle'} pulse`}></i>
        {isFullFunctionality ? 'Funcionalidad Completa' : 'Modo Demostración'}
      </div>
      
      <p style={{ marginBottom: '20px' }}>
        {isFullFunctionality 
          ? 'Todas las funciones están disponibles y configuradas correctamente.'
          : 'La aplicación funciona en modo demostración con datos simulados y respuestas inteligentes.'
        }
      </p>
      
      <div className="dependency-list">
        <div className="dependency-item">
          <i className="fab fa-react"></i>
          <div>React</div>
          <small>Frontend Framework</small>
        </div>
        <div className="dependency-item">
          <i className="fas fa-bolt"></i>
          <div>Vite</div>
          <small>Build Tool</small>
        </div>
        <div className="dependency-item">
          <i className="fab fa-js-square"></i>
          <div>TypeScript</div>
          <small>Type Safety</small>
        </div>
        <div className="dependency-item">
          <i className="fas fa-brain"></i>
          <div>IA Simulada</div>
          <small>Smart Responses</small>
        </div>
      </div>
      
      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        background: 'rgba(255,255,255,0.2)', 
        borderRadius: '8px' 
      }}>
        <strong>
          <i className="fas fa-info-circle"></i> Tecnología Web Moderna:
        </strong>
        <br />
        <span style={{ 
          background: 'rgba(0,0,0,0.1)', 
          padding: '2px 6px', 
          borderRadius: '4px', 
          marginTop: '5px', 
          display: 'inline-block',
          fontFamily: 'monospace'
        }}>
          React + Vite + TypeScript + Zustand
        </span>
      </div>
    </div>
  )
}

export default StatusCard

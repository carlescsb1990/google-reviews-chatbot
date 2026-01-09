import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useChatbotStore } from '../store/chatbotStore'
import ResponseGenerator from './ResponseGenerator'
import ReviewsDemo from './ReviewsDemo'
import StatusCard from './StatusCard'
import EndpointsCard from './EndpointsCard'

const ChatbotDashboard: React.FC = () => {
  const { config } = useChatbotStore()

  return (
    <div className="app">
      <div className="background-animation"></div>

      <div className="container">
        <div className="header">
          <h1>
            <i className="fas fa-robot"></i> Google Reviews Chatbot
          </h1>
          <p>Sistema Inteligente de Respuestas Automatizadas</p>

          {/* Botón de documentación destacado */}
          <div style={{ marginTop: '20px' }}>
            <Link to="/docs" className="docs-button">
              <i className="fas fa-book"></i>
              <span>Documentación Completa</span>
              <small>Aprende a configurar y usar la aplicación</small>
            </Link>
          </div>
        </div>

        <div className="main-content">
          <StatusCard />
          <EndpointsCard />
          <ResponseGenerator />
          <ReviewsDemo />
        </div>

        <style>{`
          .docs-button {
            display: inline-flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            padding: 20px 30px;
            background: linear-gradient(135deg, #e17055 0%, #f39c12 100%);
            color: white;
            text-decoration: none;
            border-radius: 16px;
            box-shadow: 0 6px 20px rgba(225, 112, 85, 0.3);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
          }

          .docs-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 30px rgba(225, 112, 85, 0.4);
          }

          .docs-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.5s;
          }

          .docs-button:hover::before {
            left: 100%;
          }

          .docs-button i {
            font-size: 1.5rem;
          }

          .docs-button span {
            font-weight: 600;
            font-size: 1.1rem;
          }

          .docs-button small {
            opacity: 0.9;
            font-size: 0.9rem;
            text-align: center;
            max-width: 200px;
          }

          @media (max-width: 768px) {
            .docs-button {
              padding: 15px 25px;
            }

            .docs-button span {
              font-size: 1rem;
            }

            .docs-button small {
              font-size: 0.8rem;
            }
          }
        `}</style>
      </div>
    </div>
  )
}

export default ChatbotDashboard

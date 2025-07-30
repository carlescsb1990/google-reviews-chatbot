import React, { useState, useEffect } from 'react'
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
        </div>
        
        <div className="main-content">
          <StatusCard />
          <EndpointsCard />
          <ResponseGenerator />
          <ReviewsDemo />
        </div>
      </div>
    </div>
  )
}

export default ChatbotDashboard

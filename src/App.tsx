import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ChatbotDashboard from './components/ChatbotDashboard'
import HealthCheck from './components/HealthCheck'
import ReviewsPage from './components/ReviewsPage'
import ApiStatus from './components/ApiStatus'
import Documentation from './components/Documentation'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<ChatbotDashboard />} />
          <Route path="/health" element={<HealthCheck />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/api/status" element={<ApiStatus />} />
          <Route path="/docs" element={<Documentation />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

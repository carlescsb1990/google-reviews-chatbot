import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ChatbotDashboard from './components/ChatbotDashboard'
import HealthCheck from './components/HealthCheck'
import ReviewsPageNew from './components/ReviewsPageNew'
import ApiStatus from './components/ApiStatus'
import Documentation from './components/Documentation'
import GlobalNavigation from './components/GlobalNavigation'
import OAuthCallback from './components/OAuthCallback'
import AnalyticsDashboard from './components/AnalyticsDashboard'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <GlobalNavigation />
        <Routes>
          <Route path="/" element={<ChatbotDashboard />} />
          <Route path="/health" element={<HealthCheck />} />
          <Route path="/reviews" element={<ReviewsPageNew />} />
          <Route path="/analytics" element={<AnalyticsDashboard />} />
          <Route path="/api/status" element={<ApiStatus />} />
          <Route path="/docs" element={<Documentation />} />
          <Route path="/auth/callback" element={<OAuthCallback />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

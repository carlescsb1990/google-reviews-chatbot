import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Documentation: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', label: 'Visión General', icon: 'fas fa-eye' },
    { id: 'setup', label: 'Configuración', icon: 'fas fa-cog' },
    { id: 'apis', label: 'APIs & Cuentas', icon: 'fas fa-key' },
    { id: 'deployment', label: 'Despliegue', icon: 'fas fa-rocket' },
    { id: 'original', label: 'Proyecto Original', icon: 'fab fa-github' }
  ]

  return (
    <div className="app">
      <div className="background-animation"></div>
      
      <div className="container">
        <div className="header">
          <h1>
            <i className="fas fa-book"></i> Documentación
          </h1>
          <p>Guía completa para Google Reviews Chatbot</p>
        </div>

        <div className="documentation-container">
          {/* Navegación de tabs */}
          <div className="tabs-navigation">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <i className={tab.icon}></i>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Contenido de tabs */}
          <div className="tab-content">
            {activeTab === 'overview' && (
              <div className="card">
                <div className="card-title">
                  <i className="fas fa-info-circle"></i>
                  ¿Qué es Google Reviews Chatbot?
                </div>

                <div className="content-section">
                  <h3>🤖 Descripción</h3>
                  <p>
                    Google Reviews Chatbot es una aplicación inteligente que automatiza las respuestas 
                    a reseñas de Google My Business utilizando inteligencia artificial. El sistema puede:
                  </p>
                  <ul>
                    <li>📊 Obtener reseñas automáticamente de Google My Business</li>
                    <li>🧠 Analizar el sentimiento de cada reseña</li>
                    <li>✍️ Generar respuestas profesionales y contextuales</li>
                    <li>⏰ Procesar reseñas de forma programada</li>
                    <li>📱 Proporcionar una interfaz web moderna para gestión</li>
                  </ul>
                </div>

                <div className="content-section">
                  <h3>🏗️ Arquitectura</h3>
                  <div className="architecture-grid">
                    <div className="arch-item">
                      <i className="fab fa-react"></i>
                      <h4>Frontend</h4>
                      <p>React + TypeScript + Vite</p>
                    </div>
                    <div className="arch-item">
                      <i className="fas fa-brain"></i>
                      <h4>IA</h4>
                      <p>OpenAI GPT-3/4 + Análisis de sentimientos</p>
                    </div>
                    <div className="arch-item">
                      <i className="fab fa-google"></i>
                      <h4>APIs</h4>
                      <p>Google My Business API</p>
                    </div>
                    <div className="arch-item">
                      <i className="fas fa-tasks"></i>
                      <h4>Tareas</h4>
                      <p>Celery + Redis (versión Python)</p>
                    </div>
                  </div>
                </div>

                <div className="content-section">
                  <h3>✨ Características Principales</h3>
                  <div className="features-grid">
                    <div className="feature-item">
                      <i className="fas fa-magic"></i>
                      <div>
                        <h4>Respuestas Inteligentes</h4>
                        <p>Genera respuestas contextuales basadas en el sentimiento y contenido de la reseña</p>
                      </div>
                    </div>
                    <div className="feature-item">
                      <i className="fas fa-globe"></i>
                      <div>
                        <h4>Multiidioma</h4>
                        <p>Soporte para español e inglés con detección automática del idioma</p>
                      </div>
                    </div>
                    <div className="feature-item">
                      <i className="fas fa-mobile-alt"></i>
                      <div>
                        <h4>Responsive</h4>
                        <p>Interfaz optimizada para desktop, tablet y móvil</p>
                      </div>
                    </div>
                    <div className="feature-item">
                      <i className="fas fa-clock"></i>
                      <div>
                        <h4>Tiempo Real</h4>
                        <p>Monitoreo y procesamiento en tiempo real de nuevas reseñas</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'setup' && (
              <div className="card">
                <div className="card-title">
                  <i className="fas fa-cog"></i>
                  Configuración del Proyecto
                </div>

                <div className="content-section">
                  <h3>🚀 Inicio Rápido</h3>
                  <div className="code-block">
                    <pre>{`# Clonar el repositorio
git clone https://github.com/tu-usuario/google-reviews-chatbot
cd google-reviews-chatbot

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Abrir en el navegador
http://localhost:3000`}</pre>
                  </div>
                </div>

                <div className="content-section">
                  <h3>📋 Prerrequisitos</h3>
                  <ul>
                    <li><strong>Node.js</strong> versión 16 o superior</li>
                    <li><strong>npm</strong>, <strong>yarn</strong> o <strong>pnpm</strong></li>
                    <li><strong>Cuenta de Google Cloud</strong> (para API de Google My Business)</li>
                    <li><strong>Cuenta de OpenAI</strong> (para GPT-3/4)</li>
                    <li><strong>Redis</strong> (solo para versión Python con Celery)</li>
                  </ul>
                </div>

                <div className="content-section">
                  <h3>🗂️ Estructura del Proyecto</h3>
                  <div className="file-tree">
                    <pre>{`google-reviews-chatbot/
├── src/
│   ├── components/          # Componentes React
│   │   ├── ChatbotDashboard.tsx
│   │   ├── ReviewsPage.tsx
│   │   ├── ResponseGenerator.tsx
│   │   └── ...
│   ├── store/              # Estado global (Zustand)
│   │   └── chatbotStore.ts
│   ├── App.tsx             # Componente raíz
│   └── main.tsx            # Punto de entrada
├── public/                 # Archivos estáticos
├── package.json            # Dependencias
├── vite.config.ts          # Configuración de Vite
└── README.md              # Documentación`}</pre>
                  </div>
                </div>

                <div className="content-section">
                  <h3>⚙️ Scripts Disponibles</h3>
                  <div className="scripts-grid">
                    <div className="script-item">
                      <code>npm run dev</code>
                      <p>Servidor de desarrollo con hot reload</p>
                    </div>
                    <div className="script-item">
                      <code>npm run build</code>
                      <p>Construir para producción</p>
                    </div>
                    <div className="script-item">
                      <code>npm run preview</code>
                      <p>Preview del build de producción</p>
                    </div>
                    <div className="script-item">
                      <code>npm run lint</code>
                      <p>Ejecutar linter de código</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'apis' && (
              <div className="card">
                <div className="card-title">
                  <i className="fas fa-key"></i>
                  Configuración de APIs y Cuentas
                </div>

                <div className="content-section">
                  <h3>🔑 Google My Business API</h3>
                  <div className="step-by-step">
                    <div className="step">
                      <div className="step-number">1</div>
                      <div className="step-content">
                        <h4>Crear Proyecto en Google Cloud</h4>
                        <p>Ve a <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer">Google Cloud Console</a> y crea un nuevo proyecto.</p>
                      </div>
                    </div>
                    <div className="step">
                      <div className="step-number">2</div>
                      <div className="step-content">
                        <h4>Habilitar API</h4>
                        <p>Busca "Google My Business API" en la biblioteca de APIs y habilítala.</p>
                      </div>
                    </div>
                    <div className="step">
                      <div className="step-number">3</div>
                      <div className="step-content">
                        <h4>Crear Credenciales</h4>
                        <p>Ve a "Credenciales" → "Crear credenciales" → "Clave de API"</p>
                      </div>
                    </div>
                    <div className="step">
                      <div className="step-number">4</div>
                      <div className="step-content">
                        <h4>Solicitar Acceso</h4>
                        <p>Llena el formulario en: <a href="https://docs.google.com/forms/d/e/1FAIpQLSfC_FKSWzbSae_5rOpgwFeIUzXUF1JCQnlsZM_gC1I2UHjA3w/viewform" target="_blank" rel="noopener noreferrer">Formulario de Acceso GMB</a></p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="content-section">
                  <h3>🧠 OpenAI API</h3>
                  <div className="step-by-step">
                    <div className="step">
                      <div className="step-number">1</div>
                      <div className="step-content">
                        <h4>Crear Cuenta</h4>
                        <p>Regístrate en <a href="https://platform.openai.com/" target="_blank" rel="noopener noreferrer">OpenAI Platform</a></p>
                      </div>
                    </div>
                    <div className="step">
                      <div className="step-number">2</div>
                      <div className="step-content">
                        <h4>Obtener API Key</h4>
                        <p>Ve a <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">API Keys</a> y crea una nueva clave</p>
                      </div>
                    </div>
                    <div className="step">
                      <div className="step-number">3</div>
                      <div className="step-content">
                        <h4>Configurar Billing</h4>
                        <p>Añade un método de pago para usar la API</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="content-section">
                  <h3>🔒 Variables de Entorno</h3>
                  <p>Crea un archivo <code>.env.local</code> en la raíz del proyecto:</p>
                  <div className="code-block">
                    <pre>{`# Google My Business
VITE_GOOGLE_API_KEY=your_google_api_key_here
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# OpenAI
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Redis (solo para versión Python)
VITE_REDIS_URL=redis://localhost:6379/0

# Configuración de la App
VITE_APP_ENV=development
VITE_API_BASE_URL=http://localhost:3000`}</pre>
                  </div>
                </div>

                <div className="content-section">
                  <h3>⚠️ Seguridad</h3>
                  <div className="warning-box">
                    <i className="fas fa-exclamation-triangle"></i>
                    <div>
                      <h4>Importante:</h4>
                      <ul>
                        <li>Nunca commits las claves API al repositorio</li>
                        <li>Usa variables de entorno para todas las credenciales</li>
                        <li>Restringe las claves API por dominio en producción</li>
                        <li>Rota las claves periódicamente</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'deployment' && (
              <div className="card">
                <div className="card-title">
                  <i className="fas fa-rocket"></i>
                  Despliegue y Hosting
                </div>

                <div className="content-section">
                  <h3>🌐 Opciones de Hosting</h3>
                  <div className="hosting-grid">
                    <div className="hosting-option">
                      <i className="fas fa-bolt"></i>
                      <h4>Vercel (Recomendado)</h4>
                      <p>Deploy automático desde Git, optimizado para React</p>
                      <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="btn btn-small">
                        Ir a Vercel
                      </a>
                    </div>
                    <div className="hosting-option">
                      <i className="fas fa-leaf"></i>
                      <h4>Netlify</h4>
                      <p>Hosting gratuito con CI/CD integrado</p>
                      <a href="https://netlify.com" target="_blank" rel="noopener noreferrer" className="btn btn-small">
                        Ir a Netlify
                      </a>
                    </div>
                    <div className="hosting-option">
                      <i className="fab fa-github"></i>
                      <h4>GitHub Pages</h4>
                      <p>Hosting gratuito para repositorios públicos</p>
                      <a href="https://pages.github.com" target="_blank" rel="noopener noreferrer" className="btn btn-small">
                        Documentación
                      </a>
                    </div>
                    <div className="hosting-option">
                      <i className="fab fa-aws"></i>
                      <h4>AWS S3 + CloudFront</h4>
                      <p>Hosting escalable y rápido en AWS</p>
                      <a href="https://aws.amazon.com/s3/" target="_blank" rel="noopener noreferrer" className="btn btn-small">
                        Ir a AWS
                      </a>
                    </div>
                  </div>
                </div>

                <div className="content-section">
                  <h3>📦 Build para Producción</h3>
                  <div className="code-block">
                    <pre>{`# Construir para producción
npm run build

# Los archivos se generan en /dist
# Subir contenido de /dist a tu servidor web

# Preview local del build
npm run preview`}</pre>
                  </div>
                </div>

                <div className="content-section">
                  <h3>⚙️ Configuración de Deploy en Vercel</h3>
                  <div className="step-by-step">
                    <div className="step">
                      <div className="step-number">1</div>
                      <div className="step-content">
                        <h4>Conectar Repositorio</h4>
                        <p>Conecta tu repositorio de GitHub a Vercel</p>
                      </div>
                    </div>
                    <div className="step">
                      <div className="step-number">2</div>
                      <div className="step-content">
                        <h4>Configurar Variables</h4>
                        <p>Añade las variables de entorno en el dashboard de Vercel</p>
                      </div>
                    </div>
                    <div className="step">
                      <div className="step-number">3</div>
                      <div className="step-content">
                        <h4>Deploy Automático</h4>
                        <p>Cada push a main desplegará automáticamente</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="content-section">
                  <h3>🔧 Variables de Entorno en Producción</h3>
                  <div className="env-vars">
                    <div className="env-var">
                      <code>VITE_GOOGLE_API_KEY</code>
                      <span>Clave API de Google Cloud</span>
                    </div>
                    <div className="env-var">
                      <code>VITE_OPENAI_API_KEY</code>
                      <span>Clave API de OpenAI</span>
                    </div>
                    <div className="env-var">
                      <code>VITE_APP_ENV</code>
                      <span>production</span>
                    </div>
                    <div className="env-var">
                      <code>VITE_API_BASE_URL</code>
                      <span>URL base de tu API en producción</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'original' && (
              <div className="card">
                <div className="card-title">
                  <i className="fab fa-github"></i>
                  Proyecto Original de GitHub
                </div>

                <div className="content-section">
                  <h3>📜 Historia del Proyecto</h3>
                  <p>
                    Este proyecto está basado en el <strong>Google Reviews Chatbot</strong> original, 
                    un sistema desarrollado en Python que automatiza las respuestas a reseñas de 
                    Google My Business usando inteligencia artificial.
                  </p>
                </div>

                <div className="content-section">
                  <h3>🔄 Migración a Web</h3>
                  <div className="migration-comparison">
                    <div className="version-box">
                      <h4>
                        <i className="fab fa-python"></i>
                        Versión Original (Python)
                      </h4>
                      <ul>
                        <li>Flask como servidor web</li>
                        <li>Celery para tareas programadas</li>
                        <li>Redis como broker de mensajes</li>
                        <li>Google My Business API</li>
                        <li>OpenAI GPT-3 integration</li>
                        <li>Despliegue en AWS EC2</li>
                      </ul>
                    </div>
                    <div className="arrow">
                      <i className="fas fa-arrow-right"></i>
                    </div>
                    <div className="version-box">
                      <h4>
                        <i className="fab fa-react"></i>
                        Versión Web (React)
                      </h4>
                      <ul>
                        <li>React + TypeScript frontend</li>
                        <li>Vite como build tool</li>
                        <li>Zustand para estado global</li>
                        <li>Simulación de APIs</li>
                        <li>IA mock inteligente</li>
                        <li>Deploy estático (Vercel/Netlify)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="content-section">
                  <h3>🔗 Enlaces Relacionados</h3>
                  <div className="links-grid">
                    <a href="https://github.com/shamspias/google-review-chatbot-dashboard" 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       className="link-card">
                      <i className="fab fa-github"></i>
                      <div>
                        <h4>Dashboard Original</h4>
                        <p>Dashboard Django Rest para el chatbot de reseñas</p>
                      </div>
                    </a>
                    <a href="https://docs.google.com/forms/d/e/1FAIpQLSfC_FKSWzbSae_5rOpgwFeIUzXUF1JCQnlsZM_gC1I2UHjA3w/viewform" 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       className="link-card">
                      <i className="fab fa-google"></i>
                      <div>
                        <h4>Acceso Google My Business</h4>
                        <p>Formulario para solicitar acceso a la API</p>
                      </div>
                    </a>
                    <a href="https://platform.openai.com/" 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       className="link-card">
                      <i className="fas fa-brain"></i>
                      <div>
                        <h4>OpenAI Platform</h4>
                        <p>Plataforma para obtener claves API de GPT</p>
                      </div>
                    </a>
                  </div>
                </div>

                <div className="content-section">
                  <h3>💡 Ventajas de la Versión Web</h3>
                  <div className="advantages-grid">
                    <div className="advantage">
                      <i className="fas fa-rocket"></i>
                      <h4>Deploy Más Fácil</h4>
                      <p>No requiere servidor, solo archivos estáticos</p>
                    </div>
                    <div className="advantage">
                      <i className="fas fa-dollar-sign"></i>
                      <h4>Menor Costo</h4>
                      <p>Hosting gratuito en Vercel/Netlify</p>
                    </div>
                    <div className="advantage">
                      <i className="fas fa-bolt"></i>
                      <h4>Más Rápido</h4>
                      <p>Interfaz reactiva sin recargas de página</p>
                    </div>
                    <div className="advantage">
                      <i className="fas fa-mobile-alt"></i>
                      <h4>Mobile Friendly</h4>
                      <p>Optimizado para todos los dispositivos</p>
                    </div>
                  </div>
                </div>

                <div className="content-section">
                  <h3>🔮 Roadmap de Funcionalidades</h3>
                  <div className="roadmap">
                    <div className="roadmap-item completed">
                      <i className="fas fa-check"></i>
                      <div>
                        <h4>Interfaz Web Moderna</h4>
                        <p>Migración completa a React + TypeScript</p>
                      </div>
                    </div>
                    <div className="roadmap-item completed">
                      <i className="fas fa-check"></i>
                      <div>
                        <h4>Sistema de IA Mock</h4>
                        <p>Simulación inteligente de respuestas</p>
                      </div>
                    </div>
                    <div className="roadmap-item in-progress">
                      <i className="fas fa-cog fa-spin"></i>
                      <div>
                        <h4>Integración Real APIs</h4>
                        <p>Conexión con Google My Business y OpenAI</p>
                      </div>
                    </div>
                    <div className="roadmap-item planned">
                      <i className="fas fa-clock"></i>
                      <div>
                        <h4>Sistema de Autenticación</h4>
                        <p>Login seguro y gestión de usuarios</p>
                      </div>
                    </div>
                    <div className="roadmap-item planned">
                      <i className="fas fa-clock"></i>
                      <div>
                        <h4>Dashboard de Analytics</h4>
                        <p>Métricas avanzadas y reportes</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <Link to="/" className="btn">
            <i className="fas fa-home"></i>
            Volver al Dashboard
          </Link>
        </div>

        <style>{`
          .documentation-container {
            max-width: 1000px;
            margin: 0 auto;
          }

          .tabs-navigation {
            display: flex;
            gap: 10px;
            margin-bottom: 30px;
            overflow-x: auto;
            padding: 10px 0;
          }

          .tab-button {
            background: rgba(255,255,255,0.1);
            border: none;
            padding: 15px 20px;
            border-radius: 12px;
            color: white;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            gap: 8px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
            white-space: nowrap;
            min-width: fit-content;
          }

          .tab-button:hover {
            background: rgba(255,255,255,0.2);
            transform: translateY(-2px);
          }

          .tab-button.active {
            background: rgba(255,255,255,0.9);
            color: #2d3748;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          }

          .tab-content {
            min-height: 600px;
          }

          .content-section {
            margin-bottom: 30px;
          }

          .content-section h3 {
            color: var(--text-primary);
            margin-bottom: 15px;
            font-size: 1.3rem;
          }

          .content-section p {
            line-height: 1.6;
            margin-bottom: 15px;
            color: var(--text-secondary);
          }

          .content-section ul {
            padding-left: 20px;
            color: var(--text-secondary);
          }

          .content-section ul li {
            margin-bottom: 8px;
            line-height: 1.5;
          }

          .architecture-grid, .features-grid, .hosting-grid, .advantages-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 20px 0;
          }

          .arch-item, .feature-item, .hosting-option, .advantage {
            background: rgba(255,255,255,0.1);
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
          }

          .arch-item i, .advantage i {
            font-size: 2rem;
            margin-bottom: 10px;
            color: #4facfe;
          }

          .arch-item h4, .advantage h4 {
            margin-bottom: 8px;
            color: var(--text-primary);
          }

          .feature-item {
            display: flex;
            align-items: flex-start;
            gap: 15px;
            text-align: left;
          }

          .feature-item i {
            font-size: 1.5rem;
            color: #00b894;
            margin-top: 5px;
          }

          .feature-item h4 {
            margin-bottom: 5px;
            color: var(--text-primary);
          }

          .code-block {
            background: #2d3748;
            color: #e2e8f0;
            padding: 20px;
            border-radius: 8px;
            overflow-x: auto;
            margin: 15px 0;
          }

          .code-block pre {
            margin: 0;
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 0.9rem;
            line-height: 1.5;
          }

          .file-tree {
            background: rgba(255,255,255,0.1);
            padding: 20px;
            border-radius: 8px;
            backdrop-filter: blur(10px);
          }

          .step-by-step {
            margin: 20px 0;
          }

          .step {
            display: flex;
            align-items: flex-start;
            gap: 20px;
            margin-bottom: 25px;
            padding: 20px;
            background: rgba(255,255,255,0.05);
            border-radius: 12px;
            backdrop-filter: blur(10px);
          }

          .step-number {
            background: var(--success-gradient);
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            flex-shrink: 0;
          }

          .step-content h4 {
            margin-bottom: 8px;
            color: var(--text-primary);
          }

          .step-content p {
            margin: 0;
            color: var(--text-secondary);
          }

          .step-content a {
            color: #4facfe;
            text-decoration: none;
          }

          .step-content a:hover {
            text-decoration: underline;
          }

          .scripts-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 20px 0;
          }

          .script-item {
            background: rgba(255,255,255,0.1);
            padding: 15px;
            border-radius: 8px;
            backdrop-filter: blur(10px);
          }

          .script-item code {
            background: rgba(0,0,0,0.2);
            padding: 4px 8px;
            border-radius: 4px;
            display: block;
            margin-bottom: 8px;
            font-weight: bold;
          }

          .warning-box {
            background: rgba(255, 193, 7, 0.1);
            border: 1px solid rgba(255, 193, 7, 0.3);
            border-radius: 8px;
            padding: 20px;
            display: flex;
            gap: 15px;
            margin: 20px 0;
          }

          .warning-box i {
            color: #ffc107;
            font-size: 1.5rem;
            flex-shrink: 0;
          }

          .warning-box h4 {
            margin-bottom: 10px;
            color: var(--text-primary);
          }

          .env-vars {
            background: rgba(255,255,255,0.05);
            padding: 20px;
            border-radius: 8px;
            margin: 15px 0;
          }

          .env-var {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid rgba(255,255,255,0.1);
          }

          .env-var:last-child {
            border-bottom: none;
          }

          .env-var code {
            background: rgba(0,0,0,0.2);
            padding: 4px 8px;
            border-radius: 4px;
            font-weight: bold;
          }

          .migration-comparison {
            display: grid;
            grid-template-columns: 1fr auto 1fr;
            gap: 20px;
            align-items: center;
            margin: 30px 0;
          }

          .version-box {
            background: rgba(255,255,255,0.1);
            padding: 25px;
            border-radius: 12px;
            backdrop-filter: blur(10px);
          }

          .version-box h4 {
            margin-bottom: 15px;
            color: var(--text-primary);
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .arrow {
            font-size: 2rem;
            color: #4facfe;
          }

          .links-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin: 20px 0;
          }

          .link-card {
            background: rgba(255,255,255,0.1);
            padding: 20px;
            border-radius: 12px;
            text-decoration: none;
            color: inherit;
            display: flex;
            align-items: center;
            gap: 15px;
            transition: all 0.3s;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
          }

          .link-card:hover {
            background: rgba(255,255,255,0.2);
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.2);
          }

          .link-card i {
            font-size: 2rem;
            color: #4facfe;
          }

          .link-card h4 {
            margin-bottom: 5px;
            color: var(--text-primary);
          }

          .link-card p {
            margin: 0;
            color: var(--text-secondary);
            font-size: 0.9rem;
          }

          .btn-small {
            padding: 8px 16px;
            font-size: 0.9rem;
            border-radius: 6px;
            text-decoration: none;
            background: var(--success-gradient);
            color: white;
            display: inline-block;
            margin-top: 10px;
            transition: all 0.3s;
          }

          .btn-small:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(79, 172, 254, 0.3);
          }

          .roadmap {
            margin: 20px 0;
          }

          .roadmap-item {
            display: flex;
            align-items: center;
            gap: 20px;
            padding: 20px;
            margin-bottom: 15px;
            border-radius: 12px;
            backdrop-filter: blur(10px);
          }

          .roadmap-item.completed {
            background: rgba(0, 184, 148, 0.1);
            border: 1px solid rgba(0, 184, 148, 0.3);
          }

          .roadmap-item.in-progress {
            background: rgba(255, 193, 7, 0.1);
            border: 1px solid rgba(255, 193, 7, 0.3);
          }

          .roadmap-item.planned {
            background: rgba(116, 139, 164, 0.1);
            border: 1px solid rgba(116, 139, 164, 0.3);
          }

          .roadmap-item i {
            font-size: 1.5rem;
            flex-shrink: 0;
          }

          .roadmap-item.completed i {
            color: #00b894;
          }

          .roadmap-item.in-progress i {
            color: #ffc107;
          }

          .roadmap-item.planned i {
            color: #748ba4;
          }

          .roadmap-item h4 {
            margin-bottom: 5px;
            color: var(--text-primary);
          }

          .roadmap-item p {
            margin: 0;
            color: var(--text-secondary);
            font-size: 0.9rem;
          }

          @media (max-width: 768px) {
            .tabs-navigation {
              flex-wrap: wrap;
            }

            .tab-button {
              flex: 1;
              min-width: 120px;
            }

            .migration-comparison {
              grid-template-columns: 1fr;
              text-align: center;
            }

            .arrow {
              transform: rotate(90deg);
            }

            .architecture-grid, .features-grid, .hosting-grid, .advantages-grid {
              grid-template-columns: 1fr;
            }

            .step {
              flex-direction: column;
              text-align: center;
            }
          }
        `}</style>
      </div>
    </div>
  )
}

export default Documentation

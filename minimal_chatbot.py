#!/usr/bin/env python3

import json
import os
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import sys

class ChatbotHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed_path = urlparse(self.path)
        
        if parsed_path.path == '/':
            self.serve_homepage()
        elif parsed_path.path == '/reviews':
            self.serve_reviews()
        elif parsed_path.path == '/health':
            self.serve_health()
        else:
            self.send_error(404, "Not Found")
    
    def do_POST(self):
        parsed_path = urlparse(self.path)
        
        if parsed_path.path == '/generate-response':
            self.handle_generate_response()
        else:
            self.send_error(404, "Not Found")
    
    def serve_homepage(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()
        
        html = """
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>🤖 Google Reviews Chatbot - IA</title>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
            <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                :root {
                    --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    --secondary-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                    --success-gradient: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
                    --warning-gradient: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
                    --card-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    --text-primary: #2d3748;
                    --text-secondary: #718096;
                    --border-radius: 16px;
                    --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                body {
                    font-family: 'Inter', sans-serif;
                    background: var(--primary-gradient);
                    min-height: 100vh;
                    overflow-x: hidden;
                }

                .background-animation {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: -1;
                    background: var(--primary-gradient);
                }

                .background-animation::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-image:
                        radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
                        radial-gradient(circle at 40% 80%, rgba(255,255,255,0.1) 0%, transparent 50%);
                    animation: float 20s ease-in-out infinite;
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(1deg); }
                }

                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 20px;
                    position: relative;
                    z-index: 1;
                }

                .header {
                    text-align: center;
                    margin-bottom: 40px;
                    animation: slideDown 0.8s ease-out;
                }

                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-30px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .header h1 {
                    font-size: 3.5rem;
                    font-weight: 700;
                    color: white;
                    margin-bottom: 10px;
                    text-shadow: 0 4px 15px rgba(0,0,0,0.2);
                }

                .header p {
                    font-size: 1.3rem;
                    color: rgba(255,255,255,0.9);
                    font-weight: 300;
                }

                .main-content {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 30px;
                    margin-bottom: 40px;
                }

                @media (max-width: 768px) {
                    .main-content {
                        grid-template-columns: 1fr;
                    }
                    .header h1 {
                        font-size: 2.5rem;
                    }
                }

                .card {
                    background: rgba(255,255,255,0.95);
                    backdrop-filter: blur(20px);
                    border-radius: var(--border-radius);
                    padding: 30px;
                    box-shadow: var(--card-shadow);
                    border: 1px solid rgba(255,255,255,0.2);
                    transition: var(--transition);
                    animation: slideUp 0.8s ease-out;
                }

                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.15);
                }

                .status-card {
                    grid-column: 1 / -1;
                    background: linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%);
                    color: #2d3436;
                    position: relative;
                    overflow: hidden;
                }

                .status-card::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    right: -50%;
                    width: 100%;
                    height: 100%;
                    background: rgba(255,255,255,0.1);
                    transform: rotate(45deg);
                    animation: shimmer 3s ease-in-out infinite;
                }

                @keyframes shimmer {
                    0%, 100% { opacity: 0; }
                    50% { opacity: 1; }
                }

                .card-title {
                    font-size: 1.5rem;
                    font-weight: 600;
                    color: var(--text-primary);
                    margin-bottom: 20px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .status-card .card-title {
                    color: #2d3436;
                }

                .feature-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 20px;
                    margin: 30px 0;
                }

                .feature-item {
                    background: rgba(255,255,255,0.1);
                    padding: 20px;
                    border-radius: 12px;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255,255,255,0.2);
                    transition: var(--transition);
                }

                .feature-item:hover {
                    background: rgba(255,255,255,0.2);
                    transform: scale(1.02);
                }

                .feature-item i {
                    font-size: 2rem;
                    margin-bottom: 10px;
                    color: #2d3436;
                }

                .feature-item h4 {
                    font-weight: 600;
                    margin-bottom: 8px;
                    color: #2d3436;
                }

                .feature-item p {
                    font-size: 0.9rem;
                    color: #636e72;
                }

                .form-group {
                    margin-bottom: 25px;
                }

                .form-group label {
                    display: block;
                    font-weight: 500;
                    color: var(--text-primary);
                    margin-bottom: 8px;
                    font-size: 1rem;
                }

                .form-control {
                    width: 100%;
                    padding: 15px 20px;
                    border: 2px solid #e2e8f0;
                    border-radius: 12px;
                    font-size: 1rem;
                    font-family: inherit;
                    background: white;
                    transition: var(--transition);
                    resize: vertical;
                }

                .form-control:focus {
                    outline: none;
                    border-color: #667eea;
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                }

                .btn {
                    background: var(--success-gradient);
                    color: white;
                    border: none;
                    padding: 15px 30px;
                    border-radius: 12px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: var(--transition);
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    box-shadow: 0 4px 15px rgba(79, 172, 254, 0.3);
                }

                .btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(79, 172, 254, 0.4);
                }

                .btn:active {
                    transform: translateY(0);
                }

                .btn-secondary {
                    background: var(--secondary-gradient);
                    box-shadow: 0 4px 15px rgba(240, 147, 251, 0.3);
                }

                .btn-secondary:hover {
                    box-shadow: 0 8px 25px rgba(240, 147, 251, 0.4);
                }

                .response-area {
                    margin-top: 20px;
                    padding: 25px;
                    background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
                    border-radius: 12px;
                    border-left: 5px solid #00b894;
                    display: none;
                    animation: slideIn 0.5s ease-out;
                }

                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(-20px); }
                    to { opacity: 1; transform: translateX(0); }
                }

                .response-area.error {
                    background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
                    border-left-color: #e17055;
                }

                .loading {
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    border: 3px solid rgba(255,255,255,0.3);
                    border-top: 3px solid #4facfe;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-right: 10px;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .endpoint-list {
                    list-style: none;
                    padding: 0;
                }

                .endpoint-list li {
                    background: rgba(255,255,255,0.1);
                    margin: 10px 0;
                    padding: 15px 20px;
                    border-radius: 8px;
                    border-left: 4px solid #00b894;
                    backdrop-filter: blur(10px);
                }

                .endpoint-method {
                    display: inline-block;
                    background: #00b894;
                    color: white;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    margin-right: 10px;
                }

                .dependency-list {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 15px;
                    margin: 20px 0;
                }

                .dependency-item {
                    background: rgba(255,255,255,0.1);
                    padding: 15px;
                    border-radius: 8px;
                    backdrop-filter: blur(10px);
                    text-align: center;
                    border: 1px solid rgba(255,255,255,0.2);
                }

                .dependency-item i {
                    font-size: 1.5rem;
                    margin-bottom: 8px;
                    color: #2d3436;
                }

                .pulse {
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }

                .glass-effect {
                    background: rgba(255, 255, 255, 0.25);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.18);
                }
            </style>
        </head>
        <body>
            <div class="background-animation"></div>

            <div class="container">
                <div class="header">
                    <h1><i class="fas fa-robot"></i> Google Reviews Chatbot</h1>
                    <p>Sistema Inteligente de Respuestas Automatizadas</p>
                </div>

                <div class="main-content">
                    <div class="card status-card">
                        <div class="card-title">
                            <i class="fas fa-exclamation-triangle pulse"></i>
                            Modo de Funcionalidad Limitada
                        </div>
                        <p style="margin-bottom: 20px;">La aplicación está funcionando en modo limitado porque algunas dependencias de Python no están disponibles en este entorno.</p>

                        <div class="dependency-list">
                            <div class="dependency-item">
                                <i class="fab fa-python"></i>
                                <div>Flask</div>
                                <small>Framework Web</small>
                            </div>
                            <div class="dependency-item">
                                <i class="fab fa-google"></i>
                                <div>Google APIs</div>
                                <small>My Business</small>
                            </div>
                            <div class="dependency-item">
                                <i class="fas fa-brain"></i>
                                <div>OpenAI</div>
                                <small>GPT Intelligence</small>
                            </div>
                            <div class="dependency-item">
                                <i class="fas fa-tasks"></i>
                                <div>Celery</div>
                                <small>Task Queue</small>
                            </div>
                        </div>

                        <div style="margin-top: 20px; padding: 15px; background: rgba(255,255,255,0.2); border-radius: 8px;">
                            <strong><i class="fas fa-info-circle"></i> Para habilitar todas las funciones:</strong><br>
                            <code style="background: rgba(0,0,0,0.1); padding: 2px 6px; border-radius: 4px; margin-top: 5px; display: inline-block;">pip install flask google-auth google-api-python-client openai celery python-dotenv</code>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-title">
                            <i class="fas fa-api"></i>
                            Endpoints Disponibles
                        </div>
                        <ul class="endpoint-list">
                            <li>
                                <span class="endpoint-method">GET</span>
                                <strong>/</strong> - Página principal
                            </li>
                            <li>
                                <span class="endpoint-method">GET</span>
                                <strong>/reviews</strong> - Datos de reseñas (modo demo)
                            </li>
                            <li>
                                <span class="endpoint-method">POST</span>
                                <strong>/generate-response</strong> - Generar respuesta
                            </li>
                            <li>
                                <span class="endpoint-method">GET</span>
                                <strong>/health</strong> - Estado del sistema
                            </li>
                        </ul>
                    </div>

                    <div class="card">
                        <div class="card-title">
                            <i class="fas fa-flask"></i>
                            Probar Generación de Respuestas
                        </div>

                        <div class="form-group">
                            <label for="userInput">Escribe una reseña de cliente:</label>
                            <textarea
                                id="userInput"
                                class="form-control"
                                rows="4"
                                placeholder="Ejemplo: El servicio fue excelente y el personal muy amable. Definitivamente lo recomendaría..."
                            >El servicio fue excelente y el personal muy amable. Definitivamente lo recomendaría a otros.</textarea>
                        </div>

                        <button class="btn" onclick="generateResponse()">
                            <i class="fas fa-magic"></i>
                            Generar Respuesta IA
                        </button>

                        <div id="responseArea" class="response-area"></div>
                    </div>

                    <div class="card">
                        <div class="card-title">
                            <i class="fas fa-star"></i>
                            Ver Reseñas Demo
                        </div>
                        <p style="margin-bottom: 20px; color: var(--text-secondary);">Explora las reseñas de ejemplo que el sistema puede procesar.</p>

                        <button class="btn btn-secondary" onclick="fetchReviews()">
                            <i class="fas fa-download"></i>
                            Cargar Reseñas
                        </button>

                        <div id="reviewsArea" class="response-area"></div>
                    </div>
                </div>
            </div>

            <script>
                // Agregar texto de ejemplo en diferentes idiomas
                const exampleReviews = [
                    "El servicio fue excelente y el personal muy amable. Definitivamente lo recomendaría a otros.",
                    "The service was outstanding! Professional staff and great attention to detail.",
                    "Muy decepcionado con la atención. El personal no fue nada amable y tardaron mucho.",
                    "Amazing experience! Will definitely come back. Highly recommended!",
                    "El producto llegó en perfectas condiciones y muy rápido. Gracias!"
                ];

                let currentExampleIndex = 0;

                function rotateExample() {
                    const textarea = document.getElementById('userInput');
                    textarea.value = exampleReviews[currentExampleIndex];
                    currentExampleIndex = (currentExampleIndex + 1) % exampleReviews.length;
                }

                // Rotar ejemplos cada 10 segundos
                setInterval(rotateExample, 10000);

                async function generateResponse() {
                    const userInput = document.getElementById('userInput').value;
                    const responseArea = document.getElementById('responseArea');

                    if (!userInput.trim()) {
                        showResponse('Por favor, escribe una reseña para generar una respuesta.', true);
                        return;
                    }

                    responseArea.style.display = 'block';
                    responseArea.className = 'response-area';
                    responseArea.innerHTML = '<div class="loading"></div>Generando respuesta inteligente...';

                    try {
                        const response = await fetch('/generate-response', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ user_input: userInput })
                        });

                        const data = await response.json();

                        if (response.ok) {
                            showResponse(`
                                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                                    <i class="fas fa-robot" style="font-size: 1.5rem; color: #00b894;"></i>
                                    <strong style="font-size: 1.1rem;">Respuesta Generada por IA:</strong>
                                </div>
                                <div style="background: rgba(255,255,255,0.3); padding: 15px; border-radius: 8px; font-size: 1rem; line-height: 1.5;">
                                    ${data.response}
                                </div>
                                <div style="margin-top: 10px; font-size: 0.9rem; opacity: 0.7;">
                                    <i class="fas fa-info-circle"></i> Esto es una respuesta simulada. La IA real requiere configuración de OpenAI.
                                </div>
                            `);
                        } else {
                            showResponse(`<i class="fas fa-exclamation-triangle"></i> Error: ${data.error || 'Error desconocido'}`, true);
                        }
                    } catch (error) {
                        showResponse(`<i class="fas fa-wifi"></i> Error de conexión: ${error.message}`, true);
                    }
                }

                async function fetchReviews() {
                    const reviewsArea = document.getElementById('reviewsArea');

                    reviewsArea.style.display = 'block';
                    reviewsArea.className = 'response-area';
                    reviewsArea.innerHTML = '<div class="loading"></div>Cargando reseñas de demostración...';

                    try {
                        const response = await fetch('/reviews');
                        const data = await response.json();

                        if (response.ok) {
                            let html = `
                                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
                                    <i class="fas fa-star" style="font-size: 1.5rem; color: #f39c12;"></i>
                                    <strong style="font-size: 1.1rem;">Reseñas Encontradas (${data.reviews.length}):</strong>
                                </div>
                            `;

                            data.reviews.forEach((review, index) => {
                                const stars = '⭐'.repeat(review.rating || 5);
                                const starsEmpty = '☆'.repeat(5 - (review.rating || 5));

                                html += `
                                    <div style="background: rgba(255,255,255,0.3); padding: 20px; border-radius: 12px; margin: 15px 0; border-left: 4px solid #f39c12;">
                                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                                            <strong style="color: #2d3748;">${review.reviewer || 'Cliente Anónimo'}</strong>
                                            <span style="color: #f39c12; font-size: 1.2rem;">${stars}${starsEmpty}</span>
                                        </div>
                                        <p style="margin: 10px 0; font-style: italic; line-height: 1.4;">
                                            "${review.text || review.comment || 'Sin comentario disponible'}"
                                        </p>
                                        <small style="color: #718096;">
                                            <i class="fas fa-calendar"></i> ${review.date || 'Fecha no disponible'}
                                        </small>
                                    </div>
                                `;
                            });

                            html += `
                                <div style="margin-top: 15px; padding: 10px; background: rgba(255,255,255,0.2); border-radius: 6px; font-size: 0.9rem;">
                                    <i class="fas fa-info-circle"></i>
                                    <em>Fuente: ${data.status === 'mock_data' ? 'Datos de demostración' : 'API de Google My Business'}</em>
                                </div>
                            `;

                            reviewsArea.innerHTML = html;
                        } else {
                            showResponseInArea('reviewsArea', `<i class="fas fa-exclamation-triangle"></i> Error: ${data.error || 'Error desconocido'}`, true);
                        }
                    } catch (error) {
                        showResponseInArea('reviewsArea', `<i class="fas fa-wifi"></i> Error de conexión: ${error.message}`, true);
                    }
                }

                function showResponse(message, isError = false) {
                    showResponseInArea('responseArea', message, isError);
                }

                function showResponseInArea(areaId, message, isError = false) {
                    const area = document.getElementById(areaId);
                    area.style.display = 'block';
                    area.className = isError ? 'response-area error' : 'response-area';
                    area.innerHTML = message;
                }

                // Efectos adicionales de UI
                document.addEventListener('DOMContentLoaded', function() {
                    // Agregar efecto de hover a las tarjetas
                    const cards = document.querySelectorAll('.card');
                    cards.forEach(card => {
                        card.addEventListener('mouseenter', function() {
                            this.style.transform = 'translateY(-5px)';
                        });

                        card.addEventListener('mouseleave', function() {
                            this.style.transform = 'translateY(0)';
                        });
                    });

                    // Animación de aparición secuencial
                    cards.forEach((card, index) => {
                        card.style.animationDelay = `${index * 0.1}s`;
                    });
                });
            </script>
        </body>
        </html>
        """
        
        self.wfile.write(html.encode())
    
    def serve_reviews(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        # Mock reviews data
        mock_reviews = {
            "reviews": [
                {
                    "id": "1",
                    "reviewer": "María García",
                    "rating": 5,
                    "text": "Excelente servicio! El personal fue muy profesional y amable. Definitivamente volveré y lo recomendaré a mis amigos.",
                    "date": "2025-07-30"
                },
                {
                    "id": "2",
                    "reviewer": "Carlos López",
                    "rating": 4,
                    "text": "Buena experiencia en general. El servicio fue rápido y eficiente, aunque el precio podría ser un poco mejor.",
                    "date": "2025-07-29"
                },
                {
                    "id": "3",
                    "reviewer": "John Smith",
                    "rating": 5,
                    "text": "Outstanding service! The team went above and beyond my expectations. Highly professional and friendly staff.",
                    "date": "2025-07-28"
                },
                {
                    "id": "4",
                    "reviewer": "Ana Martínez",
                    "rating": 3,
                    "text": "El servicio estuvo bien, pero tuvieron algunos problemas con mi pedido. Al final lo resolvieron correctamente.",
                    "date": "2025-07-27"
                },
                {
                    "id": "5",
                    "reviewer": "Sarah Johnson",
                    "rating": 5,
                    "text": "Amazing experience! Everything was perfect from start to finish. Will definitely be back!",
                    "date": "2025-07-26"
                }
            ],
            "status": "mock_data",
            "note": "Estos son datos de demostración. La integración real con Google My Business requiere configuración de API adecuada y dependencias."
        }
        
        self.wfile.write(json.dumps(mock_reviews, indent=2).encode())
    
    def serve_health(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        
        health_status = {
            "status": "running",
            "mode": "limited",
            "message": "Server is running but with limited functionality due to missing dependencies",
            "missing_dependencies": [
                "flask",
                "google-auth", 
                "google-api-python-client",
                "openai",
                "celery",
                "python-dotenv"
            ]
        }
        
        self.wfile.write(json.dumps(health_status, indent=2).encode())
    
    def handle_generate_response(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        try:
            data = json.loads(post_data.decode('utf-8'))
            user_input = data.get('user_input', '')
            
            # Mock response generation (without OpenAI)
            mock_response = self.generate_mock_response(user_input)
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            response_data = {
                "response": mock_response,
                "status": "mock",
                "note": "This is a mock response. Real GPT-3 integration requires OpenAI API key and dependencies."
            }
            
            self.wfile.write(json.dumps(response_data).encode())
            
        except Exception as e:
            self.send_error(400, f"Bad Request: {str(e)}")
    
    def generate_mock_response(self, user_input):
        """Generate a mock response based on simple keyword matching"""
        user_input_lower = user_input.lower()
        
        if any(word in user_input_lower for word in ['excellent', 'great', 'amazing', 'wonderful', 'fantastic']):
            return "Thank you so much for your wonderful review! We're thrilled to hear about your positive experience and truly appreciate you taking the time to share your feedback."
        
        elif any(word in user_input_lower for word in ['good', 'nice', 'okay', 'decent']):
            return "Thank you for your feedback! We're glad you had a good experience. We're always working to improve our services and appreciate your review."
        
        elif any(word in user_input_lower for word in ['bad', 'terrible', 'awful', 'disappointing', 'poor']):
            return "We sincerely apologize for your disappointing experience. Your feedback is important to us, and we'd like to make this right. Please contact us directly so we can address your concerns."
        
        elif any(word in user_input_lower for word in ['problem', 'issue', 'complaint']):
            return "Thank you for bringing this to our attention. We take all feedback seriously and would appreciate the opportunity to resolve any issues. Please reach out to us directly."
        
        else:
            return "Thank you for your review! We value all feedback from our customers and appreciate you taking the time to share your experience with us."

def run_server(port=3000):
    try:
        server = HTTPServer(('', port), ChatbotHandler)
        print(f"Google Reviews Chatbot Server starting on port {port}...")
        print(f"Access the application at http://localhost:{port}")
        print("\nNote: Running in limited mode due to missing dependencies.")
        print("To enable full functionality, install the requirements from requirements.txt")
        print("\nPress Ctrl+C to stop the server")
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
    except Exception as e:
        print(f"Error starting server: {e}")

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 3000))
    run_server(port)

#!/usr/bin/env python3

import os
import json
import logging
from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS

# Try to import the full functionality
try:
    from chatbot.api import get_mybusiness_service, get_account_name, get_reviews
    from chatbot.gpt3 import generate_response_gpt3, generate_code_response
    from chatbot.celery_tasks import fetch_and_respond_reviews
    from config.settings import DEBUG, PORT, HOST
    FULL_FUNCTIONALITY = True
except ImportError as e:
    print(f"Warning: Some dependencies are missing: {e}")
    print("Running in limited mode...")
    FULL_FUNCTIONALITY = False
    DEBUG = True
    PORT = 3000
    HOST = '0.0.0.0'

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# HTML template for the web interface
HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Google Reviews Chatbot</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #4285f4 0%, #34a853 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        
        .header p {
            font-size: 1.2em;
            opacity: 0.9;
        }
        
        .content {
            padding: 40px;
        }
        
        .status-card {
            background: {{ status_color }};
            border: 1px solid {{ status_border }};
            border-radius: 12px;
            padding: 25px;
            margin-bottom: 30px;
        }
        
        .status-card h3 {
            color: {{ status_text }};
            margin-bottom: 15px;
            font-size: 1.3em;
        }
        
        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        
        .feature-card {
            background: #f8f9fa;
            border-radius: 12px;
            padding: 25px;
            border-left: 4px solid #4285f4;
        }
        
        .feature-card h4 {
            color: #1a73e8;
            margin-bottom: 10px;
        }
        
        .api-section {
            background: #f8f9fa;
            border-radius: 12px;
            padding: 25px;
            margin: 20px 0;
        }
        
        .endpoint {
            background: white;
            border-radius: 8px;
            padding: 15px;
            margin: 10px 0;
            border-left: 4px solid #34a853;
        }
        
        .method {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-weight: bold;
            font-size: 0.8em;
            margin-right: 10px;
        }
        
        .get { background: #e3f2fd; color: #1976d2; }
        .post { background: #e8f5e9; color: #388e3c; }
        
        .test-section {
            background: white;
            border: 2px solid #e0e0e0;
            border-radius: 12px;
            padding: 25px;
            margin: 30px 0;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #333;
        }
        
        textarea, input {
            width: 100%;
            padding: 12px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 14px;
            font-family: inherit;
            transition: border-color 0.3s;
        }
        
        textarea:focus, input:focus {
            outline: none;
            border-color: #4285f4;
        }
        
        button {
            background: linear-gradient(135deg, #4285f4 0%, #34a853 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        
        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(66, 133, 244, 0.3);
        }
        
        .response-area {
            margin-top: 20px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid #34a853;
            display: none;
        }
        
        .response-area.error {
            border-left-color: #ea4335;
            background: #fef7f7;
        }
        
        .loading {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid #4285f4;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .dependency-list {
            background: white;
            border-radius: 8px;
            padding: 20px;
            margin: 15px 0;
        }
        
        .dependency-list ul {
            list-style: none;
            padding: 0;
        }
        
        .dependency-list li {
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }
        
        .dependency-list li:last-child {
            border-bottom: none;
        }
        
        .dependency-list code {
            background: #f1f3f4;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Monaco', 'Menlo', monospace;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🤖 Google Reviews Chatbot</h1>
            <p>Automated response system for Google My Business reviews</p>
        </div>
        
        <div class="content">
            <div class="status-card">
                <h3>{{ status_icon }} Application Status</h3>
                <p><strong>Mode:</strong> {{ mode }}</p>
                <p><strong>Status:</strong> {{ status }}</p>
                {% if not full_functionality %}
                <div class="dependency-list">
                    <h4>Missing Dependencies:</h4>
                    <ul>
                        <li><code>flask</code> - Web framework</li>
                        <li><code>google-auth</code> - Google API authentication</li>
                        <li><code>google-api-python-client</code> - Google My Business API</li>
                        <li><code>openai</code> - GPT-3 integration</li>
                        <li><code>celery</code> - Task scheduling</li>
                        <li><code>python-dotenv</code> - Environment variables</li>
                        <li><code>flask-cors</code> - CORS support</li>
                    </ul>
                </div>
                {% endif %}
            </div>
            
            <div class="feature-grid">
                <div class="feature-card">
                    <h4>📊 Review Management</h4>
                    <p>Fetch and analyze Google My Business reviews automatically</p>
                </div>
                <div class="feature-card">
                    <h4>🤖 AI Responses</h4>
                    <p>Generate intelligent responses using OpenAI GPT-3</p>
                </div>
                <div class="feature-card">
                    <h4>⏰ Automated Tasks</h4>
                    <p>Schedule periodic review fetching with Celery</p>
                </div>
                <div class="feature-card">
                    <h4>🔧 RESTful API</h4>
                    <p>Complete API for integration with other systems</p>
                </div>
            </div>
            
            <div class="api-section">
                <h3>📡 Available API Endpoints</h3>
                
                <div class="endpoint">
                    <span class="method get">GET</span>
                    <strong>/</strong>
                    <p>Main dashboard and application interface</p>
                </div>
                
                <div class="endpoint">
                    <span class="method get">GET</span>
                    <strong>/reviews</strong>
                    <p>Fetch all Google My Business reviews</p>
                </div>
                
                <div class="endpoint">
                    <span class="method post">POST</span>
                    <strong>/generate-response</strong>
                    <p>Generate AI response for a given review text</p>
                </div>
                
                <div class="endpoint">
                    <span class="method get">GET</span>
                    <strong>/health</strong>
                    <p>Application health check and status</p>
                </div>
                
                <div class="endpoint">
                    <span class="method post">POST</span>
                    <strong>/trigger-fetch</strong>
                    <p>Manually trigger review fetching task</p>
                </div>
                
                <div class="endpoint">
                    <span class="method get">GET</span>
                    <strong>/api/status</strong>
                    <p>Detailed API status information</p>
                </div>
            </div>
            
            <div class="test-section">
                <h3>🧪 Test Response Generation</h3>
                <div class="form-group">
                    <label for="reviewText">Enter a customer review:</label>
                    <textarea id="reviewText" rows="4" placeholder="Example: The service was excellent and the staff was very friendly..."></textarea>
                </div>
                <button onclick="generateResponse()">Generate Response</button>
                <div id="responseArea" class="response-area"></div>
            </div>
            
            <div class="test-section">
                <h3>📝 Fetch Reviews</h3>
                <p>Get the latest reviews from Google My Business</p>
                <button onclick="fetchReviews()">Fetch Reviews</button>
                <div id="reviewsArea" class="response-area"></div>
            </div>
        </div>
    </div>
    
    <script>
        async function generateResponse() {
            const reviewText = document.getElementById('reviewText').value;
            const responseArea = document.getElementById('responseArea');
            
            if (!reviewText.trim()) {
                showResponse('Please enter a review text.', true);
                return;
            }
            
            responseArea.style.display = 'block';
            responseArea.className = 'response-area';
            responseArea.innerHTML = '<div class="loading"></div> Generating response...';
            
            try {
                const response = await fetch('/generate-response', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user_input: reviewText })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    showResponse(`
                        <h4>Generated Response:</h4>
                        <p>${data.response}</p>
                        ${data.note ? `<p><small><em>${data.note}</em></small></p>` : ''}
                    `);
                } else {
                    showResponse(`Error: ${data.error || 'Unknown error'}`, true);
                }
            } catch (error) {
                showResponse(`Network error: ${error.message}`, true);
            }
        }
        
        async function fetchReviews() {
            const reviewsArea = document.getElementById('reviewsArea');
            
            reviewsArea.style.display = 'block';
            reviewsArea.className = 'response-area';
            reviewsArea.innerHTML = '<div class="loading"></div> Fetching reviews...';
            
            try {
                const response = await fetch('/reviews');
                const data = await response.json();
                
                if (response.ok) {
                    let html = '<h4>Reviews:</h4>';
                    if (data.reviews && data.reviews.length > 0) {
                        data.reviews.forEach((review, index) => {
                            html += `
                                <div style="border-bottom: 1px solid #eee; padding: 10px 0; margin: 10px 0;">
                                    <strong>${review.reviewer || 'Anonymous'}</strong> 
                                    <span style="color: #ffa500;">${'★'.repeat(review.rating || 5)}</span>
                                    <p style="margin: 5px 0;">${review.text || review.comment || 'No text available'}</p>
                                    <small style="color: #666;">${review.date || 'No date'}</small>
                                </div>
                            `;
                        });
                    } else {
                        html += '<p>No reviews found.</p>';
                    }
                    
                    if (data.note) {
                        html += `<p><small><em>${data.note}</em></small></p>`;
                    }
                    
                    reviewsArea.innerHTML = html;
                } else {
                    showResponseInArea('reviewsArea', `Error: ${data.error || 'Unknown error'}`, true);
                }
            } catch (error) {
                showResponseInArea('reviewsArea', `Network error: ${error.message}`, true);
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
        
        // Load example review text
        window.onload = function() {
            document.getElementById('reviewText').value = "The service was excellent and the staff was very friendly. I would definitely recommend this business to others!";
        };
    </script>
</body>
</html>
"""

@app.route('/')
def index():
    """Main dashboard"""
    if FULL_FUNCTIONALITY:
        status_color = "#e8f5e9"
        status_border = "#4caf50"
        status_text = "#2e7d32"
        status_icon = "✅"
        mode = "Full Functionality"
        status = "All dependencies available"
    else:
        status_color = "#fff3e0"
        status_border = "#ff9800"
        status_text = "#e65100"
        status_icon = "⚠️"
        mode = "Limited Mode"
        status = "Some dependencies missing"
    
    return render_template_string(HTML_TEMPLATE, 
                                full_functionality=FULL_FUNCTIONALITY,
                                status_color=status_color,
                                status_border=status_border,
                                status_text=status_text,
                                status_icon=status_icon,
                                mode=mode,
                                status=status)

@app.route('/reviews', methods=['GET'])
def get_all_reviews():
    """Fetch all Google My Business reviews"""
    try:
        if FULL_FUNCTIONALITY:
            service = get_mybusiness_service()
            account_name = get_account_name(service)
            reviews = get_reviews(service, account_name)
            return jsonify({
                "reviews": reviews,
                "status": "success",
                "count": len(reviews)
            })
        else:
            # Mock data for limited mode
            mock_reviews = [
                {
                    "id": "1",
                    "reviewer": "María García",
                    "rating": 5,
                    "text": "Excelente servicio! Muy profesional y amable el personal.",
                    "date": "2025-07-30"
                },
                {
                    "id": "2", 
                    "reviewer": "Carlos López",
                    "rating": 4,
                    "text": "Buena experiencia en general, lo recomendaría.",
                    "date": "2025-07-29"
                },
                {
                    "id": "3",
                    "reviewer": "Ana Martín",
                    "rating": 5,
                    "text": "Fantástico! Superó mis expectativas completamente.",
                    "date": "2025-07-28"
                }
            ]
            
            return jsonify({
                "reviews": mock_reviews,
                "status": "mock_data",
                "count": len(mock_reviews),
                "note": "Datos de ejemplo. La integración real con Google My Business requiere configuración de API."
            })
    
    except Exception as e:
        logger.error(f"Error fetching reviews: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/generate-response', methods=['POST'])
def generate_response():
    """Generate AI response for a review"""
    try:
        data = request.get_json()
        user_input = data.get('user_input', '').strip()
        
        if not user_input:
            return jsonify({"error": "user_input is required"}), 400
        
        if FULL_FUNCTIONALITY:
            # Use real GPT-3 API
            message_list = [{"role": "user", "content": user_input}]
            response = generate_response_gpt3(message_list)
            return jsonify({
                "response": response,
                "status": "ai_generated",
                "model": "gpt-3.5-turbo"
            })
        else:
            # Use enhanced mock response generation
            response = generate_mock_response(user_input)
            return jsonify({
                "response": response,
                "status": "mock",
                "note": "Respuesta simulada. La integración real con OpenAI GPT-3 requiere API key."
            })
    
    except Exception as e:
        logger.error(f"Error generating response: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    health_status = {
        "status": "healthy",
        "mode": "full" if FULL_FUNCTIONALITY else "limited",
        "dependencies": {
            "flask": True,
            "google-auth": FULL_FUNCTIONALITY,
            "google-api-python-client": FULL_FUNCTIONALITY,
            "openai": FULL_FUNCTIONALITY,
            "celery": FULL_FUNCTIONALITY,
            "python-dotenv": FULL_FUNCTIONALITY
        },
        "endpoints": [
            {"path": "/", "method": "GET", "description": "Main dashboard"},
            {"path": "/reviews", "method": "GET", "description": "Fetch reviews"},
            {"path": "/generate-response", "method": "POST", "description": "Generate AI response"},
            {"path": "/health", "method": "GET", "description": "Health check"},
            {"path": "/trigger-fetch", "method": "POST", "description": "Trigger review fetch"},
            {"path": "/api/status", "method": "GET", "description": "API status"}
        ]
    }
    
    return jsonify(health_status)

@app.route('/trigger-fetch', methods=['POST'])
def trigger_fetch():
    """Manually trigger review fetching task"""
    try:
        if FULL_FUNCTIONALITY:
            # Trigger Celery task
            task = fetch_and_respond_reviews.delay()
            return jsonify({
                "message": "Review fetch task triggered",
                "task_id": task.id,
                "status": "queued"
            })
        else:
            return jsonify({
                "message": "Mock task triggered - no actual processing in limited mode",
                "status": "mock",
                "note": "Celery task scheduling requires full dependencies"
            })
    
    except Exception as e:
        logger.error(f"Error triggering fetch: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/status', methods=['GET'])
def api_status():
    """Detailed API status"""
    return jsonify({
        "application": "Google Reviews Chatbot",
        "version": "1.0.0",
        "full_functionality": FULL_FUNCTIONALITY,
        "python_version": os.sys.version,
        "environment": {
            "DEBUG": DEBUG,
            "PORT": PORT,
            "HOST": HOST
        },
        "features": {
            "google_my_business": FULL_FUNCTIONALITY,
            "openai_integration": FULL_FUNCTIONALITY,
            "celery_tasks": FULL_FUNCTIONALITY,
            "web_interface": True,
            "rest_api": True
        }
    })

def generate_mock_response(user_input):
    """Enhanced mock response generation with Spanish support"""
    user_input_lower = user_input.lower()
    
    # Spanish positive keywords
    if any(word in user_input_lower for word in ['excelente', 'fantástico', 'increíble', 'maravilloso', 'perfecto', 'genial']):
        return "¡Muchísimas gracias por tu excelente reseña! Nos emociona saber que tuviste una experiencia tan maravillosa. Tu opinión significa mucho para nosotros y nos motiva a seguir brindando el mejor servicio posible."
    
    # English positive keywords  
    elif any(word in user_input_lower for word in ['excellent', 'great', 'amazing', 'wonderful', 'fantastic', 'perfect']):
        return "Thank you so much for your wonderful review! We're thrilled to hear about your positive experience and truly appreciate you taking the time to share your feedback. Your satisfaction is our top priority!"
    
    # Spanish neutral/good keywords
    elif any(word in user_input_lower for word in ['bueno', 'bien', 'correcto', 'aceptable', 'recomiendo']):
        return "¡Gracias por tu reseña! Nos alegra saber que tuviste una buena experiencia. Siempre estamos trabajando para mejorar nuestros servicios y valoramos mucho tu opinión."
    
    # English neutral/good keywords
    elif any(word in user_input_lower for word in ['good', 'nice', 'okay', 'decent', 'recommend']):
        return "Thank you for your feedback! We're glad you had a good experience. We're always working to improve our services and appreciate your review."
    
    # Spanish negative keywords
    elif any(word in user_input_lower for word in ['malo', 'terrible', 'horrible', 'decepcionante', 'pésimo']):
        return "Lamentamos mucho que tu experiencia no haya sido la esperada. Tu comentario es muy importante para nosotros y nos gustaría tener la oportunidad de resolver cualquier inconveniente. Por favor, contáctanos directamente para poder ayudarte mejor."
    
    # English negative keywords
    elif any(word in user_input_lower for word in ['bad', 'terrible', 'awful', 'disappointing', 'poor']):
        return "We sincerely apologize for your disappointing experience. Your feedback is important to us, and we'd like to make this right. Please contact us directly so we can address your concerns promptly."
    
    # Spanish problem keywords
    elif any(word in user_input_lower for word in ['problema', 'queja', 'inconveniente', 'error']):
        return "Gracias por traer esto a nuestra atención. Tomamos todos los comentarios en serio y nos gustaría tener la oportunidad de resolver cualquier problema. Te agradecemos que nos contactes directamente."
    
    # English problem keywords
    elif any(word in user_input_lower for word in ['problem', 'issue', 'complaint', 'error']):
        return "Thank you for bringing this to our attention. We take all feedback seriously and would appreciate the opportunity to resolve any issues. Please reach out to us directly."
    
    # Default responses based on language detection
    elif any(spanish_word in user_input_lower for spanish_word in ['el', 'la', 'un', 'una', 'es', 'está', 'muy', 'que', 'con']):
        return "¡Gracias por tu reseña! Valoramos mucho todos los comentarios de nuestros clientes y apreciamos que te hayas tomado el tiempo de compartir tu experiencia con nosotros."
    
    else:
        return "Thank you for your review! We value all feedback from our customers and appreciate you taking the time to share your experience with us."

if __name__ == '__main__':
    try:
        print(f"🚀 Starting Google Reviews Chatbot...")
        print(f"📊 Mode: {'Full Functionality' if FULL_FUNCTIONALITY else 'Limited Mode'}")
        print(f"🌐 Server: http://{HOST}:{PORT}")
        print(f"🔧 Debug: {DEBUG}")
        
        if not FULL_FUNCTIONALITY:
            print("⚠️  Running in limited mode - some dependencies are missing")
            print("   Install requirements.txt for full functionality")
        
        app.run(host=HOST, port=PORT, debug=DEBUG)
        
    except Exception as e:
        print(f"❌ Error starting application: {e}")
        raise

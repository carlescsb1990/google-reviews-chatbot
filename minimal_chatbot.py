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
        <html>
        <head>
            <title>Google Reviews Chatbot</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; }
                .container { max-width: 800px; margin: 0 auto; }
                .status { padding: 20px; background: #f0f0f0; border-radius: 5px; margin: 20px 0; }
                .warning { background: #fff3cd; border: 1px solid #ffeaa7; }
                button { padding: 10px 20px; margin: 10px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; }
                button:hover { background: #0056b3; }
                textarea { width: 100%; height: 100px; margin: 10px 0; }
                .response { margin: 20px 0; padding: 15px; background: #e8f5e8; border-radius: 5px; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Google Reviews Chatbot</h1>
                
                <div class="status warning">
                    <h3>⚠️ Limited Functionality Mode</h3>
                    <p>The application is running in limited mode because Flask and other Python dependencies are not available in this environment.</p>
                    <p>To enable full functionality, the following dependencies need to be installed:</p>
                    <ul>
                        <li>flask</li>
                        <li>google-auth</li>
                        <li>google-api-python-client</li>
                        <li>openai</li>
                        <li>celery</li>
                        <li>python-dotenv</li>
                    </ul>
                </div>

                <div class="status">
                    <h3>Available Endpoints:</h3>
                    <ul>
                        <li><strong>GET /</strong> - This homepage</li>
                        <li><strong>GET /reviews</strong> - Mock reviews data (limited mode)</li>
                        <li><strong>POST /generate-response</strong> - Mock response generation (limited mode)</li>
                        <li><strong>GET /health</strong> - Health check</li>
                    </ul>
                </div>

                <h3>Test Response Generation:</h3>
                <textarea id="userInput" placeholder="Enter a review or message here..."></textarea>
                <br>
                <button onclick="generateResponse()">Generate Mock Response</button>
                
                <div id="responseArea"></div>

                <script>
                    async function generateResponse() {
                        const userInput = document.getElementById('userInput').value;
                        const responseArea = document.getElementById('responseArea');
                        
                        try {
                            const response = await fetch('/generate-response', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ user_input: userInput })
                            });
                            
                            const data = await response.json();
                            responseArea.innerHTML = '<div class="response"><strong>Mock Response:</strong><br>' + data.response + '</div>';
                        } catch (error) {
                            responseArea.innerHTML = '<div class="response" style="background: #f8d7da;">Error: ' + error.message + '</div>';
                        }
                    }
                </script>
            </div>
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
                    "reviewer": "John Doe",
                    "rating": 5,
                    "text": "Excellent service! Very professional and helpful.",
                    "date": "2025-07-30"
                },
                {
                    "id": "2", 
                    "reviewer": "Jane Smith",
                    "rating": 4,
                    "text": "Good experience overall, would recommend.",
                    "date": "2025-07-29"
                }
            ],
            "status": "mock_data",
            "note": "This is mock data. Real Google My Business integration requires proper API setup and dependencies."
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

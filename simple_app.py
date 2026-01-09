#!/usr/bin/env python3

import sys
import os

print("Python version:", sys.version)
print("Python path:", sys.path)
print("Current directory:", os.getcwd())
print("Files in current directory:", os.listdir('.'))

# Try to create a simple HTTP server without external dependencies
try:
    from http.server import HTTPServer, BaseHTTPRequestHandler
    import json
    
    class SimpleHandler(BaseHTTPRequestHandler):
        def do_GET(self):
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            response = {"message": "Google Reviews Chatbot API", "status": "running", "note": "Flask dependencies not available"}
            self.wfile.write(json.dumps(response).encode())
    
    def run_server(port=3000):
        server = HTTPServer(('', port), SimpleHandler)
        print(f"Starting simple HTTP server on port {port}...")
        print(f"Visit http://localhost:{port} to test")
        server.serve_forever()
    
    if __name__ == '__main__':
        run_server()
        
except Exception as e:
    print(f"Error: {e}")
    print("Even basic HTTP server functionality is not available")

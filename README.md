# 🤖 Google Reviews Chatbot

A comprehensive automated response system for Google My Business reviews. This application fetches reviews, analyzes sentiment using OpenAI's GPT-3/4, and generates professional responses automatically. Features include web dashboard, REST API, scheduled tasks, and complete monitoring capabilities.

## ✨ Features

- 📊 **Google My Business Integration** - Automatic review fetching
- 🧠 **AI-Powered Responses** - OpenAI GPT-3/4 response generation
- ⏰ **Scheduled Tasks** - Celery-based periodic processing
- 🌐 **Web Dashboard** - Complete management interface
- 🔧 **REST API** - Full API for external integrations
- 📱 **Responsive Design** - Works on all devices
- 🌍 **Multi-language Support** - Spanish and English responses
- 🔄 **Real-time Processing** - Live review monitoring
- 📈 **Status Monitoring** - Health checks and diagnostics

## 🚀 Quick Start

### Automated Installation

```bash
# Run the automated installer
python3 install.py
```

The installer will:
- Check Python version compatibility
- Install missing dependencies
- Configure environment variables
- Test the setup
- Provide usage instructions

### Manual Installation

1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure Environment**
   ```bash
   cp example.env .env
   # Edit .env with your API keys
   ```

3. **Start the Application**
   ```bash
   python3 google_reviews_chatbot.py
   ```

## 🔧 Configuration

### Required API Keys

1. **Google My Business API**
   - Apply for access: [Google My Business API Form](https://docs.google.com/forms/d/e/1FAIpQLSfC_FKSWzbSae_5rOpgwFeIUzXUF1JCQnlsZM_gC1I2UHjA3w/viewform)
   - Get credentials at: [Google Cloud Console](https://console.cloud.google.com/)

2. **OpenAI API**
   - Get API key at: [OpenAI Platform](https://platform.openai.com/api-keys)

3. **Redis (for Celery)**
   - Local: `redis://localhost:6379/0`
   - Cloud services: Redis Cloud, AWS ElastiCache, etc.

### Environment Variables (.env)

```bash
# Google My Business API
GOOGLE_API_KEY=your_google_api_key_here
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# OpenAI API
OPENAI_API_KEY=your_openai_api_key_here

# Redis Configuration
REDIS_URL=redis://localhost:6379/0

# Flask Configuration
DEBUG=True
PORT=3000
HOST=0.0.0.0

# Celery Configuration
CELERY_ALWAYS_EAGER=False
```

## 🖥️ Usage

### Starting the Application

**Option 1: Complete Application (Recommended)**
```bash
python3 google_reviews_chatbot.py
```

**Option 2: Flask App (if all dependencies available)**
```bash
python3 app.py
```

**Option 3: Limited Mode (no external dependencies)**
```bash
python3 minimal_chatbot.py
```

### Starting Celery Services

**Worker + Beat Scheduler:**
```bash
python3 start_celery.py all
```

**Individual Services:**
```bash
# Worker only
python3 start_celery.py worker

# Beat scheduler only
python3 start_celery.py beat

# Flower monitoring (if installed)
python3 start_celery.py flower
```

**Traditional Celery Commands:**
```bash
# Worker
celery -A celery_worker worker --loglevel=info

# Beat scheduler
celery -A celery_worker beat --loglevel=info

# Flower monitoring
celery -A celery_worker flower --port=5555
```

## 🌐 Web Interface

Access the application at: **http://localhost:3000**

### Dashboard Features
- **Review Management** - View and manage Google My Business reviews
- **Response Testing** - Test AI response generation
- **Manual Tasks** - Trigger review fetching manually
- **Status Monitoring** - Check system health and configuration
- **API Documentation** - Interactive API endpoint documentation

## 🔗 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Main dashboard interface |
| `/reviews` | GET | Fetch all reviews |
| `/generate-response` | POST | Generate AI response |
| `/health` | GET | Health check |
| `/trigger-fetch` | POST | Manual review fetch |
| `/api/status` | GET | Detailed API status |

### API Examples

**Fetch Reviews:**
```bash
curl http://localhost:3000/reviews
```

**Generate Response:**
```bash
curl -X POST http://localhost:3000/generate-response \
  -H "Content-Type: application/json" \
  -d '{"user_input": "Excellent service! Very professional."}'
```

**Health Check:**
```bash
curl http://localhost:3000/health
```

## 📁 Project Structure

```
google-reviews-chatbot/
├── 📄 google_reviews_chatbot.py    # Main application (complete)
├── 📄 app.py                       # Flask application
├── 📄 minimal_chatbot.py           # Minimal version (no deps)
├── 📄 install.py                   # Automated installer
├── 📄 setup.py                     # Setup checker
├── 📄 start_celery.py              # Celery management
├── 📄 celery_worker.py             # Celery worker
├── 📄 celery_config.py             # Celery configuration
├── 📄 requirements.txt             # Python dependencies
├── 📄 example.env                  # Environment template
├── 📄 .env                         # Environment variables
├── 📄 README.md                    # This file
├── 📁 chatbot/                     # Core modules
│   ├── 📄 __init__.py
│   ├── 📄 api.py                   # Google My Business API
│   ├── 📄 gpt3.py                  # OpenAI integration
│   ├── 📄 routes.py                # Flask routes
│   └── 📄 celery_tasks.py          # Celery tasks
└── 📁 config/                      # Configuration
    ├── 📄 __init__.py
    └── 📄 settings.py              # Settings module
```

## 🔄 Workflow

1. **Scheduled Fetch** - Celery beat triggers review fetching every 10 minutes
2. **Review Processing** - Google My Business API fetches new reviews
3. **AI Response** - OpenAI GPT generates appropriate responses
4. **Storage** - Reviews and responses are logged
5. **Manual Override** - Web interface allows manual triggering

## 🚀 Deployment

### Local Development
```bash
# Start all services
python3 google_reviews_chatbot.py &
python3 start_celery.py all &
```

### Production (Docker)
```dockerfile
FROM python:3.11-slim
COPY . /app
WORKDIR /app
RUN pip install -r requirements.txt
EXPOSE 3000
CMD ["python3", "google_reviews_chatbot.py"]
```

### AWS Deployment
- **Elastic Beanstalk** - Web application
- **EC2** - Celery workers
- **ElastiCache** - Redis for Celery
- **RDS** - Optional database storage

## 🧪 Testing

**Test Setup:**
```bash
python3 setup.py
```

**Test Individual Components:**
```bash
# Test Google API
python3 -c "from chatbot.api import GoogleMyBusinessAPI; api = GoogleMyBusinessAPI(); print(api.get_reviews())"

# Test OpenAI
python3 -c "from chatbot.gpt3 import OpenAIIntegration; ai = OpenAIIntegration(); print(ai.generate_response('Great service!'))"
```

## 🔍 Monitoring

- **Health Endpoint:** `/health` - System status
- **Logs:** Application logs with structured logging
- **Flower:** Celery task monitoring (if installed)
- **Dashboard:** Real-time status in web interface

## 🛠️ Troubleshooting

**Common Issues:**

1. **Dependencies Missing**
   ```bash
   python3 install.py  # Run automated installer
   ```

2. **API Keys Not Working**
   - Check `.env` file configuration
   - Verify API key permissions
   - Test with `/health` endpoint

3. **Redis Connection Issues**
   ```bash
   # Start Redis locally
   redis-server

   # Test connection
   redis-cli ping
   ```

4. **Celery Tasks Not Running**
   ```bash
   # Check worker status
   celery -A celery_worker inspect active

   # Restart services
   python3 start_celery.py all
   ```

## 📚 Additional Resources

- **Dashboard Repository:** [Google Review Chatbot Dashboard](https://github.com/shamspias/google-review-chatbot-dashboard)
- **Google My Business API:** [Documentation](https://developers.google.com/my-business)
- **OpenAI API:** [Documentation](https://platform.openai.com/docs)
- **Celery:** [Documentation](https://docs.celeryproject.org/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 💬 Support

For issues and questions:
- Create an issue on GitHub
- Check the troubleshooting section
- Review the API documentation

---

**⭐ Star this repository if you find it useful!**


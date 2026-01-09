# Google Reviews Chatbot - Versión Web Real (Sin Mockups)

Sistema completo de gestión automatizada de reseñas de Google My Business con inteligencia artificial, implementado como una aplicación web moderna con **APIs reales únicamente**.

## 🚀 Características Principales

### ✨ **Implementación Real - Sin Simulaciones**
- **Google My Business API**: Conexión directa a reseñas reales
- **OpenAI GPT-3.5/4**: Generación inteligente de respuestas
- **OAuth 2.0**: Autenticación segura con Google
- **Backend Flask**: Análisis avanzado y tareas programadas
- **Redis + Celery**: Procesamiento asíncrono y colas

### 🎯 **Funcionalidades Core**
- ✅ Obtención automática de reseñas de Google My Business
- ✅ Generación de respuestas personalizadas con IA
- ✅ Análisis de sentimientos en tiempo real
- ✅ Dashboard de métricas y analytics
- ✅ Programación de respuestas automáticas
- ✅ Interfaz web responsive moderna

## 🏗️ Arquitectura del Sistema

```
Frontend (React + Vite)
├── Dashboard principal
├── Gestión de reseñas
├── Generador de respuestas IA
├── Analytics y métricas
└── Documentación

APIs Externas
├── Google My Business API
├── OpenAI API
└── OAuth 2.0 Google

Backend (Opcional)
├── Flask API Server
├── Redis para caching
├── Celery para tareas
└── Análisis avanzado
```

## 📋 Requisitos Previos

### **APIs Obligatorias**
- **Google Cloud Console**: Proyecto con My Business API habilitada
- **OpenAI Platform**: Cuenta con API key activa
- **Método de pago**: Para OpenAI (facturación por uso)

### **Software Requerido**
- Node.js 18+ 
- npm o yarn
- Git

### **Opcional (Backend)**
- Python 3.8+
- Redis
- Flask

## 🚀 Instalación y Configuración

### 1. Clonar Repositorio
```bash
git clone https://github.com/shamspias/google-review-chatbot-dashboard
cd google-review-chatbot-dashboard
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configurar APIs (OBLIGATORIO)

#### **A. Google My Business API**
1. Ir a [Google Cloud Console](https://console.cloud.google.com/)
2. Crear/seleccionar proyecto
3. Habilitar "Google My Business API" y "Google My Business Management API"
4. Crear credenciales OAuth 2.0:
   - Tipo: Aplicación web
   - URI autorizada: `http://localhost:5173/auth/callback`
5. Crear API Key adicional

#### **B. OpenAI API**
1. Registrarse en [OpenAI Platform](https://platform.openai.com/)
2. Agregar método de pago válido
3. Crear API Key en [API Keys](https://platform.openai.com/api-keys)
4. Configurar límites de uso (recomendado: $20/mes)

### 4. Variables de Entorno
```bash
cp .env.example .env
```

Editar `.env` con tus credenciales reales:
```env
# GOOGLE MY BUSINESS (OBLIGATORIO)
VITE_GOOGLE_API_KEY=tu_google_api_key
VITE_GOOGLE_CLIENT_ID=tu_client_id.apps.googleusercontent.com
VITE_GOOGLE_CLIENT_SECRET=tu_client_secret

# OPENAI (OBLIGATORIO)
VITE_OPENAI_API_KEY=sk-tu_clave_openai

# BACKEND (OPCIONAL)
VITE_BACKEND_URL=http://localhost:5000
VITE_REDIS_URL=redis://localhost:6379/0
```

### 5. Ejecutar Aplicación
```bash
# Desarrollo
npm run dev

# Producción
npm run build
npm run preview
```

## 🔧 Configuración del Backend (Opcional)

Para funcionalidades avanzadas como análisis y programación:

### 1. Instalar Redis
```bash
# macOS
brew install redis
redis-server

# Ubuntu/Debian
sudo apt install redis-server
sudo systemctl start redis
```

### 2. Configurar Python Backend
```bash
# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
export GOOGLE_API_KEY=tu_api_key
export OPENAI_API_KEY=tu_openai_key
export REDIS_URL=redis://localhost:6379/0

# Ejecutar servidor Flask
python app.py

# Ejecutar worker de Celery (terminal separado)
celery -A celery_worker worker --loglevel=info
```

## 📊 Uso de la Aplicación

### 1. **Autenticación**
- Ir a `/reviews`
- Hacer clic en "Autenticar con Google"
- Completar flujo OAuth 2.0
- Otorgar permisos para Google My Business

### 2. **Gestión de Reseñas**
- Ver reseñas en tiempo real
- Generar respuestas con IA
- Copiar/editar respuestas generadas
- Responder directamente en Google (manual)

### 3. **Analytics** (Requiere Backend)
- Análisis de sentimientos
- Métricas de respuesta
- Palabras clave trending
- Tendencias temporales

## 💰 Estimación de Costos

### **OpenAI API**
- GPT-3.5-turbo: ~$0.002 por 1K tokens
- Respuesta promedio: 50-100 tokens = $0.0001-0.0002
- 1000 respuestas/mes ≈ $0.10-0.20

### **Google Cloud**
- My Business API: Gratis hasta cierto límite
- Cuotas generosas para uso normal

### **Hosting**
- Frontend: Gratis (Vercel/Netlify)
- Backend: $5-10/mes (Railway/Heroku)
- Redis: $3-5/mes (Redis Cloud)

## 🛠️ Desarrollo

### **Estructura del Proyecto**
```
src/
├── components/          # Componentes React
├── services/           # Servicios API
├── store/             # Estado global (Zustand)
├── styles/            # Estilos CSS
└── types/             # Tipos TypeScript

backend/ (opcional)
├── app.py             # Servidor Flask
├── celery_worker.py   # Worker de Celery
├── services/          # Servicios backend
└── models/            # Modelos de datos
```

### **Scripts Disponibles**
```bash
npm run dev         # Desarrollo
npm run build       # Construcción
npm run preview     # Vista previa
npm run lint        # Linting
npm run type-check  # Verificación de tipos
```

## 🔒 Seguridad y Mejores Prácticas

### **Variables de Entorno**
- ❌ Nunca commitear archivos `.env`
- ✅ Usar variables específicas por entorno
- ✅ Rotar claves API regularmente
- ✅ Configurar límites de uso en OpenAI

### **Producción**
- ✅ Usar HTTPS obligatorio
- ✅ Configurar CORS adecuadamente
- ✅ Implementar rate limiting
- ✅ Monitorear uso de APIs

## 🚀 Deploy en Producción

### **Frontend (Vercel/Netlify)**
```bash
# Vercel
npx vercel --prod

# Netlify
npm run build
# Subir carpeta dist/
```

### **Backend (Railway/Heroku)**
```bash
# Railway
railway login
railway link
railway up

# Heroku
heroku create tu-app-name
git push heroku main
```

### **Variables de Entorno en Producción**
Configurar en el dashboard del proveedor:
- `VITE_GOOGLE_API_KEY`
- `VITE_GOOGLE_CLIENT_ID`
- `VITE_GOOGLE_CLIENT_SECRET`
- `VITE_OPENAI_API_KEY`
- `VITE_BACKEND_URL` (URL de producción)

## 🆘 Solución de Problemas

### **Error: "API Key no configurada"**
- Verificar que `.env` existe y tiene las claves correctas
- Reiniciar servidor de desarrollo: `npm run dev`

### **Error: "OAuth callback failed"**
- Verificar URL de redirección en Google Console
- Debe ser exactamente: `http://localhost:5173/auth/callback`

### **Error: "OpenAI quota exceeded"**
- Verificar límites en OpenAI Platform
- Agregar método de pago válido
- Aumentar límites mensuales

### **Reseñas no cargan**
- Verificar permisos de Google My Business
- Asegurar que la cuenta tenga ubicaciones activas
- Revisar logs de consola para errores específicos

## 🤝 Contribuir

1. Fork del repositorio
2. Crear rama de feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit cambios: `git commit -m 'Agregar nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

## 📜 Licencia

Este proyecto está bajo la Licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

## 🆔 Información del Proyecto

- **Versión**: 2.0.0 (Web Real)
- **Autor**: [shamspias](https://github.com/shamspias)
- **Repositorio**: [google-review-chatbot-dashboard](https://github.com/shamspias/google-review-chatbot-dashboard)
- **Tipo**: Aplicación web con APIs reales
- **Stack**: React + TypeScript + Vite + Flask + Redis

---

## ⚠️ Aviso Importante

**Esta aplicación NO incluye funcionalidad de demostración o mockups.** Requiere configuración real de APIs para funcionar. Si necesitas probar sin configurar APIs, usa la versión anterior con mockups.

Para soporte técnico o preguntas, crear un [Issue](https://github.com/shamspias/google-review-chatbot-dashboard/issues) en GitHub.

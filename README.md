# 🤖 Google Reviews Chatbot (Web Version)

Una aplicación web moderna y completa para gestionar y responder automáticamente a reseñas de Google My Business. Construida con React, Vite, TypeScript y tecnologías web modernas.

## ✨ Características

- 🎨 **Interfaz Moderna**: Diseño responsive con gradientes animados y efectos glass
- 🚀 **Tecnología de Vanguardia**: React 18 + Vite + TypeScript + Zustand
- 🤖 **IA Simulada**: Generación inteligente de respuestas contextuales
- 📱 **Responsive Design**: Funciona perfectamente en desktop, tablet y móvil
- ⚡ **Desarrollo Rápido**: Hot Module Replacement con Vite
- 🔄 **SPA Routing**: Navegación fluida entre páginas
- 🎯 **Estado Reactivo**: Gestión de estado con Zustand
- 📊 **Dashboard Completo**: Estadísticas y análisis de reseñas

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 16+ 
- npm, yarn o pnpm

### Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd google-reviews-chatbot

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# O usar yarn
yarn install
yarn dev

# O usar pnpm
pnpm install
pnpm dev
```

### Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo con HMR
npm run start        # Servidor de desarrollo (host 0.0.0.0)

# Construcción
npm run build        # Construir para producción
npm run preview      # Preview de la build

# Linting
npm run lint         # Ejecutar ESLint
```

## 🏗️ Arquitectura

### Estructura del Proyecto

```
src/
├── components/          # Componentes React
│   ├── ChatbotDashboard.tsx    # Dashboard principal
│   ├── ResponseGenerator.tsx   # Generador de respuestas
│   ├── ReviewsDemo.tsx         # Demo de reseñas
│   ├── ReviewsPage.tsx         # Página completa de reseñas
│   ├── StatusCard.tsx          # Tarjeta de estado
│   ├── EndpointsCard.tsx       # Tarjeta de endpoints
│   ├── HealthCheck.tsx         # Página de health check
│   └── ApiStatus.tsx           # Página de estado API
├── store/              # Estado global
│   └── chatbotStore.ts         # Store principal con Zustand
├── App.tsx             # Componente principal
├── App.css             # Estilos de la app
├── main.tsx            # Punto de entrada
└── index.css           # Estilos globales
```

### Stack Tecnológico

- **Frontend**: React 18 con TypeScript
- **Build Tool**: Vite 4
- **Estado**: Zustand (alternativa ligera a Redux)
- **Routing**: React Router 6
- **Estilos**: CSS nativo con variables CSS
- **Iconos**: FontAwesome + Lucide React
- **Tipografía**: Inter (Google Fonts)

## 🎨 Características de la UI

### Diseño Visual
- **Gradientes Animados**: Fondos dinámicos con efectos de flotación
- **Glass Morphism**: Tarjetas con efectos de desenfoque y transparencia
- **Animaciones Suaves**: Transiciones fluidas y micro-interacciones
- **Tipografía Moderna**: Fuente Inter con jerarquía visual clara

### Responsividad
- **Mobile First**: Diseño optimizado para dispositivos móviles
- **Breakpoints**: Adaptación automática a tablets y desktop
- **Touch Friendly**: Elementos táctiles optimizados

### Accesibilidad
- **Contraste**: Colores con contraste adecuado
- **Semántica**: HTML semántico con roles ARIA
- **Navegación**: Navegación por teclado

## 🔧 Funcionalidades

### Dashboard Principal (`/`)
- Estado del sistema y tecnologías
- Generador de respuestas con ejemplos rotativos
- Vista demo de reseñas
- Navegación a otras secciones

### Página de Reseñas (`/reviews`)
- Lista completa de reseñas con filtros
- Generación de respuestas individuales
- Estadísticas y métricas
- Calificaciones visuales con estrellas

### Health Check (`/health`)
- Estado del sistema en tiempo real
- Monitoreo de dependencias
- Información de configuración

### Estado API (`/api/status`)
- Información técnica detallada
- Lista de endpoints disponibles
- Características del sistema

## 🤖 Sistema de IA Simulada

### Generación de Respuestas
El sistema incluye un motor de respuestas inteligente que:

- Analiza el sentimiento de las reseñas
- Genera respuestas contextuales en español e inglés
- Adapta el tono según la calificación (positiva/negativa)
- Incluye respuestas por defecto multiidioma

### Ejemplos de Procesamiento
```typescript
// Reseña positiva
"Excelente servicio!" 
→ "¡Muchísimas gracias por su excelente reseña! Nos emociona saber que tuvo una experiencia tan positiva."

// Reseña negativa
"Muy malo el servicio"
→ "Lamentamos profundamente que su experiencia no haya sido satisfactoria. Por favor contáctenos directamente."
```

## 🚀 Despliegue

### Build de Producción

```bash
# Construir para producción
npm run build

# Los archivos se generan en /dist
# Subir contenido de /dist a tu servidor web
```

### Opciones de Hosting

- **Vercel**: Deploy automático desde Git
- **Netlify**: Deploy con CI/CD integrado
- **GitHub Pages**: Hosting gratuito para repositorios públicos
- **AWS S3 + CloudFront**: Hosting escalable
- **Servidor Web**: Apache/Nginx sirviendo archivos estáticos

### Variables de Entorno

```bash
# .env.local
VITE_API_URL=https://api.tu-servidor.com
VITE_GOOGLE_API_KEY=tu_clave_api
VITE_OPENAI_API_KEY=tu_clave_openai
```

## 🔮 Roadmap

### Próximas Características
- [ ] Integración real con Google My Business API
- [ ] Conexión con OpenAI GPT-4
- [ ] Sistema de autenticación
- [ ] Dashboard de analytics avanzado
- [ ] Exportación de datos
- [ ] Modo offline con Service Workers
- [ ] Tests unitarios y E2E
- [ ] Tema oscuro/claro
- [ ] Internacionalización (i18n)

### Mejoras Técnicas
- [ ] PWA (Progressive Web App)
- [ ] Optimización de bundle size
- [ ] Lazy loading de componentes
- [ ] Caching inteligente
- [ ] Performance monitoring

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🙏 Agradecimientos

- [React](https://reactjs.org/) - Biblioteca de UI
- [Vite](https://vitejs.dev/) - Build tool ultrarrápido
- [Zustand](https://github.com/pmndrs/zustand) - Gestión de estado simple
- [FontAwesome](https://fontawesome.com/) - Iconos
- [Inter Font](https://rsms.me/inter/) - Tipografía

---

**⭐ ¡Star este repositorio si te parece útil!**

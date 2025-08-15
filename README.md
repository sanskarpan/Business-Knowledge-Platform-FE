# Business Knowledge Platform - Frontend

A modern, production-ready knowledge management platform frontend built with React and Vite. This application provides an intuitive interface for document management, AI-powered chat interactions, advanced search capabilities, and comprehensive analytics.

## Overview

The Business Knowledge Platform Frontend is a sophisticated web application that enables users to efficiently manage, search, and interact with their business documents through an AI-powered interface. Built with modern web technologies, it offers a seamless user experience for knowledge workers and teams.

## Features

### Core Functionality
- **Document Management**: Upload, organize, and manage various document types (PDF, DOCX, TXT, MD, images)
- **AI-Powered Chat**: Interactive conversations with your knowledge base using advanced language models
- **Advanced Search**: Hybrid search combining text and semantic search with filtering options
- **Analytics Dashboard**: Comprehensive insights into platform usage and document analytics
- **User Authentication**: Secure login and registration system with JWT tokens

### Document Processing
- Support for multiple file formats (PDF, Word, Text, Markdown, Images)
- Automatic text extraction and processing
- File size validation (up to 100MB)
- Drag-and-drop file upload interface
- Document preview and content management

### AI Chat Interface
- Real-time streaming responses
- Conversation history management
- Source attribution for AI responses
- Session-based chat organization
- Context-aware document references

### Search Capabilities
- Hybrid search (text + semantic)
- File type filtering
- Date range filtering
- Relevance scoring
- Similar document discovery

### Analytics & Insights
- Usage statistics and trends
- Document type distribution
- Activity tracking
- Performance metrics
- Interactive charts and visualizations

## Technology Stack

### Frontend Framework
- **React 18.2.0**: Modern React with hooks and concurrent features
- **Vite 4.1.0**: Fast build tool and development server
- **React Router 6.8.0**: Client-side routing and navigation

### Styling & UI
- **Tailwind CSS 3.2.0**: Utility-first CSS framework
- **Headless UI 1.7.0**: Unstyled, accessible UI components
- **Heroicons 2.0.0**: Beautiful SVG icons
- **PostCSS & Autoprefixer**: CSS processing and vendor prefixing

### State Management & Data
- **React Context API**: Built-in state management
- **Axios 1.3.0**: HTTP client for API communication
- **React Hooks**: Custom hooks for data fetching and state management

### Additional Libraries
- **React Dropzone 14.2.0**: File upload with drag-and-drop
- **React Hot Toast 2.4.0**: Toast notifications
- **Recharts 2.5.0**: Chart components for analytics
- **Date-fns 2.29.0**: Date utility functions
- **Clsx 1.2.0**: Conditional CSS class names

### Development Tools
- **ESLint**: Code linting and quality enforcement
- **React Refresh**: Fast refresh for development
- **TypeScript-ready**: Configured for future TypeScript migration

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ChatInterface.jsx
│   ├── ChatSidebar.jsx
│   ├── DocumentLibrary.jsx
│   ├── DocumentUploader.jsx
│   ├── Header.jsx
│   ├── Layout.jsx
│   ├── LoadingSpinner.jsx
│   ├── ProtectedRoute.jsx
│   └── Sidebar.jsx
├── contexts/           # React context providers
│   └── AuthContext.jsx
├── hooks/              # Custom React hooks
│   ├── useChat.js
│   ├── useDocuments.js
│   └── useSearch.js
├── pages/              # Application pages
│   ├── Analytics.jsx
│   ├── Chat.jsx
│   ├── Dashboard.jsx
│   ├── Documents.jsx
│   ├── Login.jsx
│   ├── Profile.jsx
│   ├── Register.jsx
│   └── Search.jsx
├── services/           # API service layer
│   └── api.js
├── App.jsx            # Main application component
├── main.jsx           # Application entry point
└── index.css          # Global styles and Tailwind imports
```

## Getting Started

### Prerequisites
- Node.js 16.0 or higher
- npm, yarn, or pnpm package manager
- Backend API server running (see backend repository)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/sanskarpan/Business-Knowledge-Platform-FE
cd Business-Knowledge-Platform-FE
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Configure environment variables:
```bash
cp .env.sample .env
```

Edit `.env` file with your backend API URL:
```env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=Business-Knowledge-Platform
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
# or
pnpm build
```


## Development

### Available Scripts
- `npm run dev`: Start development server with hot reload
- `npm run build`: Build application for production
- `npm run preview`: Preview production build locally
- `npm run lint`: Run ESLint for code quality checks

### Code Quality
The project uses ESLint with React-specific rules to maintain code quality. Run linting before committing:

```bash
npm run lint
```

### Project Configuration
- **Vite**: Configured with React plugin and development proxy
- **Tailwind CSS**: Custom color scheme and component utilities
- **PostCSS**: Configured with Tailwind and Autoprefixer
- **ESLint**: React and React Hooks specific rules

## API Integration

The frontend communicates with the backend through a RESTful API. Key API endpoints include:

- **Authentication**: `/api/auth/*`
- **Documents**: `/api/documents/*`
- **Chat**: `/api/chat/*`
- **Search**: `/api/search/*`
- **Analytics**: `/api/analytics/*`

All API calls are handled through the centralized `api.js` service layer with automatic authentication token management.

## Browser Support

The application supports modern browsers with ES6+ support:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Features

- **Code Splitting**: Route-based code splitting for optimal loading
- **Lazy Loading**: Components loaded on demand
- **Optimized Bundles**: Vite's fast build optimization
- **Responsive Design**: Mobile-first responsive layout
- **Progressive Enhancement**: Graceful degradation for older browsers

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: Route-level access control
- **Input Validation**: Client-side form validation
- **XSS Protection**: React's built-in XSS protection
- **CSRF Protection**: Token-based CSRF protection

## Deployment

The application has been deployed to [Vercel](https://business-knowledge-platform-fe.vercel.app/login) currenty, and can be deployed on following as well:

- **Static Hosting**: Netlify, Vercel, GitHub Pages
- **Cloud Platforms**: AWS S3, Google Cloud Storage
- **Container Platforms**: Docker, Kubernetes
- **Traditional Hosting**: Apache, Nginx

Build the application and serve the `dist` folder as static content.

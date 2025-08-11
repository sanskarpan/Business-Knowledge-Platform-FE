import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  setAuthToken: (token) => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete api.defaults.headers.common['Authorization']
    }
  },
  
  login: (email, password) => {
    return api.post('/api/auth/login', { email, password })
  },
  
  register: (email, password) => {
    return api.post('/api/auth/register', { email, password })
  },
  
  getProfile: () => {
    return api.get('/api/auth/profile')
  }
}

// Documents API
export const documentsAPI = {
  upload: (file, onProgress) => {
    const formData = new FormData()
    formData.append('file', file)
    
    return api.post('/api/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: onProgress
    })
  },
  
  getDocuments: (params = {}) => {
    return api.get('/api/documents', { params })
  },
  
  getDocument: (id) => {
    return api.get(`/api/documents/${id}`)
  },
  
  deleteDocument: (id) => {
    return api.delete(`/api/documents/${id}`)
  }
}

// Chat API
export const chatAPI = {
  createSession: (title = 'New Conversation') => {
    return api.post('/api/chat/sessions', { title })
  },
  
  getSessions: () => {
    return api.get('/api/chat/sessions')
  },
  
  getMessages: (sessionId) => {
    return api.get(`/api/chat/sessions/${sessionId}/messages`)
  },
  
  sendMessage: (sessionId, content) => {
    return api.post(`/api/chat/sessions/${sessionId}/messages`, { content })
  },
  
  deleteSession: (sessionId) => {
    return api.delete(`/api/chat/sessions/${sessionId}`)
  },
  
  updateSessionTitle: (sessionId, title) => {
    return api.put(`/api/chat/sessions/${sessionId}/title`, { title })
  }
}

// Search API
export const searchAPI = {
  search: (query, options = {}) => {
    const params = {
      q: query,
      limit: options.limit || 10,
      search_type: options.searchType || 'hybrid'
    }
    return api.get('/api/search', { params })
  },
  
  findSimilar: (documentId, limit = 5) => {
    return api.get(`/api/search/similar/${documentId}`, {
      params: { limit }
    })
  }
}

// Analytics API
export const analyticsAPI = {
  getUsageAnalytics: (days = 30) => {
    return api.get('/api/analytics/usage', { params: { days } })
  },
  
  getDocumentAnalytics: () => {
    return api.get('/api/analytics/documents')
  },
  
  getDashboardData: () => {
    return api.get('/api/analytics/dashboard')
  },
  
  getPerformanceMetrics: () => {
    return api.get('/api/analytics/performance')
  }
}

export default api

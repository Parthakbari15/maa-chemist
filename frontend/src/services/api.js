import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    if (error.response?.status === 404) {
      window.showToast('Resource not found', 'error')
    } else if (error.response?.status >= 500) {
      window.showToast('Server error. Please try again.', 'error')
    } else if (error.code === 'ECONNREFUSED') {
      window.showToast('Cannot connect to server. Is JSON Server running?', 'error')
    }
    return Promise.reject(error)
  }
)

// Agency API
export const agencyAPI = {
  getAll: () => api.get('/agencies'),
  getById: (id) => api.get(`/agencies/${id}`),
  create: (data) => api.post('/agencies', data),
  update: (id, data) => api.put(`/agencies/${id}`, data),
  delete: (id) => api.delete(`/agencies/${id}`),
}

// Purchase API
export const purchaseAPI = {
  getAll: () => api.get('/purchases'),
  getById: (id) => api.get(`/purchases/${id}`),
  create: (data) => api.post('/purchases', data),
  update: (id, data) => api.put(`/purchases/${id}`, data),
  delete: (id) => api.delete(`/purchases/${id}`),
}

// Sales API
export const salesAPI = {
  getAll: () => api.get('/sales'),
  getById: (id) => api.get(`/sales/${id}`),
  create: (data) => api.post('/sales', data),
  update: (id, data) => api.put(`/sales/${id}`, data),
  delete: (id) => api.delete(`/sales/${id}`),
}

export default api

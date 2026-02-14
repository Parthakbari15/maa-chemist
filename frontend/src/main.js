import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './style.css'

const app = createApp(App)
const pinia = createPinia()

// Global error handler
app.config.errorHandler = (err, instance, info) => {
  console.error('Global error:', err)
  console.error('Component instance:', instance)
  console.error('Error info:', info)
  
  // Show user-friendly error message
  if (window.showToast) {
    window.showToast('An unexpected error occurred. Please refresh the page.', 'error')
  }
}

// Global warning handler
app.config.warnHandler = (msg, instance, trace) => {
  console.warn('Vue warning:', msg)
  console.warn('Trace:', trace)
}

app.use(pinia)
app.use(router)
app.mount('#app')

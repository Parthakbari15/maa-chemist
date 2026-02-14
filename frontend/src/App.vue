<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <div class="flex">
      <!-- Sidebar -->
      <Sidebar />
      
      <!-- Main Content -->
      <div class="flex-1 flex flex-col">
        <Navbar />
        <main class="flex-1 p-6">
          <router-view />
        </main>
      </div>
    </div>
    
    <!-- Toast Container -->
    <div class="fixed bottom-4 right-4 z-50 space-y-2">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[
          'p-4 rounded-lg shadow-lg text-white animate-slide-up',
          toast.type === 'success' ? 'bg-green-500' : 
          toast.type === 'error' ? 'bg-red-500' : 
          toast.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
        ]"
      >
        {{ toast.message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import Navbar from '@/components/Navbar.vue'

const toasts = ref([])

const showToast = (message, type = 'info') => {
  const toast = {
    id: Date.now(),
    message,
    type
  }
  toasts.value.push(toast)
  
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== toast.id)
  }, 3000)
}

onMounted(() => {
  // Make showToast globally available
  window.showToast = showToast
})
</script>

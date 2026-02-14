<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <h1 class="text-2xl font-bold text-purple-600">Maa Chemist</h1>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <button
              @click="goToLogin"
              class="btn btn-primary"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Maa Chemist
        </h1>
        <p class="text-xl text-gray-600 mb-8">
          Medical & General Store Management System
        </p>
        
        <!-- Feature Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div class="card hover:shadow-lg transition-shadow">
            <div class="p-6">
              <div class="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
                <svg class="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Sales Management</h3>
              <p class="text-gray-600 mb-4">Manage customer sales, billing, and transactions efficiently.</p>
              <button
                @click="goToSales"
                class="text-purple-600 hover:text-purple-700 font-medium"
              >
                Learn more →
              </button>
            </div>
          </div>

          <div class="card hover:shadow-lg transition-shadow">
            <div class="p-6">
              <div class="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Purchase Management</h3>
              <p class="text-gray-600 mb-4">Track purchases from suppliers, manage inventory, and bills.</p>
              <button
                @click="goToPurchase"
                class="text-blue-600 hover:text-blue-700 font-medium"
              >
                Learn more →
              </button>
            </div>
          </div>

          <div class="card hover:shadow-lg transition-shadow">
            <div class="p-6">
              <div class="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
                <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Stock Management</h3>
              <p class="text-gray-600 mb-4">Monitor inventory levels, track products, and manage stock.</p>
              <button
                @click="goToStock"
                class="text-green-600 hover:text-green-700 font-medium"
              >
                Learn more →
              </button>
            </div>
          </div>
        </div>

        <!-- CTA Section -->
        <div class="mt-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-8 text-white">
          <h2 class="text-3xl font-bold mb-4">Get Started Today</h2>
          <p class="text-xl mb-6">Streamline your medical store operations with our comprehensive management system.</p>
          <div class="flex justify-center space-x-4">
            <button
              @click="goToLogin"
              class="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Login to Dashboard
            </button>
            <button
              @click="goToDashboard"
              class="bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-800 transition-colors"
            >
              View Demo
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-50 border-t mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center">
          <p class="text-gray-600">© 2024 Maa Chemist. All rights reserved.</p>
          <p class="text-gray-500 text-sm mt-2">Medical & General Store | GSTIN: 07AAAPM1234C1ZY</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToLogin = () => {
  router.push('/login')
}

const goToDashboard = () => {
  router.push('/dashboard')
}

const goToSales = () => {
  router.push('/sales')
}

const goToPurchase = () => {
  router.push('/purchase')
}

const goToStock = () => {
  router.push('/stock')
}
</script>

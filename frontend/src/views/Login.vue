<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <div class="mx-auto h-12 w-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
          <span class="text-white font-bold text-xl">MC</span>
        </div>
        <h2 class="mt-6 text-3xl font-bold text-gray-900">
          Maa Chemist
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Sign in to your account
        </p>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="mt-8 space-y-6">
        <div class="card">
          <div class="space-y-6">
            <!-- Email/Username -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">
                Email or Username
              </label>
              <div class="mt-1">
                <input
                  id="email"
                  v-model="loginForm.email"
                  name="email"
                  type="text"
                  required
                  class="input w-full px-4 py-3"
                  placeholder="Enter your email or username"
                  style="min-height: 48px; font-size: 15px;"
                />
              </div>
            </div>

            <!-- Password -->
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div class="mt-1">
                <input
                  id="password"
                  v-model="loginForm.password"
                  name="password"
                  type="password"
                  required
                  class="input w-full px-4 py-3"
                  placeholder="Enter your password"
                  style="min-height: 48px; font-size: 15px;"
                />
              </div>
            </div>

            <!-- Remember Me -->
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input
                  id="remember-me"
                  v-model="loginForm.rememberMe"
                  name="remember-me"
                  type="checkbox"
                  class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div class="text-sm">
                <a href="#" class="font-medium text-purple-600 hover:text-purple-500">
                  Forgot your password?
                </a>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {{ errorMessage }}
            </div>

            <!-- Login Button -->
            <div>
              <button
                type="submit"
                :disabled="isLoading"
                class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                style="min-height: 48px; font-size: 15px;"
              >
                <span v-if="isLoading" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
                <span v-else>
                  Sign in
                </span>
              </button>
            </div>
          </div>
        </div>
      </form>

      <!-- Demo Credentials -->
      <div class="text-center">
        <p class="text-sm text-gray-600">
          Demo credentials: admin@maachemist.com / admin123
        </p>
      </div>

      <!-- Footer -->
      <div class="text-center">
        <p class="text-xs text-gray-500">
          © 2024 Maa Chemist. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const loginForm = ref({
  email: '',
  password: '',
  rememberMe: false
})

const isLoading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  try {
    isLoading.value = true
    errorMessage.value = ''

    // Simulate login API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Simple validation (in real app, this would be an API call)
    if (loginForm.value.email === 'admin@maachemist.com' && loginForm.value.password === 'admin123') {
      // Store login state (in real app, use proper auth)
      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem('user', JSON.stringify({
        email: loginForm.value.email,
        name: 'Admin User'
      }))
      
      // Redirect to dashboard
      router.push('/dashboard')
    } else {
      errorMessage.value = 'Invalid email or password'
    }
  } catch (error) {
    errorMessage.value = 'An error occurred during login'
  } finally {
    isLoading.value = false
  }
}
</script>

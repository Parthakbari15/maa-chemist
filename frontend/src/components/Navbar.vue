<template>
  <nav class="bg-white shadow-sm border-b border-gray-200">
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Left side -->
        <div class="flex items-center">
          <button
            @click="toggleSidebar"
            class="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 lg:hidden"
          >
            <Menu class="h-6 w-6" />
          </button>
          
          <div class="flex items-center ml-4 lg:ml-0">
            <div class="flex items-center space-x-3">
              <div class="bg-blue-600 rounded-lg p-2">
                <Package class="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 class="text-xl font-bold text-gray-900">Inventory Management</h1>
                <p class="text-xs text-gray-500">Medical & General Store</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right side -->
        <div class="flex items-center space-x-4">
          <!-- Notifications -->
          <div class="relative">
            <button
              @click="toggleNotifications"
              class="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 relative"
            >
              <Bell class="h-5 w-5" />
              <span
                v-if="notificationCount > 0"
                class="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse"
              ></span>
            </button>
            
            <!-- Notifications Dropdown -->
            <div
              v-if="showNotifications"
              class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 animate-slide-up"
            >
              <div class="p-4 border-b border-gray-200">
                <h3 class="text-sm font-medium text-gray-900">Notifications</h3>
              </div>
              <div class="max-h-64 overflow-y-auto">
                <div
                  v-for="notification in notifications"
                  :key="notification.id"
                  class="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                >
                  <div class="flex items-start space-x-3">
                    <div
                      :class="[
                        'flex-shrink-0 w-2 h-2 rounded-full mt-2',
                        notification.type === 'warning' ? 'bg-yellow-500' :
                        notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'
                      ]"
                    ></div>
                    <div class="flex-1">
                      <p class="text-sm text-gray-900">{{ notification.message }}</p>
                      <p class="text-xs text-gray-500 mt-1">{{ notification.time }}</p>
                    </div>
                  </div>
                </div>
                <div v-if="notifications.length === 0" class="p-4 text-center text-gray-500">
                  <p class="text-sm">No new notifications</p>
                </div>
              </div>
            </div>
          </div>

          <!-- User Menu -->
          <div class="relative">
            <button
              @click="toggleUserMenu"
              class="flex items-center space-x-2 p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <div class="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User class="h-4 w-4 text-white" />
              </div>
              <ChevronDown class="h-4 w-4" />
            </button>
            
            <!-- User Menu Dropdown -->
            <div
              v-if="showUserMenu"
              class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 animate-slide-up"
            >
              <div class="py-1">
                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                <hr class="my-1">
                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { usePurchaseStore } from '@/stores/purchaseStore'
import { useStockStore } from '@/stores/stockStore'
import { Menu, Package, Bell, ChevronDown, User } from 'lucide-vue-next'

const purchaseStore = usePurchaseStore()
const stockStore = useStockStore()

const showNotifications = ref(false)
const showUserMenu = ref(false)

const notifications = computed(() => {
  const notifs = []
  
  // Expiry notifications
  const expiringItems = stockStore.expiringStockItems || []
  if (expiringItems.length > 0) {
    notifs.push({
      id: 'expiry',
      type: 'warning',
      message: `${expiringItems.length} items expiring soon`,
      time: 'Just now'
    })
  }
  
  // Low stock notifications
  const lowStockItems = stockStore.lowStockItems || []
  if (lowStockItems.length > 0) {
    notifs.push({
      id: 'low-stock',
      type: 'warning',
      message: `${lowStockItems.length} items with low stock`,
      time: 'Just now'
    })
  }
  
  // Out of stock notifications
  const outOfStockItems = stockStore.outOfStockItems || []
  if (outOfStockItems.length > 0) {
    notifs.push({
      id: 'out-of-stock',
      type: 'error',
      message: `${outOfStockItems.length} items out of stock`,
      time: 'Just now'
    })
  }
  
  return notifs
})

const notificationCount = computed(() => notifications.value.length)

const toggleSidebar = () => {
  // Emit event to parent or use a global state
  document.dispatchEvent(new CustomEvent('toggle-sidebar'))
}

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  showUserMenu.value = false
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
  showNotifications.value = false
}

// Close dropdowns when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    showNotifications.value = false
    showUserMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

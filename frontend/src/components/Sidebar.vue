<template>
  <aside
    :class="[
      'bg-gray-900 text-white transition-all duration-300 ease-in-out',
      isCollapsed ? 'w-16' : 'w-64'
    ]"
  >
    <div class="flex flex-col h-full">
      <!-- Logo/Brand -->
      <div class="p-4 border-b border-gray-800">
        <div class="flex items-center space-x-3">
          <div class="bg-blue-600 rounded-lg p-2 flex-shrink-0">
            <Package class="h-6 w-6 text-white" />
          </div>
          <div v-if="!isCollapsed" class="animate-fade-in">
            <h2 class="text-lg font-bold">Inventory</h2>
            <p class="text-xs text-gray-400">Management System</p>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-4 space-y-2">
        <router-link
          v-for="item in navigationItems"
          :key="item.name"
          :to="item.to"
          :class="[
            'flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 group',
            $route.name === item.name
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          ]"
        >
          <component
            :is="item.icon"
            :class="[
              'h-5 w-5 flex-shrink-0',
              $route.name === item.name ? 'text-white' : 'text-gray-400 group-hover:text-white'
            ]"
          />
          <span v-if="!isCollapsed" class="animate-fade-in">{{ item.label }}</span>
          
          <!-- Badge for notifications -->
          <span
            v-if="!isCollapsed && item.badge && item.badge > 0"
            class="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-bounce-in"
          >
            {{ item.badge }}
          </span>
        </router-link>
      </nav>

      <!-- Bottom Section -->
      <div class="p-4 border-t border-gray-800">
        <button
          @click="toggleCollapse"
          class="w-full flex items-center justify-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200"
        >
          <Menu class="h-5 w-5" />
          <span v-if="!isCollapsed" class="animate-fade-in">Collapse</span>
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStockStore } from '@/stores/stockStore'
import { 
  Package, 
  ShoppingCart, 
  DollarSign, 
  Archive, 
  Menu,
  LayoutDashboard,
  Building 
} from 'lucide-vue-next'

const stockStore = useStockStore()
const isCollapsed = ref(false)

const navigationItems = computed(() => [
  {
    name: 'Dashboard',
    label: 'Dashboard',
    to: '/',
    icon: LayoutDashboard,
    badge: 0
  },
  {
    name: 'Purchase',
    label: 'Purchase',
    to: '/purchase',
    icon: ShoppingCart,
    badge: 0
  },
  {
    name: 'Sales',
    label: 'Sales',
    to: '/sales',
    icon: DollarSign,
    badge: 0
  },
  {
    name: 'Stocks',
    label: 'Stocks',
    to: '/stock',
    icon: Archive,
    badge: (stockStore.lowStockItems?.length || 0) + (stockStore.expiringStockItems?.length || 0)
  },
  {
    name: 'Agencies',
    label: 'Agencies',
    to: '/agencies',
    icon: Building,
    badge: 0
  }
])

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

onMounted(() => {
  // Listen for toggle event from navbar
  document.addEventListener('toggle-sidebar', () => {
    isCollapsed.value = !isCollapsed.value
  })
})
</script>

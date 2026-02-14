<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <button
          @click="$router.go(-1)"
          class="btn btn-secondary flex items-center space-x-2"
        >
          <ArrowLeft class="h-4 w-4" />
          <span>Back</span>
        </button>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ stock?.productName }}</h1>
          <p class="text-gray-600">Stock Details & Analytics</p>
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <button
          @click="addPurchase"
          class="btn btn-success flex items-center space-x-2"
        >
          <Plus class="h-4 w-4" />
          <span>Add Purchase</span>
        </button>
        <button
          @click="addSale"
          class="btn btn-primary flex items-center space-x-2"
        >
          <DollarSign class="h-4 w-4" />
          <span>Add Sale</span>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="spinner"></div>
      <span class="ml-2 text-gray-600">Loading stock details...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="card border-red-200 bg-red-50">
      <div class="flex items-center space-x-3">
        <AlertCircle class="h-5 w-5 text-red-600" />
        <div>
          <h3 class="font-medium text-red-900">Error</h3>
          <p class="text-red-700">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Stock Details -->
    <div v-else-if="stock" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Information -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Stock Overview Card -->
        <div class="card">
          <div class="flex items-center space-x-3 mb-6">
            <div class="bg-blue-100 rounded-lg p-3">
              <Package class="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-900">{{ stock.productName }}</h2>
              <p class="text-gray-600">Current Stock Status</p>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-6">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Available Stock</label>
                <div class="flex items-center space-x-2">
                  <span class="text-3xl font-bold" :class="getStockClass(stock.availableStock)">
                    {{ stock.availableStock }}
                  </span>
                  <span class="text-sm text-gray-500">units</span>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Total Purchased</label>
                <div class="flex items-center space-x-2">
                  <span class="text-2xl font-bold text-green-600">{{ stock.totalPurchased }}</span>
                  <span class="text-sm text-gray-500">units</span>
                </div>
              </div>
            </div>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Total Sold</label>
                <div class="flex items-center space-x-2">
                  <span class="text-2xl font-bold text-red-600">{{ stock.totalSold }}</span>
                  <span class="text-sm text-gray-500">units</span>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Latest Expiry</label>
                <div class="flex items-center space-x-2">
                  <Calendar class="h-4 w-4 text-gray-500" />
                  <span :class="getExpiryClass(stock.latestExpiryDate)">
                    {{ stock.latestExpiryDate ? formatDate(stock.latestExpiryDate) : 'N/A' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Stock Analytics Card -->
        <div class="card">
          <div class="flex items-center space-x-3 mb-6">
            <div class="bg-purple-100 rounded-lg p-3">
              <TrendingUp class="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-900">Financial Analytics</h2>
              <p class="text-gray-600">Purchase and sales performance</p>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-6">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Purchase Value</label>
                <div class="flex items-center space-x-2">
                  <span class="text-2xl font-bold text-red-600">${{ (stock.purchaseValue || 0).toFixed(2) }}</span>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Avg Purchase Price</label>
                <div class="flex items-center space-x-2">
                  <span class="text-xl font-bold text-gray-900">
                    ${{ (avgPurchasePrice || 0).toFixed(2) }}
                  </span>
                  <span class="text-sm text-gray-500">per unit</span>
                </div>
              </div>
            </div>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Sales Value</label>
                <div class="flex items-center space-x-2">
                  <span class="text-2xl font-bold text-green-600">${{ (stock.salesValue || 0).toFixed(2) }}</span>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Avg Sale Price</label>
                <div class="flex items-center space-x-2">
                  <span class="text-xl font-bold text-gray-900">
                    ${{ (avgSalePrice || 0).toFixed(2) }}
                  </span>
                  <span class="text-sm text-gray-500">per unit</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="mt-6 pt-6 border-t border-gray-200">
            <div class="flex justify-between items-center">
              <span class="text-lg font-medium text-gray-700">Total Profit</span>
              <span class="text-2xl font-bold" :class="totalProfit >= 0 ? 'text-green-600' : 'text-red-600'">
                ${{ (totalProfit || 0).toFixed(2) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Stock Status Chart -->
        <div class="card">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Stock Status</h3>
          <div class="space-y-4">
            <div>
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm font-medium text-gray-700">Stock Level</span>
                <span class="text-sm font-bold" :class="getStockClass(stock.availableStock)">
                  {{ stock.availableStock }} units
                </span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-3">
                <div
                  :class="[
                    'h-3 rounded-full transition-all duration-500',
                    getStockBarClass(stock.availableStock)
                  ]"
                  :style="{ width: `${Math.min(100, (stock.availableStock / Math.max(stock.totalPurchased, 1)) * 100)}%` }"
                ></div>
              </div>
            </div>
            
            <div class="grid grid-cols-3 gap-4 text-center">
              <div class="p-3 bg-green-50 rounded-lg">
                <p class="text-xs text-green-600 font-medium">In Stock</p>
                <p class="text-lg font-bold text-green-900">{{ stock.availableStock }}</p>
              </div>
              <div class="p-3 bg-red-50 rounded-lg">
                <p class="text-xs text-red-600 font-medium">Sold</p>
                <p class="text-lg font-bold text-red-900">{{ stock.totalSold }}</p>
              </div>
              <div class="p-3 bg-blue-50 rounded-lg">
                <p class="text-xs text-blue-600 font-medium">Total</p>
                <p class="text-lg font-bold text-blue-900">{{ stock.totalPurchased }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar Information -->
      <div class="space-y-6">
        <!-- Status Card -->
        <div class="card">
          <div class="flex items-center space-x-3 mb-4">
            <div class="bg-gray-100 rounded-lg p-2">
              <Activity class="h-5 w-5 text-gray-600" />
            </div>
            <h3 class="font-semibold text-gray-900">Status</h3>
          </div>
          
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Stock Status</span>
              <span :class="getStatusBadgeClass(stock)">
                {{ getStatusText(stock) }}
              </span>
            </div>
            <div v-if="stock.latestExpiryDate" class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Expiry Status</span>
              <span :class="getExpiryBadgeClass(stock.latestExpiryDate)">
                {{ getExpiryText(stock.latestExpiryDate) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Quick Actions Card -->
        <div class="card">
          <h3 class="font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div class="space-y-2">
            <button
              @click="addPurchase"
              class="btn btn-success w-full flex items-center justify-center space-x-2"
            >
              <ShoppingCart class="h-4 w-4" />
              <span>Add Purchase</span>
            </button>
            <button
              @click="addSale"
              class="btn btn-primary w-full flex items-center justify-center space-x-2"
              :disabled="stock.availableStock <= 0"
            >
              <DollarSign class="h-4 w-4" />
              <span>Add Sale</span>
            </button>
            <button
              @click="exportData"
              class="btn btn-secondary w-full flex items-center justify-center space-x-2"
            >
              <Download class="h-4 w-4" />
              <span>Export Data</span>
            </button>
          </div>
        </div>

        <!-- Recent Purchases -->
        <div class="card">
          <h3 class="font-semibold text-gray-900 mb-4">Recent Purchases</h3>
          <div class="space-y-2">
            <div
              v-for="purchase in recentPurchases"
              :key="purchase.id"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
              @click="viewPurchaseDetail(purchase.id)"
            >
              <div>
                <p class="font-medium text-gray-900">{{ purchase.quantity }} units</p>
                <p class="text-xs text-gray-500">{{ formatDate(purchase.date) }}</p>
              </div>
              <div class="text-right">
                <p class="font-medium text-gray-900">${{ (purchase.total || 0).toFixed(2) }}</p>
                <ChevronRight class="h-4 w-4 text-gray-400 inline" />
              </div>
            </div>
            <div v-if="recentPurchases.length === 0" class="text-center text-gray-500 py-4">
              <p class="text-sm">No purchases found</p>
            </div>
          </div>
        </div>

        <!-- Recent Sales -->
        <div class="card">
          <h3 class="font-semibold text-gray-900 mb-4">Recent Sales</h3>
          <div class="space-y-2">
            <div
              v-for="sale in recentSales"
              :key="sale.id"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
              @click="viewSaleDetail(sale.id)"
            >
              <div>
                <p class="font-medium text-gray-900">{{ sale.quantity }} units</p>
                <p class="text-xs text-gray-500">{{ formatDate(sale.date) }}</p>
              </div>
              <div class="text-right">
                <p class="font-medium text-gray-900">${{ (sale.total || 0).toFixed(2) }}</p>
                <ChevronRight class="h-4 w-4 text-gray-400 inline" />
              </div>
            </div>
            <div v-if="recentSales.length === 0" class="text-center text-gray-500 py-4">
              <p class="text-sm">No sales found</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStockStore } from '@/stores/stockStore'
import { usePurchaseStore } from '@/stores/purchaseStore'
import { useSalesStore } from '@/stores/salesStore'
import {
  ArrowLeft,
  Plus,
  DollarSign,
  Package,
  Calendar,
  TrendingUp,
  ShoppingCart,
  Download,
  ChevronRight,
  AlertCircle,
  Activity
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const stockStore = useStockStore()
const purchaseStore = usePurchaseStore()
const salesStore = useSalesStore()

const loading = ref(true)
const error = ref(null)

const stock = computed(() => {
  const productName = decodeURIComponent(route.params.productName)
  return stockStore.getStockByProduct(productName)
})

const avgPurchasePrice = computed(() => {
  if (!stock.value || stock.value.totalPurchased === 0) return 0
  return stock.value.purchaseValue / stock.value.totalPurchased
})

const avgSalePrice = computed(() => {
  if (!stock.value || stock.value.totalSold === 0) return 0
  return stock.value.salesValue / stock.value.totalSold
})

const totalProfit = computed(() => {
  if (!stock.value) return 0
  return stock.value.salesValue - stock.value.purchaseValue
})

const recentPurchases = computed(() => {
  if (!stock.value) return []
  const purchases = purchaseStore.getPurchasesByProduct(stock.value.productName)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)
  
  // Handle complex purchase structures
  return purchases.map(purchase => {
    if (purchase.items && purchase.items.length > 0) {
      const firstItem = purchase.items[0]
      return {
        ...purchase,
        quantity: firstItem.tQty,
        total: purchase.billTotal
      }
    }
    return purchase
  })
})

const recentSales = computed(() => {
  if (!stock.value) return []
  const sales = salesStore.getSalesByProduct(stock.value.productName)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)
  
  // Handle complex sale structures
  return sales.map(sale => {
    if (sale.items && sale.items.length > 0) {
      const firstItem = sale.items[0]
      return {
        ...sale,
        quantity: firstItem.qty,
        total: sale.grandTotal
      }
    }
    return sale
  })
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getStockClass = (quantity) => {
  if (quantity <= 0) return 'text-red-600'
  if (quantity <= 10) return 'text-yellow-600'
  return 'text-green-600'
}

const getStockBarClass = (quantity) => {
  if (quantity <= 0) return 'bg-red-500'
  if (quantity <= 10) return 'bg-yellow-500'
  return 'bg-green-500'
}

const getExpiryClass = (expiryDate) => {
  const daysUntilExpiry = Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24))
  if (daysUntilExpiry <= 2) return 'text-red-600 font-medium'
  if (daysUntilExpiry <= 7) return 'text-orange-600 font-medium'
  if (daysUntilExpiry <= 30) return 'text-yellow-600 font-medium'
  return 'text-green-600 font-medium'
}

const getStatusBadgeClass = (stock) => {
  if (stock.availableStock <= 0) return 'badge-danger'
  if (stock.availableStock <= 10) return 'badge-warning'
  if (stock.isExpiringSoon) return 'badge-warning'
  return 'badge-success'
}

const getStatusText = (stock) => {
  if (stock.availableStock <= 0) return 'Out of Stock'
  if (stock.availableStock <= 10) return 'Low Stock'
  if (stock.isExpiringSoon) return 'Expiring Soon'
  return 'In Stock'
}

const getExpiryBadgeClass = (expiryDate) => {
  const daysUntilExpiry = Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24))
  if (daysUntilExpiry <= 2) return 'badge-danger'
  if (daysUntilExpiry <= 7) return 'badge-warning'
  if (daysUntilExpiry <= 30) return 'badge-yellow'
  return 'badge-success'
}

const getExpiryText = (expiryDate) => {
  const daysUntilExpiry = Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24))
  if (daysUntilExpiry <= 0) return 'Expired'
  if (daysUntilExpiry <= 7) return 'Expiring Soon'
  if (daysUntilExpiry <= 30) return 'Expiring Soon'
  return 'Good'
}

const addPurchase = () => {
  router.push('/purchase')
  sessionStorage.setItem('prefillProduct', stock.value.productName)
}

const addSale = () => {
  router.push('/sales')
  sessionStorage.setItem('prefillProduct', stock.value.productName)
}

const viewPurchaseDetail = (purchaseId) => {
  router.push(`/purchase/${purchaseId}`)
}

const viewSaleDetail = (saleId) => {
  router.push(`/sales/${saleId}`)
}

const exportData = () => {
  const csvContent = [
    ['Product Name', 'Available Stock', 'Total Purchased', 'Total Sold', 'Purchase Value', 'Sales Value', 'Profit'],
    [
      stock.value.productName,
      stock.value.availableStock,
      stock.value.totalPurchased,
      stock.value.totalSold,
      stock.value.purchaseValue.toFixed(2),
      stock.value.salesValue.toFixed(2),
      totalProfit.value.toFixed(2)
    ]
  ].map(row => row.join(',')).join('\n')
  
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `stock-${stock.value.productName}-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  window.URL.revokeObjectURL(url)
  
  window.showToast('Stock data exported successfully', 'success')
}

onMounted(async () => {
  try {
    await Promise.all([
      stockStore.refreshStock(),
      purchaseStore.fetchPurchases(),
      salesStore.fetchSales()
    ])
    
    if (!stock.value) {
      error.value = 'Stock not found'
    }
  } catch (err) {
    error.value = 'Failed to load stock details'
    console.error('Error loading stock details:', err)
  } finally {
    loading.value = false
  }
})
</script>

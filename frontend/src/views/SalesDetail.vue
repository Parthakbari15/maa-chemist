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
          <h1 class="text-2xl font-bold text-gray-900">Sale Details</h1>
          <p class="text-gray-600">Sale ID: #{{ sale?.id }}</p>
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <button
          @click="editSale"
          class="btn btn-primary flex items-center space-x-2"
        >
          <Edit class="h-4 w-4" />
          <span>Edit</span>
        </button>
        <button
          @click="deleteSale"
          class="btn btn-danger flex items-center space-x-2"
        >
          <Trash2 class="h-4 w-4" />
          <span>Delete</span>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="spinner"></div>
      <span class="ml-2 text-gray-600">Loading sale details...</span>
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

    <!-- Sale Details -->
    <div v-else-if="sale" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Information -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Product Info Card -->
        <div class="card">
          <div class="flex items-center space-x-3 mb-6">
            <div class="bg-green-100 rounded-lg p-3">
              <DollarSign class="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-900">{{ sale.productName }}</h2>
              <p class="text-gray-600">Sales Information</p>
            </div>
          </div>
          
          <!-- Bill Information (for complex sales) -->
          <div v-if="sale.billNo" class="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 class="font-semibold text-gray-900 mb-3">Bill Information</h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Bill Number</label>
                <p class="font-medium">{{ sale.billNo }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Bill Date</label>
                <p class="font-medium">{{ formatDate(sale.billDate) }}</p>
              </div>
              <div v-if="sale.toName">
                <label class="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                <p class="font-medium">{{ sale.toName }}</p>
              </div>
              <div v-if="sale.toMobile">
                <label class="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                <p class="font-medium">{{ sale.toMobile }}</p>
              </div>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-6">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Quantity Sold</label>
                <div class="flex items-center space-x-2">
                  <span class="text-2xl font-bold text-gray-900">{{ sale.quantity }}</span>
                  <span class="text-sm text-gray-500">units</span>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Sale Price</label>
                <div class="flex items-center space-x-2">
                  <span class="text-2xl font-bold text-green-600">${{ (sale.salePrice || 0).toFixed(2) }}</span>
                  <span class="text-sm text-gray-500">per unit</span>
                </div>
              </div>
            </div>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Total Revenue</label>
                <div class="flex items-center space-x-2">
                  <span class="text-3xl font-bold text-green-600">${{ (sale.total || 0).toFixed(2) }}</span>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Sale Date</label>
                <div class="flex items-center space-x-2">
                  <Calendar class="h-4 w-4 text-gray-500" />
                  <span class="font-medium text-gray-900">{{ formatDate(sale.date) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Profit Analysis Card -->
        <div class="card">
          <div class="flex items-center space-x-3 mb-6">
            <div class="bg-purple-100 rounded-lg p-3">
              <TrendingUp class="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-900">Profit Analysis</h2>
              <p class="text-gray-600">Financial performance of this sale</p>
            </div>
          </div>
          
          <div class="grid grid-cols-3 gap-4">
            <div class="text-center p-4 bg-green-50 rounded-lg">
              <p class="text-sm text-green-600 font-medium">Revenue</p>
              <p class="text-2xl font-bold text-green-900">${{ (sale.total || 0).toFixed(2) }}</p>
            </div>
            <div class="text-center p-4 bg-red-50 rounded-lg">
              <p class="text-sm text-red-600 font-medium">Cost</p>
              <p class="text-2xl font-bold text-red-900">${{ totalCost.toFixed(2) }}</p>
            </div>
            <div class="text-center p-4 bg-purple-50 rounded-lg">
              <p class="text-sm text-purple-600 font-medium">Profit</p>
              <p class="text-2xl font-bold" :class="profit >= 0 ? 'text-purple-900' : 'text-red-900'">
                ${{ profit.toFixed(2) }}
              </p>
            </div>
          </div>
          
          <div class="mt-4">
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm font-medium text-gray-700">Profit Margin</span>
              <span class="text-sm font-bold" :class="profitMargin >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ profitMargin.toFixed(1) }}%
              </span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                :class="[
                  'h-2 rounded-full transition-all duration-500',
                  profitMargin >= 0 ? 'bg-green-500' : 'bg-red-500'
                ]"
                :style="{ width: `${Math.abs(profitMargin)}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar Information -->
      <div class="space-y-6">
        <!-- Sale Info Card -->
        <div class="card">
          <div class="flex items-center space-x-3 mb-4">
            <div class="bg-gray-100 rounded-lg p-2">
              <ShoppingCart class="h-5 w-5 text-gray-600" />
            </div>
            <h3 class="font-semibold text-gray-900">Sale Information</h3>
          </div>
          
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Sale ID</span>
              <span class="font-medium">#{{ sale.id }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Sale Date</span>
              <span class="font-medium">{{ formatDate(sale.date) }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Status</span>
              <span class="badge badge-success">Completed</span>
            </div>
          </div>
        </div>

        <!-- Stock Impact Card -->
        <div class="card">
          <div class="flex items-center space-x-3 mb-4">
            <div class="bg-blue-100 rounded-lg p-2">
              <Package class="h-5 w-5 text-blue-600" />
            </div>
            <h3 class="font-semibold text-gray-900">Stock Impact</h3>
          </div>
          
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Stock Before</span>
              <span class="font-medium">{{ stockBeforeSale }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Quantity Sold</span>
              <span class="font-medium text-red-600">-{{ sale.quantity }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Current Stock</span>
              <span class="font-medium text-blue-600">{{ currentStock }}</span>
            </div>
          </div>
        </div>

        <!-- Actions Card -->
        <div class="card">
          <h3 class="font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div class="space-y-2">
            <button
              @click="createPurchase"
              class="btn btn-success w-full flex items-center justify-center space-x-2"
            >
              <ShoppingCart class="h-4 w-4" />
              <span>Reorder Product</span>
            </button>
            <button
              @click="viewStock"
              class="btn btn-secondary w-full flex items-center justify-center space-x-2"
            >
              <Package class="h-4 w-4" />
              <span>View Stock</span>
            </button>
            <button
              @click="printDetails"
              class="btn btn-secondary w-full flex items-center justify-center space-x-2"
            >
              <Printer class="h-4 w-4" />
              <span>Print Details</span>
            </button>
          </div>
        </div>

        <!-- Related Transactions -->
        <div class="card">
          <h3 class="font-semibold text-gray-900 mb-4">Related Purchases</h3>
          <div class="space-y-2">
            <div
              v-for="purchase in relatedPurchases"
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
            <div v-if="relatedPurchases.length === 0" class="text-center text-gray-500 py-4">
              <p class="text-sm">No related purchases found</p>
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
import { useSalesStore } from '@/stores/salesStore'
import { usePurchaseStore } from '@/stores/purchaseStore'
import { useStockStore } from '@/stores/stockStore'
import {
  ArrowLeft,
  Edit,
  Trash2,
  DollarSign,
  Calendar,
  TrendingUp,
  ShoppingCart,
  Package,
  Printer,
  ChevronRight,
  AlertCircle
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const salesStore = useSalesStore()
const purchaseStore = usePurchaseStore()
const stockStore = useStockStore()

const loading = ref(true)
const error = ref(null)

const sale = computed(() => {
  const saleData = salesStore.getSaleById(parseInt(route.params.id))
  if (!saleData) return null
  
  // Handle complex sale structure (with items array) vs simple structure
  if (saleData.items && saleData.items.length > 0) {
    // Complex structure - use first item for display
    const firstItem = saleData.items[0]
    return {
      ...saleData,
      productName: firstItem.product,
      quantity: firstItem.qty,
      salePrice: firstItem.mrp,
      total: saleData.grandTotal
    }
  }
  
  // Simple structure - return as-is
  return saleData
})

const currentStock = computed(() => {
  if (!sale.value) return 0
  const stock = stockStore.getStockByProduct(sale.value.productName)
  return stock?.availableStock || 0
})

const stockBeforeSale = computed(() => {
  if (!sale.value) return 0
  return currentStock.value + sale.value.quantity
})

const totalCost = computed(() => {
  if (!sale.value) return 0
  const stock = stockStore.getStockByProduct(sale.value.productName)
  const avgPurchasePrice = stock?.totalPurchased > 0 ? stock.purchaseValue / stock.totalPurchased : 0
  return sale.value.quantity * avgPurchasePrice
})

const profit = computed(() => {
  if (!sale.value) return 0
  return sale.value.total - totalCost.value
})

const profitMargin = computed(() => {
  if (!sale.value || sale.value.total === 0) return 0
  return (profit.value / sale.value.total) * 100
})

const relatedPurchases = computed(() => {
  if (!sale.value) return []
  return purchaseStore.getPurchasesByProduct(sale.value.productName)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const editSale = () => {
  router.push('/sales')
  sessionStorage.setItem('editSaleId', sale.value.id)
}

const deleteSale = async () => {
  if (confirm('Are you sure you want to delete this sale? This will add the quantity back to stock.')) {
    try {
      await salesStore.deleteSale(sale.value.id)
      router.push('/sales')
    } catch (error) {
      console.error('Failed to delete sale:', error)
    }
  }
}

const createPurchase = () => {
  router.push('/purchase')
  sessionStorage.setItem('prefillProduct', sale.value.productName)
}

const viewStock = () => {
  router.push(`/stocks/${encodeURIComponent(sale.value.productName)}`)
}

const viewPurchaseDetail = (purchaseId) => {
  router.push(`/purchase/${purchaseId}`)
}

const printDetails = () => {
  window.print()
}

onMounted(async () => {
  try {
    await Promise.all([
      salesStore.fetchSales(),
      purchaseStore.fetchPurchases(),
      stockStore.refreshStock()
    ])
    
    if (!sale.value) {
      error.value = 'Sale not found'
    }
  } catch (err) {
    error.value = 'Failed to load sale details'
    console.error('Error loading sale details:', err)
  } finally {
    loading.value = false
  }
})
</script>

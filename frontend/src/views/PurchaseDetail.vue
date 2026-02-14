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
          <h1 class="text-2xl font-bold text-gray-900">Purchase Details</h1>
          <p class="text-gray-600">Purchase ID: #{{ purchase?.id }}</p>
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <button
          @click="editPurchase"
          class="btn btn-primary flex items-center space-x-2"
        >
          <Edit class="h-4 w-4" />
          <span>Edit</span>
        </button>
        <button
          @click="deletePurchase"
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
      <span class="ml-2 text-gray-600">Loading purchase details...</span>
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

    <!-- Purchase Details -->
    <div v-else-if="purchase" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Information -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Product Info Card -->
        <div class="card">
          <div class="flex items-center space-x-3 mb-6">
            <div class="bg-blue-100 rounded-lg p-3">
              <Package class="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-900">{{ purchase.productName }}</h2>
              <p class="text-gray-600">Product Information</p>
            </div>
          </div>
          
          <!-- Bill Information (for complex purchases) -->
          <div v-if="purchase.billNo" class="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 class="font-semibold text-gray-900 mb-3">Bill Information</h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Bill Number</label>
                <p class="font-medium">{{ purchase.billNo }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Bill Date</label>
                <p class="font-medium">{{ formatDate(purchase.billDate) }}</p>
              </div>
              <div v-if="purchase.agencyName">
                <label class="block text-sm font-medium text-gray-700 mb-1">Agency</label>
                <p class="font-medium">{{ purchase.agencyName }}</p>
              </div>
              <div v-if="purchase.agencyId">
                <label class="block text-sm font-medium text-gray-700 mb-1">Agency ID</label>
                <p class="font-medium">#{{ purchase.agencyId }}</p>
              </div>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-6">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <div class="flex items-center space-x-2">
                  <span class="text-2xl font-bold text-gray-900">{{ purchase.quantity }}</span>
                  <span class="text-sm text-gray-500">units</span>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Purchase Price</label>
                <div class="flex items-center space-x-2">
                  <span class="text-2xl font-bold text-green-600">${{ (purchase.purchasePrice || 0).toFixed(2) }}</span>
                  <span class="text-sm text-gray-500">per unit</span>
                </div>
              </div>
            </div>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
                <div class="flex items-center space-x-2">
                  <span class="text-3xl font-bold text-blue-600">${{ (purchase.total || 0).toFixed(2) }}</span>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                <div class="flex items-center space-x-2">
                  <Calendar class="h-4 w-4 text-gray-500" />
                  <span :class="getExpiryClass(purchase.expiryDate)">
                    {{ formatDate(purchase.expiryDate) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Items Table (for complex purchases) -->
        <div v-if="purchase.items && purchase.items.length > 1" class="card">
          <div class="flex items-center space-x-3 mb-6">
            <div class="bg-purple-100 rounded-lg p-3">
              <Package class="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-900">Purchase Items</h2>
              <p class="text-gray-600">{{ purchase.items.length }} items in this purchase</p>
            </div>
          </div>
          
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sr No</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product Name</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pack</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Batch No</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">TQty</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Free Qty</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">MRP</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">GST</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="item in purchase.items" :key="item.srNo" class="hover:bg-gray-50">
                  <td class="px-4 py-3 text-sm text-gray-900">{{ item.srNo }}</td>
                  <td class="px-4 py-3 text-sm text-gray-900 font-medium">{{ item.productName }}</td>
                  <td class="px-4 py-3 text-sm text-gray-500">{{ item.pack }}</td>
                  <td class="px-4 py-3 text-sm text-gray-500">{{ item.batchNo }}</td>
                  <td class="px-4 py-3 text-sm text-gray-900">{{ item.tQty }}</td>
                  <td class="px-4 py-3 text-sm text-gray-900">{{ item.freeQty || 0 }}</td>
                  <td class="px-4 py-3 text-sm text-gray-900">₹{{ item.mrp?.toFixed(2) || '0.00' }}</td>
                  <td class="px-4 py-3 text-sm text-gray-900">₹{{ item.rate?.toFixed(2) || '0.00' }}</td>
                  <td class="px-4 py-3 text-sm text-gray-900">{{ item.gst }}%</td>
                  <td class="px-4 py-3 text-sm text-gray-900 font-medium">₹{{ item.amount?.toFixed(2) || '0.00' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Stock Impact Card -->
        <div class="card">
          <div class="flex items-center space-x-3 mb-6">
            <div class="bg-green-100 rounded-lg p-3">
              <TrendingUp class="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-900">Stock Impact</h2>
              <p class="text-gray-600">How this purchase affects inventory</p>
            </div>
          </div>
          
          <div class="grid grid-cols-3 gap-4">
            <div class="text-center p-4 bg-blue-50 rounded-lg">
              <p class="text-sm text-blue-600 font-medium">Added to Stock</p>
              <p class="text-2xl font-bold text-blue-900">+{{ purchase.quantity }}</p>
            </div>
            <div class="text-center p-4 bg-green-50 rounded-lg">
              <p class="text-sm text-green-600 font-medium">Current Stock</p>
              <p class="text-2xl font-bold text-green-900">{{ currentStock }}</p>
            </div>
            <div class="text-center p-4 bg-purple-50 rounded-lg">
              <p class="text-sm text-purple-600 font-medium">Stock Value</p>
              <p class="text-2xl font-bold text-purple-900">${{ (stockValue || 0).toFixed(2) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar Information -->
      <div class="space-y-6">
        <!-- Purchase Info Card -->
        <div class="card">
          <div class="flex items-center space-x-3 mb-4">
            <div class="bg-gray-100 rounded-lg p-2">
              <ShoppingCart class="h-5 w-5 text-gray-600" />
            </div>
            <h3 class="font-semibold text-gray-900">Purchase Information</h3>
          </div>
          
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Purchase ID</span>
              <span class="font-medium">#{{ purchase.id }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Purchase Date</span>
              <span class="font-medium">{{ formatDate(purchase.date) }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Status</span>
              <span :class="getStatusBadgeClass(purchase)">
                {{ getStatusText(purchase) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Actions Card -->
        <div class="card">
          <h3 class="font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div class="space-y-2">
            <button
              @click="createSale"
              class="btn btn-success w-full flex items-center justify-center space-x-2"
            >
              <DollarSign class="h-4 w-4" />
              <span>Create Sale</span>
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
          <h3 class="font-semibold text-gray-900 mb-4">Related Sales</h3>
          <div class="space-y-2">
            <div
              v-for="sale in relatedSales"
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
            <div v-if="relatedSales.length === 0" class="text-center text-gray-500 py-4">
              <p class="text-sm">No related sales found</p>
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
import { usePurchaseStore } from '@/stores/purchaseStore'
import { useSalesStore } from '@/stores/salesStore'
import { useStockStore } from '@/stores/stockStore'
import {
  ArrowLeft,
  Edit,
  Trash2,
  Package,
  Calendar,
  TrendingUp,
  ShoppingCart,
  DollarSign,
  Printer,
  ChevronRight,
  AlertCircle
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const purchaseStore = usePurchaseStore()
const salesStore = useSalesStore()
const stockStore = useStockStore()

const loading = ref(true)
const error = ref(null)

const purchase = computed(() => {
  const purchaseData = purchaseStore.getPurchaseById(parseInt(route.params.id))
  if (!purchaseData) return null
  
  // Handle complex purchase structure (with items array) vs simple structure
  if (purchaseData.items && purchaseData.items.length > 0) {
    // Complex structure - use first item for display
    const firstItem = purchaseData.items[0]
    return {
      ...purchaseData,
      productName: firstItem.productName,
      quantity: firstItem.tQty,
      purchasePrice: firstItem.rate,
      total: purchaseData.billTotal,
      expiryDate: firstItem.exp
    }
  }
  
  // Simple structure - return as-is
  return purchaseData
})

const currentStock = computed(() => {
  if (!purchase.value) return 0
  const stock = stockStore.getStockByProduct(purchase.value.productName)
  return stock?.availableStock || 0
})

const stockValue = computed(() => {
  if (!purchase.value) return 0
  return currentStock.value * purchase.value.purchasePrice
})

const relatedSales = computed(() => {
  if (!purchase.value) return []
  return salesStore.getSalesByProduct(purchase.value.productName)
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

const getExpiryClass = (expiryDate) => {
  const daysUntilExpiry = Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24))
  if (daysUntilExpiry <= 2) return 'text-red-600 font-medium'
  if (daysUntilExpiry <= 7) return 'text-orange-600 font-medium'
  if (daysUntilExpiry <= 30) return 'text-yellow-600 font-medium'
  return 'text-green-600 font-medium'
}

const getStatusBadgeClass = (purchase) => {
  const daysUntilExpiry = Math.ceil((new Date(purchase.expiryDate) - new Date()) / (1000 * 60 * 60 * 24))
  if (daysUntilExpiry <= 0) return 'badge-danger'
  if (daysUntilExpiry <= 7) return 'badge-warning'
  return 'badge-success'
}

const getStatusText = (purchase) => {
  const daysUntilExpiry = Math.ceil((new Date(purchase.expiryDate) - new Date()) / (1000 * 60 * 60 * 24))
  if (daysUntilExpiry <= 0) return 'Expired'
  if (daysUntilExpiry <= 7) return 'Expiring Soon'
  return 'Active'
}

const editPurchase = () => {
  router.push(`/purchase`)
  // Store the purchase ID for editing
  sessionStorage.setItem('editPurchaseId', purchase.value.id)
}

const deletePurchase = async () => {
  if (confirm('Are you sure you want to delete this purchase? This will reduce the available stock.')) {
    try {
      await purchaseStore.deletePurchase(purchase.value.id)
      router.push('/purchase')
    } catch (error) {
      console.error('Failed to delete purchase:', error)
    }
  }
}

const createSale = () => {
  router.push('/sales')
  sessionStorage.setItem('prefillProduct', purchase.value.productName)
}

const viewStock = () => {
  router.push(`/stocks/${encodeURIComponent(purchase.value.productName)}`)
}

const viewSaleDetail = (saleId) => {
  router.push(`/sales/${saleId}`)
}

const printDetails = () => {
  window.print()
}

onMounted(async () => {
  try {
    await Promise.all([
      purchaseStore.fetchPurchases(),
      salesStore.fetchSales(),
      stockStore.refreshStock()
    ])
    
    if (!purchase.value) {
      error.value = 'Purchase not found'
    }
  } catch (err) {
    error.value = 'Failed to load purchase details'
    console.error('Error loading purchase details:', err)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Create New Sale</h1>
        <p class="text-gray-600">Add a new sale transaction</p>
      </div>
      <button
        @click="goBack"
        class="btn btn-secondary flex items-center space-x-2"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        <span>Back to Sales</span>
      </button>
    </div>

    <!-- Maa Chemist Header -->
    <div class="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg shadow-lg">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold">Maa Chemist</h2>
          <p class="text-purple-100">Medical & General Store | GSTIN: 07AAAPM1234C1ZY</p>
          <p class="text-purple-100 text-sm mt-1">Shop No. 45, Main Market, Delhi - 110001</p>
          <p class="text-purple-100 text-sm">Phone: +91-9876543210 | Email: info@maachemist.com</p>
        </div>
        <div class="text-right">
          <p class="text-purple-100 text-sm">Bill No:</p>
          <p class="text-xl font-bold">{{ formData.billNo }}</p>
          <p class="text-purple-100 text-sm mt-1">{{ formatDate(new Date()) }}</p>
        </div>
      </div>
    </div>

    <!-- Sale Form -->
    <form @submit.prevent="saveSale" class="space-y-8">
      <!-- Customer Information -->
      <div class="card">
        <h3 class="text-lg font-semibold text-gray-900 mb-6">Customer Information</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <!-- Customer Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Customer Name *</label>
            <input
              v-model="formData.toName"
              type="text"
              class="input w-full px-4 py-3"
              placeholder="Enter customer name"
              required
              style="min-height: 48px; font-size: 15px;"
            />
          </div>

          <!-- Mobile Number -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Mobile Number *</label>
            <input
              v-model="formData.toMobile"
              type="tel"
              class="input w-full px-4 py-3"
              placeholder="+91-9876543210"
              pattern="[0-9]{10}"
              maxlength="10"
              required
              style="min-height: 48px; font-size: 15px;"
            />
          </div>

          <!-- Payment Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Payment Type *</label>
            <select v-model="formData.paymentType" class="input w-full px-4 py-3" required style="min-height: 48px; font-size: 15px;">
              <option value="">Select Payment Type</option>
              <option value="Cash">Cash</option>
              <option value="DBT">DBT (Direct Bank Transfer)</option>
            </select>
          </div>

          <!-- Bill Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Bill Date *</label>
            <input
              v-model="formData.billDate"
              type="date"
              class="input w-full px-4 py-3"
              required
              style="min-height: 48px; font-size: 15px;"
            />
          </div>
        </div>
      </div>

      <!-- Items Section -->
      <div class="card">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900">Bill Items</h3>
          <button
            type="button"
            @click="addItem"
            class="btn btn-secondary flex items-center space-x-2"
          >
            <Plus class="h-5 w-5" />
            <span>Add Item</span>
          </button>
        </div>

        <div class="overflow-x-auto border border-gray-200 rounded-lg">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">HSN</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pack</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mfg</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">MRP</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Batch</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exp.</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Disc %</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(item, index) in formData.items" :key="index">
                <td class="px-4 py-3">
                  <input
                    v-model="item.hsn"
                    type="text"
                    class="input text-sm w-full px-3 py-2"
                    placeholder="3004"
                    style="min-height: 40px; font-size: 14px;"
                  />
                </td>
                <td class="px-4 py-3 relative" style="position: relative;">
                  <input
                    v-model="item.product"
                    type="text"
                    class="input text-sm w-full px-3 py-2"
                    placeholder="Product name"
                    required
                    @input="autoFillProductDetails(item, $event)"
                    @keydown="handleKeyNavigation($event, item)"
                    @blur="hideSuggestions"
                    @focus="autoFillProductDetails(item, $event)"
                    style="position: relative; z-index: 10; min-height: 40px; font-size: 14px;"
                  />
                  
                  <!-- Suggestions Dropdown -->
                  <div 
                    v-if="showSuggestions && filteredSuggestions.length > 0"
                    class="fixed bg-white border border-gray-300 rounded-lg shadow-lg"
                    :style="{
                      zIndex: 9999,
                      top: dropdownPosition.top + 'px',
                      left: dropdownPosition.left + 'px',
                      minWidth: '250px',
                      maxHeight: '200px',
                      overflowY: 'auto'
                    }"
                  >
                    <div class="flex items-center justify-between px-2 py-1 border-b bg-gray-50">
                      <span class="text-xs text-gray-500">
                        Suggestions ({{ filteredSuggestions.length }})
                      </span>
                      <button
                        @click="hideSuggestions"
                        class="text-gray-400 hover:text-gray-600 p-1 rounded"
                        title="Close suggestions"
                      >
                        <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>
                    </div>
                    <div
                      v-for="(suggestion, index) in filteredSuggestions"
                      :key="suggestion"
                      :class="[
                        'px-3 py-2 cursor-pointer text-sm border-b border-gray-100 last:border-b-0',
                        index === activeSuggestionIndex ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
                      ]"
                      @mousedown="selectSuggestion(suggestion)"
                    >
                      <div class="flex items-center justify-between">
                        <span>{{ suggestion }}</span>
                        <span class="text-xs text-gray-400">
                          {{ getSuggestionSource(suggestion) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <input
                    v-model="item.pack"
                    type="text"
                    class="input text-sm w-full px-3 py-2"
                    placeholder="10x10"
                    style="min-height: 40px; font-size: 14px;"
                  />
                </td>
                <td class="px-4 py-3">
                  <input
                    v-model="item.mfg"
                    type="text"
                    class="input text-sm w-full px-3 py-2"
                    placeholder="Manufacturer"
                    style="min-height: 40px; font-size: 14px;"
                  />
                </td>
                <td class="px-4 py-3">
                  <input
                    v-model.number="item.qty"
                    type="number"
                    class="input text-sm w-full px-3 py-2"
                    min="1"
                    @input="calculateItemAmount(item)"
                    required
                    style="min-height: 40px; font-size: 14px;"
                  />
                </td>
                <td class="px-4 py-3">
                  <input
                    v-model.number="item.mrp"
                    type="number"
                    step="0.01"
                    class="input text-sm w-full px-3 py-2"
                    min="0"
                    @input="calculateItemAmount(item)"
                    required
                    style="min-height: 40px; font-size: 14px;"
                  />
                </td>
                <td class="px-4 py-3">
                  <input
                    v-model="item.batch"
                    type="text"
                    class="input text-sm w-full px-3 py-2"
                    placeholder="B001"
                    style="min-height: 40px; font-size: 14px;"
                  />
                </td>
                <td class="px-4 py-3">
                  <input
                    v-model="item.exp"
                    type="date"
                    class="input text-sm w-full px-3 py-2"
                    style="min-height: 40px; font-size: 14px;"
                  />
                </td>
                <td class="px-4 py-3">
                  <input
                    v-model.number="item.disc"
                    type="number"
                    step="0.01"
                    class="input text-sm w-full px-3 py-2"
                    min="0"
                    @input="calculateItemAmount(item)"
                    style="min-height: 40px; font-size: 14px;"
                  />
                </td>
                <td class="px-4 py-3">
                  <input
                    :value="item.amount.toFixed(2)"
                    type="text"
                    class="input text-sm w-full bg-gray-50 px-3 py-2"
                    readonly
                    style="min-height: 40px; font-size: 14px;"
                  />
                </td>
                <td class="px-4 py-3">
                  <button
                    type="button"
                    @click="removeItem(index)"
                    class="btn btn-danger-sm"
                    :disabled="formData.items.length === 1"
                  >
                    <Trash2 class="h-4 w-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Summary Section -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="md:col-span-2"></div>
        <div class="card">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Bill Summary</h3>
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Subtotal</span>
              <span class="font-medium">₹{{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Discount</span>
              <span class="font-medium">₹{{ totalDiscount.toFixed(2) }}</span>
            </div>
            <div class="border-t pt-3">
              <div class="flex justify-between items-center">
                <span class="text-lg font-semibold text-gray-900">Grand Total</span>
                <span class="text-2xl font-bold text-blue-600">₹{{ grandTotal.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end space-x-4">
        <button
          type="button"
          @click="goBack"
          class="btn btn-secondary px-6 py-3"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="btn btn-primary px-6 py-3"
        >
          Create Sale
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSalesStore } from '@/stores/salesStore'
import { usePurchaseStore } from '@/stores/purchaseStore'
import { useStockStore } from '@/stores/stockStore'
import {
  Plus,
  Trash2
} from 'lucide-vue-next'

const router = useRouter()
const salesStore = useSalesStore()
const purchaseStore = usePurchaseStore()
const stockStore = useStockStore()

const showSuggestions = ref(false)
const activeSuggestionIndex = ref(0)
const currentEditingItemIndex = ref(null)
const dropdownPosition = ref({ top: 0, left: 0 })

const formData = ref({
  toName: '',
  toMobile: '',
  paymentType: '',
  billNo: '',
  billDate: new Date().toISOString().split('T')[0],
  items: [
    {
      hsn: '',
      product: '',
      pack: '',
      mfg: '',
      qty: 1,
      mrp: 0,
      batch: '',
      exp: '',
      disc: 0,
      amount: 0
    }
  ]
})

const grandTotal = computed(() => {
  return formData.value.items.reduce((total, item) => total + item.amount, 0)
})

const subtotal = computed(() => {
  return formData.value.items.reduce((total, item) => {
    return total + (item.qty * item.mrp)
  }, 0)
})

const totalDiscount = computed(() => {
  return formData.value.items.reduce((total, item) => {
    const baseAmount = item.qty * item.mrp
    const discountAmount = (baseAmount * item.disc) / 100
    return total + discountAmount
  }, 0)
})

// Product suggestions
const productSuggestions = computed(() => {
  const products = new Set()
  
  // Get products from purchases
  purchaseStore.purchases.forEach(purchase => {
    if (purchase.productName) {
      products.add(purchase.productName)
    }
    if (purchase.items) {
      purchase.items.forEach(item => {
        if (item.productName) {
          products.add(item.productName)
        }
      })
    }
  })
  
  // Get products from existing sales
  salesStore.sales.forEach(sale => {
    if (sale.productName) {
      products.add(sale.productName)
    }
    if (sale.items) {
      sale.items.forEach(item => {
        if (item.product) {
          products.add(item.product)
        }
      })
    }
  })
  
  return Array.from(products).sort()
})

const filteredSuggestions = computed(() => {
  if (currentEditingItemIndex.value === null || !formData.value?.items) {
    return []
  }
  
  const currentItem = formData.value.items[currentEditingItemIndex.value]
  if (!currentItem?.product) {
    return []
  }
  
  const query = currentItem.product.toLowerCase()
  return productSuggestions.value.filter(product =>
    product.toLowerCase().includes(query)
  ).slice(0, 8)
})

const getNextBillNumber = () => {
  const lastBill = salesStore.sales.reduce((latest, sale) => {
    const billNum = parseInt(sale.billNo?.split('/')[1] || '0')
    return billNum > latest ? billNum : latest
  }, 134)
  return `CA-T/${lastBill + 1}`
}

const addItem = () => {
  formData.value.items.push({
    hsn: '',
    product: '',
    pack: '',
    mfg: '',
    qty: 1,
    mrp: 0,
    batch: '',
    exp: '',
    disc: 0,
    amount: 0
  })
}

const removeItem = (index) => {
  if (formData.value.items.length > 1) {
    formData.value.items.splice(index, 1)
  }
}

const calculateItemAmount = (item) => {
  const baseAmount = item.qty * item.mrp
  const discountAmount = (baseAmount * item.disc) / 100
  item.amount = baseAmount - discountAmount
}

const findExistingProduct = (productName) => {
  if (!productName || productName.length < 2) return null
  
  const purchases = purchaseStore.purchases
  
  for (const purchase of purchases) {
    if (purchase.productName && purchase.productName.toLowerCase() === productName.toLowerCase()) {
      return {
        productName: purchase.productName,
        purchasePrice: purchase.purchasePrice,
        expiryDate: purchase.expiryDate,
        hsn: '',
        pack: '',
        mfg: '',
        mrp: purchase.purchasePrice * 1.2,
        batch: '',
        exp: purchase.expiryDate
      }
    }
    
    if (purchase.items && purchase.items.length > 0) {
      for (const item of purchase.items) {
        if (item.productName && item.productName.toLowerCase() === productName.toLowerCase()) {
          return {
            productName: item.productName,
            purchasePrice: item.rate,
            expiryDate: item.exp,
            hsn: item.hsn || '',
            pack: item.pack || '',
            mfg: item.mfg || '',
            mrp: item.mrp || 0,
            batch: item.batchNo || '',
            exp: item.exp || ''
          }
        }
      }
    }
  }
  
  return null
}

const autoFillProductDetails = (item, event) => {
  if (!item || !item.product || item.product.length < 2) {
    showSuggestions.value = false
    return
  }
  
  if (item.product.length >= 2) {
    if (formData.value?.items) {
      currentEditingItemIndex.value = formData.value.items.indexOf(item)
      showSuggestions.value = true
      activeSuggestionIndex.value = 0
      
      if (event && event.target) {
        const rect = event.target.getBoundingClientRect()
        dropdownPosition.value = {
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX
        }
      }
    }
  }
  
  const existingProduct = findExistingProduct(item.product)
  if (existingProduct) {
    item.hsn = existingProduct.hsn
    item.pack = existingProduct.pack
    item.mfg = existingProduct.mfg
    item.mrp = existingProduct.mrp
    item.batch = existingProduct.batch
    item.exp = existingProduct.exp
    
    calculateItemAmount(item)
  }
}

const selectSuggestion = (product) => {
  if (currentEditingItemIndex.value !== null && formData.value?.items) {
    const item = formData.value.items[currentEditingItemIndex.value]
    if (item) {
      item.product = product
      autoFillProductDetails(item)
      showSuggestions.value = false
      currentEditingItemIndex.value = null
    }
  }
}

const handleKeyNavigation = (event, item) => {
  if (!showSuggestions.value) return
  
  const suggestions = filteredSuggestions.value
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    activeSuggestionIndex.value = (activeSuggestionIndex.value + 1) % suggestions.length
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    activeSuggestionIndex.value = activeSuggestionIndex.value === 0 
      ? suggestions.length - 1 
      : activeSuggestionIndex.value - 1
  } else if (event.key === 'Enter') {
    event.preventDefault()
    if (suggestions[activeSuggestionIndex.value]) {
      selectSuggestion(suggestions[activeSuggestionIndex.value])
    }
  } else if (event.key === 'Escape') {
    showSuggestions.value = false
    currentEditingItemIndex.value = null
  }
}

const hideSuggestions = () => {
  setTimeout(() => {
    showSuggestions.value = false
    currentEditingItemIndex.value = null
  }, 200)
}

const getSuggestionSource = (productName) => {
  for (const purchase of purchaseStore.purchases) {
    if (purchase.productName === productName) return 'Purchase'
    if (purchase.items?.some(item => item.productName === productName)) return 'Purchase'
  }
  
  for (const sale of salesStore.sales) {
    if (sale.productName === productName) return 'Sale'
    if (sale.items?.some(item => item.product === productName)) return 'Sale'
  }
  
  return 'History'
}

const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date)
}

const goBack = () => {
  router.push('/sales')
}

const saveSale = async () => {
  try {
    const saleData = {
      ...formData.value,
      grandTotal: grandTotal.value,
      date: new Date().toISOString()
    }

    await salesStore.addSale(saleData)
    router.push('/sales')
  } catch (error) {
    console.error('Failed to save sale:', error)
  }
}

onMounted(async () => {
  await Promise.all([
    salesStore.fetchSales(),
    purchaseStore.fetchPurchases()
  ])
  
  formData.value.billNo = getNextBillNumber()
})
</script>

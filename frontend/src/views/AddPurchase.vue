<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Create New Purchase</h1>
        <p class="text-gray-600">Add a new purchase transaction</p>
      </div>
      <button
        @click="goBack"
        class="btn btn-secondary flex items-center space-x-2"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        <span>Back to Purchases</span>
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
          <p class="text-purple-100 text-sm">Purchase Order:</p>
          <p class="text-xl font-bold">{{ formData.billNo }}</p>
          <p class="text-purple-100 text-sm mt-1">{{ formatDate(new Date()) }}</p>
        </div>
      </div>
    </div>

    <!-- Purchase Form -->
    <form @submit.prevent="savePurchase" class="space-y-8">
      <!-- Basic Information -->
      <div class="card">
        <h3 class="text-lg font-semibold text-gray-900 mb-6">Purchase Information</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Agency Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Agency Name *</label>
            <select v-model="formData.agencyId" class="input w-full px-4 py-3" required style="min-height: 48px; font-size: 15px;">
              <option value="">Select Agency</option>
              <option v-for="agency in agencyStore.agencies" :key="agency.id" :value="agency.id">
                {{ agency.name }}
              </option>
            </select>
          </div>

          <!-- Bill Number -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Bill No *</label>
            <input
              v-model="formData.billNo"
              type="text"
              class="input w-full px-4 py-3"
              placeholder="Enter bill number"
              required
              style="min-height: 48px; font-size: 15px;"
            />
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
          <h3 class="text-lg font-semibold text-gray-900">Items</h3>
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
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sr No</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">HSN</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product Name</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pack</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mfg</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">TQty</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Free Qty</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">MRP</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Batch No</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exp.</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Disc %</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Taxable</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">GST %</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(item, index) in formData.items" :key="index">
                <td class="px-4 py-3">
                  <input
                    v-model.number="item.srNo"
                    type="number"
                    class="input text-sm w-full px-3 py-2"
                    min="1"
                    style="min-height: 40px; font-size: 14px;"
                  />
                </td>
                <td class="px-4 py-3">
                  <input
                    v-model="item.hsn"
                    type="text"
                    class="input text-sm w-full px-3 py-2"
                    placeholder="3004"
                    style="min-height: 40px; font-size: 14px;"
                  />
                </td>
                <td class="px-4 py-3">
                  <input
                    v-model="item.productName"
                    type="text"
                    class="input text-sm w-full px-3 py-2"
                    placeholder="Product name"
                    required
                    style="min-height: 40px; font-size: 14px;"
                  />
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
                    v-model.number="item.tQty"
                    type="number"
                    class="input text-sm w-full px-3 py-2"
                    min="0"
                    @input="calculateItemAmount(item)"
                    required
                    style="min-height: 40px; font-size: 14px;"
                  />
                </td>
                <td class="px-4 py-3">
                  <input
                    v-model.number="item.freeQty"
                    type="number"
                    class="input text-sm w-full px-3 py-2"
                    min="0"
                    placeholder="0"
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
                    style="min-height: 40px; font-size: 14px;"
                  />
                </td>
                <td class="px-4 py-3">
                  <input
                    v-model="item.batchNo"
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
                    v-model.number="item.rate"
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
                    v-model.number="item.discount"
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
                    :value="item.taxable.toFixed(2)"
                    type="text"
                    class="input text-sm w-full bg-gray-50 px-3 py-2"
                    readonly
                    style="min-height: 40px; font-size: 14px;"
                  />
                </td>
                <td class="px-4 py-3">
                  <select v-model.number="item.gst" class="input text-sm w-full px-3 py-2" @change="calculateItemAmount(item)" style="min-height: 40px; font-size: 14px;">
                    <option value="0">0%</option>
                    <option value="5">5%</option>
                    <option value="12">12%</option>
                    <option value="18">18%</option>
                    <option value="28">28%</option>
                  </select>
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
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Purchase Summary</h3>
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Subtotal</span>
              <span class="font-medium">₹{{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Discount</span>
              <span class="font-medium">₹{{ totalDiscount.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">GST</span>
              <span class="font-medium">₹{{ totalGST.toFixed(2) }}</span>
            </div>
            <div class="border-t pt-3">
              <div class="flex justify-between items-center">
                <span class="text-lg font-semibold text-gray-900">Total Amount</span>
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
          Create Purchase
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePurchaseStore } from '@/stores/purchaseStore'
import { useAgencyStore } from '@/stores/agencyStore'
import {
  Plus,
  Trash2
} from 'lucide-vue-next'

const router = useRouter()
const purchaseStore = usePurchaseStore()
const agencyStore = useAgencyStore()

const formData = ref({
  agencyId: '',
  billNo: '',
  billDate: new Date().toISOString().split('T')[0],
  items: [
    {
      srNo: 1,
      hsn: '',
      productName: '',
      pack: '',
      mfg: '',
      tQty: 0,
      freeQty: 0,
      mrp: 0,
      batchNo: '',
      exp: '',
      rate: 0,
      discount: 0,
      taxable: 0,
      gst: 0,
      amount: 0
    }
  ]
})

const grandTotal = computed(() => {
  return formData.value.items.reduce((total, item) => total + item.amount, 0)
})

const subtotal = computed(() => {
  return formData.value.items.reduce((total, item) => {
    return total + (item.tQty * item.rate)
  }, 0)
})

const totalDiscount = computed(() => {
  return formData.value.items.reduce((total, item) => {
    const baseAmount = item.tQty * item.rate
    const discountAmount = (baseAmount * item.discount) / 100
    return total + discountAmount
  }, 0)
})

const totalGST = computed(() => {
  return formData.value.items.reduce((total, item) => {
    return total + ((item.taxable * item.gst) / 100)
  }, 0)
})

const getNextBillNumber = () => {
  const lastBill = purchaseStore.purchases.reduce((latest, purchase) => {
    const billNum = parseInt(purchase.billNo?.split('/')[1] || '0')
    return billNum > latest ? billNum : latest
  }, 0)
  return `PO/${lastBill + 1}`
}

const addItem = () => {
  const nextSrNo = formData.value.items.length + 1
  formData.value.items.push({
    srNo: nextSrNo,
    hsn: '',
    productName: '',
    pack: '',
    mfg: '',
    tQty: 0,
    freeQty: 0,
    mrp: 0,
    batchNo: '',
    exp: '',
    rate: 0,
    discount: 0,
    taxable: 0,
    gst: 0,
    amount: 0
  })
}

const removeItem = (index) => {
  if (formData.value.items.length > 1) {
    formData.value.items.splice(index, 1)
    // Reassign serial numbers
    formData.value.items.forEach((item, idx) => {
      item.srNo = idx + 1
    })
  }
}

const calculateItemAmount = (item) => {
  const baseAmount = item.tQty * item.rate
  const discountAmount = (baseAmount * item.discount) / 100
  item.taxable = baseAmount - discountAmount
  const gstAmount = (item.taxable * item.gst) / 100
  item.amount = item.taxable + gstAmount
}

const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date)
}

const goBack = () => {
  router.push('/purchase')
}

const savePurchase = async () => {
  try {
    const purchaseData = {
      ...formData.value,
      billTotal: grandTotal.value,
      date: new Date().toISOString()
    }

    // Get agency details
    const agency = agencyStore.getAgencyById(formData.value.agencyId)
    if (agency) {
      purchaseData.agencyName = agency.name
    }

    await purchaseStore.addPurchase(purchaseData)
    router.push('/purchase')
  } catch (error) {
    console.error('Failed to save purchase:', error)
  }
}

onMounted(async () => {
  await Promise.all([
    purchaseStore.fetchPurchases(),
    agencyStore.fetchAgencies()
  ])
  
  formData.value.billNo = getNextBillNumber()
})
</script>

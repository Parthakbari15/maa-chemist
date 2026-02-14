<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Purchase Management</h1>
        <p class="text-gray-600">Manage your purchase orders and inventory</p>
      </div>
      <button
        @click="openAddModal"
        class="btn btn-primary flex items-center space-x-2"
      >
        <Plus class="h-4 w-4" />
        <span>Add Purchase</span>
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="card">
        <div class="flex items-center">
          <div class="p-3 bg-blue-100 rounded-lg">
            <ShoppingCart class="h-6 w-6 text-blue-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Purchases</p>
            <p class="text-2xl font-bold text-gray-900">{{ purchaseStore.purchases.length }}</p>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="flex items-center">
          <div class="p-3 bg-green-100 rounded-lg">
            <DollarSign class="h-6 w-6 text-green-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Amount</p>
            <p class="text-2xl font-bold text-gray-900">₹{{ totalPurchaseAmount.toFixed(2) }}</p>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="flex items-center">
          <div class="p-3 bg-purple-100 rounded-lg">
            <Package class="h-6 w-6 text-purple-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Quantity</p>
            <p class="text-2xl font-bold text-gray-900">{{ totalQuantity }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Purchase Table -->
    <div class="card">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-semibold text-gray-900">Purchase Orders</h2>
        <div class="flex items-center space-x-2">
          <div class="relative">
            <Search class="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search purchases..."
              class="input pl-10 w-64"
            />
          </div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill No</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agency</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill Total</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="purchase in filteredPurchases" :key="purchase.id" class="hover:bg-gray-50 cursor-pointer" @click="viewPurchaseDetail(purchase)">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ purchase.billNo }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ purchase.billDate }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ purchase.agencyName }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ purchase.items?.length || 0 }} items</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{{ purchase.billTotal?.toFixed(2) || '0.00' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button @click.stop="editPurchase(purchase)" class="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                <button @click.stop="deletePurchase(purchase)" class="text-red-600 hover:text-red-900">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Purchase Modal -->
    <div v-if="showAddModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" @click="closeModal">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-7xl sm:w-full">
          <form @submit.prevent="savePurchase">
            <div class="bg-white px-6 pt-5 pb-4 sm:p-8 sm:pb-4 max-h-screen overflow-y-auto">
              <div class="mb-6">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  {{ editingPurchase ? 'Edit Purchase' : 'Add New Purchase' }}
                </h3>
                <p class="mt-1 text-sm text-gray-500">
                  {{ editingPurchase ? 'Update purchase order information' : 'Create a new purchase order' }}
                </p>
              </div>

              <!-- Basic Information -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <!-- Agency Selection -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Agency Name *</label>
                  <select v-model="formData.agencyId" class="input w-full px-3 py-2" required style="min-height: 40px; font-size: 14px;">
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
                    class="input w-full px-3 py-2"
                    placeholder="Enter bill number"
                    required
                    style="min-height: 40px; font-size: 14px;"
                  />
                </div>

                <!-- Bill Date -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Bill Date *</label>
                  <input
                    v-model="formData.billDate"
                    type="date"
                    class="input w-full px-3 py-2"
                    required
                    style="min-height: 40px; font-size: 14px;"
                  />
                </div>
              </div>

              <!-- Items Section -->
              <div class="border-t pt-6">
                <div class="flex items-center justify-between mb-4">
                  <h4 class="text-md font-medium text-gray-900">Items</h4>
                  <button
                    type="button"
                    @click="addItem"
                    class="btn btn-secondary flex items-center space-x-1"
                  >
                    <Plus class="h-4 w-4" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div class="overflow-x-auto border border-gray-200 rounded-lg">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Sr No</th>
                        <th class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">HSN</th>
                        <th class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product Name</th>
                        <th class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Pack</th>
                        <th class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Mfg</th>
                        <th class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">TQty</th>
                        <th class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Free Qty</th>
                        <th class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">MRP</th>
                        <th class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Batch No</th>
                        <th class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Exp</th>
                        <th class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
                        <th class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Discount %</th>
                        <th class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Taxable</th>
                        <th class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">GST %</th>
                        <th class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        <th class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-for="(item, index) in formData.items" :key="index">
                        <td class="px-2 py-2">
                          <input
                            v-model.number="item.srNo"
                            type="number"
                            class="input text-sm w-full px-3 py-2"
                            min="1"
                            style="min-height: 40px; font-size: 14px;"
                          />
                        </td>
                        <td class="px-2 py-2">
                          <input
                            v-model="item.hsn"
                            type="text"
                            class="input text-sm w-full px-3 py-2"
                            placeholder="3004"
                            style="min-height: 40px; font-size: 14px;"
                          />
                        </td>
                        <td class="px-2 py-2">
                          <input
                            v-model="item.productName"
                            type="text"
                            class="input text-sm w-full px-3 py-2"
                            placeholder="Product name"
                            required
                            style="min-height: 40px; font-size: 14px;"
                          />
                        </td>
                        <td class="px-2 py-2">
                          <input
                            v-model="item.pack"
                            type="text"
                            class="input text-sm w-full px-3 py-2"
                            placeholder="10x10"
                            style="min-height: 40px; font-size: 14px;"
                          />
                        </td>
                        <td class="px-2 py-2">
                          <input
                            v-model="item.mfg"
                            type="text"
                            class="input text-sm w-full px-3 py-2"
                            placeholder="Manufacturer"
                            style="min-height: 40px; font-size: 14px;"
                          />
                        </td>
                        <td class="px-2 py-2">
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
                        <td class="px-2 py-2">
                          <input
                            v-model.number="item.freeQty"
                            type="number"
                            class="input text-sm w-full px-3 py-2"
                            min="0"
                            placeholder="0"
                            style="min-height: 40px; font-size: 14px;"
                          />
                        </td>
                        <td class="px-2 py-2">
                          <input
                            v-model.number="item.mrp"
                            type="number"
                            step="0.01"
                            class="input text-sm w-full px-3 py-2"
                            min="0"
                            style="min-height: 40px; font-size: 14px;"
                          />
                        </td>
                        <td class="px-2 py-2">
                          <input
                            v-model="item.batchNo"
                            type="text"
                            class="input text-sm w-full px-3 py-2"
                            placeholder="B001"
                            style="min-height: 40px; font-size: 14px;"
                          />
                        </td>
                        <td class="px-2 py-2">
                          <input
                            v-model="item.exp"
                            type="date"
                            class="input text-sm w-full px-3 py-2"
                            style="min-height: 40px; font-size: 14px;"
                          />
                        </td>
                        <td class="px-2 py-2">
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
                        <td class="px-2 py-2">
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
                        <td class="px-2 py-2">
                          <input
                            :value="item.taxable.toFixed(2)"
                            type="text"
                            class="input text-sm w-full bg-gray-50 px-3 py-2"
                            readonly
                            style="min-height: 40px; font-size: 14px;"
                          />
                        </td>
                        <td class="px-2 py-2">
                          <select v-model.number="item.gst" class="input text-sm w-full px-3 py-2" @change="calculateItemAmount(item)" style="min-height: 40px; font-size: 14px;">
                            <option value="0">0%</option>
                            <option value="5">5%</option>
                            <option value="12">12%</option>
                            <option value="18">18%</option>
                            <option value="28">28%</option>
                          </select>
                        </td>
                        <td class="px-2 py-2">
                          <input
                            :value="item.amount.toFixed(2)"
                            type="text"
                            class="input text-sm w-full bg-gray-50 px-3 py-2"
                            readonly
                            style="min-height: 40px; font-size: 14px;"
                          />
                        </td>
                        <td class="px-2 py-2">
                          <button
                            type="button"
                            @click="removeItem(index)"
                            class="btn btn-danger-sm"
                            :disabled="formData.items.length === 1"
                          >
                            <Trash2 class="h-3 w-3" />
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Bill Total -->
              <div class="border-t pt-4 mt-6">
                <div class="flex justify-end">
                  <div class="text-right">
                    <p class="text-sm text-gray-600">Bill Total</p>
                    <p class="text-2xl font-bold text-gray-900">₹{{ billTotal.toFixed(2) }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                class="btn btn-primary w-full sm:w-auto"
              >
                {{ editingPurchase ? 'Update Purchase' : 'Create Purchase' }}
              </button>
              <button
                type="button"
                @click="closeModal"
                class="btn btn-secondary w-full sm:w-auto sm:ml-3"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="deleteConfirmation" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" @click="cancelDelete">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <Trash2 class="h-6 w-6 text-red-600" />
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  Delete Purchase Order
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Are you sure you want to delete purchase order {{ deleteConfirmation.billNo }}? This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              @click="confirmDelete"
              class="btn btn-danger w-full sm:w-auto"
            >
              Delete
            </button>
            <button
              type="button"
              @click="cancelDelete"
              class="btn btn-secondary w-full sm:w-auto sm:ml-3"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePurchaseStore } from '@/stores/purchaseStore'
import { useAgencyStore } from '@/stores/agencyStore'
import {
  Plus,
  ShoppingCart,
  DollarSign,
  Package,
  Search,
  Trash2
} from 'lucide-vue-next'

const router = useRouter()
const purchaseStore = usePurchaseStore()
const agencyStore = useAgencyStore()

const showAddModal = ref(false)
const editingPurchase = ref(null)
const deleteConfirmation = ref(null)
const searchQuery = ref('')

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
      gst: 18,
      amount: 0
    }
  ]
})

const filteredPurchases = computed(() => {
  if (!searchQuery.value) return purchaseStore.purchases
  const query = searchQuery.value.toLowerCase()
  return purchaseStore.purchases.filter(purchase =>
    purchase.billNo?.toLowerCase().includes(query) ||
    purchase.agencyName?.toLowerCase().includes(query)
  )
})

const totalPurchaseAmount = computed(() => {
  return purchaseStore.purchases.reduce((total, purchase) => total + (purchase.billTotal || 0), 0)
})

const totalQuantity = computed(() => {
  return purchaseStore.purchases.reduce((total, purchase) => {
    const itemsTotal = purchase.items?.reduce((itemTotal, item) => itemTotal + (item.tQty || 0), 0) || 0
    return total + itemsTotal
  }, 0)
})

const billTotal = computed(() => {
  return formData.value.items.reduce((total, item) => total + item.amount, 0)
})

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
    gst: 18,
    amount: 0
  })
}

const removeItem = (index) => {
  if (formData.value.items.length > 1) {
    formData.value.items.splice(index, 1)
    // Re-calculate Sr No
    formData.value.items.forEach((item, idx) => {
      item.srNo = idx + 1
    })
  }
}

const calculateItemAmount = (item) => {
  const taxableValue = item.tQty * item.rate
  const discountAmount = (taxableValue * item.discount) / 100
  item.taxable = taxableValue - discountAmount
  const gstAmount = (item.taxable * item.gst) / 100
  item.amount = item.taxable + gstAmount
}

const openAddModal = () => {
  router.push('/purchase/add')
}

const closeModal = () => {
  showAddModal.value = false
  editingPurchase.value = null
}

const savePurchase = async () => {
  try {
    const purchaseData = {
      ...formData.value,
      agencyName: agencyStore.getAgencyById(formData.value.agencyId)?.name || '',
      billTotal: billTotal.value,
      date: new Date().toISOString()
    }

    if (editingPurchase.value) {
      await purchaseStore.updatePurchase(editingPurchase.value.id, purchaseData)
    } else {
      await purchaseStore.addPurchase(purchaseData)
    }
    closeModal()
  } catch (error) {
    console.error('Failed to save purchase:', error)
  }
}

const editPurchase = (purchase) => {
  editingPurchase.value = purchase
  formData.value = {
    agencyId: purchase.agencyId,
    billNo: purchase.billNo,
    billDate: purchase.billDate,
    items: [...(purchase.items || [])]
  }
  showAddModal.value = true
}

const deletePurchase = (purchase) => {
  deleteConfirmation.value = purchase
}

const confirmDelete = async () => {
  try {
    await purchaseStore.deletePurchase(deleteConfirmation.value.id)
    cancelDelete()
  } catch (error) {
    console.error('Failed to delete purchase:', error)
  }
}

const cancelDelete = () => {
  deleteConfirmation.value = null
}

const viewPurchaseDetail = (purchase) => {
  router.push(`/purchase/${purchase.id}`)
}

onMounted(() => {
  purchaseStore.fetchPurchases()
  agencyStore.fetchAgencies()
  
  // Check if we're editing a purchase
  const editPurchaseId = sessionStorage.getItem('editPurchaseId')
  if (editPurchaseId) {
    const purchase = purchaseStore.getPurchaseById(parseInt(editPurchaseId))
    if (purchase) {
      editPurchase(purchase)
    }
    // Clear the edit ID from sessionStorage
    sessionStorage.removeItem('editPurchaseId')
  }
})
</script>

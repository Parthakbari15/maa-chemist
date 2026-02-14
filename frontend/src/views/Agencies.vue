<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Agencies</h1>
        <p class="text-gray-600">Manage supplier agencies and vendors</p>
      </div>
      <button
        @click="showAddModal = true"
        class="btn btn-primary flex items-center space-x-2"
      >
        <Plus class="h-4 w-4" />
        <span>Add Agency</span>
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="card">
        <div class="flex items-center space-x-3">
          <div class="bg-blue-100 rounded-lg p-3">
            <Building class="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p class="text-sm text-blue-600 font-medium">Total Agencies</p>
            <p class="text-2xl font-bold text-blue-900">{{ agencies.length }}</p>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="flex items-center space-x-3">
          <div class="bg-green-100 rounded-lg p-3">
            <CheckCircle class="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p class="text-sm text-green-600 font-medium">Active Agencies</p>
            <p class="text-2xl font-bold text-green-900">{{ activeAgencies }}</p>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="flex items-center space-x-3">
          <div class="bg-purple-100 rounded-lg p-3">
            <FileText class="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p class="text-sm text-purple-600 font-medium">Total Purchases</p>
            <p class="text-2xl font-bold text-purple-900">{{ totalPurchases }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Search and Filter -->
    <div class="card">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search agencies by name, email, or GST..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <select
          v-model="sortBy"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="name">Sort by Name</option>
          <option value="date">Sort by Date Added</option>
          <option value="purchases">Sort by Purchases</option>
        </select>
      </div>
    </div>

    <!-- Agencies Table -->
    <div class="card">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200">
              <th class="text-left py-3 px-4 font-semibold text-gray-900">Agency</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-900">Contact</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-900">GST</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-900">Purchases</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="agency in filteredAgencies"
              :key="agency.id"
              class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td class="py-4 px-4">
                <div>
                  <p class="font-medium text-gray-900">{{ agency.name }}</p>
                  <p class="text-sm text-gray-500">{{ agency.address }}</p>
                </div>
              </td>
              <td class="py-4 px-4">
                <div>
                  <p class="text-sm text-gray-900">{{ agency.email }}</p>
                  <p class="text-sm text-gray-500">{{ agency.phone }}</p>
                </div>
              </td>
              <td class="py-4 px-4">
                <span class="text-sm font-mono text-gray-900">{{ agency.gst }}</span>
              </td>
              <td class="py-4 px-4">
                <div class="flex items-center space-x-2">
                  <span class="text-sm font-medium text-gray-900">{{ getAgencyPurchaseCount(agency.id) }}</span>
                  <span class="text-xs text-gray-500">orders</span>
                </div>
              </td>
              <td class="py-4 px-4">
                <span class="badge badge-success">Active</span>
              </td>
              <td class="py-4 px-4">
                <div class="flex items-center space-x-2">
                  <button
                    @click="editAgency(agency)"
                    class="text-blue-600 hover:text-blue-800 transition-colors"
                    title="Edit"
                  >
                    <Edit class="h-4 w-4" />
                  </button>
                  <button
                    @click="deleteAgency(agency)"
                    class="text-red-600 hover:text-red-800 transition-colors"
                    title="Delete"
                  >
                    <Trash2 class="h-4 w-4" />
                  </button>
                  <button
                    @click="viewPurchases(agency.id)"
                    class="text-green-600 hover:text-green-800 transition-colors"
                    title="View Purchases"
                  >
                    <Eye class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div v-if="filteredAgencies.length === 0" class="text-center py-12">
          <Building class="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p class="text-gray-500">No agencies found</p>
          <button
            @click="showAddModal = true"
            class="mt-4 btn btn-primary"
          >
            Add Your First Agency
          </button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Agency Modal -->
    <div v-if="showAddModal || editingAgency" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-bold text-gray-900 mb-4">
          {{ editingAgency ? 'Edit Agency' : 'Add New Agency' }}
        </h2>
        
        <form @submit.prevent="saveAgency" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Agency Name *</label>
            <input
              v-model="agencyForm.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Address *</label>
            <textarea
              v-model="agencyForm.address"
              required
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
            <input
              v-model="agencyForm.phone"
              type="tel"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              v-model="agencyForm.email"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">GST Number *</label>
            <input
              v-model="agencyForm.gst"
              type="text"
              required
              placeholder="e.g., 27AAAPL1234C1ZV"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="closeModal"
              class="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="saving"
            >
              {{ saving ? 'Saving...' : (editingAgency ? 'Update' : 'Add') }} Agency
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAgencyStore } from '@/stores/agencyStore'
import { usePurchaseStore } from '@/stores/purchaseStore'
import {
  Plus,
  Building,
  CheckCircle,
  FileText,
  Search,
  Edit,
  Trash2,
  Eye
} from 'lucide-vue-next'

const router = useRouter()
const agencyStore = useAgencyStore()
const purchaseStore = usePurchaseStore()

const showAddModal = ref(false)
const editingAgency = ref(null)
const saving = ref(false)
const searchQuery = ref('')
const sortBy = ref('name')

const agencyForm = ref({
  name: '',
  address: '',
  phone: '',
  email: '',
  gst: ''
})

const agencies = computed(() => agencyStore.agencies)

const activeAgencies = computed(() => agencies.value.length)

const totalPurchases = computed(() => {
  return purchaseStore.purchases.filter(p => p.agencyId).length
})

const filteredAgencies = computed(() => {
  let filtered = [...agencies.value]
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(agency =>
      agency.name.toLowerCase().includes(query) ||
      agency.email.toLowerCase().includes(query) ||
      agency.gst.toLowerCase().includes(query) ||
      agency.address.toLowerCase().includes(query)
    )
  }
  
  // Apply sorting
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'date':
        return a.id - b.id
      case 'purchases':
        return getAgencyPurchaseCount(b.id) - getAgencyPurchaseCount(a.id)
      default:
        return 0
    }
  })
  
  return filtered
})

const getAgencyPurchaseCount = (agencyId) => {
  return purchaseStore.purchases.filter(p => p.agencyId === agencyId).length
}

const editAgency = (agency) => {
  editingAgency.value = agency
  agencyForm.value = { ...agency }
}

const deleteAgency = async (agency) => {
  if (confirm(`Are you sure you want to delete ${agency.name}?`)) {
    try {
      await agencyStore.deleteAgency(agency.id)
      // Show success message
    } catch (error) {
      console.error('Failed to delete agency:', error)
    }
  }
}

const viewPurchases = (agencyId) => {
  router.push('/purchase')
  sessionStorage.setItem('filterAgency', agencyId)
}

const saveAgency = async () => {
  saving.value = true
  try {
    if (editingAgency.value) {
      await agencyStore.updateAgency(editingAgency.value.id, agencyForm.value)
    } else {
      await agencyStore.addAgency(agencyForm.value)
    }
    closeModal()
  } catch (error) {
    console.error('Failed to save agency:', error)
  } finally {
    saving.value = false
  }
}

const closeModal = () => {
  showAddModal.value = false
  editingAgency.value = null
  agencyForm.value = {
    name: '',
    address: '',
    phone: '',
    email: '',
    gst: ''
  }
}

onMounted(async () => {
  await Promise.all([
    agencyStore.fetchAgencies(),
    purchaseStore.fetchPurchases()
  ])
})
</script>

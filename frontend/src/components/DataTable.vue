<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <!-- Header with search and actions -->
    <div class="p-4 border-b border-gray-200 bg-gray-50">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <!-- Search -->
        <div class="relative flex-1 sm:max-w-md">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search..."
            class="input pl-10"
          />
        </div>
        
        <!-- Filters and Actions -->
        <div class="flex items-center space-x-2">
          <!-- Filter dropdown -->
          <div class="relative">
            <button
              @click="toggleFilterDropdown"
              class="btn btn-secondary flex items-center space-x-2"
            >
              <Filter class="h-4 w-4" />
              <span>Filter</span>
              <ChevronDown class="h-4 w-4" />
            </button>
            
            <div
              v-if="showFilterDropdown"
              class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-10 animate-slide-up"
            >
              <div class="p-4 space-y-3">
                <div v-for="filter in filters" :key="filter.key">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    {{ filter.label }}
                  </label>
                  <select
                    v-if="filter.type === 'select'"
                    v-model="filterValues[filter.key]"
                    class="input w-full"
                    @change="applyFilters"
                  >
                    <option value="">All</option>
                    <option v-for="option in filter.options" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </option>
                  </select>
                  
                  <input
                    v-else-if="filter.type === 'date'"
                    v-model="filterValues[filter.key]"
                    type="date"
                    class="input w-full"
                    @change="applyFilters"
                  />
                  
                  <input
                    v-else
                    v-model="filterValues[filter.key]"
                    type="text"
                    :placeholder="filter.placeholder"
                    class="input w-full"
                    @input="applyFilters"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <!-- Add button -->
          <button
            v-if="showAddButton"
            @click="$emit('add')"
            class="btn btn-purple flex items-center space-x-2"
          >
            <Plus class="h-4 w-4" />
            <span>Add {{ itemName }}</span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="table">
        <thead class="table-header bg-gray-50">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              :class="[
                'table-head cursor-pointer select-none',
                column.sortable && 'hover:bg-gray-100'
              ]"
              @click="column.sortable && sortBy(column.key)"
            >
              <div class="flex items-center space-x-2">
                <span>{{ column.label }}</span>
                <div v-if="column.sortable" class="flex flex-col">
                  <ChevronUp
                    :class="[
                      'h-3 w-3',
                      sortKey === column.key && sortOrder === 'asc' ? 'text-blue-600' : 'text-gray-400'
                    ]"
                  />
                  <ChevronDown
                    :class="[
                      'h-3 w-3 -mt-1',
                      sortKey === column.key && sortOrder === 'desc' ? 'text-blue-600' : 'text-gray-400'
                    ]"
                  />
                </div>
              </div>
            </th>
            <th v-if="showActions" class="table-head">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading" class="table-row">
            <td :colspan="columns.length + (showActions ? 1 : 0)" class="table-cell text-center py-8">
              <div class="flex items-center justify-center space-x-2">
                <div class="spinner"></div>
                <span class="text-gray-600">Loading...</span>
              </div>
            </td>
          </tr>
          
          <tr v-else-if="paginatedData.length === 0" class="table-row">
            <td :colspan="columns.length + (showActions ? 1 : 0)" class="table-cell text-center py-8">
              <div class="text-gray-500">
                <PackageOpen class="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No data found</p>
              </div>
            </td>
          </tr>
          
          <tr
            v-else
            v-for="item in paginatedData"
            :key="item.id"
            class="table-row animate-fade-in"
            @click="handleRowClick(item)"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              class="table-cell"
            >
              <slot
                :name="`cell-${column.key}`"
                :item="item"
                :value="getNestedValue(item, column.key)"
              >
                <span v-if="column.format === 'currency'">
                  ${{ formatCurrency(getNestedValue(item, column.key)) }}
                </span>
                <span v-else-if="column.format === 'date'">
                  {{ formatDate(getNestedValue(item, column.key)) }}
                </span>
                <span v-else>
                  {{ getNestedValue(item, column.key) }}
                </span>
              </slot>
            </td>
            
            <td v-if="showActions" class="table-cell">
              <div class="flex items-center space-x-2">
                <button
                  @click="$emit('edit', item)"
                  class="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                  title="Edit"
                >
                  <Edit class="h-4 w-4" />
                </button>
                <button
                  @click="$emit('delete', item)"
                  class="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                  title="Delete"
                >
                  <Trash2 class="h-4 w-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Pagination -->
    <div v-if="totalPages > 1" class="p-4 border-t border-gray-200 bg-gray-50">
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-700">
          Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, filteredData.length) }} of {{ filteredData.length }} results
        </div>
        
        <div class="flex items-center space-x-2">
          <button
            @click="currentPage = Math.max(1, currentPage - 1)"
            :disabled="currentPage === 1"
            class="p-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft class="h-4 w-4" />
          </button>
          
          <div class="flex items-center space-x-1">
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="currentPage = page"
              :class="[
                'px-3 py-1 rounded-md text-sm',
                currentPage === page
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-50 border border-gray-300'
              ]"
            >
              {{ page }}
            </button>
          </div>
          
          <button
            @click="currentPage = Math.min(totalPages, currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="p-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import {
  Search,
  Filter,
  ChevronDown,
  Plus,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  PackageOpen
} from 'lucide-vue-next'

const props = defineProps({
  columns: {
    type: Array,
    required: true
  },
  data: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  showActions: {
    type: Boolean,
    default: true
  },
  showAddButton: {
    type: Boolean,
    default: true
  },
  itemName: {
    type: String,
    default: 'Item'
  },
  filters: {
    type: Array,
    default: () => []
  },
  itemsPerPage: {
    type: Number,
    default: 10
  }
})

const emit = defineEmits(['add', 'edit', 'delete', 'rowClick'])

const searchQuery = ref('')
const sortKey = ref('')
const sortOrder = ref('asc')
const currentPage = ref(1)
const showFilterDropdown = ref(false)
const filterValues = ref({})

// Initialize filter values
props.filters.forEach(filter => {
  filterValues.value[filter.key] = ''
})

const filteredData = computed(() => {
  let result = [...props.data]
  
  // Apply search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(item => {
      return props.columns.some(column => {
        const value = getNestedValue(item, column.key)
        return value && value.toString().toLowerCase().includes(query)
      })
    })
  }
  
  // Apply filters
  Object.entries(filterValues.value).forEach(([key, value]) => {
    if (value) {
      result = result.filter(item => {
        const itemValue = getNestedValue(item, key)
        return itemValue && itemValue.toString().toLowerCase().includes(value.toLowerCase())
      })
    }
  })
  
  return result
})

const sortedData = computed(() => {
  if (!sortKey.value) return filteredData.value
  
  return [...filteredData.value].sort((a, b) => {
    const aValue = getNestedValue(a, sortKey.value)
    const bValue = getNestedValue(b, sortKey.value)
    
    let comparison = 0
    if (aValue < bValue) comparison = -1
    if (aValue > bValue) comparison = 1
    
    return sortOrder.value === 'asc' ? comparison : -comparison
  })
})

const totalPages = computed(() => {
  return Math.ceil(sortedData.value.length / props.itemsPerPage)
})

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * props.itemsPerPage
  const end = start + props.itemsPerPage
  return sortedData.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

const sortBy = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}

const toggleFilterDropdown = () => {
  showFilterDropdown.value = !showFilterDropdown.value
}

const applyFilters = () => {
  currentPage.value = 1
}

const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => current && current[key], obj)
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value || 0)
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString()
}

// Reset to page 1 when data changes
watch(() => props.data, () => {
  currentPage.value = 1
})

const handleRowClick = (item) => {
  emit('rowClick', item)
}
</script>

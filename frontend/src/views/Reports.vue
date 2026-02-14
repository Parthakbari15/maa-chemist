<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Reports</h1>
        <p class="text-gray-600">Generate and view business reports</p>
      </div>
      <button
        @click="generateReport"
        class="btn btn-primary flex items-center space-x-2"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <span>Generate Report</span>
      </button>
    </div>

    <!-- Report Filters -->
    <div class="card">
      <h3 class="text-lg font-semibold text-gray-900 mb-6">Report Filters</h3>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
          <select v-model="filters.reportType" class="input w-full px-4 py-3" style="min-height: 48px;">
            <option value="sales">Sales Report</option>
            <option value="purchase">Purchase Report</option>
            <option value="stock">Stock Report</option>
            <option value="profit">Profit & Loss</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">From Date</label>
          <input
            v-model="filters.fromDate"
            type="date"
            class="input w-full px-4 py-3"
            style="min-height: 48px;"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">To Date</label>
          <input
            v-model="filters.toDate"
            type="date"
            class="input w-full px-4 py-3"
            style="min-height: 48px;"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Format</label>
          <select v-model="filters.format" class="input w-full px-4 py-3" style="min-height: 48px;">
            <option value="table">Table View</option>
            <option value="chart">Chart View</option>
            <option value="summary">Summary</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Report Content -->
    <div class="card">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-gray-900">Report Results</h3>
        <div class="flex space-x-2">
          <button
            @click="exportPDF"
            class="btn btn-secondary flex items-center space-x-1"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <span>Export PDF</span>
          </button>
          <button
            @click="exportExcel"
            class="btn btn-secondary flex items-center space-x-1"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <svg class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-purple-600">Total Revenue</p>
              <p class="text-2xl font-bold text-purple-900">₹{{ totalRevenue.toLocaleString() }}</p>
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <svg class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-blue-600">Total Sales</p>
              <p class="text-2xl font-bold text-blue-900">{{ totalSales }}</p>
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <svg class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-green-600">Total Purchases</p>
              <p class="text-2xl font-bold text-green-900">{{ totalPurchases }}</p>
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-lg">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                <svg class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-yellow-600">Profit</p>
              <p class="text-2xl font-bold text-yellow-900">₹{{ totalProfit.toLocaleString() }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Report Table -->
      <div class="overflow-x-auto border border-gray-200 rounded-lg">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bill No</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer/Agency</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="item in reportData" :key="item.id">
              <td class="px-4 py-3 text-sm text-gray-900">{{ formatDate(item.date) }}</td>
              <td class="px-4 py-3 text-sm">
                <span :class="item.type === 'sale' ? 'text-green-600' : 'text-blue-600'" class="font-medium">
                  {{ item.type === 'sale' ? 'Sale' : 'Purchase' }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm text-gray-900">{{ item.billNo }}</td>
              <td class="px-4 py-3 text-sm text-gray-900">{{ item.party }}</td>
              <td class="px-4 py-3 text-sm text-gray-900">{{ item.items }}</td>
              <td class="px-4 py-3 text-sm font-medium text-gray-900">₹{{ item.amount.toLocaleString() }}</td>
              <td class="px-4 py-3 text-sm">
                <span :class="getStatusClass(item.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ item.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const filters = ref({
  reportType: 'sales',
  fromDate: '',
  toDate: '',
  format: 'table'
})

// Mock data for demonstration
const reportData = ref([
  {
    id: 1,
    date: '2024-01-15',
    type: 'sale',
    billNo: 'CA-T/135',
    party: 'John Doe',
    items: 3,
    amount: 1250,
    status: 'completed'
  },
  {
    id: 2,
    date: '2024-01-16',
    type: 'purchase',
    billNo: 'PO/001',
    party: 'ABC Medical Supplies',
    items: 5,
    amount: 5000,
    status: 'completed'
  },
  {
    id: 3,
    date: '2024-01-17',
    type: 'sale',
    billNo: 'CA-T/136',
    party: 'Jane Smith',
    items: 2,
    amount: 890,
    status: 'completed'
  }
])

const totalRevenue = computed(() => {
  return reportData.value
    .filter(item => item.type === 'sale')
    .reduce((total, item) => total + item.amount, 0)
})

const totalSales = computed(() => {
  return reportData.value.filter(item => item.type === 'sale').length
})

const totalPurchases = computed(() => {
  return reportData.value.filter(item => item.type === 'purchase').length
})

const totalProfit = computed(() => {
  const sales = reportData.value
    .filter(item => item.type === 'sale')
    .reduce((total, item) => total + item.amount, 0)
  const purchases = reportData.value
    .filter(item => item.type === 'purchase')
    .reduce((total, item) => total + item.amount, 0)
  return sales - purchases * 0.7 // Assuming 30% profit margin
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const getStatusClass = (status) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const generateReport = () => {
  // Generate report based on filters
  console.log('Generating report with filters:', filters.value)
}

const exportPDF = () => {
  // Export to PDF functionality
  console.log('Exporting to PDF')
}

const exportExcel = () => {
  // Export to Excel functionality
  console.log('Exporting to Excel')
}
</script>

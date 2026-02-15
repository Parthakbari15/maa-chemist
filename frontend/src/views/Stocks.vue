<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Stock Management</h1>
        <p class="text-gray-600">Monitor and manage your inventory levels</p>
      </div>
      <div class="flex items-center space-x-2">
        <button
          @click="refreshStock"
          class="btn btn-secondary flex items-center space-x-2"
          :disabled="stockStore.loading"
        >
          <RefreshCw
            :class="['h-4 w-4', stockStore.loading && 'animate-spin']"
          />
          <span>Refresh</span>
        </button>
        <button
          @click="exportStockData"
          class="btn btn-primary flex items-center space-x-2"
        >
          <Download class="h-4 w-4" />
          <span>Export</span>
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="card bg-blue-50 border-blue-200">
        <div class="flex items-center space-x-3">
          <div class="bg-blue-100 rounded-lg p-2">
            <Package class="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p class="text-sm text-blue-600 font-medium">Total Products</p>
            <p class="text-xl font-bold text-blue-900">
              {{ stockStore.stockData.length }}
            </p>
          </div>
        </div>
      </div>

      <div class="card bg-green-50 border-green-200">
        <div class="flex items-center space-x-3">
          <div class="bg-green-100 rounded-lg p-2">
            <CheckCircle class="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p class="text-sm text-green-600 font-medium">In Stock</p>
            <p class="text-xl font-bold text-green-900">{{ inStockCount }}</p>
          </div>
        </div>
      </div>

      <div class="card bg-yellow-50 border-yellow-200">
        <div class="flex items-center space-x-3">
          <div class="bg-yellow-100 rounded-lg p-2">
            <AlertTriangle class="h-5 w-5 text-yellow-600" />
          </div>
          <div>
            <p class="text-sm text-yellow-600 font-medium">Low Stock</p>
            <p class="text-xl font-bold text-yellow-900">
              {{ stockStore.lowStockItems.length }}
            </p>
          </div>
        </div>
      </div>

      <div class="card bg-red-50 border-red-200">
        <div class="flex items-center space-x-3">
          <div class="bg-red-100 rounded-lg p-2">
            <XCircle class="h-5 w-5 text-red-600" />
          </div>
          <div>
            <p class="text-sm text-red-600 font-medium">Out of Stock</p>
            <p class="text-xl font-bold text-red-900">
              {{ stockStore.outOfStockItems.length }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Stock Value Summary -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="card bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-blue-100 font-medium">Total Stock Value</p>
            <p class="text-2xl font-bold">
              ₹{{ stockStore.totalStockValue.toFixed(2) }}
            </p>
          </div>
          <div class="bg-white bg-opacity-20 rounded-lg p-3">
            <IndianRupee class="h-8 w-8 text-white" />
          </div>
        </div>
      </div>

      <div class="card bg-gradient-to-r from-green-500 to-green-600 text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-green-100 font-medium">Total Stock Quantity</p>
            <p class="text-2xl font-bold">
              {{ stockStore.totalStockQuantity }}
            </p>
          </div>
          <div class="bg-white bg-opacity-20 rounded-lg p-3">
            <Package class="h-8 w-8 text-white" />
          </div>
        </div>
      </div>

      <div
        class="card bg-gradient-to-r from-purple-500 to-purple-600 text-white"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-purple-100 font-medium">Total Profit</p>
            <p class="text-2xl font-bold">
              ₹{{ stockStore.totalProfit.toFixed(2) }}
            </p>
          </div>
          <div class="bg-white bg-opacity-20 rounded-lg p-3">
            <TrendingUp class="h-8 w-8 text-white" />
          </div>
        </div>
      </div>
    </div>

    <!-- Alerts Section -->
    <div v-if="hasAlerts" class="space-y-4">
      <h2 class="text-lg font-semibold text-gray-900">Stock Alerts</h2>

      <!-- Out of Stock -->
      <div
        v-if="stockStore.outOfStockItems.length > 0"
        class="card border-l-4 border-red-500 bg-red-50"
      >
        <div class="flex items-center space-x-3 mb-3">
          <XCircle class="h-5 w-5 text-red-600" />
          <h3 class="font-medium text-red-900">Out of Stock Items</h3>
          <span class="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
            {{ stockStore.outOfStockItems.length }} items
          </span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          <div
            v-for="item in stockStore.outOfStockItems"
            :key="item.productName"
            class="flex items-center justify-between p-2 bg-white rounded border border-red-200"
          >
            <span class="text-sm font-medium text-red-900">{{
              item.productName
            }}</span>
            <button
              @click="goToPurchase(item.productName)"
              class="text-xs text-red-600 hover:text-red-800 font-medium"
            >
              Order Now
            </button>
          </div>
        </div>
      </div>

      <!-- Low Stock -->
      <div
        v-if="stockStore.lowStockItems.length > 0"
        class="card border-l-4 border-yellow-500 bg-yellow-50"
      >
        <div class="flex items-center space-x-3 mb-3">
          <AlertTriangle class="h-5 w-5 text-yellow-600" />
          <h3 class="font-medium text-yellow-900">Low Stock Items</h3>
          <span
            class="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full"
          >
            {{ stockStore.lowStockItems.length }} items
          </span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          <div
            v-for="item in stockStore.lowStockItems"
            :key="item.productName"
            class="p-2 bg-white rounded border border-yellow-200"
          >
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-yellow-900">{{
                item.productName
              }}</span>
              <span class="text-xs text-yellow-700 font-medium"
                >{{ item.availableStock }} left</span
              >
            </div>
            <div class="mt-1">
              <div class="w-full bg-yellow-200 rounded-full h-1">
                <div
                  class="bg-yellow-500 h-1 rounded-full"
                  :style="{
                    width: `${Math.min(100, (item.availableStock / 10) * 100)}%`,
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Expiring Soon -->
      <div
        v-if="stockStore.expiringStockItems.length > 0"
        class="card border-l-4 border-orange-500 bg-orange-50"
      >
        <div class="flex items-center space-x-3 mb-3">
          <Clock class="h-5 w-5 text-orange-600" />
          <h3 class="font-medium text-orange-900">Items Expiring Soon</h3>
          <span
            class="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full"
          >
            {{ stockStore.expiringStockItems.length }} items
          </span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          <div
            v-for="item in stockStore.expiringStockItems"
            :key="item.productName"
            class="p-2 bg-white rounded border border-orange-200"
          >
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-orange-900">{{
                item.productName
              }}</span>
              <span class="text-xs text-orange-700">{{
                formatDate(item.latestExpiryDate)
              }}</span>
            </div>
            <div class="text-xs text-orange-600 mt-1">
              {{ item.availableStock }} units available
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stock Table -->
    <div class="card">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-semibold text-gray-900">
          Current Stock Levels
        </h2>
        <div class="flex items-center space-x-2">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search products..."
            class="input text-sm"
          />
          <select v-model="stockFilter" class="input text-sm">
            <option value="all">All Products</option>
            <option value="instock">In Stock</option>
            <option value="lowstock">Low Stock</option>
            <option value="outofstock">Out of Stock</option>
            <option value="expiring">Expiring Soon</option>
          </select>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="table">
          <thead class="table-header bg-gray-50">
            <tr>
              <th class="table-head">Product Name</th>
              <th class="table-head">Total Purchased</th>
              <th class="table-head">Total Sold</th>
              <th class="table-head">Available Stock</th>
              <th class="table-head">Purchase Value</th>
              <th class="table-head">Sales Value</th>
              <th class="table-head">Latest Expiry</th>
              <th class="table-head">Status</th>
              <th class="table-head">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="stockStore.loading" class="table-row">
              <td colspan="9" class="table-cell text-center py-8">
                <div class="flex items-center justify-center space-x-2">
                  <div class="spinner"></div>
                  <span class="text-gray-600">Loading stock data...</span>
                </div>
              </td>
            </tr>

            <tr v-else-if="filteredStock.length === 0" class="table-row">
              <td colspan="9" class="table-cell text-center py-8">
                <div class="text-gray-500">
                  <PackageOpen class="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No stock data found</p>
                </div>
              </td>
            </tr>

            <tr
              v-else
              v-for="stock in filteredStock"
              :key="stock.productName"
              class="table-row"
              @click="viewStockDetail(stock)"
            >
              <td class="table-cell font-medium">{{ stock.productName }}</td>
              <td class="table-cell">{{ stock.totalPurchased }}</td>
              <td class="table-cell">{{ stock.totalSold }}</td>
              <td class="table-cell">
                <span :class="getStockClass(stock.availableStock)">
                  {{ stock.availableStock }}
                </span>
              </td>
              <td class="table-cell">₹{{ stock.purchaseValue.toFixed(2) }}</td>
              <td class="table-cell">₹{{ stock.salesValue.toFixed(2) }}</td>
              <td class="table-cell">
                <span
                  v-if="stock.latestExpiryDate"
                  :class="getExpiryClass(stock.latestExpiryDate)"
                >
                  {{ formatDate(stock.latestExpiryDate) }}
                </span>
                <span v-else class="text-gray-400">N/A</span>
              </td>
              <td class="table-cell">
                <span :class="getStatusBadgeClass(stock)">
                  {{ getStatusText(stock) }}
                </span>
              </td>
              <td class="table-cell">
                <div class="flex items-center space-x-2">
                  <button
                    @click="viewStockDetails(stock)"
                    class="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                    title="View Details"
                  >
                    <Eye class="h-4 w-4" />
                  </button>
                  <button
                    @click="goToPurchase(stock.productName)"
                    class="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                    title="Add Purchase"
                  >
                    <Plus class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Stock Details Modal -->
    <div v-if="selectedStock" class="fixed inset-0 z-50 overflow-y-auto">
      <div
        class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        @click="closeDetailsModal"
      ></div>

      <div class="flex min-h-screen items-center justify-center p-4">
        <div
          class="relative bg-white rounded-lg shadow-xl max-w-2xl w-full animate-bounce-in"
        >
          <div class="bg-blue-600 text-white p-6 rounded-t-lg">
            <h2 class="text-xl font-bold">
              Stock Details - {{ selectedStock.productName }}
            </h2>
          </div>

          <div class="p-6">
            <div class="grid grid-cols-2 gap-6">
              <div class="space-y-4">
                <h3 class="font-semibold text-gray-900">
                  Purchase Information
                </h3>
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Total Purchased:</span>
                    <span class="font-medium">{{
                      selectedStock.totalPurchased
                    }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Purchase Value:</span>
                    <span class="font-medium"
                      >₹{{ selectedStock.purchaseValue.toFixed(2) }}</span
                    >
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600"
                      >Avg Purchase Price:</span
                    >
                    <span class="font-medium">
                      ₹{{
                        selectedStock.totalPurchased > 0
                          ? (
                              selectedStock.purchaseValue /
                              selectedStock.totalPurchased
                            ).toFixed(2)
                          : "0.00"
                      }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="space-y-4">
                <h3 class="font-semibold text-gray-900">Sales Information</h3>
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Total Sold:</span>
                    <span class="font-medium">{{
                      selectedStock.totalSold
                    }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Sales Value:</span>
                    <span class="font-medium"
                      >₹{{ selectedStock.salesValue.toFixed(2) }}</span
                    >
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Avg Sale Price:</span>
                    <span class="font-medium">
                      ₹{{
                        selectedStock.totalSold > 0
                          ? (
                              selectedStock.salesValue / selectedStock.totalSold
                            ).toFixed(2)
                          : "0.00"
                      }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-6 pt-6 border-t border-gray-200">
              <div class="flex justify-between items-center">
                <button @click="closeDetailsModal" class="btn btn-secondary">
                  Close
                </button>
                <div class="flex space-x-2">
                  <button
                    @click="goToPurchase(selectedStock.productName)"
                    class="btn btn-primary"
                  >
                    Add Purchase
                  </button>
                  <button
                    @click="$router.push('/sales')"
                    class="btn btn-secondary"
                  >
                    Add Sale
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useStockStore } from "@/stores/stockStore";
import {
  RefreshCw,
  Download,
  Package,
  CheckCircle,
  AlertTriangle,
  XCircle,
  IndianRupee,
  TrendingUp,
  Clock,
  PackageOpen,
  Eye,
  Plus,
} from "lucide-vue-next";

const router = useRouter();
const stockStore = useStockStore();

const searchQuery = ref("");
const stockFilter = ref("all");
const selectedStock = ref(null);

const filteredStock = computed(() => {
  let stock = [...stockStore.stockData];

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    stock = stock.filter((item) =>
      item.productName.toLowerCase().includes(query),
    );
  }

  // Apply status filter
  switch (stockFilter.value) {
    case "instock":
      stock = stock.filter((item) => item.availableStock > 10);
      break;
    case "lowstock":
      stock = stock.filter(
        (item) => item.availableStock > 0 && item.availableStock <= 10,
      );
      break;
    case "outofstock":
      stock = stock.filter((item) => item.availableStock <= 0);
      break;
    case "expiring":
      stock = stock.filter((item) => item.isExpiringSoon);
      break;
  }

  return stock;
});

const inStockCount = computed(() => {
  return stockStore.stockData.filter((item) => item.availableStock > 10).length;
});

const hasAlerts = computed(() => {
  return (
    stockStore.outOfStockItems.length > 0 ||
    stockStore.lowStockItems.length > 0 ||
    stockStore.expiringStockItems.length > 0
  );
});

const getStockClass = (quantity) => {
  if (quantity <= 0) return "text-red-600 font-bold";
  if (quantity <= 10) return "text-yellow-600 font-medium";
  return "text-green-600 font-medium";
};

const getExpiryClass = (expiryDate) => {
  const daysUntilExpiry = Math.ceil(
    (new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24),
  );
  if (daysUntilExpiry <= 2) return "text-red-600 font-medium";
  if (daysUntilExpiry <= 7) return "text-orange-600 font-medium";
  return "text-gray-600";
};

const getStatusBadgeClass = (stock) => {
  if (stock.availableStock <= 0)
    return "bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full";
  if (stock.availableStock <= 10)
    return "bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full";
  if (stock.isExpiringSoon)
    return "bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full";
  return "bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full";
};

const getStatusText = (stock) => {
  if (stock.availableStock <= 0) return "Out of Stock";
  if (stock.availableStock <= 10) return "Low Stock";
  if (stock.isExpiringSoon) return "Expiring Soon";
  return "In Stock";
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const refreshStock = async () => {
  try {
    await stockStore.refreshStock();
  } catch (error) {
    console.error("Failed to refresh stock:", error);
  }
};

const exportStockData = () => {
  const csvContent = [
    [
      "Product Name",
      "Total Purchased",
      "Total Sold",
      "Available Stock",
      "Purchase Value",
      "Sales Value",
      "Latest Expiry Date",
      "Status",
    ],
    ...filteredStock.value.map((stock) => [
      stock.productName,
      stock.totalPurchased,
      stock.totalSold,
      stock.availableStock,
      stock.purchaseValue.toFixed(2),
      stock.salesValue.toFixed(2),
      stock.latestExpiryDate ? formatDate(stock.latestExpiryDate) : "N/A",
      getStatusText(stock),
    ]),
  ]
    .map((row) => row.join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `stock-report-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);

  window.showToast("Stock data exported successfully", "success");
};

const viewStockDetails = (stock) => {
  selectedStock.value = stock;
};

const closeDetailsModal = () => {
  selectedStock.value = null;
};

const goToPurchase = (productName = "") => {
  router.push("/purchase");
  if (productName) {
    // Store the product name to pre-fill the form
    sessionStorage.setItem("prefillProduct", productName);
  }
};

const viewStockDetail = (stock) => {
  router.push(`/stocks/${encodeURIComponent(stock.productName)}`);
};

onMounted(() => {
  stockStore.refreshStock();
});
</script>

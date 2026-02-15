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
    <div v-else-if="sale" class="space-y-6">
      <!-- Basic Sale Information -->
      <div class="card">
        <div class="flex items-center space-x-3 mb-6">
          <div class="bg-green-100 rounded-lg p-3">
            <IndianRupee class="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900">Sale Information</h2>
            <p class="text-gray-600">Basic sale details</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Bill Number</label
            >
            <p class="font-medium text-gray-900">{{ sale.billNo || "N/A" }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Bill Date</label
            >
            <p class="font-medium text-gray-900">
              {{ formatDate(sale.billDate) }}
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Payment Type</label
            >
            <p class="font-medium text-gray-900">
              {{ sale.paymentType || "N/A" }}
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Total Amount</label
            >
            <p class="font-bold text-lg text-green-600">
              ₹{{ (sale.grandTotal || sale.total || 0).toFixed(2) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Customer Information -->
      <div class="card">
        <div class="flex items-center space-x-3 mb-6">
          <div class="bg-blue-100 rounded-lg p-3">
            <User class="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900">
              Customer Information
            </h2>
            <p class="text-gray-600">
              Customer details and contact information
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Customer Name</label
            >
            <p class="font-medium text-gray-900">{{ sale.toName || "N/A" }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Mobile Number</label
            >
            <div class="flex items-center space-x-2">
              <Phone class="h-4 w-4 text-gray-500" />
              <p class="font-medium text-gray-900">
                {{ sale.toMobile || "N/A" }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Product Information -->
      <div class="card">
        <div class="flex items-center space-x-3 mb-6">
          <div class="bg-purple-100 rounded-lg p-3">
            <Package class="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900">Product Information</h2>
            <p class="text-gray-600">Product details and pricing</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Product Name</label
            >
            <p class="font-medium text-gray-900">
              {{ sale.productName || "N/A" }}
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Quantity Sold</label
            >
            <p class="font-medium text-gray-900">
              {{ sale.quantity || 0 }} units
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Sale Price</label
            >
            <p class="font-medium text-gray-900">
              ₹{{ (sale.salePrice || 0).toFixed(2) }}
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Total Revenue</label
            >
            <p class="font-bold text-lg text-green-600">
              ₹{{ (sale.total || 0).toFixed(2) }}
            </p>
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
            <p class="text-2xl font-bold text-green-900">
              ₹{{ (sale.total || 0).toFixed(2) }}
            </p>
          </div>
          <div class="text-center p-4 bg-red-50 rounded-lg">
            <p class="text-sm text-red-600 font-medium">Cost</p>
            <p class="text-2xl font-bold text-red-900">
              ₹{{ totalCost.toFixed(2) }}
            </p>
          </div>
          <div class="text-center p-4 bg-purple-50 rounded-lg">
            <p class="text-sm text-purple-600 font-medium">Profit</p>
            <p
              class="text-2xl font-bold"
              :class="profit >= 0 ? 'text-purple-900' : 'text-red-900'"
            >
              ₹{{ profit.toFixed(2) }}
            </p>
          </div>
        </div>

        <div class="mt-4">
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm font-medium text-gray-700">Profit Margin</span>
            <span
              class="text-sm font-bold"
              :class="profitMargin >= 0 ? 'text-green-600' : 'text-red-600'"
            >
              {{ profitMargin.toFixed(1) }}%
            </span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
              :class="[
                'h-2 rounded-full transition-all duration-500',
                profitMargin >= 0 ? 'bg-green-500' : 'bg-red-500',
              ]"
              :style="{ width: `${Math.abs(profitMargin)}%` }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Sidebar Information -->
      <div class="space-y-6">
        <!-- Stock Status Card -->
        <div class="card">
          <div class="flex items-center space-x-3 mb-6">
            <div class="bg-blue-100 rounded-lg p-3">
              <Package class="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-900">Stock Status</h2>
              <p class="text-gray-600">Current inventory status</p>
            </div>
          </div>

          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Available Stock</span>
              <span class="font-medium text-blue-600">{{ currentStock }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Items Sold</span>
              <span class="font-medium text-red-600"
                >-{{ sale.quantity || 0 }}</span
              >
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

        <!-- Related Purchases -->
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
                <p class="font-medium text-gray-900">
                  {{ purchase.quantity }} units
                </p>
                <p class="text-xs text-gray-500">
                  {{ formatDate(purchase.date) }}
                </p>
                <div
                  v-if="purchase.billImage"
                  class="flex items-center space-x-1 mt-1"
                >
                  <ImageIcon class="h-3 w-3 text-green-500" />
                  <span class="text-xs text-green-600">
                    {{
                      purchase.billImage.startsWith("data:") ? "Bill" : "PDF"
                    }}
                  </span>
                </div>
              </div>
              <div class="text-right">
                <p class="font-medium text-gray-900">
                  ₹{{ (purchase.total || 0).toFixed(2) }}
                </p>
                <ChevronRight class="h-4 w-4 text-gray-400 inline" />
              </div>
            </div>
            <div
              v-if="relatedPurchases.length === 0"
              class="text-center text-gray-500 py-4"
            >
              <p class="text-sm">No related purchases found</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useSalesStore } from "@/stores/salesStore";
import { usePurchaseStore } from "@/stores/purchaseStore";
import { useStockStore } from "@/stores/stockStore";
import {
  ArrowLeft,
  Edit,
  Trash2,
  IndianRupee,
  Calendar,
  TrendingUp,
  ShoppingCart,
  Package,
  Printer,
  ChevronRight,
  AlertCircle,
  ImageIcon,
  User,
  Phone,
} from "lucide-vue-next";

const route = useRoute();
const router = useRouter();
const salesStore = useSalesStore();
const purchaseStore = usePurchaseStore();
const stockStore = useStockStore();

const loading = ref(true);
const error = ref(null);

const sale = computed(() => {
  const saleData = salesStore.getSaleById(parseInt(route.params.id));
  if (!saleData) return null;

  // Handle complex sale structure (with items array) vs simple structure
  if (saleData.items && saleData.items.length > 0) {
    // Complex structure - use first item for display
    const firstItem = saleData.items[0];
    return {
      ...saleData,
      productName: firstItem.product,
      quantity: firstItem.qty,
      salePrice: firstItem.mrp,
      total: saleData.grandTotal,
    };
  }

  // Simple structure - return as-is
  return saleData;
});

const currentStock = computed(() => {
  if (!sale.value) return 0;
  const stock = stockStore.getStockByProduct(sale.value.productName);
  return stock?.availableStock || 0;
});

const stockBeforeSale = computed(() => {
  if (!sale.value) return 0;
  return currentStock.value + sale.value.quantity;
});

const totalCost = computed(() => {
  if (!sale.value) return 0;
  const stock = stockStore.getStockByProduct(sale.value.productName);
  const avgPurchasePrice =
    stock?.totalPurchased > 0 ? stock.purchaseValue / stock.totalPurchased : 0;
  return sale.value.quantity * avgPurchasePrice;
});

const profit = computed(() => {
  if (!sale.value) return 0;
  return sale.value.total - totalCost.value;
});

const profitMargin = computed(() => {
  if (!sale.value || sale.value.total === 0) return 0;
  return (profit.value / sale.value.total) * 100;
});

const relatedPurchases = computed(() => {
  if (!sale.value) return [];
  return purchaseStore
    .getPurchasesByProduct(sale.value.productName)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);
});

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const editSale = () => {
  router.push("/sales");
  sessionStorage.setItem("editSaleId", sale.value.id);
};

const deleteSale = async () => {
  if (
    confirm(
      "Are you sure you want to delete this sale? This will add the quantity back to stock.",
    )
  ) {
    try {
      await salesStore.deleteSale(sale.value.id);
      router.push("/sales");
    } catch (error) {
      console.error("Failed to delete sale:", error);
    }
  }
};

const createPurchase = () => {
  router.push("/purchase");
  sessionStorage.setItem("prefillProduct", sale.value.productName);
};

const viewStock = () => {
  router.push(`/stocks/${encodeURIComponent(sale.value.productName)}`);
};

const viewPurchaseDetail = (purchaseId) => {
  router.push(`/purchase/${purchaseId}`);
};

const printDetails = () => {
  // Create a simplified print format similar to the purchase print
  const printContent = `
    <html>
      <head>
        <title>Sales Bill - ${sale.value.billNo || "N/A"}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .company-name { font-size: 24px; font-weight: bold; }
          .company-details { font-size: 12px; color: #666; }
          .bill-info { display: flex; justify-content: space-between; margin: 20px 0; border-bottom: 2px solid #000; padding-bottom: 10px; }
          .customer-info { margin: 20px 0; }
          .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .items-table th { background-color: #f2f2f2; font-weight: bold; }
          .totals { margin-top: 20px; text-align: right; }
          .total-row { font-weight: bold; font-size: 16px; margin: 5px 0; }
          @media print { body { margin: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-name">Maa Chemist</div>
          <div class="company-details">Medical & General Store | GSTIN: 07AAAPM1234C1ZY</div>
          <div class="company-details">Shop No. 45, Main Market, Delhi - 110001</div>
          <div class="company-details">Phone: +91-9876543210 | Email: info@maachemist.com</div>
        </div>
        
        <div class="bill-info">
          <div>
            <strong>Bill No:</strong> ${sale.value.billNo || "N/A"}
          </div>
          <div>
            <strong>Date:</strong> ${sale.value.billDate || new Date().toLocaleDateString("en-IN")}
          </div>
        </div>
        
        <div class="customer-info">
          <h3>Customer Details</h3>
          <p><strong>Name:</strong> ${sale.value.toName || "N/A"}</p>
          <p><strong>Mobile:</strong> ${sale.value.toMobile || "N/A"}</p>
        </div>
        
        <table class="items-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Rate</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${sale.value.productName || "N/A"}</td>
              <td>${sale.value.quantity || 0}</td>
              <td>₹${(sale.value.salePrice || 0).toFixed(2)}</td>
              <td>₹${(sale.value.total || 0).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
        
        <div class="totals">
          <div class="total-row">
            Total Amount: ₹${(sale.value.total || 0).toFixed(2)}
          </div>
        </div>
      </body>
    </html>
  `;

  const printWindow = window.open("", "_blank");
  printWindow.document.write(printContent);
  printWindow.document.close();
  printWindow.print();
};

onMounted(async () => {
  try {
    await Promise.all([
      salesStore.fetchSales(),
      purchaseStore.fetchPurchases(),
      stockStore.refreshStock(),
    ]);

    if (!sale.value) {
      error.value = "Sale not found";
    }
  } catch (err) {
    error.value = "Failed to load sale details";
    console.error("Error loading sale details:", err);
  } finally {
    loading.value = false;
  }
});
</script>

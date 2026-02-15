<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p class="text-gray-600">Welcome to your inventory management system</p>
      </div>
      <div class="flex items-center space-x-2 text-sm text-gray-500">
        <Clock class="h-4 w-4" />
        <span>Last updated: {{ lastUpdated }}</span>
      </div>
    </div>

    <!-- Analytics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <AnalyticsCard
        title="Total Purchases"
        subtitle="All time"
        :value="purchaseStore.totalPurchases"
        :icon="ShoppingCart"
        custom-class="border-l-4 border-blue-500"
        bg-color="bg-blue-100"
        icon-color="text-blue-600"
        format="currency"
        :loading="purchaseStore.loading"
      />

      <AnalyticsCard
        title="Total Sales"
        subtitle="All time"
        :value="salesStore.totalSales"
        :icon="IndianRupee"
        custom-class="border-l-4 border-green-500"
        bg-color="bg-green-100"
        icon-color="text-green-600"
        format="currency"
        :loading="salesStore.loading"
      />

      <AnalyticsCard
        title="Total Profit"
        subtitle="Sales - Purchases"
        :value="stockStore.totalProfit"
        :icon="TrendingUp"
        custom-class="border-l-4 border-purple-500"
        bg-color="bg-purple-100"
        icon-color="text-purple-600"
        format="currency"
        :trend="profitTrend"
        :loading="purchaseStore.loading || salesStore.loading"
      />

      <AnalyticsCard
        title="Total Stock"
        subtitle="Available quantity"
        :value="stockStore.totalStockQuantity"
        :icon="Package"
        custom-class="border-l-4 border-orange-500"
        bg-color="bg-orange-100"
        icon-color="text-orange-600"
        additional-info="Across all products"
        :loading="purchaseStore.loading || salesStore.loading"
      />
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Purchase vs Sales Chart -->
      <div class="card">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-gray-900">Purchase vs Sales</h2>
          <button
            @click="refreshCharts"
            class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            :disabled="loadingCharts"
          >
            <RefreshCw :class="['h-4 w-4', loadingCharts && 'animate-spin']" />
          </button>
        </div>
        <div class="h-64">
          <Bar
            v-if="chartData.purchasesVsSales"
            :data="chartData.purchasesVsSales"
            :options="chartOptions.bar"
          />
          <div
            v-else
            class="flex items-center justify-center h-full text-gray-500"
          >
            <div class="text-center">
              <BarChart3 class="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>No data available</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Monthly Sales Trend -->
      <div class="card">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-gray-900">
            Monthly Sales Trend
          </h2>
          <select
            v-model="selectedYear"
            @change="updateMonthlyChart"
            class="input text-sm"
          >
            <option v-for="year in availableYears" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
        </div>
        <div class="h-64">
          <Line
            v-if="chartData.monthlySales"
            :data="chartData.monthlySales"
            :options="chartOptions.line"
          />
          <div
            v-else
            class="flex items-center justify-center h-full text-gray-500"
          >
            <div class="text-center">
              <LineChart class="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>No sales data available</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Stats & Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Low Stock Alert -->
      <div class="card">
        <div class="flex items-center space-x-3 mb-4">
          <div class="bg-yellow-100 rounded-lg p-2">
            <AlertTriangle class="h-5 w-5 text-yellow-600" />
          </div>
          <h3 class="font-semibold text-gray-900">Low Stock Alert</h3>
        </div>
        <div class="space-y-2">
          <div
            v-for="item in stockStore.lowStockItems.slice(0, 5)"
            :key="item.productName"
            class="flex items-center justify-between p-2 bg-yellow-50 rounded-lg"
          >
            <span class="text-sm font-medium text-gray-900">{{
              item.productName
            }}</span>
            <span class="text-sm text-yellow-700 font-medium"
              >{{ item.availableStock }} left</span
            >
          </div>
          <div
            v-if="stockStore.lowStockItems.length === 0"
            class="text-center text-gray-500 py-4"
          >
            <CheckCircle class="h-8 w-8 mx-auto mb-2 text-green-500" />
            <p class="text-sm">All items well stocked</p>
          </div>
          <div v-if="stockStore.lowStockItems.length > 5" class="text-center">
            <button class="text-sm text-blue-600 hover:text-blue-800">
              View all {{ stockStore.lowStockItems.length }} items
            </button>
          </div>
        </div>
      </div>

      <!-- Recent Purchases -->
      <div class="card">
        <div class="flex items-center space-x-3 mb-4">
          <div class="bg-blue-100 rounded-lg p-2">
            <ShoppingCart class="h-5 w-5 text-blue-600" />
          </div>
          <h3 class="font-semibold text-gray-900">Recent Purchases</h3>
        </div>
        <div class="space-y-2">
          <div
            v-for="purchase in recentPurchases"
            :key="purchase.id"
            class="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
          >
            <div>
              <p class="text-sm font-medium text-gray-900">
                {{ purchase.productName }}
              </p>
              <p class="text-xs text-gray-500">
                {{ formatDate(purchase.date) }}
              </p>
            </div>
            <span class="text-sm font-medium text-gray-900">
              ₹{{ (purchase.quantity * purchase.purchasePrice).toFixed(2) }}
            </span>
          </div>
          <div
            v-if="recentPurchases.length === 0"
            class="text-center text-gray-500 py-4"
          >
            <p class="text-sm">No recent purchases</p>
          </div>
        </div>
      </div>

      <!-- Recent Sales -->
      <div class="card">
        <div class="flex items-center space-x-3 mb-4">
          <div class="bg-green-100 rounded-lg p-2">
            <IndianRupee class="h-5 w-5 text-green-600" />
          </div>
          <h3 class="font-semibold text-gray-900">Recent Sales</h3>
        </div>
        <div class="space-y-2">
          <div
            v-for="sale in recentSales"
            :key="sale.id"
            class="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
          >
            <div>
              <p class="text-sm font-medium text-gray-900">
                {{ sale.productName }}
              </p>
              <p class="text-xs text-gray-500">{{ formatDate(sale.date) }}</p>
            </div>
            <span class="text-sm font-medium text-gray-900">
              ₹{{ (sale.quantity * sale.salePrice).toFixed(2) }}
            </span>
          </div>
          <div
            v-if="recentSales.length === 0"
            class="text-center text-gray-500 py-4"
          >
            <p class="text-sm">No recent sales</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Expiry Modal -->
    <ExpiryModal
      :show="showExpiryModal"
      :expiring-items="expiringItems"
      @close="showExpiryModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { Bar, Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import { usePurchaseStore } from "@/stores/purchaseStore";
import { useSalesStore } from "@/stores/salesStore";
import { useStockStore } from "@/stores/stockStore";
import AnalyticsCard from "@/components/AnalyticsCard.vue";
import ExpiryModal from "@/components/ExpiryModal.vue";

import {
  ShoppingCart,
  IndianRupee,
  TrendingUp,
  Package,
  Clock,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  LineChart,
} from "lucide-vue-next";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const purchaseStore = usePurchaseStore();
const salesStore = useSalesStore();
const stockStore = useStockStore();

const loadingCharts = ref(false);
const selectedYear = ref(new Date().getFullYear());
const showExpiryModal = ref(false);
const lastUpdated = ref(new Date().toLocaleTimeString());

const chartData = ref({
  purchasesVsSales: null,
  monthlySales: null,
});

const chartOptions = {
  bar: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return context.dataset.label + ": ₹" + context.parsed.y.toFixed(2);
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return "₹" + value.toLocaleString();
          },
        },
      },
    },
  },
  line: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return "Sales: ₹" + context.parsed.y.toFixed(2);
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return "₹" + value.toLocaleString();
          },
        },
      },
    },
    elements: {
      line: {
        tension: 0.4,
      },
    },
  },
};

// Computed properties
const profitTrend = computed(() => {
  // Simple trend calculation - in real app, compare with previous period
  const profit = stockStore.totalProfit;
  if (profit > 0) {
    return { isUp: true, value: 12.5 };
  } else if (profit < 0) {
    return { isUp: false, value: 8.3 };
  }
  return null;
});

const recentPurchases = computed(() => {
  return purchaseStore.purchases
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);
});

const recentSales = computed(() => {
  return salesStore.sales
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);
});

const expiringItems = computed(() => {
  return purchaseStore.expiringSoon;
});

const availableYears = computed(() => {
  const years = new Set();
  const currentYear = new Date().getFullYear();

  salesStore.sales.forEach((sale) => {
    years.add(new Date(sale.date).getFullYear());
  });

  purchaseStore.purchases.forEach((purchase) => {
    years.add(new Date(purchase.date).getFullYear());
  });

  years.add(currentYear);
  return Array.from(years).sort((a, b) => b - a);
});

// Methods
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const preparePurchasesVsSalesChart = () => {
  const monthlyData = {};

  // Aggregate purchases by month
  purchaseStore.purchases.forEach((purchase) => {
    const date = new Date(purchase.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { purchases: 0, sales: 0 };
    }

    monthlyData[monthKey].purchases +=
      purchase.quantity * purchase.purchasePrice;
  });

  // Aggregate sales by month
  salesStore.sales.forEach((sale) => {
    const date = new Date(sale.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { purchases: 0, sales: 0 };
    }

    monthlyData[monthKey].sales += sale.quantity * sale.salePrice;
  });

  const sortedMonths = Object.keys(monthlyData).sort().slice(-6); // Last 6 months

  chartData.value.purchasesVsSales = {
    labels: sortedMonths.map((month) => {
      const [year, monthNum] = month.split("-");
      return new Date(year, monthNum - 1).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
    }),
    datasets: [
      {
        label: "Purchases",
        data: sortedMonths.map((month) => monthlyData[month].purchases),
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
      {
        label: "Sales",
        data: sortedMonths.map((month) => monthlyData[month].sales),
        backgroundColor: "rgba(34, 197, 94, 0.8)",
        borderColor: "rgba(34, 197, 94, 1)",
        borderWidth: 1,
      },
    ],
  };
};

const prepareMonthlySalesChart = () => {
  const monthlySales = salesStore.getMonthlySales;

  const months = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];
  const monthLabels = months.map((month) => {
    return new Date(selectedYear.value, parseInt(month) - 1).toLocaleDateString(
      "en-US",
      { month: "short" },
    );
  });

  const salesData = months.map((month) => {
    const monthKey = `${selectedYear.value}-${month}`;
    return monthlySales[monthKey] || 0;
  });

  chartData.value.monthlySales = {
    labels: monthLabels,
    datasets: [
      {
        label: "Monthly Sales",
        data: salesData,
        borderColor: "rgba(34, 197, 94, 1)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };
};

const refreshCharts = async () => {
  loadingCharts.value = true;
  try {
    await Promise.all([
      purchaseStore.fetchPurchases(),
      salesStore.fetchSales(),
    ]);
    preparePurchasesVsSalesChart();
    prepareMonthlySalesChart();
    lastUpdated.value = new Date().toLocaleTimeString();
  } catch (error) {
    console.error("Failed to refresh charts:", error);
  } finally {
    loadingCharts.value = false;
  }
};

const updateMonthlyChart = () => {
  prepareMonthlySalesChart();
};

const checkExpiryItems = () => {
  if (expiringItems.value.length > 0) {
    showExpiryModal.value = true;
  }
};

// Lifecycle
onMounted(async () => {
  try {
    await Promise.all([
      purchaseStore.fetchPurchases(),
      salesStore.fetchSales(),
    ]);

    preparePurchasesVsSalesChart();
    prepareMonthlySalesChart();

    // Check for expiring items after a short delay to allow UI to load
    setTimeout(checkExpiryItems, 1000);
  } catch (error) {
    console.error("Failed to load dashboard data:", error);
  }
});

// Watch for data changes
watch(
  [() => purchaseStore.purchases, () => salesStore.sales],
  () => {
    preparePurchasesVsSalesChart();
    prepareMonthlySalesChart();
  },
  { deep: true },
);
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Backdrop -->
    <div
      class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
      @click="closeModal"
    ></div>

    <!-- Modal -->
    <div class="flex min-h-screen items-center justify-center p-4">
      <div
        class="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden animate-bounce-in"
      >
        <!-- Header -->
        <div class="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="bg-white bg-opacity-20 rounded-full p-2">
                <AlertTriangle class="h-6 w-6" />
              </div>
              <div>
                <h2 class="text-xl font-bold">Expiry Alert</h2>
                <p class="text-sm opacity-90">
                  Items expiring within the next 7 days
                </p>
              </div>
            </div>
            <button
              @click="closeModal"
              class="text-white hover:text-gray-200 transition-colors"
            >
              <X class="h-6 w-6" />
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="p-6">
          <div v-if="expiringItems.length === 0" class="text-center py-8">
            <div class="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
              <CheckCircle class="h-8 w-8 text-green-600" />
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">All Good!</h3>
            <p class="text-gray-600">
              No items are expiring within the next 7 days.
            </p>
          </div>

          <div v-else class="space-y-4">
            <!-- Summary -->
            <div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div class="flex items-center space-x-3">
                <AlertTriangle class="h-5 w-5 text-orange-600" />
                <div>
                  <p class="text-sm font-medium text-orange-900">
                    {{ expiringItems.length }} product(s) expiring soon
                  </p>
                  <p class="text-xs text-orange-700">
                    Total quantity: {{ totalExpiringQuantity }} units
                  </p>
                </div>
              </div>
            </div>

            <!-- Items List -->
            <div class="max-h-96 overflow-y-auto space-y-3">
              <div
                v-for="item in expiringItems"
                :key="item.id"
                class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <h4 class="font-medium text-gray-900">
                      {{ item.productName }}
                    </h4>
                    <div
                      class="mt-1 flex items-center space-x-4 text-sm text-gray-600"
                    >
                      <div class="flex items-center space-x-1">
                        <Package class="h-4 w-4" />
                        <span>Qty: {{ item.quantity }}</span>
                      </div>
                      <div class="flex items-center space-x-1">
                        <Calendar class="h-4 w-4" />
                        <span>Expiry: {{ formatDate(item.expiryDate) }}</span>
                      </div>
                      <div class="flex items-center space-x-1">
                        <IndianRupee class="h-4 w-4" />
                        <span>Price: ₹{{ item.purchasePrice }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Urgency indicator -->
                  <div class="flex flex-col items-end space-y-2">
                    <div
                      :class="[
                        'px-3 py-1 rounded-full text-xs font-medium',
                        getUrgencyClass(item.expiryDate),
                      ]"
                    >
                      {{ getUrgencyText(item.expiryDate) }}
                    </div>
                    <div class="text-xs text-gray-500">
                      {{ getDaysUntilExpiry(item.expiryDate) }} days left
                    </div>
                  </div>
                </div>

                <!-- Progress bar for time remaining -->
                <div class="mt-3">
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div
                      :class="[
                        'h-2 rounded-full transition-all duration-300',
                        getProgressBarColor(item.expiryDate),
                      ]"
                      :style="{ width: `${getTimeProgress(item.expiryDate)}%` }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div
              class="flex justify-end space-x-3 pt-4 border-t border-gray-200"
            >
              <button @click="exportExpiryList" class="btn btn-secondary">
                <Download class="h-4 w-4 mr-2" />
                Export List
              </button>
              <button @click="closeModal" class="btn btn-primary">
                Acknowledge
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import {
  AlertTriangle,
  X,
  CheckCircle,
  Package,
  Calendar,
  IndianRupee,
  Download,
} from "lucide-vue-next";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  expiringItems: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["close"]);

const totalExpiringQuantity = computed(() => {
  return props.expiringItems.reduce((total, item) => total + item.quantity, 0);
});

const closeModal = () => {
  emit("close");
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getDaysUntilExpiry = (dateString) => {
  const today = new Date();
  const expiryDate = new Date(dateString);
  const diffTime = expiryDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

const getUrgencyClass = (dateString) => {
  const days = getDaysUntilExpiry(dateString);
  if (days <= 2) return "bg-red-100 text-red-800";
  if (days <= 5) return "bg-orange-100 text-orange-800";
  return "bg-yellow-100 text-yellow-800";
};

const getUrgencyText = (dateString) => {
  const days = getDaysUntilExpiry(dateString);
  if (days <= 2) return "Critical";
  if (days <= 5) return "Urgent";
  return "Soon";
};

const getProgressBarColor = (dateString) => {
  const days = getDaysUntilExpiry(dateString);
  if (days <= 2) return "bg-red-500";
  if (days <= 5) return "bg-orange-500";
  return "bg-yellow-500";
};

const getTimeProgress = (dateString) => {
  const days = getDaysUntilExpiry(dateString);
  return Math.max(0, Math.min(100, (days / 7) * 100));
};

const exportExpiryList = () => {
  const csvContent = [
    ["Product Name", "Quantity", "Expiry Date", "Days Left", "Purchase Price"],
    ...props.expiringItems.map((item) => [
      item.productName,
      item.quantity,
      formatDate(item.expiryDate),
      getDaysUntilExpiry(item.expiryDate),
      item.purchasePrice,
    ]),
  ]
    .map((row) => row.join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `expiry-alert-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);

  window.showToast("Expiry list exported successfully", "success");
};
</script>

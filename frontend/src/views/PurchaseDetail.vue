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
          <h1 class="text-2xl font-bold text-gray-900">Purchase Details</h1>
          <p class="text-gray-600">Purchase ID: #{{ purchase?.id }}</p>
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <button
          @click="editPurchase"
          class="btn btn-primary flex items-center space-x-2"
        >
          <Edit class="h-4 w-4" />
          <span>Edit</span>
        </button>
        <button
          @click="deletePurchase"
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
      <span class="ml-2 text-gray-600">Loading purchase details...</span>
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

    <!-- Purchase Details -->
    <div v-else-if="purchase" class="space-y-6">
      <!-- Basic Purchase Information -->
      <div class="card">
        <div class="flex items-center space-x-3 mb-6">
          <div class="bg-blue-100 rounded-lg p-3">
            <FileText class="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900">
              Purchase Information
            </h2>
            <p class="text-gray-600">Basic purchase details</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Bill Number</label
            >
            <p class="font-medium text-gray-900">
              {{ purchase.billNo || "N/A" }}
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Bill Date</label
            >
            <p class="font-medium text-gray-900">
              {{ formatDate(purchase.billDate) }}
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Agency</label
            >
            <p class="font-medium text-gray-900">
              {{ purchase.agencyName || "N/A" }}
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Total Amount</label
            >
            <p class="font-bold text-lg text-blue-600">
              ₹{{ (purchase.billTotal || purchase.total || 0).toFixed(2) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Bill Image Section -->
      <div v-if="purchase.billImage" class="card">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center space-x-3">
            <div class="bg-green-100 rounded-lg p-3">
              <ImageIcon class="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-900">Bill Image</h2>
              <p class="text-gray-600">Purchase bill document</p>
            </div>
          </div>
          <button
            @click="editBillImage"
            class="btn btn-secondary flex items-center space-x-2"
          >
            <Edit class="h-4 w-4" />
            <span>Update Image</span>
          </button>
        </div>

        <div class="space-y-4">
          <div class="border rounded-lg p-4 bg-gray-50">
            <div class="relative inline-block">
              <!-- Image display -->
              <div
                v-if="purchase.billImage.startsWith('data:')"
                class="relative"
              >
                <img
                  :src="purchase.billImage"
                  alt="Bill image"
                  class="max-w-full h-auto max-h-96 rounded-lg shadow-md cursor-pointer"
                  @click="openImageModal(purchase.billImage)"
                />
                <div class="absolute top-2 right-2 flex space-x-2">
                  <button
                    @click="openImageModal(purchase.billImage)"
                    class="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 shadow-lg"
                    title="View Full Size"
                  >
                    <Eye class="h-4 w-4" />
                  </button>
                  <button
                    @click="downloadImage(purchase.billImage, purchase.billNo)"
                    class="bg-green-500 text-white rounded-full p-2 hover:bg-green-600 shadow-lg"
                    title="Download"
                  >
                    <Download class="h-4 w-4" />
                  </button>
                </div>
              </div>

              <!-- PDF display -->
              <div
                v-else-if="purchase.billImage.startsWith('PDF:')"
                class="flex items-center space-x-4 p-4 bg-yellow-50 rounded-lg"
              >
                <FileText class="h-8 w-8 text-yellow-600" />
                <div>
                  <p class="font-medium text-gray-900">
                    {{ purchase.billImage.replace("PDF: ", "") }}
                  </p>
                  <p class="text-sm text-gray-500">PDF document</p>
                </div>
                <button
                  class="btn btn-primary"
                  @click="downloadPDF(purchase.billImage)"
                >
                  <Download class="h-4 w-4 mr-2" />
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Purchase Items Table -->
      <div class="card">
        <div class="flex items-center space-x-3 mb-6">
          <div class="bg-purple-100 rounded-lg p-3">
            <Package class="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900">Purchase Items</h2>
            <p class="text-gray-600">
              {{ getItemsCount(purchase) }} item(s) in this purchase
            </p>
          </div>
        </div>

        <!-- Items Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Sr No
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Product Name
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  HSN
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Batch No
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Expiry
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Quantity
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Rate
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  GST %
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Amount
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(item, index) in getItemsList(purchase)" :key="index">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ item.srNo || index + 1 }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                >
                  {{ item.productName }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ item.hsn || "-" }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ item.batchNo || "-" }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span v-if="item.exp" :class="getExpiryClass(item.exp)">{{
                    formatDate(item.exp)
                  }}</span>
                  <span v-else>-</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ item.tQty || item.quantity || 0 }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₹{{ (item.rate || item.purchasePrice || 0).toFixed(2) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ item.gst || 0 }}%
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                >
                  ₹{{ (item.amount || item.tQty * item.rate || 0).toFixed(2) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Items Summary -->
        <div class="mt-6 pt-6 border-t border-gray-200">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="text-center p-4 bg-blue-50 rounded-lg">
              <p class="text-sm text-blue-600 font-medium">Total Items</p>
              <p class="text-2xl font-bold text-blue-900">
                {{ getItemsCount(purchase) }}
              </p>
            </div>
            <div class="text-center p-4 bg-green-50 rounded-lg">
              <p class="text-sm text-green-600 font-medium">Total Quantity</p>
              <p class="text-2xl font-bold text-green-900">
                {{ getTotalQuantity(purchase) }}
              </p>
            </div>
            <div class="text-center p-4 bg-purple-50 rounded-lg">
              <p class="text-sm text-purple-600 font-medium">Total Amount</p>
              <p class="text-2xl font-bold text-purple-900">
                ₹{{ (purchase.billTotal || purchase.total || 0).toFixed(2) }}
              </p>
            </div>
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
              <span class="text-sm text-gray-600">Total Purchased</span>
              <span class="font-medium text-green-600"
                >+{{ purchase.quantity || getTotalQuantity(purchase) }}</span
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
              @click="createSale"
              class="btn btn-success w-full flex items-center justify-center space-x-2"
            >
              <IndianRupee class="h-4 w-4" />
              <span>Create Sale</span>
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

        <!-- Related Sales -->
        <div class="card">
          <h3 class="font-semibold text-gray-900 mb-4">Related Sales</h3>
          <div class="space-y-2">
            <div
              v-for="sale in relatedSales"
              :key="sale.id"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
              @click="viewSaleDetail(sale.id)"
            >
              <div>
                <p class="font-medium text-gray-900">
                  {{ sale.quantity }} units
                </p>
                <p class="text-xs text-gray-500">{{ formatDate(sale.date) }}</p>
              </div>
              <div class="text-right">
                <p class="font-medium text-gray-900">
                  ₹{{ (sale.total || 0).toFixed(2) }}
                </p>
                <ChevronRight class="h-4 w-4 text-gray-400 inline" />
              </div>
            </div>
            <div
              v-if="relatedSales.length === 0"
              class="text-center text-gray-500 py-4"
            >
              <p class="text-sm">No related sales found</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Edit Modal -->
    <div v-if="showImageEditModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div
        class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0"
      >
        <div
          class="fixed inset-0 transition-opacity"
          @click="cancelImageUpdate"
        >
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        >
          <div class="bg-white px-6 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="mb-4">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                Update Bill Image
              </h3>
              <p class="mt-1 text-sm text-gray-500">
                Replace the current bill image with a new one
              </p>
            </div>

            <!-- Current Image Preview -->
            <div v-if="selectedImage" class="mb-6">
              <h4 class="text-sm font-medium text-gray-700 mb-2">
                Current Image:
              </h4>
              <div class="border rounded-lg p-4 bg-gray-50">
                <div v-if="selectedImage.startsWith('data:')" class="relative">
                  <img
                    :src="selectedImage"
                    alt="Current bill image"
                    class="max-w-full h-auto max-h-48 rounded-lg"
                  />
                </div>
                <div
                  v-else-if="selectedImage.startsWith('PDF:')"
                  class="flex items-center space-x-4 p-4 bg-yellow-50 rounded-lg"
                >
                  <FileText class="h-8 w-8 text-yellow-600" />
                  <div>
                    <p class="font-medium text-gray-900">
                      {{ selectedImage.replace("PDF: ", "") }}
                    </p>
                    <p class="text-sm text-gray-500">PDF document</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Upload Section -->
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Choose New Image</label
                >
                <input
                  type="file"
                  accept="image/*,.pdf"
                  @change="handleImageUpdate"
                  ref="imageFileInput"
                  class="input w-full"
                />
                <p class="text-xs text-gray-500 mt-2">
                  Supported formats: JPG, PNG, PDF. Max file size: 5MB
                </p>
              </div>

              <!-- New Image Preview -->
              <div
                v-if="selectedImage && selectedImage !== purchase.billImage"
                class="mt-4"
              >
                <h4 class="text-sm font-medium text-gray-700 mb-2">
                  New Image Preview:
                </h4>
                <div class="border rounded-lg p-4 bg-blue-50">
                  <div
                    v-if="selectedImage.startsWith('data:')"
                    class="relative"
                  >
                    <img
                      :src="selectedImage"
                      alt="New bill image"
                      class="max-w-full h-auto max-h-48 rounded-lg"
                    />
                  </div>
                  <div
                    v-else-if="selectedImage.startsWith('PDF:')"
                    class="flex items-center space-x-4 p-4 bg-yellow-50 rounded-lg"
                  >
                    <FileText class="h-8 w-8 text-yellow-600" />
                    <div>
                      <p class="font-medium text-gray-900">
                        {{ selectedImage.replace("PDF: ", "") }}
                      </p>
                      <p class="text-sm text-gray-500">PDF document</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Actions -->
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              @click="saveImageUpdate"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Update Image
            </button>
            <button
              type="button"
              @click="removeImage"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Remove
            </button>
            <button
              type="button"
              @click="cancelImageUpdate"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
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
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePurchaseStore } from "@/stores/purchaseStore";
import { useSalesStore } from "@/stores/salesStore";
import { useStockStore } from "@/stores/stockStore";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Package,
  Calendar,
  TrendingUp,
  ShoppingCart,
  IndianRupee,
  Printer,
  ChevronRight,
  AlertCircle,
  ImageIcon,
  Eye,
  Download,
  FileText,
} from "lucide-vue-next";

const route = useRoute();
const router = useRouter();
const purchaseStore = usePurchaseStore();
const salesStore = useSalesStore();
const stockStore = useStockStore();

const loading = ref(true);
const error = ref(null);
const showImageEditModal = ref(false);
const selectedImage = ref("");
const imageFileInput = ref(null);

const purchase = computed(() => {
  return purchaseStore.getPurchaseById(route.params.id);
});

const currentStock = computed(() => {
  if (!purchase.value || !stockStore.stocks) return 0;
  const stock = stockStore.stocks.find(
    (s) =>
      s.productName.toLowerCase() === purchase.value.productName?.toLowerCase(),
  );
  return stock?.availableStock || 0;
});

const relatedSales = computed(() => {
  if (!purchase.value || !salesStore.sales) return [];
  return salesStore.sales
    .filter(
      (sale) =>
        sale.productName?.toLowerCase() ===
        purchase.value.productName?.toLowerCase(),
    )
    .slice(0, 5);
});

const stockValue = computed(() => {
  return currentStock.value * (purchase.value?.purchasePrice || 0);
});

// Helper functions for items handling
const getItemsCount = (purchase) => {
  if (purchase.items && purchase.items.length > 0) {
    return purchase.items.length;
  }
  return 1; // Single item
};

const getItemsList = (purchase) => {
  if (purchase.items && purchase.items.length > 0) {
    return purchase.items;
  }
  // Return single item as array for consistent table rendering
  return [
    {
      srNo: 1,
      productName: purchase.productName,
      hsn: purchase.hsn || "",
      batchNo: purchase.batchNo || "",
      exp: purchase.expiryDate || purchase.exp,
      tQty: purchase.quantity,
      rate: purchase.purchasePrice,
      gst: purchase.gst || 0,
      amount: purchase.total || purchase.quantity * purchase.purchasePrice,
    },
  ];
};

const getTotalQuantity = (purchase) => {
  if (purchase.items && purchase.items.length > 0) {
    return purchase.items.reduce((total, item) => total + (item.tQty || 0), 0);
  }
  return purchase.quantity || 0;
};

const getExpiryClass = (expiryDate) => {
  if (!expiryDate) return "";
  const daysUntilExpiry = Math.ceil(
    (new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24),
  );

  if (daysUntilExpiry <= 0) return "text-red-600 font-bold";
  if (daysUntilExpiry <= 30) return "text-yellow-600 font-medium";
  return "text-green-600";
};

const formatDate = (date) => {
  if (!date) return "N/A";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
};

const viewPurchaseDetail = (purchaseId) => {
  router.push(`/purchase/${purchaseId}`);
};

const viewSaleDetail = (saleId) => {
  router.push(`/sales/${saleId}`);
};

const createSale = () => {
  router.push("/sales");
  sessionStorage.setItem("prefillProduct", purchase.value.productName);
};

const viewStock = () => {
  router.push(`/stocks/${encodeURIComponent(purchase.value.productName)}`);
};

const printDetails = () => {
  window.print();
};

const editPurchase = () => {
  // Store the purchase ID for editing
  sessionStorage.setItem("editPurchaseId", purchase.value.id);
  router.push("/purchase");
};

const editBillImage = () => {
  showImageEditModal.value = true;
  selectedImage.value = purchase.value.billImage;
};

const handleImageUpdate = (event) => {
  const file = event.target.files[0];
  if (file) {
    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.type)) {
      alert("Only JPG, PNG, and PDF files are allowed");
      return;
    }

    // For images, convert to base64 for preview
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        selectedImage.value = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      // For PDFs, just store the file info
      selectedImage.value = `PDF: ${file.name}`;
    }
  }
};

const removeImage = () => {
  selectedImage.value = "";
  if (imageFileInput.value) {
    imageFileInput.value.value = "";
  }
};

const saveImageUpdate = async () => {
  try {
    // Update the purchase with new image
    const updatedPurchase = {
      ...purchase.value,
      billImage: selectedImage.value,
    };

    await purchaseStore.updatePurchase(purchase.value.id, updatedPurchase);
    showImageEditModal.value = false;

    // Show success message
    alert("Bill image updated successfully!");
  } catch (error) {
    console.error("Failed to update bill image:", error);
    alert("Failed to update bill image. Please try again.");
  }
};

const cancelImageUpdate = () => {
  showImageEditModal.value = false;
  selectedImage.value = purchase.value.billImage; // Reset to original
};

const openImageModal = (imageSrc) => {
  const modal = document.createElement("div");
  modal.className =
    "fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4";
  modal.onclick = () => modal.remove();

  const img = document.createElement("img");
  img.src = imageSrc;
  img.className = "max-w-full max-h-full object-contain rounded-lg";

  modal.appendChild(img);
  document.body.appendChild(modal);
};

const downloadImage = (imageSrc, billNo) => {
  const link = document.createElement("a");
  link.href = imageSrc;
  link.download = `bill-${billNo || "purchase"}-${new Date().toISOString().split("T")[0]}.jpg`;
  link.click();
};

const downloadPDF = (pdfInfo) => {
  const fileName = pdfInfo.replace("PDF: ", "");
  alert(`PDF download would start for: ${fileName}`);
};

onMounted(async () => {
  try {
    await Promise.all([
      purchaseStore.fetchPurchases(),
      salesStore.fetchSales(),
      stockStore.refreshStock(),
    ]);

    if (!purchase.value) {
      error.value = "Purchase not found";
    }
  } catch (err) {
    error.value = "Failed to load purchase details";
    console.error("Error loading purchase details:", err);
  } finally {
    loading.value = false;
  }
});
</script>

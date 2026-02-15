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
            <p class="text-2xl font-bold text-gray-900">
              {{ purchaseStore.purchases.length }}
            </p>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="flex items-center">
          <div class="p-3 bg-green-100 rounded-lg">
            <IndianRupee class="h-6 w-6 text-green-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Amount</p>
            <p class="text-2xl font-bold text-gray-900">
              ₹{{ totalPurchaseAmount.toFixed(2) }}
            </p>
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
            <Search
              class="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
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
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Bill No
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Bill Date
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Agency
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Items
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Bill Total
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Bill Image
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="purchase in filteredPurchases"
              :key="purchase.id"
              class="hover:bg-gray-50 cursor-pointer"
              @click="viewPurchaseDetail(purchase)"
            >
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
              >
                {{ purchase.billNo }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ purchase.billDate }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ purchase.agencyName }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ purchase.items?.length || 0 }} items
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ₹{{ purchase.billTotal?.toFixed(2) || "0.00" }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div
                  v-if="purchase.billImage"
                  class="flex items-center space-x-2"
                >
                  <ImageIcon class="h-4 w-4 text-green-500" />
                  <span class="text-xs text-green-600 font-medium">
                    {{
                      purchase.billImage.startsWith("data:") ? "Image" : "PDF"
                    }}
                  </span>
                </div>
                <span v-else class="text-xs text-gray-400">No image</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  @click.stop="editPurchase(purchase)"
                  class="text-indigo-600 hover:text-indigo-900 mr-3"
                >
                  Edit
                </button>
                <button
                  @click.stop="deletePurchase(purchase)"
                  class="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Purchase Modal -->
    <div v-if="showAddModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div
        class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0"
      >
        <div class="fixed inset-0 transition-opacity" @click="closeModal">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-7xl sm:w-full"
        >
          <form @submit.prevent="savePurchase">
            <div
              class="bg-white px-6 pt-5 pb-4 sm:p-8 sm:pb-4 max-h-screen overflow-y-auto"
            >
              <div class="mb-6">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  {{ editingPurchase ? "Edit Purchase" : "Add New Purchase" }}
                </h3>
                <p class="mt-1 text-sm text-gray-500">
                  {{
                    editingPurchase
                      ? "Update purchase order information"
                      : "Create a new purchase order"
                  }}
                </p>
              </div>

              <!-- Basic Information -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <!-- Agency Selection -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2"
                    >Agency Name *</label
                  >
                  <select
                    v-model="formData.agencyId"
                    class="input w-full px-3 py-2"
                    required
                    style="min-height: 40px; font-size: 14px"
                  >
                    <option value="">Select Agency</option>
                    <option
                      v-for="agency in agencyStore.agencies"
                      :key="agency.id"
                      :value="agency.id"
                    >
                      {{ agency.name }}
                    </option>
                  </select>
                </div>

                <!-- Bill Number -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2"
                    >Bill No *</label
                  >
                  <input
                    v-model="formData.billNo"
                    type="text"
                    class="input w-full px-3 py-2"
                    placeholder="Enter bill number"
                    required
                    style="min-height: 40px; font-size: 14px"
                  />
                </div>

                <!-- Bill Date -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2"
                    >Bill Date *</label
                  >
                  <input
                    v-model="formData.billDate"
                    type="date"
                    class="input w-full px-3 py-2"
                    required
                    style="min-height: 40px; font-size: 14px"
                  />
                </div>
              </div>

              <!-- Bill Image Section -->
              <div class="border-t pt-6">
                <div class="mb-4">
                  <h4 class="text-md font-medium text-gray-900">Bill Image</h4>
                  <p class="text-sm text-gray-500">
                    Upload or update purchase bill image
                  </p>
                </div>

                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2"
                      >Upload Bill Image</label
                    >
                    <div class="flex items-center space-x-4">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        @change="handleImageUpload"
                        ref="fileInput"
                        class="hidden"
                      />
                      <button
                        type="button"
                        @click="$refs.fileInput.click()"
                        class="btn btn-secondary"
                      >
                        <Upload class="h-4 w-4 mr-2" />
                        Choose Image
                      </button>
                      <button
                        v-if="formData.billImage"
                        type="button"
                        @click="removeImage"
                        class="btn btn-danger"
                      >
                        <X class="h-4 w-4 mr-2" />
                        Remove
                      </button>
                    </div>
                    <p class="text-xs text-gray-500 mt-2">
                      Supported formats: JPG, PNG, PDF. Max file size: 5MB
                    </p>
                  </div>

                  <!-- Image Preview -->
                  <div v-if="formData.billImage" class="mt-4">
                    <div class="border rounded-lg p-4 bg-gray-50">
                      <h4 class="text-sm font-medium text-gray-700 mb-2">
                        Preview:
                      </h4>
                      <div class="relative inline-block">
                        <img
                          v-if="formData.billImage.startsWith('data:')"
                          :src="formData.billImage"
                          alt="Bill preview"
                          class="max-w-full h-auto max-h-48 rounded-lg shadow-md"
                        />
                        <div
                          v-else-if="formData.billImage.startsWith('PDF:')"
                          class="flex items-center space-x-4 p-4 bg-yellow-50 rounded-lg"
                        >
                          <FileText class="h-8 w-8 text-yellow-600" />
                          <div>
                            <p class="font-medium text-gray-900">
                              {{ formData.billImage.replace("PDF: ", "") }}
                            </p>
                            <p class="text-sm text-gray-500">PDF document</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          @click="removeImage"
                          class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X class="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
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

                <div class="overflow-x-auto rounded-lg border border-gray-200">
                  <table class="min-w-[1300px] w-full table-fixed text-sm">
                    <thead class="bg-gray-50">
                      <tr class="whitespace-nowrap text-xs text-gray-600">
                        <th class="px-3 py-2 w-16">Sr</th>
                        <th class="px-3 py-2 w-24">HSN</th>
                        <th class="px-3 py-2 w-56">Product</th>
                        <th class="px-3 py-2 w-24">Pack</th>
                        <th class="px-3 py-2 w-36">Mfg</th>
                        <th class="px-3 py-2 w-20">Qty</th>
                        <th class="px-3 py-2 w-20">Free</th>
                        <th class="px-3 py-2 w-24">MRP</th>
                        <th class="px-3 py-2 w-28">Batch</th>
                        <th class="px-3 py-2 w-32">Exp</th>
                        <th class="px-3 py-2 w-24">Rate</th>
                        <th class="px-3 py-2 w-24">Disc%</th>
                        <th class="px-3 py-2 w-28">Taxable</th>
                        <th class="px-3 py-2 w-20">GST%</th>
                        <th class="px-3 py-2 w-32">Amount</th>
                        <th class="px-3 py-2 w-16 text-center">Act</th>
                      </tr>
                    </thead>

                    <tbody class="bg-white divide-y">
                      <tr
                        v-for="(item, index) in formData.items"
                        :key="index"
                        class="hover:bg-gray-50 whitespace-nowrap"
                      >
                        <td class="px-2 py-2">
                          <input
                            v-model.number="item.srNo"
                            type="number"
                            class="w-full border rounded px-2 py-1 text-xs"
                          />
                        </td>

                        <td class="px-2 py-2">
                          <input
                            v-model="item.hsn"
                            class="w-full border rounded px-2 py-1 text-xs"
                          />
                        </td>

                        <td class="px-2 py-2">
                          <input
                            v-model="item.productName"
                            class="w-full border rounded px-2 py-1 text-xs"
                          />
                        </td>

                        <td class="px-2 py-2">
                          <input
                            v-model="item.pack"
                            class="w-full border rounded px-2 py-1 text-xs"
                          />
                        </td>

                        <td class="px-2 py-2">
                          <input
                            v-model="item.mfg"
                            class="w-full border rounded px-2 py-1 text-xs"
                          />
                        </td>

                        <td class="px-2 py-2">
                          <input
                            v-model.number="item.tQty"
                            type="number"
                            @input="calculateItemAmount(item)"
                            class="w-full border rounded px-2 py-1 text-xs text-right"
                          />
                        </td>

                        <td class="px-2 py-2">
                          <input
                            v-model.number="item.freeQty"
                            type="number"
                            class="w-full border rounded px-2 py-1 text-xs text-right"
                          />
                        </td>

                        <td class="px-2 py-2">
                          <input
                            v-model.number="item.mrp"
                            type="number"
                            class="w-full border rounded px-2 py-1 text-xs text-right"
                          />
                        </td>

                        <td class="px-2 py-2">
                          <input
                            v-model="item.batchNo"
                            class="w-full border rounded px-2 py-1 text-xs"
                          />
                        </td>

                        <td class="px-2 py-2">
                          <input
                            v-model="item.exp"
                            type="date"
                            class="w-full border rounded px-2 py-1 text-xs"
                          />
                        </td>

                        <td class="px-2 py-2">
                          <input
                            v-model.number="item.rate"
                            type="number"
                            @input="calculateItemAmount(item)"
                            class="w-full border rounded px-2 py-1 text-xs text-right"
                          />
                        </td>

                        <td class="px-2 py-2">
                          <input
                            v-model.number="item.discount"
                            type="number"
                            @input="calculateItemAmount(item)"
                            class="w-full border rounded px-2 py-1 text-xs text-right"
                          />
                        </td>

                        <td class="px-2 py-2">
                          <input
                            :value="item.taxable.toFixed(2)"
                            readonly
                            class="w-full bg-gray-100 border rounded px-2 py-1 text-xs text-right"
                          />
                        </td>

                        <td class="px-2 py-2">
                          <select
                            v-model.number="item.gst"
                            @change="calculateItemAmount(item)"
                            class="w-full border rounded px-2 py-1 text-xs"
                          >
                            <option :value="0">0%</option>
                            <option :value="5">5%</option>
                            <option :value="12">12%</option>
                            <option :value="18">18%</option>
                            <option :value="28">28%</option>
                          </select>
                        </td>

                        <td class="px-2 py-2">
                          <input
                            :value="item.amount.toFixed(2)"
                            readonly
                            class="w-full bg-gray-100 border rounded px-2 py-1 text-xs text-right font-medium"
                          />
                        </td>

                        <td class="px-2 py-2 text-center">
                          <button
                            type="button"
                            @click="removeItem(index)"
                            :disabled="formData.items.length === 1"
                            class="text-red-600 hover:text-red-800 text-sm"
                          >
                            ✕
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
                    <p class="text-2xl font-bold text-gray-900">
                      ₹{{ billTotal.toFixed(2) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"
            >
              <button type="submit" class="btn btn-primary w-full sm:w-auto">
                {{ editingPurchase ? "Update Purchase" : "Create Purchase" }}
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
      <div
        class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0"
      >
        <div class="fixed inset-0 transition-opacity" @click="cancelDelete">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        >
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div
                class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
              >
                <Trash2 class="h-6 w-6 text-red-600" />
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  Delete Purchase Order
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Are you sure you want to delete purchase order
                    {{ deleteConfirmation.billNo }}? This action cannot be
                    undone.
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
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { usePurchaseStore } from "@/stores/purchaseStore";
import { useAgencyStore } from "@/stores/agencyStore";
import {
  Plus,
  ShoppingCart,
  IndianRupee,
  Package,
  Search,
  Trash2,
  ImageIcon,
  Upload,
  X,
  FileText,
} from "lucide-vue-next";

const router = useRouter();
const purchaseStore = usePurchaseStore();
const agencyStore = useAgencyStore();

const showAddModal = ref(false);
const editingPurchase = ref(null);
const deleteConfirmation = ref(null);
const searchQuery = ref("");

const formData = ref({
  agencyId: "",
  billNo: "",
  billDate: new Date().toISOString().split("T")[0],
  billImage: "",
  items: [
    {
      srNo: 1,
      hsn: "",
      productName: "",
      pack: "",
      mfg: "",
      tQty: 0,
      freeQty: 0,
      mrp: 0,
      batchNo: "",
      exp: "",
      rate: 0,
      discount: 0,
      taxable: 0,
      gst: 18,
      amount: 0,
    },
  ],
});

const filteredPurchases = computed(() => {
  if (!searchQuery.value) return purchaseStore.purchases;
  const query = searchQuery.value.toLowerCase();
  return purchaseStore.purchases.filter(
    (purchase) =>
      purchase.billNo?.toLowerCase().includes(query) ||
      purchase.agencyName?.toLowerCase().includes(query),
  );
});

const totalPurchaseAmount = computed(() => {
  return purchaseStore.purchases.reduce(
    (total, purchase) => total + (purchase.billTotal || 0),
    0,
  );
});

const totalQuantity = computed(() => {
  return purchaseStore.purchases.reduce((total, purchase) => {
    const itemsTotal =
      purchase.items?.reduce(
        (itemTotal, item) => itemTotal + (item.tQty || 0),
        0,
      ) || 0;
    return total + itemsTotal;
  }, 0);
});

const billTotal = computed(() => {
  return formData.value.items.reduce((total, item) => total + item.amount, 0);
});

const addItem = () => {
  const nextSrNo = formData.value.items.length + 1;
  formData.value.items.push({
    srNo: nextSrNo,
    hsn: "",
    productName: "",
    pack: "",
    mfg: "",
    tQty: 0,
    freeQty: 0,
    mrp: 0,
    batchNo: "",
    exp: "",
    rate: 0,
    discount: 0,
    taxable: 0,
    gst: 18,
    amount: 0,
  });
};

const removeItem = (index) => {
  if (formData.value.items.length > 1) {
    formData.value.items.splice(index, 1);
    // Re-calculate Sr No
    formData.value.items.forEach((item, idx) => {
      item.srNo = idx + 1;
    });
  }
};

const calculateItemAmount = (item) => {
  const taxableValue = item.tQty * item.rate;
  const discountAmount = (taxableValue * item.discount) / 100;
  item.taxable = taxableValue - discountAmount;
  const gstAmount = (item.taxable * item.gst) / 100;
  item.amount = item.taxable + gstAmount;
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      event.target.value = "";
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
      event.target.value = "";
      return;
    }

    // For images, convert to base64 for preview
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        formData.value.billImage = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      // For PDFs, just store the file info
      formData.value.billImage = `PDF: ${file.name}`;
    }
  }
};

const removeImage = () => {
  formData.value.billImage = "";
  // Clear the file input
  const fileInput = document.querySelector('input[type="file"]');
  if (fileInput) {
    fileInput.value = "";
  }
};

const openAddModal = () => {
  router.push("/purchase/add");
};

const closeModal = () => {
  showAddModal.value = false;
  editingPurchase.value = null;
};

const savePurchase = async () => {
  try {
    const purchaseData = {
      ...formData.value,
      agencyName:
        agencyStore.getAgencyById(formData.value.agencyId)?.name || "",
      billTotal: billTotal.value,
      date: new Date().toISOString(),
    };

    if (editingPurchase.value) {
      await purchaseStore.updatePurchase(
        editingPurchase.value.id,
        purchaseData,
      );
    } else {
      await purchaseStore.addPurchase(purchaseData);
    }
    closeModal();
  } catch (error) {
    console.error("Failed to save purchase:", error);
  }
};

const editPurchase = (purchase) => {
  editingPurchase.value = purchase;
  formData.value = {
    agencyId: purchase.agencyId,
    billNo: purchase.billNo,
    billDate: purchase.billDate,
    billImage: purchase.billImage || "",
    items: [...(purchase.items || [])],
  };
  showAddModal.value = true;
};

const deletePurchase = (purchase) => {
  deleteConfirmation.value = purchase;
};

const confirmDelete = async () => {
  try {
    await purchaseStore.deletePurchase(deleteConfirmation.value.id);
    cancelDelete();
  } catch (error) {
    console.error("Failed to delete purchase:", error);
  }
};

const cancelDelete = () => {
  deleteConfirmation.value = null;
};

const viewPurchaseDetail = (purchase) => {
  router.push(`/purchase/${purchase.id}`);
};

onMounted(() => {
  purchaseStore.fetchPurchases();
  agencyStore.fetchAgencies();

  // Check if we're editing a purchase
  const editPurchaseId = sessionStorage.getItem("editPurchaseId");
  if (editPurchaseId) {
    const purchase = purchaseStore.getPurchaseById(parseInt(editPurchaseId));
    if (purchase) {
      editPurchase(purchase);
    }
    // Clear the edit ID from sessionStorage
    sessionStorage.removeItem("editPurchaseId");
  }
});
</script>

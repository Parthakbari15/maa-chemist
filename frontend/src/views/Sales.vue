<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Header with Maa Chemist Details -->
    <div class="card bg-gradient-to-r from-purple-600 to-blue-600 text-white">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold">Maa Chemist</h1>
          <p class="text-purple-100">Medical & General Store</p>
          <div class="mt-2 text-sm text-purple-100">
            <p>Shop No. 12, Main Market, City - 110001</p>
            <p>Phone: +91-9876543210 | Email: info@maachemist.com</p>
            <p>GSTIN: 07AAAPM1234C1ZY | DL No: 20/ABC/1234</p>
          </div>
        </div>
        <div class="text-right">
          <h2 class="text-xl font-semibold">Sales Management</h2>
          <p class="text-purple-100">Manage sales and billing</p>
          <button
            @click="openAddModal"
            class="btn btn-white flex items-center space-x-2 mt-4"
          >
            <Plus class="h-4 w-4" />
            <span class="text-purple-600">New Sale</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="card">
        <div class="flex items-center">
          <div class="p-3 bg-green-100 rounded-lg">
            <TrendingUp class="h-6 w-6 text-green-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Sales</p>
            <p class="text-2xl font-bold text-gray-900">
              {{ salesStore.sales.length }}
            </p>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="flex items-center">
          <div class="p-3 bg-blue-100 rounded-lg">
            <IndianRupee class="h-6 w-6 text-blue-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Revenue</p>
            <p class="text-2xl font-bold text-gray-900">
              ₹{{ totalSalesAmount.toFixed(2) }}
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
            <p class="text-sm font-medium text-gray-600">Items Sold</p>
            <p class="text-2xl font-bold text-gray-900">{{ totalItemsSold }}</p>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="flex items-center">
          <div class="p-3 bg-orange-100 rounded-lg">
            <ShoppingCart class="h-6 w-6 text-orange-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Avg Sale</p>
            <p class="text-2xl font-bold text-gray-900">
              ₹{{ averageSale.toFixed(2) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Sales Table -->
    <div class="card">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-semibold text-gray-900">Sales Bills</h2>
        <div class="flex items-center space-x-2">
          <div class="relative">
            <Search
              class="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search sales..."
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
                Customer
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Mobile
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Payment
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Items
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Grand Total
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
              v-for="sale in filteredSales"
              :key="sale.id"
              class="hover:bg-gray-50 cursor-pointer"
              @click="viewSaleDetail(sale)"
            >
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
              >
                {{ sale.billNo }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ sale.billDate }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ sale.toName || "N/A" }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div class="flex items-center space-x-1">
                  <Phone class="h-3 w-3 text-gray-400" />
                  <span>{{ sale.toMobile || "N/A" }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span
                  class="px-2 py-1 text-xs rounded-full"
                  :class="
                    sale.paymentType === 'Cash'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  "
                >
                  {{ sale.paymentType }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ sale.items?.length || 0 }} items
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ₹{{ sale.grandTotal?.toFixed(2) || "0.00" }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  @click.stop="editSale(sale)"
                  class="text-indigo-600 hover:text-indigo-900 mr-3"
                >
                  Edit
                </button>
                <button
                  @click.stop="deleteSale(sale)"
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

    <!-- Add/Edit Sale Modal -->
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
          <form @submit.prevent="saveSale">
            <div
              class="bg-white px-6 pt-5 pb-4 sm:p-8 sm:pb-4 max-h-screen overflow-y-auto"
            >
              <!-- Maa Chemist Header -->
              <div
                class="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-lg mb-6"
              >
                <h3 class="text-xl font-bold">Maa Chemist</h3>
                <p class="text-purple-100 text-sm">
                  Medical & General Store | GSTIN: 07AAAPM1234C1ZY
                </p>
              </div>

              <div class="mb-6">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  {{ editingSale ? "Edit Sale" : "Create New Sale" }}
                </h3>
                <p class="mt-1 text-sm text-gray-500">
                  {{
                    editingSale
                      ? "Update sale information"
                      : "Create a new sale bill"
                  }}
                </p>
              </div>

              <!-- Customer Information -->
              <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <!-- To Name -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2"
                    >Customer Name *</label
                  >
                  <input
                    v-model="formData.toName"
                    type="text"
                    class="input w-full px-3 py-2"
                    placeholder="Enter customer name"
                    required
                    style="min-height: 40px; font-size: 14px"
                  />
                </div>

                <!-- To Mobile Number -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2"
                    >Mobile Number *</label
                  >
                  <input
                    v-model="formData.toMobile"
                    type="tel"
                    class="input w-full px-3 py-2"
                    placeholder="+91-9876543210"
                    pattern="[0-9]{10}"
                    maxlength="10"
                    required
                    style="min-height: 40px; font-size: 14px"
                  />
                </div>

                <!-- Payment Type -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2"
                    >Payment Type *</label
                  >
                  <select
                    v-model="formData.paymentType"
                    class="input w-full px-3 py-2"
                    required
                    style="min-height: 40px; font-size: 14px"
                  >
                    <option value="">Select Payment Type</option>
                    <option value="Cash">Cash</option>
                    <option value="DBT">DBT (Direct Bank Transfer)</option>
                  </select>
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

              <!-- Bill Number (Auto Generated) -->
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Bill Number</label
                >
                <input
                  :value="formData.billNo"
                  type="text"
                  class="input w-full bg-gray-50 px-3 py-2"
                  readonly
                  style="min-height: 40px; font-size: 14px"
                />
              </div>

              <!-- Items Section -->
              <div class="border-t pt-6">
                <div class="flex items-center justify-between mb-4">
                  <h4 class="text-md font-medium text-gray-900">Bill Items</h4>
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
                        <th
                          class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                        >
                          HSN
                        </th>
                        <th
                          class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                        >
                          Product
                        </th>
                        <th
                          class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                        >
                          Pack
                        </th>
                        <th
                          class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                        >
                          Mfg
                        </th>
                        <th
                          class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                        >
                          Qty
                        </th>
                        <th
                          class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                        >
                          MRP
                        </th>
                        <th
                          class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                        >
                          Batch
                        </th>
                        <th
                          class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                        >
                          Exp.
                        </th>
                        <th
                          class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                        >
                          Disc %
                        </th>
                        <th
                          class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                        >
                          Amount
                        </th>
                        <th
                          class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-for="(item, index) in formData.items" :key="index">
                        <td class="px-2 py-2">
                          <input
                            v-model="item.hsn"
                            type="text"
                            class="input text-sm w-full px-3 py-2"
                            placeholder="3004"
                            style="min-height: 40px; font-size: 14px"
                          />
                        </td>
                        <td
                          class="px-2 py-2 relative"
                          style="position: relative"
                        >
                          <input
                            v-model="item.product"
                            type="text"
                            class="input text-sm w-full px-3 py-2"
                            placeholder="Product name"
                            required
                            @input="autoFillProductDetails(item, $event)"
                            @keydown="handleKeyNavigation($event, item)"
                            @blur="hideSuggestions"
                            @focus="autoFillProductDetails(item, $event)"
                            style="
                              position: relative;
                              z-index: 10;
                              min-height: 40px;
                              font-size: 14px;
                            "
                          />

                          <!-- Suggestions Dropdown -->
                          <div
                            v-if="
                              showSuggestions && filteredSuggestions.length > 0
                            "
                            class="fixed bg-white border border-gray-300 rounded-lg shadow-lg"
                            :style="{
                              zIndex: 9999,
                              top: dropdownPosition.top + 'px',
                              left: dropdownPosition.left + 'px',
                              minWidth: '250px',
                              maxHeight: '200px',
                              overflowY: 'auto',
                            }"
                          >
                            <div
                              class="flex items-center justify-between px-2 py-1 border-b bg-gray-50"
                            >
                              <span class="text-xs text-gray-500">
                                Suggestions ({{ filteredSuggestions.length }})
                              </span>
                              <button
                                @click="hideSuggestions"
                                class="text-gray-400 hover:text-gray-600 p-1 rounded"
                                title="Close suggestions"
                              >
                                <svg
                                  class="h-3 w-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12"
                                  ></path>
                                </svg>
                              </button>
                            </div>
                            <div
                              v-for="(suggestion, index) in filteredSuggestions"
                              :key="suggestion"
                              :class="[
                                'px-3 py-2 cursor-pointer text-sm border-b border-gray-100 last:border-b-0',
                                index === activeSuggestionIndex
                                  ? 'bg-blue-50 text-blue-700'
                                  : 'hover:bg-gray-50',
                              ]"
                              @mousedown="selectSuggestion(suggestion)"
                            >
                              <div class="flex items-center justify-between">
                                <span>{{ suggestion }}</span>
                                <span class="text-xs text-gray-400">
                                  {{ getSuggestionSource(suggestion) }}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td class="px-2 py-2">
                          <input
                            v-model="item.pack"
                            type="text"
                            class="input text-sm w-full px-3 py-2"
                            placeholder="10x10"
                            style="min-height: 40px; font-size: 14px"
                          />
                        </td>
                        <td class="px-2 py-2">
                          <input
                            v-model="item.mfg"
                            type="text"
                            class="input text-sm w-full px-3 py-2"
                            placeholder="Manufacturer"
                            style="min-height: 40px; font-size: 14px"
                          />
                        </td>
                        <td class="px-2 py-2">
                          <input
                            v-model.number="item.qty"
                            type="number"
                            class="input text-sm w-full px-3 py-2"
                            min="1"
                            @input="calculateItemAmount(item)"
                            required
                            style="min-height: 40px; font-size: 14px"
                          />
                        </td>
                        <td class="px-2 py-2">
                          <input
                            v-model.number="item.mrp"
                            type="number"
                            step="0.01"
                            class="input text-sm w-full px-3 py-2"
                            min="0"
                            @input="calculateItemAmount(item)"
                            required
                            style="min-height: 40px; font-size: 14px"
                          />
                        </td>
                        <td class="px-2 py-2">
                          <input
                            v-model="item.batch"
                            type="text"
                            class="input text-sm w-full px-3 py-2"
                            placeholder="B001"
                            style="min-height: 40px; font-size: 14px"
                          />
                        </td>
                        <td class="px-2 py-2">
                          <input
                            v-model="item.exp"
                            type="date"
                            class="input text-sm w-full px-3 py-2"
                            style="min-height: 40px; font-size: 14px"
                          />
                        </td>
                        <td class="px-2 py-2">
                          <input
                            v-model.number="item.disc"
                            type="number"
                            step="0.01"
                            class="input text-sm w-full px-3 py-2"
                            min="0"
                            @input="calculateItemAmount(item)"
                            style="min-height: 40px; font-size: 14px"
                          />
                        </td>
                        <td class="px-2 py-2">
                          <input
                            :value="item.amount.toFixed(2)"
                            type="text"
                            class="input text-sm w-full bg-gray-50 px-3 py-2"
                            readonly
                            style="min-height: 40px; font-size: 14px"
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

              <!-- Grand Total -->
              <div class="border-t pt-4 mt-6">
                <div class="flex justify-end">
                  <div class="text-right">
                    <p class="text-sm text-gray-600">Grand Total</p>
                    <p class="text-3xl font-bold text-gray-900">
                      ₹{{ grandTotal.toFixed(2) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"
            >
              <button type="submit" class="btn btn-primary w-full sm:w-auto">
                {{ editingSale ? "Update Sale" : "Create Sale" }}
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
                  Delete Sale Bill
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Are you sure you want to delete sale bill
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
import { useSalesStore } from "@/stores/salesStore";
import { usePurchaseStore } from "@/stores/purchaseStore";
import { useStockStore } from "@/stores/stockStore";
import {
  Plus,
  ShoppingCart,
  IndianRupee,
  Package,
  Search,
  Trash2,
  TrendingUp,
  Phone,
} from "lucide-vue-next";

const router = useRouter();
const salesStore = useSalesStore();
const purchaseStore = usePurchaseStore();
const stockStore = useStockStore();

const showAddModal = ref(false);
const editingSale = ref(null);
const deleteConfirmation = ref(null);
const searchQuery = ref("");
const showSuggestions = ref(false);
const activeSuggestionIndex = ref(0);
const currentEditingItemIndex = ref(null);
const dropdownPosition = ref({ top: 0, left: 0 });

const formData = ref({
  toName: "",
  toMobile: "",
  paymentType: "",
  billNo: "",
  billDate: new Date().toISOString().split("T")[0],
  items: [
    {
      hsn: "",
      product: "",
      pack: "",
      mfg: "",
      qty: 1,
      mrp: 0,
      batch: "",
      exp: "",
      disc: 0,
      amount: 0,
    },
  ],
});

const filteredSales = computed(() => {
  if (!searchQuery.value) return salesStore.sales;
  const query = searchQuery.value.toLowerCase();
  return salesStore.sales.filter(
    (sale) =>
      sale.billNo?.toLowerCase().includes(query) ||
      sale.toName?.toLowerCase().includes(query) ||
      sale.toMobile?.toLowerCase().includes(query),
  );
});

const totalSalesAmount = computed(() => {
  return salesStore.sales.reduce(
    (total, sale) => total + (sale.grandTotal || 0),
    0,
  );
});

const totalItemsSold = computed(() => {
  return salesStore.sales.reduce((total, sale) => {
    const itemsTotal =
      sale.items?.reduce((itemTotal, item) => itemTotal + (item.qty || 0), 0) ||
      0;
    return total + itemsTotal;
  }, 0);
});

const averageSale = computed(() => {
  if (salesStore.sales.length === 0) return 0;
  return totalSalesAmount.value / salesStore.sales.length;
});

const grandTotal = computed(() => {
  return formData.value.items.reduce((total, item) => total + item.amount, 0);
});

// Product suggestions
const productSuggestions = computed(() => {
  const products = new Set();

  // Get products from purchases
  purchaseStore.purchases.forEach((purchase) => {
    // Simple purchase structure
    if (purchase.productName) {
      products.add(purchase.productName);
    }

    // Complex purchase structure
    if (purchase.items) {
      purchase.items.forEach((item) => {
        if (item.productName) {
          products.add(item.productName);
        }
      });
    }
  });

  // Get products from existing sales
  salesStore.sales.forEach((sale) => {
    // Simple sale structure
    if (sale.productName) {
      products.add(sale.productName);
    }

    // Complex sale structure
    if (sale.items) {
      sale.items.forEach((item) => {
        if (item.product) {
          products.add(item.product);
        }
      });
    }
  });

  const productList = Array.from(products).sort();
  console.log("Product suggestions loaded:", {
    total: productList.length,
    products: productList.slice(0, 10), // Show first 10
  });

  return productList;
});

const getNextBillNumber = () => {
  const lastBill = salesStore.sales.reduce((latest, sale) => {
    const billNum = parseInt(sale.billNo?.split("/")[1] || "0");
    return billNum > latest ? billNum : latest;
  }, 134);
  return `CA-T/${lastBill + 1}`;
};

const addItem = () => {
  formData.value.items.push({
    hsn: "",
    product: "",
    pack: "",
    mfg: "",
    qty: 1,
    mrp: 0,
    batch: "",
    exp: "",
    disc: 0,
    amount: 0,
  });
};

const removeItem = (index) => {
  if (formData.value.items.length > 1) {
    formData.value.items.splice(index, 1);
  }
};

const calculateItemAmount = (item) => {
  const baseAmount = item.qty * item.mrp;
  const discountAmount = (baseAmount * item.disc) / 100;
  item.amount = baseAmount - discountAmount;
};

// Auto-fill functionality
const findExistingProduct = (productName) => {
  if (!productName || productName.length < 2) return null;

  // Search in purchases (both simple and complex structures)
  const purchases = purchaseStore.purchases;

  for (const purchase of purchases) {
    // Check simple purchase structure
    if (
      purchase.productName &&
      purchase.productName.toLowerCase() === productName.toLowerCase()
    ) {
      return {
        productName: purchase.productName,
        purchasePrice: purchase.purchasePrice,
        expiryDate: purchase.expiryDate,
        hsn: "",
        pack: "",
        mfg: "",
        mrp: purchase.purchasePrice * 1.2, // Add 20% margin for MRP
        batch: "",
        exp: purchase.expiryDate,
      };
    }

    // Check complex purchase structure with items
    if (purchase.items && purchase.items.length > 0) {
      for (const item of purchase.items) {
        if (
          item.productName &&
          item.productName.toLowerCase() === productName.toLowerCase()
        ) {
          return {
            productName: item.productName,
            purchasePrice: item.rate,
            expiryDate: item.exp,
            hsn: item.hsn || "",
            pack: item.pack || "",
            mfg: item.mfg || "",
            mrp: item.mrp || 0,
            batch: item.batchNo || "",
            exp: item.exp || "",
          };
        }
      }
    }
  }

  // Also check in existing sales
  const sales = salesStore.sales;
  for (const sale of sales) {
    if (
      sale.productName &&
      sale.productName.toLowerCase() === productName.toLowerCase()
    ) {
      return {
        productName: sale.productName,
        purchasePrice: sale.salePrice * 0.8, // Estimate purchase price
        expiryDate: "",
        hsn: "",
        pack: "",
        mfg: "",
        mrp: sale.salePrice,
        batch: "",
        exp: "",
      };
    }

    // Check complex sale structure with items
    if (sale.items && sale.items.length > 0) {
      for (const item of sale.items) {
        if (
          item.product &&
          item.product.toLowerCase() === productName.toLowerCase()
        ) {
          return {
            productName: item.product,
            purchasePrice: item.mrp * 0.8, // Estimate purchase price
            expiryDate: item.exp || "",
            hsn: item.hsn || "",
            pack: item.pack || "",
            mfg: item.mfg || "",
            mrp: item.mrp || 0,
            batch: item.batch || "",
            exp: item.exp || "",
          };
        }
      }
    }
  }

  return null;
};

const autoFillProductDetails = (item, event) => {
  if (!item || !item.product || item.product.length < 2) {
    showSuggestions.value = false;
    return;
  }

  // Show suggestions after 2-3 characters
  if (item.product.length >= 2) {
    if (formData.value?.items) {
      currentEditingItemIndex.value = formData.value.items.indexOf(item);
      showSuggestions.value = true;
      activeSuggestionIndex.value = 0;

      // Calculate dropdown position
      if (event && event.target) {
        const rect = event.target.getBoundingClientRect();
        dropdownPosition.value = {
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
        };
      }

      console.log("Suggestions should show:", {
        product: item.product,
        index: currentEditingItemIndex.value,
        suggestions: filteredSuggestions.value.length,
        position: dropdownPosition.value,
      });
    }
  }

  const existingProduct = findExistingProduct(item.product);
  if (existingProduct) {
    item.hsn = existingProduct.hsn;
    item.pack = existingProduct.pack;
    item.mfg = existingProduct.mfg;
    item.mrp = existingProduct.mrp;
    item.batch = existingProduct.batch;
    item.exp = existingProduct.exp;

    // Calculate amount with the new MRP
    calculateItemAmount(item);
  }
};

// Suggestion handling methods
const filteredSuggestions = computed(() => {
  if (currentEditingItemIndex.value === null || !formData.value?.items) {
    console.log("No suggestions - index null or no items");
    return [];
  }

  const currentItem = formData.value.items[currentEditingItemIndex.value];
  if (!currentItem?.product) {
    console.log("No suggestions - no current item product");
    return [];
  }

  const query = currentItem.product.toLowerCase();
  const suggestions = productSuggestions.value
    .filter((product) => product.toLowerCase().includes(query))
    .slice(0, 8); // Limit to 8 suggestions

  console.log("Filtered suggestions:", {
    query,
    totalProducts: productSuggestions.value.length,
    filtered: suggestions.length,
    products: suggestions,
  });

  return suggestions;
});

const selectSuggestion = (product) => {
  if (currentEditingItemIndex.value !== null && formData.value?.items) {
    const item = formData.value.items[currentEditingItemIndex.value];
    if (item) {
      item.product = product;
      autoFillProductDetails(item);
      showSuggestions.value = false;
      currentEditingItemIndex.value = null;
    }
  }
};

const handleKeyNavigation = (event, item) => {
  if (!showSuggestions.value) return;

  const suggestions = filteredSuggestions.value;
  if (event.key === "ArrowDown") {
    event.preventDefault();
    activeSuggestionIndex.value =
      (activeSuggestionIndex.value + 1) % suggestions.length;
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    activeSuggestionIndex.value =
      activeSuggestionIndex.value === 0
        ? suggestions.length - 1
        : activeSuggestionIndex.value - 1;
  } else if (event.key === "Enter") {
    event.preventDefault();
    if (suggestions[activeSuggestionIndex.value]) {
      selectSuggestion(suggestions[activeSuggestionIndex.value]);
    }
  } else if (event.key === "Escape") {
    showSuggestions.value = false;
    currentEditingItemIndex.value = null;
  }
};

const hideSuggestions = () => {
  setTimeout(() => {
    showSuggestions.value = false;
    currentEditingItemIndex.value = null;
  }, 200); // Small delay to allow click on suggestions
};

const getSuggestionSource = (productName) => {
  // Check if it's from purchases
  for (const purchase of purchaseStore.purchases) {
    if (purchase.productName === productName) return "Purchase";
    if (purchase.items?.some((item) => item.productName === productName))
      return "Purchase";
  }

  // Check if it's from sales
  for (const sale of salesStore.sales) {
    if (sale.productName === productName) return "Sale";
    if (sale.items?.some((item) => item.product === productName)) return "Sale";
  }

  return "History";
};

const openAddModal = () => {
  router.push("/sales/add");
};

const closeModal = () => {
  showAddModal.value = false;
  editingSale.value = null;
};

const saveSale = async () => {
  try {
    const saleData = {
      ...formData.value,
      grandTotal: grandTotal.value,
      date: new Date().toISOString(),
    };

    if (editingSale.value) {
      await salesStore.updateSale(editingSale.value.id, saleData);
    } else {
      await salesStore.addSale(saleData);
    }
    closeModal();
  } catch (error) {
    console.error("Failed to save sale:", error);
  }
};

const editSale = (sale) => {
  editingSale.value = sale;
  formData.value = {
    toName: sale.toName,
    toMobile: sale.toMobile,
    paymentType: sale.paymentType,
    billNo: sale.billNo,
    billDate: sale.billDate,
    items: [...(sale.items || [])],
  };
  showAddModal.value = true;
};

const deleteSale = (sale) => {
  deleteConfirmation.value = sale;
};

const confirmDelete = async () => {
  try {
    await salesStore.deleteSale(deleteConfirmation.value.id);
    cancelDelete();
  } catch (error) {
    console.error("Failed to delete sale:", error);
  }
};

const cancelDelete = () => {
  deleteConfirmation.value = null;
};

const viewSaleDetail = (sale) => {
  router.push(`/sales/${sale.id}`);
};

onMounted(async () => {
  await Promise.all([salesStore.fetchSales(), purchaseStore.fetchPurchases()]);

  // Check if we're editing a sale
  const editSaleId = sessionStorage.getItem("editSaleId");
  if (editSaleId) {
    const sale = salesStore.getSaleById(parseInt(editSaleId));
    if (sale) {
      editSale(sale);
    }
    // Clear the edit ID from sessionStorage
    sessionStorage.removeItem("editSaleId");
  }
});
</script>

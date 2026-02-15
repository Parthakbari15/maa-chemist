<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Create New Purchase</h1>
        <p class="text-gray-600">Add a new purchase transaction</p>
      </div>
      <button @click="goBack" class="btn btn-secondary">
        Back to Purchases
      </button>
    </div>

    <!-- Form -->
    <form @submit.prevent="savePurchase" class="space-y-8">
      <!-- Basic Info -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold mb-6">Purchase Information</h3>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label class="block text-sm font-medium mb-2">Agency *</label>
            <select v-model="formData.agencyId" class="input w-full" required>
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

          <div>
            <label class="block text-sm font-medium mb-2">Bill No *</label>
            <input v-model="formData.billNo" class="input w-full" required />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Bill Date *</label>
            <input
              type="date"
              v-model="formData.billDate"
              class="input w-full"
              required
            />
          </div>
        </div>
      </div>

      <!-- Bill Image Section -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold mb-6">Bill Image</h3>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2"
              >Upload Bill Image</label
            >
            <div class="flex items-center space-x-4">
              <input
                type="file"
                accept="image/*"
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
              <h4 class="text-sm font-medium text-gray-700 mb-2">Preview:</h4>
              <div class="relative inline-block">
                <img
                  :src="formData.billImage"
                  alt="Bill preview"
                  class="max-w-full h-auto max-h-64 rounded-lg shadow-md"
                />
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
      <div class="card p-6 space-y-6">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold">Items</h3>
          <button type="button" @click="addItem" class="btn btn-secondary">
            Add Item
          </button>
        </div>

        <!-- Item Cards -->
        <div
          v-for="(item, index) in formData.items"
          :key="index"
          class="border rounded-lg p-4 space-y-4 bg-gray-50"
        >
          <!-- Row 1 -->
          <div class="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div>
              <label class="label">Sr</label>
              <input v-model.number="item.srNo" type="number" class="input" />
            </div>

            <div>
              <label class="label">HSN</label>
              <input v-model="item.hsn" class="input" />
            </div>

            <div class="md:col-span-2">
              <label class="label">Product Name *</label>
              <input v-model="item.productName" class="input" required />
            </div>

            <div>
              <label class="label">Pack</label>
              <input v-model="item.pack" class="input" />
            </div>

            <div>
              <label class="label">Mfg</label>
              <input v-model="item.mfg" class="input" />
            </div>
          </div>

          <!-- Row 2 -->
          <div class="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div>
              <label class="label">Qty</label>
              <input
                v-model.number="item.tQty"
                type="number"
                @input="calculateItemAmount(item)"
                class="input text-right"
              />
            </div>

            <div>
              <label class="label">Free</label>
              <input
                v-model.number="item.freeQty"
                type="number"
                class="input text-right"
              />
            </div>

            <div>
              <label class="label">MRP</label>
              <input
                v-model.number="item.mrp"
                type="number"
                class="input text-right"
              />
            </div>

            <div>
              <label class="label">Rate</label>
              <input
                v-model.number="item.rate"
                type="number"
                @input="calculateItemAmount(item)"
                class="input text-right"
              />
            </div>

            <div>
              <label class="label">Disc %</label>
              <input
                v-model.number="item.discount"
                type="number"
                @input="calculateItemAmount(item)"
                class="input text-right"
              />
            </div>

            <div>
              <label class="label">GST %</label>
              <select
                v-model.number="item.gst"
                @change="calculateItemAmount(item)"
                class="input"
              >
                <option :value="0">0%</option>
                <option :value="5">5%</option>
                <option :value="12">12%</option>
                <option :value="18">18%</option>
                <option :value="28">28%</option>
              </select>
            </div>
          </div>

          <!-- Row 3 -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label class="label">Batch</label>
              <input v-model="item.batchNo" class="input" />
            </div>

            <div>
              <label class="label">Expiry</label>
              <input type="date" v-model="item.exp" class="input" />
            </div>

            <div>
              <label class="label">Taxable</label>
              <input
                :value="item.taxable.toFixed(2)"
                readonly
                class="input bg-gray-100 text-right"
              />
            </div>

            <div>
              <label class="label">Amount</label>
              <input
                :value="item.amount.toFixed(2)"
                readonly
                class="input bg-gray-100 text-right font-semibold"
              />
            </div>
          </div>

          <!-- Delete Button -->
          <div class="flex justify-end">
            <button
              type="button"
              @click="removeItem(index)"
              :disabled="formData.items.length === 1"
              class="text-red-600 text-sm hover:text-red-800"
            >
              Remove Item
            </button>
          </div>
        </div>
      </div>

      <!-- Summary -->
      <div class="card p-6 max-w-md ml-auto space-y-3">
        <div class="flex justify-between">
          <span>Subtotal</span>
          <span>₹{{ subtotal.toFixed(2) }}</span>
        </div>
        <div class="flex justify-between">
          <span>Discount</span>
          <span>₹{{ totalDiscount.toFixed(2) }}</span>
        </div>
        <div class="flex justify-between">
          <span>GST</span>
          <span>₹{{ totalGST.toFixed(2) }}</span>
        </div>
        <div class="flex justify-between font-bold text-lg border-t pt-2">
          <span>Total</span>
          <span>₹{{ grandTotal.toFixed(2) }}</span>
        </div>
      </div>

      <div class="flex justify-end">
        <button type="submit" class="btn btn-primary px-6 py-3">
          Create Purchase
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { usePurchaseStore } from "@/stores/purchaseStore";
import { useAgencyStore } from "@/stores/agencyStore";
import { Plus, Trash2, Upload, X } from "lucide-vue-next";

const router = useRouter();
const purchaseStore = usePurchaseStore();
const agencyStore = useAgencyStore();

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
      gst: 0,
      amount: 0,
    },
  ],
});

const grandTotal = computed(() => {
  return formData.value.items.reduce((total, item) => total + item.amount, 0);
});

const subtotal = computed(() => {
  return formData.value.items.reduce((total, item) => {
    return total + item.tQty * item.rate;
  }, 0);
});

const totalDiscount = computed(() => {
  return formData.value.items.reduce((total, item) => {
    const baseAmount = item.tQty * item.rate;
    const discountAmount = (baseAmount * item.discount) / 100;
    return total + discountAmount;
  }, 0);
});

const totalGST = computed(() => {
  return formData.value.items.reduce((total, item) => {
    return total + (item.taxable * item.gst) / 100;
  }, 0);
});

const getNextBillNumber = () => {
  const lastBill = purchaseStore.purchases.reduce((latest, purchase) => {
    const billNum = parseInt(purchase.billNo?.split("/")[1] || "0");
    return billNum > latest ? billNum : latest;
  }, 0);
  return `PO/${lastBill + 1}`;
};

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
    gst: 0,
    amount: 0,
  });
};

const removeItem = (index) => {
  if (formData.value.items.length > 1) {
    formData.value.items.splice(index, 1);
    // Reassign serial numbers
    formData.value.items.forEach((item, idx) => {
      item.srNo = idx + 1;
    });
  }
};

const calculateItemAmount = (item) => {
  const baseAmount = item.tQty * item.rate;
  const discountAmount = (baseAmount * item.discount) / 100;
  item.taxable = baseAmount - discountAmount;
  const gstAmount = (item.taxable * item.gst) / 100;
  item.amount = item.taxable + gstAmount;
};

const formatDate = (date) => {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

const goBack = () => {
  router.push("/purchase");
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
      // For PDFs, just store the file info (in a real app, you'd upload to server)
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

const savePurchase = async () => {
  try {
    const purchaseData = {
      ...formData.value,
      billTotal: grandTotal.value,
      date: new Date().toISOString(),
    };

    // Get agency details
    const agency = agencyStore.getAgencyById(formData.value.agencyId);
    if (agency) {
      purchaseData.agencyName = agency.name;
    }

    await purchaseStore.addPurchase(purchaseData);
    router.push("/purchase");
  } catch (error) {
    console.error("Failed to save purchase:", error);
  }
};

onMounted(async () => {
  await Promise.all([
    purchaseStore.fetchPurchases(),
    agencyStore.fetchAgencies(),
  ]);

  formData.value.billNo = getNextBillNumber();
});
</script>

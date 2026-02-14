import { defineStore } from 'pinia'
import { purchaseAPI } from '@/services/api'

export const usePurchaseStore = defineStore('purchase', {
  state: () => ({
    purchases: [],
    loading: false,
    error: null,
  }),

  getters: {
    totalPurchases: (state) => {
      return state.purchases.reduce((total, purchase) => total + (purchase.billTotal || 0), 0)
    },

    totalQuantity: (state) => {
      return state.purchases.reduce((total, purchase) => {
        const itemsTotal = purchase.items?.reduce((itemTotal, item) => itemTotal + (item.tQty || 0), 0) || 0
        return total + itemsTotal
      }, 0)
    },

    expiringSoon: (state) => {
      const expiringItems = []
      state.purchases.forEach(purchase => {
        purchase.items?.forEach(item => {
          if (item.exp) {
            const expiryDate = new Date(item.exp)
            const today = new Date()
            const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24))
            if (daysUntilExpiry <= 30 && daysUntilExpiry > 0) {
              expiringItems.push({
                productName: item.productName,
                expiryDate: item.exp,
                daysUntilExpiry
              })
            }
          }
        })
      })
      return expiringItems
    },

    getPurchaseById: (state) => (id) => {
      return state.purchases.find(purchase => purchase.id === parseInt(id))
    },

    getPurchaseByProduct: (state) => (productName) => {
      return state.purchases.filter(purchase => 
        purchase.items?.some(item => 
          item.productName.toLowerCase().includes(productName.toLowerCase())
        ) ||
        purchase.productName?.toLowerCase().includes(productName.toLowerCase())
      )
    },

    getPurchasesByProduct: (state) => (productName) => {
      return state.purchases.filter(purchase => 
        purchase.items?.some(item => 
          item.productName.toLowerCase().includes(productName.toLowerCase())
        ) ||
        purchase.productName?.toLowerCase().includes(productName.toLowerCase())
      )
    }
  },

  actions: {
    async fetchPurchases() {
      this.loading = true
      this.error = null
      
      try {
        const response = await purchaseAPI.getAll()
        this.purchases = response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch purchases'
        console.error('Failed to fetch purchases:', error)
      } finally {
        this.loading = false
      }
    },

    async addPurchase(purchaseData) {
      try {
        const response = await purchaseAPI.create(purchaseData)
        this.purchases.push(response.data)
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to add purchase'
        console.error('Failed to add purchase:', error)
        throw error
      }
    },

    async updatePurchase(id, purchaseData) {
      try {
        const response = await purchaseAPI.update(id, purchaseData)
        const index = this.purchases.findIndex(purchase => purchase.id === id)
        if (index !== -1) {
          this.purchases[index] = response.data
        }
        
        window.showToast('Purchase updated successfully', 'success')
        return response.data
      } catch (error) {
        this.error = error.message
        console.error('Failed to update purchase:', error)
        window.showToast('Failed to update purchase', 'error')
        throw error
      } finally {
        this.loading = false
      }
    },

    async deletePurchase(id) {
      this.loading = true
      this.error = null

      try {
        await purchaseAPI.delete(id)
        this.purchases = this.purchases.filter(p => p.id !== parseInt(id))
        window.showToast('Purchase deleted successfully', 'success')
      } catch (error) {
        this.error = error.message
        console.error('Failed to delete purchase:', error)
        window.showToast('Failed to delete purchase', 'error')
        throw error
      } finally {
        this.loading = false
      }
    },

    clearError() {
      this.error = null
    }
  }
})

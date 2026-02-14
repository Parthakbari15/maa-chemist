import { defineStore } from 'pinia'
import { salesAPI } from '@/services/api'

export const useSalesStore = defineStore('sales', {
  state: () => ({
    sales: [],
    loading: false,
    error: null,
  }),

  getters: {
    totalSales: (state) => {
      return state.sales.reduce((total, sale) => total + (sale.grandTotal || 0), 0)
    },

    totalQuantity: (state) => {
      return state.sales.reduce((total, sale) => {
        const itemsTotal = sale.items?.reduce((itemTotal, item) => itemTotal + (item.qty || 0), 0) || 0
        return total + itemsTotal
      }, 0)
    },

    getSalesByProduct: (state) => (productName) => {
      const salesByProduct = []
      state.sales.forEach(sale => {
        let found = false
        
        // Check complex sales with items array
        sale.items?.forEach(item => {
          if (item.product.toLowerCase().includes(productName.toLowerCase())) {
            salesByProduct.push({
              ...sale,
              item: item
            })
            found = true
          }
        })
        
        // Check simple sales structure
        if (!found && sale.productName?.toLowerCase().includes(productName.toLowerCase())) {
          salesByProduct.push(sale)
        }
      })
      return salesByProduct
    },

    getSalesByDateRange: (state) => (startDate, endDate) => {
      return state.sales.filter(sale => {
        const saleDate = new Date(sale.date)
        return saleDate >= new Date(startDate) && saleDate <= new Date(endDate)
      })
    },

    getSaleById: (state) => (id) => {
      return state.sales.find(sale => sale.id === parseInt(id))
    },

    getMonthlySales: (state) => {
      const monthlyData = {}
      
      state.sales.forEach(sale => {
        const date = new Date(sale.date)
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = 0
        }
        
        monthlyData[monthKey] += sale.grandTotal || 0
      })
      
      return monthlyData
    }
  },

  actions: {
    async fetchSales() {
      this.loading = true
      this.error = null
      
      try {
        const response = await salesAPI.getAll()
        this.sales = response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch sales'
        console.error('Failed to fetch sales:', error)
      } finally {
        this.loading = false
      }
    },

    async addSale(saleData) {

      try {
        const response = await salesAPI.create({
          ...saleData,
          date: new Date().toISOString(),
          total: saleData.quantity * saleData.salePrice
        })
        
        this.sales.push(response.data)
        window.showToast('Sale added successfully', 'success')
        return response.data
      } catch (error) {
        this.error = error.message
        console.error('Failed to add sale:', error)
        window.showToast('Failed to add sale', 'error')
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateSale(id, saleData) {
      this.loading = true
      this.error = null

      try {
        const response = await salesAPI.update(id, {
          ...saleData,
          total: saleData.quantity * sale.salePrice
        })
        
        const index = this.sales.findIndex(s => s.id === parseInt(id))
        if (index !== -1) {
          this.sales[index] = { ...this.sales[index], ...response.data }
        }
        
        window.showToast('Sale updated successfully', 'success')
        return response.data
      } catch (error) {
        this.error = error.message
        console.error('Failed to update sale:', error)
        window.showToast('Failed to update sale', 'error')
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteSale(id) {
      this.loading = true
      this.error = null

      try {
        await salesAPI.delete(id)
        this.sales = this.sales.filter(s => s.id !== parseInt(id))
        window.showToast('Sale deleted successfully', 'success')
      } catch (error) {
        this.error = error.message
        console.error('Failed to delete sale:', error)
        window.showToast('Failed to delete sale', 'error')
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

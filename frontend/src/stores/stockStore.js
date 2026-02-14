import { defineStore } from 'pinia'
import { usePurchaseStore } from './purchaseStore'
import { useSalesStore } from './salesStore'

export const useStockStore = defineStore('stock', {
  state: () => ({
    loading: false,
    error: null,
    _stockData: [],
    initialized: false
  }),

  getters: {
    stockData: (state) => {
      try {
        // Prevent circular dependency by checking initialization
        if (state.initialized) {
          return state._stockData
        }

        const purchaseStore = usePurchaseStore()
        const salesStore = useSalesStore()
        
        // Ensure stores are initialized and have data
        if (!purchaseStore?.purchases || !salesStore?.sales) {
          console.warn('Purchase or sales store not initialized')
          return []
        }
        
        const stockMap = new Map()
        
        // Aggregate purchases by product
        purchaseStore.purchases.forEach(purchase => {
          if (purchase.items && Array.isArray(purchase.items)) {
            purchase.items.forEach(item => {
              const productName = item.productName
              if (!stockMap.has(productName)) {
                stockMap.set(productName, {
                  productName,
                  totalPurchased: 0,
                  totalSold: 0,
                  availableStock: 0,
                  purchaseValue: 0,
                  salesValue: 0,
                  expiryDates: []
                })
              }
              
              const stock = stockMap.get(productName)
              stock.totalPurchased += item.tQty || 0
              stock.purchaseValue += (item.tQty || 0) * (item.rate || 0)
              if (item.exp) {
                stock.expiryDates.push(new Date(item.exp))
              }
            })
          }
        })
        
        // Aggregate sales by product
        salesStore.sales.forEach(sale => {
          if (sale.items && Array.isArray(sale.items)) {
            sale.items.forEach(item => {
              const productName = item.product
              if (!stockMap.has(productName)) {
                stockMap.set(productName, {
                  productName,
                  totalPurchased: 0,
                  totalSold: 0,
                  availableStock: 0,
                  purchaseValue: 0,
                  salesValue: 0,
                  expiryDates: []
                })
              }
              
              const stock = stockMap.get(productName)
              stock.totalSold += item.qty || 0
              stock.salesValue += (item.qty || 0) * (item.mrp || 0)
            })
          }
        })
        
        // Calculate available stock and latest expiry date
        const stockArray = Array.from(stockMap.values()).map(stock => {
          stock.availableStock = stock.totalPurchased - stock.totalSold
          stock.latestExpiryDate = stock.expiryDates.length > 0 
            ? new Date(Math.max(...stock.expiryDates))
            : null
          stock.isExpiringSoon = stock.latestExpiryDate ? 
            (new Date(stock.latestExpiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24) <= 7 
            : false
          return stock
        })
        
        const result = stockArray.filter(stock => stock.totalPurchased > 0)
        state._stockData = result
        state.initialized = true
        return result
      } catch (error) {
        console.error('Error calculating stock data:', error)
        return []
      }
    },

    totalStockValue: (state) => {
      try {
        const stockData = state._stockData || []
        return stockData.reduce((total, stock) => {
          const avgPurchasePrice = stock.totalPurchased > 0 ? stock.purchaseValue / stock.totalPurchased : 0
          return total + (stock.availableStock * avgPurchasePrice)
        }, 0)
      } catch (error) {
        console.error('Error calculating total stock value:', error)
        return 0
      }
    },

    totalStockQuantity: (state) => {
      try {
        const stockData = state._stockData || []
        return stockData.reduce((total, stock) => total + stock.availableStock, 0)
      } catch (error) {
        console.error('Error calculating total stock quantity:', error)
        return 0
      }
    },

    lowStockItems: (state) => {
      try {
        const stockData = state._stockData || []
        return stockData.filter(stock => stock.availableStock <= 10 && stock.availableStock > 0)
      } catch (error) {
        console.error('Error calculating low stock items:', error)
        return []
      }
    },

    outOfStockItems: (state) => {
      try {
        const stockData = state._stockData || []
        return stockData.filter(stock => stock.availableStock <= 0)
      } catch (error) {
        console.error('Error calculating out of stock items:', error)
        return []
      }
    },

    expiringStockItems: (state) => {
      try {
        const stockData = state._stockData || []
        return stockData.filter(stock => stock.isExpiringSoon && stock.availableStock > 0)
      } catch (error) {
        console.error('Error calculating expiring stock items:', error)
        return []
      }
    },

    getStockByProduct: (state) => (productName) => {
      try {
        const stockData = state._stockData || []
        return stockData.find(stock => 
          stock.productName.toLowerCase().includes(productName.toLowerCase())
        )
      } catch (error) {
        console.error('Error getting stock by product:', error)
        return null
      }
    },

    totalProfit: (state) => {
      try {
        const purchaseStore = usePurchaseStore()
        const salesStore = useSalesStore()
        
        const totalPurchaseValue = purchaseStore.totalPurchases || 0
        const totalSalesValue = salesStore.totalSales || 0
        
        return totalSalesValue - totalPurchaseValue
      } catch (error) {
        console.error('Error calculating total profit:', error)
        return 0
      }
    }
  },

  actions: {
    refreshStock() {
      // Reset initialization to force recalculation
      this.initialized = false
      this._stockData = []
      this._cache = {}
      // Access stockData getter to trigger recalculation
      this.stockData
    },

    async refreshStockData() {
      this.loading = true
      this.error = null
      
      try {
        const purchaseStore = usePurchaseStore()
        const salesStore = useSalesStore()
        
        await Promise.all([
          purchaseStore.fetchPurchases(),
          salesStore.fetchSales()
        ])
      } catch (error) {
        this.error = error.message
        console.error('Failed to refresh stock:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    checkStockAvailability(productName, quantity) {
      const stock = this.getStockByProduct(productName)
      if (!stock) {
        return { available: false, message: 'Product not found in stock' }
      }
      
      if (stock.availableStock < quantity) {
        return { 
          available: false, 
          message: `Insufficient stock. Available: ${stock.availableStock}, Requested: ${quantity}` 
        }
      }
      
      return { available: true, stock }
    },

    clearError() {
      this.error = null
    }
  }
})

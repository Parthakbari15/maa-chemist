import { defineStore } from 'pinia'
import api from '@/services/api'

export const useAgencyStore = defineStore('agency', {
  state: () => ({
    agencies: [],
    loading: false,
    error: null,
  }),

  getters: {
    totalAgencies: (state) => state.agencies.length,

    getAgencyById: (state) => (id) => {
      return state.agencies.find(agency => agency.id === id)
    },

    getAgencyOptions: (state) => {
      return state.agencies.map(agency => ({
        value: agency.id,
        label: agency.name
      }))
    }
  },

  actions: {
    async fetchAgencies() {
      this.loading = true
      this.error = null
      
      try {
        const response = await api.get('/agencies')
        this.agencies = response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch agencies'
        console.error('Failed to fetch agencies:', error)
      } finally {
        this.loading = false
      }
    },

    async addAgency(agencyData) {
      try {
        const response = await api.post('/agencies', agencyData)
        this.agencies.push(response.data)
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to add agency'
        console.error('Failed to add agency:', error)
        throw error
      }
    },

    async updateAgency(id, agencyData) {
      try {
        const response = await api.put(`/agencies/${id}`, agencyData)
        const index = this.agencies.findIndex(agency => agency.id === id)
        if (index !== -1) {
          this.agencies[index] = response.data
        }
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to update agency'
        console.error('Failed to update agency:', error)
        throw error
      }
    },

    async deleteAgency(id) {
      try {
        await api.delete(`/agencies/${id}`)
        this.agencies = this.agencies.filter(agency => agency.id !== id)
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to delete agency'
        console.error('Failed to delete agency:', error)
        throw error
      }
    }
  }
})

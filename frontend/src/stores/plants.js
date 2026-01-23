import { defineStore } from 'pinia'
import { addMyPlant, deleteMyPlant, getMyPlants, updateMyPlant } from '@/services/plants'

export const usePlantsStore = defineStore('plants', {
  state: () => ({
    plants: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchPlants() {
      this.loading = true
      this.error = null
      try {
        this.plants = await getMyPlants()
      } catch (e) {
        this.error = e.message || 'Failed to fetch plants'
      } finally {
        this.loading = false
      }
    },

    async addPlant(payload) {
      this.error = null
      try {
        const plant = await addMyPlant(payload)
        this.plants = [plant, ...this.plants]
        return plant
      } catch (e) {
        this.error = e.message || 'Failed to add plant'
        throw e
      }
    },

    async updatePlant(id, payload) {
      this.error = null
      try {
        const updated = await updateMyPlant(id, payload)
        this.plants = this.plants.map((p) => (p.id === id ? updated : p))
        return updated
      } catch (e) {
        this.error = e.message || 'Failed to update plant'
        throw e
      }
    },

    async deletePlant(id) {
      this.error = null
      try {
        await deleteMyPlant(id)
        this.plants = this.plants.filter((p) => p.id !== id)
        return true
      } catch (e) {
        this.error = e.message || 'Failed to delete plant'
        throw e
      }
    },
  },
})

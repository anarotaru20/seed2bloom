import { defineStore } from 'pinia'
import * as authApi from '@/services/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('jwt') || '',
    user: JSON.parse(localStorage.getItem('auth_user') || 'null'),
  }),

  getters: {
    isAuthenticated: (s) => !!s.token,
  },

  actions: {
    async login(email, password) {
      const data = await authApi.login(email, password)
      this.token = data?.token || ''
      this.user = data?.user || null
      localStorage.setItem('jwt', this.token)
      localStorage.setItem('auth_user', JSON.stringify(this.user))
      return data
    },

    async register(email, password, profile) {
      const data = await authApi.register(email, password, profile)
      this.token = data?.token || ''
      this.user = data?.user || null
      localStorage.setItem('jwt', this.token)
      localStorage.setItem('auth_user', JSON.stringify(this.user))
      return data
    },

    logout() {
      authApi.logout()
      this.token = ''
      this.user = null
      localStorage.removeItem('jwt')
      localStorage.removeItem('auth_user')
    },
  },
})

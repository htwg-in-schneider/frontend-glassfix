import { defineStore } from 'pinia'

export const useAnfragenFilterStore = defineStore('anfragenFilter', {
  state: () => ({
    category: '',
    status: '',
    period: '',
    username: '',
    requestId: ''
  }),

  actions: {
    setCategory(value) {
      this.category = value
    },

    setStatus(value) {
      this.status = value
    },

    setPeriod(value) {
      this.period = value
    },

    setUsername(value) {
      this.username = value
    },

    setRequestId(value) {
      this.requestId = value
    },

    resetFilter() {
      this.category = ''
      this.status = ''
      this.period = ''
      this.username = ''
      this.requestId = ''
    }
  }
})

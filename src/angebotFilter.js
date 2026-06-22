import { defineStore } from 'pinia'

export const useAngebotFilterStore = defineStore('angebotFilter', {
  state: () => ({
    category: '',
    status: '',
    period: '',
    kunde: '',
    experte: '',
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

    setKunde(value) {
      this.kunde = value
    },

    setExperte(value) {
      this.experte = value
    },

    setRequestId(value) {
      this.requestId = value
    },

    resetFilter() {
      this.category = ''
      this.status = ''
      this.period = ''
      this.kunde = ''
      this.experte = ''
      this.requestId = ''
    }
  }
})
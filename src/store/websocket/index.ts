import { defineStore } from 'pinia'

const useWebSocketStore = defineStore('webSocket', {
  state: () => ({
    msg: ''
  }),
  actions: {

  }
})

export default useWebSocketStore
Component({ 
  methods: { 
    pause() {
      this.triggerEvent('pause')
    },

    stop() {
      this.triggerEvent('stop')
    },

    catchtap() {}
  }
})

Component({
  options: {
    addGlobalClass: true
  },

  methods: {
    hide() {
      this.triggerEvent('hide')
    }
  }
})

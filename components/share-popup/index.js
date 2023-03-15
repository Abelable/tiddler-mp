Component({
  options: {
    addGlobalClass: true
  },

  methods: {
    showPosterModal() {
      this.triggerEvent('showPosterModal')
    },

    hide() {
      this.triggerEvent('hide')
    }
  }
})

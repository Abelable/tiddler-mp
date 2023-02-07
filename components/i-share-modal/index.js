Component({
  properties: {
    show: Boolean,
    desc: String
  },
  
  methods: {
    showPosterModal() {
      this.triggerEvent('showPosterModal')
    }
  }
})
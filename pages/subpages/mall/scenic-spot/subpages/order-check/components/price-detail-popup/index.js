Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    category: String,
    price: Number,
    num: Number
  },

  methods: {
    hide() {
      this.triggerEvent('hide')
    }
  }
})

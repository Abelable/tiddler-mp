Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    name: String,
    price: Number,
    breakfastNum: Number,
    night: Number,
    num: Number
  },

  methods: {
    hide() {
      this.triggerEvent('hide')
    }
  }
})

Component({
  properties: {
    count: {
      type: Number,
      value: 1,
      observer: "setInputWidth"
    }
  },
  data: {
    inputWidth: 60
  },
  methods: {
    add() {
      this.triggerEvent('add')
    },
    reduce() {
      this.triggerEvent('reduce')
    },
    editCount(e) {
      this.triggerEvent('editCount', e.detail.value)
    },
    bindInput(e) {
      this.setInputWidth(e.detail.value)
    },
    setInputWidth(val) {
      let num = val + ''
      this.setData({
        inputWidth: 42 + num.length * 18
      })
    },
    preventBubble() {}
  }
})
Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    item: Object
  },

  data: {
  },

  methods: {
    navTo() {
      wx.navigateTo({
        url: '/pages/index/subpages/strategy/index'
      })
    }
  }
})

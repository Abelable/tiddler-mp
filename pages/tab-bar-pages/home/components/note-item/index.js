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
        url: '/pages/subpages/home/note/index'
      })
    }
  }
})

const { statusBarHeight } = getApp().globalData

Component({ 
  options: {
    addGlobalClass: true
  },
  
  properties: {
    custom: Boolean,
    title: String,
  },

  data: {
    statusBarHeight
  },

  methods: {
    navigateBack() {
      this.triggerEvent('navigateBack')
    },
  }
})

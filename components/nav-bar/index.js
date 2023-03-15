const { statusBarHeight } = getApp().globalData.systemInfo

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

const { statusBarHeight } = getApp().globalData

Component({ 
  options: {
    addGlobalClass: true
  },
  
  properties: {
    title: String
  },

  data: {
    statusBarHeight
  }
})

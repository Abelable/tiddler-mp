import HomeService from '../../../../../../../services/homeService'

Component({ 
  options: {
    addGlobalClass: true
  },

  properties: {
    groupId: String,
  },

  methods: {
    pushRemind() {
      new HomeService().pushLiveStartRemind(this.properties.groupId, () => {
        wx.showToast({
          title: '推送成功',
          icon: 'none'
        })
      })
    },

    hide() {
      this.triggerEvent('hide')
    }
  }
})

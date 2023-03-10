import LiveService from '../../../utils/liveService'

Component({ 
  options: {
    addGlobalClass: true
  },

  properties: {
    groupId: String,
  },

  methods: {
    pushRemind() {
      new LiveService().pushLiveStartRemind(this.properties.groupId, () => {
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

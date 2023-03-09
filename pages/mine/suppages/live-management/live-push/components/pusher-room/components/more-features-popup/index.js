import { storeBindingsBehavior } from 'mobx-miniprogram-bindings'
import { store } from '../../../../../../../store/index'
import HomeService from '../../../../../../../services/homeService'

const homeService = new HomeService()

const featureList = [
  { icon: 'beauty', name: '美颜' },
]

const otherFeatureList = [
  { icon: 'detail', name: '直播详情' },
  { icon: 'comment', name: '评论管理' },
  { icon: 'notice', name: '推送通知' },
  { icon: 'assistant', name: '助手' },
  { icon: 'clear', name: '清空消息' },
  { icon: 'ad', name: '滚动广告' },
  { icon: 'subscribe', name: '提醒订阅' },
  { icon: 'common_words', name: '常用语' }
]

Component({ 
  behaviors: [storeBindingsBehavior],

  storeBindings: {
    store,
    fields: ['devicePosition', 'localMirror', 'muted', 'anonymoused', 'studioInfo'],
  },

  properties: {
    roomInfo: Object,
    trafficPanelVisible: Boolean
  },

  data: {
    featureList,
    otherFeatureList
  },
  
  methods: { 
    click(e) {
      switch (e.currentTarget.dataset.type) {
        case 'reverse':
          store.setRemoteMirror(store.devicePosition === 'front' ? false : true)
          store.setDevicePosition(store.devicePosition === 'front' ? 'back' : 'front')
          store.setLocalMirror('auto')
          break

        case 'beauty': 
          this.triggerEvent('showBeautyPopup')
          break
          
        case 'mirror':
          store.setLocalMirror(store.localMirror === 'auto' ? (store.devicePosition === 'front' ? 'disable' : 'enable') : 'auto')
          store.setRemoteMirror(!store.remoteMirror)
          break

        case 'detail': 
          this.triggerEvent('showDetailPopup')
          break

        case 'mute': 
          store.setMuted(!store.muted)
          break
        
        case 'comment': 
          const { id, title } = this.properties.roomInfo
          wx.navigateTo({
            url: `/pages/subpages/home/live-push/subpages/comment/index?id=${id}&title=${title}`
          })
          break

        case 'notice': 
          this.triggerEvent('showNoticePopup')
          break

        case 'assistant': 
          this.triggerEvent('showAssistantPopup')
          break

        case 'clear':
          wx.showModal({
            title: '确定清空所有消息吗？',
            success: (result) => {
              if(result.confirm){
                homeService.clearRoomChatMsg(this.properties.roomInfo.id)
                store.clearLiveMsgList()
              }
            }
          })
          break

        case 'ad': 
          this.triggerEvent('showAdPopup')
          break

        case 'subscribe': 
          this.triggerEvent('showSubscribePopup')
          break

        case 'anonymous': 
          homeService.toggleAnonymousStatus(this.properties.roomInfo.id, store.anonymoused === 0 ? 1 : 0, () => {
            store.setAnonymoused(store.anonymoused === 0 ? 1 : 0)
          })
          break

        case 'common_words': 
          this.triggerEvent('showCommonWordsPopup')
          break

        case 'file': 
          this.triggerEvent('showFilePopup')
          break
        
        case 'traffic': 
          this.triggerEvent('toggleTrafficPanelVisible')
          break
      }
    },

    hide() {
      this.triggerEvent('hide')
    }
  }
})

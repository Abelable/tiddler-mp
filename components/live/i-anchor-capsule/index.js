import { store } from '../../../../../../store/index'
import BaseService from '../../../../../../services/baseService'

const baseService = new BaseService()

Component({
  properties: {
    roomInfo: Object,
    roomType: {
      type: Number,
      value: 1
    },
    isFollow: Boolean,
  },
  
  methods: {
    follow() {
      const { isFollow, roomInfo } = this.properties
      if (!isFollow) this.setData({ isFollow: true })
      if (isFollow) {
        baseService.subscribeStudio(
          roomInfo.studio_id,
          () => { 
            wx.showToast({ title: '订阅成功', icon: 'none' })
          }
        )
      } else {
        baseService.handleUser({ 
          studio_id: roomInfo.studio_id, 
          user_id: store.userInfo.id, 
          is_focus: 1 
        })
      }
    }
  }
})

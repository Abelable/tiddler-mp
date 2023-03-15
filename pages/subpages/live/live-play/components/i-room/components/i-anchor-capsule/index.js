import { storeBindingsBehavior } from 'mobx-miniprogram-bindings'
import { store } from '../../../../../../../../store/index'
import checkLogin from '../../../../../../../../utils/checkLogin'
import RoomServie from '../../../../utils/roomService'

const roomService = new RoomServie()

Component({
  behaviors: [storeBindingsBehavior],

  storeBindings: {
    store,
    fields: ['fullScreen', 'followStatus', 'audienceCount'],
    actions: ['showModal']
  },

  properties: {
    roomInfo: Object
  },
  
  methods: {
    showAnchorModal() {
      this.showModal('anchor')
    },
    toggleFollow() {
      checkLogin(() => {
        const { roomId, anchorId } = this.properties.roomInfo
        this.data.followStatus ? roomService.subscribeAnchor(anchorId) : roomService.toggleFollowStatus(anchorId, roomId)
      })
    }
  }
})
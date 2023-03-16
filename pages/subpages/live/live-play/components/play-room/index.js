import { storeBindingsBehavior } from 'mobx-miniprogram-bindings'
import { store } from '../../../../../../store/index'
import { checkLogin } from '../../../../../../utils/index'
import RoomService from '../../utils/roomService'

const roomService = new RoomService()
const { statusBarHeight } = getApp().globalData.systemInfo;

Component({
  options: {
    addGlobalClass: true,
  },

  behaviors: [storeBindingsBehavior],

  storeBindings: {
    store,
    fields: ['userInfo', 'srcIniting', 'liveLoading', 'liveBreak', 'definitionIndex', 'fullScreen', 'audienceCount', 'praiseCount', 'goodsList', 'liveCustomMsg', 'maskVisible', 'roomPosterInfo',],
    actions: ['resetRoomData', 'setRoomPosterInfo', 'setFullScreen', 'exitFullScreen',  'setAudienceCount', 'setPraiseCount', 'setLiveMsgList', 'showModal' ]
  },

  properties: {
    roomInfo: Object
  },

  data: {
    statusBarHeight,
    settleIconVisible: false,
    liveEnd: false,                      // 直播结束
    liveDuration: 0,                     // 直播总时长
    manualPraise: false,                 // 是否是手动点赞
    audienceActionTips: '',              // 观众行为（进直播间、下单...）
    showAudienceActionTips: false,       // 控制观众行为弹幕的显示隐藏
    praiseHeartArr: [],                  // 双击爱心
  },

  observers: {
    'liveCustomMsg': function(customMsg) {
      this.handleCustomMsg(customMsg)
    },
    'srcIniting': function(truthy) {
      !truthy && checkLogin(() => { this.joinRoom() }, false)
    },
  },

  detached() {
    checkLogin(() => { this.quitRoom() }, false)
  },

  methods: {
    joinRoom() {
      const { id, groupId } = this.properties.roomInfo
      roomService.getGoodsList(id)
      roomService.getMsgHistory(id)
      getApp().globalData.im.joinGroup(groupId)
    },

    quitRoom() {
      this.resetRoomData() // 重置数据
    },

    handleCustomMsg(customMsg) {
      if (customMsg) {
        const { audienceCount, praiseCount, manualPraise, showAudienceActionTips, liveBreak } = this.data
        const { url, message } = customMsg
        const { show_message, total_time: liveDuration, member_num, praise_count, invite_id, envelope } = message
        
        // 监听用户数量
        if (member_num && member_num > audienceCount) this.setAudienceCount(member_num)
        
        // 监听用户操作
        const audienceActionIndex = audienceActionTipsArr.indexOf(url)
        if (audienceActionIndex !== -1 && !showAudienceActionTips) {
          this.setData({ 
            audienceActionTips: {
              type: audienceActionTypeArr[audienceActionIndex],
              message: show_message
            },
            showAudienceActionTips: true
          })
          setTimeout(() => { 
            this.setData({ showAudienceActionTips: false }) 
          }, 2000)
        }
        
        // 监听点赞
        if (praise_count && praise_count > praiseCount) {
          manualPraise && this.setData({ manualPraise: false })
          this.setPraiseCount(praise_count)
        }

        // 监听直播重连
        url === 'report-openliveroom' && this.setVideoPlayingStatus(true)

        // 监听直播结束
        if (show_message === '房间已被关闭') {
          this.setData({ liveDuration, liveEnd: true })
          liveBreak && this.setData({ liveBreak: false })
        }
      }
    },

    hideSettleIcon() {
      clearTimeout(this.hidesettleIconTimeout)
      this.setData({ settleIconVisible: false })
    },

    dbTap(e) {
      checkLogin(() => {
        const { timeStamp, detail } = e
        if (this.lastTimeStamp) {
          if (timeStamp - this.lastTimeStamp < 300) {
            const { x, y } = detail
            const deg = Math.floor(Math.random() * 60) - 30
            const praiseHeartItem = { 
              style: `top: ${y - 40}px; left: ${x - 40}px; transform: rotate(${deg}deg); animation: float 0.6s linear;`,
              url: 'https://img.ubo.vip/mp/praise-heart.png'
            }
            this.setData({
              [`praiseHeartArr[${this.data.praiseHeartArr.length}]`]: praiseHeartItem
            })
            this.praise()
            if (this.clearPraiseHeartArrTimeout) clearTimeout(this.clearPraiseHeartArrTimeout)
            this.clearPraiseHeartArrTimeout = setTimeout(() => {
              this.setData({ praiseHeartArr: [] })
            }, 2000)
          }
          this.lastTimeStamp = 0
        } else {
          this.lastTimeStamp = timeStamp
        }
      })
    },

    // 点赞
    praise() {
      checkLogin(() => {
        wx.vibrateShort({ type: 'heavy' })
        const { id, anchorId } = this.properties.roomInfo
        if (!this.data.manualPraise) this.setData({ manualPraise: true })
        roomService.praiseHandler(id, anchorId)
      })
    },

    showSharersModal() {
      checkLogin(() => {
        this.showModal('sharers')
      })
    },

    showGoodsModal() {
      roomService.getGoodsList(this.properties.roomInfo.id)
      this.showModal('goods')
    },

    showInputModal() {
      checkLogin(() => {
        this.showModal('input')
      })
    },

    showGiftModal() {
      checkLogin(() => {
        this.showModal('gift')
      })
    },

    showMoreFeaturesModal() {
      checkLogin(() => {
        this.setData({
          fileDisplayingPromptVisible: false
        })
        this.showModal('more-features')
      })
    },

    showShareModal() {
      checkLogin(() => {
        const { id, status, title, anchorId, anchorName, anchorAvatar } = this.properties.roomInfo
        !this.data.roomPosterInfo && this.setPosterInfo(id, status, title, anchorName, anchorAvatar)
        this.data.followStatus && roomService.addIntimacy('day-share-live', anchorId, id)
        this.showModal('share')
      })
    },

    async setPosterInfo(id, status, title, name, anchorAvatar) {
      const { wxacode_pic, room_cover, cover_width, cover_height } = await roomService.getPosterUrl(id) || {}
      const { path: qrCode } = await roomService.getImageInfo(wxacode_pic) || {}
      const roomCover = cover_width <= cover_height ? `${room_cover}?x-oss-process=image/crop,x_0,y_0,w_${cover_width},h_${cover_width}` : `${room_cover}?x-oss-process=image/crop,x_0,y_0,w_${cover_height},h_${cover_height}`
      const { path: cover } = await roomService.getImageInfo(roomCover) || {}
      const { path: avatar } = await roomService.getImageInfo(anchorAvatar.includes('https://m.youboi.com/images/headimg/') ? 'https://img.ubo.vip/mp/default-ubo-icon.png' : anchorAvatar) || {}
      
      this.setRoomPosterInfo({ cover, title, avatar, name, status, qrCode })
    },

    report() {
      checkLogin(() => {
        wx.navigateTo({ url: `/pages/subpages/index/room/subpages/report/index?id=${this.properties.roomInfo.id}` })
      })
    }
  }
})

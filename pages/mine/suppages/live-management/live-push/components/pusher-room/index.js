import { storeBindingsBehavior } from 'mobx-miniprogram-bindings'
import { store } from '../../../../../../../store/index'
import tim from '../../../../../../../utils/tim/index'
import LiveService from '../../../utils/liveService'

const liveService = new LiveService()
const { statusBarHeight } = getApp().globalData

Component({
  options: {
    addGlobalClass: true
  },

  behaviors: [storeBindingsBehavior],

  storeBindings: {
    store,
    fields: ['fullScreen', 'praiseCount', 'subtitleContent', 'audienceCount', 'animationList', 'studioInfo', 'devicePosition'],
    actions: ['setFullScreen', 'exitFullScreen', 'toggleLampVisible']
  },

  properties: {
    roomInfo: Object,
    mode: Number,
    direction: Number
  },

  data: {
    statusBarHeight,
    countdownVisible: false,
    start: false,
    stop: false,
    anchorPhraseList: [],
    liveEnd: false,                      // 直播结束
    manualPraise: false,                 // 是否是手动点赞
    audienceActionTips: '',              // 观众行为（进直播间、下单...）
    showAudienceActionTips: false,       // 控制观众行为弹幕的显示隐藏
    praiseHeartArr: [],                  // 双击爱心
    roomPosterInfo: null,
    inputVisible: false, 
    inputDefaultValue: '',
    shareModalVisible: false, 
    posterModalVisible: false, 
    moreFeaturesPopupVisible: false,
    adPopupVisible: false,
    beautyPopupVisible: false,
    liveDetailPopupVisible: false,
    usersManagementPopupVisible: false,
    assistantCommentsPopupVisible: false,
    increaseUsersPopupVisible: false,
    pushNotificationPopupVisible: false,
    startRemindPopupVisible: false,
    commonWordsPopupVisible: false,
    quitModalVisible: false, 
    adVisible: false,
    goodsShelvesPopupVisible: false,
    filePopupVisible: false,
    recommendGood: null,
    trafficPanelVisible: true,
    trafficRechargePopupVisible: false,
  },

  observers: {
    'roomInfo': function(info) {
      if (info) {
        const { media_format, status, show_subtitle, subtitle, resolution_type, watch_num, like_num, live_demo } = info

        if (media_format == 2 && status == 1) {
          this.startLive()
        }

        if (live_demo && live_demo.id) store.setFileInfo(live_demo)
        // 公告
        store.setSubtitleVisible(show_subtitle == 1)
        if (subtitle) store.setSubtitleContent(subtitle)
        
        if (resolution_type != 2) {
          store.setDefinitionIndex(resolution_type - 1)
        }
        store.setAudienceCount(Number(watch_num))
        store.setPraiseCount(Number(like_num))

        !this.data.roomPosterInfo && this.setPosterInfo()
        !this.data.anchorPhraseList.length && this.setAnchorPhraseList()
        !this.data.recommendGood && this.getRecommendGood()
      }
    }
  },

  pageLifetimes: {
    show() {
      // 小程序退出后台时间过长，就会报未加群聊的错误，
      // 所以每次onshow时，重新加群
      setTimeout(() => {
        if (this.properties.roomInfo) {
          tim.joinGroup(this.properties.roomInfo.group_id)
        }
      }, 2000);
    }
  },

  lifetimes: {
    attached() {
      getApp().onLiveCustomMsgReceive(this.handleCustomMsg.bind(this))
    },
  },

  methods: {
    startCountdown() {
      this.setData({
        countdownVisible: true
      })
      setTimeout(() => {
        this.setData({
          countdownVisible: false
        })
      }, 5000);
    },

    async startLive() {
      const { id, group_id, status } = this.properties.roomInfo
      this.setData({ start: true })
      liveService.getMsgHistory(id)
      // 主播未开播的场景，退出后台（进行海报分享等操作）时间过长之后，发送消息会报未加群的错误，所以主播都让他加群
      tim.joinGroup(group_id)
      if (status == 4) {
        await liveService.restartPushRoom(id)
      }
      liveService.startLivePush(id)
    },

    refresh() {
      tim.joinGroup(this.properties.roomInfo.group_id)
    },

    async setAnchorPhraseList() {
      const { list: anchorPhraseList = [] } = await liveService.getPhraseList(store.studioInfo.id, 1) || {}
      this.setData({ anchorPhraseList })
    },

    showAnimation() {
      if (store.animationIndex === -1) {
        store.setAnimationIndex(0)
        tim.sendLiveCustomMsg(this.properties.roomInfo.group_id, { type: 'animation', index: 0 })
      }
    },

    reverseCamera() {
      store.setRemoteMirror(store.devicePosition === 'front' ? false : true)
      store.setDevicePosition(store.devicePosition === 'front' ? 'back' : 'front')
      store.setLocalMirror('auto')
    },
    
    showInput() {
      this.setData({
        inputVisible: true
      })
      if (this.data.fullScreen) this.exitFullScreen()
    },

    atUser(e) {
      this.setData({
        usersManagementPopupVisible: false,
        inputVisible: true,
        inputDefaultValue: `@${e.detail.name} `
      })
    },

    hideInputModal() {
      if (this.data.inputDefaultValue) {
        this.setData({
          inputDefaultValue: ''
        })
      }
      this.hideModal()
    },

    showAdPopup() {
      this.setData({
        moreFeaturesPopupVisible: false,
        adPopupVisible: true
      })
      if (this.data.fullScreen) this.exitFullScreen()
    },

    toggleAdVisible() {
      this.setData({
        adVisible: !this.data.adVisible
      })
    },

    showUsersManagementPopup() {
      this.setData({
        usersManagementPopupVisible: true
      })
      if (this.data.fullScreen) this.exitFullScreen()
    },

    showAssistantCommentsPopup() {
      this.setData({
        moreFeaturesPopupVisible: false,
        assistantCommentsPopupVisible: true
      })
      if (this.data.fullScreen) this.exitFullScreen()
    },

    showIncreaseUsersPopup() {
      this.setData({
        increaseUsersPopupVisible: true
      })
      if (this.data.fullScreen) this.exitFullScreen()
    },

    showPushNotificationPopup() {
      this.setData({
        moreFeaturesPopupVisible: false,
        pushNotificationPopupVisible: true
      })
    },

    showStartRemindPopup() {
      this.setData({
        moreFeaturesPopupVisible: false,
        startRemindPopupVisible: true
      })
    },

    showCommonWordsPopup() {
      this.setData({
        moreFeaturesPopupVisible: false,
        commonWordsPopupVisible: true
      })
    },

    showShareModal() {
      this.setData({
        shareModalVisible: true
      })
      if (this.data.fullScreen) this.exitFullScreen()
    },
  
    showPosterModal() {
      this.setData({ 
        shareModalVisible: false, 
        posterModalVisible: true 
      })
    },
  
    async setPosterInfo() {
      const { id, cover, title, studio_id, studio_title, studio_head_img } = this.properties.roomInfo
      const { qrcode_url, share_url } = await liveService.getShopSharePosterInfo(studio_id, 3, id) || {}
  
      this.setData({
        roomPosterInfo: { 
          cover, 
          title, 
          avatar: studio_head_img, 
          name: studio_title, 
          qrCode: qrcode_url, 
          status: 1
        }
      })
      store.setLiveRoomShareCover(share_url)
    },
  
    showMoreFeaturesPopup() {
      this.setData({
        moreFeaturesPopupVisible: true
      })
      if (this.data.fullScreen) this.exitFullScreen()
    },
  
    showBeautyPopup() {
      this.setData({
        moreFeaturesPopupVisible: false,
        beautyPopupVisible: true
      })
    },

    showLiveDetailPopup() {
      this.setData({
        moreFeaturesPopupVisible: false,
        liveDetailPopupVisible: true
      })
    },

    showGoodsShelvesPopup() {
      this.setData({
        goodsShelvesPopupVisible: true
      })
      if (this.data.fullScreen) this.exitFullScreen()
    },

    showFilePopup() {
      this.setData({
        moreFeaturesPopupVisible: false,
        filePopupVisible: true
      })
    },

    showTrafficRechargePopup() {
      this.setData({
        trafficRechargePopupVisible: true
      })
    },

    hideModal() {
      const { 
        inputVisible, 
        shareModalVisible, 
        posterModalVisible, 
        moreFeaturesPopupVisible, 
        beautyPopupVisible, 
        liveDetailPopupVisible,
        adPopupVisible, 
        usersManagementPopupVisible, 
        assistantCommentsPopupVisible, 
        increaseUsersPopupVisible,
        pushNotificationPopupVisible, 
        startRemindPopupVisible, 
        commonWordsPopupVisible,
        adVisible,
        quitModalVisible,
        goodsShelvesPopupVisible,
        filePopupVisible,
        trafficRechargePopupVisible
      } = this.data
      if (inputVisible) this.setData({ inputVisible: false })
      if (shareModalVisible) this.setData({ shareModalVisible: false })
      if (posterModalVisible) this.setData({ posterModalVisible: false })
      if (moreFeaturesPopupVisible) this.setData({ moreFeaturesPopupVisible: false })
      if (adPopupVisible) this.setData({ adPopupVisible: false })
      if (beautyPopupVisible) this.setData({ beautyPopupVisible: false })
      if (liveDetailPopupVisible) this.setData({ liveDetailPopupVisible: false })
      if (usersManagementPopupVisible) this.setData({ usersManagementPopupVisible: false })
      if (assistantCommentsPopupVisible) this.setData({ assistantCommentsPopupVisible: false })
      if (increaseUsersPopupVisible) this.setData({ increaseUsersPopupVisible: false })
      if (pushNotificationPopupVisible) this.setData({ pushNotificationPopupVisible: false })
      if (startRemindPopupVisible) this.setData({ startRemindPopupVisible: false })
      if (commonWordsPopupVisible) {
        this.setAnchorPhraseList()
        this.setData({ commonWordsPopupVisible: false })
      }
      if (adVisible) this.setData({ adVisible: false })
      if (quitModalVisible) this.setData({ quitModalVisible: false })
      if (filePopupVisible) this.setData({ filePopupVisible: false })
      if (goodsShelvesPopupVisible) this.setData({ goodsShelvesPopupVisible: false })
      if (trafficRechargePopupVisible) this.setData({ trafficRechargePopupVisible: false })
    },
    
    checkOBS() {
      wx.navigateTo({
        url: `/pages/subpages/home/live-push/subpages/check-obs/index?url=${this.data.roomInfo.url}`
      })
    },

    showQuitModal() {
      if (this.data.start) this.setData({ quitModalVisible: true })
      else wx.switchTab({ 
        url: '/pages/tab-bar-pages/home/index' 
      })
    },

    pauseRoom() {
      this.setData({ 
        stop: true,
        quitModalVisible: false
      }, () => {
        store.resetRoomData()
        store.setSubtitleContent('')
        store.setUserFixed(false)
        store.setVestInfo(null)
        wx.switchTab({ 
          url: '/pages/tab-bar-pages/home/index' 
        })
        liveService.pausePushRoom(this.properties.roomInfo.id)
      })
    },

    quitRoom() {
      const { id } = this.properties.roomInfo || {}
      this.setData({ 
        stop: true,
        quitModalVisible: false
      }, () => {
        wx.switchTab({ 
          url: '/pages/tab-bar-pages/home/index' 
        })
        store.resetRoomData()
        store.setSubtitleContent('')
        store.setAudienceCount(0)
        store.setPraiseCount(0)
        store.setUserFixed(false)
        store.setVestInfo(null)
        liveService.closePushRoom(id)
      })
    },

    dbTap(e) {
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
    },

    // 点赞
    praise() {
      wx.vibrateShort({ type: 'heavy' })
      if (!this.data.manualPraise) this.setData({ manualPraise: true })
      liveService.praiseHandler(this.properties.roomInfo.id)
    },

    handleCustomMsg(customMsg) {
      if (customMsg) {
        if (customMsg) {
          let { manualPraise, praiseCount, audienceCount, showAudienceActionTips } = this.data
  
          switch (customMsg.type) {
            case 'user_coming':
              if (!showAudienceActionTips) {
                this.setData({ 
                  audienceActionTips: {
                    type: 'coming',
                    message: customMsg.message
                  },
                  showAudienceActionTips: true
                })
                setTimeout(() => { 
                  this.setData({ showAudienceActionTips: false }) 
                }, 2000)
              }
              break

            case 'robot_in_group':
              if (!showAudienceActionTips) {
                this.setData({ 
                  audienceActionTips: {
                    type: 'coming',
                    isRobot: 1,
                    message: customMsg.message
                  },
                  showAudienceActionTips: true
                })
                setTimeout(() => { 
                  this.setData({ showAudienceActionTips: false }) 
                }, 2000)
              }
              break

            case 'user_comed':
              if(customMsg.zhubo_total_num){
                store.setAudienceCount(customMsg.zhubo_total_num || 0)
              }else{
                store.setAudienceCount(++audienceCount)
              }
              break

            case 'user_leaving':
              if(customMsg.zhubo_total_num){
                store.setAudienceCount(customMsg.zhubo_total_num || 0)
              }else{
                --audienceCount
                store.setAudienceCount(audienceCount < 0 ? 0 : audienceCount)
              }
              break

            case 'live_room_like':
              const newPraiseCount = Number(customMsg.like_num)
              if (newPraiseCount > praiseCount) {
                manualPraise && this.setData({ manualPraise: false })
                store.setPraiseCount(newPraiseCount)
              }
              break

            case 'group_subtitle':
              store.setSubtitleContent(customMsg.subtitle)
              break

            case 'delete_group_msg':
              store.deleteLiveMsg(customMsg.delete)
              break
            
            case 'animation':
              store.setAnimationIndex(Number(customMsg.index))
              break

            case 'update_tag':
              const userIds = customMsg.user_id.split(',')
              if (userIds.includes(`${store.userInfo.id}`)) {
                liveService.setCurUserTagList(this.properties.roomInfo.studio_id, store.userInfo.id)
              }
              break
          }
        }
      }
    },

    async getRecommendGood(){
      const { list = [] } = await liveService.getYouboRoomGoodsList(this.properties.roomInfo.id, '3', 1) || {}
      if (list.length) {
        this.setData({
          recommendGood: list[0]
        })
      }
    },

    toggleTrafficPanelVisible() {
      this.setData({
        trafficPanelVisible: !this.data.trafficPanelVisible
      })
    }
  }
})

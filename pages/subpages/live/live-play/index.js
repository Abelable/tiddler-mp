import { createStoreBindings } from 'mobx-miniprogram-bindings'
import { store } from '../../../../store/index'
import { getQueryString } from '../../../../utils/index'
import RoomService from './utils/roomService'

const roomService = new RoomService()
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    roomList: [],
    curRoomIdx: 0
  },

  async onLoad(options) {
    wx.showShareMenu({
      withShareTicket:true,
      menus:['shareAppMessage','shareTimeline']
    })

    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ['userInfo', 'maskVisible', 'maskOpcity', 'goodsModalVisible', 'inputModalVisible', 'shareModalVisible', 'posterModalVisible'],
      actions: ['setLiveMsgList', 'showModal', 'hideModal']
    })
    
    const { id, scene, q } = options
    const decodedScene = scene ? decodeURIComponent(scene) : ''
    const decodedQ = q ? decodeURIComponent(q) : ''
    this.roomId = id || decodedScene.split('-')[0] || getQueryString(decodedQ, 'id')

    await this.setRoomList()
    this.setCurRoomInfo()
  },

  onShow() {
    wx.setKeepScreenOn({ keepScreenOn: true }) // 保持屏幕常亮
  },

  initData() {
    this.selectComponent('.room').joinRoom()
  },

  changeRoom(e) {
    const { current: curRoomIdx } = e.detail
    this.setCurRoomIdxTimeout && clearTimeout(this.setCurRoomIdxTimeout)
    this.setCurRoomIdxTimeout = setTimeout(() => {
      this.setData({ curRoomIdx })
      this.setCurRoomInfo()
    }, 500)
    const { roomList } = this.data
    curRoomIdx > roomList.length - 5 && this.setRoomList()
  },

  // 连麦时，跳转另一个主播的房间
  async toAnotherRoom() {
    const { curRoomIdx, anotherAnchorInfo } = this.data
    const roomList = await roomService.getRoomLists(anotherAnchorInfo.roomId) || []
    const { audioUrl, definition, position, hotGoods, fansName, horizontal } = await roomService.getRoomInfo(anotherAnchorInfo.roomId) || {}
    this.setData({ 
      [`roomList[${curRoomIdx}]`]: { ...roomList[0], audioUrl, definition, position, fansName, hotGoods, horizontal }
    })
  },

  async setRoomList() {
    const roomList = await roomService.getRoomLists(this.roomId) || []
    this.setData({
      roomList: [...this.data.roomList, ...roomList]
    })
  },

  async setCurRoomInfo() {
    const { roomList, curRoomIdx, inviterId } = this.data 
    const { id, status } = roomList[curRoomIdx]
    if (status) {
      const { audioUrl, definition, position, hotGoods, fansName, horizontal } = await roomService.getRoomInfo(id, inviterId) || {}
      this.setData({
        [`roomList[${curRoomIdx}].audioUrl`]: audioUrl,
        [`roomList[${curRoomIdx}].definition`]: definition,
        [`roomList[${curRoomIdx}].position`]: position,
        [`roomList[${curRoomIdx}].fansName`]: fansName,
        [`roomList[${curRoomIdx}].hotGoods`]: hotGoods,
        [`roomList[${curRoomIdx}].horizontal`]: horizontal
      })
    }
  },

  onUnload() {
    this.hideModal()
    this.storeBindings.destroyStoreBindings()
  },

  showSpecModal(e) {
    const { goods_name: specGoodsName, goods_id: specGoodsId, goods_img: specGoodsPic, promote_price, shop_price, goods_number: specStock, attr_goods_info: specMainInfo } = this.data.goodsList.filter(item => item.goods_id == e.detail.goodsId)[0] 
    this.setSpecInfo({ specGoodsName, specGoodsId, specGoodsPic, specStock, specMainInfo, specBasePrice: promote_price || shop_price })
    this.showModal('spec')
  },

  showPosterModal() {
    this.showModal('poster')
  },

  onShareAppMessage() {
    const { roomList, curRoomIdx, userInfo, redPacketInfo } = this.data 
    const roomInfo = roomList[curRoomIdx]
    const { id, title, cover: imageUrl } = roomInfo
    const path = `/pages/subpages/index/room/index?id=${id}&shopid=${wx.getStorageSync('myShopid')}&inviteid=${userInfo.userID}&envelopid=${redPacketInfo ? redPacketInfo.id : ''}`
    return { path, title, imageUrl }
  },

  onShareTimeline() {
    const { roomList, curRoomIdx, userInfo, redPacketInfo } = this.data 
    const roomInfo = roomList[curRoomIdx]
    const { id, title, cover: imageUrl } = roomInfo
    title = `有播直播间：${title}`
    const query = `id=${id}&shopid=${wx.getStorageSync('myShopid')}&inviteid=${userInfo.userID}&envelopid=${redPacketInfo ? redPacketInfo.id : ''}`
    return { query, title, imageUrl }
  }
})

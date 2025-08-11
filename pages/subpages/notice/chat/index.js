import { createStoreBindings } from 'mobx-miniprogram-bindings'
import { store } from '../../../../store/index'
import { emojiName, emojiMap, emojiUrl } from '../../../../utils/im/emojiMap'
import { judgeOrderStatus } from '../../../../utils/judgeOrderStatus'
import ChatService from './utils/chatService'

const chatService = new ChatService()

Page({
  data: {
    statusBarHeight: getApp().globalData.statusBarHeight,
    emojiName,
    emojiMap,
    emojiUrl,
    containerBottom: 0,
    scrollTop: '',
    friendId: '',
    friendName: '',
    friendAvatarUrl: '',
    content: '', // 输入框的文本值
    emojiWrapVisiabel: false,
    moreOperateVisiabel: false,
    goodsInfo: null,
    orderInfo: null,
    // 规格相关
    specData: '', // 商品规格数据
    showSpecModal: false,
    // 限购相关
    limitTips: '',
    limitBuyNum: 0,
    limitStartBuyNum: 0
  },

  onLoad(options) {
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ['userInfo', 'msgList']
    })

    const { friendId, friendName, friendAvatarUrl, goodsId, orderId } = options
    goodsId && this.setGoodsInfo(goodsId)
    orderId && this.setOrderInfo(orderId)
    wx.setNavigationBarTitle({ title: friendName })
    this.setData({ friendId, friendName, friendAvatarUrl })
    const conversationID = `C2C${friendId}`
    getApp().globalData.im.setMessageRead(conversationID)
    getApp().globalData.im.getMsgList(conversationID)
  },

  async setGoodsInfo(goodsId) {
    let goodsData = await chatService.getGoodsInfo(goodsId)
    let { goods_id, goods_name, img, promote_price, shop_price, default_attr_img, attr_goods_info, goods_number, limited_buy_num, start_buy_num } = goodsData
    let goodsInfo = { goods_id, goods_name, img, promote_price, shop_price }
    this.setData({
      goodsInfo,
      shopPrice: Number(promote_price) ? promote_price : shop_price,
      goodsPic: default_attr_img,
      specData: attr_goods_info,
      stock: goods_number,
      limitBuyNum: Number(limited_buy_num),
      limitStartBuyNum: start_buy_num,
      limitTips: Number(limited_buy_num) ? '每人限购' + Number(limited_buy_num) + '件' : start_buy_num ? start_buy_num + '件起购' : ''
    })
  },

  async setOrderInfo(orderId) {
    let orderInfo = await chatService.getOrderDetail(orderId)
    let { order_status, pay_status, shipping_status } = orderInfo
    this.setData({
      orderInfo,
      compositeStatus: judgeOrderStatus(order_status, pay_status, shipping_status)
    })
  },

  showKeyBoard(e) {
    const { emojiWrapVisiabel, moreOperateVisiabel, containerBottom } = this.data
    emojiWrapVisiabel && this.setData({ emojiWrapVisiabel: false })
    moreOperateVisiabel && this.setData({ moreOperateVisiabel: false })
    !containerBottom && this.setData({ containerBottom: e.detail.height })
  },

  hideKeyBoard() {
    this.data.containerBottom && this.setData({ containerBottom: 0 })
  },

  showEmojiWrap() {
    const { emojiWrapVisiabel, moreOperateVisiabel, containerBottom } = this.data
    containerBottom && this.setData({ containerBottom: 0 })
    moreOperateVisiabel && this.setData({ moreOperateVisiabel: false })
    !emojiWrapVisiabel && this.setData({ emojiWrapVisiabel: true })
  },

  showMoreOperate() {
    const { emojiWrapVisiabel, moreOperateVisiabel, containerBottom } = this.data
    containerBottom && this.setData({ containerBottom: 0 })
    emojiWrapVisiabel && this.setData({ emojiWrapVisiabel: false })
    !moreOperateVisiabel && this.setData({ moreOperateVisiabel: true })
  },

  blurInput() {
    const { emojiWrapVisiabel, moreOperateVisiabel, containerBottom } = this.data
    containerBottom && this.setData({ containerBottom: 0 })
    emojiWrapVisiabel && this.setData({ emojiWrapVisiabel: false })
    moreOperateVisiabel && this.setData({ moreOperateVisiabel: false })
  },

  getContent(e) {
    this.setData({
      content: e.detail.value
    })
  },

  chooseEmoji(e) {
    this.setData({
      content: `${this.data.content}${e.currentTarget.dataset.emoji}`
    })
  },

  sendMsg() {
    const { content, friendId } = this.data
    if (content) {
      getApp().globalData.im.sendMsg(content, friendId)
      this.setData({ content: '' })
      this.blurInput()
    } else wx.showToast({ title: '消息不能为空' })
  },

  sendCustomMsg(e) {
    let type = e.currentTarget.dataset.type
    let { goodsInfo, orderInfo, friendId } = this.data
    let msgData
    switch (type) {
      case '1':
        msgData = goodsInfo
        break
      case '2':
        msgData = orderInfo
        break
    }
    msgData.type = type
    let msg = JSON.stringify({
      type: type,
      data: JSON.stringify(msgData)
    })
    getApp().globalData.im.sendCustomMsg(msg, friendId)
  },

  sendPhoto(e) {
    let name = e.currentTarget.dataset.name
    if (name === 'album') {
      this.chooseImage(name)
    } else if (name === 'camera') {
      wx.getSetting({
        success: res => {
          if (!res.authSetting['scope.camera']) { // 无权限，跳转设置权限页面
            wx.authorize({
              scope: 'scope.camera',
              success: () => {
                this.chooseImage(name)
              }
            })
          } else {
            this.chooseImage(name)
          }
        }
      })
    }
  },

  chooseImage(name) {
    wx.chooseImage({
      sourceType: [name],
      count: 1,
      success: res => {
        getApp().globalData.im.sendImage(res, this.data.friendId)
      }
    })
    this.blurInput()
  },

  // 显示规格弹窗
  showSpecModal() {
    this.setData({
      showSpecModal: true,
      showMask: true
    })
  },

  // 关闭规格弹窗
  hideSpecModal() {
    this.setData({
      showSpecModal: false,
      showMask: false
    })
  },

  // 商品详情页
  toGoodsDetail(e) {
    wx.navigateTo({
      url: `/pages/subpages/mall/goods-detail/index?id=${e.currentTarget.dataset.id}`
    })
  },

  // 订单详情页
  toOrderDetail(e) {
    wx.navigateTo({
      url: `/pages/subpages/mine/order/order-detail/index?id=${e.currentTarget.dataset.id}`
    })
  },
  
  onUnload() {
    this.storeBindings.destroyStoreBindings()
  }
})
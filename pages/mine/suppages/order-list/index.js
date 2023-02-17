import OrderService from './utils/orderService'

const orderService = new OrderService()
const menuList = [
  { name: '全部', status: 0 }, 
  { name: '待付款', status: 1 }, 
  { name: '待发货', status: 2 }, 
  { name: '待收货', status: 3 }, 
  { name: '待评价', status: 4 }, 
  { name: '退款/售后', status: 5 }
]

Page({
  data: {
    menuList,
    curMenuIndex: 0,
    orderLists: [],
  },

  async onLoad({ status }) {

    this.setData({
      curMenuIndex: menuList.findIndex(val => val.status == order_status)
    })
    this.pages = [] 

    if (mobile && (!wx.getStorageSync('token') || (wx.getStorageSync('token') && wx.getStorageSync('phone') != mobile))) {
      await this.autoLogin(mobile, nickname, avatar)
    }
    
    checkLogin(this.initData)
  },

  onShow() {
    if (this.data.curMenuIndex == 4) this.initData()
  },

  initData() {
    if (this.initDataTimeout) clearTimeout(this.initDataTimeout)
    this.initDataTimeout = setTimeout(() => {
      this.setOrderList(true)
    })
  },

  async autoLogin(mobile, nickname, avatar) {
    const { code } = await orderService.wxLogin()
    const { openid, unionid } = await orderService.getSessionKey(code) || {}
    const { token, shop_id } = await orderService.login(mobile, nickname, avatar, 0, openid, unionid)
    wx.setStorageSync('token', token)
    wx.setStorage({ key: "phone", data: mobile })
    wx.setStorage({ key: "openid", data: openid })
    wx.setStorage({ key: 'myShopid', data: shop_id || '' })
    initUserData()
  },

  onPullDownRefresh() {
    this.setOrderList(true)
    wx.stopPullDownRefresh()
  },

  onReachBottom() {
    this.setData({ isHideLoadMore: false })
    this.setOrderList()
  },

  selectMenu(e) {
    let status = e.target.dataset.orderStatus
    let index = menuList.findIndex(val => val.status == status)
    this.setData({ curMenuIndex: index })
    let order = this.data.orderLists[index]
    if (!order || !order.length) this.setOrderList(status)
  },

  async setOrderList(refresh = false) {
    const { curMenuIndex, orderLists, isHideLoadMore } = this.data
    const { status } = menuList[curMenuIndex]
    const index = menuList.findIndex(val => val.status == status)
    if (refresh || !this.pages[index]) {
      this.pages[index] = 0
      orderLists[index] = []
    }
    let { list = [] } = await orderService.getOrderList(status, ++this.pages[index]) || {}
    this.setData({
      [`orderLists[${index}]`]: refresh ? list : [...orderLists[index], ...list],
    })
    !isHideLoadMore && this.setData({ isHideLoadMore: true })
  },

  finishPay() {
    this.setOrderList(true)
    this.setData({ curMenuIndex: 2 }, () => {
      this.setOrderList(true)
    })
  }
})

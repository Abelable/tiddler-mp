import checkLogin from '../../../../utils/checkLogin'
import OrderService from './utils/orderService'

const orderService = new OrderService()
const menu = [
  { name: '全部', status: 0 }, 
  { name: '待付款', status: 1 }, 
  { name: '待发货', status: 2 }, 
  { name: '待收货', status: 3 }, 
  { name: '待评价', status: 4 }, 
  { name: '退款/售后', status: 4 }
]

Page({
  data: {
    menu,
    selectedTab: 0,
    orderList: [],
  },

  async onLoad(options) {
    const { order_status = 0 , mobile, nickname, avatar } = options || {}

    this.setData({
      selectedTab: menu.findIndex(val => val.status == order_status)
    })
    this.pages = [] 

    if (mobile && (!wx.getStorageSync('token') || (wx.getStorageSync('token') && wx.getStorageSync('phone') != mobile))) {
      await this.autoLogin(mobile, nickname, avatar)
    }
    
    checkLogin(this.initData)
  },

  onShow() {
    if (this.data.selectedTab == 4) this.initData()
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
    let index = menu.findIndex(val => val.status == status)
    this.setData({ selectedTab: index })
    let order = this.data.orderList[index]
    if (!order || !order.length) this.setOrderList(status)
  },

  async setOrderList(refresh = false) {
    const { selectedTab, orderList, isHideLoadMore } = this.data
    const { status } = menu[selectedTab]
    const index = menu.findIndex(val => val.status == status)
    if (refresh || !this.pages[index]) {
      this.pages[index] = 0
      orderList[index] = []
    }
    let { list = [] } = await orderService.getOrderList(status, ++this.pages[index]) || {}
    this.setData({
      [`orderList[${index}]`]: refresh ? list : [...orderList[index], ...list],
    })
    !isHideLoadMore && this.setData({ isHideLoadMore: true })
  },

  finishPay() {
    this.setOrderList(true)
    this.setData({ selectedTab: 2 }, () => {
      this.setOrderList(true)
    })
  }
})

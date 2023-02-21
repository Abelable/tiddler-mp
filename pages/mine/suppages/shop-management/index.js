import ShopService from './utils/shopService'

const shopService = new ShopService()
const { statusBarHeight } = getApp().globalData

Page({
  data: {
    statusBarHeight,
    shopInfo: null,
    menuList: [
      { name: '全部', status: 0 }, 
      { name: '待付款', status: 1 }, 
      { name: '待发货', status: 2 }, 
      { name: '待收货', status: 3 }, 
      { name: '售后', status: 5 }
    ],
    curMenuIndex: 0,
    orderList: [],
    finished: false,
  },
  
  async onShow() {
    if (!this.data.shopInfo) {
      await this.setShopInfo()
    }
    this.setOrderList(true)
  },

  async setShopInfo() {
    const shopInfo = await shopService.getShopInfo()
    this.setData({ shopInfo })
  },

  selectMenu(e) {
    const { index: curMenuIndex } = e.currentTarget.dataset
    this.setData({ curMenuIndex })
    this.setOrderList(true)
  },

  async setOrderList(init = false) {
    const limit = 10
    const { shopInfo, menuList, curMenuIndex, orderList } = this.data
    if (init) this.page = 0
    const list = await shopService.getOrderList({ 
      shopId: shopInfo.id, 
      status: menuList[curMenuIndex].status, 
      page:  ++this.page, 
      limit
    })
    this.setData({
      orderList: init ? list : [...orderList, ...list],
    })
    if (list.length < limit) {
      this.setData({ finished: true })
    }
  },

  onPullDownRefresh() {
    this.setOrderList(true)
    wx.stopPullDownRefresh()
  },

  onReachBottom() {
    this.setOrderList()
  },
})

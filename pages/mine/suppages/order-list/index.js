import OrderService from './utils/orderService'

const orderService = new OrderService()

Page({
  data: {
    menuList: [
      { name: '全部', status: 0 }, 
      { name: '待付款', status: 1 }, 
      { name: '待发货', status: 2 }, 
      { name: '待收货', status: 3 }, 
      { name: '待评价', status: 4 }, 
      { name: '售后', status: 5 }
    ],
    curMenuIndex: 0,
    orderList: [],
    finished: false,
  },

  async onLoad({ status = '0' }) {
    const curMenuIndex = this.data.menuList.findIndex(item => (item.status === Number(status)))
    this.setData({ curMenuIndex })
    this.setOrderList(true)
  },

  selectMenu(e) {
    const { index: curMenuIndex } = e.currentTarget.dataset
    this.setData({ curMenuIndex })
    this.setOrderList(true)
  },

  async setOrderList(init = false) {
    const limit = 10
    const { menuList, curMenuIndex, orderList } = this.data
    if (init) this.page = 0
    const list = await orderService.getOrderList(menuList[curMenuIndex].status, ++this.page, limit)
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

import OrderService from '../../../utils/orderService'
const orderService = new OrderService()

Page({
  data: {
    selectionLists: [
      { desc: '差评', icon: './images/bad-icon.png', activeIcon: './images/bad-active-icon.png' },
      { desc: '中评', icon: './images/avarage-icon.png', activeIcon: './images/average-active-icon.png' },
      { desc: '好评', icon: './images/good-icon.png', activeIcon: './images/good-active-icon.png' },
    ],
    curSelectionIdx: 2,
    shopName: '',
    goodsLists: []
  },

  async onLoad(options) {
    this.orderId = options.id
    this.setOrderInfo()
    this.commentLists = []
  },

  select(e) {
    this.setData({
      curSelectionIdx: Number(e.currentTarget.dataset.index)
    })
  },

  onComment(e) {
    this.commentLists[e.currentTarget.dataset.index] = e.detail
  },

  async setOrderInfo() {
    const { shop_name: shopName, goods: goodsLists } = await orderService.getOrderDetail(this.orderId)
    this.setData({ shopName, goodsLists })
  },

  publish() {
    let type 
    switch (this.data.curSelectionIdx) {
      case 0:
        type = 3
        break

      case 1:
        type = 2
        break

      case 2:
        type = 1
        break
    }
    orderService.publishComment(this.orderId, type, this.commentLists, () => {
      wx.showToast({
        title: '发布成功',
        icon: 'none',
        success: () => {
          wx.navigateBack()
        }
      })
    })
  }
})
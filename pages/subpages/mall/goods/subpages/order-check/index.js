import GoodsService from '../../utils/goodsService'

const goodsService = new GoodsService()

Page({
  data: {
    preOrderInfo: null,
    addressSelectPopupVisible: false
  },

  onLoad({ cartIds }) {
    this.cartIds = JSON.parse(cartIds) 
    this.setPreOrderInfo()
  },

  async setPreOrderInfo() {
    const preOrderInfo = await goodsService.getPreOrderInfo(this.cartIds, this.addressId)
    this.setData({ preOrderInfo })
  },

  showAddressSelectPopup() {
    this.setData({
      addressSelectPopupVisible: true
    })
  },

  hideAddressSelectPopup(e) {
    this.setData({
      addressSelectPopupVisible: false
    })
    if (e.detail) {
      this.addressId = e.detail
      this.setPreOrderInfo()
    }
  },

  // 提交订单
  async submit() {
    const addressId = this.data.preOrderInfo.addressInfo.id
    if (!addressId) {
      return
    }
    const orderIds = await goodsService.submitOrder(this.cartIds, addressId)
    this.pay(orderIds)
  },

  async pay(orderIds) {
    const payParams = await goodsService.getPayParams(orderIds)
    wx.requestPayment({
      ...payParams,
      success: () => {
        wx.navigateTo({ 
          url: '/pages/mine/suppages/order-list/index?status=2'
        })
      },
      fail: () => {
        wx.navigateTo({ 
          url: '/pages/mine/suppages/order-list/index?status=1'
        })
      }
    })
  },
})

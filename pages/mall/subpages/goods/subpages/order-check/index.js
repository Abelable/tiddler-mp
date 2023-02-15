import GoodsService from '../../utils/goodsService'

const goodsService = new GoodsService()
const { statusBarHeight } = getApp().globalData

Page({
  data: {
    statusBarHeight,
    preOrderInfo: null,
    addressSelectPopupVisible: false
  },

  onLoad({ cartIds }) {
    this.cartIds = cartIds
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
  async checkout() {

  },

  async prePay(orderSn) {
    let res = await orderCheckService.prepay(orderSn)
    await this.pay(JSON.parse(res), orderSn)
  },

  async pay(payParams, orderSn) {
    let { timeStamp, ...rest } = payParams
    wx.requestPayment({ ...rest,
      timeStamp: String(timeStamp),
      success: () => {
        this.data.roomId && this.userBuyNowCount(orderSn)
        wx.navigateTo({ 
          url: '/pages/subpages/mine/order/index?status=5'
        });
      },
      fail: () => {
        wx.navigateTo({ 
          url: '/pages/subpages/mine/order/index?status=1'
        });
      }
    })
  },
})

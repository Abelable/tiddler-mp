import BaseService from '../../../services/baseService'

const baseService = new BaseService()

Page({
  data: {
    url: ''
  },

  async onLoad(options) {
    const res = await baseService.payMerchantOrder()
    wx.requestPayment({
      ...res,
      success: () => {
        
      },
      fail: () => {
        
      },
      complete: res => {
        
      }
    })
  },
})

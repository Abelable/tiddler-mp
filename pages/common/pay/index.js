Page({
  data: {
  },

  async onLoad({ pay_params }) {
    const payParmas = JSON.parse(encodeURIComponent(pay_params));
    console.log('payParmas', payParmas)
    wx.requestPayment({
      ...payParmas,
      success: () => {
        
      },
      fail: () => {
        
      },
      complete: () => {
        
      }
    })
  },
})

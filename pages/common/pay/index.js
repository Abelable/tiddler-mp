Page({
  data: {
  },

  async onLoad({ pay_params }) {
    console.log('pay_params', decodeURIComponent(pay_params))
    const payParams = JSON.parse(decodeURIComponent(pay_params));
    Object.keys(payParams).forEach(
      (key) => (payParams[key] = decodeURIComponent(payParams[key]))
    );
    console.log('decode_pay_params', payParams)

    wx.requestPayment({
      ...payParams,
      success: () => {
        
      },
      fail: () => {
        
      },
      complete: () => {
        
      }
    })
  },
})

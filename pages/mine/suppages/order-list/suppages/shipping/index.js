
import OrderService from '../../../../utils/orderService'

Page({
  data: {
    shippingInfo: null
  },

  async onLoad(options) {
    const res = await (new OrderService()).getShippingTracker(options.id) || []
    res.length && this.setData({ shippingInfo: res[0] })
  }
})
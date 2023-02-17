import { webviewBaseUrl } from '../../../../../../config'

Component({
  properties: {
    data: Array,
    isDetail: Boolean,
    orderStatus: Number,
    orderId: Number
  },
  
  methods: {
    showGoodsDetail(e) {
      this.properties.isDetail && wx.navigateTo({ url: `/pages/subpages/mall/goods-detail/index?id=${e.currentTarget.dataset.id}` })
    },

    toRefund(e) {
      const { orderId, recId, retId, cause } = e.currentTarget.dataset
      const url = cause == 1 ? `/pages/subpages/common/webview/index?url=${webviewBaseUrl}/refund/&order_id=${orderId}&rec_id=${recId}` : `/pages/subpages/common/webview/index?url=${webviewBaseUrl}/refund/detail/&ret_id=${retId}`
      wx.navigateTo({ url })
    }
  }
})
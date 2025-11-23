import RefundService from '../../utils/refundService'

const refundService = new RefundService()

Component({
  properties: {
    shopId: Number,
    refundId: Number,
  },

  methods: {
    setReason(e) {
      this.reason = e.detail.value
    },

    confirm() {
      if (!this.reason) {
        wx.showToast({
          title: "请输入驳回原因",
          icon: "none"
        });
        return;
      }
      const { shopId, refundId } = this.properties
      refundService.rejectRefund(shopId, refundId, this.reason, () => {
        this.triggerEvent("confirm");
      })
    },

    hide() {
      this.triggerEvent("hide");
    },

    catchtap() {}
  }
});

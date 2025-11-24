import RefundService from "../../utils/refundService";

const refundService = new RefundService();

Page({
  data: {
    refundInfo: null,
    rejectModalVisible: false
  },

  onLoad({ shopId, id }) {
    this.setData({ shopId: +shopId });
    this.refundId = +id;
    this.setRefundInfo();
  },

  async setRefundInfo() {
    const refundInfo = await refundService.getRefundDetail(
      this.data.shopId,
      this.refundId
    );
    this.setData({ refundInfo });
    this.setTitle();
  },

  setTitle() {
    const { status } = this.data.refundInfo;
    const title = [
      "待审核",
      "同意退货，待寄回",
      "已寄出，待确认",
      "退款成功",
      "已驳回"
    ][status];
    wx.setNavigationBarTitle({ title });
  },

  approve() {
    const { shopId, refundInfo } = this.data;
    const { id, refundType } = refundInfo;
    wx.showModal({
      title: `确定同意${refundType === 1 ? "退款" : "退货"}吗？`,
      success: result => {
        if (result.confirm) {
          refundService.approveRefund(shopId, id, () => {
            this.setRefundInfo();
          });
        }
      }
    });
  },

  showRejectModal(e) {
    this.setData({
      rejectModalVisible: true
    });
  },

  rejected() {
    this.setRefundInfo();
    this.hideRejectModal();
  },

  hideRejectModal() {
    this.setData({
      rejectModalVisible: false
    });
  },

  confirm() {
    const { shopId, refundInfo } = this.data;
    wx.showModal({
      title: "确认收货之前，请核实物流信息",
      content: "点击确定，确认收货并退款",
      success: result => {
        if (result.confirm) {
          refundService.approveRefund(shopId, refundInfo.id, () => {
            this.setRefundInfo();
          });
        }
      }
    });
  },

  copyOrderSn() {
    wx.setClipboardData({
      data: this.data.refundInfo.orderSn,
      success: () => {
        wx.showToast({ title: "复制成功", icon: "none" });
      }
    });
  },

  async checkShippingInfo() {
    const { refundAddressInfo, shipCode, shipSn } = this.data.refundInfo;
    const { mobile } = refundAddressInfo;
    const url = `/pages/subpages/common/shipping/index?shipCode=${shipCode}&shipSn=${shipSn}&mobile=${mobile}`;
    wx.navigateTo({ url });
  },

  contact() {
    const { orderId, userInfo } = this.data.refundInfo;
    const { id: userId, avatar, nickname } = userInfo;
    const url = `/pages/subpages/notice/chat/index?userId=${userId}&name=${nickname}&avatar=${avatar}&orderId=${orderId}&productType=4`;
    wx.navigateTo({ url });
  },

  previewImage(e) {
    const { current } = e.currentTarget.dataset;
    const urls = this.data.refundInfo.imageList;
    wx.previewImage({ current, urls });
  },
});

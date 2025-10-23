import { store } from "../../../../../../../../store/index";
import MealTicketOrderService from "../../utils/mealTicketOrderService";

const mealTicketOrderService = new MealTicketOrderService();

Page({
  data: {
    orderInfo: null
  },

  onLoad({ id }) {
    this.orderId = id;
    this.setOrderInfo();
  },

  async setOrderInfo() {
    const { cateringShopId } = store.userInfo;
    const orderInfo = await mealTicketOrderService.getOrderDetail(
      cateringShopId,
      this.orderId
    );
    this.setData({ orderInfo });

    const titleEnums = {
      201: "待确认",
      202: "退款申请中",
      203: "退款成功",
      204: "交易关闭",
      301: "待使用",
      401: "交易成功",
      402: "交易成功",
      403: "交易成功",
      501: "交易成功",
      502: "交易成功"
    };
    wx.setNavigationBarTitle({
      title: titleEnums[orderInfo.status]
    });
  },

  copyOrderSn() {
    wx.setClipboardData({
      data: this.data.orderInfo.orderSn,
      success: () => {
        wx.showToast({ title: "复制成功", icon: "none" });
      }
    });
  },

  approveOrder() {
    const { cateringShopId } = store.userInfo;
    mealTicketOrderService.approveMealTicketOrder(cateringShopId, this.orderId, () => {
      this.setOrderInfo();
    });
  },

  refundOrder() {
    wx.showModal({
      title: "确定取消订单吗？",
      success: result => {
        if (result.confirm) {
          const { cateringShopId } = store.userInfo;
          mealTicketOrderService.refundMealTicketOrder(
            cateringShopId,
            this.orderId,
            () => {
              this.setOrderInfo();
            }
          );
        }
      }
    });
  },

  contact() {
    const { id, userInfo } = this.data.orderInfo;
    const { id: userId, avatar, nickname } = userInfo;
    const url = `/pages/subpages/notice/chat/index?userId=${userId}&name=${nickname}&avatar=${avatar}&orderId=${id}&productType=5`;
    wx.navigateTo({ url });
  }
});

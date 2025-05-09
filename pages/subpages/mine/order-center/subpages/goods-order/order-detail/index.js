import OrderService from "../../../utils/orderService";

const orderService = new OrderService();

Page({
  data: {
    orderInfo: null,
    packageList: [],
    selectedPackageIdx: 0,
    countdown: 0,
    refundBtnVisible: false,
    editEvaluationBtnContent: "",
    editEvaluationBtnVisile: false,
    addressPopupVisible: false,
    qrCodeModalVisible: false
  },

  onLoad({ id }) {
    this.orderId = id;
    this.setOrderInfo();
  },

  async setOrderInfo() {
    const orderInfo = await orderService.getGoodsOrderDetail(this.orderId);
    this.setData({ orderInfo });

    const {
      id,
      status,
      createdAt,
      payTime,
      packageList = [],
      shipChannel,
      shipSn
    } = orderInfo;
    if (status === 101) {
      const countdown = Math.floor(
        (dayjs(createdAt).valueOf() + 24 * 60 * 60 * 1000 - dayjs().valueOf()) /
          1000
      );
      this.setData({ countdown });
      this.setCountdown();
    }

    if (status === 201 || status === 302) {
      if (dayjs().diff(dayjs(payTime), "minute") <= 30) {
        this.setData({ refundBtnVisible: true });
      }
    }

    if ([204, 301, 401, 402, 501, 502].includes(status)) {
      if (packageList.length) {
        this.setData({ packageList });
      } else {
        this.setData({ packageList: [{ id, shipChannel, shipSn }] });
      }
    }

    const titleEnums = {
      101: "待付款",
      102: "交易关闭",
      103: "交易关闭",
      104: "交易关闭",
      201: "等待卖家发货",
      204: "等待卖家发货",
      202: "退款申请中",
      203: "退款成功",
      301: "待收货",
      302: "待使用",
      401: "待评价",
      402: "待评价",
      501: "交易完成",
      502: "交易完成"
    };
    wx.setNavigationBarTitle({
      title: titleEnums[orderInfo.status],
    });
  },

  selectPackage(e) {
    const selectedPackageIdx = e.currentTarget.dataset.index;
    this.setData({ selectedPackageIdx });
  },

  navigation() {
    const { name, addressDetail, longitude, latitude } =
      this.data.orderInfo.pickupAddress;
    wx.openLocation({
      latitude: +latitude,
      longitude: +longitude,
      name: name || addressDetail,
      address: addressDetail
    });
  },

  setCountdown() {
    this.countdownInterval = setInterval(() => {
      if (this.data.countdown === 0) {
        clearInterval(this.countdownInterval);
        return;
      }
      this.setData({
        countdown: this.data.countdown - 1
      });
    }, 1000);
  },

  copyOrderSn() {
    wx.setClipboardData({
      data: this.data.orderInfo.orderSn,
      success: () => {
        wx.showToast({ title: "复制成功", icon: "none" });
      },
    });
  },

  async payOrder() {
    const params = await orderService.getPayParams(this.orderId);
    wx.requestPayment({
      ...params,
      success: () => {
        this.setData({
          ["orderInfo.status"]: 201,
        });
      },
    });
  },

  refundOrder() {
    wx.showModal({
      title: "确定申请退款吗？",
      success: result => {
        if (result.confirm) {
          orderService.refundGoodsOrder(this.orderId, () => {
            this.setData({
              refundBtnVisible: false,
              ["orderInfo.status"]: 203
            });
          });
        }
      }
    });
  },

  confirmOrder() {
    wx.showModal({
      title: "确认收到货了吗？",
      success: result => {
        if (result.confirm) {
          orderService.confirmGoodsOrder(this.orderId, () => {
            this.setData({
              ["orderInfo.status"]: 401
            });
          });
        }
      }
    });
  },

  deleteOrder() {
    wx.showModal({
      title: "确定删除订单吗？",
      success: result => {
        if (result.confirm) {
          orderService.deleteGoodsOrder([this.orderId], () => {
            wx.navigateBack();
          });
        }
      }
    });
  },

  cancelOrder() {
    wx.showModal({
      title: "确定取消订单吗？",
      success: result => {
        if (result.confirm) {
          orderService.cancelGoodsOrder(this.orderId, () => {
            this.setData({
              ["orderInfo.status"]: 102
            });
          });
        }
      }
    });
  },

  async checkShippingInfo() {
    const { packageList, selectedPackageIdx } = this.data;
    const waybillToken = await orderService.getWaybillToken(
      packageList[selectedPackageIdx].id
    );
    plugin.openWaybillTracking({ waybillToken });
  },

  showAddressPopup() {
    this.setData({
      addressPopupVisible: true
    });
  },

  confirmAddressSelect(e) {
    this.addressId = e.detail.id;
    this.modifyAddressInfo();
    this.hideAddressPopup();
  },

  hideAddressPopup() {
    this.setData({
      addressPopupVisible: false
    });
  },

  async modifyAddressInfo() {
    const { consignee, mobile, address } =
      (await orderService.modifyOrderAddressInfo(
        this.data.orderInfo.id,
        this.addressId
      )) || {};
    if (consignee)
      this.setData({
        ["orderInfo.consignee"]: consignee,
        ["orderInfo.mobile"]: mobile,
        ["orderInfo.address"]: address
      });
  },

  showQrCodeModal() {
    this.setData({
      qrCodeModalVisible: true
    });
  },

  hideQrCodeModal() {
    this.setData({
      qrCodeModalVisible: false
    });
    this.setOrderInfo();
  },

  navToEvaluation() {
    const { id, goodsList } = this.data.orderInfo;
    const url = `../evaluation/index?orderId=${id}&goodsList=${JSON.stringify(goodsList)}`;
    wx.navigateTo({ url });
  },

  navToShop(e) {
    const { id } = e.currentTarget.dataset;
    const url = `/pages/subpages/mall/goods/subpages/shop/index?id=${id}`;
    wx.navigateTo({ url });
  },

  contact() {},

  onUnload() {
    clearInterval(this.countdownInterval);
    this.storeBindings.destroyStoreBindings();
  }
});

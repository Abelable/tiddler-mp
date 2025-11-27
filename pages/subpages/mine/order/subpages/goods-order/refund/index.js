import RefundService from "./utils/refundService";

const refundService = new RefundService();

Page({
  data: {
    typeList: ["仅退款", "退货退款"],
    status: undefined,
    failureReason: "",
    refundAmount: "",
    refundType: undefined,
    refundReason: "",
    imageList: [],
    refundAddressInfo: null,
    expressOptions: [],
    selectedExpressIdx: undefined,
    shipSn: ""
  },

  async onLoad({
    orderId,
    orderSn,
    couponId,
    orderGoodsId,
    shopId,
    goodsId,
    refundAddressId
  }) {
    this.orderId = +orderId;
    this.orderSn = orderSn;
    this.couponId = +couponId;
    this.shopId = +shopId;
    this.orderGoodsId = +orderGoodsId;
    this.goodsId = +goodsId;
    this.refundAddressId = +refundAddressId;

    await this.setExpressOptions();
    this.setRefundInfo();
  },

  async setRefundInfo() {
    const refundInfo = await refundService.getRefund(
      this.orderId,
      this.goodsId
    );
    if (refundInfo) {
      const {
        id,
        status,
        failureReason,
        refundAmount,
        refundType,
        refundReason,
        imageList,
        shipCode,
        shipSn
      } = refundInfo;
      this.refundInfoId = id;
      this.setData({
        status,
        failureReason,
        refundAmount,
        refundType: refundType - 1,
        refundReason,
        imageList: imageList.map(item => ({ url: item }))
      });

      if (status === 1 || status === 2) {
        this.setRefundAddressInfo();
      }
      if (status === 2) {
        this.setData({
          selectedExpressIdx: this.data.expressOptions.findIndex(
            item => item.code === shipCode
          ),
          shipSn
        });
      }
    } else {
      this.setRefundAmount();
    }
  },

  async setRefundAmount() {
    const refundAmount = await refundService.getRefundAmount(
      this.orderId,
      this.goodsId,
      this.couponId
    );
    this.setData({ refundAmount });
  },

  async setRefundAddressInfo() {
    const refundAddressInfo = await refundService.getRefundAddressInfo(
      this.refundAddressId
    );
    this.setData({ refundAddressInfo });
  },

  selectRefundType(e) {
    const refundType = Number(e.detail.value);
    this.setData({ refundType });
  },

  setRefundReason(e) {
    const refundReason = e.detail.value;
    this.setData({ refundReason });
  },

  async setExpressOptions() {
    const expressOptions = await refundService.getExpressOptions();
    this.setData({ expressOptions });
  },

  uploadImage(e) {
    const { index, file } = e.detail;
    file.forEach(async (item, _index) => {
      this.setData({
        imageList: [
          ...this.data.imageList,
          { status: "uploading", message: "上传中", deletable: true }
        ]
      });
      const url = (await refundService.uploadFile(item.url)) || "";
      if (url) {
        this.setData({
          [`imageList[${index + _index}]`]: {
            ...this.data.imageList[index + _index],
            status: "done",
            message: "上传成功",
            url
          }
        });
      } else {
        this.setData({
          [`imageList[${index + _index}]`]: {
            ...this.data.imageList[index + _index],
            status: "fail",
            message: "上传失败"
          }
        });
      }
    });
  },

  deleteImage(e) {
    const { imageList } = this.data;
    imageList.splice(e.detail.index, 1);
    this.setData({ imageList });
  },

  selectExpress(e) {
    const selectedExpressIdx = Number(e.detail.value);
    this.setData({ selectedExpressIdx });
  },

  setShipSn(e) {
    const shipSn = e.detail.value;
    this.setData({ shipSn });
  },

  submit() {
    if (this.data.status === 1) {
      const { expressOptions, selectedExpressIdx, shipSn } = this.data;
      if (selectedExpressIdx === undefined) {
        wx.showToast({
          title: "请选择物流公司",
          icon: "none"
        });
        return;
      }
      if (!shipSn) {
        wx.showToast({
          title: "请填写物流单号",
          icon: "none"
        });
        return;
      }
      const { name, code } = expressOptions[selectedExpressIdx];
      refundService.submitShipInfo(
        this.refundInfoId,
        name,
        code,
        shipSn,
        () => {
          wx.showToast({
            title: "提交成功",
            icon: "none"
          });
          setTimeout(() => {
            wx.navigateBack();
          }, 2000);
        }
      );
    } else {
      const { refundType, refundReason, imageList } = this.data;
      if (!refundType) {
        wx.showToast({
          title: "请选择退款方式",
          icon: "none"
        });
        return;
      }
      if (!refundReason) {
        wx.showToast({
          title: "请补充退款说明",
          icon: "none"
        });
        return;
      }
      if (this.refundInfoId) {
        refundService.editRefund(
          this.refundInfoId,
          refundType + 1,
          refundReason,
          imageList.map(item => item.url),
          () => {
            wx.showToast({
              title: "提交成功",
              icon: "none"
            });
            setTimeout(() => {
              wx.navigateBack();
            }, 2000);
          }
        );
      } else {
        refundService.addRefund(
          this.shopId,
          this.orderId,
          this.orderSn,
          this.orderGoodsId,
          this.goodsId,
          this.couponId,
          this.refundAddressId,
          refundType,
          refundReason,
          imageList.map(item => item.url),
          () => {
            wx.showToast({
              title: "提交成功",
              icon: "none"
            });
            setTimeout(() => {
              wx.navigateBack();
            }, 2000);
          }
        );
      }
    }
  },

  checkShippingInfo() {
    const { expressOptions, selectedExpressIdx, shipSn, refundAddressInfo } =
      this.data;
    const { code } = expressOptions[selectedExpressIdx];
    const url = `/pages/subpages/common/shipping/index?shipCode=${code}&shipSn=${shipSn}&mobile=${refundAddressInfo.mobile}`;
    wx.navigateTo({ url });
  }
});

import { WEBVIEW_BASE_URL } from "../../../../../../config";
import { store } from "../../../../../../store/index";
import { checkLogin } from "../../../../../../utils/index";
import MerchantService from "./utils/merchantService";

const merchantService = new MerchantService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    headerVisible: false,
    merchantTypeList: [
      { name: "景区服务商", icon: "scenic" },
      { name: "酒店服务商", icon: "hotel" },
      { name: "餐饮商家", icon: "catering" },
      { name: "电商商家", icon: "goods" }
    ],
    merchantType: 1,
    shopType: 1,
    agree: false
  },

  onLoad(options) {
    const { type } = options || {};
    if (type) {
      this.setData({ merchantType: +type });
    }

    // todo
    // 1.绑定分享者逻辑：识别二维码获取分享者id
    // 2.确认商家认证状态:
    //   a.对于审核通过或驳回的情况，给出弹窗提示，由商家自行选择是否前去确认;
    //   b.对于已经是某个类型的商家，点击入驻时，给出提示，请勿重复操作
    this.showConfirmModal();
  },

  showConfirmModal() {
    if (store.userInfo) {
      const {
        scenicMerchantId,
        scenicMerchantStatus,
        hotelMerchantId,
        hotelMerchantStatus,
        cateringMerchantId,
        cateringMerchantStatus,
        merchantId,
        merchantStatus
      } = store.userInfo;

      if (scenicMerchantId && [1]) {
        wx.showModal({
          title: '您的景区服务商申请已通过',
          content: '',
          confirmColor: '#009bff',
        });
      }

      if (hotelMerchantId) {
      }

      if (cateringMerchantId) {
      }

      if (merchantId) {
      }
    }
  },

  selectMerchantType(e) {
    const { index } = e.currentTarget.dataset;
    this.setData({ merchantType: index + 1 });
  },

  selectShopType(e) {
    const { index } = e.currentTarget.dataset;
    this.setData({ shopType: index + 1 });
  },

  toggleAgree() {
    this.setData({
      agree: !this.data.agree
    });
  },

  settle() {
    checkLogin(() => {
      const { agree } = this.data;
      if (!agree) {
        wx.showToast({
          title: "请先阅读并同意商家服务协议",
          icon: "none"
        });
      }
    });
  },

  checkAgreement() {
    const { merchantType } = this.data;
    wx.navigateTo({
      url: `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/protocol/${
        ["scenic_", "hotel_", "catering_", ""][merchantType - 1]
      }merchant`
    });
  },

  onPageScroll(e) {
    if (e.scrollTop >= 10) {
      if (!this.data.headerVisible) {
        this.setData({ headerVisible: true });
      }
    } else {
      if (this.data.headerVisible) {
        this.setData({ headerVisible: false });
      }
    }
  },

  onShareAppMessage() {
    const { id } = store.superiorInfo || {};
    const originalPath =
      "/pages/subpages/mine/setting/subpages/merchant-settle/index";
    const path = id ? `${originalPath}?superiorId=${id}` : originalPath;
    return { title: "诚邀您入驻小鱼游", path };
  }
});

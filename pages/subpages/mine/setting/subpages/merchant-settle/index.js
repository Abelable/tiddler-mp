import { storeBindingsBehavior } from "mobx-miniprogram-bindings";
import { store } from "../../../../../../store/index";
import { WEBVIEW_BASE_URL } from "../../../../../../config";
import { checkLogin } from "../../../../../../utils/index";
import MerchantService from "./utils/merchantService";

const merchantService = new MerchantService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Component({
  behaviors: [storeBindingsBehavior],
  storeBindings: {
    store,
    fields: ["userInfo"]
  },

  data: {
    statusBarHeight,
    headerVisible: false,
    merchantTypeSelectionVisible: true,
    merchantTypeList: [
      { name: "景区服务商", icon: "scenic", status: 0 },
      { name: "酒店服务商", icon: "hotel", status: 0 },
      { name: "餐饮商家", icon: "catering", status: 0 },
      { name: "电商商家", icon: "goods", status: 0 }
    ],
    merchantType: 1,
    shopType: 1,
    agree: false
  },

  observers: {
    userInfo: function (info) {
      if (info) {
        const {
          scenicMerchantId,
          hotelMerchantId,
          cateringMerchantId,
          merchantId
        } = info;
        if (scenicMerchantId) {
          this.setData({ ["merchantTypeList[0].status"]: 1 });
        }
        if (hotelMerchantId) {
          this.setData({ ["merchantTypeList[1].status"]: 1 });
        }
        if (cateringMerchantId) {
          this.setData({ ["merchantTypeList[2].status"]: 1 });
        }
        if (merchantId) {
          this.setData({ ["merchantTypeList[3].status"]: 1 });
        }
      }
    }
  },

  methods: {
    onLoad(options) {
      const { type, scene = "" } = options || {};
      const decodedSceneList = scene
        ? decodeURIComponent(scene).split("-")
        : [];
      this.type = type || decodedSceneList[0];
      this.inviterId = decodedSceneList[1] || "";
      this.taskId = decodedSceneList[2] || "";

      if (this.type) {
        this.setData({ merchantType: +this.type });
      }

      if (this.inviterId) {
        this.setData({ merchantTypeSelectionVisible: false });
      }

      // todo
      // 1.绑定分享者逻辑：识别二维码获取分享者id
      // 2.确认商家认证状态:
      //   a.对于审核通过或驳回的情况，给出弹窗提示，由商家自行选择是否前去确认;
      //   b.对于已经是某个类型的商家，点击入驻时，给出提示，请勿重复操作
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
        const { merchantTypeList, merchantType, shopType, agree } = this.data;
        const { status, icon } = merchantTypeList[merchantType - 1];

        if (!status && !agree) {
          wx.showToast({
            title: "请先阅读并同意商家服务协议",
            icon: "none"
          });
          return;
        }

        const url = `/pages/subpages/common/webview/index?url=${WEBVIEW_BASE_URL}/${icon}/merchant/settle_${
          !status ? "in" : "status"
        }&type=${shopType}`;

        wx.navigateTo({ url });
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
  }
});

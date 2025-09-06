import { storeBindingsBehavior } from "mobx-miniprogram-bindings";
import { store } from "../../../../../../store/index";
import { checkLogin } from "../../../../../../utils/index";

Component({
  behaviors: [storeBindingsBehavior],
  storeBindings: {
    store,
    fields: ["checkInDate"]
  },

  options: {
    addGlobalClass: true
  },

  properties: {
    show: Boolean,
    info: Object,
    onlyCheck: Boolean
  },

  data: {
    curDot: 1
  },

  methods: {
    previewImage(e) {
      const { current, urls } = e.currentTarget.dataset;
      wx.previewImage({ current, urls });
    },

    bannerChange(e) {
      this.setData({
        curDot: e.detail.current + 1
      });
    },

    contact() {
      checkLogin(() => {
        const { hotelId, shopInfo, managerList } = this.properties.info;
        const { userId, ownerAvatar, ownerName } = shopInfo;
        const cs = managerList.find(item => item.roleId === 4);
        const url = `/pages/subpages/notice/chat/index?userId=${
          cs ? cs.userId : userId
        }&name=${cs ? cs.nickname : ownerName}&avatar=${
          cs ? cs.avatar : ownerAvatar
        }&productId=${hotelId}&productType=2`;
        wx.navigateTo({ url });
      });
    },

    confirm() {
      if (this.properties.onlyCheck) {
        this.hide();
      } else {
        store.setHotelPreOrderInfo(this.properties.info);
        wx.navigateTo({
          url: "/pages/subpages/mall/hotel/subpages/order-check/index"
        });
      }
    },

    hide() {
      this.triggerEvent("hide");
    }
  }
});

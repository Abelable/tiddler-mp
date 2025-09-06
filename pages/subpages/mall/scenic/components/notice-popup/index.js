import { store } from "../../../../../../store/index";
import { checkLogin } from "../../../../../../utils/index";

Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    show: Boolean,
    info: Object,
    onlyCheck: Boolean
  },

  methods: {
    contact() {
      checkLogin(() => {
        const { scenicId, shopInfo, managerList } = this.properties.info;
        const { userId, ownerAvatar, ownerName } = shopInfo;
        const cs = managerList.find(item => item.roleId === 4);
        const url = `/pages/subpages/notice/chat/index?userId=${
          cs ? cs.userId : userId
        }&name=${cs ? cs.nickname : ownerName}&avatar=${
          cs ? cs.avatar : ownerAvatar
        }&productId=${scenicId}&productType=1`;
        wx.navigateTo({ url });
      });
    },

    confirm() {
      if (this.properties.onlyCheck) {
        this.hide();
      } else {
        store.setScenicPreOrderInfo(this.properties.info);
        wx.navigateTo({
          url: "/pages/subpages/mall/scenic/subpages/order-check/index"
        });
      }
    },

    hide() {
      this.triggerEvent("hide");
    }
  }
});

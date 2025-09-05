import { storeBindingsBehavior } from "mobx-miniprogram-bindings";
import { store } from "../../../store/index";

const { statusBarHeight } = getApp().globalData.systemInfo;

Component({
  behaviors: [storeBindingsBehavior],

  storeBindings: {
    store,
    fields: ["userInfo", "superiorInfo", "contactList"]
  },

  data: {
    statusBarHeight
  },

  pageLifetimes: {
    show() {
      store.setTabType("notice");
    }
  },

  methods: {
    chat(e) {
      const { friendId, friendName, friendAvatarUrl } =
        e.currentTarget.dataset.info;
      const url = `/pages/subpages/notice/chat/index?userId=${friendId}&name=${friendName}&avatar=${friendAvatarUrl}`;
      wx.navigateTo({ url });
    },

    deleteConversation(e) {
      const { id, index } = e.currentTarget.dataset;
      const { position, instance } = e.detail;
      if (position === "right") {
        wx.showModal({
          title: "提示",
          content: "确定删除该聊天列表吗？",
          showCancel: true,
          success: async res => {
            if (res.confirm) {
              addressService.deleteAddress(id, () => {
                const { contactList } = this.data;
                contactList.splice(index, 1);
                this.setData({ contactList });
                store.tim.deleteConversation(`C2C${id}`);
                instance.close();
              });
            } else {
              instance.close();
            }
          }
        });
      }
    }
  }
});

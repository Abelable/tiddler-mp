import { storeBindingsBehavior } from "mobx-miniprogram-bindings";
import { store } from "../../../../../../../store/index";
import HomeService from "../../../../utils/homeService";

const homeService = new HomeService();

Component({
  options: {
    addGlobalClass: true,
  },

  behaviors: [storeBindingsBehavior],

  storeBindings: {
    store,
    fields: ["activeMediaItem"],
  },

  properties: {
    item: Object,
  },

  data: {
    active: false,
    activeBgVisible: false,
  },

  observers: {
    activeMediaItem: function (info) {
      if (info) {
        const { id, top } = info;
        const { active } = this.data;
        if (id == this.properties.item.id) {
          const query = wx.createSelectorQuery().in(this);
          query.select(".live-item").boundingClientRect();
          query.exec((res) => {
            if (res[0].top === top) this.setData({ active: true });
            else if (active)
              this.setData({ active: false, activeBgVisible: false });
          });
        } else if (active)
          this.setData({ active: false, activeBgVisible: false });
      }
    },
  },

  methods: {
    statechange(e) {
      if (e.detail.code == 2004) {
        setTimeout(() => {
          this.setData({ activeBgVisible: true });
        }, 200);
      }
    },

    subscribe() {
      homeService.subscribeAnchor(this.properties.item.anchorInfo.id, () => {
        wx.showToast({
          title: "订阅成功",
          icon: "none",
        });
      });
    },
  },
});

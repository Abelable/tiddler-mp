import { store } from "../../../store/index";

Component({
  data: {
    rightsList: [
      { icon: "reward", name: "分享奖励" },
      { icon: "indirect", name: "间推奖励" },
      { icon: "team", name: "团队奖励" },
      { icon: "mentor", name: "专属导师" },
      { icon: "product", name: "专享产品" },
      { icon: "activity", name: "线下活动" },
      { icon: "trip", name: "文旅体验" },
      { icon: "meeting", name: "代言人大会" }
    ]
  },

  pageLifetimes: {
    show() {
      store.setTabType("promoter");
    }
  },

  methods: {
    onLoad() {
      wx.showShareMenu({
        withShareTicket: true,
        menus: ["shareAppMessage", "shareTimeline"]
      });
    },

    navToGiftPage() {
      wx.navigateTo({
        url: "/pages/subpages/gift/index"
      });
    },

    onShareAppMessage() {
      const { id } = store.superiorInfo || {};
      const path = id
        ? `/pages/tab-bar-pages/promoter/index?superiorId=${id}`
        : "/pages/tab-bar-pages/promoter/index";
      return { path };
    },

    onShareTimeline() {
      const { id } = store.superiorInfo || {};
      const query = id ? `superiorId=${id}` : "";
      return { query };
    }
  }
});

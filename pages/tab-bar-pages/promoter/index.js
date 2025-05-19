import { store } from "../../../store/index";

Component({
  data: {
    rightsList: [
      { icon: "commission", name: "购买返利" },
      { icon: "gift", name: "专享产品" },
      { icon: "culture", name: "专属社群文化" },
      { icon: "windmill", name: "文旅体验" },
      { icon: "group", name: "代言人大会" },
      { icon: "flag", name: "线下活动邀约" },
      { icon: "cs", name: "1v1服务团队" },
      { icon: "cake", name: "生日感谢礼" }
    ]
  },

  pageLifetimes: {
    show() {
      store.setTabType("promoter");
    }
  },

  methods: {
    navToGiftPage() {
      wx.navigateTo({
        url: "/pages/subpages/gift/index"
      });
    }
  }
});

import { store } from "../../../store/index";

const { statusBarHeight } = getApp().globalData.systemInfo;

Component({
  data: {
    statusBarHeight,
  },

  pageLifetimes: {
    show() {
      store.setTabType("promoter");
    }
  },
});

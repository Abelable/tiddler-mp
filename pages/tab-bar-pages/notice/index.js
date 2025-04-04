import { WEBVIEW_BASE_URL } from "../../../config";
import { store } from "../../../store/index";

const { statusBarHeight } = getApp().globalData.systemInfo;

Component({
  data: {
    statusBarHeight
  },

  pageLifetimes: {
    show() {
      store.setTabType("notice");
    },
  },

  methods: {
    onLoad() {
    },
  },
});

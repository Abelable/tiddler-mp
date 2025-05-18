import { store } from "../../../../store/index";
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    titleMenu: [],
    curTitleIdx: 0
  },

  onLoad() {
    this.setTitleMenu();
  },

  setTitleMenu() {
    const {
      scenicProviderId,
      hotelProviderId,
      cateringProviderId,
      merchantId
    } = store.userInfo;
    const titleMenu = [];
    if (scenicProviderId) {
      titleMenu.push({ name: "景区管理", type: 'scenic', value: 1 });
    }
    if (hotelProviderId) {
      titleMenu.push({ name: "酒店管理", type: 'hotel', value: 2 });
    }
    if (cateringProviderId) {
      titleMenu.push({ name: "餐饮管理", type: 'catering', value: 3 });
    }
    if (merchantId) {
      titleMenu.push({ name: "电商管理", type: 'goods', value: 4 });
    }
    this.setData({ titleMenu });
  },

  selectTitle(e) {
    const curTitleIdx = +e.detail.value;
    this.setData({ curTitleIdx });
  }
});

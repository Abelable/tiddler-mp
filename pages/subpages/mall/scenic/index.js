import { store } from "../../../../store/index";
import { checkLogin } from "../../../../utils/index";
import ScenicService from "./utils/scenicService";

const scenicService = new ScenicService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    curSortIndex: 0,
    sortOptions: [
      { icon: "", text: "综合排序", value: 0 },
      { icon: "", text: "好评排序", value: 1 },
      { icon: "", text: "价格降序", value: 2 },
      { icon: "", text: "价格升序", value: 3 }
    ],
    curCategoryId: 0,
    categoryOptions: [],
    scenicList: [],
    finished: false
  },

  async onLoad() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"]
    });

    if (!store.locationInfo) {
      await scenicService.getLocationInfo();
    }
    await this.setCategoryOptions();
    this.setScenicList(true);

    // todo 团圆家乡年
    checkLogin(() => {
      this.taskTimeout = setTimeout(() => {
        scenicService.finishTask(9);
      }, 15000);
    }, false);
  },

  async setCategoryOptions() {
    const options = await scenicService.getScenicCategoryOptions();
    const categoryOptions = [
      { icon: "", text: "全部分类", value: 0 },
      ...options.map(item => ({ icon: "", text: item.name, value: item.id }))
    ];
    this.setData({ categoryOptions });
  },

  setSortIndex(e) {
    const curSortIndex = Number(e.detail);
    this.setData({ curSortIndex }, () => {
      this.setScenicList(true);
    });
  },

  setCategoryId(e) {
    const curCategoryId = Number(e.detail);
    this.setData({ curCategoryId }, () => {
      this.setScenicList(true);
    });
  },

  async setScenicList(init = false) {
    const limit = 10;
    if (init) {
      this.page = 0;
      this.setData({
        finished: false
      });
    }
    const { curSortIndex, curCategoryId, scenicList } = this.data;
    let sort = "";
    let order = "desc";
    switch (curSortIndex) {
      case 1:
        sort = "score";
        break;
      case 2:
        sort = "price";
        break;
      case 3:
        sort = "price";
        order = "asc";
        break;
    }
    const list =
      (await scenicService.getScenicList({
        categoryId: curCategoryId,
        sort,
        order,
        page: ++this.page,
        limit
      })) || [];
    this.setData({
      scenicList: init ? list : [...scenicList, ...list]
    });
    if (list.length < limit) {
      this.setData({
        finished: true
      });
    }
  },

  onReachBottom() {
    this.setScenicList();
  },

  onPullDownRefresh() {
    this.setScenicList(true);
    wx.stopPullDownRefresh();
  },

  search() {
    wx.navigateTo({
      url: "/pages/subpages/common/search/index?scene=4"
    });
  },

  onUnload() {
    // todo 团圆家乡年
    if (this.taskTimeout) {
      clearTimeout(this.taskTimeout);
    }
  },

  onShareAppMessage() {
    const { id } = store.superiorInfo || {};
    const originalPath = "/pages/subpages/mall/scenic/index";
    const path = id ? `${originalPath}?superiorId=${id}` : originalPath;
    return {
      path,
      title: "千岛湖景点乐园",
      imageUrl: "https://static.tiddler.cn/mp/share_cover.png"
    };
  },

  onShareTimeline() {
    const { id } = store.superiorInfo || {};
    const query = id ? `superiorId=${id}` : "";
    return {
      query,
      title: "千岛湖景点乐园",
      imageUrl: "https://static.tiddler.cn/mp/share_cover.png"
    };
  }
});

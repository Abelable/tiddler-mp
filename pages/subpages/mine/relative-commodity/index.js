import { store } from "../../../../store";
import CommodityService from "./utils/commodityService";

const commodityService = new CommodityService();

Page({
  data: {
    curMenuIdx: 0,
    keywords: "",
    goodsList: [],
    goodsFinished: false,
    scenicList: [],
    scenicFinished: false,
    hotelList: [],
    hotelFinished: false,
    restaurantList: [],
    restaurantFinished: false
  },

  async onLoad() {
    await this.getUserRelativeCommodityIds();
    this.setList(true);
  },

  // todo 获取用户相关商品id数组
  async getUserRelativeCommodityIds() {
    this.relativeGoodsIds = [];
    this.relativeScenicIds = [];
    this.relativeHotelIds = [];
    this.relativeRestaurantIds = [];
  },

  onPullDownRefresh() {
    this.setList(true);
    wx.stopPullDownRefresh();
  },

  onReachBottom() {
    this.setList(false);
  },

  setList(init = false) {
    switch (this.data.curMenuIdx) {
      case 0:
        this.setScenicList(init);
        break;
      case 1:
        this.setHotelList(init);
        break;
      case 2:
        this.setRestaurantList(init);
        break;
      case 3:
        this.setGoodsList(init);
        break;
    }
  },

  toggleScenicSelected(e) {
    const { index } = e.currentTarget.dataset;
    const { scenicList } = this.data;
    this.setData({
      [`scenicList[${index}].selected`]: !scenicList[index].selected
    });
  },

  toggleHotelSelected(e) {
    const { index } = e.currentTarget.dataset;
    const { hotelList } = this.data;
    this.setData({
      [`hotelList[${index}].selected`]: !hotelList[index].selected
    });
  },

  toggleRestaurantSelected(e) {
    const { index } = e.currentTarget.dataset;
    const { restaurantList } = this.data;
    this.setData({
      [`restaurantList[${index}].selected`]: !restaurantList[index].selected
    });
  },

  toggleGoodsSelected(e) {
    const { index } = e.currentTarget.dataset;
    const { goodsList } = this.data;
    this.setData({
      [`goodsList[${index}].selected`]: !goodsList[index].selected
    });
  },

  confirm() {
    const { scenicList, hotelList, restaurantList, goodsList } = this.data;
    const selectedScenic = scenicList.filter(item => item.selected);
    const selectedHotel = hotelList.filter(item => item.selected);
    const selectedRestaurant = restaurantList.filter(item => item.selected);
    const selectedGoods = goodsList.filter(item => item.selected);
    const commodityList = [
      ...selectedScenic.map(({ id, name }) => ({ id, name, type: 1 })),
      ...selectedHotel.map(({ id, name }) => ({ id, name, type: 2 })),
      ...selectedRestaurant.map(({ id, name }) => ({ id, name, type: 3 })),
      ...selectedGoods.map(({ id, name }) => ({ id, name, type: 4 }))
    ];

    if (!commodityList.length) {
      wx.showToast({
        title: "请至少选择一个商品",
        icon: "none"
      });
      return;
    }

    store.setMediaCommodityList(commodityList);
    wx.navigateBack();
  },

  async setScenicList(init) {
    const { keywords, scenicList } = this.data;
    if (init) {
      this.scenicPage = 0;
      this.setData({ scenicFinished: false });
    }
    const { list = [] } =
      (await commodityService.getScenicList({
        scenicIds: this.relativeScenicIds,
        keywords,
        page: ++this.scenicPage
      })) || {};
    list = list.map(item => ({ ...item, selected: false }));
    this.setData({
      scenicList: init ? list : [...scenicList, ...list]
    });
    if (!list.length) {
      this.setData({ scenicFinished: true });
    }
  },

  async setHotelList(init) {
    const { keywords, hotelList } = this.data;
    if (init) {
      this.hotelPage = 0;
      this.setData({ hotelFinished: false });
    }
    const { list = [] } =
      (await commodityService.getHotelList({
        hotelIds: this.relativeHotelIds,
        keywords,
        page: ++this.hotelPage
      })) || {};
    list = list.map(item => ({ ...item, selected: false }));
    this.setData({
      hotelList: init ? list : [...hotelList, ...list]
    });
    if (!list.length) {
      this.setData({ hotelFinished: true });
    }
  },

  async setRestaurantList(init) {
    const { keywords, restaurantList } = this.data;
    if (init) {
      this.restaurantPage = 0;
      this.setData({ restaurantFinished: false });
    }
    const { list = [] } =
      (await commodityService.getRestaurantList({
        restaurantIds: this.relativeRestaurantIds,
        keywords,
        page: ++this.restaurantPage
      })) || {};
    list = list.map(item => ({ ...item, selected: false }));
    this.setData({
      restaurantList: init ? list : [...restaurantList, ...list]
    });
    if (!list.length) {
      this.setData({ restaurantFinished: true });
    }
  },

  async setGoodsList(init) {
    const { keywords, goodsList } = this.data;
    if (init) {
      this.goodsPage = 0;
      this.setData({ goodsFinished: false });
    }
    const { list = [] } =
      (await commodityService.getGoodsList({
        goodsIds: this.relativeGoodsIds,
        keywords,
        page: ++this.goodsPage
      })) || {};
    list = list.map(item => ({ ...item, selected: false }));
    this.setData({
      goodsList: init ? list : [...goodsList, ...list]
    });
    if (!list.length) {
      this.setData({ goodsFinished: true });
    }
  }
});

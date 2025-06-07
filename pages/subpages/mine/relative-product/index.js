import { store } from "../../../../store/index";
import {
  TYPE_OF_GOODS,
  TYPE_OF_HOTEL,
  TYPE_OF_RESTAURANT,
  TYPE_OF_SCENIC
} from "../../../../utils/emuns/productType";
import ProductService from "./utils/productService";

const productService = new ProductService();

Page({
  data: {
    curMenuIdx: 0,
    keywords: "",
    scenicList: [],
    scenicFinished: false,
    hotelList: [],
    hotelFinished: false,
    restaurantList: [],
    restaurantFinished: false,
    goodsList: [],
    goodsFinished: false
  },

  async onLoad() {
    this.selectedScenicIds = store.mediaProductList
      .filter(item => item.type === TYPE_OF_SCENIC)
      .map(item => item.id);
    this.selectedHotelIds = store.mediaProductList
      .filter(item => item.type === TYPE_OF_HOTEL)
      .map(item => item.id);
    this.selectedRestaurantIds = store.mediaProductList
      .filter(item => item.type === TYPE_OF_RESTAURANT)
      .map(item => item.id);
    this.selectedGoodsIds = store.mediaProductList
      .filter(item => item.type === TYPE_OF_GOODS)
      .map(item => item.id);

    await this.getUserRelativeProductIds();
    this.setList(true);
  },

  setKeywords(e) {
    const keywords = e.detail.value;
    this.setData({ keywords });
  },

  cancelSearch() {
    this.setData({ keywords: "" });
    this.setList(true);
  },

  search() {
    if (!this.data.keywords) {
      wx.showToast({
        title: "请输入搜索关键字",
        icon: "none"
      });
    }
    this.setList(true);
  },

  selectMenu(e) {
    const curMenuIdx = Number(e.currentTarget.dataset.index);
    this.setData({ curMenuIdx });

    const { hotelList, restaurantList, goodsList } = this.data;
    if (
      (curMenuIdx === 1 && !hotelList.length) ||
      (curMenuIdx === 2 && !restaurantList.length) ||
      (curMenuIdx === 3 && !goodsList.length)
    ) {
      this.setList(true);
    }
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
    const productList = [
      ...selectedScenic.map(item => ({ ...item, type: TYPE_OF_SCENIC })),
      ...selectedHotel.map(item => ({ ...item, type: TYPE_OF_HOTEL })),
      ...selectedRestaurant.map(item => ({
        ...item,
        type: TYPE_OF_RESTAURANT
      })),
      ...selectedGoods.map(item => ({ ...item, type: TYPE_OF_GOODS }))
    ];

    if (!productList.length) {
      wx.showToast({
        title: "请至少选择一个商品",
        icon: "none"
      });
      return;
    }

    store.setMediaProductList(productList);
    wx.navigateBack();
  },

  // todo 获取用户相关商品id数组
  async getUserRelativeProductIds() {
    this.relativeScenicIds = [];
    this.relativeHotelIds = [];
    this.relativeRestaurantIds = [];
    this.relativeGoodsIds = [];
  },

  async setScenicList(init) {
    const { keywords, scenicList } = this.data;
    if (init) {
      this.scenicPage = 0;
      this.setData({ scenicFinished: false });
    }
    let { list = [] } =
      (await productService.getScenicList({
        scenicIds: this.relativeScenicIds,
        keywords,
        page: ++this.scenicPage
      })) || {};
    list = list.map(item => ({
      ...item,
      selected: this.selectedScenicIds.includes(item.id)
    }));
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
    let { list = [] } =
      (await productService.getHotelList({
        hotelIds: this.relativeHotelIds,
        keywords,
        page: ++this.hotelPage
      })) || {};
    list = list.map(item => ({
      ...item,
      selected: this.selectedHotelIds.includes(item.id)
    }));
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
    let { list = [] } =
      (await productService.getRestaurantList({
        restaurantIds: this.relativeRestaurantIds,
        keywords,
        page: ++this.restaurantPage
      })) || {};
    list = list.map(item => ({
      ...item,
      selected: this.selectedRestaurantIds.includes(item.id)
    }));
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
    let { list = [] } =
      (await productService.getGoodsList({
        goodsIds: this.relativeGoodsIds,
        keywords,
        page: ++this.goodsPage
      })) || {};
    list = list.map(item => ({
      ...item,
      selected: this.selectedGoodsIds.includes(item.id)
    }));
    this.setData({
      goodsList: init ? list : [...goodsList, ...list]
    });
    if (!list.length) {
      this.setData({ goodsFinished: true });
    }
  }
});

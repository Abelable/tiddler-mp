import { store } from "../../../../../store/index";
import { calcDistance } from "../../../../../utils/index";
import HomeService from "../../utils/homeService";

const homeService = new HomeService();

Component({
  properties: {
    item: Object
  },

  data: {
    distance: "",
    mediaList: []
  },

  lifetimes: {
    attached() {
      this.setDistance();
      this.setMediaList();
    }
  },

  methods: {
    setDistance() {
      const { longitude: lo1 = 0, latitude: la1 = 0 } =
        store.locationInfo || {};
      const { longitude: lo2, latitude: la2 } = this.properties.item;
      const distance = lo1 ? calcDistance(la1, lo1, la2, lo2) : 0;
      this.setData({ distance });
    },

    async setMediaList() {
      const { id, type } = this.properties.item;
      const { list: mediaList = [] } =
        (await homeService.getRelativeMediaList(type, id, 1)) || {};
      this.setData({ mediaList });
    },

    checkDetail() {
      const { id, type } = this.properties.item;
      const pathList = [
        "/pages/subpages/mall/scenic/subpages/scenic-detail/index",
        "/pages/subpages/mall/hotel/subpages/hotel-detail/index",
        "/pages/subpages/mall/catering/subpages/restaurant-detail/index"
      ];
      const url = `${pathList[type - 1]}?id=${id}`;
      wx.navigateTo({ url });
    }
  }
});

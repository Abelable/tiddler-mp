import {
  TYPE_OF_GOODS,
  TYPE_OF_HOTEL,
  TYPE_OF_RESTAURANT,
  TYPE_OF_SCENIC
} from "../../utils/emuns/commodityType";

Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    list: Array
  },

  methods: {
    checkDetail(e) {
      const { type, id } = e.currentTarget.dataset;
      let url;
      switch (type) {
        case TYPE_OF_SCENIC:
          url = `/pages/subpages/mall/scenic/subpages/scenic-detail/index?id=${id}`;
          break;

        case TYPE_OF_HOTEL:
          url = `/pages/subpages/mall/hotel/subpages/hotel-detail/index?id=${id}`;
          break;

        case TYPE_OF_RESTAURANT:
          url = `/pages/subpages/mall/catering/subpages/restaurant-detail/index?id=${id}`;
          break;
          
        case TYPE_OF_GOODS:
          url = `/pages/subpages/mall/goods/subpages/goods-detail/index?id=${id}`;
          break;
      }
      wx.navigateTo({ url });
    }
  }
});

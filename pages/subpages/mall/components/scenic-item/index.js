import { store } from "../../../../../store/index";
import { calcDistance } from "../../../../../utils/index";

Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    info: {
      type: Object,
      observer(info) {
        if (info) {
          const { longitude: lo1 = 0, latitude: la1 = 0 } = store.locationInfo || {};
          const { longitude: lo2, latitude: la2 } = info;
          const distance = lo1 ? calcDistance(la1, lo1, la2, lo2) : 0;
          this.setData({ distance });
        }
      },
    },
  },

  data: {
    distance: "",
  },

  methods: {
    checkDetail() {
      const { id } = this.properties.info;
      const url = `/pages/subpages/mall/scenic/subpages/scenic-detail/index?id=${id}`;
      wx.navigateTo({ url });
    },
  },
});

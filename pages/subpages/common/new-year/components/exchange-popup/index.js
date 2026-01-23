import NewYearService from "../../utils/newYearService";

const newYearService = new NewYearService();

Component({
  properties: {
    show: {
      type: Boolean,
      observer(truthy) {
        if (truthy) {
          this.setGoodsList(true);
        }
      }
    }
  },

  data: {
    goodsList: [],
    selectedIndex: 0
  },

  methods: {
    loadMore() {
      this.setGoodsList();
    },

    async setGoodsList(init = false) {
      if (init) this.page = 0;
      const { list = [] } =
        (await newYearService.getUserGoodsList(++this.page)) || {};
      this.setData({
        goodsList: init ? list : [...this.data.goodsList, ...list]
      });
    },

    checkShippingInfo(e) {
      const { shipCode, shipSn, mobile } = e.currentTarget.dataset.goods;
      const url = `/pages/subpages/common/shipping/index?shipCode=${shipCode}&shipSn=${shipSn}&mobile=${mobile}`;
      wx.navigateTo({ url });
    },

    hide() {
      this.triggerEvent("hide");
    }
  }
});

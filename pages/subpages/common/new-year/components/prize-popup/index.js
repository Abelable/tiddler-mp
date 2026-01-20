import NewYearService from "../../utils/newYearService";

const newYearService = new NewYearService();

Component({
  properties: {
    show: {
      type: Boolean,
      observer(truthy) {
        if (truthy) {
          this.setPrizeList();
        }
      }
    }
  },

  data: {
    prizeList: [],
    selectedIndex: 0
  },

  methods: {
    async setPrizeList(init = false) {
      if (init) this.page = 0;
      const { list = [] } =
        (await newYearService.getPrizeList(++this.page)) || {};
      const handleList = list.map(item => {
        const { prizeType, status } = item;
        let btnDesc = "";
        if (prizeType === 2) {
          btnDesc = status ? "已使用" : "去使用";
        } else if (prizeType === 3) {
          btnDesc = status ? "已领取" : "去领取";
        }
        return {
          ...item,
          btnDesc
        };
      });
      this.setData({
        prizeList: init ? handleList : [...this.data.prizeList, ...handleList]
      });
    },

    use(e) {
      const { type, id } = e.currentTarget.dataset;
      if (type === 2) {
        const url = `/pages/subpages/mall/goods/subpages/goods-detail/index?id=${id}`;
        wx.navigateTo({ url });
      }
      if (type === 3) {
        // 兑换奖品
      }
    },

    hide() {
      this.triggerEvent("hide");
    }
  }
});

import NewYearService from "../../utils/newYearService";

const newYearService = new NewYearService();

Component({
  properties: {
    show: {
      type: Boolean,
      observer(truthy) {
        if (truthy) {
          this.setPrizeList(true);
        }
      }
    }
  },

  data: {
    prizeList: [],
    selectedIndex: 0
  },

  methods: {
    loadMore() {
      this.setPrizeList();
    },

    async setPrizeList(init = false) {
      if (init) this.page = 0;
      const { list = [] } =
        (await newYearService.getUserPrizeList(++this.page)) || {};
      const handleList = list.map(item => {
        const { prizeType, status } = item;
        let btnDesc = "";
        let btnStatus = 1;
        if (prizeType === 2) {
          btnDesc = status ? "已使用" : "去使用";
          if (status) btnStatus = 0;
        } else if (prizeType === 3) {
          btnDesc = ["去领取", "待发货", "查看物流", "已签收"][status];
        }
        return {
          ...item,
          btnDesc,
          btnStatus
        };
      });
      this.setData({
        prizeList: init ? handleList : [...this.data.prizeList, ...handleList]
      });
    },

    use(e) {
      const { id, status, type, goodsId, shipCode, shipSn, mobile } =
        e.currentTarget.dataset.prize;

      if (type === 2) {
        if (status) return;
        if (goodsId) {
          const url = `/pages/subpages/mall/goods/subpages/goods-detail/index?id=${goodsId}`;
          wx.navigateTo({ url });
        } else {
          wx.navigateTo({
            url: "/pages/subpages/mall/goods/index"
          });
        }
      } else if (type === 3) {
        switch (status) {
          case 0:
            this.triggerEvent("receive", { id });
            break;

          case 1:
            wx.showModal({
              title: "若长时间未发货，请联系官方客服",
              showCancel: false,
              confirmText: "确定",
              confirmColor: "#3d099a"
            });
            break;

          case 2:
          case 3:
            const url = `/pages/subpages/common/shipping/index?shipCode=${shipCode}&shipSn=${shipSn}&mobile=${mobile}`;
            wx.navigateTo({ url });
            break;
        }
      }
    },

    hide() {
      this.triggerEvent("hide");
    }
  }
});

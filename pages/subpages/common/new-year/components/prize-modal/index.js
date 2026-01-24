const goodsMap = [
  { id: 3, cover: "caviar" },
  { id: 5, cover: "stick" },
  { id: 6, cover: "noodle" }
];

Component({
  properties: {
    info: {
      type: Object,
      observer(info) {
        const { id, type } = info;

        let cover = "";
        if (id) {
          switch (type) {
            case 1:
              cover = "luck";
              break;
            case 2:
              cover = "coupon";
              break;
            case 3:
              cover = goodsMap.find(item => item.id === id).cover;
              break;
          }
        } else {
          cover = "thanks";
        }

        let btnDescIdx;
        if (id === 0) {
          btnDescIdx = 4;
        } else {
          switch (type) {
            case 1:
              btnDescIdx = 1;
              break;
            case 2:
              btnDescIdx = 2;
              break;
            case 3:
              btnDescIdx = 3;
              break;
          }
        }

        this.setData({ cover, btnDescIdx });
      }
    }
  },

  data: {
    cover: "",
    btnDescIdx: 0
  },

  methods: {
    receive() {
      const { id, type, goodsId } = this.properties.info;
      if (id) {
        switch (type) {
          case 2:
            if (goodsId) {
              wx.navigateTo({
                url: `/pages/subpages/mall/goods/subpages/goods-detail/index?id=${goodsId}`
              });
            } else {
              wx.navigateTo({
                url: "/pages/subpages/mall/goods/index"
              });
            }
            break;

          case 3:
            this.triggerEvent("receive", { id });
            break;
        }
      }
      this.hide();
    },

    hide() {
      this.triggerEvent("hide");
    },

    catchtap() {}
  }
});

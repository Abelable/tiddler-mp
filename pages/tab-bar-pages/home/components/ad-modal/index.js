Component({
  properties: {
    info: Object
  },

  methods: {
    linkTo() {
      const { scene, param } = this.properties.info || {};
      if (scene) {
        switch (scene) {
          case 1:
            wx.navigateTo({
              url: `/pages/subpages/mall/scenic/subpages/scenic-detail/index?id=${param}`
            });
            break;
          case 2:
            wx.navigateTo({
              url: `/pages/subpages/mall/hotel/subpages/hotel-detail/index?id=${param}`
            });
            break;
          case 3:
            wx.navigateTo({
              url: `/pages/subpages/mall/catering/subpages/restaurant-detail/index?id=${param}`
            });
            break;
          case 4:
            wx.navigateTo({
              url: `/pages/subpages/mall/goods/subpages/goods-detail/index?id=${param}`
            });
            break;
          case 5:
            wx.navigateTo({
              url: `/pages/subpages/common/webview/index?url=${param}`
            });
            break;
          case 6:
            wx.navigateTo({ url: '/pages/subpages/common/new-year/index' });
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
